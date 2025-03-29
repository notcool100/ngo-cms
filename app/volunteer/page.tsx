"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { useState } from "react";
import { submitVolunteerForm } from "./actions";

export default function VolunteerPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formSuccess, setFormSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);
			const result = await submitVolunteerForm(formData);

			if (result.success) {
				setFormSuccess(true);
				// Reset the form
				e.currentTarget.reset();
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
				<ParallaxScroll speed={0.3} className="relative h-[40vh] w-full">
					<Image
						src="/placeholder.svg?height=600&width=1600"
						alt="Volunteer with Empower Together"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<AnimatedText
							text="Volunteer With Us"
							className="text-4xl font-bold tracking-tighter sm:text-5xl"
						/>
						<FadeIn
							direction="up"
							delay={0.3}
							className="mx-auto mt-4 max-w-[700px] text-lg text-white/90"
						>
							<p>
								Join our community of volunteers and help us empower women
								around the world.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Why Volunteer */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="grid gap-12 md:grid-cols-2 items-center">
						<FadeIn direction="right">
							<div>
								<Badge className="mb-4">Join Our Team</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
									Why Volunteer With Us
								</h2>
								<div className="mt-4 space-y-4 text-muted-foreground">
									<p>
										Volunteering with Empower Together is a rewarding experience
										that allows you to make a direct impact on the lives of
										women and girls around the world.
									</p>
									<p>
										Whether you have a few hours a week or want to commit to a
										longer-term role, we have opportunities that match your
										skills, interests, and availability.
									</p>
									<p>
										Our volunteers are essential to our mission and become part
										of a global community working together to create a more
										equitable world for women and girls.
									</p>
								</div>

								<div className="mt-8 space-y-6">
									<StaggerChildren staggerDelay={0.1}>
										<StaggerItem>
											<div className="flex items-start gap-4">
												<motion.div
													className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
													whileHover={{
														scale: 1.1,
														backgroundColor: "var(--primary)",
													}}
													whileHover={{ color: "white" }}
													transition={{ duration: 0.3 }}
												>
													<Check className="h-5 w-5" />
												</motion.div>
												<div>
													<h3 className="text-lg font-medium">
														Make a Meaningful Impact
													</h3>
													<p className="text-sm text-muted-foreground">
														Contribute directly to programs that empower women
														and transform communities.
													</p>
												</div>
											</div>
										</StaggerItem>
										<StaggerItem>
											<div className="flex items-start gap-4">
												<motion.div
													className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
													whileHover={{
														scale: 1.1,
														backgroundColor: "var(--primary)",
													}}
													whileHover={{ color: "white" }}
													transition={{ duration: 0.3 }}
												>
													<Check className="h-5 w-5" />
												</motion.div>
												<div>
													<h3 className="text-lg font-medium">
														Develop New Skills
													</h3>
													<p className="text-sm text-muted-foreground">
														Gain valuable experience and develop professional
														and personal skills.
													</p>
												</div>
											</div>
										</StaggerItem>
										<StaggerItem>
											<div className="flex items-start gap-4">
												<motion.div
													className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
													whileHover={{
														scale: 1.1,
														backgroundColor: "var(--primary)",
													}}
													whileHover={{ color: "white" }}
													transition={{ duration: 0.3 }}
												>
													<Check className="h-5 w-5" />
												</motion.div>
												<div>
													<h3 className="text-lg font-medium">
														Join a Global Community
													</h3>
													<p className="text-sm text-muted-foreground">
														Connect with like-minded individuals who share your
														passion for women's empowerment.
													</p>
												</div>
											</div>
										</StaggerItem>
									</StaggerChildren>
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
										alt="Volunteers working together"
										fill
										className="object-cover"
									/>
								</motion.div>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Volunteer Opportunities */}
			<section className="bg-muted/40 py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Opportunities</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Ways to Get Involved
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								We offer a variety of volunteer opportunities to match your
								skills, interests, and availability.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="grid grid-cols-1 gap-6 md:grid-cols-3"
						staggerDelay={0.15}
					>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardHeader>
										<motion.div
											className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
											whileHover={{
												scale: 1.1,
												backgroundColor: "var(--primary)",
											}}
											whileHover={{ color: "white" }}
											transition={{ duration: 0.3 }}
										>
											<Clock className="h-6 w-6" />
										</motion.div>
										<CardTitle className="mt-4">
											Short-term Volunteering
										</CardTitle>
										<CardDescription>
											Flexible opportunities for busy schedules
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2 text-sm text-muted-foreground">
											<li>
												Event support for fundraisers and awareness campaigns
											</li>
											<li>
												Administrative assistance with data entry and research
											</li>
											<li>Social media and content creation</li>
											<li>Translation services for program materials</li>
										</ul>
									</CardContent>
									<CardFooter>
										<Link href="#volunteer-form">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button variant="outline">Apply Now</Button>
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
										<motion.div
											className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
											whileHover={{
												scale: 1.1,
												backgroundColor: "var(--primary)",
											}}
											whileHover={{ color: "white" }}
											transition={{ duration: 0.3 }}
										>
											<Users className="h-6 w-6" />
										</motion.div>
										<CardTitle className="mt-4">
											Skills-based Volunteering
										</CardTitle>
										<CardDescription>
											Contribute your professional expertise
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2 text-sm text-muted-foreground">
											<li>Mentoring for women entrepreneurs and leaders</li>
											<li>Workshop facilitation for our training programs</li>
											<li>Graphic design and marketing support</li>
											<li>IT and technical assistance for our programs</li>
										</ul>
									</CardContent>
									<CardFooter>
										<Link href="#volunteer-form">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button variant="outline">Apply Now</Button>
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
										<motion.div
											className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
											whileHover={{
												scale: 1.1,
												backgroundColor: "var(--primary)",
											}}
											whileHover={{ color: "white" }}
											transition={{ duration: 0.3 }}
										>
											<Globe className="h-6 w-6" />
										</motion.div>
										<CardTitle className="mt-4">
											International Volunteering
										</CardTitle>
										<CardDescription>
											Make an impact around the world
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2 text-sm text-muted-foreground">
											<li>Program support in our international locations</li>
											<li>Training and capacity building for local partners</li>
											<li>Monitoring and evaluation of program impact</li>
											<li>Community outreach and engagement</li>
										</ul>
									</CardContent>
									<CardFooter>
										<Link href="#volunteer-form">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button variant="outline">Apply Now</Button>
											</motion.div>
										</Link>
									</CardFooter>
								</Card>
							</HoverCard>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Volunteer Stories */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Volunteer Stories</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Meet Our Volunteers
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Hear from some of our dedicated volunteers about their
								experiences with Empower Together.
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
													alt="Volunteer story"
													fill
													className="object-cover"
												/>
											</motion.div>
										</div>
										<h3 className="mt-4 text-xl font-bold">Sarah's Story</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											"Volunteering as a mentor for women entrepreneurs has been
											one of the most rewarding experiences of my life. Seeing
											the women I work with gain confidence and grow their
											businesses is incredibly fulfilling."
										</p>
										<p className="mt-4 text-sm font-medium">
											Sarah, Business Mentor Volunteer
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
													alt="Volunteer story"
													fill
													className="object-cover"
												/>
											</motion.div>
										</div>
										<h3 className="mt-4 text-xl font-bold">Miguel's Story</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											"As a graphic designer, I've been able to use my skills to
											create materials for Empower Together's programs. It's
											amazing to see my work being used to help women around the
											world."
										</p>
										<p className="mt-4 text-sm font-medium">
											Miguel, Graphic Design Volunteer
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
													alt="Volunteer story"
													fill
													className="object-cover"
												/>
											</motion.div>
										</div>
										<h3 className="mt-4 text-xl font-bold">Aisha's Story</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											"I spent six months volunteering with Empower Together in
											Kenya, helping to implement their education program. The
											experience changed my perspective and gave me a deeper
											understanding of the challenges women face globally."
										</p>
										<p className="mt-4 text-sm font-medium">
											Aisha, International Volunteer
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Volunteer Form */}
			<section id="volunteer-form" className="bg-muted/40 py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Get Started</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Volunteer Application
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Fill out the form below to express your interest in volunteering
								with Empower Together.
							</p>
						</FadeIn>
					</div>
					<FadeIn direction="up" delay={0.6} className="mx-auto max-w-[800px]">
						<Card>
							<CardContent className="pt-6">
								{formSuccess ? (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="text-center py-12"
									>
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{
												delay: 0.2,
												type: "spring",
												stiffness: 200,
												damping: 10,
											}}
											className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
										>
											<Check className="h-10 w-10" />
										</motion.div>
										<h3 className="text-2xl font-bold text-primary mb-2">
											Thank You!
										</h3>
										<p className="mb-6 text-muted-foreground">
											Your application has been submitted successfully. We'll
											review your information and get back to you soon.
										</p>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button onClick={() => setFormSuccess(false)}>
												Submit Another Application
											</Button>
										</motion.div>
									</motion.div>
								) : (
									<form className="space-y-6" onSubmit={handleSubmit}>
										<div className="space-y-4">
											<h3 className="text-lg font-medium">
												Personal Information
											</h3>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="first-name">First Name</Label>
													<Input
														id="first-name"
														name="firstName"
														placeholder="Enter your first name"
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="last-name">Last Name</Label>
													<Input
														id="last-name"
														name="lastName"
														placeholder="Enter your last name"
														required
													/>
												</div>
											</div>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="email">Email Address</Label>
													<Input
														id="email"
														name="email"
														type="email"
														placeholder="Enter your email"
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="phone">Phone Number</Label>
													<Input
														id="phone"
														name="phone"
														placeholder="Enter your phone number"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label htmlFor="address">Address</Label>
												<Input
													id="address"
													name="address"
													placeholder="Enter your address"
												/>
											</div>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
												<div className="space-y-2">
													<Label htmlFor="city">City</Label>
													<Input id="city" name="city" placeholder="City" />
												</div>
												<div className="space-y-2">
													<Label htmlFor="state">State/Province</Label>
													<Input
														id="state"
														name="state"
														placeholder="State/Province"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="zip">Zip/Postal Code</Label>
													<Input
														id="zip"
														name="zip"
														placeholder="Zip/Postal Code"
													/>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-lg font-medium">
												Volunteer Interests
											</h3>
											<div className="space-y-2">
												<Label>
													What type of volunteering are you interested in?
												</Label>
												<RadioGroup
													defaultValue="short-term"
													name="volunteerType"
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="short-term"
															id="short-term"
														/>
														<Label htmlFor="short-term">
															Short-term Volunteering
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="skills-based"
															id="skills-based"
														/>
														<Label htmlFor="skills-based">
															Skills-based Volunteering
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="international"
															id="international"
														/>
														<Label htmlFor="international">
															International Volunteering
														</Label>
													</div>
												</RadioGroup>
											</div>
											<div className="space-y-2">
												<Label htmlFor="skills">
													What skills can you contribute?
												</Label>
												<Textarea
													id="skills"
													name="skills"
													placeholder="Describe your skills and experience"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="availability">Availability</Label>
												<Select name="availability">
													<SelectTrigger>
														<SelectValue placeholder="Select your availability" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="few-hours">
															A few hours per week
														</SelectItem>
														<SelectItem value="part-time">
															Part-time (10-20 hours per week)
														</SelectItem>
														<SelectItem value="full-time">
															Full-time (20+ hours per week)
														</SelectItem>
														<SelectItem value="one-time">
															One-time event
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="motivation">
													Why do you want to volunteer with Empower Together?
												</Label>
												<Textarea
													id="motivation"
													name="motivation"
													placeholder="Share your motivation for volunteering with us"
												/>
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-lg font-medium">
												Additional Information
											</h3>
											<div className="space-y-2">
												<Label htmlFor="hear-about">
													How did you hear about us?
												</Label>
												<Select name="hearAbout">
													<SelectTrigger>
														<SelectValue placeholder="Select an option" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="social-media">
															Social Media
														</SelectItem>
														<SelectItem value="friend">
															Friend or Family
														</SelectItem>
														<SelectItem value="event">Event</SelectItem>
														<SelectItem value="search">
															Online Search
														</SelectItem>
														<SelectItem value="other">Other</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="additional">
													Any additional information you'd like to share?
												</Label>
												<Textarea
													id="additional"
													name="additional"
													placeholder="Share any additional information"
												/>
											</div>
										</div>

										<motion.div
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<Button
												type="submit"
												className="w-full"
												disabled={isSubmitting}
											>
												{isSubmitting ? "Submitting..." : "Submit Application"}
											</Button>
										</motion.div>
									</form>
								)}
							</CardContent>
						</Card>
					</FadeIn>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Questions</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Frequently Asked Questions
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Find answers to common questions about volunteering with Empower
								Together.
							</p>
						</FadeIn>
					</div>
					<StaggerChildren
						className="mx-auto max-w-[800px] space-y-4"
						staggerDelay={0.1}
					>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardHeader>
										<CardTitle>
											What is the time commitment for volunteering?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											The time commitment varies depending on the type of
											volunteering you choose. Short-term opportunities can be
											as little as a few hours for a one-time event, while
											skills-based and international volunteering typically
											require a more substantial commitment. We work with you to
											find opportunities that match your availability.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardHeader>
										<CardTitle>
											Do I need specific qualifications to volunteer?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											Some volunteer roles require specific skills or
											experience, while others do not. We have opportunities for
											volunteers at all skill levels. The most important
											qualifications are a passion for women's empowerment and a
											commitment to our mission.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardHeader>
										<CardTitle>Can I volunteer remotely?</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											Yes, we offer many remote volunteer opportunities,
											including social media support, graphic design, research,
											and virtual mentoring. Remote volunteering allows you to
											contribute to our mission from anywhere in the world.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
						<StaggerItem>
							<HoverCard>
								<Card>
									<CardHeader>
										<CardTitle>
											What support do you provide to volunteers?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											We provide orientation and training for all volunteers, as
											well as ongoing support from our volunteer coordinator.
											For international volunteers, we provide pre-departure
											training, in-country support, and debriefing upon return.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Contact */}
			<section className="bg-primary text-primary-foreground py-16">
				<div className="container">
					<div className="mx-auto max-w-[800px] text-center">
						<FadeIn direction="up">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Have Questions?
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.2}
							className="mt-4 text-primary-foreground/90"
						>
							<p>
								Our volunteer coordinator is here to help. Contact us with any
								questions about volunteering with Empower Together.
							</p>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mt-8 flex flex-wrap justify-center gap-4"
						>
							<Link href="/contact">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button className="bg-white text-primary hover:bg-white/90">
										Contact Us
									</Button>
								</motion.div>
							</Link>
							<Link href="mailto:volunteer@empowertogether.org">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										className="border-white text-white hover:bg-white/10"
									>
										Email Us
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
