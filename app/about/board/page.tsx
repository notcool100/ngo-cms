"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { TeamMember } from "@prisma/client";

export default function BoardPage() {
	const [boardMembers, setBoardMembers] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchBoardMembers() {
			try {
				const response = await fetch("/api/about/team?type=BOARD");
				if (response.ok) {
					const data = await response.json();
					setBoardMembers(data);
				} else {
					console.error("Failed to fetch board members");
				}
			} catch (error) {
				console.error("Error fetching board members:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchBoardMembers();
	}, []);

	if (loading) {
		return (
			<div className="container mx-auto py-12">
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="animate-pulse text-2xl">Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Meet Our Board</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Our board members bring diverse expertise and passion to guide our
					organization's mission and vision.
				</p>
			</div>

			<Separator className="my-8" />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{boardMembers.map((member) => (
					<Card
						key={member.id}
						className="overflow-hidden hover:shadow-lg transition-shadow"
					>
						<div className="relative h-64 w-full">
							{member.image ? (
								<Image
									src={member.image}
									alt={member.name}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full bg-muted flex items-center justify-center">
									<span className="text-4xl font-bold text-muted-foreground">
										{member.name.charAt(0)}
									</span>
								</div>
							)}
						</div>
						<CardHeader>
							<CardTitle>{member.name}</CardTitle>
							<CardDescription>{member.position}</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="line-clamp-4">{member.bio}</p>
						</CardContent>
						<CardFooter className="flex gap-4">
							{member.socialLinks && typeof member.socialLinks === "object" && (
								<>
									{(member.socialLinks as any).facebook && (
										<Link
											href={(member.socialLinks as any).facebook}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
										</Link>
									)}
									{(member.socialLinks as any).twitter && (
										<Link
											href={(member.socialLinks as any).twitter}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
										</Link>
									)}
									{(member.socialLinks as any).linkedin && (
										<Link
											href={(member.socialLinks as any).linkedin}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
										</Link>
									)}
									{(member.socialLinks as any).email && (
										<Link href={`mailto:${(member.socialLinks as any).email}`}>
											<Mail className="h-5 w-5 text-muted-foreground hover:text-primary" />
										</Link>
									)}
								</>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
