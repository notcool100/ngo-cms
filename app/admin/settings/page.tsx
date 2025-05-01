"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Shield, Globe, Bell, Database, Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useSiteSettings } from "@/lib/contexts/site-settings-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
	const {
		settings,
		isLoading,
		error,
		updateGeneralSettings,
		updateNotificationSettings,
		updateAdvancedSettings,
	} = useSettings();
	
	const { refreshSettings: refreshGlobalSettings } = useSiteSettings();

	// Form states
	const [generalForm, setGeneralForm] = useState({
		siteName: "",
		siteDescription: "",
		contactEmail: "",
		maintenanceMode: false,
	});

	const [notificationForm, setNotificationForm] = useState({
		emailNotifications: true,
		donationAlerts: true,
		volunteerAlerts: true,
		contactFormAlerts: true,
	});

	const [advancedForm, setAdvancedForm] = useState({
		backupFrequency: "weekly",
		cacheLifetime: 3600,
		debugMode: false,
	});

	const [isSaving, setIsSaving] = useState(false);

	// Update form states when settings are loaded
	useEffect(() => {
		if (settings) {
			setGeneralForm({
				siteName: settings.siteName,
				siteDescription: settings.siteDescription,
				contactEmail: settings.contactEmail,
				maintenanceMode: settings.maintenanceMode,
			});

			setNotificationForm({
				emailNotifications: settings.emailNotifications,
				donationAlerts: settings.donationAlerts,
				volunteerAlerts: settings.volunteerAlerts,
				contactFormAlerts: settings.contactFormAlerts,
			});

			setAdvancedForm({
				backupFrequency: settings.backupFrequency,
				cacheLifetime: settings.cacheLifetime,
				debugMode: settings.debugMode,
			});
		}
	}, [settings]);

	const handleSaveGeneralSettings = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		await updateGeneralSettings(generalForm);
		// Refresh global settings to update the UI
		await refreshGlobalSettings();
		setIsSaving(false);
	};

	const handleSaveNotificationSettings = async () => {
		setIsSaving(true);
		await updateNotificationSettings(notificationForm);
		setIsSaving(false);
	};

	const handleSaveAdvancedSettings = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		await updateAdvancedSettings(advancedForm);
		setIsSaving(false);
	};

	if (isLoading && !settings) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<span className="ml-2">Loading settings...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-destructive">Error Loading Settings</h2>
					<p className="text-muted-foreground mt-2">{error}</p>
					<Button className="mt-4" onClick={() => window.location.reload()}>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

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
							<form onSubmit={handleSaveGeneralSettings}>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="siteName">Site Name</Label>
										<Input 
											id="siteName" 
											value={generalForm.siteName} 
											onChange={(e) => setGeneralForm({...generalForm, siteName: e.target.value})}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="siteDescription">Site Description</Label>
										<Input
											id="siteDescription"
											value={generalForm.siteDescription}
											onChange={(e) => setGeneralForm({...generalForm, siteDescription: e.target.value})}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="contactEmail">Contact Email</Label>
										<Input
											id="contactEmail"
											type="email"
											value={generalForm.contactEmail}
											onChange={(e) => setGeneralForm({...generalForm, contactEmail: e.target.value})}
										/>
									</div>
									<div className="flex items-center gap-2">
										<Switch 
											id="maintenanceMode" 
											checked={generalForm.maintenanceMode}
											onCheckedChange={(checked) => setGeneralForm({...generalForm, maintenanceMode: checked})}
										/>
										<Label htmlFor="maintenanceMode">Maintenance Mode</Label>
									</div>
									<Button type="submit" disabled={isSaving || isLoading}>
										{isSaving ? "Saving..." : "Save Changes"}
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
								<Switch 
									checked={notificationForm.emailNotifications}
									onCheckedChange={(checked) => setNotificationForm({...notificationForm, emailNotifications: checked})}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">New Donation Alerts</p>
									<p className="text-sm text-muted-foreground">
										Get notified when a new donation is received
									</p>
								</div>
								<Switch 
									checked={notificationForm.donationAlerts}
									onCheckedChange={(checked) => setNotificationForm({...notificationForm, donationAlerts: checked})}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">New Volunteer Applications</p>
									<p className="text-sm text-muted-foreground">
										Get notified when someone applies to volunteer
									</p>
								</div>
								<Switch 
									checked={notificationForm.volunteerAlerts}
									onCheckedChange={(checked) => setNotificationForm({...notificationForm, volunteerAlerts: checked})}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Contact Form Submissions</p>
									<p className="text-sm text-muted-foreground">
										Get notified when someone submits the contact form
									</p>
								</div>
								<Switch 
									checked={notificationForm.contactFormAlerts}
									onCheckedChange={(checked) => setNotificationForm({...notificationForm, contactFormAlerts: checked})}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button 
								onClick={handleSaveNotificationSettings}
								disabled={isSaving || isLoading}
							>
								{isSaving ? "Saving..." : "Save Notification Settings"}
							</Button>
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
								<form onSubmit={handleSaveAdvancedSettings}>
									<div className="grid gap-4">
										<div className="grid gap-2">
											<Label htmlFor="backupFrequency">Backup Frequency</Label>
											<Select 
												value={advancedForm.backupFrequency}
												onValueChange={(value) => setAdvancedForm({...advancedForm, backupFrequency: value})}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select backup frequency" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="daily">Daily</SelectItem>
													<SelectItem value="weekly">Weekly</SelectItem>
													<SelectItem value="monthly">Monthly</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="cacheLifetime">
												Cache Lifetime (seconds)
											</Label>
											<Input
												id="cacheLifetime"
												type="number"
												value={advancedForm.cacheLifetime}
												onChange={(e) => setAdvancedForm({...advancedForm, cacheLifetime: parseInt(e.target.value, 10)})}
											/>
										</div>
										<div className="flex items-center gap-2">
											<Switch 
												id="debugMode" 
												checked={advancedForm.debugMode}
												onCheckedChange={(checked) => setAdvancedForm({...advancedForm, debugMode: checked})}
											/>
											<Label htmlFor="debugMode">Debug Mode</Label>
										</div>
										<Button type="submit" disabled={isSaving || isLoading}>
											{isSaving ? "Saving..." : "Save Advanced Settings"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</PermissionGate>
				</TabsContent>
			</Tabs>
		</div>
	);
}
