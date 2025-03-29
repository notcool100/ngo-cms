"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleBadge } from "@/components/admin/role-badge";
import { getPermissionsForRole, type Role } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function RoleSettingsPage() {
	const [isLoading, setIsLoading] = useState(false);
	const permissions = usePermissions();

	if (!permissions.hasPermission("manage:settings")) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<Alert className="max-w-md">
					<InfoIcon className="h-4 w-4" />
					<AlertTitle>Access Denied</AlertTitle>
					<AlertDescription>
						You don't have permission to view role settings. Please contact an
						administrator if you need access.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const roles: Role[] = ["ADMIN", "EDITOR", "USER"];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Role Settings</h1>
				<p className="text-muted-foreground mt-2">
					View and understand the permissions assigned to each role in the
					system
				</p>
			</div>

			<Tabs defaultValue="ADMIN">
				<TabsList>
					{roles.map((role) => (
						<TabsTrigger key={role} value={role}>
							{role}
						</TabsTrigger>
					))}
				</TabsList>

				{roles.map((role) => (
					<TabsContent key={role} value={role}>
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-xl">{role} Role</CardTitle>
										<CardDescription>
											Permissions and capabilities for the {role.toLowerCase()}{" "}
											role
										</CardDescription>
									</div>
									<RoleBadge role={role} />
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-medium mb-2">
											Role Description
										</h3>
										<p className="text-sm text-muted-foreground">
											{role === "ADMIN" &&
												"Administrators have full access to all features and settings of the platform."}
											{role === "EDITOR" &&
												"Editors can create and manage content but have limited access to system settings."}
											{role === "USER" &&
												"Regular users have basic access to the platform with no administrative capabilities."}
										</p>
									</div>

									<div>
										<h3 className="text-sm font-medium mb-2">Permissions</h3>
										<div className="flex flex-wrap gap-2">
											{getPermissionsForRole(role).length > 0 ? (
												getPermissionsForRole(role).map((permission) => (
													<Badge key={permission} variant="outline">
														{permission}
													</Badge>
												))
											) : (
												<p className="text-sm text-muted-foreground">
													No special permissions
												</p>
											)}
										</div>
									</div>

									<div>
										<h3 className="text-sm font-medium mb-2">Access Areas</h3>
										<ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
											{role === "ADMIN" && (
												<>
													<li>Full access to admin dashboard</li>
													<li>User management</li>
													<li>Content management</li>
													<li>Donation management</li>
													<li>Event management</li>
													<li>System settings</li>
													<li>Reports and analytics</li>
												</>
											)}
											{role === "EDITOR" && (
												<>
													<li>Limited access to admin dashboard</li>
													<li>Content management</li>
													<li>Basic reports</li>
													<li>No access to user management</li>
													<li>No access to system settings</li>
												</>
											)}
											{role === "USER" && (
												<>
													<li>No access to admin dashboard</li>
													<li>Public website access only</li>
												</>
											)}
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
