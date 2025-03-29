import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

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

	// If the user is logged in but not an admin, redirect to the homepage
	if (session && isAdminPath && session.role !== "ADMIN") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
