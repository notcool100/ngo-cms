"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/admin/image-upload";

const formSchema = z.object({
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
	content: z.string().min(10, {
		message: "Content must be at least 10 characters.",
	}),
	image: z.string().optional(),
	featured: z.boolean().default(false),
	active: z.boolean().default(true),
	categoryId: z.string({
		required_error: "Please select a category.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProgramPage({
	params,
}: { params: { id: string } }) {
	const router = useRouter();
	const [program, setProgram] = useState<any>(null);
	const [categories, setCategories] = useState<{ id: string; name: string }[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingProgram, setIsLoadingProgram] = useState(true);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			content: "",
			featured: false,
			active: true,
			categoryId: "",
		},
	});

	// Fetch program data
	useEffect(() => {
		const fetchProgram = async () => {
			try {
				const response = await fetch(`/api/programs/${params.id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch program");
				}
				const data = await response.json();
				setProgram(data);

				// Set form values
				form.reset({
					title: data.title,
					slug: data.slug,
					description: data.description,
					content: data.content,
					image: data.image || "",
					featured: data.featured,
					active: data.active,
					categoryId: data.categoryId,
				});

				if (data.image) {
					setImageUrl(data.image);
				}
			} catch (error) {
				console.error("Error fetching program:", error);
				toast({
					title: "Error",
					description: "Failed to load program data. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoadingProgram(false);
			}
		};

		fetchProgram();
	}, [params.id, form]);

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/program-categories");
				if (!response.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data = await response.json();
				setCategories(data.categories);
			} catch (error) {
				console.error("Error fetching categories:", error);
				toast({
					title: "Error",
					description: "Failed to load categories. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoadingCategories(false);
			}
		};

		fetchCategories();
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			setIsLoading(true);

			// Include the image URL if one was uploaded
			if (imageUrl) {
				data.image = imageUrl;
			}

			const response = await fetch(`/api/programs/${params.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to update program");
			}

			toast({
				title: "Program updated",
				description: "Your program has been updated successfully.",
			});

			router.push("/admin/content");
			router.refresh();
		} catch (error) {
			console.error("Error updating program:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to update program",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoadingProgram) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Edit Program</h1>
				<p className="text-muted-foreground">Update program information</p>
			</div>

			<div className="rounded-lg border p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Enter program title" {...field} />
										</FormControl>
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
										<FormControl>
											<Input placeholder="enter-program-slug" {...field} />
										</FormControl>
										<FormDescription>
											This will be used for the URL (e.g., /programs/your-slug)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isLoadingCategories}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief description of the program"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Detailed content of the program"
											className="min-h-[200px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Program Image</FormLabel>
									<FormControl>
										<ImageUpload
											value={imageUrl || field.value || ""}
											onChange={(url) => {
												setImageUrl(url);
												field.onChange(url);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
											<FormLabel>Featured Program</FormLabel>
											<FormDescription>
												Featured programs are displayed prominently on the
												homepage
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="active"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Active</FormLabel>
											<FormDescription>
												Active programs are visible to the public
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/admin/content")}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Update Program
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
