import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const slug = searchParams.get("slug");
		const featured = searchParams.get("featured") === "true";
		const limit = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!)
			: undefined;

		if (id) {
			const pressRelease = await prisma.pressRelease.findUnique({
				where: { id },
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
			});

			if (!pressRelease) {
				return NextResponse.json(
					{ error: "Press release not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json(pressRelease);
		}

		if (slug) {
			const pressRelease = await prisma.pressRelease.findUnique({
				where: { slug },
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
			});

			if (!pressRelease) {
				return NextResponse.json(
					{ error: "Press release not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json(pressRelease);
		}

		// Build the where clause based on parameters
		const where: any = {
			published: true,
		};

		if (featured) {
			where.featured = true;
		}

		const pressReleases = await prisma.pressRelease.findMany({
			where,
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: {
				publishedAt: "desc",
			},
			take: limit,
		});

		return NextResponse.json(pressReleases);
	} catch (error) {
		console.error("Error fetching press releases:", error);
		return NextResponse.json(
			{ error: "Failed to fetch press releases" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "manage:press-releases")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await request.json();
		const { title, slug, content, excerpt, image, featured, published } = data;

		// Validate required fields
		if (!title || !slug || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if slug already exists
		const existingPressRelease = await prisma.pressRelease.findUnique({
			where: { slug },
		});

		if (existingPressRelease) {
			return NextResponse.json(
				{ error: "Slug already exists" },
				{ status: 400 },
			);
		}

		// Create the press release
		const pressRelease = await prisma.pressRelease.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				image,
				featured: featured || false,
				published: published || false,
				publishedAt: published ? new Date() : null,
				authorId: session.user.id,
			},
		});

		return NextResponse.json(pressRelease, { status: 201 });
	} catch (error) {
		console.error("Error creating press release:", error);
		return NextResponse.json(
			{ error: "Failed to create press release" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "manage:press-releases")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await request.json();
		const { id, title, slug, content, excerpt, image, featured, published } =
			data;

		// Validate required fields
		if (!id || !title || !slug || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if press release exists
		const existingPressRelease = await prisma.pressRelease.findUnique({
			where: { id },
		});

		if (!existingPressRelease) {
			return NextResponse.json(
				{ error: "Press release not found" },
				{ status: 404 },
			);
		}

		// Check if slug already exists (for a different press release)
		if (slug !== existingPressRelease.slug) {
			const slugExists = await prisma.pressRelease.findUnique({
				where: { slug },
			});

			if (slugExists) {
				return NextResponse.json(
					{ error: "Slug already exists" },
					{ status: 400 },
				);
			}
		}

		// Update the press release
		const pressRelease = await prisma.pressRelease.update({
			where: { id },
			data: {
				title,
				slug,
				content,
				excerpt,
				image,
				featured: featured || false,
				published: published || false,
				publishedAt:
					published && !existingPressRelease.published
						? new Date()
						: existingPressRelease.publishedAt,
			},
		});

		return NextResponse.json(pressRelease);
	} catch (error) {
		console.error("Error updating press release:", error);
		return NextResponse.json(
			{ error: "Failed to update press release" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "manage:press-releases")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Press release ID is required" },
				{ status: 400 },
			);
		}

		// Check if press release exists
		const existingPressRelease = await prisma.pressRelease.findUnique({
			where: { id },
		});

		if (!existingPressRelease) {
			return NextResponse.json(
				{ error: "Press release not found" },
				{ status: 404 },
			);
		}

		// Delete the press release
		await prisma.pressRelease.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting press release:", error);
		return NextResponse.json(
			{ error: "Failed to delete press release" },
			{ status: 500 },
		);
	}
}
