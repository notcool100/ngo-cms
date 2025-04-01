import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/api-permissions";

export async function GET(req: Request) {
	try {
		console.log("GET request received"); // Debugging log
		const session = await getServerSession(authOptions);
		console.log("Session:", session); // Debugging: Log the session

		if (!session) {
			console.log("No session found, user is not authenticated."); // Debugging log
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user has permission to view dashboard
		const permissionCheck = await checkPermission("view:dashboard");
		console.log("Permission Check:", permissionCheck); // Debugging log
		if (!permissionCheck.hasPermission) {
			return permissionCheck.response;
		}

		// Get current date
		const now = new Date();
		const oneMonthAgo = new Date(now);
		oneMonthAgo.setMonth(now.getMonth() - 1);

		// Get start of current year for monthly data
		const startOfYear = new Date(now.getFullYear(), 0, 1);

		// Get total donations
		const totalDonations = await prisma.donation.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
			},
		});
		console.log("Total Donations:", totalDonations); // Debugging log

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
		console.log("Last Month Donations:", lastMonthDonations); // Debugging log

		// Get monthly donations for the current year
		const monthlyDonations = (await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        SUM(amount) as total
      FROM "Donation"
      WHERE 
        "createdAt" >= ${startOfYear} AND
        status = 'COMPLETED'
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `) as { month: number; total: number }[];
		console.log("Monthly Donations:", monthlyDonations); // Debugging log

		// Format monthly data for chart
		const monthlyData = Array.from({ length: 12 }, (_, i) => {
			const monthData = monthlyDonations.find((d) => d.month === i + 1);
			return {
				month: new Date(now.getFullYear(), i).toLocaleString("default", {
					month: "short",
				}),
				amount: monthData ? Number(monthData.total) : 0,
			};
		});

		// Get active programs count
		const activePrograms = await prisma.program.count({
			where: {
				active: true,
			},
		});
		console.log("Active Programs Count:", activePrograms); // Debugging log

		// Get new volunteers in the last month
		const newVolunteers = await prisma.volunteer.count({
			where: {
				createdAt: {
					gte: oneMonthAgo,
				},
			},
		});
		console.log("New Volunteers Count:", newVolunteers); // Debugging log

		// Get upcoming events
		const upcomingEvents = await prisma.event.count({
			where: {
				startDate: {
					gte: now,
				},
				published: true,
			},
		});
		console.log("Upcoming Events Count:", upcomingEvents); // Debugging log

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
		console.log("Recent Donations:", recentDonations); // Debugging log

		// Get program categories with counts
		const programCategories = await prisma.programCategory.findMany({
			select: {
				id: true,
				name: true,
				_count: {
					select: {
						programs: {
							where: {
								active: true,
							},
						},
					},
				},
			},
		});
		console.log("Program Categories:", programCategories); // Debugging log

		// Get recent events
		const recentEvents = await prisma.event.findMany({
			take: 3,
			where: {
				published: true,
			},
			orderBy: {
				startDate: "asc",
			},
			select: {
				id: true,
				title: true,
				startDate: true,
				location: true,
				_count: {
					select: {
						attendees: true,
					},
				},
			},
		});
		console.log("Recent Events:", recentEvents); // Debugging log

		// Get recent messages
		const recentMessages = await prisma.contact.findMany({
			take: 5,
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				email: true,
				subject: true,
				createdAt: true,
			},
		});
		console.log("Recent Messages:", recentMessages); // Debugging log

		return NextResponse.json({
			totalDonations: totalDonations._sum.amount || 0,
			lastMonthDonations: lastMonthDonations._sum.amount || 0,
			activePrograms,
			newVolunteers,
			upcomingEvents,
			monthlyDonations: monthlyData,
			recentDonations: recentDonations.map(
				(donation: {
					id: string;
					amount: number;
					currency: string;
					name: string | null;
					createdAt: Date;
				}) => ({
					...donation,
					date: formatRelativeTime(donation.createdAt),
				}),
			),
			programCategories: programCategories.map(
				(category: { name: string; _count: { programs: number } }) => ({
					name: category.name,
					count: category._count.programs,
				}),
			),
			recentEvents: recentEvents.map(
				(event: {
					id: string;
					title: string;
					startDate: Date;
					location: string | null;
					_count: { attendees: number };
				}) => ({
					id: event.id,
					title: event.title,
					date: event.startDate.toLocaleDateString(),
					location: event.location || "", // Default to empty string if null
					attendees: event._count.attendees,
				}),
			),
			recentMessages: recentMessages.map(
				(message: {
					id: string;
					name: string;
					email: string;
					subject: string | null;
					createdAt: Date;
				}) => ({
					id: message.id,
					name: message.name,
					email: message.email,
					subject: message.subject || "", // Default to empty string if null
					date: formatRelativeTime(message.createdAt),
				}),
			),
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
