"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BoardMembersPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to the team page with the board tab active
		router.push("/admin/about/team?tab=board");
	}, [router]);

	return (
		<div className="flex justify-center items-center h-[50vh]">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
		</div>
	);
}
