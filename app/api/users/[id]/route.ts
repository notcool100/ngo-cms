import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import bcrypt from "bcryptjs"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Schema for user update
const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["USER", "ADMIN", "EDITOR"]).optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = userUpdateSchema.parse(body)

    // If updating email, check if it's already in use
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: {
            id: params.id,
          },
        },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData }

    // If password is provided, hash it
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10)
    }

    // Only admins can change roles
    if (validatedData.role && session.user.role !== "ADMIN") {
      delete updateData.role
    }

    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prevent deleting yourself
    if (session.user.id === params.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 })
    }

    await prisma.user.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

