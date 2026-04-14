"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { FadeIn } from "@/components/animations/fade-in";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { INWOLAG_CONTENT } from "@/lib/inwolag-content";

export default function DonatePage() {
	const [donationAmount, setDonationAmount] = useState("50");
	const [customAmount, setCustomAmount] = useState("");
	const [donorName, setDonorName] = useState("");
	const [donorEmail, setDonorEmail] = useState("");
	const [donationType, setDonationType] = useState("one-time");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleDonationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		setTimeout(() => {
			toast({
				title: "Thank you for your support",
				description:
					"Your contribution helps sustain INWOLAG's work on Indigenous women's rights, legal aid, and evidence-based advocacy.",
			});
			setIsSubmitting(false);
		}, 1200);
	};

	return (
		<div className="flex flex-col">
			<section className="relative">
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/90 to-primary/70" />
				<ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
					<Image
						src="/heroimage.jpg?height=600&width=1600"
						alt="Support INWOLAG"
						fill
						className="object-cover"
						priority
					/>
				</ParallaxScroll>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
							Support Our Work
						</Badge>
						<AnimatedText
							text="Stand with INWOLAG"
							className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
						/>
						<FadeIn
							direction="up"
							delay={0.4}
							className="mx-auto mt-6 max-w-[760px] text-lg text-white/90 md:text-xl"
						>
							<p className="leading-relaxed">
								Your support helps sustain legal aid, collective rights advocacy, climate justice work, and research-driven action led by Indigenous women in Nepal.
							</p>
						</FadeIn>
					</div>
				</div>
			</section>

			<section className="bg-muted/10 py-16">
				<div className="container grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{[
						...INWOLAG_CONTENT.stats.slice(0, 3),
						{
							value: `${INWOLAG_CONTENT.thematicAreas.length}`,
							label: "Core thematic areas",
						},
					].map((stat, index) => (
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
								What your support strengthens
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Support areas
							</h2>
						</FadeIn>
					</div>

					<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
						{INWOLAG_CONTENT.donationAreas.map((area, index) => (
							<FadeIn key={area.title} delay={index * 0.08}>
								<Card className="h-full border-muted/20">
									<CardHeader>
										<CardTitle>{area.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">{area.description}</p>
									</CardContent>
								</Card>
							</FadeIn>
						))}
					</div>
				</div>
			</section>

			<section id="donation-form" className="bg-muted/10 py-16">
				<div className="container grid gap-12 lg:grid-cols-2">
					<FadeIn direction="right">
						<div>
							<Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
								Why support INWOLAG
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Support rights-based work rooted in community realities
							</h2>
							<div className="mt-6 space-y-4 text-muted-foreground">
								<p>
									INWOLAG works at the intersection of legal aid, collective land and resource rights, conservation justice, climate resilience, and Indigenous women's leadership.
								</p>
								<p>
									Support helps sustain field engagement, documentation, advocacy, research publications, and direct response to rights violations affecting Indigenous women and communities.
								</p>
							</div>

							<div className="mt-8 space-y-4">
								{INWOLAG_CONTENT.donationAreas.map((area) => (
									<div
										key={area.title}
										className="rounded-2xl border border-primary/10 bg-white px-5 py-4 shadow-sm"
									>
										<h3 className="font-semibold">{area.title}</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											{area.description}
										</p>
									</div>
								))}
							</div>
						</div>
					</FadeIn>

					<FadeIn direction="left">
						<Card className="overflow-hidden border-muted/20 shadow-lg">
							<CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
								<CardTitle className="text-2xl">Make a Contribution</CardTitle>
								<CardDescription>
									Support INWOLAG's work for Indigenous women's rights in Nepal.
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<form onSubmit={handleDonationSubmit} className="space-y-6">
									<Tabs defaultValue="one-time" className="w-full" onValueChange={setDonationType}>
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="one-time">One-Time</TabsTrigger>
											<TabsTrigger value="monthly">Monthly</TabsTrigger>
										</TabsList>
										<TabsContent value="one-time" className="space-y-6 pt-6">
											<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
												{["25", "50", "100", "250"].map((amount) => (
													<Button
														key={amount}
														type="button"
														variant={donationAmount === amount ? "default" : "outline"}
														onClick={() => {
															setDonationAmount(amount);
															setCustomAmount("");
														}}
														className="h-12"
													>
														${amount}
													</Button>
												))}
											</div>
											<div className="space-y-2">
												<Label htmlFor="customAmount">Custom Amount</Label>
												<Input
													id="customAmount"
													type="number"
													placeholder="Enter custom amount"
													value={customAmount}
													onChange={(event) => {
														setCustomAmount(event.target.value);
														setDonationAmount("");
													}}
												/>
											</div>
										</TabsContent>
										<TabsContent value="monthly" className="space-y-6 pt-6">
											<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
												{["10", "25", "50", "100"].map((amount) => (
													<Button
														key={amount}
														type="button"
														variant={donationAmount === amount ? "default" : "outline"}
														onClick={() => {
															setDonationAmount(amount);
															setCustomAmount("");
														}}
														className="h-12"
													>
														${amount}
													</Button>
												))}
											</div>
										</TabsContent>
									</Tabs>

									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											value={donorName}
											onChange={(event) => setDonorName(event.target.value)}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											value={donorEmail}
											onChange={(event) => setDonorEmail(event.target.value)}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label>Contribution Type</Label>
										<RadioGroup value={donationType} onValueChange={setDonationType}>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="one-time" id="one-time" />
												<Label htmlFor="one-time">One-time contribution</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="monthly" id="monthly" />
												<Label htmlFor="monthly">Monthly contribution</Label>
											</div>
										</RadioGroup>
									</div>

									<div className="space-y-2">
										<Label htmlFor="message">Message (Optional)</Label>
										<Textarea
											id="message"
											placeholder="Share why you are supporting INWOLAG."
										/>
									</div>

									<Button type="submit" className="w-full" disabled={isSubmitting}>
										<Heart className="mr-2 h-4 w-4" />
										{isSubmitting ? "Processing..." : "Contribute Now"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</FadeIn>
				</div>
			</section>

			<section className="bg-white py-16">
				<div className="container">
					<div className="rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 p-10 text-center text-white shadow-xl">
						<h2 className="text-3xl font-bold sm:text-4xl">
							Need another way to support?
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-white/90">
							You can also support INWOLAG through volunteering, partnership, research collaboration, publication support, or community-led engagement.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-4">
							<Link href="/volunteer">
								<Button size="lg" className="bg-white text-primary hover:bg-white/90">
									Get Involved
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Link href="/contact">
								<Button
									size="lg"
									variant="outline"
									className="border-white text-black hover:bg-white/20"
								>
									Contact Us
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
