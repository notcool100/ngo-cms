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

		// Get current date
		const now = new Date();
		const oneMonthAgo = new Date(now);
		oneMonthAgo.setMonth(now.getMonth() - 1);

		// Get total donations
		const totalDonations = await prisma.donation.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
			},
		});

		// Get donations in the last month
		const lastMonthDonations = await prisma.donation.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
				createdAt: {
					gte: oneMonthAgo,
				},
			},
		});

		// Get active programs count
		const activePrograms = await prisma.program.count({
			where: {
				active: true,
			},
		});

		// Get new volunteers in the last month
		const newVolunteers = await prisma.volunteer.count({
			where: {
				createdAt: {
					gte: oneMonthAgo,
				},
			},
		});

		// Get upcoming events
		const upcomingEvents = await prisma.event.count({
			where: {
				startDate: {
					gte: now,
				},
				published: true,
			},
		});

		// Get recent donations
		const recentDonations = await prisma.donation.findMany({
			take: 5,
			where: {
				status: "COMPLETED",
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				amount: true,
				currency: true,
				name: true,
				createdAt: true,
			},
		});

		return NextResponse.json({
			totalDonations: totalDonations._sum.amount || 0,
			lastMonthDonations: lastMonthDonations._sum.amount || 0,
			activePrograms,
			newVolunteers,
			upcomingEvents,
			recentDonations: recentDonations.map((donation) => ({
				...donation,
				date: formatRelativeTime(donation.createdAt),
			})),
		});
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch dashboard stats" },
			{ status: 500 },
		);
	}
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} seconds ago`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) {
		return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
}
