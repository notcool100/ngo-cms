import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for event validation
const eventSchema = z.object({
	title: z.string().min(3).max(255),
	slug: z.string().min(3).max(255),
	description: z.string().min(10),
	content: z.string().min(10),
	location: z.string().optional(),
	startDate: z.string().transform((str) => new Date(str)),
	endDate: z
		.string()
		.transform((str) => new Date(str))
		.optional(),
	image: z.string().optional(),
	featured: z.boolean().default(false),
	published: z.boolean().default(false),
});

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const featured = searchParams.get("featured") === "true";
		const published = searchParams.get("published") === "true";
		const upcoming = searchParams.get("upcoming") === "true";
		const search = searchParams.get("search") || "";
		const page = Number(searchParams.get("page") || "1");
		const limit = Number(searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		const where: any = {};

		if (featured) where.featured = true;
		if (published) where.published = true;
		if (upcoming) {
			where.startDate = {
				gt: new Date(),
			};
			where.OR = [
				{ endDate: null }, // If no end date is specified, consider it as ongoing
				{ endDate: { gt: new Date() } }, // Ensure end date is in the future
			];
		}
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
				{ location: { contains: search, mode: "insensitive" } },
			];
		}

		const [events, total] = await Promise.all([
			prisma.event.findMany({
				where,
				take: limit,
				skip,
				include: {
					organizer: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
					_count: {
						select: {
							attendees: true,
						},
					},
				},
				orderBy: {
					startDate: "asc",
				},
			}),
			prisma.event.count({ where }),
		]);

		return NextResponse.json({
			events,
			pagination: {
				total,
				pages: Math.ceil(total / limit),
				page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching events:", error);
		return NextResponse.json(
			{ error: "Failed to fetch events" },
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
		const validatedData = eventSchema.parse(body);
        console.log(validatedData," this is valid data");

		// Check if slug already exists
		const existingEvent = await prisma.event.findUnique({
			where: { slug: validatedData.slug },
		});

		if (existingEvent) {
			return NextResponse.json(
				{ error: "An event with this slug already exists" },
				{ status: 400 },
			);
		}

		const event = await prisma.event.create({
			data: {
				...validatedData,
				organizer: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});

		return NextResponse.json(event, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error creating event:", error);
		return NextResponse.json(
			{ error: "Failed to create event" },
			{ status: 500 },
		);
	}
}
