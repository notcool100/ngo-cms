"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Instagram } from "lucide-react";

interface TeamMemberCard {
	name: string;
	position: string;
	bio: string;
	image?: string | null;
	socialLinks?: Record<string, string> | null;
}

export function TeamCard({ member }: { member: TeamMemberCard }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="group relative flex flex-col items-center text-left"
		>
			<div className="relative w-full overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
				{/* Top Blue Header Part */}
				<div className="h-44 w-full bg-primary" />

				{/* Image Placeholder / Portrait Container */}
				<div className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] h-56 z-10">
					<div className="relative h-full w-full">
						<Image
							src={member.image || `/placeholder.svg?height=400&width=300&text=${member.name}`}
							alt={member.name}
							fill
							className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
							priority
						/>
					</div>
				</div>

				{/* Content Area */}
				<div className="p-8 pt-16">
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
								{member.name}
							</h3>
							<p className="text-lg font-bold text-primary">
								{member.position}
							</p>
						</div>

						<p className="text-sm leading-relaxed text-muted-foreground/90 line-clamp-6">
							{member.bio}
						</p>

						{/* Social Links if any */}
						{member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
							<div className="flex gap-4 pt-2">
								{member.socialLinks.twitter && (
									<a href={member.socialLinks.twitter} className="text-muted-foreground hover:text-primary transition-colors">
										<Twitter className="h-4 w-4" />
									</a>
								)}
								{member.socialLinks.linkedin && (
									<a href={member.socialLinks.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
										<Linkedin className="h-4 w-4" />
									</a>
								)}
								{member.socialLinks.instagram && (
									<a href={member.socialLinks.instagram} className="text-muted-foreground hover:text-primary transition-colors">
										<Instagram className="h-4 w-4" />
									</a>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
