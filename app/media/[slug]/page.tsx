"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	User,
	Tag,
	Video,
	Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { use } from "react";

interface Media {
	id: string;
	title: string;
	slug: string;
	description: string;
	mediaUrl: string;
	mediaType: string;
	thumbnail: string | null;
	featured: boolean;
	published: boolean;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
	author: {
		name: string;
	};
	category?: {
		name: string;
		slug: string;
	} | null;
}

export default function MediaDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	// Use React.use to unwrap params
	const { slug } = use(params);
	const [media, setMedia] = useState<Media | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchMedia = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/media/slug/${slug}`);

				if (!response.ok) {
					if (response.status === 404) {
						throw new Error("Media not found");
					}
					throw new Error("Failed to fetch media");
				}

				const data = await response.json();
				setMedia(data);
			} catch (error) {
				console.error("Error fetching media:", error);
				setError(error.message || "Failed to load media");
			} finally {
				setLoading(false);
			}
		};

		fetchMedia();
	}, [slug]);

	const getMediaTypeIcon = (type: string) => {
		switch (type) {
			case "VIDEO":
				return <Video className="h-6 w-6" />;
			case "IMAGE":
				return <ImageIcon className="h-6 w-6" />;
			default:
				return <Video className="h-6 w-6" />;
		}
	};

	const renderMediaContent = () => {
		if (!media) return null;

		switch (media.mediaType) {
			case "VIDEO":
				// Check if it's a YouTube URL
				if (
					media.mediaUrl.includes("youtube.com") ||
					media.mediaUrl.includes("youtu.be")
				) {
					const videoId = getYouTubeVideoId(media.mediaUrl);
					return (
						<div className="aspect-video w-full">
							<iframe
								src={`https://www.youtube.com/embed/${videoId}`}
								title={media.title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="w-full h-full"
							></iframe>
						</div>
					);
				}

				// Regular video file
				return (
					<video
						src={media.mediaUrl}
						controls
						poster={media.thumbnail || undefined}
						className="w-full rounded-lg"
					>
						Your browser does not support the video tag.
					</video>
				);

			case "IMAGE":
				return (
					<div className="flex justify-center">
						<img
							src={media.mediaUrl}
							alt={media.title}
							className="max-w-full rounded-lg"
						/>
					</div>
				);

			default:
				// For other types, provide a link to the media
				return (
					<div className="bg-muted p-6 rounded-lg text-center">
						<div className="flex justify-center mb-4">
							{getMediaTypeIcon(media.mediaType)}
						</div>
						<h3 className="text-lg font-medium mb-4">
							This media requires external viewing
						</h3>
						<Button asChild>
							<a
								href={media.mediaUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Open Media
							</a>
						</Button>
					</div>
				);
		}
	};

	const getYouTubeVideoId = (url: string) => {
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};

	if (loading) {
		return (
			<div className="container mx-auto py-12">
				<div className="mb-8">
					<Button variant="ghost" className="mb-6">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Media
					</Button>
					<Skeleton className="h-12 w-3/4 mb-4" />
					<Skeleton className="h-6 w-1/2 mb-8" />
					<Skeleton className="aspect-video w-full mb-8" />
					<Skeleton className="h-32 w-full mb-4" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-12">
				<div className="text-center py-12">
					<h2 className="text-2xl font-bold mb-4">Error</h2>
					<p className="text-muted-foreground mb-6">{error}</p>
					<Button onClick={() => router.push("/media")}>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Media
					</Button>
				</div>
			</div>
		);
	}

	if (!media) {
		return (
			<div className="container mx-auto py-12">
				<div className="text-center py-12">
					<h2 className="text-2xl font-bold mb-4">Media Not Found</h2>
					<p className="text-muted-foreground mb-6">
						The media you're looking for doesn't exist or has been removed.
					</p>
					<Button onClick={() => router.push("/media")}>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Media
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12">
			<Button
				variant="ghost"
				className="mb-6"
				onClick={() => router.push("/media")}
			>
				<ArrowLeft className="mr-2 h-4 w-4" /> Back to Media
			</Button>

			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-4">{media.title}</h1>
				<div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
					<div className="flex items-center">
						<User className="mr-2 h-4 w-4" />
						{media.author.name}
					</div>
					{media.publishedAt && (
						<div className="flex items-center">
							<Calendar className="mr-2 h-4 w-4" />
							{format(new Date(media.publishedAt), "MMMM d, yyyy")}
						</div>
					)}
					{media.category && (
						<div className="flex items-center">
							<Tag className="mr-2 h-4 w-4" />
							<Link href={`/media?category=${media.category.slug}`}>
								<Badge variant="outline">{media.category.name}</Badge>
							</Link>
						</div>
					)}
					<Badge className="ml-auto">{media.mediaType}</Badge>
				</div>

				<Card className="mb-8">
					<CardContent className="p-0">{renderMediaContent()}</CardContent>
				</Card>

				<div className="prose max-w-none">
					<h2 className="text-2xl font-bold mb-4">Description</h2>
					<div className="whitespace-pre-line">{media.description}</div>
				</div>
			</div>

			{/* Related media could be added here */}
		</div>
	);
}
