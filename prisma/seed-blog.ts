import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBlogData() {
	console.log("Updating blog settings and disabling old sample posts...");

	const existingSettings = await prisma.blogSettings.findFirst();

	if (existingSettings) {
		await prisma.blogSettings.update({
			where: { id: existingSettings.id },
			data: {
				seoTitle: "News & Publications | INWOLAG",
				seoDescription:
					"Research, publications, and updates from Indigenous Women Legal Awareness Group (INWOLAG).",
			},
		});
	} else {
		await prisma.blogSettings.create({
			data: {
				seoTitle: "News & Publications | INWOLAG",
				seoDescription:
					"Research, publications, and updates from Indigenous Women Legal Awareness Group (INWOLAG).",
			},
		});
	}

	await prisma.post.updateMany({
		where: {
			slug: {
				in: [
					"iwlag-launches-new-digital-literacy-program",
					"from-student-to-ceo-marias-journey",
					"upcoming-workshop-financial-planning-for-women-entrepreneurs",
					"guide-applying-for-educational-scholarships",
					"iwlag-partners-with-global-tech-company",
				],
			},
		},
		data: {
			published: false,
			featured: false,
		},
	});

	console.log("Blog seed completed.");
}

export { seedBlogData };

if (require.main === module) {
	seedBlogData()
		.catch((error) => {
			console.error(error);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}
