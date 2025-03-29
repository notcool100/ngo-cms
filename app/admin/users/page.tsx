"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash, UserPlus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PermissionGate } from "@/components/auth/permission-gate";
import { usePermissions } from "@/hooks/use-permissions";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	image: string | null;
	createdAt: string;
}

export default function UserManagementPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<string | null>(null);
	const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		name: "",
		email: "",
		password: "",
		role: "USER",
	});
	const permissions = usePermissions();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/users");

			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error("Error fetching users:", error);
			toast({
				title: "Error",
				description: "Failed to load users",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteUser = async () => {
		if (!userToDelete) return;

		try {
			const response = await fetch(`/api/users/${userToDelete}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete user");
			}

			toast({
				title: "Success",
				description: "User deleted successfully",
			});

			// Refresh the users list
			fetchUsers();
		} catch (error) {
			console.error("Error deleting user:", error);
			toast({
				title: "Error",
				description: "Failed to delete user",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setUserToDelete(null);
		}
	};

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newUser),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create user");
			}

			toast({
				title: "Success",
				description: "User created successfully",
			});

			// Reset form and close dialog
			setNewUser({
				name: "",
				email: "",
				password: "",
				role: "USER",
			});
			setNewUserDialogOpen(false);

			// Refresh the users list
			fetchUsers();
		} catch (error) {
			console.error("Error creating user:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to create user",
				variant: "destructive",
			});
		}
	};

	const columns = [
		{
			key: "user",
			title: "User",
			render: (user: User) => (
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={user.image || undefined} alt={user.name} />
						<AvatarFallback>
							{user.name.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">{user.name}</div>
						<div className="text-sm text-muted-foreground">{user.email}</div>
					</div>
				</div>
			),
		},
		{
			key: "role",
			title: "Role",
			render: (user: User) => (
				<Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
					{user.role}
				</Badge>
			),
		},
		{
			key: "createdAt",
			title: "Created",
			render: (user: User) => new Date(user.createdAt).toLocaleDateString(),
		},
		{
			key: "actions",
			title: "Actions",
			render: (user: User) => (
				<div className="flex gap-2">
					<PermissionGate permission="manage:users">
						<Button variant="outline" size="icon">
							<Edit className="h-4 w-4" />
							<span className="sr-only">Edit</span>
						</Button>
					</PermissionGate>

					<PermissionGate permission="manage:users">
						<Button
							variant="outline"
							size="icon"
							onClick={() => {
								setUserToDelete(user.id);
								setDeleteDialogOpen(true);
							}}
							disabled={user.role === "ADMIN" || user.id === permissions.role} // Prevent deleting admin users or self
						>
							<Trash className="h-4 w-4" />
							<span className="sr-only">Delete</span>
						</Button>
					</PermissionGate>
				</div>
			),
		},
	];

	if (isLoading) {
		return <AdminLoading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">User Management</h1>

				<PermissionGate permission="manage:users">
					<Button onClick={() => setNewUserDialogOpen(true)}>
						<UserPlus className="mr-2 h-4 w-4" />
						New User
					</Button>
				</PermissionGate>
			</div>

			<DataTable data={users} columns={columns} />

			<Dialog open={newUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New User</DialogTitle>
						<DialogDescription>
							Add a new user to the system. They will receive an email with
							their login details.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreateUser}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={newUser.name}
									onChange={(e) =>
										setNewUser({ ...newUser, name: e.target.value })
									}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={newUser.email}
									onChange={(e) =>
										setNewUser({ ...newUser, email: e.target.value })
									}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={newUser.password}
									onChange={(e) =>
										setNewUser({ ...newUser, password: e.target.value })
									}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="role">Role</Label>
								<Select
									value={newUser.role}
									onValueChange={(value) =>
										setNewUser({ ...newUser, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USER">User</SelectItem>
										<SelectItem value="EDITOR">Editor</SelectItem>
										<SelectItem value="ADMIN">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Create User</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							user account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteUser}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
