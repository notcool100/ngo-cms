import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories - Get all categories
export async function GET(req: NextRequest) {
	try {
		const categories = await prisma.category.findMany({
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 },
		);
	}
}
