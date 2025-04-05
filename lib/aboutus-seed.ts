import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding database...");

	// Insert About Sections
	await prisma.aboutSection.createMany({
		data: [
			{
				title: "Our Mission",
				content:
					"We are dedicated to empowering women through education, economic opportunities, and leadership development. Our programs focus on building skills, confidence, and networks that enable women to overcome barriers and achieve their full potential.",
				image: "/placeholder.svg?height=400&width=600",
				order: 1,
				type: "mission",
				active: true,
			},
			{
				title: "Our Vision",
				content:
					"We envision a world where all women have equal opportunities to lead, learn, and thrive...",
				image: "/placeholder.svg?height=400&width=600",
				order: 2,
				type: "vision",
				active: true,
			},
			{
				title: "Our Beginnings",
				subtitle: "2008-2010",
				content:
					"Our organization was founded in 2008 by a group of passionate women who recognized the need for targeted support for women in underserved communities.",
				image: "/placeholder.svg?height=300&width=500&text=History+1",
				order: 1,
				type: "history",
				active: true,
			},
			{
				title: "Expanding Our Reach",
				subtitle: "2011-2015",
				content:
					"As our programs demonstrated success, we expanded to new regions...",
				image: "/placeholder.svg?height=300&width=500&text=History+2",
				order: 2,
				type: "history",
				active: true,
			},
		],
	});

	// Insert Team Members
	await prisma.teamMember.createMany({
		data: [
			{
				name: "Sarah Johnson",
				position: "Executive Director",
				bio: "Sarah has over 15 years of experience in nonprofit leadership and women's empowerment initiatives...",
				image: "/placeholder.svg?height=300&width=300&text=Sarah+Johnson",
				socialLinks: {
					twitter: "https://twitter.com",
					linkedin: "https://linkedin.com",
				},
				order: 1,
				active: true,
			},
			{
				name: "Maria Rodriguez",
				position: "Program Director",
				bio: "Maria oversees all of our programs and ensures they are effectively meeting the needs of the women we serve...",
				image: "/placeholder.svg?height=300&width=300&text=Maria+Rodriguez",
				socialLinks: {
					linkedin: "https://linkedin.com",
					instagram: "https://instagram.com",
				},
				order: 2,
				active: true,
			},
		],
	});

	console.log("Seeding complete!");
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
