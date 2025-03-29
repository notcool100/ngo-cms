"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema for donation validation
const donationSchema = z.object({
	amount: z.coerce.number().positive("Amount must be greater than 0"),
	currency: z.string().default("USD"),
	type: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]).default("ONE_TIME"),
	name: z.string().optional(),
	email: z.string().email("Please enter a valid email address").optional(),
	message: z.string().optional(),
	programId: z.string().optional(),
});

export async function submitDonation(formData: FormData) {
	try {
		// Get amount from form data
		const amountStr =
			(formData.get("amount") as string) ||
			(formData.get("custom-amount") as string);
		const amount = Number.parseFloat(amountStr);

		if (isNaN(amount) || amount <= 0) {
			return {
				success: false,
				message: "Please enter a valid donation amount",
			};
		}

		const validatedData = donationSchema.parse({
			amount,
			currency: "USD", // Default currency
			type: formData.get("type") || "ONE_TIME",
			name: formData.get("name") || undefined,
			email: formData.get("email") || undefined,
			message: formData.get("message") || undefined,
			programId: formData.get("programId") || undefined,
		});

		// In a real implementation, you would integrate with a payment processor here
		// For now, we'll just create the donation record
		const donation = await prisma.donation.create({
			data: {
				...validatedData,
				status: "PENDING", // In a real app, this would be set based on payment processor response
			},
		});

		return {
			success: true,
			message:
				"Thank you for your donation! You will be redirected to complete the payment.",
			donationId: donation.id,
		};
	} catch (error) {
		console.error("Error processing donation:", error);

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
			message: "Failed to process your donation. Please try again later.",
		};
	}
}
