import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		// Check if user is admin
		if (!session.user.email?.endsWith("@company.com")) {
			return NextResponse.json(
				{ message: "Forbidden: Admin access required" },
				{ status: 403 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;
		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Create unique filename
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}${extname(file.name)}`;

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
