import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/api-permissions";

// Schema for user creation
const userCreateSchema = z.object({
	role: z.enum(["ADMIN", "USER", "EDITOR"]),
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
});

export async function GET() {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const permissionCheck = await checkPermission("manage:users");

		if (!permissionCheck.hasPermission) {
			return permissionCheck.response;
		}

		const body = await req.json();
		const validatedData = userCreateSchema.parse(body);

		// Check if user with this email already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: validatedData.email,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 400 },
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(validatedData.password, 10);

		const user = await prisma.user.create({
			data: {
				name: validatedData.name,
				email: validatedData.email,
				password: hashedPassword,
				role: validatedData.role,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error creating user:", error);
		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 },
		);
	}
}
