import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// GET /api/media/[id] - Get a specific media item
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if the ID is a slug or an actual ID
		const isSlug = !id.includes("-");

		let media;
		if (isSlug) {
			// Fetch by ID
			media = await prisma.media.findUnique({
				where: { id },
				include: {
					author: {
						select: {
							name: true,
						},
					},
					category: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			});
		} else {
			// Fetch by slug
			media = await prisma.media.findUnique({
				where: { slug: id },
				include: {
					author: {
						select: {
							name: true,
						},
					},
					category: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			});
		}

		if (!media) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// For public requests, only return published media
		if (!session && !media.published) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// For admin/editor requests, return the media
		if (
			session?.user?.role === "ADMIN" ||
			session?.user?.role === "EDITOR" ||
			hasPermission(session, "manage:media") ||
			media.published
		) {
			return NextResponse.json(media);
		}

		// For other authenticated users, only return published media
		if (!media.published) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		return NextResponse.json(media);
	} catch (error) {
		console.error("Error fetching media:", error);
		return NextResponse.json(
			{ error: "Failed to fetch media" },
			{ status: 500 },
		);
	}
}

// PUT /api/media/[id] - Update a media item
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and has permission
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			session.user.role !== "ADMIN" &&
			session.user.role !== "EDITOR" &&
			!hasPermission(session, "manage:media")
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await req.json();

		// Check if the media exists
		const existingMedia = await prisma.media.findUnique({
			where: { id },
		});

		if (!existingMedia) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// Update the media item
		const media = await prisma.media.update({
			where: { id },
			data: {
				title: data.title,
				slug: data.slug,
				description: data.description,
				mediaUrl: data.mediaUrl,
				mediaType: data.mediaType,
				thumbnail: data.thumbnail || null,
				featured: data.featured,
				published: data.published,
				publishedAt:
					data.published && !existingMedia.published
						? new Date()
						: existingMedia.publishedAt,
				categoryId: data.categoryId || null,
			},
		});

		return NextResponse.json(media);
	} catch (error) {
		console.error("Error updating media:", error);

		// Check for duplicate slug error
		if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
			return NextResponse.json(
				{ error: "A media item with this slug already exists" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to update media" },
			{ status: 500 },
		);
	}
}

// PATCH /api/media/[id] - Partially update a media item
export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and has permission
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			session.user.role !== "ADMIN" &&
			session.user.role !== "EDITOR" &&
			!hasPermission(session, "manage:media")
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await req.json();

		// Check if the media exists
		const existingMedia = await prisma.media.findUnique({
			where: { id },
		});

		if (!existingMedia) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// Update the media item with only the provided fields
		const media = await prisma.media.update({
			where: { id },
			data,
		});

		return NextResponse.json(media);
	} catch (error) {
		console.error("Error updating media:", error);
		return NextResponse.json(
			{ error: "Failed to update media" },
			{ status: 500 },
		);
	}
}

// DELETE /api/media/[id] - Delete a media item
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and has permission
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			session.user.role !== "ADMIN" &&
			session.user.role !== "EDITOR" &&
			!hasPermission(session, "manage:media")
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Check if the media exists
		const existingMedia = await prisma.media.findUnique({
			where: { id },
		});

		if (!existingMedia) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// Delete the media item
		await prisma.media.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting media:", error);
		return NextResponse.json(
			{ error: "Failed to delete media" },
			{ status: 500 },
		);
	}
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// GET /api/media/[id] - Get a specific media item
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if the ID is a slug or an actual ID
		const isSlug = !id.includes("-");

		let media;
		if (isSlug) {
			// Fetch by ID
			media = await prisma.media.findUnique({
				where: { id },
				include: {
					author: {
						select: {
							name: true,
						},
					},
					category: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			});
		} else {
			// Fetch by slug
			media = await prisma.media.findUnique({
				where: { slug: id },
				include: {
					author: {
						select: {
							name: true,
						},
					},
					category: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			});
		}

		if (!media) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// For public requests, only return published media
		if (!session && !media.published) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// For admin/editor requests, return the media
		if (
			session?.user?.role === "ADMIN" ||
			session?.user?.role === "EDITOR" ||
			hasPermission(session, "manage:media") ||
			media.published
		) {
			return NextResponse.json(media);
		}

		// For other authenticated users, only return published media
		if (!media.published) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		return NextResponse.json(media);
	} catch (error) {
		console.error("Error fetching media:", error);
		return NextResponse.json(
			{ error: "Failed to fetch media" },
			{ status: 500 },
		);
	}
}

// PUT /api/media/[id] - Update a media item
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and has permission
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			session.user.role !== "ADMIN" &&
			session.user.role !== "EDITOR" &&
			!hasPermission(session, "manage:media")
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await req.json();

		// Check if the media exists
		const existingMedia = await prisma.media.findUnique({
			where: { id },
		});

		if (!existingMedia) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// Update the media item
		const media = await prisma.media.update({
			where: { id },
			data: {
				title: data.title,
				slug: data.slug,
				description: data.description,
				mediaUrl: data.mediaUrl,
				mediaType: data.mediaType,
				thumbnail: data.thumbnail || null,
				featured: data.featured,
				published: data.published,
				publishedAt:
					data.published && !existingMedia.published
						? new Date()
						: existingMedia.publishedAt,
				categoryId: data.categoryId || null,
			},
		});

		return NextResponse.json(media);
	} catch (error) {
		console.error("Error updating media:", error);

		// Check for duplicate slug error
		if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
			return NextResponse.json(
				{ error: "A media item with this slug already exists" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to update media" },
			{ status: 500 },
		);
	}
}

// PATCH /api/media/[id] - Partially update a media item
export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and has permission
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			session.user.role !== "ADMIN" &&
			session.user.role !== "EDITOR" &&
			!hasPermission(session, "manage:media")
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await req.json();

		// Check if the media exists
		const existingMedia = await prisma.media.findUnique({
			where: { id },
		});

		if (!existingMedia) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// Update the media item with only the provided fields
		const media = await prisma.media.update({
			where: { id },
			data,
		});

		return NextResponse.json(media);
	} catch (error) {
		console.error("Error updating media:", error);
		return NextResponse.json(
			{ error: "Failed to update media" },
			{ status: 500 },
		);
	}
}

// DELETE /api/media/[id] - Delete a media item
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and has permission
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			session.user.role !== "ADMIN" &&
			session.user.role !== "EDITOR" &&
			!hasPermission(session, "manage:media")
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Check if the media exists
		const existingMedia = await prisma.media.findUnique({
			where: { id },
		});

		if (!existingMedia) {
			return NextResponse.json({ error: "Media not found" }, { status: 404 });
		}

		// Delete the media item
		await prisma.media.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting media:", error);
		return NextResponse.json(
			{ error: "Failed to delete media" },
			{ status: 500 },
		);
	}
}
