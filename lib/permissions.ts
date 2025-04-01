export const PERMISSIONS = {
	"view:dashboard": ["ADMIN", "EDITOR"],
	"download:reports": ["ADMIN"],
	"manage:users": ["ADMIN"],
	"manage:content": ["ADMIN", "EDITOR"],
	"edit:content": ["ADMIN", "EDITOR"],
	"delete:content": ["ADMIN"],
	"approve:content": ["ADMIN"],
	"manage:settings": ["ADMIN"],
	"manage:donations": ["ADMIN"],
	"manage:events": ["ADMIN"],
	"manage:messages": ["ADMIN"],
	"view:volunteers": ["ADMIN"],
	"manage:volunteers": ["ADMIN"],
};

export const ROLE_PERMISSIONS = {
	ADMIN: [
		"view:dashboard",
		"download:reports",
		"manage:users",
		"manage:content",
		"edit:content",
		"delete:content",
		"approve:content",
		"manage:settings",
		"manage:donations",
		"manage:events",
		"manage:messages",
		"view:volunteers",
		"manage:volunteers",
	],
	EDITOR: [
		"view:dashboard",
		"manage:content",
		"edit:content",
		"view:volunteers",
		"view:donations",
		"view:messages",
	],
	USER: [],
};

export type Role = "ADMIN" | "EDITOR" | "USER";

export type Permission =
	| "view:dashboard"
	| "download:reports"
	| "manage:users"
	| "manage:content"
	| "edit:content"
	| "delete:content"
	| "approve:content"
	| "manage:settings"
	| "manage:donations"
	| "manage:events"
	| "manage:messages"
	| "view:volunteers"
	| "manage:volunteers";

export function hasPermission(
	role: string | undefined,
	permission: string,
): boolean {
	if (!role) return false;

	const rolePermissions =
		ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
	return rolePermissions.includes(permission);
}

export function canAccessAdmin(role: string | undefined): boolean {
	return role === "ADMIN" || role === "EDITOR";
}

export function canManageUsers(role: string | undefined): boolean {
	return role === "ADMIN";
}

export function canManageContent(role: string | undefined): boolean {
	return role === "ADMIN" || role === "EDITOR";
}

export function canEditContent(role: string | undefined): boolean {
	return role === "ADMIN" || role === "EDITOR";
}

export function canDeleteContent(role: string | undefined): boolean {
	return role === "ADMIN";
}

export function canApproveContent(role: string | undefined): boolean {
	return role === "ADMIN";
}

export function canExportData(role: string | undefined): boolean {
	return role === "ADMIN";
}

export function getPermissionsForRole(role: string): string[] {
	return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
}
