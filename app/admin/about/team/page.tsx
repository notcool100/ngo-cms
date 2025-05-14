"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@prisma/client";

export default function TeamMembersPage() {
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("staff");
	const router = useRouter();
	const { toast } = useToast();

	// Form state for new/edit team member
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({
		name: "",
		position: "",
		bio: "",
		image: "",
		socialLinks: {},
		order: 0,
		active: true,
		teamType: "STAFF",
	});

	useEffect(() => {
		fetchTeamMembers();
	}, []);

	async function fetchTeamMembers() {
		try {
			setLoading(true);
			const response = await fetch("/api/about/team");
			if (response.ok) {
				const data = await response.json();
				setTeamMembers(data);
			} else {
				toast({
					title: "Error",
					description: "Failed to fetch team members",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error fetching team members:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}

	function handleAddMember() {
		setIsEditing(false);
		setCurrentMember({
			name: "",
			position: "",
			bio: "",
			image: "",
			socialLinks: {},
			order: teamMembers.length + 1,
			active: true,
			teamType: activeTab.toUpperCase(),
		});
		setIsDialogOpen(true);
	}

	function handleEditMember(member: TeamMember) {
		setIsEditing(true);
		setCurrentMember({
			...member,
			socialLinks: member.socialLinks || {},
		});
		setIsDialogOpen(true);
	}

	async function handleSaveMember() {
		try {
			const url = isEditing
				? `/api/about/team/${currentMember.id}`
				: "/api/about/team";

			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(currentMember),
			});

			if (response.ok) {
				toast({
					title: "Success",
					description: `Team member ${isEditing ? "updated" : "added"} successfully`,
				});
				setIsDialogOpen(false);
				fetchTeamMembers();
			} else {
				const error = await response.json();
				toast({
					title: "Error",
					description:
						error.message ||
						`Failed to ${isEditing ? "update" : "add"} team member`,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error saving team member:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		}
	}

	async function handleDeleteMember(id: number) {
		if (!confirm("Are you sure you want to delete this team member?")) {
			return;
		}

		try {
			const response = await fetch(`/api/about/team/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast({
					title: "Success",
					description: "Team member deleted successfully",
				});
				fetchTeamMembers();
			} else {
				const error = await response.json();
				toast({
					title: "Error",
					description: error.message || "Failed to delete team member",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error deleting team member:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		}
	}

	function handleInputChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		const { name, value } = e.target;
		setCurrentMember((prev) => ({ ...prev, [name]: value }));
	}

	function handleSocialLinksChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setCurrentMember((prev) => ({
			...prev,
			socialLinks: {
				...(prev.socialLinks as any),
				[name]: value,
			},
		}));
	}

	function handleSwitchChange(checked: boolean) {
		setCurrentMember((prev) => ({ ...prev, active: checked }));
	}

	function handleImageUpload(url: string) {
		setCurrentMember((prev) => ({ ...prev, image: url }));
	}

	function handleTeamTypeChange(value: string) {
		setCurrentMember((prev) => ({ ...prev, teamType: value }));
	}

	const filteredMembers = teamMembers.filter(
		(member) => member.teamType === activeTab.toUpperCase(),
	);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
					<p className="text-muted-foreground">
						Manage your organization's team members
					</p>
				</div>
				<Button onClick={handleAddMember}>Add Team Member</Button>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2 mb-8">
					<TabsTrigger value="staff">Office Team</TabsTrigger>
					<TabsTrigger value="board">Board Members</TabsTrigger>
				</TabsList>

				<TabsContent value="staff" className="space-y-4">
					{loading ? (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						</div>
					) : filteredMembers.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredMembers.map((member) => (
								<TeamMemberCard
									key={member.id}
									member={member}
									onEdit={() => handleEditMember(member)}
									onDelete={() => handleDeleteMember(member.id)}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12 border rounded-lg bg-muted/10">
							<p className="text-muted-foreground">No team members found.</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={handleAddMember}
							>
								Add Your First Team Member
							</Button>
						</div>
					)}
				</TabsContent>

				<TabsContent value="board" className="space-y-4">
					{loading ? (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						</div>
					) : filteredMembers.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredMembers.map((member) => (
								<TeamMemberCard
									key={member.id}
									member={member}
									onEdit={() => handleEditMember(member)}
									onDelete={() => handleDeleteMember(member.id)}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12 border rounded-lg bg-muted/10">
							<p className="text-muted-foreground">No board members found.</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={handleAddMember}
							>
								Add Your First Board Member
							</Button>
						</div>
					)}
				</TabsContent>
			</Tabs>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{isEditing ? "Edit Team Member" : "Add Team Member"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update the details of this team member"
								: "Add a new team member to your organization"}
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									value={currentMember.name || ""}
									onChange={handleInputChange}
									placeholder="John Doe"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="position">Position</Label>
								<Input
									id="position"
									name="position"
									value={currentMember.position || ""}
									onChange={handleInputChange}
									placeholder="CEO"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="teamType">Member Type</Label>
								<Select
									value={currentMember.teamType || "STAFF"}
									onValueChange={handleTeamTypeChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select member type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="STAFF">Office Team</SelectItem>
										<SelectItem value="BOARD">Board Member</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="order">Display Order</Label>
								<Input
									id="order"
									name="order"
									type="number"
									value={currentMember.order?.toString() || "0"}
									onChange={handleInputChange}
									placeholder="1"
								/>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									id="active"
									checked={currentMember.active}
									onCheckedChange={handleSwitchChange}
								/>
								<Label htmlFor="active">Active</Label>
							</div>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Profile Image</Label>
								<ImageUpload
									value={currentMember.image || ""}
									onChange={handleImageUpload}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									name="bio"
									value={currentMember.bio || ""}
									onChange={handleInputChange}
									placeholder="Brief biography"
									rows={4}
								/>
							</div>
						</div>
					</div>

					<div className="space-y-4 mt-4">
						<h3 className="text-lg font-medium">Social Links</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="facebook">Facebook</Label>
								<Input
									id="facebook"
									name="facebook"
									value={(currentMember.socialLinks as any)?.facebook || ""}
									onChange={handleSocialLinksChange}
									placeholder="https://facebook.com/username"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="twitter">Twitter</Label>
								<Input
									id="twitter"
									name="twitter"
									value={(currentMember.socialLinks as any)?.twitter || ""}
									onChange={handleSocialLinksChange}
									placeholder="https://twitter.com/username"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="linkedin">LinkedIn</Label>
								<Input
									id="linkedin"
									name="linkedin"
									value={(currentMember.socialLinks as any)?.linkedin || ""}
									onChange={handleSocialLinksChange}
									placeholder="https://linkedin.com/in/username"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									value={(currentMember.socialLinks as any)?.email || ""}
									onChange={handleSocialLinksChange}
									placeholder="john@example.com"
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveMember}>
							{isEditing ? "Update" : "Add"} Team Member
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

interface TeamMemberCardProps {
	member: TeamMember;
	onEdit: () => void;
	onDelete: () => void;
}

function TeamMemberCard({ member, onEdit, onDelete }: TeamMemberCardProps) {
	return (
		<Card>
			<CardHeader className="relative pb-0">
				<div className="absolute right-4 top-4 flex space-x-1">
					<Button variant="ghost" size="icon" onClick={onEdit}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
							<path d="m15 5 4 4" />
						</svg>
						<span className="sr-only">Edit</span>
					</Button>
					<Button variant="ghost" size="icon" onClick={onDelete}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="M3 6h18" />
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
							<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
						</svg>
						<span className="sr-only">Delete</span>
					</Button>
				</div>
				<div className="flex justify-center">
					<div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-muted">
						{member.image ? (
							<img
								src={member.image}
								alt={member.name}
								className="object-cover w-full h-full"
							/>
						) : (
							<div className="w-full h-full bg-muted flex items-center justify-center">
								<span className="text-4xl font-bold text-muted-foreground">
									{member.name.charAt(0)}
								</span>
							</div>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="text-center pt-4">
				<CardTitle>{member.name}</CardTitle>
				<CardDescription>{member.position}</CardDescription>
				<div className="mt-2">
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
							member.active
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{member.active ? "Active" : "Inactive"}
					</span>
					<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 ml-2">
						{member.teamType === "BOARD" ? "Board" : "Staff"}
					</span>
				</div>
				<p className="mt-4 text-sm text-muted-foreground line-clamp-3">
					{member.bio}
				</p>
			</CardContent>
			<CardFooter className="flex justify-center space-x-4 pt-0">
				{member.socialLinks && typeof member.socialLinks === "object" && (
					<>
						{(member.socialLinks as any).facebook && (
							<a
								href={(member.socialLinks as any).facebook}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
							</a>
						)}
						{(member.socialLinks as any).twitter && (
							<a
								href={(member.socialLinks as any).twitter}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
								</svg>
							</a>
						)}
						{(member.socialLinks as any).linkedin && (
							<a
								href={(member.socialLinks as any).linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
									<rect width="4" height="12" x="2" y="9" />
									<circle cx="4" cy="4" r="2" />
								</svg>
							</a>
						)}
						{(member.socialLinks as any).email && (
							<a
								href={`mailto:${(member.socialLinks as any).email}`}
								className="text-muted-foreground hover:text-primary"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<rect width="20" height="16" x="2" y="4" rx="2" />
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
								</svg>
							</a>
						)}
					</>
				)}
			</CardFooter>
		</Card>
	);
}
