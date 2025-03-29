import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const period = searchParams.get("period") || "month"; // week, month, quarter, year, all

		// Calculate date range based on period
		const now = new Date();
		let startDate = new Date(now);

		switch (period) {
			case "week":
				startDate.setDate(now.getDate() - 7);
				break;
			case "month":
				startDate.setMonth(now.getMonth() - 1);
				break;
			case "quarter":
				startDate.setMonth(now.getMonth() - 3);
				break;
			case "year":
				startDate.setFullYear(now.getFullYear() - 1);
				break;
			case "all":
				startDate = new Date(0); // Beginning of time
				break;
		}

		// Get upcoming events
		const upcomingEvents = await prisma.event.findMany({
			where: {
				startDate: {
					gte: now,
				},
				published: true,
			},
			orderBy: {
				startDate: "asc",
			},
			take: 5,
			include: {
				_count: {
					select: {
						attendees: true,
					},
				},
			},
		});

		// Get past events
		const pastEvents = await prisma.event.findMany({
			where: {
				startDate: {
					lt: now,
					gte: startDate,
				},
			},
			orderBy: {
				startDate: "desc",
			},
			include: {
				_count: {
					select: {
						attendees: true,
					},
				},
			},
		});

		// Get attendee statistics
		const attendeeStats = await prisma.attendee.groupBy({
			by: ["status"],
			_count: true,
			where: {
				event: {
					startDate: {
						gte: startDate,
					},
				},
			},
		});

		// Get monthly event counts
		const monthlyEvents = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "startDate") as month,
        COUNT(*) as count
      FROM "Event"
      WHERE "startDate" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "startDate")
      ORDER BY month ASC
    `;

		return NextResponse.json({
			upcomingEvents,
			pastEvents,
			attendeeStats,
			monthlyEvents,
			period,
		});
	} catch (error) {
		console.error("Error generating events report:", error);
		return NextResponse.json(
			{ error: "Failed to generate events report" },
			{ status: 500 },
		);
	}
}
