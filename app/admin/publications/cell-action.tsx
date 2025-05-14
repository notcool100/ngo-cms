"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { PublicationColumn } from "./columns";
import { useDeletePublication } from "@/hooks/use-publications";

interface CellActionProps {
	data: PublicationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { mutate: deletePublication, isLoading } = useDeletePublication();

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success("Publication ID copied to clipboard.");
	};

	const onDelete = async () => {
		try {
			await deletePublication(data.id);
			toast.success("Publication deleted.");
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={isLoading}
			/>
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
						onClick={() => router.push(`/publications/${data.slug}`)}
					>
						<Eye className="mr-2 h-4 w-4" /> View
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => router.push(`/admin/publications/${data.slug}`)}
					>
						<Edit className="mr-2 h-4 w-4" /> Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="mr-2 h-4 w-4" /> Copy Id
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="mr-2 h-4 w-4" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
