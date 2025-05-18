"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
	value: string;
	onChange: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	value,
	onChange,
}) => {
	const [isUploading, setIsUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(value || null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || event.target.files.length === 0) return;

		const file = event.target.files[0];

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

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
				headers: {
					// The actual auth header will be automatically included by the browser
					// when credentials: "include" is set
				},
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to upload image");
			}

			const data = await response.json();
			onChange(data.url);
			setPreview(data.url);
		} catch (error: any) {
			console.error("Error uploading image:", error);
			toast({
				title: "Upload failed",
				description: error.message || "Failed to upload image",
				variant: "destructive",
			});
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleRemoveImage = () => {
		setPreview(null);
		onChange("");
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
					onChange={handleUpload}
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
};
