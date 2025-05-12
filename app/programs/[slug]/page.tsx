import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import ProgramGallery from "@/components/program-gallery";

interface ProgramPageProps {
	params: {
		slug: string;
	};
}

export async function generateMetadata({ params }: ProgramPageProps) {
	const program = await prisma.program.findUnique({
		where: {
			slug: params.slug,
		},
	});

	if (!program) {
		return {
			title: "Program Not Found",
		};
	}

	return {
		title: `${program.title} | IWLAG`,
		description: program.description,
	};
}

export default async function ProgramPage({ params }: ProgramPageProps) {
	const program = await prisma.program.findUnique({
		where: {
			slug: params.slug,
		},
		include: {
			category: true,
			images: true, // Include gallery images
		},
	});

	if (!program) {
		notFound();
	}

	// Fetch related programs in the same category
	const relatedPrograms = await prisma.program.findMany({
		where: {
			categoryId: program.categoryId,
			active: true,
			NOT: {
				id: program.id, // Exclude the current program
			},
		},
		take: 3,
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
				<div className="relative h-[40vh] w-full">
					<Image
						src={program.image || "/placeholder.svg?height=600&width=1600"}
						alt={program.title}
						fill
						className="object-cover"
						priority
					/>
				</div>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container text-center text-white">
						<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
							{program.title}
						</h1>
						<p className="mx-auto mt-4 max-w-[700px] text-lg text-white/90">
							{program.description}
						</p>
					</div>
				</div>
			</section>

			{/* Program Content */}
			<section className="py-16 md:py-24">
				<div className="container">
					<div className="grid gap-12 md:grid-cols-3">
						<div className="md:col-span-2 space-y-6">
							<div>
								<Badge>{program.category.name}</Badge>
								<h2 className="mt-2 text-3xl font-bold tracking-tighter">
									About This Program
								</h2>
							</div>
							<div className="prose max-w-none">
								{program.content.split("\n").map((paragraph, index) => (
									<p key={index}>{paragraph}</p>
								))}
							</div>

							{/* Program Gallery */}
							<ProgramGallery images={program.images} programTitle={program.title} />

							<div className="pt-6">
								<h3 className="text-xl font-bold mb-4">Program Impact</h3>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="bg-muted/40 p-4 rounded-lg">
										<h4 className="font-medium">Who We Serve</h4>
										<p className="text-sm text-muted-foreground mt-1">
											Women and girls from underserved communities seeking
											opportunities for growth and empowerment.
										</p>
									</div>
									<div className="bg-muted/40 p-4 rounded-lg">
										<h4 className="font-medium">Program Reach</h4>
										<p className="text-sm text-muted-foreground mt-1">
											Operating in 15+ communities with over 500 participants
											annually.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="bg-muted/40 rounded-lg p-6 sticky top-24">
								<h3 className="text-xl font-bold mb-4">Get Involved</h3>
								<div className="space-y-4">
									{/* <Link href="/donate" className="w-full">
										<Button className="w-full">Support This Program</Button>
									</Link> */}
									<Link href="/volunteer" className="w-full">
										<Button variant="outline" className="w-full">
											Volunteer
										</Button>
									</Link>
									<div className="pt-4 border-t">
										<h4 className="font-medium mb-2">Program Details</h4>
										<ul className="space-y-2 text-sm">
											<li className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-primary" />
												<span>Year-round programming</span>
											</li>
											<li className="flex items-center gap-2">
												<MapPin className="h-4 w-4 text-primary" />
												<span>Multiple locations</span>
											</li>
											<li className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-primary" />
												<span>Flexible scheduling</span>
											</li>
										</ul>
									</div>
									<div className="pt-4 border-t">
										<h4 className="font-medium mb-2">Contact Information</h4>
										<p className="text-sm text-muted-foreground">
											For more information about this program, please contact us
											at{" "}
											<a
												href="mailto:programs@empowertogether.org"
												className="text-primary hover:underline"
											>
												programs@empowertogether.org
											</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Related Programs */}
			{relatedPrograms.length > 0 && (
				<section className="bg-muted/40 py-16">
					<div className="container">
						<h2 className="text-2xl font-bold mb-6">Related Programs</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{relatedPrograms.map((relatedProgram) => (
								<div
									key={relatedProgram.id}
									className="bg-card rounded-lg p-4 border"
								>
									<h3 className="font-bold">{relatedProgram.title}</h3>
									<p className="text-sm text-muted-foreground mt-2 line-clamp-2">
										{relatedProgram.description}
									</p>
									<Link
										href={`/programs/${relatedProgram.slug}`}
										className="text-sm font-medium text-primary hover:underline mt-2 inline-block"
									>
										Learn more
									</Link>
								</div>
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}