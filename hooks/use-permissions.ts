"use client";

import { useSession } from "next-auth/react";
import {
	hasPermission,
	canAccessAdmin,
	canManageUsers,
	canManageContent,
	canEditContent,
	canDeleteContent,
	canApproveContent,
	canExportData,
	type Permission,
	type Role,
} from "@/lib/permissions";

export function usePermissions() {
	const { data: session } = useSession();
	const userRole = session?.user?.role as Role | undefined;

	return {
		hasPermission: (permission: Permission) =>
			hasPermission(userRole, permission),
		canAccessAdmin: () => canAccessAdmin(userRole),
		canManageUsers: () => canManageUsers(userRole),
		canManageContent: () => canManageContent(userRole),
		canEditContent: () => canEditContent(userRole),
		canDeleteContent: () => canDeleteContent(userRole),
		canApproveContent: () => canApproveContent(userRole),
		canExportData: () => canExportData(userRole),
		role: userRole,
	};
}
