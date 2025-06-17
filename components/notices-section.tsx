"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { useNotices } from "@/hooks/use-notices";
import { usePressReleases } from "@/hooks/use-press-releases";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ImportantNoticeOverlay() {
	const { data: mostImportantNotice, isLoading } = useNotices({
		important: true,
		active: true,
		limit: 1,
	});

	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (!mostImportantNotice?.length) return;

		const notice = mostImportantNotice[0];
		const storageKey = `notice_hidden_${notice.id}`;
		
		try {
			const hiddenUntil = localStorage.getItem(storageKey);
			if (hiddenUntil) {
				const hiddenUntilTime = new Date(hiddenUntil);
				const now = new Date();
				if (now < hiddenUntilTime) {
					setIsVisible(false);
				} else {
					localStorage.removeItem(storageKey);
				}
			}
		} catch (error) {
			console.warn('localStorage not available:', error);
		}
	}, [mostImportantNotice]);

	const handleUnderstand = () => {
		if (!mostImportantNotice?.length) return;

		const notice = mostImportantNotice[0];
		const storageKey = `notice_hidden_${notice.id}`;
		
		try {
			const hideUntil = new Date();
			hideUntil.setHours(hideUntil.getHours() + 24);
			localStorage.setItem(storageKey, hideUntil.toISOString());
		} catch (error) {
			console.warn('localStorage not available:', error);
		}
		
		setIsVisible(false);
	};

	const handleClose = () => {
		setIsVisible(false);
	};

	if (isLoading || !mostImportantNotice?.length || !isVisible) {
		return null;
	}

	const notice = mostImportantNotice[0];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
		>
			<motion.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative"
			>
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
					aria-label="Close notice"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<div className="flex items-center gap-2 mb-4">
					<AlertCircle className="h-5 w-5 text-red-500" />
					<span className="font-bold text-red-500">IMPORTANT NOTICE</span>
				</div>

				<h3 className="text-xl font-bold mb-3">{notice.title}</h3>
				<div className="prose prose-sm text-gray-600 mb-4">
					{notice.content}
				</div>

				<div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
					<span>
						Posted {format(new Date(notice.publishedAt), "MMM d, yyyy")}
					</span>
					{notice.expiresAt && (
						<>
							<span>•</span>
							<span>
								Expires {format(new Date(notice.expiresAt), "MMM d, yyyy")}
							</span>
						</>
					)}
				</div>

				<button
					onClick={handleUnderstand}
					className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
				>
					I Understand
				</button>
			</motion.div>
		</motion.div>
	);
}

export function NoticesSection() {
	// Fetch the single most important notice
	const { data: mostImportantNotice, isLoading: loadingMostImportant } =
		useNotices({
			important: true,
			active: true,
			limit: 1,
		});

	// Fetch other important notices excluding the most important one
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

	// Filter out the most important notice from the other notices list
	const filteredNotices = notices?.filter(
		(notice) => notice.id !== mostImportantNotice?.[0]?.id,
	);

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
							{loadingMostImportant ? (
								<Skeleton className="h-32 w-full" />
							) : mostImportantNotice?.length === 0 ? null : (
								<motion.div
									key={mostImportantNotice[0].id}
									variants={item}
									className="p-6 rounded-lg border-2 border-primary bg-primary/10 shadow-md"
								>
									<h3 className="font-bold text-xl mb-2">
										{mostImportantNotice[0].title}
									</h3>
									<p className="text-sm text-muted-foreground mb-2 line-clamp-3">
										{mostImportantNotice[0].content}
									</p>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span>
											Posted{" "}
											{format(
												new Date(mostImportantNotice[0].publishedAt),
												"MMM d, yyyy",
											)}
										</span>
										{mostImportantNotice[0].expiresAt && (
											<>
												<span>•</span>
												<span>
													Expires{" "}
													{format(
														new Date(mostImportantNotice[0].expiresAt),
														"MMM d, yyyy",
													)}
												</span>
											</>
										)}
									</div>
								</motion.div>
							)}

							{loadingNotices ? (
								<>
									<Skeleton className="h-24 w-full" />
									<Skeleton className="h-24 w-full" />
									<Skeleton className="h-24 w-full" />
								</>
							) : filteredNotices?.length === 0 ? (
								<p className="text-muted-foreground text-center py-8">
									No important notices at the moment.
								</p>
							) : (
								filteredNotices?.map((notice) => (
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