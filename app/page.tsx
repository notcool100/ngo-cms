"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	Calendar,
	Heart,
	Users,
	ChevronRight,
	Star,
	MapPin,
	Sparkles,
	BookOpen,
	GraduationCap,
	Globe,
} from "lucide-react";

// Import our custom components
import { HeroParallax } from "@/components/animations/hero-parallax";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ScaleIn } from "@/components/animations/scale-in";
import { CountUp } from "@/components/animations/count-up";
import { ProgramCard } from "@/components/program-card";
import { EventCard } from "@/components/event-card";
import { toast } from "@/components/ui/use-toast";
import { Container } from "@/components/ui/container";
import { NoticesSection } from "@/components/notices-section";
import { FeaturedPublications } from "@/components/featured-publications";

export default function HomePage() {
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
	const [email, setEmail] = useState("");

	useEffect(() => {
		// Fetch featured programs
		fetch("/api/programs?featured=true&limit=3&active=true")
			.then((res) => res.json())
			.then((data) => {
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
				setUpcomingEvents(data.events);
			})
			.catch((err) => {
				console.error("Error fetching upcoming events:", err);
				setUpcomingEvents([]);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				toast({
					title: "Success!",
					description: "Thank you for subscribing to our newsletter.",
				});
				setEmail("");
			} else {
				throw new Error("Failed to subscribe");
			}
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
			toast({
				title: "Error",
				description: "Failed to subscribe. Please try again later.",
				variant: "destructive",
			});
		}
	};

	return (
		<Container>
			<div className="space-y-10 pb-10">
				<NoticesSection />
				<FeaturedPublications />
			</div>
		</Container>
	);
}
