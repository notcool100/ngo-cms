"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema for volunteer validation
const volunteerSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name must be less than 50 characters"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name must be less than 50 characters"),
	email: z.string().email("Please enter a valid email address"),
	phone: z.string().optional(),
	location: z.string().min(2, "Location must be at least 2 characters").optional(),
	skills: z.string().optional(),
	availability: z.string().optional(),
	motivation: z.string().optional(),
});

export async function submitVolunteerForm(formData: FormData) {
	try {
		const validatedData = volunteerSchema.parse({
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			email: formData.get("email"),
			phone: formData.get("phone") || undefined,
			location: formData.get("location") || undefined,
			skills: formData.get("skills") || undefined,
			availability: formData.get("availability") || undefined,
			motivation: formData.get("motivation") || undefined,
		});

		// Check if volunteer with this email already exists
		const existingVolunteer = await prisma.volunteer.findUnique({
			where: {
				email: validatedData.email,
			},
		});

		if (existingVolunteer) {
			return {
				success: false,
				message: "A volunteer with this email already exists",
			};
		}

		const volunteer = await prisma.volunteer.create({
			data: {
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				email: validatedData.email,
				phone: validatedData.phone,
				address: validatedData.location,
				skills: validatedData.skills,
				availability: validatedData.availability,
				motivation: validatedData.motivation,
			},
		});

		return {
			success: true,
			message: "Your volunteer application has been submitted successfully!",
		};
	} catch (error) {
		console.error("Error submitting volunteer application:", error);

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
			message: "Failed to submit your application. Please try again later.",
		};
	}
}
