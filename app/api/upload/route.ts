import { type NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
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
		if (session.user.role !== "ADMIN") {
			return NextResponse.json(
				{ message: "Forbidden: Admin access required" },
				{ status: 403 },
			);
		}

		// Get the form data
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ message: "No file provided" },
				{ status: 400 },
			);
		}

		// Validate file type
		const validTypes = ["image/jpeg", "image/png", "image/jpg"];
		if (!validTypes.includes(file.type)) {
			return NextResponse.json(
				{ message: "Invalid file type. Only JPG, JPEG, and PNG are allowed." },
				{ status: 400 },
			);
		}

		// Validate file size (5MB max)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ message: "File too large. Maximum size is 5MB." },
				{ status: 400 },
			);
		}

		// Create a unique filename
		const fileExtension = file.name.split(".").pop();
		const fileName = `${uuidv4()}.${fileExtension}`;
		const uploadDir = join(process.cwd(), "public", "uploads");
		const filePath = join(uploadDir, fileName);
		const fileUrl = `/uploads/${fileName}`;

		// Convert the file to a buffer
		const buffer = Buffer.from(await file.arrayBuffer());

		// Write the file to the uploads directory
		await writeFile(filePath, buffer);

		return NextResponse.json({ url: fileUrl });
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ message: "Error uploading file" },
			{ status: 500 },
		);
	}
}
