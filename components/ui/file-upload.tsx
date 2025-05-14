"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, File, Loader2, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
	value: string;
	onChange: (value: string) => void;
	onRemove?: () => void;
	disabled?: boolean;
	accept?: string;
	id?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
	value,
	onChange,
	onRemove,
	disabled,
	accept = "image/*",
	id = "file-upload",
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [preview, setPreview] = useState<string | null>(value);

	useEffect(() => {
		setIsMounted(true);
		setPreview(value);
	}, [value]);

	if (!isMounted) {
		return null;
	}

	const isImage = accept?.includes("image");

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (isImage && !file.type.startsWith("image/")) {
			console.error("Please upload an image file");
			return;
		}

		try {
			setIsLoading(true);

			// Create a preview for images
			if (isImage) {
				const objectUrl = URL.createObjectURL(file);
				setPreview(objectUrl);
			}

			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			onChange(data.url);
		} catch (error) {
			console.error("Error uploading file:", error);
			setPreview(value); // Reset preview on error
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemove = () => {
		setPreview(null);
		onChange("");
		onRemove?.();
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<input
					type="file"
					accept={accept}
					onChange={handleFileUpload}
					className="hidden"
					id={id}
					disabled={disabled || isLoading}
				/>
				<Button
					type="button"
					disabled={disabled || isLoading}
					variant="secondary"
					onClick={() => document.getElementById(id)?.click()}
					className="w-full"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Uploading...
						</>
					) : (
						<>
							{isImage ? (
								<ImageIcon className="mr-2 h-4 w-4" />
							) : (
								<File className="mr-2 h-4 w-4" />
							)}
							Upload {isImage ? "Image" : "File"}
						</>
					)}
				</Button>
			</div>

			{preview && (
				<div className="relative">
					{isImage ? (
						<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
							<Image
								src={preview}
								alt="Preview"
								fill
								className="object-cover"
							/>
							<Button
								type="button"
								variant="destructive"
								size="icon"
								className="absolute right-2 top-2"
								onClick={handleRemove}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2 rounded-lg border p-4">
							<File className="h-8 w-8 text-blue-500" />
							<div className="flex-1 truncate">
								<a
									href={preview}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-medium hover:underline"
								>
									{preview.split("/").pop()}
								</a>
							</div>
							<Button
								type="button"
								variant="destructive"
								size="icon"
								onClick={handleRemove}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
