import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function GET(
	req: Request,
	{ params }: { params: { noticeId: string } },
) {
	try {
		if (!params.noticeId) {
			return new NextResponse("Notice id is required", { status: 400 });
		}

		const notice = await prismadb.notice.findUnique({
			where: {
				id: params.noticeId,
			},
			include: {
				author: {
					select: {
						name: true,
					},
				},
			},
		});

		return NextResponse.json(notice);
	} catch (error) {
		console.log("[NOTICE_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { noticeId: string } },
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { title, content, important, published, expiresAt } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}

		if (!params.noticeId) {
			return new NextResponse("Notice id is required", { status: 400 });
		}

		if (!title) {
			return new NextResponse("Title is required", { status: 400 });
		}

		if (!content) {
			return new NextResponse("Content is required", { status: 400 });
		}

		const notice = await prismadb.notice.update({
			where: {
				id: params.noticeId,
			},
			data: {
				title,
				content,
				important: important || false,
				published: published || true,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
			},
		});

		return NextResponse.json(notice);
	} catch (error) {
		console.log("[NOTICE_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { noticeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}

		if (!params.noticeId) {
			return new NextResponse("Notice id is required", { status: 400 });
		}

		const notice = await prismadb.notice.delete({
			where: {
				id: params.noticeId,
			},
		});

		return NextResponse.json(notice);
	} catch (error) {
		console.log("[NOTICE_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
