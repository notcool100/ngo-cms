"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

// Sample data for demonstration
const donationData = [
	{ name: "Jan", current: 4000, previous: 2400 },
	{ name: "Feb", current: 3000, previous: 1398 },
	{ name: "Mar", current: 2000, previous: 9800 },
	{ name: "Apr", current: 2780, previous: 3908 },
	{ name: "May", current: 1890, previous: 4800 },
	{ name: "Jun", current: 2390, previous: 3800 },
	{ name: "Jul", current: 3490, previous: 4300 },
	{ name: "Aug", current: 4000, previous: 2400 },
	{ name: "Sep", current: 3000, previous: 1398 },
	{ name: "Oct", current: 2000, previous: 9800 },
	{ name: "Nov", current: 2780, previous: 3908 },
	{ name: "Dec", current: 1890, previous: 4800 },
];

const volunteerData = [
	{ name: "Jan", count: 10 },
	{ name: "Feb", count: 15 },
	{ name: "Mar", count: 12 },
	{ name: "Apr", count: 8 },
	{ name: "May", count: 20 },
	{ name: "Jun", count: 25 },
	{ name: "Jul", count: 18 },
	{ name: "Aug", count: 22 },
	{ name: "Sep", count: 30 },
	{ name: "Oct", count: 28 },
	{ name: "Nov", count: 35 },
	{ name: "Dec", count: 40 },
];

const eventData = [
	{ name: "Jan", attendees: 50, events: 2 },
	{ name: "Feb", attendees: 80, events: 3 },
	{ name: "Mar", attendees: 120, events: 4 },
	{ name: "Apr", attendees: 90, events: 3 },
	{ name: "May", attendees: 150, events: 5 },
	{ name: "Jun", attendees: 200, events: 6 },
	{ name: "Jul", attendees: 180, events: 5 },
	{ name: "Aug", attendees: 220, events: 7 },
	{ name: "Sep", attendees: 250, events: 8 },
	{ name: "Oct", attendees: 300, events: 9 },
	{ name: "Nov", attendees: 280, events: 8 },
	{ name: "Dec", attendees: 350, events: 10 },
];

export function AnalyticsTab() {
	return (
		<div className="space-y-4">
			<Tabs defaultValue="donations">
				<TabsList>
					<TabsTrigger value="donations">Donations</TabsTrigger>
					<TabsTrigger value="volunteers">Volunteers</TabsTrigger>
					<TabsTrigger value="events">Events</TabsTrigger>
				</TabsList>

				<TabsContent value="donations" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Donation Trends</CardTitle>
							<CardDescription>Comparison with previous year</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={donationData}
										margin={{
											top: 5,
											right: 30,
											left: 20,
											bottom: 5,
										}}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip formatter={(value) => [`$${value}`, ""]} />
										<Legend />
										<Line
											type="monotone"
											dataKey="current"
											name="Current Year"
											stroke="#8884d8"
											activeDot={{ r: 8 }}
										/>
										<Line
											type="monotone"
											dataKey="previous"
											name="Previous Year"
											stroke="#82ca9d"
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Donation Sources</CardTitle>
								<CardDescription>
									Where donations are coming from
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] flex items-center justify-center">
									<p className="text-muted-foreground">
										Donation sources chart would go here
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Donation Growth</CardTitle>
								<CardDescription>Year-over-year growth</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] flex items-center justify-center">
									<p className="text-muted-foreground">
										Donation growth chart would go here
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="volunteers" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Volunteer Signups</CardTitle>
							<CardDescription>Monthly volunteer registrations</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={volunteerData}
										margin={{
											top: 5,
											right: 30,
											left: 20,
											bottom: 5,
										}}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Line
											type="monotone"
											dataKey="count"
											name="Volunteers"
											stroke="#8884d8"
											activeDot={{ r: 8 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="events" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Event Attendance</CardTitle>
							<CardDescription>
								Monthly event attendance and count
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={eventData}
										margin={{
											top: 5,
											right: 30,
											left: 20,
											bottom: 5,
										}}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis yAxisId="left" />
										<YAxis yAxisId="right" orientation="right" />
										<Tooltip />
										<Legend />
										<Line
											yAxisId="left"
											type="monotone"
											dataKey="attendees"
											name="Attendees"
											stroke="#8884d8"
											activeDot={{ r: 8 }}
										/>
										<Line
											yAxisId="right"
											type="monotone"
											dataKey="events"
											name="Events"
											stroke="#82ca9d"
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
