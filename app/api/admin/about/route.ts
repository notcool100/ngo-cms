import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma"; // Assuming Prisma is used
import { aboutSections, teamMembers } from "@/lib/db/schema"; // For drizzle-orm
import { eq } from "drizzle-orm";
import { checkPermission } from "@/lib/api-permissions";

// GET - Fetch all about sections and team members
export async function GET(request: Request) {
    try {
        // Check permissions
        const permissionCheck = await checkPermission(request, "about:read");
        if (!permissionCheck.success) {
            return NextResponse.json(
                { error: permissionCheck.response?.json()?.error || "Permission denied" },
                { status: 403 },
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        // Fetch about sections
        let sections = [];
        if (type) {
            sections = await db.aboutSection.findMany({
                where: { type },
                orderBy: { order: "asc" },
            });
        } else {
            sections = await db.aboutSection.findMany({
                orderBy: { order: "asc" },
            });
        }

        // Fetch team members
        const team = await db.teamMember.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json({
            sections,
            team,
        });
    } catch (error) {
        console.error("Error fetching about data:", error);
        return NextResponse.json(
            { error: "Failed to fetch about data" },
            { status: 500 },
        );
    }
}

// POST - Create a new about section or team member
export async function POST(request: Request) {
    try {
        // Check permissions
        const permissionCheck = await checkPermission(request, "about:create");
        if (!permissionCheck.success) {
            return NextResponse.json(
                { error: permissionCheck.error },
                { status: 403 },
            );
        }

        const data = await request.json();
        const { contentType, ...contentData } = data;

        if (contentType === "section") {
            // Create a new about section
            const newSection = await db.aboutSection.create({
                data: contentData,
            });

            return NextResponse.json(newSection);
        } else if (contentType === "team") {
            // Create a new team member
            const newTeamMember = await db.teamMember.create({
                data: contentData,
            });

            return NextResponse.json(newTeamMember);
        } else {
            return NextResponse.json(
                { error: "Invalid content type" },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Error creating about content:", error);
        return NextResponse.json(
            { error: "Failed to create about content" },
            { status: 500 },
        );
    }
}

// PUT - Update an existing about section or team member
export async function PUT(request: Request) {
    try {
        // Check permissions
        const permissionCheck = await checkPermission(request, "about:update");
        if (!permissionCheck.success) {
            return NextResponse.json(
                { error: permissionCheck.error },
                { status: 403 },
            );
        }

        const data = await request.json();
        const { contentType, id, ...contentData } = data;

        if (contentType === "section") {
            // Update an about section
            const updatedSection = await db.aboutSection.update({
                where: { id },
                data: contentData,
            });

            return NextResponse.json(updatedSection);
        } else if (contentType === "team") {
            // Update a team member
            const updatedTeamMember = await db.teamMember.update({
                where: { id },
                data: contentData,
            });

            return NextResponse.json(updatedTeamMember);
        } else {
            return NextResponse.json(
                { error: "Invalid content type" },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Error updating about content:", error);
        return NextResponse.json(
            { error: "Failed to update about content" },
            { status: 500 },
        );
    }
}

// DELETE - Delete an about section or team member
export async function DELETE(request: Request) {
    try {
        // Check permissions
        const permissionCheck = await checkPermission(request, "about:delete");
        if (!permissionCheck.success) {
            return NextResponse.json(
                { error: permissionCheck.error },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(request.url);
        const contentType = searchParams.get("contentType");
        const id = searchParams.get("id");

        if (!contentType || !id) {
            return NextResponse.json(
                { error: "Missing contentType or id" },
                { status: 400 },
            );
        }

        if (contentType === "section") {
            // Delete an about section
            await db.aboutSection.delete({
                where: { id: Number.parseInt(id) },
            });

            return NextResponse.json({ success: true });
        } else if (contentType === "team") {
            // Delete a team member
            await db.teamMember.delete({
                where: { id: Number.parseInt(id) },
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Invalid content type" },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Error deleting about content:", error);
        return NextResponse.json(
            { error: "Failed to delete about content" },
            { status: 500 },
        );
    }
}