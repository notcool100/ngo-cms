"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { ScaleIn } from "@/components/animations/scale-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";

export default function AboutPage() {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
				<ParallaxScroll speed={0.3} className="relative h-[40vh] w-full">
					<Image
						src="/placeholder.svg?height=600&width=1600"
						alt="About Empower Together"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<AnimatedText
							text="About Us"
							className="text-4xl font-bold tracking-tighter sm:text-5xl"
						/>
						<FadeIn
							direction="up"
							delay={0.3}
							className="mx-auto mt-4 max-w-[700px] text-lg text-white/90"
						>
							<p>
								Learn about our mission, vision, and the team behind Empower
								Together.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Our Story */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="grid gap-12 md:grid-cols-2 items-center">
						<FadeIn direction="right">
							<div>
								<Badge className="mb-4">Our Story</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
									How We Started
								</h2>
								<div className="mt-4 space-y-4 text-muted-foreground">
									<p>
										Empower Together was founded in 2010 by a group of
										passionate advocates for women's rights who recognized the
										need for a comprehensive approach to women's empowerment.
									</p>
									<p>
										What began as a small grassroots initiative has grown into a
										global organization with programs in over 20 countries,
										impacting the lives of thousands of women and girls.
									</p>
									<p>
										Our journey has been guided by the belief that when women
										are empowered, entire communities thrive. Through education,
										economic opportunities, and leadership development, we've
										been working to create a world where every woman can reach
										her full potential.
									</p>
								</div>
							</div>
						</FadeIn>
						<FadeIn direction="left">
							<div className="relative h-[400px] rounded-lg overflow-hidden">
								<motion.div
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.5 }}
									className="h-full w-full"
								>
									<Image
										src="/placeholder.svg?height=800&width=600"
										alt="Our story"
										fill
										className="object-cover"
									/>
								</motion.div>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="bg-muted/40 py-16 md:py-24">
				<div className="container">
					<Tabs defaultValue="mission" className="mx-auto max-w-[800px]">
						<FadeIn className="mb-8 text-center">
							<TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
								<TabsTrigger value="mission">Our Mission</TabsTrigger>
								<TabsTrigger value="vision">Our Vision</TabsTrigger>
							</TabsList>
						</FadeIn>
						<TabsContent value="mission" className="text-center space-y-4">
							<ScaleIn>
								<h3 className="text-2xl font-bold">Our Mission</h3>
								<p className="text-muted-foreground">
									Empower Together is dedicated to advancing women's rights,
									promoting gender equality, and creating opportunities for
									women to achieve their full potential through education,
									economic empowerment, and leadership development.
								</p>
							</ScaleIn>
						</TabsContent>
						<TabsContent value="vision" className="text-center space-y-4">
							<ScaleIn>
								<h3 className="text-2xl font-bold">Our Vision</h3>
								<p className="text-muted-foreground">
									We envision a world where all women and girls have equal
									access to resources and opportunities, are free from
									discrimination and violence, and are able to fully participate
									in all aspects of social, economic, and political life.
								</p>
							</ScaleIn>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Our Values */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Our Values</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								What We Stand For
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Our core values guide everything we do and shape our approach to
								women's empowerment.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
						staggerDelay={0.1}
					>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<h3 className="text-xl font-bold">Equality</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											We believe in the inherent equality of all people and work
											to eliminate disparities based on gender, race, class, or
											any other factor.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<h3 className="text-xl font-bold">Empowerment</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											We are committed to helping women develop the confidence,
											skills, and resources they need to take control of their
											lives and make their own decisions.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<h3 className="text-xl font-bold">Inclusivity</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											We embrace diversity and ensure that our programs are
											accessible and responsive to the needs of women from all
											backgrounds and communities.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<h3 className="text-xl font-bold">Integrity</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											We operate with transparency, accountability, and the
											highest ethical standards in all our work.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardContent className="pt-6">
										<h3 className="text-xl font-bold">Collaboration</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											We believe in the power of partnership and work closely
											with communities, organizations, and governments to
											achieve our goals.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Our Team */}
			<section className="bg-muted/40 py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Our Team</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Meet Our Leadership
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Our dedicated team brings diverse expertise and a shared
								commitment to advancing women's empowerment.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
						staggerDelay={0.15}
					>
						{[
							{
								name: "Sarah Johnson",
								role: "Executive Director",
								bio: "With over 15 years of experience in nonprofit leadership, Sarah brings vision and strategic direction to Empower Together.",
								image: "/placeholder.svg?height=400&width=400",
							},
							{
								name: "Maria Rodriguez",
								role: "Programs Director",
								bio: "Maria oversees the development and implementation of our programs, ensuring they effectively address the needs of the women we serve.",
								image: "/placeholder.svg?height=400&width=400",
							},
							{
								name: "David Chen",
								role: "Finance Director",
								bio: "David manages our financial operations, ensuring transparency and accountability in all our financial activities.",
								image: "/placeholder.svg?height=400&width=400",
							},
							{
								name: "Aisha Patel",
								role: "Partnerships Director",
								bio: "Aisha builds and maintains relationships with our partners, donors, and other stakeholders to support our mission.",
								image: "/placeholder.svg?height=400&width=400",
							},
						].map((member, index) => (
							<StaggerItem key={index}>
								<div className="flex flex-col items-center text-center">
									<motion.div
										className="relative h-40 w-40 overflow-hidden rounded-full"
										whileHover={{ scale: 1.05 }}
										transition={{ duration: 0.3 }}
									>
										<Image
											src={member.image || "/placeholder.svg"}
											alt={member.name}
											fill
											className="object-cover"
										/>
									</motion.div>
									<h3 className="mt-4 text-xl font-bold">{member.name}</h3>
									<p className="text-sm font-medium text-primary">
										{member.role}
									</p>
									<p className="mt-2 text-sm text-muted-foreground">
										{member.bio}
									</p>
								</div>
							</StaggerItem>
						))}
					</StaggerChildren>
				</div>
			</section>

			{/* Annual Reports */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Transparency</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Annual Reports
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								We are committed to transparency and accountability. View our
								annual reports to learn about our impact and financial
								stewardship.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
						staggerDelay={0.1}
					>
						{[2023, 2022, 2021].map((year) => (
							<StaggerItem key={year}>
								<HoverCard>
									<Card>
										<CardContent className="pt-6">
											<h3 className="text-xl font-bold">
												{year} Annual Report
											</h3>
											<p className="mt-2 text-sm text-muted-foreground">
												Learn about our activities, impact, and financial
												performance for the year {year}.
											</p>
											<motion.a
												href={`/reports/${year}`}
												className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
												whileHover={{ x: 5 }}
												transition={{ duration: 0.2 }}
											>
												Download PDF
											</motion.a>
										</CardContent>
									</Card>
								</HoverCard>
							</StaggerItem>
						))}
					</StaggerChildren>
				</div>
			</section>
		</div>
	);
}
