import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

export async function generateMetadata({
	params,
}: { params: { slug: string } }) {
	const event = await prisma.event.findUnique({
		where: { slug: params.slug },
	});

	if (!event) {
		return {
			title: "Event Not Found | Empower Together",
			description: "The requested event could not be found.",
		};
	}

	return {
		title: `${event.title} | Empower Together`,
		description: event.description,
	};
}

export default async function EventPage({
	params,
}: { params: { slug: string } }) {
	const event = await prisma.event.findUnique({
		where: {
			slug: params.slug,
			published: true,
		},
		include: {
			organizer: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
			attendees: {
				select: {
					id: true,
					name: true,
					email: true,
					status: true,
				},
				where: {
					status: "CONFIRMED",
				},
			},
		},
	});

	if (!event) {
		notFound();
	}

	// Fetch related events
	const relatedEvents = await prisma.event.findMany({
		where: {
			published: true,
			slug: { not: params.slug },
			startDate: {
				gte: new Date(),
			},
		},
		orderBy: {
			startDate: "asc",
		},
		take: 3,
	});

	const isPastEvent = new Date(event.startDate) < new Date();

	return (
		<div className="container mx-auto py-12">
			<div className="mb-8">
				<Link
					href="/events"
					className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
				>
					← Back to Events
				</Link>
				<h1 className="mb-4 text-4xl font-bold tracking-tight">
					{event.title}
				</h1>
				<div className="flex flex-wrap gap-4 text-muted-foreground">
					<div className="flex items-center gap-1">
						<CalendarIcon className="h-5 w-5" />
						<span>
							{format(new Date(event.startDate), "MMMM d, yyyy")}
							{event.endDate &&
								` - ${format(new Date(event.endDate), "MMMM d, yyyy")}`}
						</span>
					</div>
					{event.location && (
						<div className="flex items-center gap-1">
							<MapPinIcon className="h-5 w-5" />
							<span>{event.location}</span>
						</div>
					)}
					<div className="flex items-center gap-1">
						<UserIcon className="h-5 w-5" />
						<span>Organized by {event.organizer.name}</span>
					</div>
				</div>
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				<div className="md:col-span-2">
					<div className="mb-8 overflow-hidden rounded-lg">
						{event.image ? (
							<div className="relative aspect-video w-full">
								<Image
									src={event.image}
									alt={event.title}
									fill
									className="object-cover"
									priority
								/>
							</div>
						) : (
							<div className="flex aspect-video w-full items-center justify-center bg-muted">
								<CalendarIcon className="h-24 w-24 text-muted-foreground" />
							</div>
						)}
					</div>

					<div className="prose max-w-none">
						<h2>About This Event</h2>
						<div className="whitespace-pre-wrap">{event.description}</div>
						<h2>Details</h2>
						<div className="whitespace-pre-wrap">{event.content}</div>
					</div>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Event Information</CardTitle>
							<CardDescription>Details about this event</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-medium">Date and Time</h3>
								<p className="text-sm text-muted-foreground">
									{format(
										new Date(event.startDate),
										"MMMM d, yyyy 'at' h:mm a",
									)}
									{event.endDate && (
										<>
											<br />
											to{" "}
											{format(
												new Date(event.endDate),
												"MMMM d, yyyy 'at' h:mm a",
											)}
										</>
									)}
								</p>
							</div>
							{event.location && (
								<div>
									<h3 className="font-medium">Location</h3>
									<p className="text-sm text-muted-foreground">
										{event.location}
									</p>
								</div>
							)}
							<div>
								<h3 className="font-medium">Attendees</h3>
								<p className="text-sm text-muted-foreground">
									{event.attendees.length} confirmed attendees
								</p>
							</div>
							{!isPastEvent && (
								<Button asChild className="w-full">
									<Link href={`/events/${event.slug}/register`}>
										Register Now
									</Link>
								</Button>
							)}
						</CardContent>
					</Card>

					{relatedEvents.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Related Events</CardTitle>
								<CardDescription>
									You might also be interested in
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{relatedEvents.map((relatedEvent) => (
									<div key={relatedEvent.id} className="flex gap-4">
										<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
											{relatedEvent.image ? (
												<Image
													src={relatedEvent.image}
													alt={relatedEvent.title}
													fill
													className="object-cover"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center bg-muted">
													<CalendarIcon className="h-8 w-8 text-muted-foreground" />
												</div>
											)}
										</div>
										<div>
											<h3 className="font-medium">
												<Link
													href={`/events/${relatedEvent.slug}`}
													className="hover:underline"
												>
													{relatedEvent.title}
												</Link>
											</h3>
											<p className="text-xs text-muted-foreground">
												{format(
													new Date(relatedEvent.startDate),
													"MMMM d, yyyy",
												)}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
