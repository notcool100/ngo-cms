import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";

// Schema for attendee validation
const attendeeSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email(),
	phone: z.string().optional(),
});

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const attendees = await prisma.attendee.findMany({
			where: {
				eventId: params.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(attendees);
	} catch (error) {
		console.error("Error fetching attendees:", error);
		return NextResponse.json(
			{ error: "Failed to fetch attendees" },
			{ status: 500 },
		);
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const body = await req.json();
		const validatedData = attendeeSchema.parse(body);

		// Check if the event exists
		const event = await prisma.event.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		// Check if attendee already registered
		const existingAttendee = await prisma.attendee.findFirst({
			where: {
				eventId: params.id,
				email: validatedData.email,
			},
		});

		if (existingAttendee) {
			return NextResponse.json(
				{ error: "You are already registered for this event" },
				{ status: 400 },
			);
		}

		const attendee = await prisma.attendee.create({
			data: {
				...validatedData,
				eventId: params.id,
			},
		});

		return NextResponse.json(attendee, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error registering for event:", error);
		return NextResponse.json(
			{ error: "Failed to register for event" },
			{ status: 500 },
		);
	}
}
