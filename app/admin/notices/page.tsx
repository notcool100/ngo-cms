"use client";

import { DataTable } from "@/components/ui/data-table";
import { noticesColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useNotices } from "@/hooks/use-notices";

export default function NoticesPage() {
	const router = useRouter();
	const { data: notices, isLoading } = useNotices();

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between">
					<Heading
						title="Notices"
						description="Manage notices and announcements"
					/>
					<Button onClick={() => router.push("/admin/notices/new")}>
						<Plus className="mr-2 h-4 w-4" />
						Add New
					</Button>
				</div>
				<Separator />
				<DataTable
					columns={noticesColumns}
					data={notices || []}
					isLoading={isLoading}
					searchKey="title"
				/>
			</div>
		</div>
	);
}
