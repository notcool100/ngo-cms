import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";

// Schema for newsletter subscription validation
const newsletterSchema = z.object({
	email: z.string().email(),
});

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const active = searchParams.get("active") === "true";
		const search = searchParams.get("search") || "";
		const page = Number(searchParams.get("page") || "1");
		const limit = Number(searchParams.get("limit") || "50");
		const skip = (page - 1) * limit;

		const where: any = {};

		if (active !== null) where.active = active;
		if (search) {
			where.email = { contains: search, mode: "insensitive" };
		}

		const [subscribers, total] = await Promise.all([
			prisma.newsletter.findMany({
				where,
				take: limit,
				skip,
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.newsletter.count({ where }),
		]);

		return NextResponse.json({
			subscribers,
			pagination: {
				total,
				pages: Math.ceil(total / limit),
				page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching newsletter subscribers:", error);
		return NextResponse.json(
			{ error: "Failed to fetch newsletter subscribers" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email } = newsletterSchema.parse(body);

		// Check if email already exists
		const existingSubscription = await prisma.newsletter.findUnique({
			where: {
				email,
			},
		});

		if (existingSubscription) {
			// If subscription exists but is inactive, reactivate it
			if (!existingSubscription.active) {
				await prisma.newsletter.update({
					where: { email },
					data: { active: true },
				});
				return NextResponse.json({ message: "Subscription reactivated" });
			}

			return NextResponse.json(
				{ message: "Email already subscribed" },
				{ status: 200 },
			);
		}

		// Create new subscription
		await prisma.newsletter.create({
			data: {
				email,
				active: true,
			},
		});

		return NextResponse.json(
			{ message: "Successfully subscribed to newsletter" },
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error subscribing to newsletter:", error);
		return NextResponse.json(
			{ error: "Failed to subscribe to newsletter" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Check if subscription exists
		const subscription = await prisma.newsletter.findUnique({
			where: {
				email,
			},
		});

		if (!subscription) {
			return NextResponse.json(
				{ error: "Subscription not found" },
				{ status: 404 },
			);
		}

		// Instead of deleting, mark as inactive
		await prisma.newsletter.update({
			where: {
				email,
			},
			data: {
				active: false,
			},
		});

		return NextResponse.json({ message: "Successfully unsubscribed" });
	} catch (error) {
		console.error("Error unsubscribing from newsletter:", error);
		return NextResponse.json(
			{ error: "Failed to unsubscribe from newsletter" },
			{ status: 500 },
		);
	}
}
