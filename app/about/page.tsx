"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Users,
	History,
	Heart,
	Target,
	Globe,
	ArrowRight,
	Twitter,
	Linkedin,
	Instagram,
	ChevronDown,
	Sparkles,
	Lightbulb,
	Handshake,
	Award,
} from "lucide-react";

// Import our custom components
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { CountUp } from "@/components/animations/count-up";
import { HeroParallax } from "@/components/animations/hero-parallax";
import { ScaleIn } from "@/components/animations/scale-in";
import { TeamHierarchy } from "@/components/team-hierarchy";

// Types for the about page data
interface TeamMember {
	id: number;
	name: string;
	position: string;
	bio: string;
	image: string;
	socialLinks?: Record<string, string> | null;
	order: number;
	active: boolean;
	teamType: string;
	createdAt: Date;
	updatedAt: Date;
}

interface AboutSection {
	id: number;
	title: string;
	subtitle?: string;
	content: string;
	image?: string;
	order: number;
	type: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface AboutPageData {
	sections: AboutSection[];
	team: TeamMember[];
}

export default function AboutPage() {
	const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("mission");
	const heroRef = useRef<HTMLDivElement>(null);

	// Scroll animation for the hero section
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});

	const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
	const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

	useEffect(() => {
		const fetchAboutData = async () => {
			try {
				const response = await fetch("/api/about");
				if (!response.ok) {
					throw new Error("Failed to fetch about data");
				}
				const responseData = await response.json();

				// Check if the data is in the expected format
				if (responseData.data) {
					setAboutData(responseData.data);
				} else {
					console.error("Unexpected data format:", responseData);
				}
			} catch (error) {
				console.error("Error fetching about data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAboutData();
	}, []);

	// Helper function to get sections by type
	const getSectionsByType = (type: string) => {
		if (!aboutData?.sections) return [];
		return aboutData.sections.filter((section) => section.type === type);
	};

	// Get specific sections
	const missionSections = getSectionsByType("mission");
	const visionSections = getSectionsByType("vision");
	const historySections = getSectionsByType("history");
	const valuesSections = getSectionsByType("values");
	const impactSections = getSectionsByType("impact");

	const renderSkeleton = () => (
		<div className="animate-pulse">
			<div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
			<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
			<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
			<div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
			<div className="h-4 bg-gray-200 rounded w-4/6"></div>
		</div>
	);

	// Scroll to content function
	const scrollToContent = () => {
		const contentSection = document.getElementById("about-content");
		if (contentSection) {
			contentSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="flex flex-col">
			{/* Enhanced Hero Section with Parallax */}
			<section
				ref={heroRef}
				className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
			>
				<motion.div
					className="absolute inset-0 z-0"
					style={{ opacity: heroOpacity, scale: heroScale }}
				>
					<HeroParallax
						imageUrl="/placeholder.svg?height=1200&width=1920"
						alt="About INWOLAG"
						overlayColor="from-primary/80 to-primary/60"
					>
						<div className="text-center text-white max-w-5xl mx-auto px-4">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
							>
								<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none py-2 px-4 text-sm">
									Our Story
								</Badge>
							</motion.div>

							<AnimatedText
								text="Empowering Communities Worldwide"
								className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6"
							/>

							<FadeIn
								direction="up"
								delay={0.5}
								className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
							>
								<p className="leading-relaxed font-light">
									Discover our mission, vision, and the dedicated team working
									to create lasting positive change in communities around the
									globe.
								</p>
							</FadeIn>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8, duration: 0.5 }}
								className="mt-12"
							>
								<Button
									onClick={scrollToContent}
									variant="outline"
									size="lg"
									className="rounded-full border-white/30 text-black hover:bg-white/20 backdrop-blur-sm group"
								>
									Explore Our Story
									<ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
								</Button>
							</motion.div>
						</div>
					</HeroParallax>
				</motion.div>

				{/* Animated background elements */}
				<div className="absolute inset-0 z-0 pointer-events-none">
					<motion.div
						className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl"
						animate={{
							x: [0, 30, 0],
							y: [0, 20, 0],
							scale: [1, 1.1, 1],
						}}
						transition={{
							repeat: Infinity,
							duration: 15,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl"
						animate={{
							x: [0, -40, 0],
							y: [0, -30, 0],
							scale: [1, 1.2, 1],
						}}
						transition={{
							repeat: Infinity,
							duration: 18,
							ease: "easeInOut",
						}}
					/>
				</div>

				{/* Scroll indicator */}
				<motion.div
					className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
					animate={{
						y: [0, 10, 0],
					}}
					transition={{
						repeat: Infinity,
						duration: 2,
						ease: "easeInOut",
					}}
				>
					<ChevronDown className="h-8 w-8 text-white/70" />
				</motion.div>
			</section>

			{/* Impact Stats with enhanced animations */}
			<section
				id="about-content"
				className="py-20 bg-gradient-to-b from-white to-muted/10"
			>
				<div className="container">
					<div className="text-center mb-16">
						<ScaleIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Our Impact
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
								Making a Difference
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
								Our work has touched the lives of thousands across the globe.
							</p>
						</ScaleIn>
					</div>

					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
						{[
							{
								icon: <Users className="h-6 w-6" />,
								value: 15000,
								label: "Women Empowered",
								color: "from-blue-500 to-indigo-600",
							},
							{
								icon: <Globe className="h-6 w-6" />,
								value: 25,
								label: "Countries Reached",
								color: "from-green-500 to-emerald-600",
							},
							{
								icon: <Award className="h-6 w-6" />,
								value: 120,
								label: "Projects Completed",
								color: "from-amber-500 to-orange-600",
							},
							{
								icon: <Heart className="h-6 w-6" />,
								value: 8500,
								label: "Donors Supporting",
								color: "from-pink-500 to-rose-600",
							},
						].map((stat, index) => (
							<motion.div
								key={index}
								className="bg-white rounded-xl shadow-md p-8 text-center border border-muted/10 transition-all duration-500 hover:shadow-xl"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-50px" }}
								transition={{ delay: index * 0.15, duration: 0.6 }}
								whileHover={{
									y: -10,
									transition: { duration: 0.3 },
								}}
							>
								<div className="flex justify-center mb-6">
									<div
										className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} text-white shadow-lg`}
									>
										{stat.icon}
									</div>
								</div>
								<CountUp
									end={stat.value}
									className="text-4xl font-bold text-gradient"
									duration={2.5}
								/>
								<p className="mt-3 text-muted-foreground font-medium">
									{stat.label}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Enhanced Mission & Vision Section */}
			<section className="py-24 bg-white relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
				</div>

				<div className="container relative z-10">
					<Tabs
						defaultValue="mission"
						className="w-full"
						onValueChange={setActiveTab}
					>
						<div className="text-center mb-16">
							<FadeIn>
								<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">
									Our Purpose
								</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black mb-6">
									Mission & Vision
								</h2>
								<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
									Discover what drives us and the future we're working to
									create.
								</p>
							</FadeIn>
						</div>

						<TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16 p-1 bg-muted/20 rounded-full">
							<TabsTrigger
								value="mission"
								className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full py-3 transition-all duration-300"
							>
								<Target className="mr-2 h-4 w-4 " />
								Our Mission
							</TabsTrigger>
							<TabsTrigger
								value="vision"
								className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full py-3 transition-all duration-300"
							>
								<Globe className="mr-2 h-4 w-4" />
								Our Vision
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="mission"
							className="focus-visible:outline-none focus-visible:ring-0"
						>
							{isLoading ? (
								renderSkeleton()
							) : missionSections.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
									<FadeIn direction="right">
										<div>
											<h2 className="text-3xl font-bold mb-6 text-black">
												{missionSections[0].title}
											</h2>
											<div
												className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
												dangerouslySetInnerHTML={{
													__html: missionSections[0].content,
												}}
											/>
											<motion.div
												className="mt-10"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.5 }}
											>
												<Link href="/programs">
													<Button
														size="lg"
														className="group rounded-full shadow-md hover:shadow-lg transition-all duration-300"
													>
														View Our Programs
														<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
													</Button>
												</Link>
											</motion.div>
										</div>
									</FadeIn>

									<FadeIn direction="left">
										<motion.div
											className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl"
											whileHover={{ scale: 1.03 }}
											transition={{ duration: 0.4 }}
										>
											<Image
												src={
													missionSections[0].image ||
													"/placeholder.svg?height=450&width=600"
												}
												alt="Our mission"
												fill
												className="object-cover"
											/>
											{/* Overlay gradient */}
											<div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
										</motion.div>
									</FadeIn>
								</div>
							) : (
								<div className="text-center py-12">
									<p className="text-gray-500">
										Mission information not available.
									</p>
								</div>
							)}
						</TabsContent>

						<TabsContent
							value="vision"
							className="focus-visible:outline-none focus-visible:ring-0"
						>
							{isLoading ? (
								renderSkeleton()
							) : visionSections.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
									<FadeIn direction="right">
										<motion.div
											className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl md:order-first"
											whileHover={{ scale: 1.03 }}
											transition={{ duration: 0.4 }}
										>
											<Image
												src={
													visionSections[0].image ||
													"/placeholder.svg?height=450&width=600"
												}
												alt="Our vision"
												fill
												className="object-cover"
											/>
											{/* Overlay gradient */}
											<div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
										</motion.div>
									</FadeIn>

									<FadeIn direction="left">
										<div>
											<h2 className="text-3xl font-bold mb-6 text-gradient">
												{visionSections[0].title}
											</h2>
											<div
												className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
												dangerouslySetInnerHTML={{
													__html: visionSections[0].content,
												}}
											/>
											<motion.div
												className="mt-10"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.5 }}
											>
												<Link href="/volunteer">
													<Button
														size="lg"
														className="group rounded-full shadow-md hover:shadow-lg transition-all duration-300"
													>
														Join Our Cause
														<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
													</Button>
												</Link>
											</motion.div>
										</div>
									</FadeIn>
								</div>
							) : (
								<div className="text-center py-12">
									<p className="text-gray-500">
										Vision information not available.
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Enhanced Values Section */}
			<section className="py-24 bg-gradient-to-b from-muted/20 to-white relative overflow-hidden">
				<div className="container relative z-10">
					<div className="text-center mb-16">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">
								Our Principles
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
								Our Core Values
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
								The principles that guide our work and decision-making every
								day.
							</p>
						</FadeIn>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[1, 2, 3].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-16 w-16 bg-gray-200 rounded-full mb-4 mx-auto"></div>
									<div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
									<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
								</div>
							))}
						</div>
					) : valuesSections.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
							{/* Values Cards Section */}
							<StaggerChildren
								className="grid grid-cols-1 gap-10"
								staggerDelay={0.15}
							>
								{valuesSections.map((value, index) => (
									<StaggerItem key={value.id}>
										<motion.div
											className="bg-white rounded-2xl p-10 border border-muted/10 transition-all duration-500 shadow-md hover:shadow-xl"
											whileHover={{
												y: -10,
												backgroundColor: "var(--primary-light, #f0f7ff)",
											}}
										>
											<div className="flex items-start gap-6">
												<motion.div
													className="bg-gradient-to-br from-primary to-primary/80 text-white h-20 w-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
													whileHover={{ scale: 1.1, rotate: 5 }}
													transition={{ type: "spring", stiffness: 300 }}
												>
													{index === 0 ? (
														<Heart className="h-8 w-8" />
													) : index === 1 ? (
														<Handshake className="h-8 w-8" />
													) : (
														<Lightbulb className="h-8 w-8" />
													)}
												</motion.div>
												<div className="flex-1">
													<h3 className="text-2xl font-bold mb-4 text-gradient">
														{value.title}
													</h3>
													<div
														className="prose max-w-none text-muted-foreground text-justify"
														dangerouslySetInnerHTML={{ __html: value.content }}
													/>
												</div>
											</div>
										</motion.div>
									</StaggerItem>
								))}
							</StaggerChildren>

							{/* Values Image Section */}
							<FadeIn direction="left">
								<motion.div
									className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl"
									whileHover={{ scale: 1.03 }}
									transition={{ duration: 0.4 }}
								>
									<Image
										src={
											valuesSections[0]?.image ||
											"/placeholder.svg?height=600&width=500"
										}
										alt="Our core values"
										fill
										className="object-cover"
									/>
									{/* Overlay gradient */}
									<div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
									{/* Floating badge */}
									<motion.div
										className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg"
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 }}
									>
										<p className="text-primary font-bold text-lg">
											{valuesSections.length} Core Values
										</p>
									</motion.div>
								</motion.div>
							</FadeIn>
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">Values information not available.</p>
						</div>
					)}
				</div>

				{/* Background decorative elements */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<motion.div
						className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
						animate={{
							x: [0, 50, 0],
							y: [0, 30, 0],
						}}
						transition={{
							repeat: Infinity,
							duration: 20,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
						animate={{
							x: [0, -50, 0],
							y: [0, -30, 0],
						}}
						transition={{
							repeat: Infinity,
							duration: 25,
							ease: "easeInOut",
						}}
					/>
				</div>
			</section>

			{/* Enhanced History Section */}
			<section className="py-24 bg-white relative overflow-hidden">
				<div className="container relative z-10">
					<div className="text-center mb-16">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">
								Our Journey
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
								Our History
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
								The journey that brought us to where we are today.
							</p>
						</FadeIn>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[1, 2, 3].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
									<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
									<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
								</div>
							))}
						</div>
					) : historySections.length > 0 ? (
						<div className="space-y-24">
							{historySections.map((section, index) => (
								<FadeIn
									key={section.id}
									direction={index % 2 === 0 ? "right" : "left"}
									delay={index * 0.1}
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
										<div className={index % 2 === 0 ? "" : "md:order-last"}>
											<div className="flex items-center mb-8">
												<div className="bg-gradient-to-br from-primary to-primary/80 text-white h-16 w-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
													<History className="h-8 w-8" />
												</div>
												<h3 className="text-3xl font-bold text-gradient">
													{section.title}
												</h3>
											</div>

											{section.subtitle && (
												<p className="text-primary font-medium text-lg mb-6">
													{section.subtitle}
												</p>
											)}

											<div
												className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
												dangerouslySetInnerHTML={{ __html: section.content }}
											/>
										</div>

										<motion.div
											className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
											whileHover={{ scale: 1.03 }}
											transition={{ duration: 0.4 }}
										>
											<Image
												src={
													section.image ||
													`/placeholder.svg?height=400&width=600&text=History+${index + 1}`
												}
												alt={section.title}
												fill
												className="object-cover"
											/>
											{/* Overlay gradient */}
											<div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
										</motion.div>
									</div>
								</FadeIn>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">
								History information not available.
							</p>
						</div>
					)}
				</div>

				{/* Background decorative elements */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
				</div>
			</section>

			{/* Enhanced Team Section - Split into BOD and Staff */}
			<section className="py-24 bg-gradient-to-b from-muted/20 to-white relative overflow-hidden">
				<div className="container relative z-10">
					{/* Board of Directors Section */}
					<div className="mb-32">
						<div className="text-center mb-16">
							<FadeIn>
								<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">
									Board of Directors
								</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
									Our Leadership
								</h2>
								<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
									Meet our distinguished board members who guide our vision and
									strategic direction.
								</p>
							</FadeIn>
						</div>

						{isLoading ? (
							<div className="animate-pulse space-y-8">
								<div className="h-32 bg-gray-200 rounded-lg mb-4" />
								<div className="h-32 bg-gray-200 rounded-lg mb-4 ml-12" />
								<div className="h-32 bg-gray-200 rounded-lg mb-4" />
							</div>
						) : aboutData?.team ? (
							<FadeIn>
								<div className="bg-white rounded-2xl shadow-lg p-8">
									<TeamHierarchy
										teamMembers={aboutData.team.filter(
											(member) => member.teamType === "BOARD",
										)}
									/>
								</div>
							</FadeIn>
						) : (
							<div className="text-center py-12">
								<p className="text-gray-500">
									Board information not available.
								</p>
							</div>
						)}
					</div>

					{/* Staff Section */}
					<div>
						<div className="text-center mb-16">
							<FadeIn>
								<Badge className="mb-4 bg-secondary/10 text-secondary hover:bg-secondary/20 py-1.5 px-4">
									Our Team
								</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
									Office Staff
								</h2>
								<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
									Meet the dedicated professionals working tirelessly to achieve
									our mission.
								</p>
							</FadeIn>
						</div>

						{isLoading ? (
							<div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-8">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-64 bg-gray-200 rounded-lg" />
								))}
							</div>
						) : aboutData?.team ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{aboutData.team
									.filter((member) => member.teamType === "STAFF")
									.map((member) => (
										<FadeIn key={member.id}>
											<div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
												<div className="relative h-48 w-full">
													<Image
														src={
															member.image ||
															`/placeholder.svg?height=200&width=300&text=${member.name}`
														}
														alt={member.name}
														fill
														className="object-cover"
													/>
												</div>
												<div className="p-6">
													<h3 className="text-xl font-bold mb-1">
														{member.name}
													</h3>
													<p className="text-primary font-medium mb-3">
														{member.position}
													</p>
													<p className="text-muted-foreground text-sm line-clamp-3">
														{member.bio}
													</p>
													{member.socialLinks && (
														<div className="flex gap-3 mt-4">
															{member.socialLinks.twitter && (
																<Link
																	href={member.socialLinks.twitter}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
																</Link>
															)}
															{member.socialLinks.linkedin && (
																<Link
																	href={member.socialLinks.linkedin}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
																</Link>
															)}
															{member.socialLinks.instagram && (
																<Link
																	href={member.socialLinks.instagram}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
																</Link>
															)}
														</div>
													)}
												</div>
											</div>
										</FadeIn>
									))}
							</div>
						) : (
							<div className="text-center py-12">
								<p className="text-gray-500">
									Staff information not available.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Background decorative elements */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
				</div>
			</section>

			{/* Enhanced Call to Action */}
			<section className="py-24 bg-white">
				<div className="container">
					<motion.div
						className="rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 p-12 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
					>
						{/* Animated background elements */}
						<div className="absolute inset-0 pointer-events-none">
							<motion.div
								className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
								animate={{
									x: [0, 30, 0],
									y: [0, 20, 0],
									scale: [1, 1.1, 1],
								}}
								transition={{
									repeat: Infinity,
									duration: 15,
									ease: "easeInOut",
								}}
							/>
							<motion.div
								className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
								animate={{
									x: [0, -40, 0],
									y: [0, -30, 0],
									scale: [1, 1.2, 1],
								}}
								transition={{
									repeat: Infinity,
									duration: 18,
									ease: "easeInOut",
								}}
							/>
						</div>

						<div className="relative z-10">
							<FadeIn>
								<h2 className="text-3xl md:text-4xl font-bold mb-6">
									Join Our Mission
								</h2>
							</FadeIn>
							<FadeIn delay={0.2}>
								<p className="max-w-2xl mx-auto mb-10 text-white/90 text-lg">
									There are many ways to get involved and support our work to
									empower women worldwide.
								</p>
							</FadeIn>

							<div className="flex flex-wrap justify-center gap-6">
								<FadeIn delay={0.3}>
									<Link href="/volunteer">
										<Button
											variant="outline"
											size="lg"
											className="border-white text-black hover:bg-white/20 rounded-full group"
										>
											Volunteer With Us
											<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</Button>
									</Link>
								</FadeIn>

								<FadeIn delay={0.4}>
									<Link href="/donate">
										<Button
											size="lg"
											className="bg-white text-primary hover:bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
										>
											Make a Donation
											<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</Button>
									</Link>
								</FadeIn>

								<FadeIn delay={0.5}>
									<Link href="/contact">
										<Button
											variant="outline"
											size="lg"
											className="border-white text-black hover:bg-white/20 rounded-full group"
										>
											Contact Us
											<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</Button>
									</Link>
								</FadeIn>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
