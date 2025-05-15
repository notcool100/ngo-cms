"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { useNotices } from "@/hooks/use-notices";
import { usePressReleases } from "@/hooks/use-press-releases";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function NoticesSection() {
	const { data: notices, isLoading: loadingNotices } = useNotices({
		important: true,
		active: true,
		limit: 3,
	});

	const { data: pressReleases, isLoading: loadingPressReleases } =
		usePressReleases({
			featured: true,
			limit: 3,
		});

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

	return (
		<section className="py-16 bg-gray-50">
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Notices */}
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold flex items-center gap-2">
								<AlertCircle className="h-6 w-6 text-primary" />
								Important Notices
							</h2>
							<Link
								href="/notices"
								className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
							>
								View All <ChevronRight className="h-4 w-4" />
							</Link>
						</div>

						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="space-y-4"
						>
							{loadingNotices ? (
								<>
									<Skeleton className="h-24 w-full" />
									<Skeleton className="h-24 w-full" />
									<Skeleton className="h-24 w-full" />
								</>
							) : notices?.length === 0 ? (
								<p className="text-muted-foreground text-center py-8">
									No important notices at the moment.
								</p>
							) : (
								notices?.map((notice) => (
									<motion.div
										key={notice.id}
										variants={item}
										className={cn(
											"p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow",
											notice.important && "border-primary/50 bg-primary/5",
										)}
									>
										<div className="flex items-start justify-between gap-4">
											<div>
												<h3 className="font-semibold mb-2">{notice.title}</h3>
												<p className="text-sm text-muted-foreground line-clamp-2">
													{notice.content}
												</p>
											</div>
											{notice.important && (
												<Badge variant="destructive">Important</Badge>
											)}
										</div>
										<div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
											<span>
												Posted{" "}
												{format(new Date(notice.publishedAt), "MMM d, yyyy")}
											</span>
											{notice.expiresAt && (
												<>
													<span>•</span>
													<span>
														Expires{" "}
														{format(new Date(notice.expiresAt), "MMM d, yyyy")}
													</span>
												</>
											)}
										</div>
									</motion.div>
								))
							)}
						</motion.div>
					</div>

					{/* Press Releases */}
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold flex items-center gap-2">
								<Newspaper className="h-6 w-6 text-primary" />
								Press Releases
							</h2>
							<Link
								href="/press-releases"
								className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
							>
								View All <ChevronRight className="h-4 w-4" />
							</Link>
						</div>

						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="space-y-4"
						>
							{loadingPressReleases ? (
								<>
									<Skeleton className="h-24 w-full" />
									<Skeleton className="h-24 w-full" />
									<Skeleton className="h-24 w-full" />
								</>
							) : pressReleases?.length === 0 ? (
								<p className="text-muted-foreground text-center py-8">
									No press releases available.
								</p>
							) : (
								pressReleases?.map((pressRelease) => (
									<motion.div
										key={pressRelease.id}
										variants={item}
										className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
									>
										<Link href={`/press-releases/${pressRelease.slug}`}>
											<h3 className="font-semibold mb-2 hover:text-primary transition-colors">
												{pressRelease.title}
											</h3>
										</Link>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{pressRelease.excerpt || pressRelease.content}
										</p>
										<div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
											<span>
												{format(
													new Date(
														pressRelease.publishedAt || pressRelease.createdAt,
													),
													"MMM d, yyyy",
												)}
											</span>
											{pressRelease.featured && (
												<>
													<span>•</span>
													<Badge>Featured</Badge>
												</>
											)}
										</div>
									</motion.div>
								))
							)}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
