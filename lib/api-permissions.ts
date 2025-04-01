import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasPermission, type Permission, type Role } from "@/lib/permissions";

export async function checkPermission(permission: Permission) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return {
			hasPermission: false,
			response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	const userRole = session.user.role as Role;

	if (!hasPermission(userRole, permission)) {
		return {
			hasPermission: false,
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
