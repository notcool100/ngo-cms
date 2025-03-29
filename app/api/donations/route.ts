import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Schema for donation validation
const donationSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  type: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]).default("ONE_TIME"),
  name: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().optional(),
  programId: z.string().optional(),
  transactionId: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: any = {}

    if (status) where.status = status
    if (type) where.type = type

    const donations = await prisma.donation.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        program: true,
      },
    })

    const total = await prisma.donation.count({ where })

    return NextResponse.json({
      donations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = donationSchema.parse(body)

    // In a real implementation, you would integrate with a payment processor here
    // For now, we'll just create the donation record

    const donation = await prisma.donation.create({
      data: {
        ...validatedData,
        status: "PENDING", // In a real app, this would be set based on payment processor response
      },
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating donation:", error)
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
  }
}

