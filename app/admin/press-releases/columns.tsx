"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export type PressRelease = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content: string;
	image: string | null;
	youtubeUrl: string | null;
	websiteUrls: string[] | null;
	images: string[] | null;
	featured: boolean;
	published: boolean;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	author: {
		id: string;
		name: string | null;
		image: string | null;
	};
};

const CellAction = ({ data }: { data: PressRelease }) => {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => navigator.clipboard.writeText(data.id)}
				>
					Copy ID
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(`/admin/press-releases/${data.id}/edit`)}
				>
					<Pencil className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem className="text-red-600">
					<Trash className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<PressRelease>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "author.name",
		header: "Author",
	},
	{
		accessorKey: "featured",
		header: "Featured",
		cell: ({ row }) => {
			const featured = row.getValue("featured") as boolean;
			return featured ? <Badge>Featured</Badge> : null;
		},
	},
	{
		accessorKey: "published",
		header: "Status",
		cell: ({ row }) => {
			const published = row.getValue("published") as boolean;
			return (
				<Badge variant={published ? "default" : "secondary"}>
					{published ? "Published" : "Draft"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "publishedAt",
		header: "Published At",
		cell: ({ row }) => {
			const date = row.getValue("publishedAt") as Date;
			return date ? format(new Date(date), "MMM d, yyyy") : "-";
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
