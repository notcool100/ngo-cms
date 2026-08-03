"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash, Edit, Save, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
	ssr: false,
	loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-md" />,
});

interface Activity {
	name: string;
	date?: string;
}

interface Milestone {
	date: string;
	title: string;
	description?: string;
}

interface ThematicArea {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	focus?: string | null;
	activities: Activity[];
	milestones: Milestone[];
	featured: boolean;
	order: number;
	active: boolean;
}

const EMPTY_AREA: ThematicArea = {
	id: "",
	title: "",
	slug: "",
	description: "",
	content: "",
	focus: "",
	activities: [],
	milestones: [],
	featured: true,
	order: 0,
	active: true,
};

export default function AdminThematicAreasPage() {
	const [areas, setAreas] = useState<ThematicArea[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingArea, setEditingArea] = useState<ThematicArea | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const fetchAreas = async () => {
		try {
			const response = await fetch("/api/admin/thematic-areas");
			if (!response.ok) throw new Error("Failed to fetch thematic areas");
			const responseData = await response.json();
			setAreas(responseData.data || []);
		} catch (error) {
			console.error("Error fetching thematic areas:", error);
			toast({
				title: "Error",
				description: "Failed to load thematic areas",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchAreas();
	}, []);

	const handleCreate = () => {
		setEditingArea({ ...EMPTY_AREA, order: areas.length });
		setIsDialogOpen(true);
	};

	const handleEdit = (area: ThematicArea) => {
		setEditingArea({ ...area });
		setIsDialogOpen(true);
	};

	const handleSave = async () => {
		if (!editingArea) return;
		if (!editingArea.title.trim() || !editingArea.slug.trim()) {
			toast({
				title: "Missing fields",
				description: "Title and slug are required",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const isNew = !editingArea.id;
			const method = isNew ? "POST" : "PUT";
			const payload = {
				...editingArea,
				focus: editingArea.focus || undefined,
			};

			const response = await fetch("/api/admin/thematic-areas", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error("Failed to save thematic area");

			toast({
				title: "Success",
				description: `Thematic area ${isNew ? "created" : "updated"} successfully`,
			});

			setIsDialogOpen(false);
			setEditingArea(null);
			fetchAreas();
		} catch (error) {
			console.error("Error saving thematic area:", error);
			toast({
				title: "Error",
				description: "Failed to save thematic area",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this thematic area?")) return;

		try {
			const response = await fetch(`/api/admin/thematic-areas?id=${id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete thematic area");

			toast({ title: "Success", description: "Thematic area deleted" });
			setAreas((prev) => prev.filter((a) => a.id !== id));
		} catch (error) {
			console.error("Error deleting thematic area:", error);
			toast({
				title: "Error",
				description: "Failed to delete thematic area",
				variant: "destructive",
			});
		}
	};

	const updateActivity = (index: number, patch: Partial<Activity>) => {
		setEditingArea((prev) => {
			if (!prev) return prev;
			const activities = [...prev.activities];
			activities[index] = { ...activities[index], ...patch };
			return { ...prev, activities };
		});
	};

	const updateMilestone = (index: number, patch: Partial<Milestone>) => {
		setEditingArea((prev) => {
			if (!prev) return prev;
			const milestones = [...prev.milestones];
			milestones[index] = { ...milestones[index], ...patch };
			return { ...prev, milestones };
		});
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
				<h1 className="text-3xl font-bold">Manage Thematic Areas</h1>
				<div className="flex gap-2">
					<Button onClick={() => router.push("/about")} variant="outline">
						View About Page
					</Button>
					<Button onClick={handleCreate}>
						<Plus className="h-4 w-4 mr-2" /> Add Thematic Area
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4">
				{areas.length > 0 ? (
					areas.map((area) => (
						<Card key={area.id}>
							<CardHeader className="flex flex-row items-start justify-between space-y-0">
								<div>
									<CardTitle className="flex items-center gap-2">
										{area.title}
										{!area.active && <Badge variant="secondary">Inactive</Badge>}
									</CardTitle>
									<p className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-2xl">
										{area.description}
									</p>
									<div className="flex gap-2 mt-2">
										<Badge variant="outline">Order: {area.order}</Badge>
										<Badge variant="outline">
											{area.activities.length} activities
										</Badge>
										<Badge variant="outline">
											{area.milestones.length} milestones
										</Badge>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(area)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(area.id)}
									>
										<Trash className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
						</Card>
					))
				) : (
					<CardContent className="text-center py-12">
						<p className="text-gray-500">No thematic areas found.</p>
					</CardContent>
				)}
			</div>

			<Dialog
				open={isDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setIsDialogOpen(false);
						setEditingArea(null);
					}
				}}
			>
				<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingArea?.id ? "Edit" : "Create"} Thematic Area
						</DialogTitle>
					</DialogHeader>

					{editingArea && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">Title</Label>
								<Input
									className="col-span-3"
									value={editingArea.title}
									onChange={(e) =>
										setEditingArea((prev) =>
											prev ? { ...prev, title: e.target.value } : prev,
										)
									}
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">Slug</Label>
								<Input
									className="col-span-3"
									value={editingArea.slug}
									onChange={(e) =>
										setEditingArea((prev) =>
											prev ? { ...prev, slug: e.target.value } : prev,
										)
									}
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">Focus</Label>
								<Input
									className="col-span-3"
									placeholder="Optional short focus label"
									value={editingArea.focus || ""}
									onChange={(e) =>
										setEditingArea((prev) =>
											prev ? { ...prev, focus: e.target.value } : prev,
										)
									}
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">Order</Label>
								<Input
									type="number"
									className="col-span-3"
									value={editingArea.order}
									onChange={(e) =>
										setEditingArea((prev) =>
											prev
												? { ...prev, order: Number.parseInt(e.target.value) || 0 }
												: prev,
										)
									}
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">Active</Label>
								<div className="col-span-3">
									<Switch
										checked={editingArea.active}
										onCheckedChange={(checked) =>
											setEditingArea((prev) =>
												prev ? { ...prev, active: checked } : prev,
											)
										}
									/>
								</div>
							</div>

							<div className="grid grid-cols-4 gap-4">
								<Label className="text-right pt-2">Description</Label>
								<Textarea
									className="col-span-3"
									rows={3}
									value={editingArea.description}
									onChange={(e) =>
										setEditingArea((prev) =>
											prev ? { ...prev, description: e.target.value } : prev,
										)
									}
								/>
							</div>

							<div className="grid grid-cols-4 gap-4">
								<Label className="text-right pt-2">Content</Label>
								<div className="col-span-3">
									<RichTextEditor
										value={editingArea.content}
										onChange={(value) =>
											setEditingArea((prev) =>
												prev ? { ...prev, content: value } : prev,
											)
										}
									/>
								</div>
							</div>

							{/* Activities */}
							<div className="grid grid-cols-4 gap-4">
								<Label className="text-right pt-2">Activities</Label>
								<div className="col-span-3 space-y-2">
									{editingArea.activities.map((activity, index) => (
										<div key={index} className="flex gap-2 items-center">
											<Input
												placeholder="Activity name"
												value={activity.name}
												onChange={(e) =>
													updateActivity(index, { name: e.target.value })
												}
											/>
											<Input
												placeholder="Date (optional)"
												className="w-40"
												value={activity.date || ""}
												onChange={(e) =>
													updateActivity(index, { date: e.target.value })
												}
											/>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													setEditingArea((prev) =>
														prev
															? {
																	...prev,
																	activities: prev.activities.filter(
																		(_, i) => i !== index,
																	),
																}
															: prev,
													)
												}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											setEditingArea((prev) =>
												prev
													? {
															...prev,
															activities: [
																...prev.activities,
																{ name: "", date: "" },
															],
														}
													: prev,
											)
										}
									>
										<Plus className="h-4 w-4 mr-2" /> Add Activity
									</Button>
								</div>
							</div>

							{/* Milestones (Timeline) */}
							<div className="grid grid-cols-4 gap-4">
								<Label className="text-right pt-2">
									Timeline
									<br />
									Milestones
								</Label>
								<div className="col-span-3 space-y-3">
									{editingArea.milestones.map((milestone, index) => (
										<div
											key={index}
											className="rounded-lg border p-3 space-y-2 relative"
										>
											<Button
												variant="ghost"
												size="icon"
												className="absolute top-1 right-1 h-6 w-6"
												onClick={() =>
													setEditingArea((prev) =>
														prev
															? {
																	...prev,
																	milestones: prev.milestones.filter(
																		(_, i) => i !== index,
																	),
																}
															: prev,
													)
												}
											>
												<X className="h-3 w-3" />
											</Button>
											<div className="flex gap-2">
												<Input
													placeholder="Date label (e.g. 2023, Ongoing)"
													className="w-56"
													value={milestone.date}
													onChange={(e) =>
														updateMilestone(index, { date: e.target.value })
													}
												/>
												<Input
													placeholder="Milestone title"
													value={milestone.title}
													onChange={(e) =>
														updateMilestone(index, { title: e.target.value })
													}
												/>
											</div>
											<Textarea
												placeholder="Description (optional)"
												rows={2}
												value={milestone.description || ""}
												onChange={(e) =>
													updateMilestone(index, {
														description: e.target.value,
													})
												}
											/>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											setEditingArea((prev) =>
												prev
													? {
															...prev,
															milestones: [
																...prev.milestones,
																{ date: "", title: "", description: "" },
															],
														}
													: prev,
											)
										}
									>
										<Plus className="h-4 w-4 mr-2" /> Add Milestone
									</Button>
								</div>
							</div>
						</div>
					)}

					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => {
								setIsDialogOpen(false);
								setEditingArea(null);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={isSubmitting}>
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
