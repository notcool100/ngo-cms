"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PressReleaseForm from "@/components/admin/press-release-form";
import type { PressRelease } from "@/app/admin/press-releases/columns";

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

interface EditPressReleaseFormProps {
	initialData: PressRelease;
}

export function EditPressReleaseForm({
	initialData,
}: EditPressReleaseFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async (data: FormData) => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/press-releases", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ ...data, id: initialData.id }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to update press release");
			}

			toast.success("Press release updated successfully");
			router.push("/admin/press-releases");
			router.refresh();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An error occurred while updating the press release");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Edit Press Release</h1>
			</div>
			<PressReleaseForm
				initialData={initialData}
				onSubmit={handleUpdate}
				isLoading={isLoading}
			/>
		</div>
	);
}
