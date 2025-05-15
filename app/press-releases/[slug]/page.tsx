"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { usePressReleaseBySlug } from "@/hooks/use-press-releases";

export default function PressReleasePage() {
	const params = useParams();
	const slug = params.slug as string;
	const { data: pressRelease, isLoading } = usePressReleaseBySlug(slug);

	if (isLoading) {
		return (
			<Container>
				<div className="py-10 space-y-8">
					<div className="space-y-4">
						<Skeleton className="h-12 w-3/4" />
						<Skeleton className="h-6 w-1/2" />
					</div>
					<Skeleton className="h-96 w-full" />
					<div className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			</Container>
		);
	}

	if (!pressRelease) {
		return (
			<Container>
				<div className="py-20 text-center">
					<h1 className="text-2xl font-bold mb-4">Press Release Not Found</h1>
					<p className="text-muted-foreground mb-8">
						The press release you're looking for doesn't exist or has been
						removed.
					</p>
					<Button asChild>
						<Link href="/press-releases">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Press Releases
						</Link>
					</Button>
				</div>
			</Container>
		);
	}

	return (
		<Container>
			<article className="py-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="space-y-8"
				>
					{/* Header */}
					<div className="space-y-4">
						<Button variant="ghost" className="mb-4" asChild>
							<Link href="/press-releases">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Press Releases
							</Link>
						</Button>

						<h1 className="text-4xl font-bold">{pressRelease.title}</h1>

						<div className="flex items-center gap-4 text-muted-foreground">
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<time
									dateTime={pressRelease.publishedAt || pressRelease.createdAt}
								>
									{format(
										new Date(
											pressRelease.publishedAt || pressRelease.createdAt,
										),
										"PPP",
									)}
								</time>
							</div>
							{pressRelease.author?.name && (
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" />
									<span>{pressRelease.author.name}</span>
								</div>
							)}
							{pressRelease.featured && (
								<Badge variant="secondary">Featured</Badge>
							)}
						</div>
					</div>

					{/* Featured Image */}
					{pressRelease.image && (
						<div className="relative aspect-video w-full overflow-hidden rounded-lg">
							<Image
								src={pressRelease.image}
								alt={pressRelease.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}

					{/* Content */}
					<div className="prose prose-lg max-w-none">
						{pressRelease.content}
					</div>
				</motion.div>
			</article>
		</Container>
	);
}
