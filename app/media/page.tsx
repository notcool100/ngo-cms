"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Video, Music, Film, Mic, Newspaper, FileQuestion, Play } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

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

interface Category {
	id: string;
	name: string;
	slug: string;
}

export default function MediaPage() {
	return (
		<Suspense fallback={<MediaPageLoading />}>
			<MediaPageContent />
		</Suspense>
	);
}

function MediaPageLoading() {
	return (
		<div className="container mx-auto py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Media Gallery</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Explore our collection of videos, interviews, documentaries, and more.
				</p>
			</div>
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		</div>
	);
}

function MediaPageContent() {
	const [media, setMedia] = useState<Media[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const category = searchParams.get("category");
		const type = searchParams.get("type");
		const search = searchParams.get("search");

		if (category) setSelectedCategory(category);
		if (type) setSelectedType(type);
		if (search) setSearchTerm(search);

		fetchMedia();
		fetchCategories();
	}, [searchParams]);

	const fetchMedia = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/media");
			if (!response.ok) {
				throw new Error("Failed to fetch media");
			}
			const data = await response.json();
			setMedia(data);
		} catch (error) {
			console.error("Error fetching media:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch("/api/categories");
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}
			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const filteredMedia = media.filter((item) => {
		const matchesSearch = searchTerm
			? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase())
			: true;

		const matchesCategory = selectedCategory
			? item.category?.slug === selectedCategory
			: true;

		const matchesType = selectedType ? item.mediaType === selectedType : true;

		return matchesSearch && matchesCategory && matchesType;
	});

	const getMediaTypeIcon = (type: string) => {
		switch (type) {
			case "VIDEO":
				return <Video className="h-6 w-6" />;
			case "AUDIO":
				return <Music className="h-6 w-6" />;
			case "DOCUMENTARY":
				return <Film className="h-6 w-6" />;
			case "INTERVIEW":
				return <Mic className="h-6 w-6" />;
			case "NEWS":
				return <Newspaper className="h-6 w-6" />;
			default:
				return <FileQuestion className="h-6 w-6" />;
		}
	};

	const getMediaTypeColor = (type: string) => {
		switch (type) {
			case "VIDEO":
				return "bg-blue-500";
			case "AUDIO":
				return "bg-green-500";
			case "DOCUMENTARY":
				return "bg-purple-500";
			case "INTERVIEW":
				return "bg-yellow-500";
			case "NEWS":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const featuredMedia = filteredMedia.filter((item) => item.featured);

	const getYouTubeVideoId = (url: string) => {
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};

	return (
		<div className="container mx-auto py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Media Gallery</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Explore our collection of videos, interviews, documentaries, and more.
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-4 mb-8">
				<div className="flex-1">
					<Input
						placeholder="Search media..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full"
					/>
				</div>
				<div className="w-full md:w-64">
					<Select
						value={selectedCategory || "all"}
						onValueChange={(value) =>
							setSelectedCategory(value === "all" ? null : value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.slug}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="w-full md:w-64">
					<Select
						value={selectedType || "all"}
						onValueChange={(value) =>
							setSelectedType(value === "all" ? null : value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="All Media Types" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Media Types</SelectItem>
							<SelectItem value="VIDEO">Videos</SelectItem>
							<SelectItem value="AUDIO">Audio</SelectItem>
							<SelectItem value="DOCUMENTARY">Documentaries</SelectItem>
							<SelectItem value="INTERVIEW">Interviews</SelectItem>
							<SelectItem value="NEWS">News</SelectItem>
							<SelectItem value="OTHER">Other</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Tabs defaultValue="all" className="mb-8">
				<TabsList className="mb-4">
					<TabsTrigger value="all">All Media</TabsTrigger>
					<TabsTrigger value="videos">Videos</TabsTrigger>
					<TabsTrigger value="audio">Audio</TabsTrigger>
					<TabsTrigger value="documentaries">Documentaries</TabsTrigger>
					<TabsTrigger value="interviews">Interviews</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<MediaGrid
						media={filteredMedia}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
						getYouTubeVideoId={getYouTubeVideoId}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="videos">
					<MediaGrid
						media={filteredMedia.filter((item) => item.mediaType === "VIDEO")}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
						getYouTubeVideoId={getYouTubeVideoId}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="audio">
					<MediaGrid
						media={filteredMedia.filter((item) => item.mediaType === "AUDIO")}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
						getYouTubeVideoId={getYouTubeVideoId}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="documentaries">
					<MediaGrid
						media={filteredMedia.filter(
							(item) => item.mediaType === "DOCUMENTARY",
						)}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
						getYouTubeVideoId={getYouTubeVideoId}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="interviews">
					<MediaGrid
						media={filteredMedia.filter(
							(item) => item.mediaType === "INTERVIEW",
						)}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
						getYouTubeVideoId={getYouTubeVideoId}
						loading={loading}
					/>
				</TabsContent>
			</Tabs>

			{featuredMedia.length > 0 && (
				<div className="mb-12">
					<h2 className="text-2xl font-bold mb-6">Featured Media</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{featuredMedia.map((item) => (
							<MediaCard
								key={item.id}
								media={item}
								getMediaTypeIcon={getMediaTypeIcon}
								getMediaTypeColor={getMediaTypeColor}
								getYouTubeVideoId={getYouTubeVideoId}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function MediaGrid({
	media,
	getMediaTypeIcon,
	getMediaTypeColor,
	getYouTubeVideoId,
	loading,
}: {
	media: Media[];
	getMediaTypeIcon: (type: string) => JSX.Element;
	getMediaTypeColor: (type: string) => string;
	getYouTubeVideoId: (url: string) => string | null;
	loading: boolean;
}) {
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (media.length === 0) {
		return (
			<div className="text-center py-12">
				<h3 className="text-xl font-medium mb-2">No media found</h3>
				<p className="text-muted-foreground">
					Try adjusting your search or filters to find what you're looking for.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{media.map((item) => (
				<MediaCard
					key={item.id}
					media={item}
					getMediaTypeIcon={getMediaTypeIcon}
					getMediaTypeColor={getMediaTypeColor}
					getYouTubeVideoId={getYouTubeVideoId}
				/>
			))}
		</div>
	);
}

function MediaCard({
	media,
	getMediaTypeIcon,
	getMediaTypeColor,
	getYouTubeVideoId,
}: {
	media: Media;
	getMediaTypeIcon: (type: string) => JSX.Element;
	getMediaTypeColor: (type: string) => string;
	getYouTubeVideoId: (url: string) => string | null;
}) {
	const isVideo = media.mediaType === "VIDEO";
	const videoId = isVideo ? getYouTubeVideoId(media.mediaUrl) : null;
	const isYouTube = !!videoId;

	const CardUI = (
		<Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-muted/20">
			<div className="relative aspect-video bg-muted overflow-hidden">
				{media.thumbnail ? (
					<img
						src={media.thumbnail}
						alt={media.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-muted">
						{getMediaTypeIcon(media.mediaType)}
					</div>
				)}
				<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
					{isVideo && (
						<div className="bg-primary text-white p-4 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
							<Play className="h-6 w-6" />
						</div>
					)}
				</div>
				<Badge
					className={`absolute top-2 right-2 ${getMediaTypeColor(
						media.mediaType,
					)} border-none text-white`}
				>
					{media.mediaType}
				</Badge>
			</div>
			<CardHeader className="p-5">
				<CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
					{media.title}
				</CardTitle>
				<CardDescription className="pt-2 flex flex-col gap-2">
					<div className="flex items-center justify-between">
						{media.category && (
							<Badge variant="secondary" className="bg-primary/5 text-primary border-none">
								{media.category.name}
							</Badge>
						)}
						<span className="text-xs text-muted-foreground font-medium">
							By {media.author.name}
						</span>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent className="px-5 pb-5 flex-grow">
				<p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
					{media.description}
				</p>
			</CardContent>
			<CardFooter className="px-5 pb-5 pt-0 mt-auto flex gap-2">
				{isVideo ? (
					<Button asChild className="w-full rounded-xl">
						<span className="cursor-pointer">Watch Now</span>
					</Button>
				) : (
					<Button asChild className="w-full rounded-xl">
						<Link href={`/media/${media.slug}`}>View Details</Link>
					</Button>
				)}
				{isVideo && (
					<Button asChild variant="outline" className="px-3 rounded-xl">
						<Link href={`/media/${media.slug}`} title="View detail page">
							<FileQuestion className="h-4 w-4" />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	);

	if (isVideo && isYouTube) {
		const embedUrl = `https://www.youtube.com/embed/${videoId}`;
		return (
			<Dialog>
				<DialogTrigger asChild>
					<div className="cursor-pointer h-full">{CardUI}</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none rounded-2xl shadow-2xl">
					<DialogHeader className="sr-only">
						<DialogTitle>{media.title}</DialogTitle>
					</DialogHeader>
					<div className="aspect-video w-full">
						<iframe
							src={embedUrl}
							title={media.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="w-full h-full border-none"
						></iframe>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return <Link href={`/media/${media.slug}`}>{CardUI}</Link>;
}
