"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
	Calendar,
	CreditCard,
	DollarSign,
	Download,
	PieChart,
	Users,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AdminLoading } from "@/components/admin/loading";

interface DashboardStats {
	totalDonations: number;
	lastMonthDonations: number;
	activePrograms: number;
	newVolunteers: number;
	upcomingEvents: number;
	recentDonations: {
		id: string;
		name: string | null;
		amount: number;
		currency: string;
		date: string;
	}[];
}

export default function AdminDashboard() {
	const { status } = useSession();
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>({
		totalDonations: 0,
		lastMonthDonations: 0,
		activePrograms: 0,
		newVolunteers: 0,
		upcomingEvents: 0,
		recentDonations: [],
	});

	useEffect(() => {
		// Fetch dashboard data
		if (status === "authenticated") {
			fetchDashboardData();
		}
	}, [status]);

	const fetchDashboardData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/dashboard/stats");

			if (!response.ok) {
				throw new Error("Failed to fetch dashboard data");
			}

			const data = await response.json();
			setStats(data);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			toast({
				title: "Error",
				description: "Failed to load dashboard data",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <AdminLoading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={fetchDashboardData}>
						Refresh Data
					</Button>
					<Button variant="outline" size="sm">
						<Download className="mr-2 h-4 w-4" />
						Download Reports
					</Button>
				</div>
			</div>
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
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
									${stats.lastMonthDonations.toLocaleString()} in the last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Active Programs
								</CardTitle>
								<PieChart className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.activePrograms}</div>
								<p className="text-xs text-muted-foreground">
									Across all categories
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
								<div className="text-2xl font-bold">{stats.newVolunteers}</div>
								<p className="text-xs text-muted-foreground">
									In the last month
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
								<div className="text-2xl font-bold">{stats.upcomingEvents}</div>
								<p className="text-xs text-muted-foreground">
									Published events
								</p>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Donation Overview</CardTitle>
								<CardDescription>
									Monthly donation trends for the current year
								</CardDescription>
							</CardHeader>
							<CardContent className="pl-2">
								<div className="h-[300px] relative">
									<div className="absolute inset-0 flex items-center justify-center">
										<p className="text-sm text-muted-foreground">
											Bar chart placeholder - In a real implementation, this
											would be an interactive chart
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Recent Donations</CardTitle>
								<CardDescription>Latest donations received</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{stats.recentDonations.length > 0 ? (
										stats.recentDonations.map((donation) => (
											<div key={donation.id} className="flex items-center">
												<div className="flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
													<CreditCard className="h-5 w-5" />
												</div>
												<div className="ml-4 space-y-1">
													<p className="text-sm font-medium leading-none">
														{donation.name || "Anonymous"}
													</p>
													<p className="text-sm text-muted-foreground">
														{donation.date}
													</p>
												</div>
												<div className="ml-auto font-medium">
													{donation.currency} {donation.amount.toLocaleString()}
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground text-center py-8">
											No recent donations
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="analytics" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Analytics Content</CardTitle>
							<CardDescription>
								Detailed analytics would be displayed here in a real
								implementation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px] flex items-center justify-center border rounded-md">
								<p className="text-muted-foreground">
									Analytics dashboard placeholder
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="reports" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Reports Content</CardTitle>
							<CardDescription>
								Generated reports would be displayed here in a real
								implementation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px] flex items-center justify-center border rounded-md">
								<p className="text-muted-foreground">
									Reports dashboard placeholder
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Notifications Content</CardTitle>
							<CardDescription>
								System notifications would be displayed here in a real
								implementation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px] flex items-center justify-center border rounded-md">
								<p className="text-muted-foreground">
									Notifications dashboard placeholder
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
