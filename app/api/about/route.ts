import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aboutSections, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	try {
		// Get query parameters
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type");

		// Fetch about sections
		let sections = [];
		if (type) {
			sections = await db
				.select()
				.from(aboutSections)
				.where(eq(aboutSections.type, type))
				.where(eq(aboutSections.active, true))
				.orderBy(aboutSections.order);
		} else {
			sections = await db
				.select()
				.from(aboutSections)
				.where(eq(aboutSections.active, true))
				.orderBy(aboutSections.order);
		}

		// Fetch team members
		const team = await db
			.select()
			.from(teamMembers)
			.where(eq(teamMembers.active, true))
			.orderBy(teamMembers.order);

		return NextResponse.json({
			sections,
			team,
		});
	} catch (error) {
		console.error("Error fetching about data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch about data" },
			{ status: 500 },
		);
	}
}
