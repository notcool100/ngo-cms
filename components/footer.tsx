"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Heart, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/lib/contexts/site-settings-context";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { settings } = useSiteSettings();

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) return;

		try {
			setIsSubmitting(true);

			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to subscribe");
			}

			toast({
				title: "Success!",
				description: "You have been subscribed to our newsletter.",
			});

			setEmail("");
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to subscribe to newsletter",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<footer className="relative bg-gradient-to-b from-muted/30 to-muted/60 overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
			<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
			<div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
			
			{/* Newsletter section with wave divider */}
			<div className="relative">
				<div className="absolute top-0 left-0 w-full">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto fill-background">
						<path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
					</svg>
				</div>
				
				<div className="container pt-32 pb-16 relative z-10">
					<div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-muted/20">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							<div>
								<motion.h3 
									className="text-2xl md:text-3xl font-bold mb-4 text-black"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5 }}
								>
									Stay Connected
								</motion.h3>
								<motion.p 
									className="text-muted-foreground mb-6"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.1 }}
								>
									Subscribe to our newsletter to receive updates on our work, upcoming events, and ways to get involved.
								</motion.p>
								<motion.div
									className="hidden md:block"
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.2 }}
								>
									<div className="relative h-40 w-40 mx-auto">
										<div className="absolute inset-0 bg-primary/10 rounded-full animate-float-slow" />
										<div className="absolute inset-4 bg-primary/20 rounded-full animate-float" />
										<div className="absolute inset-8 bg-primary/30 rounded-full animate-float-fast flex items-center justify-center">
											<Mail className="h-8 w-8 text-primary" />
										</div>
									</div>
								</motion.div>
							</div>
							
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								<form className="space-y-4" onSubmit={handleSubscribe}>
									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium text-black">
											Email Address
										</label>
										<Input
											id="email"
											type="email"
											placeholder="your@email.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="rounded-lg border-muted/30 focus:border-primary/50"
											required
											aria-label="Email address for newsletter"
										/>
									</div>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button 
											type="submit" 
											className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-12"
											disabled={isSubmitting}
										>
											{isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</motion.div>
									<p className="text-xs text-muted-foreground text-center mt-2">
										We respect your privacy. Unsubscribe at any time.
									</p>
								</form>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
			
			{/* Main footer content */}
			<div className="container py-16">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-4">
					<div className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="relative h-10 w-10 overflow-hidden rounded-full">
								<Image 
									src="/uploads/logo.jpg" 
									alt={settings?.siteName || "IWLAG Logo"} 
									fill
									className="object-cover"
									sizes="40px"
								/>
							</div>
							<h3 className="text-xl font-bold text-gradient">{settings?.siteName || "IWLAG"}</h3>
						</div>
						<p className="text-muted-foreground">
							{settings?.siteDescription || "Empowering women through education, support, and community initiatives since 2010."}
						</p>
						<div className="flex space-x-4">
							<motion.a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								aria-label="Facebook"
							>
								<Facebook className="h-5 w-5" />
							</motion.a>
							<motion.a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								aria-label="Instagram"
							>
								<Instagram className="h-5 w-5" />
							</motion.a>
							<motion.a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								aria-label="Twitter"
							>
								<Twitter className="h-5 w-5" />
							</motion.a>
							<motion.a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								aria-label="YouTube"
							>
								<Youtube className="h-5 w-5" />
							</motion.a>
						</div>
					</div>
					
					<div className="space-y-6">
						<h3 className="text-lg font-bold">Quick Links</h3>
						<ul className="space-y-3">
							{[
								{ name: "About Us", href: "/about" },
								{ name: "Our Programs", href: "/programs" },
								{ name: "Events", href: "/events" },
								{ name: "Volunteer", href: "/volunteer" },
								{ name: "Donate", href: "/donate" },
								{ name: "Contact Us", href: "/contact" },
							].map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
									>
										<span className="mr-2 h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					
					<div className="space-y-6">
						<h3 className="text-lg font-bold">Resources</h3>
						<ul className="space-y-3">
							{[
								{ name: "Blog", href: "/blog" },
								{ name: "Success Stories", href: "/stories" },
								{ name: "Resources", href: "/resources" },
								{ name: "FAQ", href: "/faq" },
								{ name: "Privacy Policy", href: "/privacy" },
								{ name: "Terms of Service", href: "/terms" },
							].map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
									>
										<span className="mr-2 h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					
					<div className="space-y-6">
						<h3 className="text-lg font-bold">Contact Us</h3>
						<ul className="space-y-4">
							<li className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-primary mt-0.5" />
								<span className="text-muted-foreground">
									Kapan<br />
									kathmandu, Nepal
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-primary" />
								<a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
									(977) 9800000000
								</a>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-primary" />
								<a href={`mailto:${settings?.contactEmail || "info@empowertogether.org"}`} className="text-muted-foreground hover:text-primary transition-colors">
									{settings?.contactEmail || "info@empowertogether.org"}
								</a>
							</li>
						</ul>
					</div>
				</div>
				
				<div className="mt-16 pt-8 border-t border-muted/30 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground text-center md:text-left">
						&copy; {new Date().getFullYear()} {settings?.siteName || "IWLAG"}. All rights reserved.
					</p>
					<div className="flex items-center gap-2">
						<Heart className="h-4 w-4 text-primary" />
						<span className="text-sm text-muted-foreground">
							Made with love for a better world
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}