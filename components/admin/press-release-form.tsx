import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultipleImageUpload } from "@/components/admin/multiple-image-upload";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	content: z.string().min(1, "Content is required"),
	excerpt: z.string().optional(),
	image: z.string().optional(),
	youtubeUrl: z
		.string()
		.url("Invalid YouTube URL")
		.optional()
		.or(z.literal("")),
	websiteUrls: z.array(z.string().url("Invalid URL")).optional(),
	images: z.array(z.string()).optional(),
	featured: z.boolean().default(false),
	published: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface PressReleaseFormProps {
	initialData?: any;
	onSubmit: (data: FormData) => void;
	isLoading?: boolean;
}

export default function PressReleaseForm({
	initialData,
	onSubmit,
	isLoading = false,
}: PressReleaseFormProps) {
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [websiteUrls, setWebsiteUrls] = useState<string[]>(
		initialData?.websiteUrls || [],
	);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: initialData?.title || "",
			slug: initialData?.slug || "",
			content: initialData?.content || "",
			excerpt: initialData?.excerpt || "",
			image: initialData?.image || "",
			youtubeUrl: initialData?.youtubeUrl || "",
			websiteUrls: initialData?.websiteUrls || [],
			images: initialData?.images || [],
			featured: initialData?.featured || false,
			published: initialData?.published || false,
		},
	});

	const addWebsiteUrl = () => {
		if (!websiteUrl) return;
		try {
			new URL(websiteUrl);
			setWebsiteUrls([...websiteUrls, websiteUrl]);
			form.setValue("websiteUrls", [...websiteUrls, websiteUrl]);
			setWebsiteUrl("");
		} catch (error) {
			toast.error("Please enter a valid URL");
		}
	};

	const removeWebsiteUrl = (index: number) => {
		const newUrls = websiteUrls.filter((_, i) => i !== index);
		setWebsiteUrls(newUrls);
		form.setValue("websiteUrls", newUrls);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<Card>
					<CardContent className="pt-6">
						<div className="grid gap-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
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
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="excerpt"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Excerpt</FormLabel>
										<FormControl>
											<Textarea {...field} />
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
											<RichTextEditor
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="youtubeUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>YouTube URL</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="url"
												placeholder="https://youtube.com/..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="space-y-4">
								<FormLabel>Website URLs</FormLabel>
								<div className="flex gap-2">
									<Input
										value={websiteUrl}
										onChange={(e) => setWebsiteUrl(e.target.value)}
										type="url"
										placeholder="https://..."
									/>
									<Button type="button" onClick={addWebsiteUrl}>
										Add URL
									</Button>
								</div>
								<div className="space-y-2">
									{websiteUrls.map((url, index) => (
										<div key={index} className="flex items-center gap-2">
											<span className="flex-1 truncate">{url}</span>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={() => removeWebsiteUrl(index)}
											>
												Remove
											</Button>
										</div>
									))}
								</div>
							</div>

							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Featured Image</FormLabel>
										<FormControl>
											<ImageUpload
												value={field.value}
												onChange={field.onChange}
												onRemove={() => field.onChange("")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="images"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Additional Images</FormLabel>
										<FormControl>
											<MultipleImageUpload
												value={field.value}
												onChange={field.onChange}
												onRemove={(url) =>
													field.onChange(
														field.value.filter((v: string) => v !== url),
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex gap-4">
								<FormField
									control={form.control}
									name="featured"
									render={({ field }) => (
										<FormItem className="flex items-center space-x-2">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel className="!mt-0">Featured</FormLabel>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="published"
									render={({ field }) => (
										<FormItem className="flex items-center space-x-2">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel className="!mt-0">Published</FormLabel>
										</FormItem>
									)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button type="submit" disabled={isLoading}>
						{isLoading
							? "Saving..."
							: initialData
								? "Update Press Release"
								: "Create Press Release"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
