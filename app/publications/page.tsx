"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Container } from "@/components/ui/container";
import { PublicationCard } from "@/components/publication-card";
import { usePublications } from "@/hooks/use-publications";
import { useUsers } from "@/hooks/use-users";
import { Heading } from "@/components/ui/heading";

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

export default function PublicationsPage() {
	const [search, setSearch] = useState("");
	const [type, setType] = useState<string | null>(null);
	const [authorId, setAuthorId] = useState<string | null>(null);

	const { data: publications = [], isLoading: loadingPublications } =
		usePublications();
	const { data: users = [], isLoading: loadingUsers } = useUsers();

	const filteredPublications = publications.filter((publication) => {
		const matchesSearch = publication.title
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesType = type ? publication.type === type : true;
		const matchesAuthor = authorId ? publication.authorId === authorId : true;
		return matchesSearch && matchesType && matchesAuthor;
	});

	return (
		<Container>
			<div className="space-y-8 py-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Heading
						title="Publications"
						description="Explore our collection of publications, books, articles, acts and rules"
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="grid gap-4 md:grid-cols-[1fr_200px_200px]"
				>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search publications..."
							className="pl-9"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<Select onValueChange={setType}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="BOOK">Books</SelectItem>
							<SelectItem value="ARTICLE">Articles</SelectItem>
							<SelectItem value="REPORT">Reports</SelectItem>
							
							<SelectItem value="OTHER">Other</SelectItem>
						</SelectContent>
					</Select>
					<Select onValueChange={setAuthorId}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by author" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Authors</SelectItem>
							{users.map((user) => (
								<SelectItem key={user.id} value={user.id}>
									{user.name || user.email}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</motion.div>

				{loadingPublications ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div
								key={i}
								className="h-[400px] rounded-lg bg-muted animate-pulse"
							/>
						))}
					</div>
				) : filteredPublications.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col items-center justify-center space-y-4 py-12 text-center"
					>
						<Filter className="h-12 w-12 text-muted-foreground" />
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">No publications found</h3>
							<p className="text-sm text-muted-foreground">
								Try adjusting your search or filters
							</p>
						</div>
						{(search || type || authorId) && (
							<Button
								variant="outline"
								onClick={() => {
									setSearch("");
									setType(null);
									setAuthorId(null);
								}}
							>
								Clear filters
							</Button>
						)}
					</motion.div>
				) : (
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{filteredPublications.map((publication) => (
							<motion.div key={publication.id} variants={item}>
								<PublicationCard publication={publication} />
							</motion.div>
						))}
					</motion.div>
				)}
			</div>
		</Container>
	);
}
