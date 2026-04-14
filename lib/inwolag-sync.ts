import {
	PrismaClient,
	PublicationType,
	Role,
	TeamType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

import { INWOLAG_CONTENT } from "./inwolag-content";

const GENERIC_EVENT_SLUGS = [
	"women-in-tech-conference",
	"fundraising-gala-dinner",
];

const GENERIC_BLOG_POST_SLUGS = [
	"iwlag-launches-new-digital-literacy-program",
	"from-student-to-ceo-marias-journey",
	"upcoming-workshop-financial-planning-for-women-entrepreneurs",
	"guide-applying-for-educational-scholarships",
	"iwlag-partners-with-global-tech-company",
];

export async function syncInwolagContent(prisma: PrismaClient) {
	const adminPassword = await bcrypt.hash("admin123", 10);

	const admin = await prisma.user.upsert({
		where: { email: INWOLAG_CONTENT.contactEmail },
		update: {
			name: "INWOLAG Admin",
			password: adminPassword,
			role: Role.ADMIN,
		},
		create: {
			name: "INWOLAG Admin",
			email: INWOLAG_CONTENT.contactEmail,
			password: adminPassword,
			role: Role.ADMIN,
		},
	});

	const siteSettingsCount = await prisma.siteSettings.count();

	if (siteSettingsCount > 0) {
		await prisma.siteSettings.updateMany({
			data: {
				siteName: INWOLAG_CONTENT.siteName,
				siteDescription: INWOLAG_CONTENT.siteDescription,
				contactEmail: INWOLAG_CONTENT.contactEmail,
			},
		});
	} else {
		await prisma.siteSettings.create({
			data: {
				siteName: INWOLAG_CONTENT.siteName,
				siteDescription: INWOLAG_CONTENT.siteDescription,
				contactEmail: INWOLAG_CONTENT.contactEmail,
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
	}

	const existingBlogSettings = await prisma.blogSettings.findFirst();

	if (existingBlogSettings) {
		await prisma.blogSettings.update({
			where: { id: existingBlogSettings.id },
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

	const thematicCategory = await prisma.programCategory.upsert({
		where: { slug: "thematic-areas" },
		update: {
			name: "Thematic Areas",
			description: "Core thematic areas of INWOLAG's work.",
		},
		create: {
			name: "Thematic Areas",
			slug: "thematic-areas",
			description: "Core thematic areas of INWOLAG's work.",
		},
	});

	const thematicSlugs = INWOLAG_CONTENT.thematicAreas.map((area) => area.slug);

	await prisma.program.updateMany({
		where: {
			slug: {
				notIn: thematicSlugs,
			},
		},
		data: {
			active: false,
			featured: false,
		},
	});

	for (const area of INWOLAG_CONTENT.thematicAreas) {
		await prisma.program.upsert({
			where: { slug: area.slug },
			update: {
				title: area.title,
				description: area.description,
				content: area.content,
				categoryId: thematicCategory.id,
				featured: area.featured,
				active: true,
			},
			create: {
				title: area.title,
				slug: area.slug,
				description: area.description,
				content: area.content,
				categoryId: thematicCategory.id,
				featured: area.featured,
				active: true,
			},
		});
	}

	const publicationSlugs = INWOLAG_CONTENT.publications.map(
		(publication) => publication.slug,
	);

	await prisma.publication.updateMany({
		where: {
			slug: {
				notIn: publicationSlugs,
			},
		},
		data: {
			published: false,
			featured: false,
		},
	});

	for (const publication of INWOLAG_CONTENT.publications) {
		await prisma.publication.upsert({
			where: { slug: publication.slug },
			update: {
				title: publication.title,
				description: publication.description,
				fileUrl: "",
				type: publication.type as PublicationType,
				featured: publication.featured,
				published: true,
				publishedAt: new Date(publication.publishedAt),
				authorId: admin.id,
			},
			create: {
				title: publication.title,
				slug: publication.slug,
				description: publication.description,
				fileUrl: "",
				type: publication.type as PublicationType,
				featured: publication.featured,
				published: true,
				publishedAt: new Date(publication.publishedAt),
				authorId: admin.id,
			},
		});
	}

	await prisma.event.updateMany({
		where: {
			slug: {
				in: GENERIC_EVENT_SLUGS,
			},
		},
		data: {
			published: false,
		},
	});

	await prisma.post.updateMany({
		where: {
			slug: {
				in: GENERIC_BLOG_POST_SLUGS,
			},
		},
		data: {
			published: false,
			featured: false,
		},
	});

	return {
		adminEmail: admin.email,
		aboutSections: INWOLAG_CONTENT.aboutSections.length,
		teamMembers: INWOLAG_CONTENT.teamMembers.length,
		programs: INWOLAG_CONTENT.thematicAreas.length,
		publications: INWOLAG_CONTENT.publications.length,
	};
}
