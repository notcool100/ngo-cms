"use client";

import { useParams } from "next/navigation";
import { NoticeForm } from "./components/notice-form";
import { useNotice } from "@/hooks/use-notices";

export default function NoticePage() {
	const params = useParams();
	const noticeId = params.noticeId as string;
	const { data: notice, isLoading } = useNotice(
		noticeId === "new" ? null : noticeId,
	);

	const title = noticeId === "new" ? "Create notice" : "Edit notice";
	const description =
		noticeId === "new" ? "Add a new notice" : "Edit an existing notice";

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<NoticeForm initialData={notice} isLoading={isLoading} />
			</div>
		</div>
	);
}
