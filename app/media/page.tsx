"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Video, Music, Film, Mic, Newspaper, FileQuestion } from "lucide-react";

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
	const regularMedia = filteredMedia.filter((item) => !item.featured);

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
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="videos">
					<MediaGrid
						media={filteredMedia.filter((item) => item.mediaType === "VIDEO")}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="audio">
					<MediaGrid
						media={filteredMedia.filter((item) => item.mediaType === "AUDIO")}
						getMediaTypeIcon={getMediaTypeIcon}
						getMediaTypeColor={getMediaTypeColor}
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
	loading,
}: {
	media: Media[];
	getMediaTypeIcon: (type: string) => JSX.Element;
	getMediaTypeColor: (type: string) => string;
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
				/>
			))}
		</div>
	);
}

function MediaCard({
	media,
	getMediaTypeIcon,
	getMediaTypeColor,
}: {
	media: Media;
	getMediaTypeIcon: (type: string) => JSX.Element;
	getMediaTypeColor: (type: string) => string;
}) {
	return (
		<Card className="overflow-hidden h-full flex flex-col">
			<div className="relative aspect-video bg-muted">
				{media.thumbnail ? (
					<img
						src={media.thumbnail}
						alt={media.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-muted">
						{getMediaTypeIcon(media.mediaType)}
					</div>
				)}
				<Badge
					className={`absolute top-2 right-2 ${getMediaTypeColor(
						media.mediaType,
					)}`}
				>
					{media.mediaType}
				</Badge>
			</div>
			<CardHeader>
				<CardTitle className="line-clamp-2">{media.title}</CardTitle>
				<CardDescription>
					{media.category && (
						<Link href={`/media?category=${media.category.slug}`}>
							<Badge variant="outline" className="mr-2">
								{media.category.name}
							</Badge>
						</Link>
					)}
					<span className="text-sm text-muted-foreground">
						By {media.author.name}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="text-muted-foreground line-clamp-3">
					{media.description}
				</p>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link href={`/media/${media.slug}`}>View Media</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
