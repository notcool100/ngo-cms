"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type PublicationColumn = {
	id: string;
	title: string;
	slug: string;
	type: string;
	featured: boolean;
	published: boolean;
	publishedAt: Date | null;
	createdAt: Date;
};

export const publicationsColumns: ColumnDef<PublicationColumn>[] = [
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
	},
	{
		accessorKey: "featured",
		header: "Featured",
		cell: ({ row }) => (
			<Badge variant={row.original.featured ? "default" : "secondary"}>
				{row.original.featured ? "Yes" : "No"}
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
			row.original.publishedAt
				? format(new Date(row.original.publishedAt), "MMM dd, yyyy")
				: "Not published",
	},
	{
		accessorKey: "createdAt",
		header: "Created Date",
		cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
