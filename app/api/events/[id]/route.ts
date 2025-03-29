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

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const event = await prisma.event.findUnique({
			where: { id: params.id },
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
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		return NextResponse.json(event);
	} catch (error) {
		console.error("Error fetching event:", error);
		return NextResponse.json(
			{ error: "Failed to fetch event" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validatedData = eventSchema.parse(body);

		// Check if slug already exists and is not the current event
		const existingEvent = await prisma.event.findFirst({
			where: {
				slug: validatedData.slug,
				id: { not: params.id },
			},
		});

		if (existingEvent) {
			return NextResponse.json(
				{ error: "An event with this slug already exists" },
				{ status: 400 },
			);
		}

		const event = await prisma.event.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(event);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error updating event:", error);
		return NextResponse.json(
			{ error: "Failed to update event" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if event exists
		const event = await prisma.event.findUnique({
			where: { id: params.id },
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		// Delete event
		await prisma.event.delete({
			where: { id: params.id },
		});

		return NextResponse.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);
		return NextResponse.json(
			{ error: "Failed to delete event" },
			{ status: 500 },
		);
	}
}
