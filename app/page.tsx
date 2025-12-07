"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	Calendar,
	Heart,
	Users,
	ChevronRight,
	Star,
	MapPin,
	Sparkles,
	BookOpen,
	GraduationCap,
	Globe,
	AlertCircle,
	Newspaper,
} from "lucide-react";

// Import our custom components
import { HeroParallax } from "@/components/animations/hero-parallax";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ScaleIn } from "@/components/animations/scale-in";
import { CountUp } from "@/components/animations/count-up";
import { ProgramCard } from "@/components/program-card";
import { EventCard } from "@/components/event-card";
import { toast } from "@/components/ui/use-toast";
import { Container } from "@/components/ui/container";
import { NoticesSection, ImportantNoticeOverlay } from "@/components/notices-section";
import { FeaturedPublications } from "@/components/featured-publications";

export default function HomePage() {
	const [featuredPrograms, setFeaturedPrograms] = useState<
		Array<{
			id: string;
			title: string;
			slug: string;
			description: string;
			image?: string;
			name: string;
			content: string;
		}>
	>([]);

	const [upcomingEvents, setUpcomingEvents] = useState<
		Array<{
			id: string;
			title: string;
			slug: string;
			description: string;
			startDate: string;
			endDate?: string;
			location?: string;
		}>
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [email, setEmail] = useState("");

	// Add scroll progress indicator
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const totalScroll =
				document.documentElement.scrollHeight - window.innerHeight;
			const currentProgress = (window.scrollY / totalScroll) * 100;
			setScrollProgress(currentProgress);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		// Fetch featured programs
		fetch("/api/programs?featured=true&limit=3&active=true")
			.then((res) => res.json())
			.then((data) => {
				setFeaturedPrograms(data);
			})
			.catch((err) => {
				console.error("Error fetching featured programs:", err);
				setFeaturedPrograms([]);
			});

		// Fetch upcoming events
		fetch("/api/events?upcoming=true&limit=2")
			.then((res) => res.json())
			.then((data) => {
				setUpcomingEvents(Array.isArray(data.events) ? data.events : []);
			})
			.catch((err) => {
				console.error("Error fetching upcoming events:", err);
				setUpcomingEvents([]);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	// Enhanced animations
	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
	};

	const staggerContainer = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: { staggerChildren: 0.2 },
	};

	const scaleIn = {
		initial: { scale: 0.9, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		transition: { duration: 0.5 },
	};

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				toast({
					title: "Success!",
					description: "Thank you for subscribing to our newsletter.",
				});
				setEmail("");
			} else {
				throw new Error("Failed to subscribe");
			}
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
			toast({
				title: "Error",
				description: "Failed to subscribe. Please try again later.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex flex-col">
			{/* Scroll Progress Indicator */}
			<motion.div
				className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-primary/80 z-50"
				style={{ scaleX: scrollProgress / 100, transformOrigin: "0%" }}
			/>
			<ImportantNoticeOverlay />
			{/* Hero Section with Enhanced Parallax */}
			<HeroParallax
				imageUrl="/heroimage.jpg?height=1200&width=1920"
				alt="Women empowerment"
				overlayColor="from-primary/90 via-primary/80 to-primary/70"
			>
				<div className="text-center text-white relative z-10 px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					>
						<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm py-2 px-4 border border-white/20">
							<motion.span
								animate={{ opacity: [1, 0.7, 1] }}
								transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
								className="flex items-center gap-2"
							>
								<Sparkles className="h-4 w-4" />
								<span>Empowering Communities Since 2010</span>
								<Sparkles className="h-4 w-4" />
							</motion.span>
						</Badge>
					</motion.div>

					<div className="relative">
						<motion.div
							className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-white/10 blur-3xl"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.5, 0.3]
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse"
							}}
						/>
						<motion.div
							className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-white/10 blur-3xl"
							animate={{
								scale: [1.2, 1, 1.2],
								opacity: [0.5, 0.3, 0.5]
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse"
							}}
						/>

						<div className="flex flex-col items-center text-center space-y-2">
							<AnimatedText
								text="For Nepalese Indigenous Women"
								className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 drop-shadow-lg"
							/>
							<AnimatedText
								text="By Nepalese Indigenous Women"
								className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 drop-shadow-lg"
							/>
						</div>


					</div>

					<FadeIn
						direction="up"
						delay={0.5}
						className="mx-auto mt-8 max-w-[700px] text-lg text-white/90 md:text-xl"
					>
						<p className="leading-relaxed backdrop-blur-sm bg-black/5 p-4 rounded-lg inline-block">
							Join our mission to create a world where every woman has the
							opportunity to thrive, lead, and inspire positive change.
						</p>
					</FadeIn>

					<FadeIn
						direction="up"
						delay={0.7}
						className="mt-12 flex flex-wrap justify-center gap-6"
					>
						<Link href="/programs">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									size="lg"
									className="bg-white text-primary hover:bg-white/90 font-medium px-8 rounded-full transition-all duration-300 shadow-lg"
								>
									<span>Our Programs</span>
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</motion.div>
						</Link>

						<Link href="/donate">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									size="lg"
									variant="outline"
									className="border-white text-black hover:bg-white/20 font-medium px-8 rounded-full transition-all duration-300 backdrop-blur-sm"
								>
									<Heart className="mr-2 h-4 w-4" />
									<span>Donate Now</span>
								</Button>
							</motion.div>
						</Link>
					</FadeIn>

					<motion.div
						className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							y: [0, 10, 0],
						}}
						transition={{
							delay: 1.5,
							duration: 1.5,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					>
						<div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
							<ChevronRight size={30} className="rotate-90 text-white" />
						</div>
					</motion.div>
				</div>
			</HeroParallax>

			{/* Mission Statement with Enhanced Design */}
			<section className="py-24 md:py-32 relative overflow-hidden">
				{/* Animated background elements */}
				<motion.div
					className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.5, 0.8, 0.5],
					}}
					transition={{
						duration: 8,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
				/>
				<motion.div
					className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.8, 0.5, 0.8],
					}}
					transition={{
						duration: 8,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
				/>

				<div className="container relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div className="order-2 md:order-1">
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={{
									hidden: { opacity: 0, x: -50 },
									visible: { opacity: 1, x: 0 },
								}}
								transition={{ duration: 0.8 }}
							>
								<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
									<span className="font-medium">Our Mission</span>
								</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
									Creating a world of equal opportunities
								</h2>
								<div className="text-lg text-muted-foreground space-y-6">
									<p className="leading-relaxed">
										INWOLAG is dedicated to advancing women's rights, promoting
										gender equality, and creating opportunities for women to
										achieve their full potential through education, economic
										empowerment, and leadership development.
									</p>
									<p className="leading-relaxed">
										We believe that when women are empowered, entire communities
										thrive. Our programs focus on providing resources,
										education, and support to help women overcome barriers and
										reach their full potential.
									</p>
								</div>

								<motion.div
									className="mt-8 flex flex-wrap gap-4"
									variants={{
										hidden: { opacity: 0 },
										visible: { opacity: 1 },
									}}
									transition={{ delay: 0.4 }}
								>
									{[
										{
											icon: <BookOpen className="h-5 w-5" />,
											text: "Education",
										},
										{
											icon: <Sparkles className="h-5 w-5" />,
											text: "Empowerment",
										},
										{
											icon: <GraduationCap className="h-5 w-5" />,
											text: "Leadership",
										},
										{ icon: <Globe className="h-5 w-5" />, text: "Community" },
									].map((item, i) => (
										<motion.div
											key={item.text}
											className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.1 }}
											whileHover={{ scale: 1.05, backgroundColor: "var(--primary-10)" }}
										>
											<span className="text-primary">{item.icon}</span>
											<span className="text-sm font-medium">{item.text}</span>
										</motion.div>
									))}
								</motion.div>
							</motion.div>
						</div>

						<div className="order-1 md:order-2">
							<motion.div
								className="relative"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={{
									hidden: { opacity: 0, scale: 0.8 },
									visible: { opacity: 1, scale: 1 },
								}}
								transition={{ duration: 0.8 }}
							>
								<motion.div
									className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full"
									animate={{
										scale: [1, 1.2, 1],
										opacity: [0.5, 0.8, 0.5],
									}}
									transition={{
										duration: 6,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: "reverse",
									}}
								/>
								<div className="relative overflow-hidden rounded-2xl shadow-xl">
									<Image
										src="/heroimage.jpg?height=600&width=800"
										alt="Women in a community meeting"
										width={600}
										height={400}
										className="w-full h-auto object-cover transform transition-transform hover:scale-105 duration-700"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
									<motion.div
										className="absolute bottom-0 left-0 p-6"
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
									>
										<span className="text-white text-sm font-medium bg-primary/80 px-3 py-1 rounded-full backdrop-blur-sm">
											Since 2010
										</span>
									</motion.div>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* Impact Stats with Enhanced Animated Counters */}
			<section className="bg-gradient-to-b from-muted/30 to-background py-24 relative overflow-hidden">
				{/* Animated background pattern */}
				<motion.div
					className="absolute inset-0 opacity-5"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.05 }}
					transition={{ duration: 1 }}
				>
					<motion.div
						className="absolute top-0 left-0 w-full h-full"
						style={{
							backgroundImage:
								"radial-gradient(circle, var(--primary) 1px, transparent 1px)",
							backgroundSize: "30px 30px",
						}}
						animate={{
							backgroundPosition: ["0% 0%", "100% 100%"],
						}}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
							ease: "linear",
						}}
					/>
				</motion.div>

				<div className="container relative z-10">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
								<span className="font-medium">Our Impact</span>
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
								Making a Difference
							</h2>
							<p className="mx-auto mt-6 max-w-[700px] text-muted-foreground">
								For over a decade, we've been working to create positive change
								in communities around the world. Here's the impact we've made so
								far.
							</p>
						</motion.div>
					</div>

					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
						{[
							{
								value: 5000,
								label: "Women Empowered",
								suffix: "+",
								icon: Users,
							},
							{
								value: 120,
								label: "Communities Served",
								suffix: "+",
								icon: Globe,
							},
							{
								value: 50,
								label: "Active Programs",
								suffix: "+",
								icon: Sparkles,
							},
							{
								value: 15,
								label: "Years of Impact",
								suffix: "+",
								icon: Calendar,
							},
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								className="bg-white rounded-xl shadow-md p-8 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300 relative group"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-50px" }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
							>
								<motion.div
									className="absolute inset-0 bg-primary/5 rounded-xl"
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								/>

								<motion.div
									className="relative z-10"
									initial={{ scale: 1 }}
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2 }}
								>
									{stat.icon && (
										<motion.div
											className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit"
											initial={{ rotate: 0 }}
											whileHover={{ rotate: 360, backgroundColor: "var(--primary-20)" }}
											transition={{ duration: 0.5 }}
										>
											<stat.icon className="h-6 w-6 text-primary" />
										</motion.div>
									)}

									<CountUp
										end={stat.value}
										suffix={stat.suffix}
										className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
										duration={2.5}
									/>
									<motion.p
										className="mt-2 text-muted-foreground font-medium"
										initial={{ opacity: 0.7 }}
										whileHover={{ opacity: 1 }}
									>
										{stat.label}
									</motion.p>
								</motion.div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Programs with Enhanced Cards */}
			<section className="py-24 relative overflow-hidden">
				{/* Animated background gradient */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-transparent"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.3, 0.5, 0.3] }}
					transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
				/>

				<div className="container relative z-10">
					<motion.div
						className="mb-16 text-center"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
							<span className="font-medium">Our Programs</span>
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Featured Initiatives
						</h2>
						<p className="mx-auto mt-6 max-w-[700px] text-muted-foreground">
							Discover our key programs that are making a difference in the
							lives of women around the world.
						</p>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={{
							visible: {
								transition: {
									staggerChildren: 0.2,
								},
							},
						}}
					>
						{isLoading
							? // Enhanced skeleton loaders
							Array(3)
								.fill(0)
								.map((_, index) => (
									<motion.div
										key={`skeleton-loading-${Math.random().toString(36).substring(7)}`}
										className="bg-white rounded-xl overflow-hidden shadow-md border border-muted/20"
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
									>
										<div className="h-52 bg-muted animate-pulse relative overflow-hidden">
											<motion.div
												className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
												animate={{
													x: ["-100%", "100%"],
												}}
												transition={{
													duration: 1.5,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/>
										</div>
										<div className="p-6 space-y-4">
											<div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
											<div className="h-4 w-full bg-muted rounded animate-pulse" />
											<div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
											<div className="h-10 w-1/3 bg-muted rounded animate-pulse" />
										</div>
									</motion.div>
								))
							: featuredPrograms.length > 0
								? featuredPrograms.map((program, index) => (
									<motion.div
										key={program.id}
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0 },
										}}
										transition={{ duration: 0.5 }}
										whileHover={{ y: -5 }}
										className="group"
									>
										<ProgramCard
											id={program.id}
											title={program.title}
											slug={program.slug}
											description={program.description}
											content={program.content}
											image={program.image}
											isFeatured={true}
										/>
									</motion.div>
								))
								: // Enhanced sample cards
								Array(3)
									.fill(0)
									.map((_, i) => (
										<motion.div
											key={crypto.randomUUID()}
											variants={{
												hidden: { opacity: 0, y: 20 },
												visible: { opacity: 1, y: 0 },
											}}
											transition={{ duration: 0.5 }}
											whileHover={{ y: -5 }}
											className="group"
										>
											<ProgramCard
												id={`sample-${i}`}
												title={`Program ${i + 1}`}
												slug={`sample-${i + 1}`}
												description="Sample program description"
												content="This is a sample program description. In a real implementation, this would contain actual program content."
												image={`/placeholder.svg?height=400&width=600&text=Program+${i + 1}`}
												isFeatured={true}
											/>
										</motion.div>
									))}
					</motion.div>

					<motion.div
						className="mt-12 text-center"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.6 }}
					>
						<Link href="/programs">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="outline"
									size="lg"
									className="rounded-full px-8 gap-2 group border-primary/20 hover:border-primary"
								>
									<span>View All Programs</span>
									<motion.span
										className="inline-block"
										whileHover={{ x: 5 }}
										transition={{ duration: 0.2 }}
									>
										<ArrowRight className="h-4 w-4" />
									</motion.span>
								</Button>
							</motion.div>
						</Link>
					</motion.div>
				</div>
			</section>
			<section className="py-24 relative overflow-hidden">
				<NoticesSection />
			</section>

			<section className="py-24 relative overflow-hidden">
				<FeaturedPublications />
			</section>

			{/* Upcoming Events with Enhanced Design */}
			<section className="bg-gradient-to-b from-muted/40 to-muted/10 py-24 relative overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

				<div className="container relative z-10">
					<div className="mb-16 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
								<span className="font-medium">Events</span>
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
								Upcoming Events
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
						>
							<p className="leading-relaxed">
								Join us at our upcoming events to learn, connect, and make a
								difference in your community.
							</p>
						</FadeIn>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{isLoading ? (
							// Skeleton loaders
							Array(2)
								.fill(0)
								.map((item, index) => (
									<div
										key={`skeleton-${Math.random()}`}
										className="bg-white rounded-xl overflow-hidden shadow-md border border-muted/20"
									>
										<div className="p-6 space-y-4">
											<div className="h-5 w-1/3 bg-muted rounded animate-pulse" />
											<div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
											<div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
											<div className="h-4 w-full bg-muted rounded animate-pulse" />
											<div className="h-10 w-1/3 bg-muted rounded animate-pulse" />
										</div>
									</div>
								))
						) : upcomingEvents.length > 0 ? (
							upcomingEvents.map((event, index) => (
								<EventCard
									key={event.id || index}
									id={event.id}
									title={event.title}
									slug={event.slug}
									description={event.description}
									startDate={event.startDate}
									endDate={event.endDate}
									location={event.location}
								/>
							))
						) : (
							// Fallback content if no events are found
							<>
								<EventCard
									id="sample-1"
									title="Women in Tech Conference"
									slug="women-in-tech"
									description="Join us for a day of inspiring talks, workshops, and networking opportunities focused on advancing women in technology fields."
									startDate={new Date(
										Date.now() + 30 * 24 * 60 * 60 * 1000,
									).toISOString()}
									location="Virtual Event"
								/>
								<EventCard
									id="sample-2"
									title="Fundraising Gala Dinner"
									slug="gala-dinner"
									description="An elegant evening of dining, entertainment, and fundraising to support our educational scholarship program for girls in underserved communities."
									startDate={new Date(
										Date.now() + 60 * 24 * 60 * 60 * 1000,
									).toISOString()}
									location="Grand Hotel, New York"
								/>
							</>
						)}
					</div>

					<FadeIn direction="up" delay={0.6} className="mt-12 text-center">
						<Link href="/events">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="outline"
									size="lg"
									className="rounded-full px-8 gap-2 border-primary/20 hover:border-primary"
								>
									View All Events
									<ArrowRight className="h-4 w-4" />
								</Button>
							</motion.div>
						</Link>
					</FadeIn>
				</div>
			</section>

			{/* Get Involved with Enhanced Design */}
			<section className="py-24 relative overflow-hidden">
				<div className="container relative z-10">
					<div className="mb-16 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
								<span className="font-medium">Get Involved</span>
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
								Join Our Cause
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
						>
							<p className="leading-relaxed">
								There are many ways you can contribute to our mission and make a
								difference in the lives of women around the world.
							</p>
						</FadeIn>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-black">
						{[
							{
								icon: <Heart className="h-10 w-10" />,
								title: "Donate",
								description:
									"Your financial support helps us expand our programs and reach more women in need. Every contribution makes a difference.",
								cta: "Donate Now",
								href: "/donate",
							},
							{
								icon: <Users className="h-10 w-10" />,
								title: "Volunteer",
								description:
									"Share your time and skills to support our programs and make a direct impact in your community and beyond.",
								cta: "Become a Volunteer",
								href: "/volunteer",
							},
							{
								icon: <Calendar className="h-10 w-10" />,
								title: "Partner With Us",
								description:
									"Collaborate with us to create meaningful partnerships that advance our shared goals and amplify our impact.",
								cta: "Become a Partner",
								href: "/partner",
							},
						].map((item, index) => (
							<motion.div
								key={item.title}
								className="bg-white rounded-xl p-8 text-center shadow-md border border-muted/20 h-full flex flex-col items-center card-hover"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-50px" }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								whileHover={{
									y: -5,
									boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
									borderColor: "var(--primary-20)"
								}}
							>
								<motion.div
									className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6"
									whileHover={{
										scale: 1.1,
										backgroundColor: "var(--primary)",
										color: "white",
									}}
									transition={{ duration: 0.3 }}
								>
									{item.icon}
								</motion.div>
								<h3 className="text-xl font-bold mb-4">{item.title}</h3>
								<p className="text-muted-foreground mb-6 flex-grow">
									{item.description}
								</p>
								<Link href={item.href}>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md">
											{item.cta}
										</Button>
									</motion.div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Newsletter Subscription */}
			<section className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
				>
					<motion.div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(circle at 50% 50%, var(--primary) 1px, transparent 1px)",
							backgroundSize: "32px 32px",
						}}
						animate={{
							opacity: [0.05, 0.1, 0.05],
							backgroundPosition: ["0% 0%", "100% 100%"],
						}}
						transition={{
							duration: 15,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					/>
				</motion.div>

				<div className="container relative z-10">
					<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10 border border-muted/20">
						<div className="text-center mb-8">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
							>
								<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
									<span className="font-medium">Stay Updated</span>
								</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
									Subscribe to Our Newsletter
								</h2>
								<p className="text-muted-foreground">
									Get the latest updates on our programs, events, and impact stories delivered to your inbox.
								</p>
							</motion.div>
						</div>

						<form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
							<Input
								type="email"
								placeholder="Enter your email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="flex-grow rounded-full px-4 py-6 border-primary/20 focus:border-primary"
								required
							/>
							<Button
								type="submit"
								className="rounded-full px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
							>
								Subscribe
							</Button>
						</form>
					</div>
				</div>
			</section>

			{/* Featured Publications with Enhanced Design */}
			<section className="py-24 relative overflow-hidden">
				{/* Enhanced animated background */}
				<motion.div
					className="absolute inset-0"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
				>
					<motion.div
						className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
						animate={{
							opacity: [0.5, 0.8, 0.5],
							scale: [1, 1.1, 1],
						}}
						transition={{
							duration: 8,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					/>
					<motion.div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(circle at 50% 50%, var(--primary) 1px, transparent 1px)",
							backgroundSize: "32px 32px",
						}}
						animate={{
							opacity: [0.1, 0.15, 0.1],
							backgroundPosition: ["0% 0%", "100% 100%"],
						}}
						transition={{
							duration: 15,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					/>
				</motion.div>

				<div className="container relative z-10">
					{/* Enhanced header section */}
					<motion.div
						className="max-w-2xl mx-auto mb-16 text-center"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<motion.div
							initial={{ scale: 0.95 }}
							whileInView={{ scale: 1 }}
							transition={{ duration: 0.6 }}
						>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3">
								<span className="font-medium">Latest Updates</span>
							</Badge>
						</motion.div>
						<h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
							Featured Publications
						</h2>
						<p className="text-lg text-muted-foreground">
							Stay informed with our latest press releases and important notices
						</p>
					</motion.div>

					{/* Enhanced grid layout */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: {
									staggerChildren: 0.15,
								},
							},
						}}
					>
						{/* Notices Section */}
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0 },
							}}
							whileHover={{ y: -5 }}
							transition={{ duration: 0.4 }}
							className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-muted/20 p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-8">
								<motion.h3
									className="text-2xl font-semibold flex items-center gap-3"
									whileHover={{ x: 2 }}
									transition={{ duration: 0.2 }}
								>
									<motion.span
										className="p-2.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
										whileHover={{ rotate: 360 }}
										transition={{ duration: 0.5 }}
									>
										<AlertCircle className="h-6 w-6 text-primary" />
									</motion.span>
									<span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
										Important Notices
									</span>
								</motion.h3>
								<Link
									href="/notices"
									className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
								>
									View All
									<motion.span
										className="inline-block"
										initial={{ x: 0 }}
										whileHover={{ x: 5 }}
										transition={{ duration: 0.2 }}
									>
										<ChevronRight className="h-4 w-4" />
									</motion.span>
								</Link>
							</div>

							<motion.div
								variants={{
									hidden: { opacity: 0 },
									visible: { opacity: 1 },
								}}
								className="relative"
							>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none z-10" />
								<NoticesSection />
							</motion.div>
						</motion.div>

						{/* Press Releases Section */}
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0 },
							}}
							whileHover={{ y: -5 }}
							transition={{ duration: 0.4 }}
							className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-muted/20 p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-8">
								<motion.h3
									className="text-2xl font-semibold flex items-center gap-3"
									whileHover={{ x: 2 }}
									transition={{ duration: 0.2 }}
								>
									<motion.span
										className="p-2.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
										whileHover={{ rotate: 360 }}
										transition={{ duration: 0.5 }}
									>
										<Newspaper className="h-6 w-6 text-primary" />
									</motion.span>
									<span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
										Press Releases
									</span>
								</motion.h3>
								<Link
									href="/press-releases"
									className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
								>
									View All
									<motion.span
										className="inline-block"
										initial={{ x: 0 }}
										whileHover={{ x: 5 }}
										transition={{ duration: 0.2 }}
									>
										<ChevronRight className="h-4 w-4" />
									</motion.span>
								</Link>
							</div>

							<motion.div
								variants={{
									hidden: { opacity: 0 },
									visible: { opacity: 1 },
								}}
								className="relative"
							>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none z-10" />
								<FeaturedPublications />
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}