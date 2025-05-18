import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PressReleaseClient } from "./press-release-client";
import { notFound } from "next/navigation";
import type { PressRelease } from "@/app/admin/press-releases/columns";

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const pressRelease = await prisma.pressRelease.findUnique({
		where: { slug: params.slug },
	});

	if (!pressRelease) {
		return {
			title: "Press Release Not Found | IWLAG",
		};
	}

	return {
		title: `${pressRelease.title} | IWLAG`,
		description: pressRelease.excerpt || pressRelease.content.substring(0, 160),
	};
}

async function getPressRelease(slug: string) {
	const pressRelease = (await prisma.pressRelease.findUnique({
		where: { slug },
		include: {
			author: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	})) as unknown as PressRelease;

	return pressRelease;
}

export default async function PressReleasePage({
	params,
}: {
	params: { slug: string };
}) {
	const pressRelease = await getPressRelease(params.slug);

	if (!pressRelease) {
		notFound();
	}

	return <PressReleaseClient pressRelease={pressRelease} />;
}
