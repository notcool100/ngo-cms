"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Media {
	id: string;
	title: string;
	slug: string;
	description: string;
	mediaUrl: string;
	mediaType: string;
	thumbnail: string | null;
	featured: boolean;
	published: boolean;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export default function MediaPage() {
	const [media, setMedia] = useState<Media[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		fetchMedia();
	}, []);

	const fetchMedia = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/media");
			if (!response.ok) {
				throw new Error("Failed to fetch media");
			}
			const data = await response.json();
			setMedia(data);
		} catch (error) {
			console.error("Error fetching media:", error);
			toast({
				title: "Error",
				description: "Failed to load media. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this media item?")) {
			return;
		}

		try {
			const response = await fetch(`/api/media/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete media");
			}

			toast({
				title: "Success",
				description: "Media deleted successfully",
			});

			// Refresh the media list
			fetchMedia();
		} catch (error) {
			console.error("Error deleting media:", error);
			toast({
				title: "Error",
				description: "Failed to delete media. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleTogglePublish = async (id: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/api/media/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					published: !currentStatus,
					publishedAt: !currentStatus ? new Date().toISOString() : null,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update media");
			}

			toast({
				title: "Success",
				description: `Media ${!currentStatus ? "published" : "unpublished"} successfully`,
			});

			// Refresh the media list
			fetchMedia();
		} catch (error) {
			console.error("Error updating media:", error);
			toast({
				title: "Error",
				description: "Failed to update media. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/api/media/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					featured: !currentStatus,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update media");
			}

			toast({
				title: "Success",
				description: `Media ${!currentStatus ? "featured" : "unfeatured"} successfully`,
			});

			// Refresh the media list
			fetchMedia();
		} catch (error) {
			console.error("Error updating media:", error);
			toast({
				title: "Error",
				description: "Failed to update media. Please try again.",
				variant: "destructive",
			});
		}
	};

	const getMediaTypeColor = (type: string) => {
		switch (type) {
			case "VIDEO":
				return "bg-blue-500";
			case "AUDIO":
				return "bg-green-500";
			case "DOCUMENTARY":
				return "bg-purple-500";
			case "INTERVIEW":
				return "bg-yellow-500";
			case "NEWS":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Media Management</h1>
				<Button onClick={() => router.push("/admin/media/new/form")}>
					<Plus className="mr-2 h-4 w-4" /> Add New Media
				</Button>
			</div>

			<Tabs defaultValue="all">
				<TabsList className="mb-4">
					<TabsTrigger value="all">All Media</TabsTrigger>
					<TabsTrigger value="published">Published</TabsTrigger>
					<TabsTrigger value="draft">Drafts</TabsTrigger>
					<TabsTrigger value="featured">Featured</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<MediaTable
						media={media}
						handleDelete={handleDelete}
						handleTogglePublish={handleTogglePublish}
						handleToggleFeatured={handleToggleFeatured}
						getMediaTypeColor={getMediaTypeColor}
						loading={loading}
						router={router}
					/>
				</TabsContent>

				<TabsContent value="published">
					<MediaTable
						media={media.filter((item) => item.published)}
						handleDelete={handleDelete}
						handleTogglePublish={handleTogglePublish}
						handleToggleFeatured={handleToggleFeatured}
						getMediaTypeColor={getMediaTypeColor}
						loading={loading}
						router={router}
					/>
				</TabsContent>

				<TabsContent value="draft">
					<MediaTable
						media={media.filter((item) => !item.published)}
						handleDelete={handleDelete}
						handleTogglePublish={handleTogglePublish}
						handleToggleFeatured={handleToggleFeatured}
						getMediaTypeColor={getMediaTypeColor}
						loading={loading}
						router={router}
					/>
				</TabsContent>

				<TabsContent value="featured">
					<MediaTable
						media={media.filter((item) => item.featured)}
						handleDelete={handleDelete}
						handleTogglePublish={handleTogglePublish}
						handleToggleFeatured={handleToggleFeatured}
						getMediaTypeColor={getMediaTypeColor}
						loading={loading}
						router={router}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function MediaTable({
	media,
	handleDelete,
	handleTogglePublish,
	handleToggleFeatured,
	getMediaTypeColor,
	loading,
	router,
}: {
	media: Media[];
	handleDelete: (id: string) => void;
	handleTogglePublish: (id: string, currentStatus: boolean) => void;
	handleToggleFeatured: (id: string, currentStatus: boolean) => void;
	getMediaTypeColor: (type: string) => string;
	loading: boolean;
	router: any;
}) {
	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Media</CardTitle>
					<CardDescription>Loading media items...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center items-center h-40">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (media.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Media</CardTitle>
					<CardDescription>No media items found.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center items-center h-40">
						<p className="text-muted-foreground">
							No media items available. Click "Add New Media" to create one.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Media</CardTitle>
				<CardDescription>
					Manage your media items. Click on a media item to edit it.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Featured</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{media.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										{item.thumbnail && (
											<img
												src={item.thumbnail}
												alt={item.title}
												className="h-10 w-10 object-cover rounded"
											/>
										)}
										<span>{item.title}</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge className={getMediaTypeColor(item.mediaType)}>
										{item.mediaType}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant={item.published ? "default" : "outline"}
										className="cursor-pointer"
										onClick={() => handleTogglePublish(item.id, item.published)}
									>
										{item.published ? "Published" : "Draft"}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant={item.featured ? "default" : "outline"}
										className="cursor-pointer"
										onClick={() => handleToggleFeatured(item.id, item.featured)}
									>
										{item.featured ? "Featured" : "Not Featured"}
									</Badge>
								</TableCell>
								<TableCell>
									{format(new Date(item.createdAt), "MMM d, yyyy")}
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => router.push(`/media/${item.slug}`)}
										>
											<Eye className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => router.push(`/admin/media/${item.id}`)}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleDelete(item.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
