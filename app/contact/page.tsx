"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { submitContactForm } from "./actions";

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formSuccess, setFormSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);
			const result = await submitContactForm(formData);

			if (result.success) {
				toast({
					title: "Success",
					description: result.message,
				});
				setFormSuccess(true);
				// Reset the form
				e.currentTarget.reset();
			} else {
				toast({
					title: "Error",
					description: result.message,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
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
						alt="Contact Empower Together"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<AnimatedText
							text="Contact Us"
							className="text-4xl font-bold tracking-tighter sm:text-5xl"
						/>
						<FadeIn
							direction="up"
							delay={0.3}
							className="mx-auto mt-4 max-w-[700px] text-lg text-white/90"
						>
							<p>
								We'd love to hear from you. Reach out with questions, feedback,
								or to learn more about our work.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Contact Form and Info */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="grid gap-12 lg:grid-cols-2">
						<FadeIn direction="right">
							<div>
								<Badge className="mb-4">Get in Touch</Badge>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
									We're Here to Help
								</h2>
								<div className="mt-4 space-y-4 text-muted-foreground">
									<p>
										Whether you have questions about our programs, want to get
										involved, or need assistance with a donation, our team is
										here to help.
									</p>
									<p>
										Fill out the form, and we'll get back to you as soon as
										possible. You can also reach us directly using the contact
										information provided.
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
													<MapPin className="h-5 w-5" />
												</motion.div>
												<div>
													<h3 className="text-lg font-medium">
														Our Headquarters
													</h3>
													<p className="text-sm text-muted-foreground">
														123 Empowerment Street
														<br />
														New York, NY 10001
														<br />
														United States
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
													<Mail className="h-5 w-5" />
												</motion.div>
												<div>
													<h3 className="text-lg font-medium">Email Us</h3>
													<p className="text-sm text-muted-foreground">
														General Inquiries:{" "}
														<motion.a
															href="mailto:info@empowertogether.org"
															className="text-primary hover:underline"
															whileHover={{ x: 2 }}
															transition={{ duration: 0.2 }}
														>
															info@empowertogether.org
														</motion.a>
														<br />
														Donations:{" "}
														<motion.a
															href="mailto:donations@empowertogether.org"
															className="text-primary hover:underline"
															whileHover={{ x: 2 }}
															transition={{ duration: 0.2 }}
														>
															donations@empowertogether.org
														</motion.a>
														<br />
														Volunteer:{" "}
														<motion.a
															href="mailto:volunteer@empowertogether.org"
															className="text-primary hover:underline"
															whileHover={{ x: 2 }}
															transition={{ duration: 0.2 }}
														>
															volunteer@empowertogether.org
														</motion.a>
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
													<Phone className="h-5 w-5" />
												</motion.div>
												<div>
													<h3 className="text-lg font-medium">Call Us</h3>
													<p className="text-sm text-muted-foreground">
														Phone: +1 (555) 123-4567
														<br />
														Toll-free: 1-800-EMPOWER
														<br />
														Hours: Monday-Friday, 9am-5pm EST
													</p>
												</div>
											</div>
										</StaggerItem>
									</StaggerChildren>
								</div>

								<div className="mt-8">
									<h3 className="text-lg font-medium">Connect With Us</h3>
									<div className="mt-4 flex space-x-4">
										<Link
											href="#"
											className="text-muted-foreground hover:text-primary"
										>
											<motion.svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-6 w-6"
												whileHover={{ scale: 1.2 }}
												transition={{ duration: 0.3 }}
											>
												<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
											</motion.svg>
											<span className="sr-only">Facebook</span>
										</Link>
										<Link
											href="#"
											className="text-muted-foreground hover:text-primary"
										>
											<motion.svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-6 w-6"
												whileHover={{ scale: 1.2 }}
												transition={{ duration: 0.3 }}
											>
												<rect
													x="2"
													y="2"
													width="20"
													height="20"
													rx="5"
													ry="5"
												></rect>
												<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
												<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
											</motion.svg>
											<span className="sr-only">Instagram</span>
										</Link>
										<Link
											href="#"
											className="text-muted-foreground hover:text-primary"
										>
											<motion.svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-6 w-6"
												whileHover={{ scale: 1.2 }}
												transition={{ duration: 0.3 }}
											>
												<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
											</motion.svg>
											<span className="sr-only">Twitter</span>
										</Link>
										<Link
											href="#"
											className="text-muted-foreground hover:text-primary"
										>
											<motion.svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-6 w-6"
												whileHover={{ scale: 1.2 }}
												transition={{ duration: 0.3 }}
											>
												<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
												<rect x="2" y="9" width="4" height="12"></rect>
												<circle cx="4" cy="4" r="2"></circle>
											</motion.svg>
											<span className="sr-only">LinkedIn</span>
										</Link>
									</div>
								</div>
							</div>
						</FadeIn>

						<FadeIn direction="left" delay={0.3}>
							<HoverCard>
								<Card>
									<CardHeader>
										<CardTitle>Send Us a Message</CardTitle>
										<CardDescription>
											Fill out the form below and we'll get back to you as soon
											as possible.
										</CardDescription>
									</CardHeader>
									<CardContent>
										{formSuccess ? (
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5 }}
												className="text-center py-8"
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
													<Mail className="h-10 w-10" />
												</motion.div>
												<h3 className="text-2xl font-bold text-primary mb-2">
													Thank You!
												</h3>
												<p className="mb-4">
													Your message has been sent successfully.
												</p>
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Button onClick={() => setFormSuccess(false)}>
														Send Another Message
													</Button>
												</motion.div>
											</motion.div>
										) : (
											<form className="space-y-4" onSubmit={handleSubmit}>
												<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
													<div className="space-y-2">
														<Label htmlFor="name">Name</Label>
														<Input
															id="name"
															name="name"
															placeholder="Enter your name"
															required
														/>
													</div>
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
												</div>
												<div className="space-y-2">
													<Label htmlFor="phone">Phone Number (Optional)</Label>
													<Input
														id="phone"
														name="phone"
														placeholder="Enter your phone number"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="subject">Subject</Label>
													<Input
														id="subject"
														name="subject"
														placeholder="Enter subject"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="message">Message</Label>
													<Textarea
														id="message"
														name="message"
														placeholder="Enter your message"
														rows={5}
														required
													/>
												</div>
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<input
															type="checkbox"
															id="newsletter"
															name="newsletter"
															className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
														/>
														<Label htmlFor="newsletter" className="text-sm">
															Subscribe to our newsletter to receive updates on
															our work
														</Label>
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
														{isSubmitting ? "Sending..." : "Send Message"}
													</Button>
												</motion.div>
											</form>
										)}
									</CardContent>
								</Card>
							</HoverCard>
						</FadeIn>
					</div>
				</div>
			</section>

			{/* Map */}
			<section className="py-16 md:py-24 bg-muted/40">
				<div className="container">
					<div className="mb-12 text-center">
						<FadeIn>
							<Badge className="mb-4">Our Location</Badge>
						</FadeIn>
						<FadeIn direction="up" delay={0.2}>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Visit Our Office
							</h2>
						</FadeIn>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-4 max-w-[700px] text-muted-foreground"
						>
							<p>
								Our headquarters is located in the heart of New York City. We
								welcome visitors by appointment.
							</p>
						</FadeIn>
					</div>
					<FadeIn direction="up" delay={0.6}>
						<div className="relative h-[400px] w-full overflow-hidden rounded-lg">
							<Image
								src="/placeholder.svg?height=800&width=1600"
								alt="Map location"
								fill
								className="object-cover"
							/>
							<motion.div
								className="absolute inset-0 flex items-center justify-center"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ delay: 0.8, duration: 0.5 }}
								viewport={{ once: true }}
							>
								<p className="bg-background/80 p-4 text-center rounded-md">
									Map placeholder - In a real implementation, this would be an
									interactive map
								</p>
							</motion.div>
						</div>
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
								Find answers to common questions about contacting and working
								with Empower Together.
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
											How quickly can I expect a response to my inquiry?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											We strive to respond to all inquiries within 2 business
											days. For urgent matters, please call our office directly.
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
											Can I schedule a meeting with your team?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											Yes, we welcome meetings with potential partners, donors,
											and other stakeholders. Please contact us to schedule an
											appointment.
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
											Do you have offices in other locations?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											In addition to our New York headquarters, we have regional
											offices in London, Nairobi, and New Delhi. Contact
											information for these offices can be found on our regional
											pages.
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
											How can I request a speaker for my event?
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											We're happy to consider speaking engagements. Please send
											your request to speakers@empowertogether.org with details
											about your event, including the date, location, audience,
											and topic.
										</p>
									</CardContent>
								</Card>
							</HoverCard>
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
