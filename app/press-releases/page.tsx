import type { Metadata } from "next";
import { PressReleasesClient } from "./press-releases-client";
import { prisma } from "@/lib/prisma";
import type { PressRelease } from "@/app/admin/press-releases/columns";

export const metadata: Metadata = {
	title: "Press Releases | IWLAG",
	description: "Latest press releases, news, and updates from IWLAG",
};

export const revalidate = 3600;

async function getPressReleases() {
	try {
		const [featured, regular] = await Promise.all([
			prisma.pressRelease.findMany({
				where: {
					published: true,
					featured: true,
				},
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
				orderBy: {
					publishedAt: "desc",
				},
			}) as unknown as PressRelease[],
			prisma.pressRelease.findMany({
				where: {
					published: true,
					featured: false,
				},
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
				orderBy: {
					publishedAt: "desc",
				},
			}) as unknown as PressRelease[],
		]);

		return {
			featured,
			regular,
		};
	} catch (error) {
		console.error("Error fetching press releases:", error);
		return { featured: [], regular: [] };
	}
}

export default async function PressReleasesPage() {
	const { featured, regular } = await getPressReleases();
	return <PressReleasesClient featured={featured} regular={regular} />;
}
