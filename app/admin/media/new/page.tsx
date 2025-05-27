"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewMediaPage() {
	const router = useRouter();

	useEffect(() => {
		router.push("/admin/media/new/form");
	}, [router]);

	return (
		<div className="flex justify-center items-center h-[calc(100vh-200px)]">
			<Loader2 className="h-8 w-8 animate-spin mr-2" />
			<p>Redirecting to media form...</p>
		</div>
	);
}
