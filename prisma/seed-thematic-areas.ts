import { PrismaClient } from "@prisma/client";

import { INWOLAG_CONTENT } from "../lib/inwolag-content";

const prisma = new PrismaClient();

async function seedThematicAreas() {
	console.log("Seeding INWOLAG thematic areas...");

	await prisma.thematicArea.deleteMany({});
	await prisma.thematicArea.createMany({
		data: INWOLAG_CONTENT.thematicAreas.map((area, index) => ({
			title: area.title,
			slug: area.slug,
			description: area.description,
			content: area.content,
			focus: area.focus ?? undefined,
			activities: area.activities,
			milestones: area.milestones,
			featured: area.featured,
			order: index,
			active: true,
		})),
	});

	console.log("Thematic area seeding completed.");
}

export { seedThematicAreas };

if (require.main === module) {
	seedThematicAreas()
		.catch((error) => {
			console.error(error);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}
