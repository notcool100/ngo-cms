"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import type { Publication } from "@prisma/client";

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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertModal } from "@/components/modals/alert-modal";
import { FileUpload } from "@/components/ui/file-upload";
import { Editor } from "@/components/ui/editor";
import {
	useDeletePublication,
	useUpsertPublication,
} from "@/hooks/use-publications";
import { useUsers } from "@/hooks/use-users";

const formSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	fileUrl: z.string().min(1),
	coverImage: z.string().optional(),
	type: z.enum([
		"BOOK",
		"ARTICLE",
		"REPORT",
		"ACT",
		"RULE",
		"GUIDELINE",
		"OTHER",
	]),
	featured: z.boolean().default(false),
	published: z.boolean().default(false),
	categoryId: z.string().optional(),
	authorId: z.string({
		required_error: "Author is required",
	}),
});

type PublicationFormValues = z.infer<typeof formSchema>;

interface PublicationFormProps {
	initialData: Publication | null;
	isLoading?: boolean;
}

export const PublicationForm: React.FC<PublicationFormProps> = ({
	initialData,
	isLoading: formLoading,
}) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { data: users, isLoading: loadingUsers } = useUsers();

	const title = initialData ? "Edit publication" : "Create publication";
	const description = initialData
		? "Edit your publication."
		: "Add a new publication";
	const toastMessage = initialData
		? "Publication updated."
		: "Publication created.";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<PublicationFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			title: "",
			description: "",
			fileUrl: "",
			coverImage: "",
			type: "BOOK",
			featured: false,
			published: false,
			categoryId: undefined,
			authorId: "",
		},
	});

	const { mutate: upsertPublication, isPending: isSubmitting } =
		useUpsertPublication();
	const { mutate: deletePublication, isPending: isDeleting } =
		useDeletePublication();

	const onSubmit = async (data: PublicationFormValues) => {
		try {
			await upsertPublication({
				...data,
				title: data.title,
				slug: initialData?.slug,
				description: data.description || "", // Ensure description is provided
				fileUrl: data.fileUrl || "",
				coverImage: data.coverImage || "",
				type: data.type || "BOOK",
				featured: data.featured || false,
				published: data.published || false,
				categoryId: data.categoryId,
				authorId: data.authorId || "",
			});
			router.push("/admin/publications");
			router.refresh();
			toast.success(toastMessage);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	const onDelete = async () => {
		if (!initialData?.id) return;

		try {
			await deletePublication(initialData.id);
			router.push("/admin/publications");
			router.refresh();
			toast.success("Publication deleted.");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={isDeleting}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={isDeleting}
						variant="destructive"
						size="sm"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="Publication title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="authorId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Author</FormLabel>
									<Select
										disabled={isSubmitting || loadingUsers}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select an author"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{users?.map((user) => (
												<SelectItem key={user.id} value={user.id}>
													{user.name || user.email}
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
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<Select
										disabled={isSubmitting}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a type"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="BOOK">Book</SelectItem>
											<SelectItem value="ARTICLE">Article</SelectItem>
											<SelectItem value="REPORT">Report</SelectItem>
											<SelectItem value="ACT">Act</SelectItem>
											<SelectItem value="RULE">Rule</SelectItem>
											<SelectItem value="GUIDELINE">Guideline</SelectItem>
											<SelectItem value="OTHER">Other</SelectItem>
										</SelectContent>
									</Select>
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
									<Editor value={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="fileUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>File</FormLabel>
									<FormControl>
										<FileUpload
											value={field.value}
											onChange={field.onChange}
											onRemove={() => field.onChange("")}
											disabled={isSubmitting}
											accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
											id="publication-file-upload"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="coverImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cover Image</FormLabel>
									<FormControl>
										<FileUpload
											value={field.value}
											onChange={field.onChange}
											onRemove={() => field.onChange("")}
											disabled={isSubmitting}
											accept="image/*"
											id="publication-cover-upload"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-3 gap-8">
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
											This publication will appear on the home page
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
											This publication will be visible to the public
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={isSubmitting} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};
