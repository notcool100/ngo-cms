"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { PublicationCard } from "@/components/publication-card";
import { usePublications } from "@/hooks/use-publications";

export function FeaturedPublications() {
	const { data: publications, isLoading } = usePublications();

	const featuredPublications =
		publications?.filter(
			(publication) => publication.featured && publication.published,
		) || [];

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Heading
						title="Featured Publications"
						description="Check out our featured publications"
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-[300px] rounded-lg bg-gray-200 animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	if (featuredPublications.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Heading
					title="Featured Publications"
					description="Check out our featured publications"
				/>
				<Button variant="link" asChild>
					<Link href="/publications" className="flex items-center gap-x-2">
						View all
						<ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{featuredPublications.map((publication) => (
					<PublicationCard key={publication.id} publication={publication} />
				))}
			</div>
		</div>
	);
}
