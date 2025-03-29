"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		<footer className="bg-muted/40">
			<div className="container py-12 md:py-16">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="space-y-4">
						<h3 className="text-lg font-bold">Empower Together</h3>
						<p className="text-sm text-muted-foreground">
							Empowering women through education, support, and community
							initiatives since 2010.
						</p>
						<div className="flex space-x-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Facebook className="h-5 w-5" />
								<span className="sr-only">Facebook</span>
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Instagram className="h-5 w-5" />
								<span className="sr-only">Instagram</span>
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Youtube className="h-5 w-5" />
								<span className="sr-only">YouTube</span>
							</Link>
						</div>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-bold">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/about"
									className="text-muted-foreground hover:text-primary"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/programs"
									className="text-muted-foreground hover:text-primary"
								>
									Our Programs
								</Link>
							</li>
							<li>
								<Link
									href="/volunteer"
									className="text-muted-foreground hover:text-primary"
								>
									Volunteer
								</Link>
							</li>
							<li>
								<Link
									href="/donate"
									className="text-muted-foreground hover:text-primary"
								>
									Donate
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-muted-foreground hover:text-primary"
								>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-bold">Resources</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/blog"
									className="text-muted-foreground hover:text-primary"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/events"
									className="text-muted-foreground hover:text-primary"
								>
									Events
								</Link>
							</li>
							<li>
								<Link
									href="/resources"
									className="text-muted-foreground hover:text-primary"
								>
									Resources
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-muted-foreground hover:text-primary"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-muted-foreground hover:text-primary"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-bold">Newsletter</h3>
						<p className="text-sm text-muted-foreground">
							Subscribe to our newsletter to receive updates on our work and
							upcoming events.
						</p>
						<form className="space-y-2" onSubmit={handleSubscribe}>
							<Input
								type="email"
								placeholder="Your email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Subscribing..." : "Subscribe"}
							</Button>
						</form>
					</div>
				</div>
				<div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} Empower Together. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
