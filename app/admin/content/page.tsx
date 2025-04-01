"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Edit, Eye, FileText, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PermissionGate } from "@/components/auth/permission-gate";

interface Program {
	id: string;
	title: string;
	slug: string;
	status: string;
	category: {
		name: string;
	} | null;
	createdAt: string;
}

export default function ContentManagementPage() {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		fetchPrograms();
	}, [currentPage, searchQuery]);

	const fetchPrograms = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/programs?page=${currentPage}&limit=10${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch programs");
			}

			const data = await response.json();
			console.log(data, " this is data");
			setPrograms(data || []);
			setTotalPages(data.totalPages || 1);
		} catch (error) {
			console.error("Error fetching programs:", error);
			toast({
				title: "Error",
				description: "Failed to load programs",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1); // Reset to first page on new search
		fetchPrograms();
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const columns = [
		{
			key: "title",
			title: "Title",
			render: (program: Program) => (
				<div className="flex items-center gap-2">
					<FileText className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium">{program.title}</span>
				</div>
			),
		},
		{
			key: "category",
			title: "Category",
			render: (program: Program) => (
				<span>{program.category?.name || "Uncategorized"}</span>
			),
		},
		{
			key: "status",
			title: "Status",
			render: (program: Program) => (
				<Badge
					variant={program.status === "PUBLISHED" ? "default" : "secondary"}
				>
					{program.status}
				</Badge>
			),
		},
		{
			key: "createdAt",
			title: "Created",
			render: (program: Program) =>
				new Date(program.createdAt).toLocaleDateString(),
		},
		{
			key: "actions",
			title: "Actions",
			render: (program: Program) => (
				<div className="flex gap-2">
					<Button variant="outline" size="icon" asChild>
						<Link href={`/programs/${program.slug}`}>
							<Eye className="h-4 w-4" />
							<span className="sr-only">View</span>
						</Link>
					</Button>

					<PermissionGate permission="edit:content">
						<Button variant="outline" size="icon" asChild>
							<Link href={`/admin/content/edit/${program.id}`}>
								<Edit className="h-4 w-4" />
								<span className="sr-only">Edit</span>
							</Link>
						</Button>
					</PermissionGate>

					<PermissionGate permission="delete:content">
						<Button variant="outline" size="icon">
							<Trash className="h-4 w-4" />
							<span className="sr-only">Delete</span>
						</Button>
					</PermissionGate>
				</div>
			),
		},
	];

	if (isLoading) {
		return <AdminLoading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">
					Content Management
				</h1>
				<div className="flex gap-2">
					<Link href="/admin/content/categories">
						<Button variant="outline">Categories</Button>
					</Link>

					<PermissionGate permission="edit:content">
						<Link href="/admin/content/new">
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								New Program
							</Button>
						</Link>
					</PermissionGate>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<form
					onSubmit={handleSearch}
					className="flex w-full max-w-sm items-center space-x-2"
				>
					<Input
						type="search"
						placeholder="Search programs..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Button type="submit">Search</Button>
				</form>
			</div>

			<DataTable
				data={programs}
				columns={columns}
				pagination={{
					currentPage,
					totalPages,
					onPageChange: handlePageChange,
				}}
			/>
		</div>
	);
}
