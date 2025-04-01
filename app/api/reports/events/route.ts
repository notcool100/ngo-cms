import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { stringify } from "csv-stringify/sync";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/api-permissions";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user has permission to download reports
		const permissionCheck = await checkPermission(session, "download:reports");
		if (!permissionCheck.success) {
			return permissionCheck.response;
		}

		// Parse query parameters
		const url = new URL(req.url);
		const format = url.searchParams.get("format") || "json";
		const startDate = url.searchParams.get("startDate")
			? new Date(url.searchParams.get("startDate") as string)
			: new Date(new Date().getFullYear(), 0, 1); // Default to start of year
		const endDate = url.searchParams.get("endDate")
			? new Date(url.searchParams.get("endDate") as string)
			: new Date(new Date().getFullYear(), 11, 31); // Default to end of year

		// Query events
		const events = await prisma.event.findMany({
			where: {
				startDate: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: {
				startDate: "asc",
			},
			select: {
				id: true,
				title: true,
				description: true,
				startDate: true,
				endDate: true,
				location: true,
				published: true,
				_count: {
					select: {
						attendees: true,
					},
				},
			},
		});

		// Format data for export
		const formattedEvents = events.map((event) => ({
			id: event.id,
			title: event.title,
			description: event.description || "",
			startDate: event.startDate.toISOString().split("T")[0],
			startTime: event.startDate.toISOString().split("T")[1].split(".")[0],
			endDate: event.endDate?.toISOString().split("T")[0] || "",
			endTime: event.endDate?.toISOString().split("T")[1].split(".")[0] || "",
			location: event.location || "",
			published: event.published ? "Yes" : "No",
			attendees: event._count.attendees,
		}));

		// Return data in requested format
		if (format === "csv") {
			const csv = stringify(formattedEvents, {
				header: true,
				columns: [
					"id",
					"title",
					"description",
					"startDate",
					"startTime",
					"endDate",
					"endTime",
					"location",
					"published",
					"attendees",
				],
			});

			return new NextResponse(csv, {
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="events-report-${new Date().toISOString().split("T")[0]}.csv"`,
				},
			});
		}

		return NextResponse.json(formattedEvents);
	} catch (error) {
		console.error("Error generating events report:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 },
		);
	}
}
