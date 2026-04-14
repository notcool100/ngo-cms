import { PrismaClient, TeamType } from "@prisma/client";

import { INWOLAG_CONTENT } from "./inwolag-content";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding INWOLAG about data...");

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

	console.log("INWOLAG about seed complete.");
}

main()
	.catch((error) => {
		console.error("Error seeding database:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
