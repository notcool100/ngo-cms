"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";

import { Container } from "@/components/ui/container";
import { usePublication } from "@/hooks/use-publications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Publication } from "@prisma/client";

interface PublicationWithRelations extends Publication {
	author?: { name: string } | null;
	category?: { name: string } | null;
}

export default function PublicationPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { data: publication, isLoading } = usePublication(slug);

	if (isLoading) {
		return (
			<Container>
				<div className="h-full flex items-center justify-center">
					Loading...
				</div>
			</Container>
		);
	}

	if (!publication) {
		return (
			<Container>
				<div className="h-full flex items-center justify-center">
					Publication not found.
				</div>
			</Container>
		);
	}

	const pub = publication as PublicationWithRelations;

	return (
		<Container>
			<div className="px-4 py-10 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
					{/* Cover Image */}
					<div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-100">
						{pub.coverImage ? (
							<img
								src={pub.coverImage}
								alt={pub.title}
								className="object-cover object-center w-full h-full"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<span className="text-muted-foreground">No cover image</span>
							</div>
						)}
					</div>

					{/* Publication Info */}
					<div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold tracking-tight text-gray-900">
								{pub.title}
							</h1>
							{pub.type && (
								<Badge variant="secondary" className="text-lg">
									{pub.type}
								</Badge>
							)}
						</div>

						<div className="mt-4 space-y-6">
							<div className="text-base text-gray-500">
								{pub.author?.name && <p>By {pub.author.name}</p>}
								{pub.publishedAt && (
									<p>
										Published on{" "}
										{format(new Date(pub.publishedAt), "MMMM dd, yyyy")}
									</p>
								)}
								{pub.category?.name && <p>Category: {pub.category.name}</p>}
							</div>

							<Separator />

							<div
								className="prose prose-blue max-w-none"
								dangerouslySetInnerHTML={{ __html: pub.description }}
							/>

							<div className="mt-10">
								<Button
									onClick={() => window.open(pub.fileUrl, "_blank")}
									size="lg"
									className="w-full"
								>
									<Download className="mr-2 h-4 w-4" />
									Download Publication
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
