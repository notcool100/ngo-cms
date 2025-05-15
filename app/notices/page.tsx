"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { useNotices } from "@/hooks/use-notices";

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

export default function NoticesPage() {
	const [search, setSearch] = useState("");
	const { data: notices = [], isLoading } = useNotices({ active: true });

	const filteredNotices = notices.filter(
		(notice) =>
			notice.title.toLowerCase().includes(search.toLowerCase()) ||
			notice.content.toLowerCase().includes(search.toLowerCase()),
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
						title="Notices & Announcements"
						description="Stay updated with our latest notices and important announcements"
					/>
				</motion.div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search notices..."
						className="pl-10"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="space-y-4"
				>
					{isLoading ? (
						<div className="space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-32 rounded-lg border bg-muted/10 animate-pulse"
								/>
							))}
						</div>
					) : filteredNotices.length === 0 ? (
						<div className="text-center py-10">
							<AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium">No notices found</h3>
							<p className="text-muted-foreground">
								{search
									? "Try adjusting your search query"
									: "There are no active notices at the moment"}
							</p>
						</div>
					) : (
						filteredNotices.map((notice) => (
							<motion.div
								key={notice.id}
								variants={item}
								className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<h3 className="font-semibold text-lg">{notice.title}</h3>
										<p className="text-muted-foreground">{notice.content}</p>
									</div>
									{notice.important && (
										<Badge variant="destructive">Important</Badge>
									)}
								</div>
								<div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
									<span>
										Posted {format(new Date(notice.publishedAt), "PPP")}
									</span>
									{notice.expiresAt && (
										<>
											<span>•</span>
											<span>
												Expires {format(new Date(notice.expiresAt), "PPP")}
											</span>
										</>
									)}
									{notice.author?.name && (
										<>
											<span>•</span>
											<span>By {notice.author.name}</span>
										</>
									)}
								</div>
							</motion.div>
						))
					)}
				</motion.div>
			</div>
		</Container>
	);
}
