import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const type = searchParams.get("type"); // BOARD or STAFF

		if (id) {
			const teamMember = await prisma.teamMember.findUnique({
				where: { id: parseInt(id) },
			});

			if (!teamMember) {
				return NextResponse.json(
					{ error: "Team member not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json(teamMember);
		}

		// Build the where clause based on parameters
		const where: any = {
			active: true,
		};

		if (type) {
			where.teamType = type;
		}

		const teamMembers = await prisma.teamMember.findMany({
			where,
			orderBy: {
				order: "asc",
			},
		});

		return NextResponse.json(teamMembers);
	} catch (error) {
		console.error("Error fetching team members:", error);
		return NextResponse.json(
			{ error: "Failed to fetch team members" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRole = session.user.role as string;
		if (!hasPermission(userRole, "about:create")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

		// Create the team member
		const teamMember = await prisma.teamMember.create({
			data: {
				name,
				position,
				bio,
				image,
				socialLinks,
				order: order ? parseInt(order.toString()) : 0,
				active: active !== undefined ? active : true,
				teamType: teamType || "STAFF",
			},
		});

		return NextResponse.json(teamMember, { status: 201 });
	} catch (error) {
		console.error("Error creating team member:", error);
		return NextResponse.json(
			{ error: "Failed to create team member" },
			{ status: 500 },
		);
	}
}
