import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const upcoming = searchParams.get("upcoming");
		const limit = parseInt(searchParams.get("limit") || "10");

		let where: any = {
			published: true,
		};

		if (upcoming === "true") {
			where.startDate = {
				gte: new Date(),
			};
		}

		const events = await prisma.event.findMany({
			where,
			orderBy: {
				startDate: "asc",
			},
			take: limit,
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				startDate: true,
				endDate: true,
				location: true,
			},
		});

		return NextResponse.json({ events });
	} catch (error) {
		console.error("Error fetching events:", error);
		return NextResponse.json({ events: [] }, { status: 500 });
	}
}
