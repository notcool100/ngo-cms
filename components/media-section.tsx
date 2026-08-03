"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Newspaper, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { ScaleIn } from "@/components/animations/scale-in";
import { INWOLAG_CONTENT } from "@/lib/inwolag-content";
import { extractYoutubeId } from "@/lib/youtube";

const ALL_MEDIA_IDS = INWOLAG_CONTENT.mediaLinks.map(extractYoutubeId);

interface VideoMeta {
	title: string;
	author: string;
}

function VideoCard({ id, index }: { id: string; index: number }) {
	const [playing, setPlaying] = useState(false);
	const [meta, setMeta] = useState<VideoMeta | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetch(
			`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
		)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (!cancelled && data) {
					setMeta({ title: data.title, author: data.author_name });
				}
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [id]);

	return (
		<FadeIn delay={index * 0.08}>
			<div className="group overflow-hidden rounded-3xl border border-muted/20 bg-white shadow-sm transition-shadow hover:shadow-md">
				<div className="relative aspect-video w-full overflow-hidden bg-muted/20">
					{playing ? (
						<iframe
							src={`https://www.youtube.com/embed/${id}?autoplay=1`}
							title={meta?.title ?? "INWOLAG media coverage"}
							allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
							allowFullScreen
							className="h-full w-full"
						/>
					) : (
						<button
							type="button"
							onClick={() => setPlaying(true)}
							className="group/play relative h-full w-full"
							aria-label={`Play video: ${meta?.title ?? "INWOLAG media coverage"}`}
						>
							<img
								src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
								alt={meta?.title ?? "INWOLAG media coverage"}
								className="h-full w-full object-cover transition-transform duration-300 group-hover/play:scale-105"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/play:bg-black/30">
								<span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform group-hover/play:scale-110">
									<Play className="ml-1 h-6 w-6 fill-primary text-primary" />
								</span>
							</div>
						</button>
					)}
				</div>

				<div className="p-5">
					<h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
						{meta?.title ?? "INWOLAG in the media"}
					</h3>
					{meta?.author && (
						<p className="mt-1 text-sm text-muted-foreground">{meta.author}</p>
					)}
				</div>
			</div>
		</FadeIn>
	);
}

interface MediaSectionProps {
	limit?: number;
	showViewAllLink?: boolean;
	className?: string;
}

export function MediaSection({
	limit,
	showViewAllLink = false,
	className = "bg-muted/10 py-20",
}: MediaSectionProps) {
	const videoIds = limit ? ALL_MEDIA_IDS.slice(0, limit) : ALL_MEDIA_IDS;

	return (
		<section className={className}>
			<div className="container">
				<div className="mb-12 text-center">
					<ScaleIn>
						<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
							<Newspaper className="mr-1 h-3.5 w-3.5" />
							In the Media
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							INWOLAG in Media
						</h2>
						<p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
							Watch coverage, interviews, and features on INWOLAG&apos;s work
							with Indigenous women across Nepal.
						</p>
					</ScaleIn>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{videoIds.map((id, index) => (
						<VideoCard key={id} id={id} index={index} />
					))}
				</div>

				{showViewAllLink && (
					<div className="mt-12 text-center">
						<Link href="/media">
							<Button
								variant="outline"
								size="lg"
								className="rounded-full px-8 gap-2 border-primary/20 hover:border-primary"
							>
								View All Media
								<ArrowRight className="h-4 w-4" />
							</Button>
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
