"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { PressRelease } from "@/app/admin/press-releases/columns";

interface PressReleaseClientProps {
	pressRelease: PressRelease;
}

export function PressReleaseClient({ pressRelease }: PressReleaseClientProps) {
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
									dateTime={
										pressRelease.publishedAt?.toISOString() ||
										pressRelease.createdAt.toISOString()
									}
								>
									{format(
										pressRelease.publishedAt || pressRelease.createdAt,
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
