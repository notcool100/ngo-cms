import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import type { Role } from "@prisma/client";

interface SessionUser {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role: Role;
}

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Check if user has permission to upload files
		const user = session.user as SessionUser;
		if (!hasPermission(user.role, "manage:media")) {
			return NextResponse.json(
				{ message: "Forbidden: Insufficient permissions" },
				{ status: 403 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;
		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const fileExtension = extname(file.name).toLowerCase();
		const fileMimeType = file.type;

		const ALLOWED_EXTENSIONS = [
			".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
			".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv"
		];

		const ALLOWED_MIME_TYPES = [
			"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
			"application/pdf", "application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"text/plain", "text/csv"
		];

		if (!ALLOWED_EXTENSIONS.includes(fileExtension) || !ALLOWED_MIME_TYPES.includes(fileMimeType)) {
			return NextResponse.json(
				{ error: "Invalid file type. Unrecognized extension or MIME type." },
				{ status: 400 }
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Sanitize filename to prevent path traversal by keeping only alphanumeric characters, dashes, and underscores
		const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
		const sanitizedBaseName = originalNameWithoutExt.replace(/[^a-zA-Z0-9\-_]/g, "");
		const extension = extname(file.name).replace(/[^a-zA-Z0-9.]/g, "");
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const filename = `${sanitizedBaseName || 'file'}-${uniqueSuffix}${extension}`;

		// Determine folder based on file type
		const isImage = file.type.startsWith("image");
		const folder = isImage ? "images" : "documents";
		const publicPath = join(process.cwd(), "public", folder);
		const filePath = join(publicPath, filename);

		// Write file to public folder
		await writeFile(filePath, buffer);

		// Return the public URL
		const url = `/${folder}/${filename}`;

		return NextResponse.json({ url });
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ error: "Error uploading file" },
			{ status: 500 },
		);
	}
}
