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
			: new Date(); // Default to today

		// Query volunteers
		const volunteers = await prisma.volunteer.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				skills: true,
				availability: true,
				createdAt: true,
				status: true,
			},
		});

		// Format data for export
		const formattedVolunteers = volunteers.map((volunteer) => ({
			id: volunteer.id,
			name: volunteer.name,
			email: volunteer.email,
			phone: volunteer.phone || "",
			skills: volunteer.skills || "",
			availability: volunteer.availability || "",
			status: volunteer.status,
			date: volunteer.createdAt.toISOString().split("T")[0],
			time: volunteer.createdAt.toISOString().split("T")[1].split(".")[0],
		}));

		// Return data in requested format
		if (format === "csv") {
			const csv = stringify(formattedVolunteers, {
				header: true,
				columns: [
					"id",
					"name",
					"email",
					"phone",
					"skills",
					"availability",
					"status",
					"date",
					"time",
				],
			});

			return new NextResponse(csv, {
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="volunteers-report-${new Date().toISOString().split("T")[0]}.csv"`,
				},
			});
		}

		return NextResponse.json(formattedVolunteers);
	} catch (error) {
		console.error("Error generating volunteers report:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 },
		);
	}
}
