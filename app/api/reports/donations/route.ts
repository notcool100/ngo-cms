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

		// Query donations
		const donations = await prisma.donation.findMany({
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
				amount: true,
				currency: true,
				status: true,
				createdAt: true,
				message: true,
				program: {
					select: {
						title: true,
					},
				},
			},
		});

		// Format data for export
		const formattedDonations = donations.map((donation) => ({
			id: donation.id,
			name: donation.name,
			email: donation.email,
			amount: donation.amount,
			currency: donation.currency,
			status: donation.status,
			date: donation.createdAt.toISOString().split("T")[0],
			time: donation.createdAt.toISOString().split("T")[1].split(".")[0],
			message: donation.message || "",
			program: donation.program?.title || "General Donation",
		}));

		// Return data in requested format
		if (format === "csv") {
			const csv = stringify(formattedDonations, {
				header: true,
				columns: [
					"id",
					"name",
					"email",
					"amount",
					"currency",
					"status",
					"date",
					"time",
					"message",
					"program",
				],
			});

			return new NextResponse(csv, {
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="donations-report-${new Date().toISOString().split("T")[0]}.csv"`,
				},
			});
		}

		return NextResponse.json(formattedDonations);
	} catch (error) {
		console.error("Error generating donations report:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 },
		);
	}
}
