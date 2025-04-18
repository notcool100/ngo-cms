import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = subscribeSchema.parse(body)

    const existingSubscriber = await prisma.newsletter_subscribers.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        await prisma.newsletter_subscribers.update({
          where: { email },
          data: { active: true },
        })
      }
      return NextResponse.json({ message: "You are already subscribed to our newsletter" })
    }

    await prisma.newsletter_subscribers.create({
      data: {
        id: crypto.randomUUID(),
        email,
        active: true,
      },
    })

    return NextResponse.json({ message: "Successfully subscribed to the newsletter" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Failed to subscribe to the newsletter" }, { status: 500 })
  }
}
