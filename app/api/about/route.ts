import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
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
			sections = await db.aboutSection.findMany({

				where: {
                    type: type,
                    active: true,
                },
                orderBy: {
                    order: "asc",
                },
            });
			
		} else {
			sections = await db.aboutSection.findMany({
                where: {
                    active: true,
                },
                orderBy: {
                    order: "asc",
                },
            });
		}

		// Fetch team members
		const team = await db.teamMember.findMany({
            where: {
				active: true,
            },
            orderBy: {
                order: "asc",
            },
        });

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
