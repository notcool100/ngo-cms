import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for donation update validation
const donationUpdateSchema = z.object({
	status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
	transactionId: z.string().optional(),
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

		const donation = await prisma.donation.findUnique({
			where: {
				id: params.id,
			},
			include: {
				program: true,
			},
		});

		if (!donation) {
			return NextResponse.json(
				{ error: "Donation not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(donation);
	} catch (error) {
		console.error("Error fetching donation:", error);
		return NextResponse.json(
			{ error: "Failed to fetch donation" },
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
		const validatedData = donationUpdateSchema.parse(body);

		const donation = await prisma.donation.update({
			where: {
				id: params.id,
			},
			data: validatedData,
		});

		return NextResponse.json(donation);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error updating donation:", error);
		return NextResponse.json(
			{ error: "Failed to update donation" },
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

		await prisma.donation.delete({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting donation:", error);
		return NextResponse.json(
			{ error: "Failed to delete donation" },
			{ status: 500 },
		);
	}
}
