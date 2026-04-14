import { PrismaClient } from "@prisma/client";

import { syncInwolagContent } from "../lib/inwolag-sync";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding INWOLAG specific content...");

	const summary = await syncInwolagContent(prisma);

	console.log("Seed completed successfully:", summary);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
