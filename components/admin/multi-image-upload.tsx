"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MultiImageUploadProps {
    value: string[];
    onChange: (images: string[]) => void;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    value,
    onChange,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const files = Array.from(event.target.files);
        const uploadedImages: string[] = [];
        
        setIsUploading(true);
        
        try {
            for (const file of files) {
                // Validate file type
                const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (!validTypes.includes(file.type)) {
                    toast({
                        title: "Invalid file type",
                        description: "Please upload JPG, JPEG, or PNG images only.",
                        variant: "destructive",
                    });
                    continue;
                }

                // Validate file size (5MB max)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    toast({
                        title: "File too large",
                        description: `${file.name} is too large. Images must be less than 5MB.`,
                        variant: "destructive",
                    });
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const { url } = await response.json();
                    uploadedImages.push(url);
                } else {
                    const error = await response.json();
                    throw new Error(error.message || `Failed to upload ${file.name}`);
                }
            }

            if (uploadedImages.length > 0) {
                onChange([...value, ...uploadedImages]);
                toast({
                    title: "Images uploaded",
                    description: `Successfully uploaded ${uploadedImages.length} images.`,
                });
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            toast({
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Failed to upload images",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = (index: number) => {
        const updatedImages = [...value];
        updatedImages.splice(index, 1);
        onChange(updatedImages);
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
                    {isUploading ? "Uploading..." : "Upload Gallery Images"}
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>
            
            {value.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {value.map((image, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                            <img 
                                src={image} 
                                alt={`Gallery Image ${index + 1}`} 
                                className="w-full h-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    handleRemove(index);
                                }}
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