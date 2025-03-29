import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for contact validation
const contactSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email(),
	phone: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().min(10),
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
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ subject: { contains: search, mode: "insensitive" } },
				{ message: { contains: search, mode: "insensitive" } },
			];
		}

		const [messages, total] = await Promise.all([
			prisma.contact.findMany({
				where,
				take: limit,
				skip,
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.contact.count({ where }),
		]);

		return NextResponse.json({
			messages,
			pagination: {
				total,
				pages: Math.ceil(total / limit),
				page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching contact messages:", error);
		return NextResponse.json(
			{ error: "Failed to fetch contact messages" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = contactSchema.parse(body);

		const contact = await prisma.contact.create({
			data: validatedData,
		});

		// In a real implementation, you might want to send an email notification here

		return NextResponse.json(contact, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error creating contact message:", error);
		return NextResponse.json(
			{ error: "Failed to submit contact message" },
			{ status: 500 },
		);
	}
}
