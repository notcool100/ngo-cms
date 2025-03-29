import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";

// Schema for attendee validation
const attendeeSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().optional(),
});

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const body = await req.json();
		const validatedData = attendeeSchema.parse(body);

		// Find the event by id
		const event = await prisma.event.findUnique({
			where: { slug: params.id },
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		// Check if event is in the past
		if (new Date(event.startDate) < new Date()) {
			return NextResponse.json(
				{ error: "Cannot register for past events" },
				{ status: 400 },
			);
		}

		// Check if attendee already registered
		const existingAttendee = await prisma.attendee.findFirst({
			where: {
				email: validatedData.email,
				eventId: event.id,
			},
		});

		if (existingAttendee) {
			return NextResponse.json(
				{ error: "You are already registered for this event" },
				{ status: 400 },
			);
		}

		// Create attendee
		const attendee = await prisma.attendee.create({
			data: {
				name: validatedData.name,
				email: validatedData.email,
				phone: validatedData.phone,
				status: "REGISTERED",
				event: {
					connect: {
						id: event.id,
					},
				},
			},
		});

		// TODO: Send confirmation email to attendee

		return NextResponse.json(
			{ message: "Registration successful", attendeeId: attendee.id },
			{ status: 201 },
		);
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
