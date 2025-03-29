import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	req: Request,
	{ params }: { params: { slug: string } },
) {
	try {
		const event = await prisma.event.findUnique({
			where: { slug: params.slug },
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		return NextResponse.json(event);
	} catch (error) {
		console.error("Error fetching event by slug:", error);
		return NextResponse.json(
			{ error: "Failed to fetch event" },
			{ status: 500 },
		);
	}
}
