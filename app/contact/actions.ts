"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema for contact validation
const contactSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be less than 100 characters"),
	email: z.string().email("Please enter a valid email address"),
	phone: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(formData: FormData) {
	try {
		const validatedData = contactSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			phone: formData.get("phone") || undefined,
			subject: formData.get("subject") || undefined,
			message: formData.get("message"),
		});

		const contact = await prisma.contact.create({
			data: validatedData,
		});

		// In a real implementation, you might want to send an email notification here

		return {
			success: true,
			message: "Your message has been sent successfully!",
		};
	} catch (error) {
		console.error("Error submitting contact form:", error);

		if (error instanceof z.ZodError) {
			return {
				success: false,
				message: "Validation error",
				errors: error.errors.map((err) => ({
					path: err.path.join("."),
					message: err.message,
				})),
			};
		}

		return {
			success: false,
			message: "Failed to submit your message. Please try again later.",
		};
	}
}
