"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	UserCheck,
	UserX,
	Mail,
	Phone,
	Calendar,
	ArrowLeft,
	Download,
} from "lucide-react";

import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type Attendee = {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	status: "REGISTERED" | "CONFIRMED" | "CANCELLED" | "ATTENDED";
	createdAt: string;
	updatedAt: string;
	eventId: string;
};

type Event = {
	id: string;
	title: string;
	startDate: string;
	endDate: string | null;
	location: string | null;
};

export default function EventAttendeesPage() {
	const params = useParams();
	const router = useRouter();
	const eventId = params.id as string;

	const [attendees, setAttendees] = useState<Attendee[]>([]);
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
		null,
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [statusUpdating, setStatusUpdating] = useState(false);

	// Fetch event details and attendees
	useEffect(() => {
		const fetchEventData = async () => {
			try {
				setLoading(true);

				// Fetch event details
				const eventRes = await fetch(`/api/events/${eventId}`);
				if (!eventRes.ok) throw new Error("Failed to fetch event details");
				const eventData = await eventRes.json();
				setEvent(eventData);

				// Fetch attendees
				const attendeesRes = await fetch(`/api/events/${eventId}/attendees`);
				if (!attendeesRes.ok) throw new Error("Failed to fetch attendees");
				const attendeesData = await attendeesRes.json();
				setAttendees(attendeesData);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(
					err instanceof Error ? err.message : "An unknown error occurred",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchEventData();
	}, [eventId]);

	// Handle status update
	const handleStatusUpdate = async (attendeeId: string, newStatus: string) => {
		try {
			setStatusUpdating(true);

			const response = await fetch(
				`/api/events/${eventId}/attendees/${attendeeId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: newStatus }),
				},
			);

			if (!response.ok) throw new Error("Failed to update attendee status");

			// Update local state
			setAttendees((prev) =>
				prev.map((attendee) =>
					attendee.id === attendeeId
						? { ...attendee, status: newStatus as any }
						: attendee,
				),
			);

			toast({
				title: "Status updated",
				description: `Attendee status has been updated to ${newStatus.toLowerCase()}.`,
			});

			// Close dialog if open
			if (isDialogOpen) {
				setIsDialogOpen(false);
				setSelectedAttendee(null);
			}
		} catch (err) {
			console.error("Error updating status:", err);
			toast({
				title: "Error",
				description:
					err instanceof Error ? err.message : "Failed to update status",
				variant: "destructive",
			});
		} finally {
			setStatusUpdating(false);
		}
	};

	// Export attendees as CSV
	const exportAttendees = () => {
		if (!attendees.length) return;

		// Create CSV content
		const headers = ["Name", "Email", "Phone", "Status", "Registration Date"];
		const csvRows = [
			headers.join(","),
			...attendees.map((a) =>
				[
					`"${a.name}"`,
					`"${a.email}"`,
					`"${a.phone || ""}"`,
					`"${a.status}"`,
					`"${new Date(a.createdAt).toLocaleDateString()}"`,
				].join(","),
			),
		];

		const csvContent = csvRows.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);

		// Create download link
		const link = document.createElement("a");
		const eventName =
			event?.title.replace(/\s+/g, "_").toLowerCase() || "event";
		link.setAttribute("href", url);
		link.setAttribute("download", `${eventName}_attendees.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast({
			title: "Export successful",
			description: "Attendees list has been exported as CSV.",
		});
	};

	// Get status badge color
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "REGISTERED":
				return <Badge variant="outline">{status}</Badge>;
			case "CONFIRMED":
				return <Badge variant="secondary">{status}</Badge>;
			case "CANCELLED":
				return <Badge variant="destructive">{status}</Badge>;
			case "ATTENDED":
				return <Badge variant="default">{status}</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	// Table columns
	const columns = [
		{
			key: "name",
			title: "Name",
		},
		{
			key: "email",
			title: "Email",
		},
		{
			key: "phone",
			title: "Phone",
			render: (attendee: Attendee) => attendee.phone || "—",
		},
		{
			key: "status",
			title: "Status",
			render: (attendee: Attendee) => getStatusBadge(attendee.status),
		},
		{
			key: "createdAt",
			title: "Registration Date",
			render: (attendee: Attendee) =>
				new Date(attendee.createdAt).toLocaleDateString(),
		},
		{
			key: "actions",
			title: "Actions",
			render: (attendee: Attendee) => (
				<div className="flex space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setSelectedAttendee(attendee);
							setIsDialogOpen(true);
						}}
					>
						Manage
					</Button>
				</div>
			),
		},
	];

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 100 },
		},
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="h-8 w-64 mb-2" />
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex space-x-2">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>

				<Skeleton className="h-[500px] w-full rounded-md" />
			</div>
		);
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center h-[400px]"
			>
				<div className="text-center">
					<h2 className="text-2xl font-bold text-destructive mb-4">
						Error Loading Data
					</h2>
					<p className="text-muted-foreground mb-6">{error}</p>
					<Button onClick={() => router.back()}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Go Back
					</Button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="space-y-6"
		>
			<motion.div
				variants={itemVariants}
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Attendees for {event?.title}
					</h1>
					<p className="text-muted-foreground">
						{event?.startDate && (
							<>
								<Calendar className="inline-block mr-1 h-4 w-4" />
								{new Date(event.startDate).toLocaleDateString()}
							</>
						)}
						{event?.location && (
							<span className="ml-4">
								<span className="inline-block mr-1">📍</span>
								{event.location}
							</span>
						)}
					</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" onClick={() => router.back()}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<Button onClick={exportAttendees} disabled={!attendees.length}>
						<Download className="mr-2 h-4 w-4" />
						Export CSV
					</Button>
				</div>
			</motion.div>

			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader>
						<CardTitle>Attendees List</CardTitle>
						<CardDescription>
							{attendees.length} {attendees.length === 1 ? "person" : "people"}{" "}
							registered for this event
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable data={attendees} columns={columns} />
					</CardContent>
				</Card>
			</motion.div>

			{/* Attendee Management Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Manage Attendee</DialogTitle>
						<DialogDescription>
							View and update attendee information
						</DialogDescription>
					</DialogHeader>

					{selectedAttendee && (
						<div className="space-y-4">
							<div className="grid grid-cols-[100px_1fr] gap-2">
								<span className="text-muted-foreground">Name:</span>
								<span className="font-medium">{selectedAttendee.name}</span>

								<span className="text-muted-foreground">Email:</span>
								<div className="flex items-center">
									<span className="font-medium">{selectedAttendee.email}</span>
									<Button
										variant="ghost"
										size="icon"
										className="ml-2 h-8 w-8"
										asChild
									>
										<a href={`mailto:${selectedAttendee.email}`}>
											<Mail className="h-4 w-4" />
										</a>
									</Button>
								</div>

								<span className="text-muted-foreground">Phone:</span>
								<div className="flex items-center">
									<span className="font-medium">
										{selectedAttendee.phone || "—"}
									</span>
									{selectedAttendee.phone && (
										<Button
											variant="ghost"
											size="icon"
											className="ml-2 h-8 w-8"
											asChild
										>
											<a href={`tel:${selectedAttendee.phone}`}>
												<Phone className="h-4 w-4" />
											</a>
										</Button>
									)}
								</div>

								<span className="text-muted-foreground">Status:</span>
								<span>{getStatusBadge(selectedAttendee.status)}</span>

								<span className="text-muted-foreground">Registered:</span>
								<span>
									{new Date(selectedAttendee.createdAt).toLocaleString()}
								</span>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Update Status</label>
								<Select
									defaultValue={selectedAttendee.status}
									onValueChange={(value) =>
										handleStatusUpdate(selectedAttendee.id, value)
									}
									disabled={statusUpdating}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="REGISTERED">Registered</SelectItem>
										<SelectItem value="CONFIRMED">Confirmed</SelectItem>
										<SelectItem value="CANCELLED">Cancelled</SelectItem>
										<SelectItem value="ATTENDED">Attended</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					<DialogFooter className="flex justify-between sm:justify-between">
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Close
						</Button>
						<div className="flex space-x-2">
							<Button
								variant="destructive"
								onClick={() =>
									handleStatusUpdate(selectedAttendee?.id || "", "CANCELLED")
								}
								disabled={
									statusUpdating || selectedAttendee?.status === "CANCELLED"
								}
							>
								<UserX className="mr-2 h-4 w-4" />
								Cancel Registration
							</Button>
							<Button
								variant="default"
								onClick={() =>
									handleStatusUpdate(selectedAttendee?.id || "", "CONFIRMED")
								}
								disabled={
									statusUpdating || selectedAttendee?.status === "CONFIRMED"
								}
							>
								<UserCheck className="mr-2 h-4 w-4" />
								Confirm
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
