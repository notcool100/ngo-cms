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
		const type = searchParams.get("type");
		const limit = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!)
			: undefined;
		const featured = searchParams.get("featured") === "true";

		if (id) {
			const publication = await prisma.publication.findUnique({
				where: { id },
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
					category: true,
					tags: true,
				},
			});

			if (!publication) {
				return NextResponse.json(
					{ error: "Publication not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json(publication);
		}

		if (slug) {
			const publication = await prisma.publication.findUnique({
				where: { slug },
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
					category: true,
					tags: true,
				},
			});

			if (!publication) {
				return NextResponse.json(
					{ error: "Publication not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json(publication);
		}

		// Build the where clause based on parameters
		const where: any = {
			published: true,
		};

		if (type) {
			where.type = type;
		}

		if (featured) {
			where.featured = true;
		}

		const publications = await prisma.publication.findMany({
			where,
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				category: true,
				tags: true,
			},
			orderBy: {
				publishedAt: "desc",
			},
			take: limit,
		});

		return NextResponse.json(publications);
	} catch (error) {
		console.error("Error fetching publications:", error);
		return NextResponse.json(
			{ error: "Failed to fetch publications" },
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
		if (!hasPermission(userRole, "manage:publications")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await request.json();
		const {
			title,
			slug,
			description,
			fileUrl,
			coverImage,
			featured,
			published,
			categoryId,
			tags,
			type,
		} = data;

		// Validate required fields
		if (!title || !slug || !description || !fileUrl) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if slug already exists
		const existingPublication = await prisma.publication.findUnique({
			where: { slug },
		});

		if (existingPublication) {
			return NextResponse.json(
				{ error: "Slug already exists" },
				{ status: 400 },
			);
		}

		// Create the publication
		const publication = await prisma.publication.create({
			data: {
				title,
				slug,
				description,
				fileUrl,
				coverImage,
				featured: featured || false,
				published: published || false,
				publishedAt: published ? new Date() : null,
				authorId: session.user.id,
				categoryId,
				type: type || "BOOK",
				tags: tags
					? {
							connect: tags.map((tagId: string) => ({ id: tagId })),
						}
					: undefined,
			},
		});

		return NextResponse.json(publication, { status: 201 });
	} catch (error) {
		console.error("Error creating publication:", error);
		return NextResponse.json(
			{ error: "Failed to create publication" },
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
		if (!hasPermission(userRole, "manage:publications")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await request.json();
		const {
			id,
			title,
			slug,
			description,
			fileUrl,
			coverImage,
			featured,
			published,
			categoryId,
			tags,
			type,
		} = data;

		// Validate required fields
		if (!id || !title || !slug || !description || !fileUrl) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if publication exists
		const existingPublication = await prisma.publication.findUnique({
			where: { id },
			include: { tags: true },
		});

		if (!existingPublication) {
			return NextResponse.json(
				{ error: "Publication not found" },
				{ status: 404 },
			);
		}

		// Check if slug already exists (for a different publication)
		if (slug !== existingPublication.slug) {
			const slugExists = await prisma.publication.findUnique({
				where: { slug },
			});

			if (slugExists) {
				return NextResponse.json(
					{ error: "Slug already exists" },
					{ status: 400 },
				);
			}
		}

		// Update the publication
		const publication = await prisma.publication.update({
			where: { id },
			data: {
				title,
				slug,
				description,
				fileUrl,
				coverImage,
				featured: featured || false,
				published: published || false,
				publishedAt:
					published && !existingPublication.published
						? new Date()
						: existingPublication.publishedAt,
				categoryId,
				type,
				tags: {
					disconnect: existingPublication.tags.map((tag) => ({ id: tag.id })),
					connect: tags ? tags.map((tagId: string) => ({ id: tagId })) : [],
				},
			},
		});

		return NextResponse.json(publication);
	} catch (error) {
		console.error("Error updating publication:", error);
		return NextResponse.json(
			{ error: "Failed to update publication" },
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
		if (!hasPermission(userRole, "manage:publications")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Publication ID is required" },
				{ status: 400 },
			);
		}

		// Check if publication exists
		const existingPublication = await prisma.publication.findUnique({
			where: { id },
		});

		if (!existingPublication) {
			return NextResponse.json(
				{ error: "Publication not found" },
				{ status: 404 },
			);
		}

		// Delete the publication
		await prisma.publication.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting publication:", error);
		return NextResponse.json(
			{ error: "Failed to delete publication" },
			{ status: 500 },
		);
	}
}
