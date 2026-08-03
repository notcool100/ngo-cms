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
	Newspaper,
	Play,
	Scale,
	Users,
	Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FadeIn } from "@/components/animations/fade-in";
import { HeroCarousel } from "@/components/animations/hero-carousel";
import { PartnersCarousel } from "@/components/partners-carousel";
import { ScaleIn } from "@/components/animations/scale-in";
import { TeamCard } from "@/components/team-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INWOLAG_CONTENT, INWOLAG_CONTENT as SITE_CONTENT } from "@/lib/inwolag-content";

export const INWOLAG_CONTENT = {
	heroSummary:
		"TODO: replace with your real hero summary paragraph shown under the About hero heading.",

	stats: [
		{ label: "TODO label 1", value: "TODO value 1" },
		{ label: "TODO label 2", value: "TODO value 2" },
		{ label: "TODO label 3", value: "TODO value 3" },
		{ label: "TODO label 4", value: "TODO value 4" },
	],

	aboutSections: [
		{
			type: "mission",
			title: "Mission",
			subtitle: null,
			content: "<p>TODO: replace with your real mission HTML content.</p>",
		},
		{
			type: "vision",
			title: "Vision",
			subtitle: null,
			content: "<p>TODO: replace with your real vision HTML content.</p>",
		},
		{
			type: "history",
			title: "TODO history section title",
			subtitle: "TODO optional subtitle",
			content: "<p>TODO: replace with your real history/objectives HTML content.</p>",
		},
	],

	reachSummary:
		"TODO: replace with your real summary of districts/regions where INWOLAG has worked.",

	partners: ["TODO Partner 1", "TODO Partner 2", "TODO Partner 3", "TODO Partner 4"],

	thematicAreas: [
		{
			slug: "legal-aid",
			title: "Legal Aid (Access to Justice)",
			description:
				"INWOLAG provides legal awareness, counseling, litigation, and psychosocial services to Indigenous women survivors of violence and rights violations, all for free. As a leading advocate for Indigenous women's rights, we bridge access to justice and empowerment at both the local and national levels.",
			focus: "Public Interest Litigation",
			activities: [
				{
					name: "Rupandehi Workshop – KAAGAPAY",
					date: "2023-07-20",
				},
			],
		},
		{
			slug: "indigenous-collective-rights",
			title: "Indigenous Collective Rights",
			description:
				"INWOLAG promotes the collective ownership, identity, and self-determination of Indigenous communities by safeguarding their ancestral lands, cultures, and traditions. With a strong emphasis on the principle of Free, Prior and Informed Consent (FPIC), we ensure that Indigenous peoples have the right to make decisions about their lands, territories, and resources before any development or policy is implemented.",
			focus: "Right to Self-determination of Indigenous Communities",
			activities: [],
		},
		{
			slug: "gender-justice-climate",
			title: "Gender Justice & Climate",
			description:
				"INWOLAG provides livelihood training programs for Indigenous women to help them mitigate and adapt to the impacts of climate change. These trainings equip women with practical skills and sustainable practices that enhance both environmental resilience and economic independence.",
			focus: null,
			activities: [],
		},
	],
};
const MEDIA_VIDEOS = [
	{ id: "ahGEuSm2sZ8" },
	{ id: "gcCUzUYFtQ8" },
	{ id: "14v3lVDglBU" },
	{ id: "5LycovAb6Go" },
	{ id: "6h-iDbUuRAU" },
	{ id: "kekdYDBBacU" },
	{ id: "no0g4BdSwGc" },
] as const;

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

	// NOTE: swap "ADVISORY" / "FOCAL" below for your actual teamType values
	// if they differ in your database.
	const boardMembers = team.filter((member) => member.teamType === "BOARD");
	const advisoryMembers = team.filter((member) => member.teamType === "ADVISORY");
	const focalMembers = team.filter((member) => member.teamType === "FOCAL");

	return (
		<div className="flex flex-col">
			<HeroCarousel
				images={[
					{ src: "/heroimage.jpg", alt: "About INWOLAG" },
					{
						src: "/images/2023-12-19, IWHRD training-1747241692300-183973691.JPG",
						alt: "IWHRD training session",
					},
					{
						src: "/images/2023-12-19, IWHRD training-1747242429112-335750128.JPG",
						alt: "IWHRD training participants",
					},
					{
						src: "/images/2024-03-26, livelihood training in tanahu-1747244951448-850044844.jpg",
						alt: "Livelihood training in Tanahu",
					},
				]}
			/>

			<section className="bg-gradient-to-b from-white to-muted/20 py-16 md:py-24">
				<div className="mx-auto max-w-5xl px-4 text-center">
					<Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
						About INWOLAG
					</Badge>
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
						Indigenous women's rights, led by Indigenous women
					</h1>
					<p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
						{INWOLAG_CONTENT.heroSummary}
					</p>
				</div>
			</section>

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

			<section className="py-16 md:py-20 bg-muted/10">
				<div className="container">
					<div className="mb-10 text-center">
						<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
							Collaboration
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Our Partners
						</h2>
					</div>
					<PartnersCarousel partners={SITE_CONTENT.partners} />
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
									<div className="space-y-4">
										{INWOLAG_CONTENT.thematicAreas.map((area) => (
											<div
												key={area.slug}
												className="rounded-2xl bg-primary/5 px-5 py-4 text-sm text-foreground"
											>
												<h4 className="mb-2 text-base font-semibold">
													{area.title}
												</h4>
												<p className="mb-2 text-muted-foreground">
													{area.description}
												</p>

												{area.focus && (
													<p className="mb-2 font-medium">
														Focus: {area.focus}
													</p>
												)}

												{area.activities.length > 0 && (
													<div>
														<p className="mb-1 font-medium">
															Activities / Projects
														</p>
														<ul className="list-inside list-disc space-y-1 text-muted-foreground">
															{area.activities.map((activity) => (
																<li key={activity.name}>
																	{activity.name}
																	{activity.date && ` (${activity.date})`}
																</li>
															))}
														</ul>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</FadeIn>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-muted/10 py-20">
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
						{MEDIA_VIDEOS.map((video, index) => (
							<VideoCard key={video.id} id={video.id} index={index} />
						))}
					</div>
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
							<TabsList className="grid w-full max-w-xl grid-cols-3 rounded-2xl bg-muted/50 p-1">
								<TabsTrigger
									value="board"
									className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
								>
									Board of Directors
								</TabsTrigger>
								<TabsTrigger
									value="advisory"
									className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
								>
									Advisory Network
								</TabsTrigger>
								<TabsTrigger
									value="focal"
									className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
								>
									Focal Network
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

							<TabsContent value="advisory" key="team-advisory" className="focus-visible:outline-none">
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
												Loading advisory network...
											</p>
										) : advisoryMembers.length > 0 ? (
											advisoryMembers.map((member, index) => (
												<TeamCard key={member.id || `advisory-${index}`} member={member} />
											))
										) : (
											<p className="col-span-full py-20 text-center text-muted-foreground">
												Advisory network information is not available.
											</p>
										)}
									</div>
								</motion.div>
							</TabsContent>

							<TabsContent value="focal" key="team-focal" className="focus-visible:outline-none">
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
												Loading focal network...
											</p>
										) : focalMembers.length > 0 ? (
											focalMembers.map((member, index) => (
												<TeamCard key={member.id || `focal-${index}`} member={member} />
											))
										) : (
											<p className="col-span-full py-20 text-center text-muted-foreground">
												Focal network information is not available.
											</p>
										)}
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