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
	const { data: allImportantNotices, isLoading } = useNotices({
		important: true,
		active: true,
		limit: 10, // Get more to filter properly
	});

	const [isVisible, setIsVisible] = useState(false);
	const [currentNotice, setCurrentNotice] = useState<any>(null);
	const [timeRemaining, setTimeRemaining] = useState<string>("");

	// Helper function to check if notice is expired
	const isNoticeExpired = (notice: any) => {
		if (!notice?.expiresAt) return false;
		return new Date(notice.expiresAt) < new Date();
	};

	// Helper function to check if notice is dismissed
	const isNoticeDismissed = (noticeId: string) => {
		try {
			const storageKey = `notice_dismissed_${noticeId}`;
			const dismissedUntil = localStorage.getItem(storageKey);
			if (dismissedUntil) {
				const dismissedUntilTime = new Date(dismissedUntil);
				const now = new Date();
				if (now < dismissedUntilTime) {
					return true;
				} else {
					localStorage.removeItem(storageKey);
				}
			}
			return false;
		} catch (error) {
			console.warn('localStorage not available:', error);
			return false;
		}
	};

	// Get urgency level based on content/title keywords
	const getUrgencyLevel = (notice: any): 'critical' | 'high' | 'medium' => {
		const text = `${notice.title} ${notice.content}`.toLowerCase();

		// Critical keywords
		if (text.includes('urgent') || text.includes('emergency') ||
			text.includes('critical') || text.includes('immediate')) {
			return 'critical';
		}

		// High priority keywords
		if (text.includes('important') || text.includes('deadline') ||
			text.includes('action required')) {
			return 'high';
		}

		return 'medium';
	};

	// Calculate time remaining until expiration
	useEffect(() => {
		if (!currentNotice?.expiresAt) return;

		const updateTimeRemaining = () => {
			const now = new Date();
			const expires = new Date(currentNotice.expiresAt);
			const diff = expires.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeRemaining("Expired");
				setIsVisible(false);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

			if (days > 0) {
				setTimeRemaining(`${days}d ${hours}h remaining`);
			} else if (hours > 0) {
				setTimeRemaining(`${hours}h ${minutes}m remaining`);
			} else {
				setTimeRemaining(`${minutes}m remaining`);
			}
		};

		updateTimeRemaining();
		const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

		return () => clearInterval(interval);
	}, [currentNotice]);

	// Filter and prioritize notices
	useEffect(() => {
		if (!allImportantNotices?.length) {
			setCurrentNotice(null);
			setIsVisible(false);
			return;
		}

		// Filter out expired and dismissed notices
		const validNotices = allImportantNotices.filter(
			notice => !isNoticeExpired(notice) && !isNoticeDismissed(notice.id)
		);

		if (validNotices.length === 0) {
			setCurrentNotice(null);
			setIsVisible(false);
			return;
		}

		// Sort by urgency (critical > high > medium) and then by date
		const sortedNotices = validNotices.sort((a, b) => {
			const urgencyOrder = { critical: 0, high: 1, medium: 2 };
			const urgencyA = getUrgencyLevel(a);
			const urgencyB = getUrgencyLevel(b);

			if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
				return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
			}

			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		});

		setCurrentNotice(sortedNotices[0]);
		setIsVisible(true);
	}, [allImportantNotices]);

	const handleDismiss = (duration: 'session' | '1hour' | '24hours' | 'permanent') => {
		if (!currentNotice) return;

		const storageKey = `notice_dismissed_${currentNotice.id}`;

		try {
			const now = new Date();
			let dismissUntil: Date;

			switch (duration) {
				case 'session':
					// Just close, will show again on page reload
					setIsVisible(false);
					return;
				case '1hour':
					dismissUntil = new Date(now.getTime() + 60 * 60 * 1000);
					break;
				case '24hours':
					dismissUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
					break;
				case 'permanent':
					dismissUntil = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
					break;
			}

			localStorage.setItem(storageKey, dismissUntil.toISOString());
		} catch (error) {
			console.warn('localStorage not available:', error);
		}

		setIsVisible(false);
	};

	if (isLoading || !currentNotice || !isVisible) {
		return null;
	}

	const urgency = getUrgencyLevel(currentNotice);
	const urgencyColors = {
		critical: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-500' },
		high: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-500' },
		medium: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-600', badge: 'bg-yellow-500' },
	};

	const colors = urgencyColors[urgency];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
			onClick={() => handleDismiss('session')}
		>
			<motion.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				className={`bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative border-4 ${colors.border}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Urgency indicator */}
				<div className={`absolute top-0 left-0 right-0 h-2 ${colors.badge} rounded-t-lg`} />

				<button
					onClick={() => handleDismiss('session')}
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

				<div className="flex items-center gap-3 mb-4 mt-2">
					<AlertCircle className={`h-6 w-6 ${colors.text}`} />
					<div className="flex items-center gap-2 flex-wrap">
						<span className={`font-bold ${colors.text} uppercase text-sm`}>
							{urgency === 'critical' ? '🚨 CRITICAL NOTICE' :
								urgency === 'high' ? '⚠️ IMPORTANT NOTICE' :
									'📢 NOTICE'}
						</span>
						{timeRemaining && (
							<Badge variant="outline" className="text-xs">
								{timeRemaining}
							</Badge>
						)}
					</div>
				</div>

				<h3 className="text-xl font-bold mb-3">{currentNotice.title}</h3>
				<div className={`prose prose-sm ${colors.text} mb-4 p-4 rounded-lg ${colors.bg}`}>
					{currentNotice.content}
				</div>

				<div className="flex items-center gap-2 text-xs text-gray-500 mt-4 mb-6">
					<span>
						Posted {format(new Date(currentNotice.publishedAt), "MMM d, yyyy")}
					</span>
					{currentNotice.expiresAt && (
						<>
							<span>•</span>
							<span>
								Expires {format(new Date(currentNotice.expiresAt), "MMM d, yyyy")}
							</span>
						</>
					)}
				</div>

				{/* Action buttons */}
				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={() => handleDismiss('permanent')}
						className={`flex-1 ${colors.badge} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium`}
					>
						I Understand - Don't Show Again
					</button>
					<div className="flex gap-2 flex-1">
						<button
							onClick={() => handleDismiss('1hour')}
							className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm"
						>
							Snooze 1hr
						</button>
						<button
							onClick={() => handleDismiss('24hours')}
							className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm"
						>
							Snooze 24hr
						</button>
					</div>
				</div>
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