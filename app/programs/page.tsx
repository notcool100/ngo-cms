"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animations/fade-in";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { ProgramCard } from "@/components/program-card";
import { INWOLAG_CONTENT } from "@/lib/inwolag-content";

interface Program {
	id: string;
	title: string;
	slug: string;
	description: string;
	image?: string;
	content: string;
}

export default function ProgramsPage() {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchPrograms = async () => {
			try {
				const response = await fetch("/api/programs?active=true");
				if (!response.ok) {
					throw new Error("Failed to fetch programs");
				}
				const data = await response.json();
				setPrograms(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Error fetching programs:", error);
				setPrograms([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPrograms();
	}, []);

	const filteredPrograms = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return programs;
		return programs.filter(
			(program) =>
				program.title.toLowerCase().includes(query) ||
				program.description.toLowerCase().includes(query),
		);
	}, [programs, searchQuery]);

	return (
		<div className="flex flex-col">
			<section className="relative">
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/90 to-primary/70" />
				<ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
					<Image
						src="/heroimage.jpg?height=600&width=1600"
						alt="INWOLAG thematic work"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
							Thematic Work
						</Badge>
						<div className="flex justify-center">
							<AnimatedText
								text="Our Programs"
								className="text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
							/>
						</div>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[760px] text-lg text-white/90 md:text-xl"
						>
							<p className="leading-relaxed">
								INWOLAG's programs advance Indigenous women's rights through legal aid, collective rights advocacy, conservation justice, gender-just climate action, and research-led policy engagement.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			<section className="bg-muted/10 py-16">
				<div className="container grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{INWOLAG_CONTENT.stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							className="rounded-2xl border border-muted/20 bg-white p-8 text-center shadow-sm"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-40px" }}
							transition={{ delay: index * 0.08, duration: 0.4 }}
						>
							<p className="text-4xl font-bold text-primary">{stat.value}</p>
							<p className="mt-2 text-sm font-medium text-muted-foreground">
								{stat.label}
							</p>
						</motion.div>
					))}
				</div>
			</section>

			<section className="py-16">
				<div className="container">
					<div className="mb-10 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Core Areas
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Explore our thematic areas
							</h2>
							<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
								Each program area responds to documented realities faced by Indigenous women and communities across Nepal.
							</p>
						</FadeIn>
					</div>

					<div className="mx-auto mb-10 max-w-xl">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search thematic areas..."
								className="pl-10"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
							/>
						</div>
					</div>

					{isLoading ? (
						<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
							{[1, 2, 3, 4, 5].map((item) => (
								<div
									key={item}
									className="h-[360px] animate-pulse rounded-2xl bg-muted"
								/>
							))}
						</div>
					) : filteredPrograms.length === 0 ? (
						<div className="rounded-3xl border border-dashed p-12 text-center">
							<h3 className="text-xl font-semibold">No programs found</h3>
							<p className="mt-2 text-muted-foreground">
								Try a different search term or contact us for more information about our thematic work.
							</p>
						</div>
					) : (
						<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
							{filteredPrograms.map((program) => (
								<ProgramCard
									key={program.id}
									id={program.id}
									title={program.title}
									slug={program.slug}
									description={program.description}
									content={program.content}
									image={program.image}
									isFeatured={true}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			<section className="bg-white py-16">
				<div className="container">
					<div className="rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 p-10 text-center text-white shadow-xl">
						<h2 className="text-3xl font-bold sm:text-4xl">
							Support this work
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-white/90">
							Support legal aid, research, advocacy, climate resilience, and community-led action that protects the rights of Indigenous women and communities.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-4">
							<Link href="/donate">
								<Button size="lg" className="bg-white text-primary hover:bg-white/90">
									Support INWOLAG
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Link href="/contact">
								<Button
									size="lg"
									variant="outline"
									className="border-white text-black hover:bg-white/20"
								>
									Contact Our Team
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
