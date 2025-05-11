"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import Image from "next/image";

interface MultipleImageUploadProps {
  programId: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  programId,
  images: initialImages,
  onChange,
}) => {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImages(initialImages || []);
  }, [initialImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        // Upload file to server or cloud storage
        // Assuming an API endpoint /api/upload for single file upload
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onChange(newImages);
      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} images uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Gallery Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-4"
      />
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative w-24 h-24 rounded overflow-hidden border">
            <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
