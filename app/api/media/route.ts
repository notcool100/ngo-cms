import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// GET /api/media - Get all media items
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const isAdmin = session?.user?.role === "ADMIN";
		const isEditor = session?.user?.role === "EDITOR";

		// For public requests, only return published media
		if (!session) {
			const media = await prisma.media.findMany({
				where: {
					published: true,
				},
				orderBy: {
					createdAt: "desc",
				},
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
			return NextResponse.json(media);
		}

		// For admin/editor requests, return all media
		if (isAdmin || isEditor || hasPermission(session, "manage:media")) {
			const media = await prisma.media.findMany({
				orderBy: {
					createdAt: "desc",
				},
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
			return NextResponse.json(media);
		}

		// For other authenticated users, return only published media
		const media = await prisma.media.findMany({
			where: {
				published: true,
			},
			orderBy: {
				createdAt: "desc",
			},
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
		return NextResponse.json(media);
	} catch (error) {
		console.error("Error fetching media:", error);
		return NextResponse.json(
			{ error: "Failed to fetch media" },
			{ status: 500 },
		);
	}
}

// POST /api/media - Create a new media item
export async function POST(req: NextRequest) {
	try {
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

		// Create the media item
		const media = await prisma.media.create({
			data: {
				title: data.title,
				slug: data.slug,
				description: data.description,
				mediaUrl: data.mediaUrl,
				mediaType: data.mediaType,
				thumbnail: data.thumbnail || null,
				featured: data.featured || false,
				published: data.published || false,
				publishedAt: data.published ? new Date() : null,
				authorId: session.user.id,
				categoryId: data.categoryId || null,
			},
		});

		return NextResponse.json(media, { status: 201 });
	} catch (error) {
		console.error("Error creating media:", error);

		// Check for duplicate slug error
		if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
			return NextResponse.json(
				{ error: "A media item with this slug already exists" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to create media" },
			{ status: 500 },
		);
	}
}

