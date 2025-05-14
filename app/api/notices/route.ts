import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { auth } from "@clerk/nextjs";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const important = searchParams.get("important") === "true";
		const active = searchParams.get("active") === "true";
		const limit = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!)
			: undefined;

		if (id) {
			const notice = await prisma.notice.findUnique({
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

			if (!notice) {
				return NextResponse.json(
					{ error: "Notice not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json(notice);
		}

		// Build the where clause based on parameters
		const where: any = {
			published: true,
		};

		if (important) {
			where.important = true;
		}

		// Only show active notices (not expired)
		if (active) {
			where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }];
		}

		const notices = await prisma.notice.findMany({
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

		return NextResponse.json(notices);
	} catch (error) {
		console.error("Error fetching notices:", error);
		return NextResponse.json(
			{ error: "Failed to fetch notices" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { title, content, important, published, expiresAt } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}

		if (!title) {
			return new NextResponse("Title is required", { status: 400 });
		}

		if (!content) {
			return new NextResponse("Content is required", { status: 400 });
		}

		const notice = await prisma.notice.create({
			data: {
				title,
				content,
				important: important || false,
				published: published || true,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
				authorId: userId,
			},
		});

		return NextResponse.json(notice);
	} catch (error) {
		console.log("[NOTICES_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "manage:notices")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const data = await request.json();
		const { id, title, content, important, published, expiresAt } = data;

		// Validate required fields
		if (!id || !title || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if notice exists
		const existingNotice = await prisma.notice.findUnique({
			where: { id },
		});

		if (!existingNotice) {
			return NextResponse.json({ error: "Notice not found" }, { status: 404 });
		}

		// Update the notice
		const notice = await prisma.notice.update({
			where: { id },
			data: {
				title,
				content,
				important: important || false,
				published: published !== undefined ? published : true,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
			},
		});

		return NextResponse.json(notice);
	} catch (error) {
		console.error("Error updating notice:", error);
		return NextResponse.json(
			{ error: "Failed to update notice" },
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
		if (!hasPermission(userRole, "manage:notices")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Notice ID is required" },
				{ status: 400 },
			);
		}

		// Check if notice exists
		const existingNotice = await prisma.notice.findUnique({
			where: { id },
		});

		if (!existingNotice) {
			return NextResponse.json({ error: "Notice not found" }, { status: 404 });
		}

		// Delete the notice
		await prisma.notice.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting notice:", error);
		return NextResponse.json(
			{ error: "Failed to delete notice" },
			{ status: 500 },
		);
	}
}
