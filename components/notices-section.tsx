"use client";

import { useNotices } from "@/hooks/use-notices";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const NoticesSection = () => {
	const { data: notices, isLoading } = useNotices();

	if (isLoading) {
		return <div>Loading notices...</div>;
	}

	if (!notices?.length) {
		return null;
	}

	const importantNotices = notices.filter((notice) => notice.important);
	const regularNotices = notices.filter((notice) => !notice.important);

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold tracking-tight">
				Notices & Announcements
			</h2>
			<Separator />
			<div className="space-y-4">
				{importantNotices.length > 0 && (
					<div className="space-y-4">
						{importantNotices.map((notice) => (
							<Card key={notice.id} className="border-red-500">
								<CardHeader className="flex flex-row items-center gap-2 py-3">
									<AlertTriangle className="h-5 w-5 text-red-500" />
									<Badge variant="destructive">Important Notice</Badge>
									<span className="ml-auto text-sm text-muted-foreground">
										{format(new Date(notice.publishedAt), "MMM dd, yyyy")}
									</span>
								</CardHeader>
								<CardContent>
									<h3 className="font-semibold">{notice.title}</h3>
									<div
										className="mt-2 text-sm text-muted-foreground"
										dangerouslySetInnerHTML={{ __html: notice.content }}
									/>
								</CardContent>
							</Card>
						))}
					</div>
				)}
				{regularNotices.length > 0 && (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{regularNotices.map((notice) => (
							<Card key={notice.id}>
								<CardHeader className="flex flex-row items-center justify-between py-3">
									<Badge>Notice</Badge>
									<span className="text-sm text-muted-foreground">
										{format(new Date(notice.publishedAt), "MMM dd, yyyy")}
									</span>
								</CardHeader>
								<CardContent>
									<h3 className="font-semibold">{notice.title}</h3>
									<div
										className="mt-2 text-sm text-muted-foreground line-clamp-3"
										dangerouslySetInnerHTML={{ __html: notice.content }}
									/>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
