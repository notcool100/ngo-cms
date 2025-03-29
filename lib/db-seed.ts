import { DonationType, PaymentStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("Starting database seed...");

	// Create admin user
	const adminPassword = await bcrypt.hash("admin123", 10);
	const admin = await prisma.user.upsert({
		where: { email: "admin@empowertogether.org" },
		update: {},
		create: {
			name: "Admin User",
			email: "admin@empowertogether.org",
			password: adminPassword,
			role: "ADMIN",
		},
	});
	console.log("Created admin user:", admin.email);

	// Create program categories
	const categories = [
		{
			name: "Education",
			slug: "education",
			description: "Educational programs for women and girls",
		},
		{
			name: "Economic Empowerment",
			slug: "economic-empowerment",
			description:
				"Programs focused on financial independence and entrepreneurship",
		},
		{
			name: "Leadership",
			slug: "leadership",
			description: "Leadership development and training programs",
		},
		{
			name: "Health & Wellbeing",
			slug: "health-wellbeing",
			description: "Programs promoting health and wellbeing",
		},
	];

	for (const category of categories) {
		await prisma.programCategory.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		});
	}
	console.log(`Created ${categories.length} program categories`);

	// Create programs
	const educationCategory = await prisma.programCategory.findUnique({
		where: { slug: "education" },
	});

	const economicCategory = await prisma.programCategory.findUnique({
		where: { slug: "economic-empowerment" },
	});

	const leadershipCategory = await prisma.programCategory.findUnique({
		where: { slug: "leadership" },
	});

	if (educationCategory && economicCategory && leadershipCategory) {
		const programs = [
			{
				title: "Girls' Education Initiative",
				slug: "girls-education-initiative",
				description: "Providing access to quality education for girls",
				content:
					"Our flagship education program provides scholarships, mentoring, and resources to help girls access quality education from primary through tertiary levels.",
				image: "/placeholder.svg?height=400&width=600",
				featured: true,
				active: true,
				categoryId: educationCategory.id,
			},
			{
				title: "Digital Literacy Program",
				slug: "digital-literacy-program",
				description: "Bridging the digital gender gap",
				content:
					"This program equips women and girls with essential digital skills, helping them access information, opportunities, and participate fully in the digital economy.",
				image: "/placeholder.svg?height=400&width=600",
				featured: false,
				active: true,
				categoryId: educationCategory.id,
			},
			{
				title: "Women Entrepreneurs Network",
				slug: "women-entrepreneurs-network",
				description: "Supporting women-owned businesses",
				content:
					"We provide training, mentorship, networking opportunities, and access to capital for women entrepreneurs to help them start and grow successful businesses.",
				image: "/placeholder.svg?height=400&width=600",
				featured: true,
				active: true,
				categoryId: economicCategory.id,
			},
			{
				title: "Financial Literacy Program",
				slug: "financial-literacy-program",
				description: "Building financial knowledge and skills",
				content:
					"This program teaches women essential financial skills, including budgeting, saving, investing, and managing credit, to help them achieve financial independence and security.",
				image: "/placeholder.svg?height=400&width=600",
				featured: false,
				active: true,
				categoryId: economicCategory.id,
			},
			{
				title: "Women's Leadership Academy",
				slug: "womens-leadership-academy",
				description: "Developing tomorrow's leaders",
				content:
					"Our leadership academy provides comprehensive training to help women develop the skills, confidence, and networks they need to become effective leaders in their communities.",
				image: "/placeholder.svg?height=400&width=600",
				featured: true,
				active: true,
				categoryId: leadershipCategory.id,
			},
			{
				title: "Political Participation Initiative",
				slug: "political-participation-initiative",
				description: "Increasing women's representation in politics",
				content:
					"This program works to increase women's participation and representation in political processes and decision-making at all levels of government.",
				image: "/placeholder.svg?height=400&width=600",
				featured: false,
				active: true,
				categoryId: leadershipCategory.id,
			},
		];

		for (const program of programs) {
			await prisma.program.upsert({
				where: { slug: program.slug },
				update: {},
				create: program,
			});
		}
		console.log(`Created ${programs.length} programs`);
	}

	// Create events
	const events = [
		{
			title: "Women in Tech Conference",
			slug: "women-in-tech-conference",
			description:
				"Join us for a day of inspiring talks, workshops, and networking opportunities focused on advancing women in technology fields.",
			content:
				"The Women in Tech Conference brings together industry leaders, innovators, and aspiring technologists for a day of learning and connection. The event features keynote speeches, panel discussions, workshops, and networking sessions designed to inspire and empower women in the technology sector.",
			location: "Virtual Event",
			startDate: new Date("2024-06-15T09:00:00Z"),
			endDate: new Date("2024-06-15T17:00:00Z"),
			image: "/placeholder.svg?height=400&width=600",
			featured: true,
			published: true,
			organizerId: admin.id,
		},
		{
			title: "Fundraising Gala Dinner",
			slug: "fundraising-gala-dinner",
			description:
				"An elegant evening of dining, entertainment, and fundraising to support our educational scholarship program for girls in underserved communities.",
			content:
				"Join us for our annual Fundraising Gala Dinner, an elegant evening dedicated to supporting our educational scholarship program. The event includes a gourmet dinner, live entertainment, silent auction, and inspiring stories from program beneficiaries. All proceeds go directly to providing scholarships for girls in underserved communities.",
			location: "Grand Hotel, New York",
			startDate: new Date("2024-07-08T18:00:00Z"),
			endDate: new Date("2024-07-08T22:00:00Z"),
			image: "/placeholder.svg?height=400&width=600",
			featured: true,
			published: true,
			organizerId: admin.id,
		},
	];

	for (const event of events) {
		await prisma.event.upsert({
			where: { slug: event.slug },
			update: {},
			create: event,
		});
	}
	console.log(`Created ${events.length} events`);

	// Create sample donations
	// Update the donations section to use the enum values properly
	const donations = [
		{
			amount: 1000,
			currency: "USD",
			status: PaymentStatus.COMPLETED,
			type: DonationType.ONE_TIME, // Use the enum value
			name: "Sarah Johnson",
			email: "sarah@example.com",
			message: "Keep up the great work!",
			transactionId: "tx_123456",
		},
		{
			amount: 500,
			currency: "USD",
			status: PaymentStatus.COMPLETED,
			type: DonationType.ONE_TIME, // Use the enum value
			name: "Michael Chen",
			email: "michael@example.com",
			message: "Happy to support your mission",
			transactionId: "tx_234567",
		},
		{
			amount: 250,
			currency: "USD",
			status: PaymentStatus.COMPLETED,
			type: DonationType.ONE_TIME, // Use the enum value
			name: "Anonymous",
			transactionId: "tx_345678",
		},
		{
			amount: 100,
			currency: "USD",
			status: PaymentStatus.COMPLETED,
			type: DonationType.MONTHLY, // Use the enum value
			name: "Emily Rodriguez",
			email: "emily@example.com",
			message: "Monthly contribution to help your cause",
			transactionId: "tx_456789",
		},
		{
			amount: 75,
			currency: "USD",
			status: PaymentStatus.COMPLETED,
			type: DonationType.ONE_TIME, // Use the enum value
			name: "David Kim",
			email: "david@example.com",
			transactionId: "tx_567890",
		},
	];

	for (const donation of donations) {
		await prisma.donation.create({
			data: donation,
		});
	}
	console.log(`Created ${donations.length} donations`);

	console.log("Database seed completed successfully");
}

main()
	.catch((e) => {
		console.error("Error during database seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
