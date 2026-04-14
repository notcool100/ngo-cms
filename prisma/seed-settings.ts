import { PrismaClient } from "@prisma/client";

import { INWOLAG_DEFAULTS } from "../lib/inwolag-content";

const prisma = new PrismaClient();

async function main() {
	const existingSettingsCount = await prisma.siteSettings.count();

	if (existingSettingsCount > 0) {
		await prisma.siteSettings.updateMany({
			data: {
				siteName: INWOLAG_DEFAULTS.siteName,
				siteDescription: INWOLAG_DEFAULTS.siteDescription,
				contactEmail: INWOLAG_DEFAULTS.contactEmail,
			},
		});
		console.log("Site settings updated");
		return;
	}

	await prisma.siteSettings.create({
		data: {
			siteName: INWOLAG_DEFAULTS.siteName,
			siteDescription: INWOLAG_DEFAULTS.siteDescription,
			contactEmail: INWOLAG_DEFAULTS.contactEmail,
			maintenanceMode: false,
			backupFrequency: "weekly",
			cacheLifetime: 3600,
			debugMode: false,
			emailNotifications: true,
			donationAlerts: true,
			volunteerAlerts: true,
			contactFormAlerts: true,
		},
	});

	console.log("Default site settings created");
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
