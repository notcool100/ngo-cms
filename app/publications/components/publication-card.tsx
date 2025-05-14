"use client";

import Image from "next/image";
import Link from "next/link";
import { Publication } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { format } from "date-fns";

interface PublicationCardProps {
	data: Publication & {
		category?: { name: string } | null;
		author?: { name: string } | null;
	};
}

export const PublicationCard: React.FC<PublicationCardProps> = ({ data }) => {
	return (
		<Link href={`/publications/${data.id}`}>
			<Card className="group cursor-pointer overflow-hidden transition hover:border-primary">
				<CardHeader className="p-0">
					{data.coverImage ? (
						<div className="aspect-[3/4] relative">
							<Image
								src={data.coverImage}
								alt={data.title}
								fill
								className="object-cover transition group-hover:scale-105"
							/>
						</div>
					) : (
						<div className="aspect-[3/4] bg-muted flex items-center justify-center">
							<span className="text-muted-foreground">No cover image</span>
						</div>
					)}
				</CardHeader>
				<CardContent className="space-y-2 p-4">
					<div className="space-y-1">
						<h3 className="font-semibold leading-none">{data.title}</h3>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{data.description}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary">{data.type}</Badge>
						{data.category && (
							<Badge variant="outline">{data.category.name}</Badge>
						)}
					</div>
				</CardContent>
				<CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
					{data.author?.name && <span>By {data.author.name}</span>}
					{data.publishedAt && (
						<span className="ml-auto">
							{format(new Date(data.publishedAt), "MMM dd, yyyy")}
						</span>
					)}
				</CardFooter>
			</Card>
		</Link>
	);
};
