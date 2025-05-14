import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PublicationType } from "@prisma/client";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const slug = searchParams.get("slug");
		const type = searchParams.get("type") as PublicationType | null;
		const limit = searchParams.get("limit")
			? Number.parseInt(searchParams.get("limit") ?? "10", 10)
			: undefined;
		const featured = searchParams.get("featured") === "true";
		const categoryId = searchParams.get("categoryId") || undefined;
		const admin = searchParams.get("admin") === "true";

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
		const where = {
			...(admin ? {} : { published: true }),
			...(type && { type }),
			...(featured && { featured: true }),
			...(categoryId && { categoryId }),
		};

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
		const body = await request.json();

		const {
			title,
			description,
			fileUrl,
			coverImage,
			type,
			featured,
			published,
			categoryId,
			authorId,
		} = body;

		if (!title) {
			return NextResponse.json({ error: "Title is required" }, { status: 400 });
		}

		if (!description) {
			return NextResponse.json(
				{ error: "Description is required" },
				{ status: 400 },
			);
		}

		if (!fileUrl) {
			return NextResponse.json(
				{ error: "File URL is required" },
				{ status: 400 },
			);
		}

		if (!type) {
			return NextResponse.json({ error: "Type is required" }, { status: 400 });
		}

		if (!authorId) {
			return NextResponse.json(
				{ error: "Author is required" },
				{ status: 400 },
			);
		}

		// Check if author exists
		const author = await prisma.user.findUnique({
			where: { id: authorId },
		});

		if (!author) {
			return NextResponse.json(
				{ error: "Selected author not found" },
				{ status: 400 },
			);
		}

		// Check if slug already exists
		const existingPublication = await prisma.publication.findUnique({
			where: {
				slug: title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, ""),
			},
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
				slug: title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, ""),
				description,
				fileUrl,
				coverImage,
				type,
				featured: featured || false,
				published: published || false,
				publishedAt: published ? new Date() : null,
				authorId,
				categoryId,
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
		const data = await request.json();
		const {
			slug: currentSlug,
			title,
			description,
			fileUrl,
			coverImage,
			featured,
			published,
			categoryId,
			tags,
			type,
			authorId,
		} = data;

		// Validate required fields
		if (!currentSlug || !title || !description || !fileUrl || !authorId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if publication exists
		const existingPublication = await prisma.publication.findUnique({
			where: { slug: currentSlug },
			include: { tags: true },
		});

		if (!existingPublication) {
			return NextResponse.json(
				{ error: "Publication not found" },
				{ status: 404 },
			);
		}

		// Check if author exists
		const author = await prisma.user.findUnique({
			where: { id: authorId },
		});

		if (!author) {
			return NextResponse.json(
				{ error: "Selected author not found" },
				{ status: 400 },
			);
		}

		// Generate new slug from title
		const newSlug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

		// Check if new slug already exists (for a different publication)
		if (newSlug !== currentSlug) {
			const slugExists = await prisma.publication.findUnique({
				where: { slug: newSlug },
			});

			if (slugExists) {
				return NextResponse.json(
					{ error: "Title would create a duplicate slug" },
					{ status: 400 },
				);
			}
		}

		// Update the publication
		const publication = await prisma.publication.update({
			where: { slug: currentSlug },
			data: {
				title,
				slug: newSlug,
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
				authorId,
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
