import { PrismaClient } from "@prisma/client";

import { syncInwolagContent } from "./inwolag-sync";

const prisma = new PrismaClient();

async function main() {
	console.log("Syncing INWOLAG website content...");

	const summary = await syncInwolagContent(prisma);

	console.log("INWOLAG content sync complete:", summary);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
