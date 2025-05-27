"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const mediaFormSchema = z.object({
	title: z.string().min(3, {
		message: "Title must be at least 3 characters.",
	}),
	slug: z
		.string()
		.min(3, {
			message: "Slug must be at least 3 characters.",
		})
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"Slug must contain only lowercase letters, numbers, and hyphens.",
		}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters.",
	}),
	mediaUrl: z.string().url({
		message: "Please enter a valid URL.",
	}),
	mediaType: z.enum(
		["VIDEO", "AUDIO", "DOCUMENTARY", "INTERVIEW", "NEWS", "OTHER"],
		{
			required_error: "Please select a media type.",
		},
	),
	thumbnail: z
		.string()
		.url({
			message: "Please enter a valid URL.",
		})
		.optional()
		.nullable(),
	featured: z.boolean().default(false),
	published: z.boolean().default(false),
	categoryId: z.string().optional().nullable(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

interface Category {
	id: string;
	name: string;
}

export default function NewMediaFormPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<MediaFormValues>({
		resolver: zodResolver(mediaFormSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			mediaUrl: "",
			mediaType: "VIDEO",
			thumbnail: "",
			featured: false,
			published: false,
			categoryId: null,
		},
	});

	useEffect(() => {
		// Fetch categories
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories");
				if (!response.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data = await response.json();
				setCategories(data);
			} catch (error) {
				console.error("Error fetching categories:", error);
				toast({
					title: "Error",
					description: "Failed to load categories. Please try again.",
					variant: "destructive",
				});
			} finally {
				setLoadingCategories(false);
			}
		};

		fetchCategories();
	}, [toast]);

	const onSubmit = async (values: MediaFormValues) => {
		try {
			const response = await fetch("/api/media", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				throw new Error("Failed to create media");
			}

			toast({
				title: "Success",
				description: "Media created successfully",
			});

			router.push("/admin/media");
		} catch (error) {
			console.error("Error creating media:", error);
			toast({
				title: "Error",
				description: "Failed to create media. Please try again.",
				variant: "destructive",
			});
		}
	};

	const generateSlug = () => {
		const title = form.getValues("title");
		if (title) {
			const slug = title
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-");
			form.setValue("slug", slug, { shouldValidate: true });
		}
	};

	return (
		<div className="container mx-auto py-6">
			<h1 className="text-3xl font-bold mb-6">Add New Media</h1>

			<Card>
				<CardHeader>
					<CardTitle>Create a new media item</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter media title"
													{...field}
													onBlur={(e) => {
														field.onBlur();
														if (
															!form.getValues("slug") &&
															form.getValues("title")
														) {
															generateSlug();
														}
													}}
												/>
											</FormControl>
											<FormDescription>
												The title of your media item.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="slug"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<div className="flex gap-2">
												<FormControl>
													<Input placeholder="enter-slug-here" {...field} />
												</FormControl>
												<Button
													type="button"
													variant="outline"
													onClick={generateSlug}
												>
													Generate
												</Button>
											</div>
											<FormDescription>
												The URL-friendly version of the title.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Enter a description for this media"
												className="min-h-32"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Provide a detailed description of the media content.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="mediaUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Media URL</FormLabel>
											<FormControl>
												<Input
													placeholder="https://example.com/video.mp4"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												URL to the media file (video, audio, etc.)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="mediaType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Media Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select media type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="VIDEO">Video</SelectItem>
													<SelectItem value="AUDIO">Audio</SelectItem>
													<SelectItem value="DOCUMENTARY">
														Documentary
													</SelectItem>
													<SelectItem value="INTERVIEW">Interview</SelectItem>
													<SelectItem value="NEWS">News</SelectItem>
													<SelectItem value="OTHER">Other</SelectItem>
												</SelectContent>
											</Select>
											<FormDescription>
												The type of media content.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="thumbnail"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Thumbnail URL</FormLabel>
											<FormControl>
												<Input
													placeholder="https://example.com/thumbnail.jpg"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormDescription>
												URL to the thumbnail image (optional).
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="categoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value || undefined}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a category" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{loadingCategories ? (
														<SelectItem value="loading" disabled>
															Loading categories...
														</SelectItem>
													) : categories.length === 0 ? (
														<SelectItem value="none" disabled>
															No categories available
														</SelectItem>
													) : (
														categories.map((category) => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
											<FormDescription>
												Assign this media to a category (optional).
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="featured"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Featured</FormLabel>
												<FormDescription>
													Display this media prominently on the site.
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="published"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Published</FormLabel>
												<FormDescription>
													Make this media visible to the public.
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end gap-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push("/admin/media")}
								>
									Cancel
								</Button>
								<Button type="submit">Create Media</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
