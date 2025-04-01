import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for program validation
const programSchema = z.object({
	title: z.string().min(3).max(255),
	slug: z.string().min(3).max(255),
	description: z.string().min(10),
	content: z.string().min(10),
	image: z.string().optional(),
	featured: z.boolean().default(false),
	active: z.boolean().default(true),
	categoryId: z.string(),
});

// Make sure the response is always an array
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const active = searchParams.get("active") === "true";
		const categoryId = searchParams.get("categoryId");
		const featured = searchParams.get("featured");
		const limit = searchParams.get("limit")
			? Number.parseInt(searchParams.get("limit")!)
			: undefined;
		const search = searchParams.get("search") || undefined;

		const where: any = {};

		if (searchParams.has("active")) {
			where.active = active;
		}

		if (categoryId) {
			where.categoryId = categoryId;
		}

		if (featured !== null) {
			where.featured = featured === "true";
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		const programs = await prisma.program.findMany({
			where,
			include: {
				category: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit,
		});

		return NextResponse.json(programs);
	} catch (error) {
		console.error("Error fetching programs:", error);
		return NextResponse.json([], { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validatedData = programSchema.parse(body);

		// Check if slug already exists
		const existingProgram = await prisma.program.findUnique({
			where: { slug: validatedData.slug },
		});

		if (existingProgram) {
			return NextResponse.json(
				{ error: "A program with this slug already exists" },
				{ status: 400 },
			);
		}

		const program = await prisma.program.create({
			data: validatedData,
		});

		return NextResponse.json(program, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error creating program:", error);
		return NextResponse.json(
			{ error: "Failed to create program" },
			{ status: 500 },
		);
	}
}
