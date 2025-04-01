"use client";

import type { ReactNode } from "react";
import { usePermissions } from "hooks/use-permissions";
import type { Permission } from "lib/permissions";

interface PermissionGateProps {
	permission: Permission;
	children: ReactNode;
	fallback?: ReactNode;
}

export function PermissionGate({
	permission,
	children,
	fallback = null,
}: PermissionGateProps) {
	const permissions = usePermissions();

	if (permissions.hasPermission(permission)) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
