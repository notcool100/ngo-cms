"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { usePressReleases } from "@/hooks/use-press-releases";
import PressReleaseForm from "@/components/admin/press-release-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import type { PressRelease } from "./columns";

interface FormData {
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	image?: string;
	featured?: boolean;
	published?: boolean;
	youtubeUrl?: string;
	websiteUrls?: string[];
	images?: string[];
}

export default function PressReleasesPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [isCreating, setIsCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {
		pressReleases,
		isLoading: isLoadingPressReleases,
		isError,
	} = usePressReleases();

	const handleCreate = async (data: FormData) => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/press-releases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create press release");
			}

			toast.success("Press release created successfully");
			router.refresh();
			setIsCreating(false);
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	if (status === "loading" || isLoadingPressReleases) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Press Releases</h1>
				</div>
				<div className="space-y-4">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		);
	}

	if (status === "unauthenticated") {
		router.push("/admin");
		return null;
	}

	if (isError) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Press Releases</h1>
				</div>
				<div className="text-center text-red-600">
					Error loading press releases. Please try again later.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Press Releases</h1>
				<Button onClick={() => setIsCreating(true)}>
					Create Press Release
				</Button>
			</div>

			{isCreating ? (
				<div className="mt-6">
					<PressReleaseForm onSubmit={handleCreate} isLoading={isLoading} />
				</div>
			) : (
				<DataTable
					columns={columns}
					data={pressReleases || []}
					searchKey="title"
					isLoading={isLoadingPressReleases}
				/>
			)}
		</div>
	);
}
