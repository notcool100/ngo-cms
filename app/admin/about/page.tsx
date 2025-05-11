"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash, Edit, Save } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,																																																																																																																																																					
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import dynamic from "next/dynamic";
import { ImageUpload } from "@/components/admin/image-upload";

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
	ssr: false,
	loading: () => (
		<div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
	),
});																																																																													

// Types for the about page data
interface TeamMember {
	id: number;
	name: string;
	position: string;
	bio: string;
	image: string;
	socialLinks?: {
		twitter?: string;
		linkedin?: string;
		instagram?: string;
	};
	order: number;
	active: boolean;
	parentId?: number | null;
}

interface AboutSection {
	id: number;
	title: string;
	subtitle?: string;
	content: string;
	image?: string;
	order: number;
	type: string;
	active: boolean;
}

interface AboutPageData {
	sections: AboutSection[];
	team: TeamMember[];
}

export default function AdminAboutPage() {
	const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("sections");
	const [editingSection, setEditingSection] = useState<AboutSection | null>(
		null,
	);
	const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(
		null,
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const fetchAboutData = async () => {
			try {
				const response = await fetch("/api/admin/about");
				if (!response.ok) {
					throw new Error("Failed to fetch about data");
				}
				const responseData = await response.json();
				
				// Check if the data is in the expected format
				if (responseData.data) {
					setAboutData(responseData.data);
				} else {
					console.error("Unexpected data format:", responseData);
					toast({
						title: "Error",
						description: "Received unexpected data format from server",
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("Error fetching about data:", error);
				toast({
					title: "Error",
					description: "Failed to load about page data",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchAboutData();
	}, [toast]);

	const handleCreateSection = () => {
		setEditingSection({
			id: 0,
			title: "",
			content: "",
			order: aboutData?.sections?.length || 0,
			type: "mission",
			active: true,
		});
		setIsDialogOpen(true);
	};

	const handleEditSection = (section: AboutSection) => {
		setEditingSection(section);
		setIsDialogOpen(true);
	};

	const handleCreateTeamMember = () => {
		setEditingTeamMember({
			id: 0,
			name: "",
			position: "",
			bio: "",
			image: "",
			order: aboutData?.team?.length || 0,
			active: true,
			socialLinks: {
				twitter: "",
				linkedin: "",
				instagram: "",
			},
		});
		setIsDialogOpen(true);
	};

	const handleEditTeamMember = (member: TeamMember) => {
		setEditingTeamMember(member);
		setIsDialogOpen(true);
	};

	const handleSaveSection = async () => {
		if (!editingSection) return;

		setIsSubmitting(true);
		try {
			const method = editingSection.id === 0 ? "POST" : "PUT";
			const response = await fetch("/api/admin/about", {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contentType: "section",
					id: editingSection.id === 0 ? undefined : editingSection.id,
					...editingSection,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save section");
			}

			const savedSection = await response.json();

			// Update the local state
			setAboutData((prev) => {
				if (!prev) return prev;

				const updatedSections =
					editingSection.id === 0
						? [...prev.sections, savedSection]
						: prev.sections.map((s) =>
								s.id === savedSection.id ? savedSection : s,
							);

				return {
					...prev,
					sections: updatedSections,
				};
			});

			toast({
				title: "Success",
				description: `Section ${editingSection.id === 0 ? "created" : "updated"} successfully`,
			});

			setIsDialogOpen(false);
			setEditingSection(null);
		} catch (error) {
			console.error("Error saving section:", error);
			toast({
				title: "Error",
				description: `Failed to ${editingSection.id === 0 ? "create" : "update"} section`,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSaveTeamMember = async () => {
		if (!editingTeamMember) return;

		setIsSubmitting(true);
		try {
			const method = editingTeamMember.id === 0 ? "POST" : "PUT";
			const response = await fetch("/api/admin/about", {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contentType: "team",
					id: editingTeamMember.id === 0 ? undefined : editingTeamMember.id,
					...editingTeamMember,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save team member");
			}

			const savedMember = await response.json();

			// Update the local state
			setAboutData((prev) => {
				if (!prev) return prev;

				const updatedTeam =
					editingTeamMember.id === 0
						? [...prev.team, savedMember]
						: prev.team.map((m) => (m.id === savedMember.id ? savedMember : m));

				return {
					...prev,
					team: updatedTeam,
				};
			});

			toast({
				title: "Success",
				description: `Team member ${editingTeamMember.id === 0 ? "created" : "updated"} successfully`,
			});

			setIsDialogOpen(false);
			setEditingTeamMember(null);
		} catch (error) {
			console.error("Error saving team member:", error);
			toast({
				title: "Error",
				description: `Failed to ${editingTeamMember.id === 0 ? "create" : "update"} team member`,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteSection = async (id: number) => {
		if (!confirm("Are you sure you want to delete this section?")) return;

		try {
			const response = await fetch(
				`/api/admin/about?contentType=section&id=${id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error("Failed to delete section");
			}

			// Update the local state
			setAboutData((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					sections: prev.sections.filter((s) => s.id !== id),
				};
			});

			toast({
				title: "Success",
				description: "Section deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting section:", error);
			toast({
				title: "Error",
				description: "Failed to delete section",
				variant: "destructive",
			});
		}
	};

	const handleDeleteTeamMember = async (id: number) => {
		if (!confirm("Are you sure you want to delete this team member?")) return;

		try {
			const response = await fetch(
				`/api/admin/about?contentType=team&id=${id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error("Failed to delete team member");
			}

			// Update the local state
			setAboutData((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					team: prev.team.filter((m) => m.id !== id),
				};
			});

			toast({
				title: "Success",
				description: "Team member deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting team member:", error);
			toast({
				title: "Error",
				description: "Failed to delete team member",
				variant: "destructive",
			});
		}
	};

	// Helper function to get sections by type
	const getSectionsByType = (type: string) => {
		if (!aboutData?.sections) return [];
		return aboutData.sections.filter((section) => section.type === type);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Manage About Page</h1>
				<Button onClick={() => router.push("/about")} variant="outline">
					View About Page
				</Button>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2 mb-8">
					<TabsTrigger value="sections">Content Sections</TabsTrigger>
					<TabsTrigger value="team">Team Members</TabsTrigger>
				</TabsList>

				<TabsContent value="sections">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold">Content Sections</h2>
						<Button onClick={handleCreateSection}>
							<Plus className="h-4 w-4 mr-2" /> Add Section
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Mission Sections</CardTitle>
							</CardHeader>
							<CardContent>
								{getSectionsByType("mission").length > 0 ? (
									getSectionsByType("mission").map((section) => (
										<div
											key={section.id}
											className="flex items-center justify-between py-3 border-b last:border-0"
										>
											<div>
												<h3 className="font-medium">{section.title}</h3>
												<p className="text-sm text-gray-500 line-clamp-1">
													{section.subtitle || "No subtitle"}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditSection(section)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteSection(section.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500">No mission sections found.</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Vision Sections</CardTitle>
							</CardHeader>
							<CardContent>
								{getSectionsByType("vision").length > 0 ? (
									getSectionsByType("vision").map((section) => (
										<div
											key={section.id}
											className="flex items-center justify-between py-3 border-b last:border-0"
										>
											<div>
												<h3 className="font-medium">{section.title}</h3>
												<p className="text-sm text-gray-500 line-clamp-1">
													{section.subtitle || "No subtitle"}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditSection(section)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteSection(section.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500">No vision sections found.</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>History Sections</CardTitle>
							</CardHeader>
							<CardContent>
								{getSectionsByType("history").length > 0 ? (
									getSectionsByType("history").map((section) => (
										<div
											key={section.id}
											className="flex items-center justify-between py-3 border-b last:border-0"
										>
											<div>
												<h3 className="font-medium">{section.title}</h3>
												<p className="text-sm text-gray-500 line-clamp-1">
													{section.subtitle || "No subtitle"}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditSection(section)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteSection(section.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500">No history sections found.</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Values Sections</CardTitle>
							</CardHeader>
							<CardContent>
								{getSectionsByType("values").length > 0 ? (
									getSectionsByType("values").map((section) => (
										<div
											key={section.id}
											className="flex items-center justify-between py-3 border-b last:border-0"
										>
											<div>
												<h3 className="font-medium">{section.title}</h3>
												<p className="text-sm text-gray-500 line-clamp-1">
													{section.subtitle || "No subtitle"}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditSection(section)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteSection(section.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500">No values sections found.</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Impact Sections</CardTitle>
							</CardHeader>
							<CardContent>
								{getSectionsByType("impact").length > 0 ? (
									getSectionsByType("impact").map((section) => (
										<div
											key={section.id}
											className="flex items-center justify-between py-3 border-b last:border-0"
										>
											<div>
												<h3 className="font-medium">{section.title}</h3>
												<p className="text-sm text-gray-500 line-clamp-1">
													{section.subtitle || "No subtitle"}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditSection(section)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteSection(section.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500">No impact sections found.</p>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="team">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold">Team Members</h2>
						<Button onClick={handleCreateTeamMember}>
							<Plus className="h-4 w-4 mr-2" /> Add Team Member
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{aboutData?.team && aboutData.team.length > 0 ? (
							aboutData.team.map((member) => (
								<Card key={member.id}>
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-bold text-lg">{member.name}</h3>
												<p className="text-primary">{member.position}</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditTeamMember(member)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteTeamMember(member.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
										<p className="text-gray-500 mt-4 line-clamp-3">
											{member.bio}
										</p>
										<div className="mt-4 flex items-center">
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${member.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
											>
												{member.active ? "Active" : "Inactive"}
											</span>
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<p className="text-gray-500">No team members found.</p>
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>

			{/* Edit Section Dialog */}
			<Dialog
				open={isDialogOpen && !!editingSection}
				onOpenChange={(open) => {
					if (!open) {
						setIsDialogOpen(false);
						setEditingSection(null);
					}
				}}
			>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							{editingSection?.id === 0 ? "Create" : "Edit"} Section
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="section-type" className="text-right">
								Section Type
							</Label>
							<Select
								value={editingSection?.type}
								onValueChange={(value) =>
									setEditingSection((prev) =>
										prev ? { ...prev, type: value } : null,
									)
								}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select section type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="mission">Mission</SelectItem>
									<SelectItem value="vision">Vision</SelectItem>
									<SelectItem value="history">History</SelectItem>
									<SelectItem value="values">Values</SelectItem>
									<SelectItem value="impact">Impact</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="section-title" className="text-right">
								Title
							</Label>
							<Input
								id="section-title"
								value={editingSection?.title || ""}
								onChange={(e) =>
									setEditingSection((prev) =>
										prev ? { ...prev, title: e.target.value } : null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="section-subtitle" className="text-right">
								Subtitle
							</Label>
							<Input
								id="section-subtitle"
								value={editingSection?.subtitle || ""}
								onChange={(e) =>
									setEditingSection((prev) =>
										prev ? { ...prev, subtitle: e.target.value } : null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="section-image" className="text-right">
								Image URL
							</Label>
							<Input
								id="section-image"
								value={editingSection?.image || ""}
								onChange={(e) =>
									setEditingSection((prev) =>
										prev ? { ...prev, image: e.target.value } : null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="section-order" className="text-right">
								Order
							</Label>
							<Input
								id="section-order"
								type="number"
								value={editingSection?.order || 0}
								onChange={(e) =>
									setEditingSection((prev) =>
										prev
											? { ...prev, order: Number.parseInt(e.target.value) }
											: null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="section-active" className="text-right">
								Active
							</Label>
							<div className="col-span-3">
								<Switch
									checked={editingSection?.active || false}
									onCheckedChange={(checked) =>
										setEditingSection((prev) =>
											prev ? { ...prev, active: checked } : null,
										)
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-4 gap-4">
							<Label htmlFor="section-content" className="text-right pt-2">
								Content
							</Label>
							<div className="col-span-3">
								<RichTextEditor
									value={editingSection?.content || ""}
									onChange={(value) =>
										setEditingSection((prev) =>
											prev ? { ...prev, content: value } : null,
										)
									}
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => {
								setIsDialogOpen(false);
								setEditingSection(null);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveSection} disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save
								</>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Edit Team Member Dialog */}
			<Dialog
				open={isDialogOpen && !!editingTeamMember}
				onOpenChange={(open) => {
					if (!open) {
						setIsDialogOpen(false);
						setEditingTeamMember(null);
					}
				}}
			>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							{editingTeamMember?.id === 0 ? "Create" : "Edit"} Team Member
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-name" className="text-right">
								Name
							</Label>
							<Input
								id="member-name"
								value={editingTeamMember?.name || ""}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev ? { ...prev, name: e.target.value } : null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-position" className="text-right">
								Position
							</Label>
							<Input
								id="member-position"
								value={editingTeamMember?.position || ""}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev ? { ...prev, position: e.target.value } : null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-image" className="text-right">
								Image URL
							</Label>
							<Input
								id="member-image"
								value={editingTeamMember?.image || ""}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev ? { ...prev, image: e.target.value } : null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-twitter" className="text-right">
								Twitter URL
							</Label>
							<Input
								id="member-twitter"
								value={editingTeamMember?.socialLinks?.twitter || ""}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev
											? {
													...prev,
													socialLinks: {
														...prev.socialLinks,
														twitter: e.target.value,
													},
												}
											: null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-linkedin" className="text-right">
								LinkedIn URL
							</Label>
							<Input
								id="member-linkedin"
								value={editingTeamMember?.socialLinks?.linkedin || ""}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev
											? {
													...prev,
													socialLinks: {
														...prev.socialLinks,
														linkedin: e.target.value,
													},
												}
											: null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-instagram" className="text-right">
								Instagram URL
							</Label>
							<Input
								id="member-instagram"
								value={editingTeamMember?.socialLinks?.instagram || ""}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev
											? {
													...prev,
													socialLinks: {
														...prev.socialLinks,
														instagram: e.target.value,
													},
												}
											: null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-order" className="text-right">
								Order
							</Label>
							<Input
								id="member-order"
								type="number"
								value={editingTeamMember?.order || 0}
								onChange={(e) =>
									setEditingTeamMember((prev) =>
										prev
											? { ...prev, order: Number.parseInt(e.target.value) }
											: null,
									)
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="member-active" className="text-right">
								Active
							</Label>
							<div className="col-span-3">
								<Switch
									checked={editingTeamMember?.active || false}
									onCheckedChange={(checked) =>
										setEditingTeamMember((prev) =>
											prev ? { ...prev, active: checked } : null,
										)
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-4 gap-4">
							<Label htmlFor="member-bio" className="text-right pt-2">
								Bio
							</Label>
							<div className="col-span-3">
								<RichTextEditor
									value={editingTeamMember?.bio || ""}
									onChange={(value) =>
										setEditingTeamMember((prev) =>
											prev ? { ...prev, bio: value } : null,
										)
									}
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => {
								setIsDialogOpen(false);
								setEditingTeamMember(null);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveTeamMember} disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save
								</>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
