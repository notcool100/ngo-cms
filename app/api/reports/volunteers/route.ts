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

		// Get volunteers by status
		const volunteersByStatus = await prisma.volunteer.groupBy({
			by: ["status"],
			_count: true,
			where: {
				createdAt: {
					gte: startDate,
				},
			},
		});

		// Get monthly volunteer signups
		const monthlyVolunteers = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "Volunteer"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

		// Get volunteers by location (city/state)
		const volunteersByLocation = await prisma.volunteer.groupBy({
			by: ["city", "state"],
			_count: true,
			where: {
				createdAt: {
					gte: startDate,
				},
				city: {
					not: null,
				},
				state: {
					not: null,
				},
			},
		});

		return NextResponse.json({
			volunteersByStatus,
			monthlyVolunteers,
			volunteersByLocation,
			period,
		});
	} catch (error) {
		console.error("Error generating volunteers report:", error);
		return NextResponse.json(
			{ error: "Failed to generate volunteers report" },
			{ status: 500 },
		);
	}
}
