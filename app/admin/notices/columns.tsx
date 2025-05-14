"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type NoticeColumn = {
	id: string;
	title: string;
	content: string;
	important: boolean;
	published: boolean;
	publishedAt: Date;
	expiresAt: Date | null;
	createdAt: Date;
};

export const noticesColumns: ColumnDef<NoticeColumn>[] = [
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "important",
		header: "Important",
		cell: ({ row }) => (
			<Badge variant={row.original.important ? "destructive" : "secondary"}>
				{row.original.important ? "Yes" : "No"}
			</Badge>
		),
	},
	{
		accessorKey: "published",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={row.original.published ? "default" : "secondary"}>
				{row.original.published ? "Published" : "Draft"}
			</Badge>
		),
	},
	{
		accessorKey: "publishedAt",
		header: "Published Date",
		cell: ({ row }) =>
			format(new Date(row.original.publishedAt), "MMM dd, yyyy"),
	},
	{
		accessorKey: "expiresAt",
		header: "Expires At",
		cell: ({ row }) =>
			row.original.expiresAt
				? format(new Date(row.original.expiresAt), "MMM dd, yyyy")
				: "Never",
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
