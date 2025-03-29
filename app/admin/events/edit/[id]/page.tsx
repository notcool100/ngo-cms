"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
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
	location: z.string().optional(),
	startDate: z.date({
		required_error: "Start date is required.",
	}),
	endDate: z.date().optional(),
	image: z.string().optional(),
	featured: z.boolean().default(false),
	published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditEventPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [event, setEvent] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingEvent, setIsLoadingEvent] = useState(true);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			content: "",
			location: "",
			featured: false,
			published: false,
		},
	});

	// Fetch event data
	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const response = await fetch(`/api/events/${params.id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch event");
				}
				const data = await response.json();
				setEvent(data);

				// Set form values
				form.reset({
					title: data.title,
					slug: data.slug,
					description: data.description,
					content: data.content,
					location: data.location || "",
					startDate: new Date(data.startDate),
					endDate: data.endDate ? new Date(data.endDate) : undefined,
					image: data.image || "",
					featured: data.featured,
					published: data.published,
				});

				if (data.image) {
					setImageUrl(data.image);
				}
			} catch (error) {
				console.error("Error fetching event:", error);
				toast({
					title: "Error",
					description: "Failed to load event data. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoadingEvent(false);
			}
		};

		fetchEvent();
	}, [params.id, form]);

	const onSubmit = async (data: FormValues) => {
		try {
			setIsLoading(true);

			// Include the image URL if one was uploaded
			if (imageUrl) {
				data.image = imageUrl;
			}

			const response = await fetch(`/api/events/${params.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					startDate: data.startDate.toISOString(),
					endDate: data.endDate ? data.endDate.toISOString() : undefined,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to update event");
			}

			toast({
				title: "Event updated",
				description: "Your event has been updated successfully.",
			});

			router.push("/admin/events");
			router.refresh();
		} catch (error) {
			console.error("Error updating event:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to update event",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoadingEvent) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Edit Event</h1>
				<p className="text-muted-foreground">Update event information</p>
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
											<Input placeholder="Enter event title" {...field} />
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
											<Input placeholder="enter-event-slug" {...field} />
										</FormControl>
										<FormDescription>
											This will be used for the URL (e.g., /events/your-slug)
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
											placeholder="Brief description of the event"
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
											placeholder="Detailed content of the event"
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
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input placeholder="Event location" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
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
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date (Optional)</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
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
													selected={field.value || undefined}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Image</FormLabel>
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
											<FormLabel>Featured Event</FormLabel>
											<FormDescription>
												Featured events are displayed prominently on the
												homepage
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
												Published events are visible to the public
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
								onClick={() => router.push("/admin/events")}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Update Event
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
