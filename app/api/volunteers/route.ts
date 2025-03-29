import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for volunteer validation
const volunteerSchema = z.object({
	firstName: z.string().min(2).max(50),
	lastName: z.string().min(2).max(50),
	email: z.string().email(),
	phone: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	skills: z.string().optional(),
	availability: z.string().optional(),
	motivation: z.string().optional(),
});

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const status = searchParams.get("status");
		const search = searchParams.get("search") || "";
		const page = Number(searchParams.get("page") || "1");
		const limit = Number(searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		const where: any = {};

		if (status) where.status = status;
		if (search) {
			where.OR = [
				{ firstName: { contains: search, mode: "insensitive" } },
				{ lastName: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ skills: { contains: search, mode: "insensitive" } },
			];
		}

		const [volunteers, total] = await Promise.all([
			prisma.volunteer.findMany({
				where,
				take: limit,
				skip,
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.volunteer.count({ where }),
		]);

		return NextResponse.json({
			volunteers,
			pagination: {
				total,
				pages: Math.ceil(total / limit),
				page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching volunteers:", error);
		return NextResponse.json(
			{ error: "Failed to fetch volunteers" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = volunteerSchema.parse(body);

		// Check if volunteer with this email already exists
		const existingVolunteer = await prisma.volunteer.findUnique({
			where: {
				email: validatedData.email,
			},
		});

		if (existingVolunteer) {
			return NextResponse.json(
				{ error: "A volunteer with this email already exists" },
				{ status: 400 },
			);
		}

		const volunteer = await prisma.volunteer.create({
			data: validatedData,
		});

		return NextResponse.json(volunteer, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error creating volunteer:", error);
		return NextResponse.json(
			{ error: "Failed to submit volunteer application" },
			{ status: 500 },
		);
	}
}
