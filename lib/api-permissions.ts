import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasPermission, type Permission, type Role } from "@/lib/permissions";

export async function checkPermission(request: Request, permission: Permission) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return {
			success: false,
			hasPermission: false,
			error: "Unauthorized",
			response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	const userRole = session.user.role as Role;

	if (!hasPermission(userRole, permission)) {
		return {
			success: false,
			hasPermission: false,
			error: "Forbidden",
			response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
		};
	}

	return {
		success: true,
		hasPermission: true,
		session,
		user: session.user,
	};
}
