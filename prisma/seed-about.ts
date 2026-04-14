import { PrismaClient, TeamType } from "@prisma/client";

import { INWOLAG_CONTENT } from "../lib/inwolag-content";

const prisma = new PrismaClient();

async function seedAboutData() {
	console.log("Seeding INWOLAG about page data...");

	await prisma.aboutSection.deleteMany({});
	await prisma.aboutSection.createMany({
		data: INWOLAG_CONTENT.aboutSections.map((section) => ({
			title: section.title,
			subtitle: section.subtitle,
			content: section.content,
			order: section.order,
			type: section.type,
			active: true,
		})),
	});

	await prisma.teamMember.deleteMany({});
	await prisma.teamMember.createMany({
		data: INWOLAG_CONTENT.teamMembers.map((member) => ({
			name: member.name,
			position: member.position,
			bio: member.bio,
			order: member.order,
			active: true,
			teamType: member.teamType as TeamType,
		})),
	});

	console.log("About page data seeding completed.");
}

export { seedAboutData };

if (require.main === module) {
	seedAboutData()
		.catch((error) => {
			console.error(error);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}
