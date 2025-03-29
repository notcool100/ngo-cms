import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

export const metadata = {
	title: "Events | Empower Together",
	description:
		"Join our upcoming events and make a difference in your community.",
};

export default async function EventsPage() {
	// Fetch published events
	const events = await prisma.event.findMany({
		where: {
			published: true,
			startDate: {
				gte: new Date(),
			},
		},
		include: {
			organizer: {
				select: {
					name: true,
					image: true,
				},
			},
			_count: {
				select: {
					attendees: true,
				},
			},
		},
		orderBy: {
			startDate: "asc",
		},
	});

	// Fetch past events
	const pastEvents = await prisma.event.findMany({
		where: {
			published: true,
			startDate: {
				lt: new Date(),
			},
		},
		include: {
			organizer: {
				select: {
					name: true,
					image: true,
				},
			},
			_count: {
				select: {
					attendees: true,
				},
			},
		},
		orderBy: {
			startDate: "desc",
		},
		take: 3,
	});

	return (
		<div className="container mx-auto py-12">
			<div className="mb-12 text-center">
				<h1 className="mb-4 text-4xl font-bold tracking-tight">
					Upcoming Events
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Join us at our upcoming events and be part of the change. Together, we
					can make a difference.
				</p>
			</div>

			{events.length === 0 ? (
				<div className="mx-auto max-w-md rounded-lg border border-dashed p-12 text-center">
					<h2 className="mb-4 text-xl font-semibold">No upcoming events</h2>
					<p className="mb-6 text-muted-foreground">
						We don&apos;t have any upcoming events scheduled at the moment.
						Please check back later.
					</p>
					<Button asChild>
						<Link href="/contact">Contact Us</Link>
					</Button>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<Card
							key={event.id}
							className="flex h-full flex-col overflow-hidden"
						>
							<div className="relative h-48 w-full">
								{event.image ? (
									<Image
										src={event.image || "/placeholder.svg"}
										alt={event.title}
										fill
										className="object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-muted">
										<CalendarIcon className="h-12 w-12 text-muted-foreground" />
									</div>
								)}
								{event.featured && (
									<div className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
										Featured
									</div>
								)}
							</div>
							<CardHeader>
								<CardTitle className="line-clamp-2">{event.title}</CardTitle>
								<CardDescription className="flex items-center gap-1">
									<CalendarIcon className="h-4 w-4" />
									{format(new Date(event.startDate), "MMMM d, yyyy")}
								</CardDescription>
								{event.location && (
									<CardDescription className="flex items-center gap-1">
										<MapPinIcon className="h-4 w-4" />
										{event.location}
									</CardDescription>
								)}
							</CardHeader>
							<CardContent className="flex-1">
								<p className="line-clamp-3 text-muted-foreground">
									{event.description}
								</p>
							</CardContent>
							<CardFooter className="border-t bg-muted/50 p-4">
								<div className="flex w-full items-center justify-between">
									<div className="text-sm text-muted-foreground">
										{event._count.attendees}{" "}
										{event._count.attendees === 1 ? "attendee" : "attendees"}
									</div>
									<Button asChild>
										<Link href={`/events/${event.slug}`}>View Details</Link>
									</Button>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			)}

			{pastEvents.length > 0 && (
				<div className="mt-20">
					<h2 className="mb-8 text-center text-3xl font-bold">Past Events</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{pastEvents.map((event) => (
							<Card
								key={event.id}
								className="flex h-full flex-col overflow-hidden opacity-80 transition-opacity hover:opacity-100"
							>
								<div className="relative h-48 w-full">
									{event.image ? (
										<Image
											src={event.image || "/placeholder.svg"}
											alt={event.title}
											fill
											className="object-cover grayscale"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-muted">
											<CalendarIcon className="h-12 w-12 text-muted-foreground" />
										</div>
									)}
									<div className="absolute left-2 top-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
										Past Event
									</div>
								</div>
								<CardHeader>
									<CardTitle className="line-clamp-2">{event.title}</CardTitle>
									<CardDescription className="flex items-center gap-1">
										<CalendarIcon className="h-4 w-4" />
										{format(new Date(event.startDate), "MMMM d, yyyy")}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-1">
									<p className="line-clamp-3 text-muted-foreground">
										{event.description}
									</p>
								</CardContent>
								<CardFooter>
									<Button asChild variant="outline" className="w-full">
										<Link href={`/events/${event.slug}`}>View Details</Link>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
