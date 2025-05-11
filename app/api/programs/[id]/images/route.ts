import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const images = await prisma.programImage.findMany({
      where: { programId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching program images:", error);
    return NextResponse.json(
      { error: "Failed to fetch program images" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const body = await req.json();

    // Expect body to have images: string[] (array of image URLs)
    if (!body.images || !Array.isArray(body.images)) {
      return NextResponse.json(
        { error: "Invalid images data" },
        { status: 400 }
      );
    }

    // Delete existing images for the program (optional, or handle update differently)
    await prisma.programImage.deleteMany({
      where: { programId: id },
    });

    // Create new images
    const createImages = body.images.map((imageUrl: string) => ({
      programId: id,
      imageUrl,
    }));

    await prisma.programImage.createMany({
      data: createImages,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading program images:", error);
    return NextResponse.json(
      { error: "Failed to upload program images" },
      { status: 500 }
    );
  }
}
