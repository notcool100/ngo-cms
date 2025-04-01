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
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { ScaleIn } from "@/components/animations/scale-in";

export default function Home() {
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

	useEffect(() => {
		// Fetch featured programs
		fetch("/api/programs?featured=true&limit=3&active=true")
			.then((res) => res.json())
			.then((data) => {
				console.log(data, "this is feature data");
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
				console.log(data, " this is data");
				setUpcomingEvents(data.events);
				console.log(upcomingEvents, " this is upcone");
			})
			.catch((err) => {
				console.error("Error fetching upcoming events:", err);
				setUpcomingEvents([]);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

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
				alert("Thank you for subscribing!");
				setEmail("");
			}
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
		}
	};

	return (
		<div className="flex flex-col">
			{/* Hero Section with Animated Background */}
			<section className="relative h-[85vh] overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />

				{/* Animated background elements */}
				<div className="absolute inset-0 z-0">
					<motion.div
						className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"
						animate={{
							x: [0, 30, 0],
							y: [0, 20, 0],
							scale: [1, 1.1, 1],
						}}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							duration: 15,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-white/10 blur-3xl"
						animate={{
							x: [0, -40, 0],
							y: [0, -30, 0],
							scale: [1, 1.2, 1],
						}}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							duration: 18,
							ease: "easeInOut",
						}}
					/>
				</div>

				<ParallaxScroll speed={0.3} className="relative h-full w-full">
					<Image
						src="/placeholder.svg?height=1200&width=1920"
						alt="Women empowerment"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>

				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container px-4 text-center text-white">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						>
							<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
								Empowering Since 2010
							</Badge>
						</motion.div>

						<AnimatedText
							text="Empowering Women, Transforming Communities"
							className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
						/>

						<FadeIn
							direction="up"
							delay={0.5}
							className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
						>
							<p className="leading-relaxed">
								Join our mission to create a world where every woman has the
								opportunity to thrive, lead, and inspire positive change.
							</p>
						</FadeIn>

						<FadeIn
							direction="up"
							delay={0.7}
							className="mt-10 flex flex-wrap justify-center gap-4"
						>
							<Link href="/donate">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size="lg"
										className="bg-white text-primary hover:bg-white/90 font-medium px-8 rounded-full shadow-lg"
									>
										Donate Now
									</Button>
								</motion.div>
							</Link>
							<Link href="/programs">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size="lg"
										variant="outline"
										className="border-white text-white hover:bg-white/10 font-medium px-8 rounded-full"
									>
										Our Programs
									</Button>
								</motion.div>
							</Link>
						</FadeIn>

						<motion.div
							className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, y: [0, 10, 0] }}
							transition={{
								delay: 1.5,
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
						>
							<ChevronRight size={30} className="rotate-90 text-white/70" />
						</motion.div>
					</div>
				</div>
			</section>

			{/* Mission Statement with Decorative Elements */}
			<section className="py-20 md:py-28 relative overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

				<div className="container relative z-10">
					<div className="mx-auto max-w-[800px] text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Our Mission
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
								Creating a world of equal opportunities
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mt-6 text-lg text-muted-foreground"
						>
							<p className="leading-relaxed">
								Empower Together is dedicated to advancing women's rights,
								promoting gender equality, and creating opportunities for women
								to achieve their full potential through education, economic
								empowerment, and leadership development.
							</p>
						</FadeIn>

						<ScaleIn delay={0.6} className="mt-10">
							<div className="p-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
								<div className="bg-background rounded-full p-4 flex items-center justify-center">
									<div className="flex flex-wrap justify-center gap-4 md:gap-8">
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5 text-primary" />
											<span className="text-sm font-medium">Education</span>
										</div>
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5 text-primary" />
											<span className="text-sm font-medium">Empowerment</span>
										</div>
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5 text-primary" />
											<span className="text-sm font-medium">Equality</span>
										</div>
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5 text-primary" />
											<span className="text-sm font-medium">Community</span>
										</div>
									</div>
								</div>
							</div>
						</ScaleIn>
					</div>
				</div>
			</section>

			{/* Impact Stats with Animated Counters */}
			<section className="bg-gradient-to-b from-muted/30 to-background py-20 relative overflow-hidden">
				{/* Decorative patterns */}
				<div className="absolute inset-0 opacity-5">
					<div
						className="absolute top-0 left-0 w-full h-full"
						style={{
							backgroundImage:
								"radial-gradient(circle, var(--primary) 1px, transparent 1px)",
							backgroundSize: "30px 30px",
						}}
					/>
				</div>

				<div className="container relative z-10">
					<div className="text-center mb-12">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Our Impact
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Making a Difference
							</h2>
						</FadeIn>
					</div>

					<StaggerChildren className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl shadow-sm p-6 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.p
									className="text-4xl font-bold text-primary"
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{
										opacity: 1,
										scale: 1,
										transition: {
											type: "spring",
											stiffness: 100,
											damping: 10,
										},
									}}
									viewport={{ once: true }}
								>
									5,000+
								</motion.p>
								<p className="mt-2 text-muted-foreground">Women Empowered</p>
							</motion.div>
						</StaggerItem>
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl shadow-sm p-6 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.p
									className="text-4xl font-bold text-primary"
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{
										opacity: 1,
										scale: 1,
										transition: {
											type: "spring",
											stiffness: 100,
											damping: 10,
										},
									}}
									viewport={{ once: true }}
								>
									120+
								</motion.p>
								<p className="mt-2 text-muted-foreground">Communities Served</p>
							</motion.div>
						</StaggerItem>
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl shadow-sm p-6 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.p
									className="text-4xl font-bold text-primary"
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{
										opacity: 1,
										scale: 1,
										transition: {
											type: "spring",
											stiffness: 100,
											damping: 10,
										},
									}}
									viewport={{ once: true }}
								>
									50+
								</motion.p>
								<p className="mt-2 text-muted-foreground">Active Programs</p>
							</motion.div>
						</StaggerItem>
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl shadow-sm p-6 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.p
									className="text-4xl font-bold text-primary"
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{
										opacity: 1,
										scale: 1,
										transition: {
											type: "spring",
											stiffness: 100,
											damping: 10,
										},
									}}
									viewport={{ once: true }}
								>
									15+
								</motion.p>
								<p className="mt-2 text-muted-foreground">Years of Impact</p>
							</motion.div>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Featured Programs with Enhanced Cards */}
			<section className="py-20 md:py-28 relative overflow-hidden">
				{/* Background decoration */}
				<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-muted/20 to-transparent" />

				<div className="container relative z-10">
					<div className="mb-16 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Our Programs
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Featured Initiatives
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
						>
							<p className="leading-relaxed">
								Discover our key programs that are making a difference in the
								lives of women around the world.
							</p>
						</FadeIn>
					</div>

					<StaggerChildren
						className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
						staggerDelay={0.15}
					>
						{isLoading
							? // Skeleton loaders
								Array(3)
									.fill(0)
									.map((_, index) => (
										<StaggerItem key={index}>
											<div className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20">
												<div className="h-48 bg-muted animate-pulse" />
												<div className="p-6 space-y-4">
													<div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
													<div className="h-4 w-full bg-muted rounded animate-pulse"></div>
													<div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
													<div className="h-10 w-1/3 bg-muted rounded animate-pulse"></div>
												</div>
											</div>
										</StaggerItem>
									))
							: featuredPrograms.length > 0
								? featuredPrograms.map((program, index) => (
										<StaggerItem key={program.id || index}>
											<motion.div
												className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20 h-full flex flex-col"
												whileHover={{
													y: -5,
													boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
												}}
											>
												<div className="relative h-48 overflow-hidden">
													<motion.div
														whileHover={{ scale: 1.05 }}
														transition={{ duration: 0.4 }}
													>
														<Image
															src={
																program.image ||
																"/placeholder.svg?height=400&width=600"
															}
															alt={program.title}
															fill
															className="object-cover"
														/>
													</motion.div>
													<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
													<div className="absolute bottom-0 left-0 p-4">
														<Badge className="bg-white/90 text-primary hover:bg-white">
															Featured
														</Badge>
													</div>
												</div>

												<div className="p-6 flex-grow flex flex-col">
													<h3 className="text-xl font-bold mb-2">
														{program.title}
													</h3>
													<p className="text-muted-foreground mb-4">
														{program.description}
													</p>
													<p className="text-sm text-muted-foreground line-clamp-3 mb-6">
														{program.content}
													</p>

													<div className="mt-auto">
														<Link
															href={`/programs/${program.slug}`}
															className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
														>
															Learn more
															<motion.span
																className="inline-block ml-1"
																initial={{ x: 0 }}
																whileHover={{ x: 5 }}
															>
																<ArrowRight className="h-4 w-4 inline" />
															</motion.span>
														</Link>
													</div>
												</div>
											</motion.div>
										</StaggerItem>
									))
								: // Fallback content if no programs are found
									Array(3)
										.fill(0)
										.map((_, index) => (
											<StaggerItem key={index}>
												<motion.div
													className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20 h-full flex flex-col"
													whileHover={{
														y: -5,
														boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
													}}
												>
													<div className="relative h-48 overflow-hidden">
														<motion.div
															whileHover={{ scale: 1.05 }}
															transition={{ duration: 0.4 }}
														>
															<Image
																src={`/placeholder.svg?height=400&width=600&text=Program+${index + 1}`}
																alt={`Program ${index + 1}`}
																fill
																className="object-cover"
															/>
														</motion.div>
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
														<div className="absolute bottom-0 left-0 p-4">
															<Badge className="bg-white/90 text-primary hover:bg-white">
																Featured
															</Badge>
														</div>
													</div>

													<div className="p-6 flex-grow flex flex-col">
														<h3 className="text-xl font-bold mb-2">{`Program ${index + 1}`}</h3>
														<p className="text-muted-foreground mb-4">
															Sample program description
														</p>
														<p className="text-sm text-muted-foreground line-clamp-3 mb-6">
															This is a sample program description. In a real
															implementation, this would contain actual program
															content.
														</p>

														<div className="mt-auto">
															<Link
																href={`/programs/sample-${index + 1}`}
																className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
															>
																Learn more
																<motion.span
																	className="inline-block ml-1"
																	initial={{ x: 0 }}
																	whileHover={{ x: 5 }}
																>
																	<ArrowRight className="h-4 w-4 inline" />
																</motion.span>
															</Link>
														</div>
													</div>
												</motion.div>
											</StaggerItem>
										))}
					</StaggerChildren>

					<FadeIn direction="up" delay={0.6} className="mt-12 text-center">
						<Link href="/programs">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="outline"
									size="lg"
									className="rounded-full px-8"
								>
									View All Programs
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</motion.div>
						</Link>
					</FadeIn>
				</div>
			</section>

			{/* Upcoming Events with Enhanced Design */}
			<section className="bg-gradient-to-b from-muted/40 to-muted/10 py-20 md:py-28 relative overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

				<div className="container relative z-10">
					<div className="mb-16 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Events
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
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

					<StaggerChildren
						className="grid grid-cols-1 gap-8 md:grid-cols-2"
						staggerDelay={0.2}
					>
						{isLoading ? (
							// Skeleton loaders
							Array(2)
								.fill(0)
								.map((_, index) => (
									<StaggerItem key={index}>
										<div className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20">
											<div className="p-6 space-y-4">
												<div className="h-5 w-1/3 bg-muted rounded animate-pulse"></div>
												<div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
												<div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
												<div className="h-4 w-full bg-muted rounded animate-pulse"></div>
												<div className="h-10 w-1/3 bg-muted rounded animate-pulse"></div>
											</div>
										</div>
									</StaggerItem>
								))
						) : upcomingEvents.length > 0 ? (
							upcomingEvents.map((event, index) => (
								<StaggerItem key={event.id || index}>
									<motion.div
										className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20"
										whileHover={{
											y: -5,
											boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
										}}
									>
										<div className="p-6">
											<div className="flex items-center gap-3 mb-4">
												<div className="bg-primary/10 rounded-full p-2">
													<Calendar className="h-5 w-5 text-primary" />
												</div>
												<p className="text-sm font-medium text-primary">
													{new Date(event.startDate).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														},
													)}
												</p>
											</div>

											<h3 className="text-xl font-bold mb-2">{event.title}</h3>

											{event.location && (
												<div className="flex items-center gap-2 mb-4 text-muted-foreground">
													<MapPin className="h-4 w-4" />
													<span className="text-sm">{event.location}</span>
												</div>
											)}

											<p className="text-sm text-muted-foreground line-clamp-3 mb-6">
												{event.description}
											</p>

											<Link href={`/events/${event.slug}`}>
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Button variant="default" className="rounded-full">
														Register Now
													</Button>
												</motion.div>
											</Link>
										</div>
									</motion.div>
								</StaggerItem>
							))
						) : (
							// Fallback content if no events are found
							<>
								<StaggerItem>
									<motion.div
										className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20"
										whileHover={{
											y: -5,
											boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
										}}
									>
										<div className="p-6">
											<div className="flex items-center gap-3 mb-4">
												<div className="bg-primary/10 rounded-full p-2">
													<Calendar className="h-5 w-5 text-primary" />
												</div>
												<p className="text-sm font-medium">June 15, 2024</p>
											</div>
											<h3 className="text-xl font-bold mb-2">
												Women in Tech Conference
											</h3>
											<div className="flex items-center gap-2 mb-4 text-muted-foreground">
												<MapPin className="h-4 w-4" />
												<span className="text-sm">Virtual Event</span>
											</div>
											<p className="text-sm text-muted-foreground mb-6">
												Join us for a day of inspiring talks, workshops, and
												networking opportunities focused on advancing women in
												technology fields.
											</p>
											<Link href="/events/women-in-tech">
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Button variant="default" className="rounded-full">
														Register Now
													</Button>
												</motion.div>
											</Link>
										</div>
									</motion.div>
								</StaggerItem>
								<StaggerItem>
									<motion.div
										className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20"
										whileHover={{
											y: -5,
											boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
										}}
									>
										<div className="p-6">
											<div className="flex items-center gap-3 mb-4">
												<div className="bg-primary/10 rounded-full p-2">
													<Calendar className="h-5 w-5 text-primary" />
												</div>
												<p className="text-sm font-medium">July 8, 2024</p>
											</div>
											<h3 className="text-xl font-bold mb-2">
												Fundraising Gala Dinner
											</h3>
											<div className="flex items-center gap-2 mb-4 text-muted-foreground">
												<MapPin className="h-4 w-4" />
												<span className="text-sm">Grand Hotel, New York</span>
											</div>
											<p className="text-sm text-muted-foreground mb-6">
												An elegant evening of dining, entertainment, and
												fundraising to support our educational scholarship
												program for girls in underserved communities.
											</p>
											<Link href="/events/gala-dinner">
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Button variant="default" className="rounded-full">
														Get Tickets
													</Button>
												</motion.div>
											</Link>
										</div>
									</motion.div>
								</StaggerItem>
							</>
						)}
					</StaggerChildren>

					<FadeIn direction="up" delay={0.6} className="mt-12 text-center">
						<Link href="/events">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="outline"
									size="lg"
									className="rounded-full px-8"
								>
									View All Events
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</motion.div>
						</Link>
					</FadeIn>
				</div>
			</section>

			{/* Get Involved with Enhanced Design */}
			<section className="py-20 md:py-28 relative overflow-hidden">
				<div className="container relative z-10">
					<div className="mb-16 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Get Involved
							</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
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

					<StaggerChildren
						className="grid grid-cols-1 gap-8 md:grid-cols-3"
						staggerDelay={0.2}
					>
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl p-8 text-center shadow-sm border border-muted/20 h-full flex flex-col items-center"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.div
									className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6"
									whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
									whileHover={{ color: "white" }}
									transition={{ duration: 0.3 }}
								>
									<Heart className="h-10 w-10" />
								</motion.div>
								<h3 className="text-xl font-bold mb-4">Donate</h3>
								<p className="text-muted-foreground mb-6 flex-grow">
									Your financial support helps us expand our programs and reach
									more women in need. Every contribution makes a difference.
								</p>
								<Link href="/donate">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button className="rounded-full px-6">Donate Now</Button>
									</motion.div>
								</Link>
							</motion.div>
						</StaggerItem>
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl p-8 text-center shadow-sm border border-muted/20 h-full flex flex-col items-center"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.div
									className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6"
									whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
									whileHover={{ color: "white" }}
									transition={{ duration: 0.3 }}
								>
									<Users className="h-10 w-10" />
								</motion.div>
								<h3 className="text-xl font-bold mb-4">Volunteer</h3>
								<p className="text-muted-foreground mb-6 flex-grow">
									Share your time and skills to support our programs and make a
									direct impact in your community and beyond.
								</p>
								<Link href="/volunteer">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button className="rounded-full px-6">
											Become a Volunteer
										</Button>
									</motion.div>
								</Link>
							</motion.div>
						</StaggerItem>
						<StaggerItem>
							<motion.div
								className="bg-white rounded-xl p-8 text-center shadow-sm border border-muted/20 h-full flex flex-col items-center"
								whileHover={{
									y: -5,
									boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
								}}
							>
								<motion.div
									className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6"
									whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
									whileHover={{ color: "white" }}
									transition={{ duration: 0.3 }}
								>
									<Calendar className="h-10 w-10" />
								</motion.div>
								<h3 className="text-xl font-bold mb-4">Partner With Us</h3>
								<p className="text-muted-foreground mb-6 flex-grow">
									Collaborate with us to create meaningful partnerships that
									advance our shared goals and amplify our impact.
								</p>
								<Link href="/partner">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button className="rounded-full px-6">
											Become a Partner
										</Button>
									</motion.div>
								</Link>
							</motion.div>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Newsletter with Enhanced Design */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />

				{/* Animated background elements */}
				<div className="absolute inset-0">
					<motion.div
						className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"
						animate={{
							x: [0, 30, 0],
							y: [0, 20, 0],
							scale: [1, 1.1, 1],
						}}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							duration: 15,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"
						animate={{
							x: [0, -40, 0],
							y: [0, -30, 0],
							scale: [1, 1.2, 1],
						}}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							duration: 18,
							ease: "easeInOut",
						}}
					/>
				</div>

				<div className="container relative z-10 py-20">
					<div className="mx-auto max-w-[800px] text-center">
						<FadeIn direction="up">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
								Stay Connected
							</h2>
						</FadeIn>
						<FadeIn direction="up" delay={0.2} className="mt-4 text-white/90">
							<p className="leading-relaxed">
								Subscribe to our newsletter to receive updates on our work,
								upcoming events, and ways to get involved.
							</p>
						</FadeIn>
						<FadeIn direction="up" delay={0.4} className="mt-8">
							<form
								onSubmit={handleSubscribe}
								className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
							>
								<Input
									type="email"
									placeholder="Your email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="max-w-sm bg-white/10 text-white placeholder:text-white/60 border-white/20 rounded-full"
									required
								/>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										type="submit"
										className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto rounded-full px-8"
									>
										Subscribe
									</Button>
								</motion.div>
							</form>
						</FadeIn>

						<FadeIn direction="up" delay={0.6} className="mt-8">
							<div className="flex justify-center space-x-6">
								<motion.a
									href="#"
									className="text-white/80 hover:text-white transition-colors"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<span className="sr-only">Facebook</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</motion.a>
								<motion.a
									href="#"
									className="text-white/80 hover:text-white transition-colors"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<span className="sr-only">Instagram</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</motion.a>
								<motion.a
									href="#"
									className="text-white/80 hover:text-white transition-colors"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<span className="sr-only">Twitter</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</motion.a>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>
		</div>
	);
}
