import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { Publication } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface PublicationCardProps {
	publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
	return (
		<Link href={`/publications/${publication.slug}`}>
			<Card className="group overflow-hidden">
				<div className="relative aspect-[4/3]">
					{publication.coverImage ? (
						<Image
							src={publication.coverImage}
							alt={publication.title}
							fill
							className="object-cover transition-transform group-hover:scale-105"
						/>
					) : (
						<div className="h-full w-full bg-gray-100" />
					)}
				</div>
				<CardContent className="space-y-2 p-4">
					<Badge variant="outline">{publication.type}</Badge>
					<h3 className="line-clamp-2 font-semibold">{publication.title}</h3>
					<div
						className="line-clamp-2 text-sm text-muted-foreground"
						dangerouslySetInnerHTML={{
							__html: publication.description,
						}}
					/>
				</CardContent>
				<CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
					{publication.publishedAt
						? format(new Date(publication.publishedAt), "MMM dd, yyyy")
						: "Draft"}
				</CardFooter>
			</Card>
		</Link>
	);
}
