import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecentEvent {
	id: string;
	title: string;
	date: string;
	location: string;
	attendees: number;
}

interface RecentEventsProps {
	events: RecentEvent[];
}

export function RecentEvents({ events }: RecentEventsProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Upcoming Events</CardTitle>
					<CardDescription>Next events on the calendar</CardDescription>
				</div>
				<Button variant="outline" size="sm" asChild>
					<Link href="/admin/events">View All</Link>
				</Button>
			</CardHeader>
			<CardContent>
				{events.length > 0 ? (
					<div className="space-y-6">
						{events.map((event) => (
							<div key={event.id} className="flex flex-col space-y-2">
								<h3 className="font-medium">{event.title}</h3>
								<div className="flex items-center text-sm text-muted-foreground">
									<Calendar className="mr-1 h-4 w-4" />
									<span>{event.date}</span>
								</div>
								<div className="flex items-center text-sm text-muted-foreground">
									<MapPin className="mr-1 h-4 w-4" />
									<span>{event.location}</span>
								</div>
								<div className="flex items-center text-sm text-muted-foreground">
									<Users className="mr-1 h-4 w-4" />
									<span>{event.attendees} attendees</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									className="mt-2 w-full"
									asChild
								>
									<Link href={`/admin/events/${event.id}/attendees`}>
										Manage Attendees
									</Link>
								</Button>
							</div>
						))}
					</div>
				) : (
					<div className="flex items-center justify-center h-[200px]">
						<p className="text-muted-foreground">No upcoming events</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
