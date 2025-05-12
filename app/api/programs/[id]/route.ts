import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContextMenu } from "@radix-ui/react-context-menu";

// Schema for program update validation
const programUpdateSchema = z.object({
	title: z.string().min(3).max(255).optional(),
	slug: z.string().min(3).max(255).optional(),
	description: z.string().min(10).optional(),
	content: z.string().min(10).optional(),
	image: z.string().optional(),
	featured: z.boolean().optional(),
	active: z.boolean().optional(),
	categoryId: z.string().optional(),
	galleryImages: z.array(z.string()).optional(),
});
export async function GET(
    req: Request,
    context: { params: { id: string } },
) {
    try {
        const { params } = context; // No need to await context

        const program = await prisma.program.findUnique({
            where: {
                id: params.id,
            },
            include: {
                category: true,
                images: true, // Include gallery images
            },
        });
        
        // Format the response to include galleryImages as an array of URLs
        if (program && program.images) {
            (program as any).galleryImages = program.images.map(img => img.imageUrl);
        }

        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        return NextResponse.json(program);
    } catch (error) {
        console.error("Error fetching program:", error);
        return NextResponse.json(
            { error: "Failed to fetch program" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    req: Request,
    context: { params: { id: string } },
) {
    try {
        const { params } = context; // No need to await context
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = programUpdateSchema.parse(body);

        // If slug is being updated, check if it already exists
        if (validatedData.slug) {
            const existingProgram = await prisma.program.findFirst({
                where: {
                    slug: validatedData.slug,
                    NOT: {
                        id: params.id,
                    },
                },
            });

            if (existingProgram) {
                return NextResponse.json(
                    { error: "A program with this slug already exists" },
                    { status: 400 },
                );
            }
        }

        // Extract gallery images from validated data
        const { galleryImages, ...programData } = validatedData;
        
        // Update the program
        const program = await prisma.program.update({
            where: {
                id: params.id,
            },
            data: programData,
        });

        // If gallery images are provided, update them
        if (galleryImages) {
            // Delete existing images
            await prisma.programImage.deleteMany({
                where: { programId: params.id },
            });
            
            // Create new images if any
            if (galleryImages.length > 0) {
                await prisma.programImage.createMany({
                    data: galleryImages.map(imageUrl => ({
                        programId: params.id,
                        imageUrl,
                    })),
                });
            }
        }

        return NextResponse.json(program);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        console.error("Error updating program:", error);
        return NextResponse.json(
            { error: "Failed to update program" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: { id: string } },
) {
    try {
        const { params } = context; // No need to await context
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.program.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting program:", error);
        return NextResponse.json(
            { error: "Failed to delete program" },
            { status: 500 },
        );
    }
}