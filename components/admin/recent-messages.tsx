import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RecentMessage {
	id: string;
	name: string;
	email: string;
	subject: string;
	date: string;
	read: boolean;
}

interface RecentMessagesProps {
	messages: RecentMessage[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Recent Messages</CardTitle>
					<CardDescription>Latest contact form submissions</CardDescription>
				</div>
				<Button variant="outline" size="sm" asChild>
					<Link href="/admin/messages">View All</Link>
				</Button>
			</CardHeader>
			<CardContent>
				{messages.length > 0 ? (
					<div className="space-y-4">
						{messages.map((message) => (
							<div key={message.id} className="flex items-center">
								<div className="flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
									<Mail className="h-5 w-5" />
								</div>
								<div className="ml-4 space-y-1 flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="text-sm font-medium leading-none truncate">
											{message.name}
										</p>
										{!message.read && (
											<Badge variant="secondary" className="ml-auto">
												New
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground truncate">
										{message.subject}
									</p>
									<p className="text-xs text-muted-foreground">
										{message.date}
									</p>
								</div>
								<Button variant="ghost" size="sm" className="ml-2" asChild>
									<Link href={`/admin/messages?id=${message.id}`}>View</Link>
								</Button>
							</div>
						))}
					</div>
				) : (
					<div className="flex items-center justify-center h-[200px]">
						<p className="text-muted-foreground">No recent messages</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
