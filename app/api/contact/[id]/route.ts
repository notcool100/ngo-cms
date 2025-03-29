import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for contact update validation
const contactUpdateSchema = z.object({
	status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED"]).optional(),
});

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const message = await prisma.contact.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!message) {
			return NextResponse.json({ error: "Message not found" }, { status: 404 });
		}

		return NextResponse.json(message);
	} catch (error) {
		console.error("Error fetching message:", error);
		return NextResponse.json(
			{ error: "Failed to fetch message" },
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
		const validatedData = contactUpdateSchema.parse(body);

		const message = await prisma.contact.update({
			where: {
				id: params.id,
			},
			data: validatedData,
		});

		return NextResponse.json(message);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error updating message:", error);
		return NextResponse.json(
			{ error: "Failed to update message" },
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

		await prisma.contact.delete({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting message:", error);
		return NextResponse.json(
			{ error: "Failed to delete message" },
			{ status: 500 },
		);
	}
}
