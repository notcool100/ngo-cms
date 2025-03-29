"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Download,
	BarChart,
	PieChart,
	LineChart,
	Calendar,
} from "lucide-react";

export default function ReportsPage() {
	const [timeRange, setTimeRange] = useState("month");

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Reports</h1>
				<div className="flex items-center gap-4">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select time range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">Last 7 days</SelectItem>
							<SelectItem value="month">Last 30 days</SelectItem>
							<SelectItem value="quarter">Last 3 months</SelectItem>
							<SelectItem value="year">Last 12 months</SelectItem>
							<SelectItem value="all">All time</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export Reports
					</Button>
				</div>
			</div>

			<Tabs defaultValue="donations">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="donations">Donations</TabsTrigger>
					<TabsTrigger value="programs">Programs</TabsTrigger>
					<TabsTrigger value="events">Events</TabsTrigger>
					<TabsTrigger value="volunteers">Volunteers</TabsTrigger>
				</TabsList>

				<TabsContent value="donations" className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Donations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">$45,231.89</div>
								<p className="text-xs text-muted-foreground">
									+20.1% from previous period
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Average Donation
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">$78.45</div>
								<p className="text-xs text-muted-foreground">
									+5.2% from previous period
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Number of Donors
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">576</div>
								<p className="text-xs text-muted-foreground">
									+12.3% from previous period
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Recurring Donations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">$3,450.00</div>
								<p className="text-xs text-muted-foreground">
									Monthly recurring revenue
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Donation Trends</CardTitle>
								<CardDescription>
									Monthly donation amounts over time
								</CardDescription>
							</CardHeader>
							<CardContent className="h-[300px] flex items-center justify-center">
								<div className="flex flex-col items-center gap-2 text-center">
									<LineChart className="h-16 w-16 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										Line chart placeholder - In a real implementation, this
										would be an interactive chart
									</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Donation Sources</CardTitle>
								<CardDescription>
									Breakdown by program and campaign
								</CardDescription>
							</CardHeader>
							<CardContent className="h-[300px] flex items-center justify-center">
								<div className="flex flex-col items-center gap-2 text-center">
									<PieChart className="h-16 w-16 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										Pie chart placeholder - In a real implementation, this would
										be an interactive chart
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="programs" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Program Performance</CardTitle>
							<CardDescription>
								Engagement and impact metrics by program
							</CardDescription>
						</CardHeader>
						<CardContent className="h-[400px] flex items-center justify-center">
							<div className="flex flex-col items-center gap-2 text-center">
								<BarChart className="h-16 w-16 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Bar chart placeholder - In a real implementation, this would
									be an interactive chart showing program metrics
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="events" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Event Attendance</CardTitle>
							<CardDescription>
								Attendance and engagement metrics by event
							</CardDescription>
						</CardHeader>
						<CardContent className="h-[400px] flex items-center justify-center">
							<div className="flex flex-col items-center gap-2 text-center">
								<Calendar className="h-16 w-16 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Calendar chart placeholder - In a real implementation, this
									would be an interactive chart showing event metrics
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="volunteers" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Volunteer Engagement</CardTitle>
							<CardDescription>
								Volunteer hours and participation metrics
							</CardDescription>
						</CardHeader>
						<CardContent className="h-[400px] flex items-center justify-center">
							<div className="flex flex-col items-center gap-2 text-center">
								<BarChart className="h-16 w-16 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Bar chart placeholder - In a real implementation, this would
									be an interactive chart showing volunteer metrics
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
