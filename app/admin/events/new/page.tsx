"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
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
	published: z.boolean().default(false),
	featured: z.boolean().default(false),
	capacity: z.coerce.number().int().positive().optional(),
});

export default function NewEventPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			content: "",
			location: "",
			published: false,
			featured: false,
			capacity: undefined,
			image: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);

			// Include the image URL if one was uploaded
			if (imageUrl) {
				values.image = imageUrl;
			}

			const response = await fetch("/api/events", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create event");
			}

			toast({
				title: "Event created",
				description: "Your event has been created successfully.",
			});

			router.push("/admin/events");
			router.refresh();
		} catch (error) {
			console.error("Error creating event:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to create event",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	// Generate slug from title
	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	};

	// Handle title change to auto-generate slug
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		form.setValue("title", title);

		// Only auto-generate slug if it hasn't been manually edited
		if (
			!form.getValues("slug") ||
			form.getValues("slug") === generateSlug(form.getValues("title"))
		) {
			form.setValue("slug", generateSlug(title));
		}
	};

	// Handle image upload
	const handleImageUpload = (url: string) => {
		setImageUrl(url);
		form.setValue("image", url);
	};

	return (
		<div className="container py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
				<Button variant="outline" onClick={() => router.push("/admin/events")}>
					Cancel
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Event Details</CardTitle>
					<CardDescription>
						Fill in the details for your new event. All fields marked with * are
						required.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title *</FormLabel>
											<FormControl>
												<Input
													placeholder="Event title"
													{...field}
													onChange={handleTitleChange}
												/>
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
											<FormLabel>Slug *</FormLabel>
											<FormControl>
												<Input placeholder="event-slug" {...field} />
											</FormControl>
											<FormDescription>
												Used in the URL: /events/your-slug
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
										<FormLabel>Description *</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Brief description of the event"
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											A short summary that will appear in event listings.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Content *</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Detailed information about the event"
												className="min-h-[200px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Detailed information about the event, including agenda,
											speakers, etc.
										</FormDescription>
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
											<Input
												placeholder="Event location or 'Virtual'"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Where the event will take place. Leave blank for virtual
											events.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Start Date and Time *</FormLabel>
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
																format(field.value, "PPP p")
															) : (
																<span>Pick a date and time</span>
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
													<div className="p-3 border-t border-border">
														<Input
															type="time"
															value={
																field.value ? format(field.value, "HH:mm") : ""
															}
															onChange={(e) => {
																const [hours, minutes] =
																	e.target.value.split(":");
																const newDate = new Date(
																	field.value || new Date(),
																);
																newDate.setHours(Number.parseInt(hours, 10));
																newDate.setMinutes(
																	Number.parseInt(minutes, 10),
																);
																field.onChange(newDate);
															}}
														/>
													</div>
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
											<FormLabel>End Date and Time</FormLabel>
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
																format(field.value, "PPP p")
															) : (
																<span>Pick a date and time</span>
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
													<div className="p-3 border-t border-border">
														<Input
															type="time"
															value={
																field.value ? format(field.value, "HH:mm") : ""
															}
															onChange={(e) => {
																const [hours, minutes] =
																	e.target.value.split(":");
																const newDate = new Date(
																	field.value || new Date(),
																);
																newDate.setHours(Number.parseInt(hours, 10));
																newDate.setMinutes(
																	Number.parseInt(minutes, 10),
																);
																field.onChange(newDate);
															}}
														/>
													</div>
												</PopoverContent>
											</Popover>
											<FormDescription>
												Optional. If not specified, the event will be considered
												open-ended.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="capacity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Capacity</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Maximum number of attendees"
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormDescription>
											Maximum number of attendees. Leave blank for unlimited
											capacity.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Event Image</FormLabel>
										<FormControl>
											<ImageUpload
												onUpload={handleImageUpload}
												existingImage={field.value}
											/>
										</FormControl>
										<FormDescription>
											Upload an image for the event. Recommended size:
											1200x630px.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="published"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">Published</FormLabel>
												<FormDescription>
													Make this event visible to the public.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="featured"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">Featured</FormLabel>
												<FormDescription>
													Highlight this event on the homepage.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end">
								<Button type="submit" disabled={isLoading}>
									{isLoading ? "Creating..." : "Create Event"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
