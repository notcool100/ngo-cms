"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for the about page data
interface TeamMember {
	id: number;
	name: string;
	position: string;
	bio: string;
	image: string;
	socialLinks?: {
		twitter?: string;
		linkedin?: string;
		instagram?: string;
	};
	order: number;
	active: boolean;
}

interface AboutSection {
	id: number;
	title: string;
	subtitle?: string;
	content: string;
	image?: string;
	order: number;
	type: string;
	active: boolean;
}

interface AboutPageData {
	sections: AboutSection[];
	team: TeamMember[];
}

export default function AboutPage() {
	const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAboutData = async () => {
			try {
				const response = await fetch("/api/about");
				if (!response.ok) {
					throw new Error("Failed to fetch about data");
				}
				const data = await response.json();
				setAboutData(data);
			} catch (error) {
				console.error("Error fetching about data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAboutData();
	}, []);

	// Helper function to get sections by type
	const getSectionsByType = (type: string) => {
		if (!aboutData?.sections) return [];
		return aboutData.sections.filter((section) => section.type === type);
	};

	// Get specific sections
	const missionSections = getSectionsByType("mission");
	const visionSections = getSectionsByType("vision");
	const historySections = getSectionsByType("history");
	const valuesSections = getSectionsByType("values");
	const impactSections = getSectionsByType("impact");

	const renderSkeleton = () => (
		<div className="animate-pulse">
			<div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
			<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
			<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
			<div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
			<div className="h-4 bg-gray-200 rounded w-4/6"></div>
		</div>
	);

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 mix-blend-multiply" />
				<div className="relative py-24 flex items-center">
					<div className="absolute inset-0 z-0">
						<Image
							src="/placeholder.svg?height=400&width=1920"
							alt="About Us"
							fill
							className="object-cover"
							priority
						/>
					</div>
					<div className="container relative z-10">
						<div className="max-w-2xl text-white">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="text-4xl md:text-5xl font-bold mb-4"
							>
								About Us
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="text-lg md:text-xl"
							>
								Learn about our mission, vision, and the team behind our work.
							</motion.p>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision Section */}
			<section className="py-16 bg-white">
				<div className="container">
					<Tabs defaultValue="mission" className="w-full">
						<TabsList className="grid w-full grid-cols-2 mb-8">
							<TabsTrigger value="mission">Our Mission</TabsTrigger>
							<TabsTrigger value="vision">Our Vision</TabsTrigger>
						</TabsList>
						<TabsContent value="mission">
							{isLoading ? (
								renderSkeleton()
							) : missionSections.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
									<div>
										<h2 className="text-3xl font-bold mb-6">
											{missionSections[0].title}
										</h2>
										<div
											className="prose max-w-none"
											dangerouslySetInnerHTML={{
												__html: missionSections[0].content,
											}}
										/>
									</div>
									<div className="relative h-[400px] rounded-lg overflow-hidden">
										<Image
											src={
												missionSections[0].image ||
												"/placeholder.svg?height=400&width=600"
											}
											alt="Our mission"
											fill
											className="object-cover"
										/>
									</div>
								</div>
							) : (
								<div className="text-center py-12">
									<p className="text-gray-500">
										Mission information not available.
									</p>
								</div>
							)}
						</TabsContent>
						<TabsContent value="vision">
							{isLoading ? (
								renderSkeleton()
							) : visionSections.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
									<div className="relative h-[400px] rounded-lg overflow-hidden md:order-first">
										<Image
											src={
												visionSections[0].image ||
												"/placeholder.svg?height=400&width=600"
											}
											alt="Our vision"
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<h2 className="text-3xl font-bold mb-6">
											{visionSections[0].title}
										</h2>
										<div
											className="prose max-w-none"
											dangerouslySetInnerHTML={{
												__html: visionSections[0].content,
											}}
										/>
									</div>
								</div>
							) : (
								<div className="text-center py-12">
									<p className="text-gray-500">
										Vision information not available.
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* History Section */}
			<section className="py-16 bg-gray-50">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our History</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							The journey that brought us to where we are today.
						</p>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[1, 2, 3].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
									<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
									<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
								</div>
							))}
						</div>
					) : historySections.length > 0 ? (
						<div className="space-y-12">
							{historySections.map((section, index) => (
								<motion.div
									key={section.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
								>
									<div className={index % 2 === 0 ? "" : "md:order-last"}>
										<h3 className="text-2xl font-bold mb-4">{section.title}</h3>
										{section.subtitle && (
											<p className="text-primary font-medium mb-4">
												{section.subtitle}
											</p>
										)}
										<div
											className="prose max-w-none"
											dangerouslySetInnerHTML={{ __html: section.content }}
										/>
									</div>
									<div className="relative h-[300px] rounded-lg overflow-hidden">
										<Image
											src={
												section.image ||
												`/placeholder.svg?height=300&width=500&text=History+${index + 1}`
											}
											alt={section.title}
											fill
											className="object-cover"
										/>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">
								History information not available.
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16 bg-white">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Values</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							The principles that guide our work and decision-making.
						</p>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[1, 2, 3].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-16 w-16 bg-gray-200 rounded-full mb-4 mx-auto"></div>
									<div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
									<div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
								</div>
							))}
						</div>
					) : valuesSections.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{valuesSections.map((value, index) => (
								<motion.div
									key={value.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="text-center"
								>
									<div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
										<span className="text-2xl font-bold">{index + 1}</span>
									</div>
									<h3 className="text-xl font-bold mb-4">{value.title}</h3>
									<div
										className="prose max-w-none"
										dangerouslySetInnerHTML={{ __html: value.content }}
									/>
								</motion.div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">Values information not available.</p>
						</div>
					)}
				</div>
			</section>

			{/* Team Section */}
			<section className="py-16 bg-gray-50">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Team</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Meet the dedicated individuals working to fulfill our mission.
						</p>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
									<div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								</div>
							))}
						</div>
					) : aboutData?.team && aboutData.team.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
							{aboutData.team.map((member, index) => (
								<motion.div
									key={member.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									whileHover={{ y: -10 }}
									className="bg-white rounded-lg overflow-hidden shadow-sm"
								>
									<div className="relative h-64">
										<Image
											src={
												member.image ||
												`/placeholder.svg?height=300&width=300&text=${member.name}`
											}
											alt={member.name}
											fill
											className="object-cover"
										/>
									</div>
									<div className="p-6">
										<h3 className="text-xl font-bold mb-1">{member.name}</h3>
										<p className="text-primary mb-4">{member.position}</p>
										<p className="text-gray-600 line-clamp-3">{member.bio}</p>

										{member.socialLinks && (
											<div className="flex mt-4 space-x-3">
												{member.socialLinks.twitter && (
													<a
														href={member.socialLinks.twitter}
														target="_blank"
														rel="noopener noreferrer"
														className="text-gray-500 hover:text-primary"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
														</svg>
													</a>
												)}
												{member.socialLinks.linkedin && (
													<a
														href={member.socialLinks.linkedin}
														target="_blank"
														rel="noopener noreferrer"
														className="text-gray-500 hover:text-primary"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
															<rect x="2" y="9" width="4" height="12"></rect>
															<circle cx="4" cy="4" r="2"></circle>
														</svg>
													</a>
												)}
												{member.socialLinks.instagram && (
													<a
														href={member.socialLinks.instagram}
														target="_blank"
														rel="noopener noreferrer"
														className="text-gray-500 hover:text-primary"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
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
															<line
																x1="17.5"
																y1="6.5"
																x2="17.51"
																y2="6.5"
															></line>
														</svg>
													</a>
												)}
											</div>
										)}
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">Team information not available.</p>
						</div>
					)}
				</div>
			</section>

			{/* Impact Section */}
			<section className="py-16 bg-primary text-white">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Impact</h2>
						<p className="max-w-2xl mx-auto">
							The difference we've made in the lives of women and communities.
						</p>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-16 bg-white/20 rounded mb-4"></div>
									<div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
								</div>
							))}
						</div>
					) : impactSections.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{impactSections.map((impact, index) => (
								<motion.div
									key={impact.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="text-center"
								>
									<p className="text-4xl font-bold mb-2">{impact.title}</p>
									<p>{impact.subtitle}</p>
								</motion.div>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							<div className="text-center">
								<p className="text-4xl font-bold mb-2">5,000+</p>
								<p>Women Empowered</p>
							</div>
							<div className="text-center">
								<p className="text-4xl font-bold mb-2">120+</p>
								<p>Communities Served</p>
							</div>
							<div className="text-center">
								<p className="text-4xl font-bold mb-2">50+</p>
								<p>Active Programs</p>
							</div>
							<div className="text-center">
								<p className="text-4xl font-bold mb-2">15+</p>
								<p>Years of Impact</p>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="py-16 bg-white">
				<div className="container">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-6">Join Us in Our Mission</h2>
						<p className="text-gray-600 text-lg mb-8">
							There are many ways to get involved and support our work to
							empower women and transform communities.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Link href="/donate">
								<Button size="lg" className="bg-primary hover:bg-primary/90">
									Donate Now
								</Button>
							</Link>
							<Link href="/volunteer">
								<Button size="lg" variant="outline">
									Volunteer With Us
								</Button>
							</Link>
							<Link href="/contact">
								<Button size="lg" variant="outline">
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
