"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Bell,
	Check,
	Clock,
	Mail,
	MessageSquare,
	Trash,
	Users,
	Calendar,
	FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample notifications for demonstration
const sampleNotifications = [
	{
		id: "1",
		title: "New donation received",
		description: "A donation of $500 was received from John Doe",
		time: "2 hours ago",
		read: false,
		type: "donation",
	},
	{
		id: "2",
		title: "New volunteer application",
		description: "Sarah Johnson has applied to volunteer",
		time: "5 hours ago",
		read: false,
		type: "volunteer",
	},
	{
		id: "3",
		title: "Event registration",
		description: "10 new registrations for 'Women in Tech Workshop'",
		time: "1 day ago",
		read: true,
		type: "event",
	},
	{
		id: "4",
		title: "Contact message",
		description: "New message from Michael Brown regarding donations",
		time: "2 days ago",
		read: true,
		type: "message",
	},
	{
		id: "5",
		title: "Program update",
		description: "The 'Leadership Training' program was updated",
		time: "3 days ago",
		read: true,
		type: "program",
	},
];

export function NotificationsTab() {
	const [notifications, setNotifications] = useState(sampleNotifications);

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification,
			),
		);
	};

	const markAllAsRead = () => {
		setNotifications(
			notifications.map((notification) => ({ ...notification, read: true })),
		);
	};

	const deleteNotification = (id: string) => {
		setNotifications(
			notifications.filter((notification) => notification.id !== id),
		);
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "donation":
				return <Bell className="h-5 w-5" />;
			case "volunteer":
				return <Users className="h-5 w-5" />;
			case "event":
				return <Calendar className="h-5 w-5" />;
			case "message":
				return <MessageSquare className="h-5 w-5" />;
			case "program":
				return <FileText className="h-5 w-5" />;
			default:
				return <Bell className="h-5 w-5" />;
		}
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Notifications</CardTitle>
							<CardDescription>
								Stay updated on important activities
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							{unreadCount > 0 && (
								<Button variant="outline" size="sm" onClick={markAllAsRead}>
									<Check className="mr-2 h-4 w-4" />
									Mark all as read
								</Button>
							)}
							<Button variant="outline" size="sm">
								<Mail className="mr-2 h-4 w-4" />
								Email Settings
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="all">
						<TabsList>
							<TabsTrigger value="all">
								All
								{unreadCount > 0 && (
									<Badge variant="secondary" className="ml-2">
										{unreadCount}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="unread">Unread</TabsTrigger>
							<TabsTrigger value="donations">Donations</TabsTrigger>
							<TabsTrigger value="events">Events</TabsTrigger>
							<TabsTrigger value="messages">Messages</TabsTrigger>
						</TabsList>

						<TabsContent value="all" className="mt-4">
							{notifications.length > 0 ? (
								<div className="space-y-4">
									{notifications.map((notification) => (
										<div
											key={notification.id}
											className={`flex items-start p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}
										>
											<div className="flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
												{getNotificationIcon(notification.type)}
											</div>
											<div className="ml-4 space-y-1 flex-1">
												<div className="flex items-center">
													<p className="text-sm font-medium leading-none">
														{notification.title}
													</p>
													{!notification.read && (
														<Badge variant="secondary" className="ml-2">
															New
														</Badge>
													)}
												</div>
												<p className="text-sm text-muted-foreground">
													{notification.description}
												</p>
												<div className="flex items-center text-xs text-muted-foreground">
													<Clock className="mr-1 h-3 w-3" />
													<span>{notification.time}</span>
												</div>
											</div>
											<div className="flex gap-1">
												{!notification.read && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() => markAsRead(notification.id)}
													>
														<Check className="h-4 w-4" />
													</Button>
												)}
												<Button
													variant="ghost"
													size="sm"
													onClick={() => deleteNotification(notification.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-12">
									<Bell className="h-12 w-12 text-muted-foreground mb-4" />
									<p className="text-muted-foreground">No notifications</p>
								</div>
							)}
						</TabsContent>

						<TabsContent value="unread" className="mt-4">
							{notifications.filter((n) => !n.read).length > 0 ? (
								<div className="space-y-4">
									{notifications
										.filter((n) => !n.read)
										.map((notification) => (
											<div
												key={notification.id}
												className="flex items-start p-3 rounded-lg bg-muted"
											>
												<div className="flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
													{getNotificationIcon(notification.type)}
												</div>
												<div className="ml-4 space-y-1 flex-1">
													<div className="flex items-center">
														<p className="text-sm font-medium leading-none">
															{notification.title}
														</p>
														<Badge variant="secondary" className="ml-2">
															New
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground">
														{notification.description}
													</p>
													<div className="flex items-center text-xs text-muted-foreground">
														<Clock className="mr-1 h-3 w-3" />
														<span>{notification.time}</span>
													</div>
												</div>
												<div className="flex gap-1">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => markAsRead(notification.id)}
													>
														<Check className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => deleteNotification(notification.id)}
													>
														<Trash className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-12">
									<Check className="h-12 w-12 text-muted-foreground mb-4" />
									<p className="text-muted-foreground">
										No unread notifications
									</p>
								</div>
							)}
						</TabsContent>

						{/* Other tab contents would be similar */}
						<TabsContent value="donations" className="mt-4">
							<div className="flex flex-col items-center justify-center py-12">
								<p className="text-muted-foreground">
									Donation notifications would appear here
								</p>
							</div>
						</TabsContent>

						<TabsContent value="events" className="mt-4">
							<div className="flex flex-col items-center justify-center py-12">
								<p className="text-muted-foreground">
									Event notifications would appear here
								</p>
							</div>
						</TabsContent>

						<TabsContent value="messages" className="mt-4">
							<div className="flex flex-col items-center justify-center py-12">
								<p className="text-muted-foreground">
									Message notifications would appear here
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
