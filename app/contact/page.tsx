"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	CheckCircle2,
	ExternalLink,
	FileText,
	Mail,
	MapPin,
	Scale,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { FadeIn } from "@/components/animations/fade-in";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { submitContactForm } from "./actions";
import { INWOLAG_CONTENT } from "@/lib/inwolag-content";

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formSuccess, setFormSuccess] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setFormError(null);

		try {
			const formData = new FormData(event.currentTarget);
			const result = await submitContactForm(formData);

			if (result.success) {
				toast({
					title: "Message sent",
					description: result.message,
				});
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
						alt="Contact INWOLAG"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
							Get In Touch
						</Badge>
						<div className="flex justify-center">
							<AnimatedText
								text="Contact INWOLAG"
								className="text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
							/>
						</div>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[760px] text-lg text-white/90 md:text-xl"
						>
							<p className="leading-relaxed">
								Reach out about legal aid, advocacy, partnerships, community engagement, research collaboration, publications, or field coordination.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			<section className="bg-white py-16">
				<div className="container grid gap-8 md:grid-cols-3">
					{[
						{
							icon: <Mail className="h-6 w-6" />,
							title: "Email",
							description: "For enquiries, partnerships, legal aid, and general coordination.",
							value: INWOLAG_CONTENT.contactEmail,
							href: `mailto:${INWOLAG_CONTENT.contactEmail}`,
						},
						{
							icon: <MapPin className="h-6 w-6" />,
							title: "Reach",
							description: "Working across Nepal in communities facing major rights challenges.",
							value: "40 districts across all seven provinces",
						},
						{
							icon: <Scale className="h-6 w-6" />,
							title: "Focus",
							description: "Core areas of work grounded in justice and collective rights.",
							value: "Legal aid, collective rights, conservation, climate justice, and research",
						},
					].map((item, index) => (
						<motion.div
							key={item.title}
							className="rounded-3xl border border-muted/20 bg-white p-8 text-center shadow-sm"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-40px" }}
							transition={{ delay: index * 0.1, duration: 0.4 }}
						>
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
								{item.icon}
							</div>
							<h3 className="text-xl font-bold">{item.title}</h3>
							<p className="mt-2 text-muted-foreground">{item.description}</p>
							{item.href ? (
								<a href={item.href} className="mt-4 inline-block font-medium text-primary hover:underline">
									{item.value}
								</a>
							) : (
								<p className="mt-4 font-medium text-foreground">{item.value}</p>
							)}
						</motion.div>
					))}
				</div>
			</section>

			<section className="bg-muted/10 py-16">
				<div className="container grid gap-12 lg:grid-cols-2">
					<FadeIn direction="right">
						<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Send a Message
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Work with us
							</h2>
							<p className="mt-4 text-muted-foreground">
								Send us a message and tell us whether your enquiry relates to legal aid, advocacy, research, publications, training, or partnership opportunities.
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
									<h3 className="text-xl font-bold text-green-800">Message received</h3>
									<p className="mt-2 text-green-700">
										Thank you for reaching out. We will review your message and respond as soon as possible.
									</p>
									<Button
										onClick={() => setFormSuccess(false)}
										className="mt-6 bg-green-600 hover:bg-green-700"
									>
										Send Another Message
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
										<Label htmlFor="subject">Subject</Label>
										<Input id="subject" name="subject" required />
									</div>

									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											name="message"
											placeholder="Tell us how you would like to connect with INWOLAG."
											className="min-h-[150px]"
											required
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
											I consent to INWOLAG storing and processing my personal information to respond to my inquiry. I understand that I can withdraw my consent at any time.
										</Label>
									</div>

									<Button type="submit" className="w-full" disabled={isSubmitting}>
										{isSubmitting ? "Sending..." : "Send Message"}
									</Button>
								</form>
							)}
						</div>
					</FadeIn>

					<FadeIn direction="left">
						<div className="space-y-8">
							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<div className="mb-4 flex items-center gap-3">
									<FileText className="h-5 w-5 text-primary" />
									<h3 className="text-xl font-bold">Areas you can contact us about</h3>
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

							<div className="rounded-3xl border border-muted/20 bg-white p-8 shadow-sm">
								<h3 className="text-xl font-bold">INWOLAG in Media</h3>
								<p className="mt-2 text-muted-foreground">
									Explore videos and media references connected to INWOLAG's work.
								</p>
								<div className="mt-6 space-y-3">
									{INWOLAG_CONTENT.mediaLinks.map((link, index) => (
										<a
											key={link}
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between rounded-2xl border border-muted/20 px-4 py-3 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
										>
											<span>Media Link {String(index + 1).padStart(2, "0")}</span>
											<ExternalLink className="h-4 w-4 text-primary" />
										</a>
									))}
								</div>
							</div>
						</div>
					</FadeIn>
				</div>
			</section>

			<section className="bg-white py-16">
				<div className="container">
					<div className="mb-10 text-center">
						<FadeIn>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								FAQs
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Common questions
							</h2>
						</FadeIn>
					</div>
					<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
						{INWOLAG_CONTENT.contactFaqs.map((faq, index) => (
							<FadeIn key={faq.question} delay={index * 0.08}>
								<Card className="h-full border-muted/20">
									<CardHeader>
										<CardTitle className="text-xl">{faq.question}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">{faq.answer}</p>
									</CardContent>
								</Card>
							</FadeIn>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
