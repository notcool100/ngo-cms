"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Event {
	id: string;
	title: string;
	slug: string;
	description: string;
	location: string | null;
	startDate: string;
	endDate: string | null;
	featured: boolean;
	published: boolean;
	createdAt: string;
	organizer: {
		name: string;
	};
	_count: {
		attendees: number;
	};
}

export default function EventsPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({
		total: 0,
		pages: 1,
		page: 1,
		limit: 10,
	});

	useEffect(() => {
		fetchEvents();
	}, [currentPage, searchQuery]);

	const fetchEvents = async () => {
		try {
			setIsLoading(true);
			const url = new URL("/api/events", window.location.origin);
			url.searchParams.append("page", currentPage.toString());
			url.searchParams.append("limit", "10");

			if (searchQuery) {
				url.searchParams.append("search", searchQuery);
			}

			const response = await fetch(url.toString());

			if (!response.ok) {
				throw new Error("Failed to fetch events");
			}

			const data = await response.json();
			setEvents(data.events || []);
			setPagination(
				data.pagination || {
					total: data.events?.length || 0,
					pages: Math.ceil((data.events?.length || 0) / 10),
					page: currentPage,
					limit: 10,
				},
			);
		} catch (error) {
			console.error("Error fetching events:", error);
			toast({
				title: "Error",
				description: "Failed to load events",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteEvent = async () => {
		if (!eventToDelete) return;

		try {
			const response = await fetch(`/api/events/${eventToDelete}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete event");
			}

			toast({
				title: "Success",
				description: "Event deleted successfully",
			});

			// Refresh the events list
			fetchEvents();
		} catch (error) {
			console.error("Error deleting event:", error);
			toast({
				title: "Error",
				description: "Failed to delete event",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setEventToDelete(null);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const columns = [
		{
			key: "title",
			title: "Event",
			render: (event: Event) => (
				<div>
					<div className="font-medium">{event.title}</div>
					<div className="text-sm text-muted-foreground">
						{event.location || "No location"}
					</div>
				</div>
			),
		},
		{
			key: "date",
			title: "Date",
			render: (event: Event) => {
				const startDate = new Date(event.startDate).toLocaleDateString();
				const endDate = event.endDate
					? new Date(event.endDate).toLocaleDateString()
					: null;

				return (
					<div>
						<div>{startDate}</div>
						{endDate && startDate !== endDate && (
							<div className="text-sm text-muted-foreground">to {endDate}</div>
						)}
					</div>
				);
			},
		},
		{
			key: "status",
			title: "Status",
			render: (event: Event) => (
				<div className="flex gap-2">
					{event.published ? (
						<Badge variant="default">Published</Badge>
					) : (
						<Badge variant="outline">Draft</Badge>
					)}
					{event.featured && <Badge variant="secondary">Featured</Badge>}
				</div>
			),
		},
		{
			key: "attendees",
			title: "Attendees",
			render: (event: Event) => event._count.attendees,
		},
		{
			key: "organizer",
			title: "Organizer",
			render: (event: Event) => event.organizer.name,
		},
		{
			key: "actions",
			title: "Actions",
			render: (event: any) => (
				<div className="flex space-x-2">
					<Button variant="outline" size="sm" asChild>
						<Link href={`/admin/events/edit/${event.id}`}>Edit</Link>
					</Button>
					<Button variant="outline" size="sm" asChild>
						<Link href={`/admin/events/${event.id}/attendees`}>Attendees</Link>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleDeleteEvent(event.id)}
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	if (isLoading) {
		return <AdminLoading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Events</h1>
				<Button asChild>
					<Link href="/admin/events/new">
						<Plus className="mr-2 h-4 w-4" />
						New Event
					</Link>
				</Button>
			</div>

			<DataTable
				data={events}
				columns={columns}
				searchPlaceholder="Search events..."
				onSearch={handleSearch}
				pagination={pagination}
				onPageChange={setCurrentPage}
			/>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							event and all associated registrations.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteEvent}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
