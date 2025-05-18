import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditPressReleaseForm } from "./edit-form";
import { notFound } from "next/navigation";

interface Props {
	params: {
		id: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const pressRelease = await prisma.pressRelease.findUnique({
		where: { id: params.id },
	});

	if (!pressRelease) {
		return {
			title: "Press Release Not Found | Admin",
		};
	}

	return {
		title: `Edit ${pressRelease.title} | Admin`,
	};
}

export default async function EditPressReleasePage({ params }: Props) {
	const pressRelease = await prisma.pressRelease.findUnique({
		where: { id: params.id },
		include: {
			author: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	});

	if (!pressRelease) {
		notFound();
	}

	return <EditPressReleaseForm initialData={pressRelease} />;
}
