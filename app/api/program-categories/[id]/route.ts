import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for program category update validation
const categoryUpdateSchema = z.object({
	name: z.string().min(2).max(100).optional(),
	slug: z.string().min(2).max(100).optional(),
	description: z.string().optional(),
});

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const category = await prisma.programCategory.findUnique({
			where: {
				id: params.id,
			},
			include: {
				programs: true,
			},
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(category);
	} catch (error) {
		console.error("Error fetching category:", error);
		return NextResponse.json(
			{ error: "Failed to fetch category" },
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
		const validatedData = categoryUpdateSchema.parse(body);

		// If slug is being updated, check if it already exists
		if (validatedData.slug) {
			const existingCategory = await prisma.programCategory.findFirst({
				where: {
					slug: validatedData.slug,
					NOT: {
						id: params.id,
					},
				},
			});

			if (existingCategory) {
				return NextResponse.json(
					{ error: "A category with this slug already exists" },
					{ status: 400 },
				);
			}
		}

		const category = await prisma.programCategory.update({
			where: {
				id: params.id,
			},
			data: validatedData,
		});

		return NextResponse.json(category);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error updating category:", error);
		return NextResponse.json(
			{ error: "Failed to update category" },
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

		// Check if category has programs
		const category = await prisma.programCategory.findUnique({
			where: {
				id: params.id,
			},
			include: {
				_count: {
					select: {
						programs: true,
					},
				},
			},
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 },
			);
		}

		if (category._count.programs > 0) {
			return NextResponse.json(
				{
					error:
						"Cannot delete category with associated programs. Please reassign or delete the programs first.",
				},
				{ status: 400 },
			);
		}

		await prisma.programCategory.delete({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting category:", error);
		return NextResponse.json(
			{ error: "Failed to delete category" },
			{ status: 500 },
		);
	}
}
