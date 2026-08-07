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
	Sparkles,
	Target,
	Users,
	Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FadeIn } from "@/components/animations/fade-in";
import { HeroCarousel } from "@/components/animations/hero-carousel";
import { MediaSection } from "@/components/media-section";
import { PartnersCarousel } from "@/components/partners-carousel";
import { ThematicAreaTimeline } from "@/components/thematic-area-timeline";
import { OrgChart } from "@/components/org-chart";
import { PARTNERS } from "@/lib/partners";
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
	const [thematicAreas, setThematicAreas] = useState<
		typeof INWOLAG_CONTENT.thematicAreas | null
	>(null);

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

	useEffect(() => {
		const fetchThematicAreas = async () => {
			try {
				const response = await fetch("/api/thematic-areas");
				if (!response.ok) {
					throw new Error("Failed to fetch thematic areas");
				}
				const responseData = await response.json();
				if (Array.isArray(responseData.data) && responseData.data.length > 0) {
					setThematicAreas(responseData.data);
				}
			} catch (error) {
				console.error("Error fetching thematic areas:", error);
			}
		};

		fetchThematicAreas();
	}, []);

	const sections = aboutData?.sections || [];
	const team = aboutData?.team || [];
	const mission = sections.find((section) => section.type === "mission")?.content || fallbackMission;
	const vision = sections.find((section) => section.type === "vision")?.content || fallbackVision;
	const historySections = sections.filter((section) => section.type === "history");
	const resolvedHistorySections =
		historySections.length > 0 ? historySections : fallbackHistory;

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

			<section className="py-20 bg-muted/10">
				<div className="container">
					<div className="grid gap-8 lg:grid-cols-2">
						<FadeIn>
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-6 flex items-center gap-3">
									<div className="rounded-full bg-primary/10 p-3 text-primary">
										<Sparkles className="h-6 w-6" />
									</div>
									<div>
										<Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
											What We Do
										</Badge>
										<h2 className="text-3xl font-bold">What We Do</h2>
									</div>
								</div>
								<p className="text-muted-foreground leading-relaxed">
									{INWOLAG_CONTENT.whatWeDo}
								</p>
								<ul className="mt-5 space-y-3">
									{INWOLAG_CONTENT.whatWeDoAreas.map((area) => (
										<li key={area} className="flex items-start gap-2 text-muted-foreground">
											<Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
											<span>{area}</span>
										</li>
									))}
								</ul>
							</div>
						</FadeIn>
						<FadeIn delay={0.1}>
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-6 flex items-center gap-3">
									<div className="rounded-full bg-primary/10 p-3 text-primary">
										<Target className="h-6 w-6" />
									</div>
									<div>
										<Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
											Why We Do
										</Badge>
										<h2 className="text-3xl font-bold">Why We Do</h2>
									</div>
								</div>
								<p className="text-muted-foreground leading-relaxed">
									{INWOLAG_CONTENT.whyWeDo}
								</p>
								<ul className="mt-5 space-y-3">
									{INWOLAG_CONTENT.objectives.map((objective) => (
										<li key={objective} className="flex items-start gap-2 text-muted-foreground">
											<Target className="mt-1 h-4 w-4 shrink-0 text-primary" />
											<span>{objective}</span>
										</li>
									))}
								</ul>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>

			<section className="bg-muted/10 py-20">
				<div className="container">
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
								<p className="mb-4 text-sm text-muted-foreground">
									Click an area to see its timeline of cases, activities, and
									publications.
								</p>
								<ThematicAreaTimeline
								areas={thematicAreas ?? INWOLAG_CONTENT.thematicAreas}
							/>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>

			<MediaSection />

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

			<section className="bg-muted/10 py-20">
				<div className="container">
					<div className="mb-12 text-center">
						<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
							Organizational Structure
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							How INWOLAG Is Organized
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
							Our governance and staff structures work together to guide strategy and deliver programs on the ground.
						</p>
					</div>

					<div className="space-y-12">
						<FadeIn>
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<h3 className="mb-2 text-xl font-bold">INWOLAG Organogram</h3>
								<p className="mb-4 text-sm text-muted-foreground">
									Board governance structure.
								</p>
								<OrgChart root={INWOLAG_CONTENT.governanceOrgChart} />
							</div>
						</FadeIn>

						<FadeIn delay={0.1}>
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<h3 className="mb-2 text-xl font-bold">Staff Organogram</h3>
								<p className="mb-4 text-sm text-muted-foreground">
									Program and operations staffing structure.
								</p>
								<OrgChart root={INWOLAG_CONTENT.staffOrgChart} />
							</div>
						</FadeIn>
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
					<PartnersCarousel partners={PARTNERS} />
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
