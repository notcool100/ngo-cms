"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	CheckCircle2,
	Clock,
	FileText,
	Handshake,
	Users,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FadeIn } from "@/components/animations/fade-in";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { submitVolunteerForm } from "./actions";
import { INWOLAG_CONTENT } from "@/lib/inwolag-content";

export default function VolunteerPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formSuccess, setFormSuccess] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setFormError(null);

		try {
			const formData = new FormData(event.currentTarget);
			const result = await submitVolunteerForm(formData);

			if (result.success) {
				setFormSuccess(true);
				event.currentTarget.reset();
			} else {
				setFormError(result.message || "Something went wrong. Please try again.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setFormError("An unexpected error occurred. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col">
			<section className="relative">
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/90 to-primary/70" />
				<ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
					<Image
						src="/heroimage.jpg?height=600&width=1600"
						alt="Get involved with INWOLAG"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
							Get Involved
						</Badge>
						<div className="flex justify-center">
							<AnimatedText
								text="Support INWOLAG"
								className="text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
							/>
						</div>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[760px] text-lg text-white/90 md:text-xl"
						>
							<p className="leading-relaxed">
								Share your time, skills, research capacity, legal awareness, translation support, or field coordination to strengthen Indigenous women's rights work across Nepal.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			<section className="bg-muted/10 py-16">
				<div className="container grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{INWOLAG_CONTENT.stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							className="rounded-2xl border border-muted/20 bg-white p-8 text-center shadow-sm"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-40px" }}
							transition={{ delay: index * 0.08, duration: 0.4 }}
						>
							<p className="text-4xl font-bold text-primary">{stat.value}</p>
							<p className="mt-2 text-sm font-medium text-muted-foreground">
								{stat.label}
							</p>
						</motion.div>
					))}
				</div>
			</section>

			<section className="bg-white py-16">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Opportunities
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Ways to contribute
							</h2>
							<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
								These are the areas where volunteer and supporter engagement can directly strengthen INWOLAG's work.
							</p>
						</FadeIn>
					</div>

					<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
						{INWOLAG_CONTENT.volunteerOpportunities.map((opportunity, index) => (
							<FadeIn key={opportunity.title} delay={index * 0.08}>
								<Card className="h-full border-muted/20">
									<CardHeader>
										<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
											<Users className="h-6 w-6" />
										</div>
										<CardTitle>{opportunity.title}</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-muted-foreground">
											{opportunity.description}
										</p>
										<div>
											<p className="text-sm font-medium">Typical commitment</p>
											<p className="mt-1 text-sm text-muted-foreground">
												{opportunity.commitment}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium">Helpful skills</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{opportunity.skills.map((skill) => (
													<Badge key={skill} variant="outline">
														{skill}
													</Badge>
												))}
											</div>
										</div>
									</CardContent>
								</Card>
							</FadeIn>
						))}
					</div>
				</div>
			</section>

			<section id="volunteer-form" className="bg-muted/10 py-16 scroll-mt-16">
				<div className="container grid gap-12 lg:grid-cols-2">
					<FadeIn direction="right">
						<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Join Us
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Volunteer application
							</h2>
							<p className="mt-4 text-muted-foreground">
								Tell us how you would like to contribute and what type of support you can offer.
							</p>

							{formSuccess ? (
								<motion.div
									className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<div className="mb-4 flex justify-center">
										<div className="rounded-full bg-green-100 p-3">
											<CheckCircle2 className="h-8 w-8 text-green-600" />
										</div>
									</div>
									<h3 className="text-xl font-bold text-green-800">
										Application submitted
									</h3>
									<p className="mt-2 text-green-700">
										Thank you for your interest in supporting INWOLAG. We will review your application and follow up soon.
									</p>
									<Button
										onClick={() => setFormSuccess(false)}
										className="mt-6 bg-green-600 hover:bg-green-700"
									>
										Submit Another Application
									</Button>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="mt-8 space-y-6">
									{formError && (
										<div className="flex items-start rounded-2xl border border-red-200 bg-red-50 p-4">
											<X className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
											<p className="text-red-700">{formError}</p>
										</div>
									)}

									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="firstName">First Name</Label>
											<Input id="firstName" name="firstName" required />
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName">Last Name</Label>
											<Input id="lastName" name="lastName" required />
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input id="email" name="email" type="email" required />
									</div>

									<div className="space-y-2">
										<Label htmlFor="phone">Phone Number</Label>
										<Input id="phone" name="phone" type="tel" />
									</div>

									<div className="space-y-2">
										<Label htmlFor="location">Location</Label>
										<Input id="location" name="location" placeholder="District, Province, or City" required />
									</div>

									<div className="space-y-2">
										<Label>Volunteer Interest</Label>
										<RadioGroup defaultValue="legal-awareness" name="volunteerType">
											<div className="grid gap-4 md:grid-cols-2">
												{[
													["legal-awareness", "Legal Awareness"],
													["research", "Research Support"],
													["advocacy", "Advocacy and Outreach"],
													["media", "Media and Storytelling"],
													["field", "Field Coordination"],
													["events", "Partner and Event Support"],
												].map(([value, label]) => (
													<div key={value} className="flex items-center space-x-2">
														<RadioGroupItem value={value} id={value} />
														<Label htmlFor={value} className="cursor-pointer">
															{label}
														</Label>
													</div>
												))}
											</div>
										</RadioGroup>
									</div>

									<div className="space-y-2">
										<Label htmlFor="availability">Availability</Label>
										<Select name="availability" defaultValue="flexible">
											<SelectTrigger>
												<SelectValue placeholder="Select your availability" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="flexible">Flexible</SelectItem>
												<SelectItem value="weekdays">Weekdays</SelectItem>
												<SelectItem value="weekends">Weekends</SelectItem>
												<SelectItem value="project-based">Project-based</SelectItem>
												<SelectItem value="event-based">Event-based</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="skills">Skills and Experience</Label>
										<Textarea
											id="skills"
											name="skills"
											placeholder="Tell us about your relevant skills, experience, and areas of interest."
											className="min-h-[120px]"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="motivation">Why do you want to support INWOLAG?</Label>
										<Textarea
											id="motivation"
											name="motivation"
											placeholder="Share your motivation for contributing to INWOLAG's work."
											className="min-h-[120px]"
										/>
									</div>

									<div className="flex items-start space-x-2">
										<input
											type="checkbox"
											id="consent"
											name="consent"
											className="mt-1"
											required
										/>
										<Label htmlFor="consent" className="text-sm text-muted-foreground">
											I consent to INWOLAG storing and processing my personal information for volunteer coordination purposes. I understand that I can withdraw my consent at any time.
										</Label>
									</div>

									<Button type="submit" className="w-full" disabled={isSubmitting}>
										{isSubmitting ? "Submitting..." : "Submit Application"}
									</Button>
								</form>
							)}
						</div>
					</FadeIn>

					<FadeIn direction="left">
						<div className="space-y-8">
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-4 flex items-center gap-3">
									<Clock className="h-5 w-5 text-primary" />
									<h3 className="text-xl font-bold">How the process works</h3>
								</div>
								<ol className="space-y-4">
									{[
										"Submit your application with the type of contribution you can offer.",
										"Our team reviews your interest and aligns it with current needs.",
										"We follow up for orientation, coordination, or the next discussion.",
										"You begin supporting community, research, or advocacy work with the appropriate team.",
									].map((step, index) => (
										<li key={step} className="flex items-start gap-3">
											<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
												{index + 1}
											</div>
											<p className="text-muted-foreground">{step}</p>
										</li>
									))}
								</ol>
							</div>

							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-4 flex items-center gap-3">
									<Handshake className="h-5 w-5 text-primary" />
									<h3 className="text-xl font-bold">Need another route?</h3>
								</div>
								<p className="text-muted-foreground">
									If you want to partner with INWOLAG, support publications, or discuss organisational collaboration instead of volunteering, contact us directly.
								</p>
								<div className="mt-6">
									<Link href="/contact">
										<Button variant="outline">Contact INWOLAG</Button>
									</Link>
								</div>
							</div>

							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-4 flex items-center gap-3">
									<FileText className="h-5 w-5 text-primary" />
									<h3 className="text-xl font-bold">Current focus areas</h3>
								</div>
								<div className="space-y-3">
									{INWOLAG_CONTENT.thematicAreas.map((area) => (
										<div
											key={area.slug}
											className="rounded-2xl bg-primary/5 px-4 py-3 text-sm font-medium"
										>
											{area.title}
										</div>
									))}
								</div>
							</div>
						</div>
					</FadeIn>
				</div>
			</section>
		</div>
	);
}
