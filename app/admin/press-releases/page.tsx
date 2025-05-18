"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { usePressReleases } from "@/hooks/use-press-releases";
import PressReleaseForm from "@/components/admin/press-release-form";

export default function PressReleasesPage() {
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { pressReleases, mutate } = usePressReleases();

	const handleCreate = async (data: any) => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/press-releases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create press release");
			}

			toast.success("Press release created successfully");
			mutate();
			setIsCreating(false);
			router.refresh();
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

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
				/>
			)}
		</div>
	);
}
