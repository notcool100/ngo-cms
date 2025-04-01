"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import {
	ArrowUpRight,
	Download,
	DollarSign,
	Users,
	Calendar,
	FileText,
} from "lucide-react";
import { usePermissions } from "hooks/use-permissions";
import { PermissionGate } from "components/auth/permission-gate";
import { FadeIn } from "components/animations/fade-in";
import { StaggerChildren } from "components/animations/stagger-children";
import { StaggerItem } from "components/animations/stagger-item";

// Dashboard types
interface DashboardStats {
	totalDonations: number;
	lastMonthDonations: number;
	activePrograms: number;
	newVolunteers: number;
	upcomingEvents: number;
	monthlyDonations: { month: string; amount: number }[];
	recentDonations: {
		id: string;
		amount: number;
		currency: string;
		name: string;
		date: string;
	}[];
	programCategories: {
		name: string;
		count: number;
	}[];
	recentEvents: {
		id: string;
		title: string;
		date: string;
		location: string;
		attendees: number;
	}[];
	recentMessages: {
		id: string;
		name: string;
		email: string;
		subject: string;
		date: string;
		read: boolean;
	}[];
}

// Colors for charts
const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884d8",
	"#82ca9d",
];

export default function AdminDashboard() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const { toast } = useToast();
	const { hasPermission } = usePermissions();

	const fetchDashboardStats = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/dashboard/stats");

			if (!response.ok) {
				throw new Error("Failed to fetch dashboard stats");
			}

			const data = await response.json();
			setStats(data);
		} catch (error) {
			console.error("Error fetching dashboard stats:", error);
			toast({
				title: "Error",
				description: "Failed to load dashboard data. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardStats();

		// Refresh data every 5 minutes
		const interval = setInterval(
			() => {
				fetchDashboardStats();
			},
			5 * 60 * 1000,
		);

		return () => clearInterval(interval);
	}, []);

	const handleRefresh = () => {
		fetchDashboardStats();
		toast({
			title: "Refreshed",
			description: "Dashboard data has been refreshed.",
		});
	};

	const handleDownloadReport = (reportType: string) => {
		toast({
			title: "Downloading Report",
			description: `${reportType} report is being generated and will download shortly.`,
		});

		// Implement actual download logic here
		window.open(
			`/api/reports/${reportType.toLowerCase()}?format=csv`,
			"_blank",
		);
	};

	if (loading && !stats) {
		return (
			<div className="flex h-[calc(100vh-120px)] items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
					<p className="text-sm text-muted-foreground">
						Loading dashboard data...
					</p>
				</div>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="flex h-[calc(100vh-120px)] items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<p className="text-lg font-medium">Failed to load dashboard data</p>
					<Button onClick={handleRefresh}>Try Again</Button>
				</div>
			</div>
		);
	}

	return (
		<FadeIn>
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={handleRefresh}>
							Refresh Data
						</Button>
						<PermissionGate permission="download:reports">
							<Button size="sm">
								<Download className="mr-2 h-4 w-4" />
								Download Reports
							</Button>
						</PermissionGate>
					</div>
				</div>

				<Tabs
					defaultValue="overview"
					value={activeTab}
					onValueChange={setActiveTab}
				>
					<TabsList className="grid w-full max-w-md grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
						<TabsTrigger value="reports">Reports</TabsTrigger>
						<TabsTrigger value="notifications">Notifications</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<StaggerChildren>
							{/* Stats Cards */}
							<StaggerItem>
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Total Donations
											</CardTitle>
											<DollarSign className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												${stats.totalDonations.toLocaleString()}
											</div>
											<p className="text-xs text-muted-foreground">
												+${stats.lastMonthDonations.toLocaleString()} this month
											</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Active Programs
											</CardTitle>
											<FileText className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{stats.activePrograms}
											</div>
											<p className="text-xs text-muted-foreground">
												Across {stats.programCategories.length} categories
											</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												New Volunteers
											</CardTitle>
											<Users className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{stats.newVolunteers}
											</div>
											<p className="text-xs text-muted-foreground">
												In the last 30 days
											</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Upcoming Events
											</CardTitle>
											<Calendar className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{stats.upcomingEvents}
											</div>
											<p className="text-xs text-muted-foreground">
												Events scheduled
											</p>
										</CardContent>
									</Card>
								</div>
							</StaggerItem>

							{/* Donation Chart */}
							<StaggerItem>
								<Card>
									<CardHeader>
										<CardTitle>Donation Overview</CardTitle>
										<CardDescription>
											Monthly donation trends for the current year
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[300px]">
											<ResponsiveContainer width="100%" height="100%">
												<BarChart
													data={stats.monthlyDonations}
													margin={{
														top: 5,
														right: 30,
														left: 20,
														bottom: 5,
													}}
												>
													<CartesianGrid strokeDasharray="3 3" />
													<XAxis dataKey="month" />
													<YAxis />
													<Tooltip
														formatter={(value) => [`$${value}`, "Amount"]}
														labelFormatter={(label) => `Month: ${label}`}
													/>
													<Bar dataKey="amount" fill="#8884d8" />
												</BarChart>
											</ResponsiveContainer>
										</div>
									</CardContent>
								</Card>
							</StaggerItem>

							{/* Recent Donations and Program Categories */}
							<StaggerItem>
								<div className="grid gap-4 md:grid-cols-2">
									{/* Recent Donations */}
									<Card>
										<CardHeader>
											<CardTitle>Recent Donations</CardTitle>
											<CardDescription>
												Latest donations received
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												{stats.recentDonations.map((donation) => (
													<div key={donation.id} className="flex items-center">
														<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
															<DollarSign className="h-5 w-5 text-primary" />
														</div>
														<div className="ml-4 space-y-1">
															<p className="text-sm font-medium leading-none">
																{donation.name}
															</p>
															<p className="text-sm text-muted-foreground">
																${donation.amount} {donation.currency}
															</p>
														</div>
														<div className="ml-auto font-medium text-xs text-muted-foreground">
															{donation.date}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>

									{/* Program Categories */}
									<Card>
										<CardHeader>
											<CardTitle>Program Categories</CardTitle>
											<CardDescription>
												Distribution of active programs by category
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="h-[250px]">
												<ResponsiveContainer width="100%" height="100%">
													<PieChart>
														<Pie
															data={stats.programCategories}
															cx="50%"
															cy="50%"
															labelLine={false}
															outerRadius={80}
															fill="#8884d8"
															dataKey="count"
															nameKey="name"
															label={({ name, percent }) =>
																`${name}: ${(percent * 100).toFixed(0)}%`
															}
														>
															{stats.programCategories.map((entry, index) => (
																<Cell
																	key={`cell-${index}`}
																	fill={COLORS[index % COLORS.length]}
																/>
															))}
														</Pie>
														<Tooltip
															formatter={(value) => [
																`${value} programs`,
																"Count",
															]}
														/>
														<Legend />
													</PieChart>
												</ResponsiveContainer>
											</div>
										</CardContent>
									</Card>
								</div>
							</StaggerItem>

							{/* Recent Events and Messages */}
							<StaggerItem>
								<div className="grid gap-4 md:grid-cols-2">
									{/* Recent Events */}
									<Card>
										<CardHeader>
											<CardTitle>Recent Events</CardTitle>
											<CardDescription>
												Upcoming and recent events
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												{stats.recentEvents.map((event) => (
													<div key={event.id} className="flex items-center">
														<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
															<Calendar className="h-5 w-5 text-primary" />
														</div>
														<div className="ml-4 space-y-1">
															<p className="text-sm font-medium leading-none">
																{event.title}
															</p>
															<p className="text-sm text-muted-foreground">
																{event.location} • {event.attendees} attendees
															</p>
														</div>
														<div className="ml-auto font-medium text-xs text-muted-foreground">
															{event.date}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>

									{/* Recent Messages */}
									<Card>
										<CardHeader>
											<CardTitle>Recent Messages</CardTitle>
											<CardDescription>
												Latest contact form submissions
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												{stats.recentMessages.map((message) => (
													<div key={message.id} className="flex items-center">
														<div
															className={`flex h-9 w-9 items-center justify-center rounded-full ${message.read ? "bg-muted" : "bg-primary/10"}`}
														>
															<div
																className={`h-2 w-2 rounded-full ${message.read ? "bg-muted-foreground" : "bg-primary"}`}
															/>
														</div>
														<div className="ml-4 space-y-1">
															<p className="text-sm font-medium leading-none">
																{message.name}
															</p>
															<p className="text-sm text-muted-foreground">
																{message.subject}
															</p>
														</div>
														<div className="ml-auto font-medium text-xs text-muted-foreground">
															{message.date}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</div>
							</StaggerItem>
						</StaggerChildren>
					</TabsContent>

					{/* Analytics Tab */}
					<TabsContent value="analytics" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Donation Analytics</CardTitle>
								<CardDescription>
									Detailed analysis of donation patterns and trends
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[400px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={stats.monthlyDonations}
											margin={{
												top: 5,
												right: 30,
												left: 20,
												bottom: 5,
											}}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="month" />
											<YAxis />
											<Tooltip
												formatter={(value) => [`$${value}`, "Amount"]}
												labelFormatter={(label) => `Month: ${label}`}
											/>
											<Legend />
											<Bar
												dataKey="amount"
												name="Donation Amount"
												fill="#8884d8"
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
								<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
									<Card>
										<CardHeader className="p-4">
											<CardTitle className="text-sm">
												Average Donation
											</CardTitle>
										</CardHeader>
										<CardContent className="p-4 pt-0">
											<div className="text-2xl font-bold">
												$
												{stats.totalDonations > 0 &&
												stats.recentDonations.length > 0
													? Math.round(
															stats.totalDonations /
																stats.recentDonations.length,
														)
													: 0}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="p-4">
											<CardTitle className="text-sm">Donation Growth</CardTitle>
										</CardHeader>
										<CardContent className="p-4 pt-0">
											<div className="flex items-center">
												<div className="text-2xl font-bold">
													{stats.lastMonthDonations > 0
														? `+${Math.round((stats.lastMonthDonations / stats.totalDonations) * 100)}%`
														: "0%"}
												</div>
												<ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="p-4">
											<CardTitle className="text-sm">
												Projected Annual
											</CardTitle>
										</CardHeader>
										<CardContent className="p-4 pt-0">
											<div className="text-2xl font-bold">
												$
												{Math.round(
													stats.totalDonations * 1.2,
												).toLocaleString()}
											</div>
										</CardContent>
									</Card>
								</div>
							</CardContent>
						</Card>

						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Program Distribution</CardTitle>
									<CardDescription>Active programs by category</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={stats.programCategories}
													cx="50%"
													cy="50%"
													labelLine={false}
													outerRadius={100}
													fill="#8884d8"
													dataKey="count"
													nameKey="name"
													label={({ name, percent }) =>
														`${name}: ${(percent * 100).toFixed(0)}%`
													}
												>
													{stats.programCategories.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip
													formatter={(value) => [`${value} programs`, "Count"]}
												/>
												<Legend />
											</PieChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Event Attendance</CardTitle>
									<CardDescription>
										Recent event attendance statistics
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{stats.recentEvents.map((event) => (
											<div key={event.id} className="space-y-2">
												<div className="flex items-center justify-between">
													<p className="text-sm font-medium">{event.title}</p>
													<p className="text-sm text-muted-foreground">
														{event.date}
													</p>
												</div>
												<div className="h-2 w-full rounded-full bg-muted">
													<div
														className="h-2 rounded-full bg-primary"
														style={{
															width: `${Math.min(event.attendees * 5, 100)}%`,
														}}
													/>
												</div>
												<p className="text-xs text-muted-foreground">
													{event.attendees} attendees
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Reports Tab */}
					<TabsContent value="reports" className="space-y-6">
						<PermissionGate permission="download:reports">
							<div className="grid gap-4 md:grid-cols-3">
								<Card>
									<CardHeader>
										<CardTitle>Donation Reports</CardTitle>
										<CardDescription>
											Export donation data for analysis
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-2">
												<label className="text-sm font-medium">
													Start Date
												</label>
												<input
													type="date"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-sm font-medium">End Date</label>
												<input
													type="date"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												/>
											</div>
										</div>
										<Button
											className="w-full"
											onClick={() => handleDownloadReport("Donations")}
										>
											<Download className="mr-2 h-4 w-4" />
											Download Report
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Volunteer Reports</CardTitle>
										<CardDescription>
											Export volunteer data for analysis
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-2">
												<label className="text-sm font-medium">
													Start Date
												</label>
												<input
													type="date"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-sm font-medium">End Date</label>
												<input
													type="date"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												/>
											</div>
										</div>
										<Button
											className="w-full"
											onClick={() => handleDownloadReport("Volunteers")}
										>
											<Download className="mr-2 h-4 w-4" />
											Download Report
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Event Reports</CardTitle>
										<CardDescription>
											Export event data for analysis
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-2">
												<label className="text-sm font-medium">
													Start Date
												</label>
												<input
													type="date"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-sm font-medium">End Date</label>
												<input
													type="date"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												/>
											</div>
										</div>
										<Button
											className="w-full"
											onClick={() => handleDownloadReport("Events")}
										>
											<Download className="mr-2 h-4 w-4" />
											Download Report
										</Button>
									</CardContent>
								</Card>
							</div>
						</PermissionGate>

						{!hasPermission("download:reports") && (
							<div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
								<div className="flex flex-col items-center gap-2 text-center">
									<p className="text-sm text-muted-foreground">
										You don't have permission to access reports.
									</p>
								</div>
							</div>
						)}
					</TabsContent>

					{/* Notifications Tab */}
					<TabsContent value="notifications" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>System Notifications</CardTitle>
								<CardDescription>
									Recent system activity and notifications
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{stats.recentDonations.map((donation, index) => (
										<div
											key={`notification-${index}`}
											className="flex items-start gap-4 rounded-lg border p-4"
										>
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
												<DollarSign className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm font-medium">
													New Donation Received
												</p>
												<p className="text-sm text-muted-foreground">
													{donation.name} donated ${donation.amount}{" "}
													{donation.currency}
												</p>
											</div>
											<div className="text-xs text-muted-foreground">
												{donation.date}
											</div>
										</div>
									))}

									{stats.recentMessages.map((message, index) => (
										<div
											key={`message-notification-${index}`}
											className="flex items-start gap-4 rounded-lg border p-4"
										>
											<div
												className={`flex h-9 w-9 items-center justify-center rounded-full ${message.read ? "bg-muted" : "bg-primary/10"}`}
											>
												<div
													className={`h-2 w-2 rounded-full ${message.read ? "bg-muted-foreground" : "bg-primary"}`}
												/>
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm font-medium">
													New Contact Message
												</p>
												<p className="text-sm text-muted-foreground">
													{message.name} sent a message: {message.subject}
												</p>
											</div>
											<div className="text-xs text-muted-foreground">
												{message.date}
											</div>
										</div>
									))}

									{stats.recentEvents.length > 0 && (
										<div className="flex items-start gap-4 rounded-lg border p-4">
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
												<Calendar className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm font-medium">
													Upcoming Event Reminder
												</p>
												<p className="text-sm text-muted-foreground">
													Event "{stats.recentEvents[0].title}" is scheduled for{" "}
													{stats.recentEvents[0].date}
												</p>
											</div>
											<div className="text-xs text-muted-foreground">
												2 days ago
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</FadeIn>
	);
}
