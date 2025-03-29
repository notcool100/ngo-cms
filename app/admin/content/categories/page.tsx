"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Category {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	_count: {
		programs: number;
	};
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		id: "",
		name: "",
		slug: "",
		description: "",
	});

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/program-categories");

			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}

			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error("Error fetching categories:", error);
			toast({
				title: "Error",
				description: "Failed to load categories",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteCategory = async () => {
		if (!categoryToDelete) return;

		try {
			const response = await fetch(
				`/api/program-categories/${categoryToDelete}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete category");
			}

			toast({
				title: "Success",
				description: "Category deleted successfully",
			});

			// Refresh the categories list
			fetchCategories();
		} catch (error) {
			console.error("Error deleting category:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to delete category",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setCategoryToDelete(null);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Auto-generate slug from name
		if (name === "name") {
			const slug = value
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-");

			setFormData((prev) => ({ ...prev, slug }));
		}
	};

	const handleSubmitForm = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const url = isEditing
				? `/api/program-categories/${formData.id}`
				: "/api/program-categories";

			const method = isEditing ? "PATCH" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.name,
					slug: formData.slug,
					description: formData.description || undefined,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(
					error.error ||
						`Failed to ${isEditing ? "update" : "create"} category`,
				);
			}

			toast({
				title: "Success",
				description: `Category ${isEditing ? "updated" : "created"} successfully`,
			});

			setFormDialogOpen(false);
			fetchCategories();
		} catch (error) {
			console.error(
				`Error ${isEditing ? "updating" : "creating"} category:`,
				error,
			);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: `Failed to ${isEditing ? "update" : "create"} category`,
				variant: "destructive",
			});
		}
	};

	const openNewCategoryDialog = () => {
		setFormData({
			id: "",
			name: "",
			slug: "",
			description: "",
		});
		setIsEditing(false);
		setFormDialogOpen(true);
	};

	const openEditCategoryDialog = (category: Category) => {
		setFormData({
			id: category.id,
			name: category.name,
			slug: category.slug,
			description: category.description || "",
		});
		setIsEditing(true);
		setFormDialogOpen(true);
	};

	const columns = [
		{
			key: "name",
			title: "Name",
		},
		{
			key: "slug",
			title: "Slug",
		},
		{
			key: "programs",
			title: "Programs",
			render: (category: Category) => category._count.programs,
		},
		{
			key: "actions",
			title: "Actions",
			render: (category: Category) => (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => openEditCategoryDialog(category)}
					>
						<Edit className="h-4 w-4" />
						<span className="sr-only">Edit</span>
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setCategoryToDelete(category.id);
							setDeleteDialogOpen(true);
						}}
						disabled={category._count.programs > 0}
					>
						<Trash className="h-4 w-4" />
						<span className="sr-only">Delete</span>
					</Button>
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
					Program Categories
				</h1>
				<Button onClick={openNewCategoryDialog}>
					<Plus className="mr-2 h-4 w-4" />
					New Category
				</Button>
			</div>

			<DataTable data={categories} columns={columns} />

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							category.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteCategory}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isEditing ? "Edit Category" : "New Category"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update the details for this category."
								: "Create a new program category."}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmitForm}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									name="slug"
									value={formData.slug}
									onChange={handleInputChange}
									required
								/>
								<p className="text-xs text-muted-foreground">
									Used in URLs. For example: /categories/your-slug
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="description">Description (Optional)</Label>
								<Textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={3}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">
								{isEditing ? "Save Changes" : "Create Category"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
