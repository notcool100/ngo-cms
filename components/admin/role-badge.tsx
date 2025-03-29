import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/permissions";

interface RoleBadgeProps {
	role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
	const variants: Record<Role, "default" | "secondary" | "outline"> = {
		ADMIN: "default",
		EDITOR: "secondary",
		USER: "outline",
	};

	return <Badge variant={variants[role]}>{role}</Badge>;
}
