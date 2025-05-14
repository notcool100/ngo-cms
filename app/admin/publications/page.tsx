"use client";

import { DataTable } from "@/components/ui/data-table";
import { publicationsColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { usePublications } from "@/hooks/use-publications";

export default function PublicationsPage() {
	const router = useRouter();
	const { data: publications, isLoading } = usePublications(true);

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between">
					<Heading
						title="Publications"
						description="Manage publications, books, articles, acts and rules"
					/>
					<Button onClick={() => router.push("/admin/publications/new")}>
						<Plus className="mr-2 h-4 w-4" />
						Add New
					</Button>
				</div>
				<Separator />
				<DataTable
					columns={publicationsColumns}
					data={publications || []}
					isLoading={isLoading}
					searchKey="title"
				/>
			</div>
		</div>
	);
}
