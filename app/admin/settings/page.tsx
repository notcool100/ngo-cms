"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { PermissionGate } from "@/components/auth/permission-gate";
import { Shield, Globe, Bell, Database } from "lucide-react";

export default function SettingsPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleSaveSettings = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			toast({
				title: "Settings saved",
				description: "Your settings have been saved successfully.",
			});
		}, 1000);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
			</div>

			<Tabs defaultValue="general">
				<TabsList>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<PermissionGate permission="manage:settings">
						<TabsTrigger value="advanced">Advanced</TabsTrigger>
					</PermissionGate>
				</TabsList>
				<TabsContent value="general" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>General Settings</CardTitle>
							<CardDescription>
								Manage your website's general settings
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<form onSubmit={handleSaveSettings}>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="siteName">Site Name</Label>
										<Input id="siteName" defaultValue="Empower Together" />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="siteDescription">Site Description</Label>
										<Input
											id="siteDescription"
											defaultValue="Empowering women through education and support"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="contactEmail">Contact Email</Label>
										<Input
											id="contactEmail"
											type="email"
											defaultValue="contact@empowertogether.org"
										/>
									</div>
									<div className="flex items-center gap-2">
										<Switch id="maintenanceMode" />
										<Label htmlFor="maintenanceMode">Maintenance Mode</Label>
									</div>
									<Button type="submit" disabled={isLoading}>
										{isLoading ? "Saving..." : "Save Changes"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<PermissionGate permission="manage:settings">
						<Card>
							<CardHeader className="flex flex-row items-center gap-4">
								<Shield className="h-6 w-6 text-primary" />
								<div>
									<CardTitle>Role Management</CardTitle>
									<CardDescription>
										View and manage user roles and permissions
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									Configure access control and permissions for different user
									roles in the system.
								</p>
							</CardContent>
							<CardFooter>
								<Button variant="outline" asChild>
									<Link href="/admin/settings/roles">Manage Roles</Link>
								</Button>
							</CardFooter>
						</Card>
					</PermissionGate>

					<Card>
						<CardHeader className="flex flex-row items-center gap-4">
							<Globe className="h-6 w-6 text-primary" />
							<div>
								<CardTitle>Site Configuration</CardTitle>
								<CardDescription>
									Configure website appearance and behavior
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-4">
								Manage your website's appearance, SEO settings, and social media
								integration.
							</p>
						</CardContent>
						<CardFooter>
							<Button variant="outline">Configure Site</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center gap-4">
							<Bell className="h-6 w-6 text-primary" />
							<div>
								<CardTitle>Notification Settings</CardTitle>
								<CardDescription>
									Configure email and system notifications
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Email Notifications</p>
									<p className="text-sm text-muted-foreground">
										Receive email notifications for important events
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">New Donation Alerts</p>
									<p className="text-sm text-muted-foreground">
										Get notified when a new donation is received
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">New Volunteer Applications</p>
									<p className="text-sm text-muted-foreground">
										Get notified when someone applies to volunteer
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Contact Form Submissions</p>
									<p className="text-sm text-muted-foreground">
										Get notified when someone submits the contact form
									</p>
								</div>
								<Switch defaultChecked />
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Notification Settings</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="advanced" className="space-y-4">
					<PermissionGate permission="manage:settings">
						<Card>
							<CardHeader className="flex flex-row items-center gap-4">
								<Database className="h-6 w-6 text-primary" />
								<div>
									<CardTitle>Database Settings</CardTitle>
									<CardDescription>
										Advanced database configuration options
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									These settings are for advanced users only. Incorrect
									configuration may cause system issues.
								</p>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="backupFrequency">Backup Frequency</Label>
										<select
											id="backupFrequency"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<option value="daily">Daily</option>
											<option value="weekly">Weekly</option>
											<option value="monthly">Monthly</option>
										</select>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="cacheLifetime">
											Cache Lifetime (seconds)
										</Label>
										<Input
											id="cacheLifetime"
											type="number"
											defaultValue="3600"
										/>
									</div>
									<div className="flex items-center gap-2">
										<Switch id="debugMode" />
										<Label htmlFor="debugMode">Debug Mode</Label>
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save Advanced Settings</Button>
							</CardFooter>
						</Card>
					</PermissionGate>
				</TabsContent>
			</Tabs>
		</div>
	);
}
