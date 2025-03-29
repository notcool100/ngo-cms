"use client";

import { useState } from "react";
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
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EventRegistrationPage({
	params,
}: { params: { slug: string } }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		try {
			setIsLoading(true);

			const response = await fetch(`/api/events/${params.slug}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to register for event");
			}

			toast({
				title: "Registration successful",
				description:
					"You have been registered for this event. Check your email for confirmation.",
			});

			router.push(`/events/${params.slug}`);
		} catch (error) {
			console.error("Error registering for event:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to register for event",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto py-12">
			<div className="mx-auto max-w-md">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Register for Event</h1>
					<p className="text-muted-foreground">
						Fill out the form below to register for this event.
					</p>
				</div>

				<div className="rounded-lg border p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Your full name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="your.email@example.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											We&apos;ll send confirmation details to this email.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Your phone number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end space-x-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push(`/events/${params.slug}`)}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Register
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
