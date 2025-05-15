"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Newspaper, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { usePressReleases } from "@/hooks/use-press-releases";
import { cn } from "@/lib/utils";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function PressReleasesPage() {
	const [search, setSearch] = useState("");
	const { data: pressReleases = [], isLoading } = usePressReleases();

	const filteredPressReleases = pressReleases.filter(
		(pressRelease) =>
			pressRelease.title.toLowerCase().includes(search.toLowerCase()) ||
			pressRelease.content.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Container>
			<div className="space-y-8 py-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Heading
						title="Press Releases"
						description="Stay informed about our latest news and announcements"
					/>
				</motion.div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search press releases..."
						className="pl-10"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 md:grid-cols-2 gap-6"
				>
					{isLoading ? (
						<>
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-[400px] rounded-lg border bg-muted/10 animate-pulse"
								/>
							))}
						</>
					) : filteredPressReleases.length === 0 ? (
						<div className="col-span-2 text-center py-10">
							<Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium">No press releases found</h3>
							<p className="text-muted-foreground">
								{search
									? "Try adjusting your search query"
									: "There are no press releases available at the moment"}
							</p>
						</div>
					) : (
						filteredPressReleases.map((pressRelease) => (
							<motion.div
								key={pressRelease.id}
								variants={item}
								className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
							>
								<Link href={`/press-releases/${pressRelease.slug}`}>
									<div className="relative h-48 w-full">
										{pressRelease.image ? (
											<Image
												src={pressRelease.image}
												alt={pressRelease.title}
												fill
												className="object-cover transition-transform group-hover:scale-105"
											/>
										) : (
											<div className="h-full w-full bg-muted flex items-center justify-center">
												<Newspaper className="h-12 w-12 text-muted-foreground" />
											</div>
										)}
										{pressRelease.featured && (
											<Badge
												className="absolute top-4 right-4"
												variant="secondary"
											>
												Featured
											</Badge>
										)}
									</div>
									<div className="p-6">
										<h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
											{pressRelease.title}
										</h3>
										<p className="text-muted-foreground line-clamp-3">
											{pressRelease.excerpt || pressRelease.content}
										</p>
										<div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
											<span>
												{format(
													new Date(
														pressRelease.publishedAt || pressRelease.createdAt,
													),
													"PPP",
												)}
											</span>
											{pressRelease.author?.name && (
												<>
													<span>•</span>
													<span>By {pressRelease.author.name}</span>
												</>
											)}
										</div>
									</div>
								</Link>
							</motion.div>
						))
					)}
				</motion.div>
			</div>
		</Container>
	);
}
