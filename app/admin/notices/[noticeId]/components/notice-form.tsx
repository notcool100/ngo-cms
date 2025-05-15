"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useUpsertNotice } from "@/hooks/use-notices";
import type { Notice } from "@prisma/client";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	important: z.boolean().default(false),
	published: z.boolean().default(false),
	publishedAt: z.date(),
	expiresAt: z.date().optional(),
});

type NoticeFormValues = z.infer<typeof formSchema>;

interface NoticeFormProps {
	initialData: Notice | null;
	isLoading?: boolean;
}

export function NoticeForm({ initialData, isLoading }: NoticeFormProps) {
	const router = useRouter();
	const { mutate: upsertNotice, isLoading: isSubmitting } = useUpsertNotice();

	const [isExpiryEnabled, setIsExpiryEnabled] = useState(
		!!initialData?.expiresAt,
	);

	const form = useForm<NoticeFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: initialData?.title || "",
			content: initialData?.content || "",
			important: initialData?.important || false,
			published: initialData?.published || false,
			publishedAt: initialData?.publishedAt
				? new Date(initialData.publishedAt)
				: new Date(),
			expiresAt: initialData?.expiresAt
				? new Date(initialData.expiresAt)
				: undefined,
		},
	});

	const onSubmit = async (data: NoticeFormValues) => {
		try {
			await upsertNotice({
				id: initialData?.id,
				...data,
				expiresAt: isExpiryEnabled ? data.expiresAt : undefined,
			});
			router.push("/admin/notices");
			router.refresh();
			toast({
				title: "Success",
				description: `Notice ${initialData ? "updated" : "created"} successfully.`,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Notice title" {...field} />
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
									placeholder="Notice content"
									className="min-h-[100px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
					<FormField
						control={form.control}
						name="important"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>Important</FormLabel>
									<FormDescription>
										Mark this notice as important
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="published"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>Published</FormLabel>
									<FormDescription>
										Make this notice visible to the public
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="publishedAt"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Publish Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date < new Date(new Date().setHours(0, 0, 0, 0))
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="expiry"
							checked={isExpiryEnabled}
							onCheckedChange={(checked: boolean) =>
								setIsExpiryEnabled(checked)
							}
						/>
						<label
							htmlFor="expiry"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Set expiry date
						</label>
					</div>

					{isExpiryEnabled && (
						<FormField
							control={form.control}
							name="expiresAt"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Expiry Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date < new Date(new Date().setHours(0, 0, 0, 0))
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
				</div>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : initialData ? "Save changes" : "Create"}
				</Button>
			</form>
		</Form>
	);
}
