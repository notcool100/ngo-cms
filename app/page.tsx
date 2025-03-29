"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { useEffect, useState } from "react";

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

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
				<ParallaxScroll speed={0.3} className="relative h-[70vh] w-full">
					<Image
						src="/placeholder.svg?height=800&width=1600"
						alt="Women empowerment"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<AnimatedText
							text="Empowering Women, Transforming Communities"
							className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
						/>
						<FadeIn
							direction="up"
							delay={0.5}
							className="mx-auto mt-4 max-w-[700px] text-lg text-white/90 md:text-xl"
						>
							<p>
								Join our mission to create a world where every woman has the
								opportunity to thrive and lead.
							</p>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.7}
							className="mt-8 flex flex-wrap justify-center gap-4"
						>
							<Link href="/donate">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size="lg"
										className="bg-white text-primary hover:bg-white/90"
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
										className="border-white text-white hover:bg-white/10"
									>
										Our Programs
									</Button>
								</motion.div>
							</Link>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Mission Statement */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mx-auto max-w-[800px] text-center">
						<FadeIn>
							<Badge className="mb-4">Our Mission</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Creating a world of equal opportunities
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mt-4 text-lg text-muted-foreground"
						>
							<p>
								Empower Together is dedicated to advancing women's rights,
								promoting gender equality, and creating opportunities for women
								to achieve their full potential through education, economic
								empowerment, and leadership development.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Impact Stats */}
			<section className="bg-muted/40 py-16">
				<div className="container">
					<StaggerChildren className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
						<StaggerItem>
							<div className="text-center">
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
							</div>
						</StaggerItem>
						<StaggerItem>
							<div className="text-center">
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
							</div>
						</StaggerItem>
						<StaggerItem>
							<div className="text-center">
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
							</div>
						</StaggerItem>
						<StaggerItem>
							<div className="text-center">
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
							</div>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Featured Programs */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Our Programs</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Featured Initiatives
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Discover our key programs that are making a difference in the
								lives of women around the world.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
						staggerDelay={0.15}
					>
						{isLoading
							? // Skeleton loaders
								Array(3)
									.fill(0)
									.map((_, index) => (
										<StaggerItem key={index}>
											<HoverCard>
												<Card>
													<CardHeader>
														<div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
														<div className="h-4 w-full bg-muted rounded mt-2 animate-pulse"></div>
													</CardHeader>
													<CardContent>
														<div className="aspect-video bg-muted rounded animate-pulse"></div>
														<div className="h-4 w-full bg-muted rounded mt-4 animate-pulse"></div>
														<div className="h-4 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
													</CardContent>
													<CardFooter>
														<div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
													</CardFooter>
												</Card>
											</HoverCard>
										</StaggerItem>
									))
							: featuredPrograms.length > 0
								? featuredPrograms.map((program, index) => (
										<StaggerItem key={program.id || index}>
											<HoverCard>
												<Card>
													<CardHeader>
														<CardTitle>{program.title}</CardTitle>
														<CardDescription>
															{program.description}
														</CardDescription>
													</CardHeader>
													<CardContent>
														<div className="aspect-video overflow-hidden rounded-md">
															<motion.div
																whileHover={{ scale: 1.05 }}
																transition={{ duration: 0.3 }}
															>
																<Image
																	src={
																		program.image ||
																		"/placeholder.svg?height=400&width=600"
																	}
																	alt={program.title}
																	width={600}
																	height={400}
																	className="object-cover"
																/>
															</motion.div>
														</div>
														<p className="mt-4 text-sm text-muted-foreground line-clamp-3">
															{program.content}
														</p>
													</CardContent>
													<CardFooter>
														<Link
															href={`/programs/${program.slug}`}
															className="text-sm font-medium text-primary hover:underline group"
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
													</CardFooter>
												</Card>
											</HoverCard>
										</StaggerItem>
									))
								: // Fallback content if no programs are found
									Array(3)
										.fill(0)
										.map((_, index) => (
											<StaggerItem key={index}>
												<HoverCard>
													<Card>
														<CardHeader>
															<CardTitle>{`Program ${index + 1}`}</CardTitle>
															<CardDescription>
																Sample program description
															</CardDescription>
														</CardHeader>
														<CardContent>
															<div className="aspect-video overflow-hidden rounded-md">
																<motion.div
																	whileHover={{ scale: 1.05 }}
																	transition={{ duration: 0.3 }}
																>
																	<Image
																		src={`/placeholder.svg?height=400&width=600&text=Program+${index + 1}`}
																		alt={`Program ${index + 1}`}
																		width={600}
																		height={400}
																		className="object-cover"
																	/>
																</motion.div>
															</div>
															<p className="mt-4 text-sm text-muted-foreground line-clamp-3">
																This is a sample program description. In a real
																implementation, this would contain actual
																program content.
															</p>
														</CardContent>
														<CardFooter>
															<Link
																href={`/programs/sample-${index + 1}`}
																className="text-sm font-medium text-primary hover:underline group"
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
														</CardFooter>
													</Card>
												</HoverCard>
											</StaggerItem>
										))}
					</StaggerChildren>
					<FadeIn direction="up" delay={0.6} className="mt-12 text-center">
						<Link href="/programs">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button variant="outline" size="lg">
									View All Programs
								</Button>
							</motion.div>
						</Link>
					</FadeIn>
				</div>
			</section>

			{/* Upcoming Events */}
			<section className="bg-muted/40 py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Events</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Upcoming Events
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Join us at our upcoming events to learn, connect, and make a
								difference.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-6 md:grid-cols-2"
						staggerDelay={0.2}
					>
						{isLoading ? (
							// Skeleton loaders
							Array(2)
								.fill(0)
								.map((_, index) => (
									<StaggerItem key={index}>
										<HoverCard>
											<Card>
												<CardHeader>
													<div className="h-5 w-1/3 bg-muted rounded animate-pulse"></div>
													<div className="h-6 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
													<div className="h-4 w-1/2 bg-muted rounded mt-2 animate-pulse"></div>
												</CardHeader>
												<CardContent>
													<div className="h-4 w-full bg-muted rounded animate-pulse"></div>
													<div className="h-4 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
												</CardContent>
												<CardFooter>
													<div className="h-9 w-1/3 bg-muted rounded animate-pulse"></div>
												</CardFooter>
											</Card>
										</HoverCard>
									</StaggerItem>
								))
						) : upcomingEvents.length > 0 ? (
							upcomingEvents.map((event, index) => (
								<StaggerItem key={event.id || index}>
									<HoverCard>
										<Card>
											<CardHeader>
												<div className="flex items-center gap-2">
													<Calendar className="h-5 w-5 text-primary" />
													<p className="text-sm font-medium">
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
												<CardTitle className="mt-2">{event.title}</CardTitle>
												<CardDescription>
													{event.location || "Virtual Event"}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-muted-foreground line-clamp-3">
													{event.description}
												</p>
											</CardContent>
											<CardFooter>
												<Link href={`/events/${event.slug}`}>
													<motion.div
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														<Button variant="outline">Register Now</Button>
													</motion.div>
												</Link>
											</CardFooter>
										</Card>
									</HoverCard>
								</StaggerItem>
							))
						) : (
							// Fallback content if no events are found
							<>
								<StaggerItem>
									<HoverCard>
										<Card>
											<CardHeader>
												<div className="flex items-center gap-2">
													<Calendar className="h-5 w-5 text-primary" />
													<p className="text-sm font-medium">June 15, 2024</p>
												</div>
												<CardTitle className="mt-2">
													Women in Tech Conference
												</CardTitle>
												<CardDescription>Virtual Event</CardDescription>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-muted-foreground">
													Join us for a day of inspiring talks, workshops, and
													networking opportunities focused on advancing women in
													technology fields.
												</p>
											</CardContent>
											<CardFooter>
												<Link href="/events/women-in-tech">
													<motion.div
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														<Button variant="outline">Register Now</Button>
													</motion.div>
												</Link>
											</CardFooter>
										</Card>
									</HoverCard>
								</StaggerItem>
								<StaggerItem>
									<HoverCard>
										<Card>
											<CardHeader>
												<div className="flex items-center gap-2">
													<Calendar className="h-5 w-5 text-primary" />
													<p className="text-sm font-medium">July 8, 2024</p>
												</div>
												<CardTitle className="mt-2">
													Fundraising Gala Dinner
												</CardTitle>
												<CardDescription>Grand Hotel, New York</CardDescription>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-muted-foreground">
													An elegant evening of dining, entertainment, and
													fundraising to support our educational scholarship
													program for girls in underserved communities.
												</p>
											</CardContent>
											<CardFooter>
												<Link href="/events/gala-dinner">
													<motion.div
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														<Button variant="outline">Get Tickets</Button>
													</motion.div>
												</Link>
											</CardFooter>
										</Card>
									</HoverCard>
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
								<Button variant="outline" size="lg">
									View All Events
								</Button>
							</motion.div>
						</Link>
					</FadeIn>
				</div>
			</section>

			{/* Get Involved */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Get Involved</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Join Our Cause
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								There are many ways you can contribute to our mission and make a
								difference.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-8 md:grid-cols-3"
						staggerDelay={0.2}
					>
						<StaggerItem>
							<div className="flex flex-col items-center text-center">
								<motion.div
									className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
									whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
									whileHover={{ color: "white" }}
									transition={{ duration: 0.3 }}
								>
									<Heart className="h-8 w-8" />
								</motion.div>
								<h3 className="mt-4 text-xl font-bold">Donate</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Your financial support helps us expand our programs and reach
									more women in need.
								</p>
								<Link href="/donate" className="mt-4">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button>Donate Now</Button>
									</motion.div>
								</Link>
							</div>
						</StaggerItem>
						<StaggerItem>
							<div className="flex flex-col items-center text-center">
								<motion.div
									className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
									whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
									whileHover={{ color: "white" }}
									transition={{ duration: 0.3 }}
								>
									<Users className="h-8 w-8" />
								</motion.div>
								<h3 className="mt-4 text-xl font-bold">Volunteer</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Share your time and skills to support our programs and make a
									direct impact.
								</p>
								<Link href="/volunteer" className="mt-4">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button>Become a Volunteer</Button>
									</motion.div>
								</Link>
							</div>
						</StaggerItem>
						<StaggerItem>
							<div className="flex flex-col items-center text-center">
								<motion.div
									className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
									whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
									whileHover={{ color: "white" }}
									transition={{ duration: 0.3 }}
								>
									<Calendar className="h-8 w-8" />
								</motion.div>
								<h3 className="mt-4 text-xl font-bold">Partner With Us</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Collaborate with us to create meaningful partnerships that
									advance our shared goals.
								</p>
								<Link href="/partner" className="mt-4">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button>Become a Partner</Button>
									</motion.div>
								</Link>
							</div>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Newsletter */}
			<section className="bg-primary text-primary-foreground py-16">
				<div className="container">
					<div className="mx-auto max-w-[800px] text-center">
						<FadeIn direction="up">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Stay Connected
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.2}
							className="mt-4 text-primary-foreground/90"
						>
							<p>
								Subscribe to our newsletter to receive updates on our work,
								upcoming events, and ways to get involved.
							</p>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
						>
							<Input
								type="email"
								placeholder="Your email address"
								className="max-w-sm bg-white/10 text-white placeholder:text-white/60 border-white/20"
							/>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
									Subscribe
								</Button>
							</motion.div>
						</FadeIn>
					</div>
				</div>
			</section>
		</div>
	);
}
