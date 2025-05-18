import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import type { PressRelease } from "@/app/admin/press-releases/columns";

interface PressReleaseCardProps {
	pressRelease: PressRelease;
	featured?: boolean;
}

export default function PressReleaseCard({
	pressRelease,
	featured = false,
}: PressReleaseCardProps) {
	const {
		title,
		slug,
		excerpt,
		image,
		youtubeUrl,
		websiteUrls,
		publishedAt,
		author,
	} = pressRelease;

	const getYouTubeEmbedUrl = (url: string) => {
		try {
			const videoId = url.split("v=")[1].split("&")[0];
			return `https://www.youtube.com/embed/${videoId}`;
		} catch (error) {
			return null;
		}
	};

	return (
		<Card className={featured ? "border-primary" : ""}>
			{image && (
				<div className="relative aspect-video w-full overflow-hidden">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					{featured && (
						<div className="absolute right-2 top-2">
							<Badge>Featured</Badge>
						</div>
					)}
				</div>
			)}

			{youtubeUrl && (
				<div className="relative aspect-video w-full">
					<iframe
						src={getYouTubeEmbedUrl(youtubeUrl)}
						title={title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 h-full w-full border-0"
					/>
				</div>
			)}

			<CardHeader>
				<div className="space-y-1">
					<Link href={`/press-releases/${slug}`} className="hover:underline">
						<h3 className="text-2xl font-bold">{title}</h3>
					</Link>
					{author?.name && (
						<p className="text-sm text-muted-foreground">By {author.name}</p>
					)}
					{publishedAt && (
						<div className="flex items-center text-sm text-muted-foreground">
							<Calendar className="mr-1 h-4 w-4" />
							{format(new Date(publishedAt), "MMMM d, yyyy")}
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent>
				{excerpt && <p className="text-muted-foreground">{excerpt}</p>}
				{websiteUrls && websiteUrls.length > 0 && (
					<div className="mt-4 space-y-2">
						<h4 className="font-semibold">Related Links:</h4>
						<ul className="space-y-1">
							{websiteUrls.map((url, index) => (
								<li key={url} className="flex items-center">
									<ExternalLink className="mr-2 h-4 w-4" />
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-primary hover:underline"
									>
										{new URL(url).hostname}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>

			<CardFooter>
				<Link href={`/press-releases/${slug}`}>
					<Button variant="secondary">Read More</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
