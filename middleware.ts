import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { canAccessAdmin, hasPermission } from "./lib/permissions";

export async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Define paths that are protected (require authentication)
	const isAdminPath =
		path.startsWith("/admin") &&
		!path.startsWith("/admin/login") &&
		path !== "/admin";

	if (!isAdminPath) {
		return NextResponse.next();
	}

	const session = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// If the user is not logged in, redirect to the login page
	if (!session && isAdminPath) {
		return NextResponse.redirect(new URL("/admin", req.url));
	}

	const userRole = (session?.role as string) || null;

	// Check if user can access admin area
	if (session && isAdminPath && !canAccessAdmin(userRole as any)) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	// Role-based path restrictions
	if (session && isAdminPath) {
		// Users management - only ADMIN
		if (
			path.startsWith("/admin/users") &&
			!hasPermission(userRole as any, "manage:users")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		// Settings - only ADMIN
		if (
			path.startsWith("/admin/settings") &&
			!hasPermission(userRole as any, "manage:settings")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		// Reports - ADMIN and EDITOR
		if (
			path.startsWith("/admin/reports") &&
			!hasPermission(userRole as any, "view:reports")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		// Content management - ADMIN and EDITOR
		if (
			path.startsWith("/admin/content") &&
			!hasPermission(userRole as any, "manage:content")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		// Donations - only ADMIN
		if (
			path.startsWith("/admin/donations") &&
			!hasPermission(userRole as any, "manage:donations")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		// Events - only ADMIN
		if (
			path.startsWith("/admin/events") &&
			!hasPermission(userRole as any, "manage:events")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		// Messages - only ADMIN
		if (
			path.startsWith("/admin/messages") &&
			!hasPermission(userRole as any, "manage:messages")
		) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
