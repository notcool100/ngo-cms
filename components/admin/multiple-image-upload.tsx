"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MultipleImageUploadProps {
	value: string[];
	onChange: (urls: string[]) => void;
	onRemove: (url: string) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
	value,
	onChange,
	onRemove,
}) => {
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || event.target.files.length === 0) return;

		const files = Array.from(event.target.files);

		// Validate file types and sizes
		const validTypes = ["image/jpeg", "image/png", "image/jpg"];
		const maxSize = 5 * 1024 * 1024; // 5MB

		const invalidFiles = files.filter(
			(file) => !validTypes.includes(file.type) || file.size > maxSize,
		);

		if (invalidFiles.length > 0) {
			toast.error(
				"Some files were not uploaded. Please ensure all files are JPG/PNG and under 5MB.",
			);
			return;
		}

		setIsUploading(true);

		try {
			const uploadPromises = files.map(async (file) => {
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
				return data.url;
			});

			const uploadedUrls = await Promise.all(uploadPromises);
			onChange([...value, ...uploadedUrls]);

			toast.success(`${files.length} images uploaded successfully`);

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error: any) {
			console.error("Error uploading images:", error);
			toast.error("Failed to upload images");
		} finally {
			setIsUploading(false);
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
					{isUploading ? "Uploading..." : "Upload Images"}
				</Button>
				<Input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/jpg"
					onChange={handleUpload}
					multiple
					className="hidden"
				/>
			</div>

			{value.length > 0 && (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{value.map((url) => (
						<div key={url} className="group relative">
							<div className="relative aspect-square w-full overflow-hidden rounded-md border">
								<Image
									src={url}
									alt="Gallery image"
									fill
									className="object-cover"
								/>
							</div>
							<Button
								type="button"
								variant="destructive"
								size="icon"
								className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={() => onRemove(url)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
