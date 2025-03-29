// Define permission types
export type Permission =
	| "manage:users"
	| "manage:content"
	| "manage:donations"
	| "manage:events"
	| "manage:messages"
	| "view:reports"
	| "manage:settings"
	| "edit:content"
	| "view:admin"
	| "approve:content"
	| "delete:content"
	| "export:data";

// Define role types from the schema
export type Role = "USER" | "EDITOR" | "ADMIN";

// Map roles to permissions
const rolePermissions: Record<Role, Permission[]> = {
	USER: [],
	EDITOR: ["view:admin", "edit:content", "manage:content", "view:reports"],
	ADMIN: [
		"view:admin",
		"manage:users",
		"manage:content",
		"manage:donations",
		"manage:events",
		"manage:messages",
		"view:reports",
		"manage:settings",
		"edit:content",
		"approve:content",
		"delete:content",
		"export:data",
	],
};

// Check if a role has a specific permission
export function hasPermission(
	role: Role | undefined | null,
	permission: Permission,
): boolean {
	if (!role) return false;
	return rolePermissions[role]?.includes(permission) || false;
}

// Get all permissions for a role
export function getPermissionsForRole(
	role: Role | undefined | null,
): Permission[] {
	if (!role) return [];
	return rolePermissions[role] || [];
}

// Check if user can access admin area
export function canAccessAdmin(role: Role | undefined | null): boolean {
	return hasPermission(role, "view:admin");
}

// Check if user can manage users
export function canManageUsers(role: Role | undefined | null): boolean {
	return hasPermission(role, "manage:users");
}

// Check if user can manage content
export function canManageContent(role: Role | undefined | null): boolean {
	return hasPermission(role, "manage:content");
}

// Check if user can edit content
export function canEditContent(role: Role | undefined | null): boolean {
	return hasPermission(role, "edit:content");
}

// Check if user can delete content
export function canDeleteContent(role: Role | undefined | null): boolean {
	return hasPermission(role, "delete:content");
}

// Check if user can approve content
export function canApproveContent(role: Role | undefined | null): boolean {
	return hasPermission(role, "approve:content");
}

// Check if user can export data
export function canExportData(role: Role | undefined | null): boolean {
	return hasPermission(role, "export:data");
}
