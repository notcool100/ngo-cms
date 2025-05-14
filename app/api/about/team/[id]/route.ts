import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return NextResponse.json(
				{ error: "Invalid team member ID" },
				{ status: 400 },
			);
		}

		const teamMember = await prisma.teamMember.findUnique({
			where: { id },
		});

		if (!teamMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error("Error fetching team member:", error);
		return NextResponse.json(
			{ error: "Failed to fetch team member" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "about:update")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const id = parseInt(params.id);
		if (isNaN(id)) {
			return NextResponse.json(
				{ error: "Invalid team member ID" },
				{ status: 400 },
			);
		}

		const data = await request.json();
		const { name, position, bio, image, socialLinks, order, active, teamType } =
			data;

		// Validate required fields
		if (!name || !position || !bio) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if team member exists
		const existingMember = await prisma.teamMember.findUnique({
			where: { id },
		});

		if (!existingMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 },
			);
		}

		// Update the team member
		const teamMember = await prisma.teamMember.update({
			where: { id },
			data: {
				name,
				position,
				bio,
				image,
				socialLinks,
				order: order ? parseInt(order.toString()) : existingMember.order,
				active: active !== undefined ? active : existingMember.active,
				teamType: teamType || existingMember.teamType,
			},
		});

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error("Error updating team member:", error);
		return NextResponse.json(
			{ error: "Failed to update team member" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "about:delete")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const id = parseInt(params.id);
		if (isNaN(id)) {
			return NextResponse.json(
				{ error: "Invalid team member ID" },
				{ status: 400 },
			);
		}

		// Check if team member exists
		const existingMember = await prisma.teamMember.findUnique({
			where: { id },
		});

		if (!existingMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 },
			);
		}

		// Delete the team member
		await prisma.teamMember.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting team member:", error);
		return NextResponse.json(
			{ error: "Failed to delete team member" },
			{ status: 500 },
		);
	}
}
