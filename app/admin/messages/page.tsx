"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Eye, Mail, MailCheck, Archive, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

interface ContactMessage {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	subject: string | null;
	message: string;
	status: string;
	createdAt: string;
}

interface PaginationData {
	total: number;
	pages: number;
	page: number;
	limit: number;
}

export default function MessagesPage() {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		pages: 1,
		page: 1,
		limit: 10,
	});
	const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
		null,
	);
	const [messageDialogOpen, setMessageDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		fetchMessages();
	}, [currentPage, searchQuery]);

	const fetchMessages = async () => {
		try {
			setIsLoading(true);
			const queryParams = new URLSearchParams({
				page: currentPage.toString(),
				limit: "10",
			});

			if (searchQuery) {
				queryParams.append("search", searchQuery);
			}

			const response = await fetch(`/api/contact?${queryParams.toString()}`);

			if (!response.ok) {
				throw new Error("Failed to fetch messages");
			}

			const data = await response.json();
			setMessages(data.messages || []);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Error fetching messages:", error);
			toast({
				title: "Error",
				description: "Failed to load messages",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Add a search function
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const updateMessageStatus = async (id: string, status: string) => {
		try {
			const response = await fetch(`/api/contact/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error("Failed to update message status");
			}

			toast({
				title: "Success",
				description: "Message status updated",
			});

			// Refresh the messages list
			fetchMessages();
		} catch (error) {
			console.error("Error updating message status:", error);
			toast({
				title: "Error",
				description: "Failed to update message status",
				variant: "destructive",
			});
		}
	};

	const handleDeleteMessage = async () => {
		if (!messageToDelete) return;

		try {
			const response = await fetch(`/api/contact/${messageToDelete}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete message");
			}

			toast({
				title: "Success",
				description: "Message deleted successfully",
			});

			// Refresh the messages list
			fetchMessages();
		} catch (error) {
			console.error("Error deleting message:", error);
			toast({
				title: "Error",
				description: "Failed to delete message",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setMessageToDelete(null);
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "UNREAD":
				return (
					<Badge variant="outline" className="text-blue-600">
						Unread
					</Badge>
				);
			case "READ":
				return <Badge variant="secondary">Read</Badge>;
			case "REPLIED":
				return <Badge className="bg-green-500">Replied</Badge>;
			case "ARCHIVED":
				return <Badge variant="outline">Archived</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const columns = [
		{
			key: "sender",
			title: "Sender",
			render: (message: ContactMessage) => (
				<div>
					<div className="font-medium">{message.name}</div>
					<div className="text-sm text-muted-foreground">{message.email}</div>
				</div>
			),
		},
		{
			key: "subject",
			title: "Subject",
			render: (message: ContactMessage) => (
				<div className="max-w-[300px] truncate">
					{message.subject || "No subject"}
				</div>
			),
		},
		{
			key: "status",
			title: "Status",
			render: (message: ContactMessage) => getStatusBadge(message.status),
		},
		{
			key: "date",
			title: "Date",
			render: (message: ContactMessage) =>
				new Date(message.createdAt).toLocaleDateString(),
		},
		{
			key: "actions",
			title: "Actions",
			render: (message: ContactMessage) => (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setSelectedMessage(message);
							setMessageDialogOpen(true);
							if (message.status === "UNREAD") {
								updateMessageStatus(message.id, "READ");
							}
						}}
					>
						<Eye className="h-4 w-4" />
						<span className="sr-only">View</span>
					</Button>
					{message.status !== "REPLIED" && (
						<Button
							variant="outline"
							size="icon"
							onClick={() => updateMessageStatus(message.id, "REPLIED")}
						>
							<MailCheck className="h-4 w-4" />
							<span className="sr-only">Mark as Replied</span>
						</Button>
					)}
					{message.status !== "ARCHIVED" && (
						<Button
							variant="outline"
							size="icon"
							onClick={() => updateMessageStatus(message.id, "ARCHIVED")}
						>
							<Archive className="h-4 w-4" />
							<span className="sr-only">Archive</span>
						</Button>
					)}
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setMessageToDelete(message.id);
							setDeleteDialogOpen(true);
						}}
					>
						<Trash className="h-4 w-4" />
						<span className="sr-only">Delete</span>
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
				<h1 className="text-3xl font-bold tracking-tight">Messages</h1>
				<Button variant="outline" onClick={() => fetchMessages()}>
					Refresh
				</Button>
			</div>

			<DataTable
				data={messages}
				columns={columns}
				pagination={pagination}
				onPageChange={setCurrentPage}
				searchPlaceholder="Search messages..."
				onSearch={handleSearch}
			/>

			<Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>{selectedMessage?.subject || "Message"}</DialogTitle>
						<DialogDescription>
							From: {selectedMessage?.name} ({selectedMessage?.email})
							{selectedMessage?.phone && ` • Phone: ${selectedMessage.phone}`}
							<br />
							Received:{" "}
							{selectedMessage &&
								new Date(selectedMessage.createdAt).toLocaleString()}
						</DialogDescription>
					</DialogHeader>
					<div className="max-h-[400px] overflow-y-auto border rounded-md p-4">
						<p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
					</div>
					<DialogFooter>
						<Button asChild>
							<a href={`mailto:${selectedMessage?.email}`}>
								<Mail className="mr-2 h-4 w-4" />
								Reply via Email
							</a>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							message.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteMessage}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
