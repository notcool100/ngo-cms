import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Schema for attendee status update
const attendeeUpdateSchema = z.object({
	status: z.enum(["REGISTERED", "CONFIRMED", "CANCELLED", "ATTENDED"]),
});

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string; attendeeId: string } },
) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validatedData = attendeeUpdateSchema.parse(body);

		// Check if the event exists
		const event = await prisma.event.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		// Check if the attendee exists
		const attendee = await prisma.attendee.findUnique({
			where: {
				id: params.attendeeId,
				eventId: params.id,
			},
		});

		if (!attendee) {
			return NextResponse.json(
				{ error: "Attendee not found" },
				{ status: 404 },
			);
		}

		// Update the attendee status
		const updatedAttendee = await prisma.attendee.update({
			where: {
				id: params.attendeeId,
			},
			data: {
				status: validatedData.status,
			},
		});

		return NextResponse.json(updatedAttendee);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error updating attendee:", error);
		return NextResponse.json(
			{ error: "Failed to update attendee" },
			{ status: 500 },
		);
	}
}

// Also allow DELETE to remove an attendee
export async function DELETE(
	req: Request,
	{ params }: { params: { id: string; attendeeId: string } },
) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if the attendee exists
		const attendee = await prisma.attendee.findUnique({
			where: {
				id: params.attendeeId,
				eventId: params.id,
			},
		});

		if (!attendee) {
			return NextResponse.json(
				{ error: "Attendee not found" },
				{ status: 404 },
			);
		}

		// Delete the attendee
		await prisma.attendee.delete({
			where: {
				id: params.attendeeId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting attendee:", error);
		return NextResponse.json(
			{ error: "Failed to delete attendee" },
			{ status: 500 },
		);
	}
}
