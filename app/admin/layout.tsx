"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	BarChart,
	Bell,
	Calendar,
	DollarSign,
	FileText,
	Home,
	Menu,
	MessageSquare,
	Settings,
	Users,
	BookOpen,
	Video,
	Newspaper,
	AlertCircle,
	UserRound,
	Building,
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

export default function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const permissions = usePermissions();

	useEffect(() => {
		// Redirect if not authenticated
		if (status === "unauthenticated") {
			router.push("/admin");
		}
	}, [status, router]);

	// Check if we're on the login page
	const isLoginPage = pathname === "/admin" || pathname === "/admin/login";

	if (status === "loading") {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Loading...</h2>
					<p className="text-muted-foreground">
						Please wait while we load your dashboard
					</p>
				</div>
			</div>
		);
	}

	if (status === "unauthenticated" && !isLoginPage) {
		return null;
	}

	// If we're on the login page, just render the children without the admin layout
	if (isLoginPage) {
		return <>{children}</>;
	}

	// Otherwise render the full admin layout
	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
				<Button
					variant="outline"
					size="icon"
					className="md:hidden"
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				>
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
				<div className="flex items-center gap-2">
					<Link
						href="/admin/dashboard"
						className="flex items-center gap-2 font-semibold"
					>
						<span className="text-primary">INWOLAG</span>
						<span className="text-muted-foreground">Admin</span>
					</Link>
				</div>
				<div className="ml-auto flex items-center gap-4">
					<Button variant="outline" size="icon">
						<Bell className="h-5 w-5" />
						<span className="sr-only">Notifications</span>
					</Button>
					<Button variant="outline" size="sm">
						<Link href="/">View Site</Link>
					</Button>
					<Button variant="outline" size="sm">
						<Link href="/api/auth/signout">Logout</Link>
					</Button>
				</div>
			</header>
			<div className="flex flex-1">
				<aside
					className={`${isSidebarOpen ? "flex" : "hidden"} w-64 flex-col border-r bg-muted/40 md:flex`}
				>
					<nav className="grid gap-2 p-4">
						<Link
							href="/admin/dashboard"
							className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
								pathname === "/admin/dashboard"
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							}`}
						>
							<Home className="h-5 w-5" />
							Dashboard
						</Link>

						{permissions.canManageContent() && (
							<Link
								href="/admin/content"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/content" ||
									pathname.startsWith("/admin/content/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<FileText className="h-5 w-5" />
								Program Management
							</Link>
						)}

						{permissions.canManageUsers() && (
							<Link
								href="/admin/users"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/users" ||
									pathname.startsWith("/admin/users/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<Users className="h-5 w-5" />
								User Management
							</Link>
						)}

						{permissions.hasPermission("manage:donations") && (
							<Link
								href="/admin/donations"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/donations" ||
									pathname.startsWith("/admin/donations/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<DollarSign className="h-5 w-5" />
								Donations
							</Link>
						)}

						{permissions.hasPermission("manage:events") && (
							<Link
								href="/admin/events"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/events" ||
									pathname.startsWith("/admin/events/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<Calendar className="h-5 w-5" />
								Events
							</Link>
						)}

						{permissions.hasPermission("manage:messages") && (
							<Link
								href="/admin/messages"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/messages" ||
									pathname.startsWith("/admin/messages/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<MessageSquare className="h-5 w-5" />
								Messages
							</Link>
						)}

						{permissions.hasPermission("view:reports") && (
							<Link
								href="/admin/reports"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/reports" ||
									pathname.startsWith("/admin/reports/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<BarChart className="h-5 w-5" />
								Reports
							</Link>
						)}

						{permissions.hasPermission("manage:settings") && (
							<Link
								href="/admin/settings"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/settings" ||
									pathname.startsWith("/admin/settings/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<Settings className="h-5 w-5" />
								Settings
							</Link>
						)}
						
						<Link
							href="/admin/about"
							className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
								pathname === "/admin/about" ||
								pathname.startsWith("/admin/about/")
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							}`}
						>
							<MessageSquare className="h-5 w-5" />
							About Us
						</Link>
						
						<Link
							href="/admin/about/board"
							className={`flex items-center gap-2 rounded-lg px-3 py-2 ml-4 ${
								pathname === "/admin/about/board" ||
								pathname.startsWith("/admin/about/board/")
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							}`}
						>
							<Building className="h-5 w-5" />
							Meet Our Board
						</Link>
						
						<Link
							href="/admin/about/team"
							className={`flex items-center gap-2 rounded-lg px-3 py-2 ml-4 ${
								pathname === "/admin/about/team" ||
								pathname.startsWith("/admin/about/team/")
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							}`}
						>
							<UserRound className="h-5 w-5" />
							Office Team
						</Link>
						
						{permissions.hasPermission("manage:publications") && (
							<Link
								href="/admin/publications"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/publications" ||
									pathname.startsWith("/admin/publications/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<BookOpen className="h-5 w-5" />
								Publications
							</Link>
						)}
						
						{permissions.hasPermission("manage:notices") && (
							<Link
								href="/admin/notices"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/notices" ||
									pathname.startsWith("/admin/notices/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<AlertCircle className="h-5 w-5" />
								Notices
							</Link>
						)}
						
						{permissions.hasPermission("manage:press-releases") && (
							<Link
								href="/admin/press-releases"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/press-releases" ||
									pathname.startsWith("/admin/press-releases/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<Newspaper className="h-5 w-5" />
								Press Releases
							</Link>
						)}
						
						{permissions.hasPermission("manage:media") && (
							<Link
								href="/admin/media"
								className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
									pathname === "/admin/media" ||
									pathname.startsWith("/admin/media/")
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<Video className="h-5 w-5" />
								Media
							</Link>
						)}
					</nav>
				</aside>
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}