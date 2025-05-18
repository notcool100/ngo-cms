"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	Twitter,
	Linkedin,
	Instagram,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import type { TeamMember } from "@/lib/interfaces/about.interface";

// Extended interface to include hierarchy information
interface HierarchicalTeamMember extends TeamMember {
	parentId?: number | null;
	children: HierarchicalTeamMember[];
	level?: number;
	expanded?: boolean;
}

export function TeamHierarchy({ teamMembers }: { teamMembers: TeamMember[] }) {
	const [hierarchyData, setHierarchyData] = useState<HierarchicalTeamMember[]>(
		[],
	);
	const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>(
		{},
	);

	useEffect(() => {
		if (teamMembers && teamMembers.length > 0) {
			// Convert flat array to hierarchical structure
			const hierarchical = buildHierarchy(teamMembers);
			setHierarchyData(hierarchical);

			// Initialize all nodes as expanded
			const initialExpanded: Record<number, boolean> = {};
			for (const member of hierarchical) {
				initialExpanded[member.id] = true;
			}
			setExpandedNodes(initialExpanded);
		}
	}, [teamMembers]);

	// Function to build hierarchy from flat array using parentId
	const buildHierarchy = (members: TeamMember[]): HierarchicalTeamMember[] => {
		const hierarchicalMembers = members.map((member) => ({
			...member,
			children: [],
			expanded: true,
		})) as HierarchicalTeamMember[];

		// Create a map for quick lookup
		const memberMap: Record<number, HierarchicalTeamMember> = {};
		for (const member of hierarchicalMembers) {
			memberMap[member.id] = member;
		}

		// Build the tree structure
		const rootNodes: HierarchicalTeamMember[] = [];

		for (const member of hierarchicalMembers) {
			if (member.parentId && memberMap[member.parentId]) {
				if (!memberMap[member.parentId].children) {
					memberMap[member.parentId].children = [];
				}
				memberMap[member.parentId].children.push(member);
			} else {
				rootNodes.push(member);
			}
		}

		// Sort nodes by order
		const sortNodes = (nodes: HierarchicalTeamMember[]) => {
			nodes.sort((a, b) => a.order - b.order);
			for (const node of nodes) {
				if (node.children && node.children.length > 0) {
					sortNodes(node.children);
				}
			}
		};

		sortNodes(rootNodes);
		return rootNodes;
	};

	const toggleExpand = (id: number) => {
		setExpandedNodes((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const renderTeamMember = (member: HierarchicalTeamMember, level = 0) => {
		const hasChildren = member.children && member.children.length > 0;
		const isExpanded = expandedNodes[member.id];

		return (
			<div
				key={member.id}
				className={`relative ${level > 0 ? "ml-8 mt-4" : "mt-4"}`}
			>
				{/* Vertical line from parent */}
				{level > 0 && (
					<div className="absolute left-0 top-0 h-full w-px bg-gray-200 -translate-x-4" />
				)}

				{/* Horizontal line to current node */}
				{level > 0 && (
					<div className="absolute left-0 top-1/2 w-4 h-px bg-gray-200 -translate-x-4" />
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className={`relative bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 ${
						hasChildren ? "mb-4" : ""
					}`}
				>
					<div className="flex items-center p-6">
						{/* Profile Image */}
						<div className="relative h-20 w-20 flex-shrink-0">
							<Image
								src={
									member.image ||
									`/placeholder.svg?height=80&width=80&text=${member.name}`
								}
								alt={member.name}
								fill
								className="object-cover rounded-full border-4 border-white shadow-md"
							/>
						</div>

						{/* Member Info */}
						<div className="ml-6 flex-grow">
							<h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
							<p className="text-primary font-medium">{member.position}</p>
							<p className="text-gray-600 text-sm mt-1 line-clamp-2">
								{member.bio}
							</p>

							{/* Social Links */}
							{member.socialLinks && (
								<div className="flex gap-3 mt-2">
									{member.socialLinks.twitter && (
										<a
											href={member.socialLinks.twitter}
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 hover:text-primary transition-colors"
										>
											<Twitter className="h-4 w-4" />
										</a>
									)}
									{member.socialLinks.linkedin && (
										<a
											href={member.socialLinks.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 hover:text-primary transition-colors"
										>
											<Linkedin className="h-4 w-4" />
										</a>
									)}
									{member.socialLinks.instagram && (
										<a
											href={member.socialLinks.instagram}
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 hover:text-primary transition-colors"
										>
											<Instagram className="h-4 w-4" />
										</a>
									)}
								</div>
							)}
						</div>

						{/* Expand/Collapse Button */}
						{hasChildren && (
							<button
								type="button"
								onClick={() => toggleExpand(member.id)}
								className="ml-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								{isExpanded ? (
									<ChevronUp className="h-5 w-5 text-gray-600" />
								) : (
									<ChevronDown className="h-5 w-5 text-gray-600" />
								)}
							</button>
						)}
					</div>
				</motion.div>

				{/* Children */}
				{hasChildren && isExpanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="pl-4"
					>
						<div className="space-y-4">
							{member.children.map((child) =>
								renderTeamMember(child, level + 1),
							)}
						</div>
					</motion.div>
				)}
			</div>
		);
	};

	if (!hierarchyData || hierarchyData.length === 0) {
		return <div className="text-center py-12">Loading team hierarchy...</div>;
	}

	return (
		<div className="w-full">
			<div className="space-y-6">
				{hierarchyData.map((member) => renderTeamMember(member))}
			</div>
		</div>
	);
}
