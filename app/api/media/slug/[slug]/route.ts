import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// GET /api/media/slug/[slug] - Get a media item by slug
export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } },
) {
	try {
		const { slug } = params;
		const session = await getServerSession(authOptions);

		const media = await prisma.media.findUnique({
			where: { slug },
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
		console.error("Error fetching media by slug:", error);
		return NextResponse.json(
			{ error: "Failed to fetch media" },
			{ status: 500 },
		);
	}
}