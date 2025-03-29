import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for program category validation
const categorySchema = z.object({
	name: z.string().min(2).max(100),
	slug: z.string().min(2).max(100),
	description: z.string().optional(),
});

export async function GET(req: Request) {
	try {
		const categories = await prisma.programCategory.findMany({
			include: {
				_count: {
					select: {
						programs: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.error("Error fetching program categories:", error);
		return NextResponse.json(
			{ error: "Failed to fetch program categories" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validatedData = categorySchema.parse(body);

		// Check if slug already exists
		const existingCategory = await prisma.programCategory.findUnique({
			where: { slug: validatedData.slug },
		});

		if (existingCategory) {
			return NextResponse.json(
				{ error: "A category with this slug already exists" },
				{ status: 400 },
			);
		}

		const category = await prisma.programCategory.create({
			data: validatedData,
		});

		return NextResponse.json(category, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error creating program category:", error);
		return NextResponse.json(
			{ error: "Failed to create program category" },
			{ status: 500 },
		);
	}
}
