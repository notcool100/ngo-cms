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

		// Get total donations by status
		const donationsByStatus = await prisma.donation.groupBy({
			by: ["status"],
			_sum: {
				amount: true,
			},
			_count: true,
			where: {
				createdAt: {
					gte: startDate,
				},
			},
		});

		// Get total donations by type
		const donationsByType = await prisma.donation.groupBy({
			by: ["type"],
			_sum: {
				amount: true,
			},
			_count: true,
			where: {
				createdAt: {
					gte: startDate,
				},
			},
		});

		// Get monthly donations for the period
		const monthlyDonations = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(amount) as total,
        COUNT(*) as count
      FROM "Donation"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

		// Get donations by program
		const donationsByProgram = await prisma.donation.groupBy({
			by: ["programId"],
			_sum: {
				amount: true,
			},
			_count: true,
			where: {
				createdAt: {
					gte: startDate,
				},
				programId: {
					not: null,
				},
			},
		});

		// Get program names for the donations by program
		const programIds = donationsByProgram
			.map((d) => d.programId)
			.filter(Boolean) as string[];
		const programs =
			programIds.length > 0
				? await prisma.program.findMany({
						where: {
							id: {
								in: programIds,
							},
						},
						select: {
							id: true,
							title: true,
						},
					})
				: [];

		// Map program names to donations by program
		const donationsByProgramWithNames = donationsByProgram.map((d) => ({
			...d,
			programName:
				programs.find((p) => p.id === d.programId)?.title || "Unknown Program",
		}));

		return NextResponse.json({
			donationsByStatus,
			donationsByType,
			monthlyDonations,
			donationsByProgram: donationsByProgramWithNames,
			period,
		});
	} catch (error) {
		console.error("Error generating donations report:", error);
		return NextResponse.json(
			{ error: "Failed to generate donations report" },
			{ status: 500 },
		);
	}
}
