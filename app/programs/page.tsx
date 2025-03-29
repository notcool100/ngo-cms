"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";

export default function ProgramsPage() {
	const [programs, setPrograms] = useState<
		Array<{
			id: string;
			title: string;
			slug: string;
			description: string;
			image?: string;
			name: string;
			content: string;
			category: {
				id: string;
				name: string;
				slug: string;
			};
		}>
	>([]);
	const [categories, setCategories] = useState<
		Array<{
			description: string;
			id: string;
			name: string;
			slug: string;
		}>
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch programs
		fetch("/api/programs?active=true")
			.then((res) => res.json())
			.then((data) => {
				console.log(data, " this is data");
				// Ensure data is an array
				setPrograms(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				console.error("Error fetching programs:", err);
				setPrograms([]);
			});

		// Fetch categories
		fetch("/api/program-categories")
			.then((res) => res.json())
			.then((data) => {
				console.log(data, " this is catago");
				setCategories(data);
			})
			.catch((err) => {
				console.error("Error fetching categories:", err);
				setCategories([]);
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
				<ParallaxScroll speed={0.3} className="relative h-[40vh] w-full">
					<Image
						src="/placeholder.svg?height=600&width=1600"
						alt="Our Programs"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<AnimatedText
							text="Our Programs"
							className="text-4xl font-bold tracking-tighter sm:text-5xl"
						/>
						<FadeIn
							direction="up"
							delay={0.3}
							className="mx-auto mt-4 max-w-[700px] text-lg text-white/90"
						>
							<p>
								Discover how we're empowering women through education, economic
								opportunities, and leadership development.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Program Categories */}
			<section className="py-16 md:py-24">
				<div className="container">
					<Tabs defaultValue="all" className="w-full">
						<FadeIn className="mb-8 flex justify-center">
							<TabsList>
								<TabsTrigger value="all">All Programs</TabsTrigger>
								{categories.map((category) => (
									<TabsTrigger key={category.id} value={category.slug}>
										{category.name}
									</TabsTrigger>
								))}
							</TabsList>
						</FadeIn>
						<TabsContent value="all" className="space-y-8">
							<StaggerChildren
								className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
								staggerDelay={0.1}
							>
								{isLoading ? (
									// Skeleton loaders
									Array(6)
										.fill(0)
										.map((_, index) => (
											<StaggerItem key={index}>
												<Card>
													<CardHeader>
														<div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
														<div className="h-6 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
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
											</StaggerItem>
										))
								) : programs.length > 0 ? (
									programs.map((program) => (
										<StaggerItem key={program.id}>
											<HoverCard>
												<Card>
													<CardHeader>
														<Badge>{program.category.name}</Badge>
														<CardTitle className="mt-2">
															{program.title}
														</CardTitle>
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
								) : (
									<div className="col-span-full text-center py-12">
										<p className="text-muted-foreground">No programs found.</p>
									</div>
								)}
							</StaggerChildren>
						</TabsContent>

						{/* Category-specific tabs */}
						{categories.map((category) => (
							<TabsContent
								key={category.id}
								value={category.slug}
								className="space-y-8"
							>
								<StaggerChildren
									className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
									staggerDelay={0.1}
								>
									{isLoading
										? // Skeleton loaders
											Array(3)
												.fill(0)
												.map((_, index) => (
													<StaggerItem key={index}>
														<Card>
															<CardHeader>
																<div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
																<div className="h-6 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
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
													</StaggerItem>
												))
										: Array.isArray(programs) &&
											programs
												.filter(
													(program) => program.category?.slug === category.slug,
												)
												.map((program) => (
													<StaggerItem key={program.id}>
														<HoverCard>
															<Card>
																<CardHeader>
																	<Badge>{program.category.name}</Badge>
																	<CardTitle className="mt-2">
																		{program.title}
																	</CardTitle>
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
												))}
								</StaggerChildren>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</section>

			{/* Program Impact */}
			<section className="bg-muted/40 py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Our Impact</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Making a Difference
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Our programs have made a significant impact on the lives of
								women and girls around the world.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
						staggerDelay={0.15}
					>
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
								<p className="mt-2 text-muted-foreground">
									Girls received educational scholarships
								</p>
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
									3,200+
								</motion.p>
								<p className="mt-2 text-muted-foreground">
									Women started their own businesses
								</p>
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
									1,500+
								</motion.p>
								<p className="mt-2 text-muted-foreground">
									Women trained in leadership skills
								</p>
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
								<p className="mt-2 text-muted-foreground">
									Communities reached worldwide
								</p>
							</div>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Success Stories */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Success Stories</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Stories of Transformation
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Meet some of the women whose lives have been transformed through
								our programs.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-8 md:grid-cols-3"
						staggerDelay={0.15}
					>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<div className="relative h-60 w-full overflow-hidden rounded-md">
											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{ duration: 0.3 }}
												className="h-full w-full"
											>
												<Image
													src="/placeholder.svg?height=400&width=600"
													alt="Success story"
													fill
													className="object-cover"
												/>
											</motion.div>
										</div>
										<h3 className="mt-4 text-xl font-bold">Maria's Story</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											"The scholarship I received changed my life. I was able to
											complete my education and now I'm a teacher in my
											community, inspiring other girls to pursue their dreams."
										</p>
										<p className="mt-4 text-sm font-medium">
											Maria, 28, Education Program Graduate
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<div className="relative h-60 w-full overflow-hidden rounded-md">
											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{ duration: 0.3 }}
												className="h-full w-full"
											>
												<Image
													src="/placeholder.svg?height=400&width=600"
													alt="Success story"
													fill
													className="object-cover"
												/>
											</motion.div>
										</div>
										<h3 className="mt-4 text-xl font-bold">Fatima's Story</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											"With the business training and microloan I received, I
											was able to start my own tailoring business. Now I employ
											five other women and can support my family."
										</p>
										<p className="mt-4 text-sm font-medium">
											Fatima, 35, Economic Empowerment Program Participant
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<div className="relative h-60 w-full overflow-hidden rounded-md">
											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{ duration: 0.3 }}
												className="h-full w-full"
											>
												<Image
													src="/placeholder.svg?height=400&width=600"
													alt="Success story"
													fill
													className="object-cover"
												/>
											</motion.div>
										</div>
										<h3 className="mt-4 text-xl font-bold">Priya's Story</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											"The leadership training gave me the confidence to run for
											local office. I'm now a council member in my village and
											working to improve conditions for women and girls."
										</p>
										<p className="mt-4 text-sm font-medium">
											Priya, 42, Leadership Program Graduate
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
					</StaggerChildren>
					<FadeIn direction="up" delay={0.6} className="mt-12 text-center">
						<Link href="/stories">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button variant="outline" size="lg">
									Read More Stories
								</Button>
							</motion.div>
						</Link>
					</FadeIn>
				</div>
			</section>

			{/* Get Involved */}
			<section className="bg-primary text-primary-foreground py-16">
				<div className="container">
					<div className="mx-auto max-w-[800px] text-center">
						<FadeIn direction="up">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Support Our Programs
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.2}
							className="mt-4 text-primary-foreground/90"
						>
							<p>
								Your support helps us expand our programs and reach more women
								and girls in need.
							</p>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mt-8 flex flex-wrap justify-center gap-4"
						>
							<Link href="/donate">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button className="bg-white text-primary hover:bg-white/90">
										Donate Now
									</Button>
								</motion.div>
							</Link>
							<Link href="/volunteer">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										className="border-white text-white hover:bg-white/10"
									>
										Volunteer
									</Button>
								</motion.div>
							</Link>
							<Link href="/partner">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										className="border-white text-white hover:bg-white/10"
									>
										Partner With Us
									</Button>
								</motion.div>
							</Link>
						</FadeIn>
					</div>
				</div>
			</section>
		</div>
	);
}
