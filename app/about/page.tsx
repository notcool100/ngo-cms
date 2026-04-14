"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowRight,
	Globe,
	Handshake,
	MapPin,
	Scale,
	Users,
	Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FadeIn } from "@/components/animations/fade-in";
import { HeroParallax } from "@/components/animations/hero-parallax";
import { ScaleIn } from "@/components/animations/scale-in";
import { TeamCard } from "@/components/team-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INWOLAG_CONTENT } from "@/lib/inwolag-content";

interface TeamMember {
	id: number;
	name: string;
	position: string;
	bio: string;
	image?: string | null;
	socialLinks?: Record<string, string> | null;
	order: number;
	active: boolean;
	parentId?: number | null;
	teamType: string;
	createdAt: Date;
	updatedAt: Date;
}

interface AboutSection {
	id: number;
	title: string;
	subtitle?: string | null;
	content: string;
	order: number;
	type: string;
	active: boolean;
}

interface AboutPageData {
	sections: AboutSection[];
	team: TeamMember[];
}

const fallbackMission =
	INWOLAG_CONTENT.aboutSections.find((section) => section.type === "mission")
		?.content || "";
const fallbackVision =
	INWOLAG_CONTENT.aboutSections.find((section) => section.type === "vision")
		?.content || "";
const fallbackHistory = INWOLAG_CONTENT.aboutSections.filter(
	(section) => section.type === "history",
);

export default function AboutPage() {
	const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAboutData = async () => {
			try {
				const response = await fetch("/api/about");
				if (!response.ok) {
					throw new Error("Failed to fetch about data");
				}
				const responseData = await response.json();
				setAboutData(responseData.data || null);
			} catch (error) {
				console.error("Error fetching about data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAboutData();
	}, []);

	const sections = aboutData?.sections || [];
	const team = aboutData?.team || [];
	const mission = sections.find((section) => section.type === "mission")?.content || fallbackMission;
	const vision = sections.find((section) => section.type === "vision")?.content || fallbackVision;
	const historySections = sections.filter((section) => section.type === "history");
	const resolvedHistorySections =
		historySections.length > 0 ? historySections : fallbackHistory;
	const boardMembers = team.filter((member) => member.teamType === "BOARD");
	const networkMembers = team.filter((member) => member.teamType === "STAFF");

	return (
		<div className="flex flex-col">
			<HeroParallax
				imageUrl="/heroimage.jpg?height=1200&width=1920"
				alt="About INWOLAG"
				overlayColor="from-primary/85 via-primary/75 to-primary/65"
			>
				<div className="mx-auto max-w-5xl px-4 text-center text-white">
					<Badge className="mb-6 bg-white/15 text-white hover:bg-white/20">
						About INWOLAG
					</Badge>
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
						Indigenous women's rights, led by Indigenous women
					</h1>
					<p className="mx-auto mt-6 max-w-3xl text-lg text-white/90 md:text-xl">
						{INWOLAG_CONTENT.heroSummary}
					</p>
				</div>
			</HeroParallax>

			<section className="bg-gradient-to-b from-white to-muted/20 py-16">
				<div className="container">
					<div className="grid gap-6 md:grid-cols-4">
						{INWOLAG_CONTENT.stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								className="rounded-2xl border border-muted/20 bg-white p-8 text-center shadow-sm"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-40px" }}
								transition={{ delay: index * 0.1, duration: 0.4 }}
							>
								<p className="text-4xl font-bold text-primary">{stat.value}</p>
								<p className="mt-2 text-sm font-medium text-muted-foreground">
									{stat.label}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="container">
					<div className="grid gap-8 lg:grid-cols-2">
						<FadeIn>
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-6 flex items-center gap-3">
									<div className="rounded-full bg-primary/10 p-3 text-primary">
										<Scale className="h-6 w-6" />
									</div>
									<div>
										<Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
											Mission
										</Badge>
										<h2 className="text-3xl font-bold">Our Mission</h2>
									</div>
								</div>
								<div
									className="prose max-w-none text-muted-foreground"
									dangerouslySetInnerHTML={{ __html: mission }}
								/>
							</div>
						</FadeIn>
						<FadeIn delay={0.1}>
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-6 flex items-center gap-3">
									<div className="rounded-full bg-primary/10 p-3 text-primary">
										<Globe className="h-6 w-6" />
									</div>
									<div>
										<Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
											Vision
										</Badge>
										<h2 className="text-3xl font-bold">Our Vision</h2>
									</div>
								</div>
								<div
									className="prose max-w-none text-muted-foreground"
									dangerouslySetInnerHTML={{ __html: vision }}
								/>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>

			<section className="bg-muted/10 py-20">
				<div className="container">
					<div className="mb-12 text-center">
						<ScaleIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Who We Are
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								History and objectives
							</h2>
						</ScaleIn>
					</div>

					<div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="space-y-8">
							{resolvedHistorySections.map((section, index) => (
								<FadeIn key={`${section.title}-${index}`} delay={index * 0.1}>
									<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
										<h3 className="text-2xl font-bold">{section.title}</h3>
										{section.subtitle && (
											<p className="mt-2 font-medium text-primary">
												{section.subtitle}
											</p>
										)}
										<div
											className="prose mt-5 max-w-none text-muted-foreground"
											dangerouslySetInnerHTML={{ __html: section.content }}
										/>
									</div>
								</FadeIn>
							))}
						</div>

						<div className="space-y-8">
							<FadeIn delay={0.2}>
								<div className="overflow-hidden rounded-3xl border border-muted/20 bg-white shadow-sm">
									<div className="relative h-72">
										<Image
											src="/heroimage.jpg?height=720&width=960"
											alt="INWOLAG community meeting"
											fill
											className="object-cover"
										/>
									</div>
									<div className="p-8">
										<div className="mb-4 flex items-center gap-3">
											<MapPin className="h-5 w-5 text-primary" />
											<h3 className="text-xl font-bold">Where we have worked</h3>
										</div>
										<p className="text-muted-foreground">
											{INWOLAG_CONTENT.reachSummary}
										</p>
									</div>
								</div>
							</FadeIn>

							<FadeIn delay={0.3}>
								<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
									<div className="mb-4 flex items-center gap-3">
										<Users className="h-5 w-5 text-primary" />
										<h3 className="text-xl font-bold">Core thematic areas</h3>
									</div>
									<div className="space-y-3">
										{INWOLAG_CONTENT.thematicAreas.map((area) => (
											<div
												key={area.slug}
												className="rounded-2xl bg-primary/5 px-4 py-3 text-sm font-medium text-foreground"
											>
												{area.title}
											</div>
										))}
									</div>
								</div>
							</FadeIn>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="container grid gap-8 lg:grid-cols-2">
					<FadeIn>
						<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
							<div className="mb-6 flex items-center gap-3">
								<Handshake className="h-6 w-6 text-primary" />
								<div>
									<Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
										Partners
									</Badge>
									<h2 className="text-3xl font-bold">Our partners</h2>
								</div>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								{INWOLAG_CONTENT.partners.map((partner) => (
									<div
										key={partner}
										className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-medium"
									>
										{partner}
									</div>
								))}
							</div>
						</div>
					</FadeIn>

					<FadeIn delay={0.1}>
						<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
							<div className="mb-6">
								<Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
									In Media
								</Badge>
								<h2 className="text-3xl font-bold">Watch and learn more</h2>
							</div>
							<div className="space-y-6">
								<p className="text-muted-foreground">
									Watch our documentaries, interviews, and media appearances to learn more about our work and impact.
								</p>
								<Link href="/media?category=videos">
									<Button className="w-full py-8 text-lg rounded-2xl group">
										<Video className="mr-3 h-5 w-5" />
										Browse Video Gallery
										<ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
									</Button>
								</Link>
							</div>
						</div>
					</FadeIn>
				</div>
			</section>

			<section className="bg-gradient-to-b from-muted/20 to-white py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
							Leadership & Governance
						</Badge>
						<h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
							The people behind INWOLAG
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
							Guided by a dedicated Board of Directors and supported by an extensive regional network of advisors and focal persons.
						</p>
					</div>

					<Tabs defaultValue="board" className="mx-auto max-w-6xl">
						<div className="mb-10 flex justify-center">
							<TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl bg-muted/50 p-1">
								<TabsTrigger
									value="board"
									className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
								>
									Board of Directors
								</TabsTrigger>
								<TabsTrigger
									value="network"
									className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
								>
									Advisory & Focal Network
								</TabsTrigger>
							</TabsList>
						</div>

						<AnimatePresence mode="wait">
							<TabsContent value="board" key="team-board" className="focus-visible:outline-none">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
									className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm"
								>
									<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
										{isLoading ? (
											<p className="col-span-full py-20 text-center text-muted-foreground">
												Loading board members...
											</p>
										) : boardMembers.length > 0 ? (
											boardMembers.map((member, index) => (
												<TeamCard key={member.id || `board-${index}`} member={member} />
											))
										) : (
											<p className="col-span-full py-20 text-center text-muted-foreground">
												Board information is not available.
											</p>
										)}
									</div>
								</motion.div>
							</TabsContent>

							<TabsContent value="network" key="team-network" className="focus-visible:outline-none">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
										{networkMembers.map((member, index) => (
											<TeamCard key={member.id || `network-${index}`} member={member} />
										))}
									</div>
								</motion.div>
							</TabsContent>
						</AnimatePresence>
					</Tabs>
				</div>
			</section>

			<section className="py-20">
				<div className="container">
					<div className="rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 p-12 text-center text-white shadow-xl">
						<h2 className="text-3xl font-bold sm:text-4xl">
							Work with INWOLAG
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-white/90">
							Reach out about legal aid, advocacy, research, publications, partnerships, and community-based collaboration.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-4">
							<Link href="/contact">
								<Button size="lg" className="bg-white text-primary hover:bg-white/90">
									Contact Us
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Link href="/publications">
								<Button
									size="lg"
									variant="outline"
									className="border-white text-black hover:bg-white/15"
								>
									View Publications
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
