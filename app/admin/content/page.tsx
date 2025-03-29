"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Program {
	id: string;
	title: string;
	slug: string;
	description: string;
	featured: boolean;
	active: boolean;
	createdAt: string;
	category: {
		name: string;
	};
}

interface PaginationData {
	total: number;
	pages: number;
	page: number;
	limit: number;
}

export default function ContentManagementPage() {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		pages: 1,
		page: 1,
		limit: 10,
	});
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [programToDelete, setProgramToDelete] = useState<string | null>(null);

	useEffect(() => {
		fetchPrograms();
	}, [currentPage, searchQuery]);

	const fetchPrograms = async () => {
		try {
			setIsLoading(true);
			const url = new URL("/api/programs", window.location.origin);
			url.searchParams.append("page", currentPage.toString());
			url.searchParams.append("limit", "10");

			if (searchQuery) {
				url.searchParams.append("search", searchQuery);
			}

			const response = await fetch(url.toString());

			if (!response.ok) {
				throw new Error("Failed to fetch programs");
			}

			const data = await response.json();
			setPrograms(data.programs || []);
			setPagination(
				data.pagination || {
					total: data.programs?.length || 0,
					pages: Math.ceil((data.programs?.length || 0) / 10),
					page: currentPage,
					limit: 10,
				},
			);
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

	const handleDeleteProgram = async () => {
		if (!programToDelete) return;

		try {
			const response = await fetch(`/api/programs/${programToDelete}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete program");
			}

			toast({
				title: "Success",
				description: "Program deleted successfully",
			});

			// Refresh the programs list
			fetchPrograms();
		} catch (error) {
			console.error("Error deleting program:", error);
			toast({
				title: "Error",
				description: "Failed to delete program",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setProgramToDelete(null);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const columns = [
		{
			key: "title",
			title: "Title",
		},
		{
			key: "category",
			title: "Category",
			render: (program: Program) => program.category.name,
		},
		{
			key: "status",
			title: "Status",
			render: (program: Program) => (
				<div className="flex gap-2">
					{program.active ? (
						<Badge variant="default">Active</Badge>
					) : (
						<Badge variant="outline">Inactive</Badge>
					)}
					{program.featured && <Badge variant="secondary">Featured</Badge>}
				</div>
			),
		},
		{
			key: "actions",
			title: "Actions",
			render: (program: Program) => (
				<div className="flex gap-2">
					<Button variant="outline" size="icon" asChild>
						<Link href={`/programs/${program.slug}`} target="_blank">
							<Eye className="h-4 w-4" />
							<span className="sr-only">View</span>
						</Link>
					</Button>
					<Button variant="outline" size="icon" asChild>
						<Link href={`/admin/content/edit/${program.id}`}>
							<Edit className="h-4 w-4" />
							<span className="sr-only">Edit</span>
						</Link>
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setProgramToDelete(program.id);
							setDeleteDialogOpen(true);
						}}
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
					Content Management
				</h1>
				<div className="flex items-center gap-2">
					<Button asChild variant="outline">
						<Link href="/admin/content/categories">Manage Categories</Link>
					</Button>
					<Button asChild>
						<Link href="/admin/content/new">
							<Plus className="mr-2 h-4 w-4" />
							New Program
						</Link>
					</Button>
				</div>
			</div>

			<DataTable
				data={programs}
				columns={columns}
				pagination={pagination}
				onPageChange={setCurrentPage}
				onSearch={handleSearch}
				searchPlaceholder="Search programs..."
			/>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							program.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteProgram}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
