"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
	onUpload: (url: string) => void;
	existingImage?: string;
}

export function ImageUpload({ onUpload, existingImage }: ImageUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(existingImage || null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		const validTypes = ["image/jpeg", "image/png", "image/jpg"];
		if (!validTypes.includes(file.type)) {
			toast({
				title: "Invalid file type",
				description: "Please upload a JPG, JPEG, or PNG image.",
				variant: "destructive",
			});
			return;
		}

		// Validate file size (5MB max)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			toast({
				title: "File too large",
				description: "Image must be less than 5MB.",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsUploading(true);

			// Create a preview
			const objectUrl = URL.createObjectURL(file);
			setPreview(objectUrl);

			// Create form data for upload
			const formData = new FormData();
			formData.append("file", file);

			// Upload the file
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to upload image");
			}

			const data = await response.json();
			onUpload(data.url);

			toast({
				title: "Image uploaded",
				description: "Your image has been uploaded successfully.",
			});
		} catch (error) {
			console.error("Error uploading image:", error);
			toast({
				title: "Upload failed",
				description:
					error instanceof Error ? error.message : "Failed to upload image",
				variant: "destructive",
			});
			// Clear preview on error
			setPreview(existingImage || null);
		} finally {
			setIsUploading(false);
		}
	};

	const handleRemoveImage = () => {
		setPreview(null);
		onUpload("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading}
					className="w-full"
				>
					<Upload className="mr-2 h-4 w-4" />
					{isUploading ? "Uploading..." : "Upload Image"}
				</Button>
				<Input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/jpg"
					onChange={handleFileChange}
					className="hidden"
				/>
			</div>

			{preview && (
				<div className="relative">
					<div className="relative aspect-video w-full overflow-hidden rounded-md border">
						<Image
							src={preview || "/placeholder.svg"}
							alt="Preview"
							fill
							className="object-cover"
						/>
					</div>
					<Button
						type="button"
						variant="destructive"
						size="icon"
						className="absolute right-2 top-2"
						onClick={handleRemoveImage}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
