"use client";

import { useState } from "react";
import Image from "next/image";
import LightboxGallery from "./lightbox-gallery";

interface ProgramGalleryProps {
  images: { imageUrl: string }[];
  programTitle: string;
}

export default function ProgramGallery({ images, programTitle }: ProgramGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="pt-8">
      <h3 className="text-xl font-bold mb-4">Program Gallery</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.imageUrl}
              alt={`${programTitle} - Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">View larger</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Gallery */}
      <LightboxGallery
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={programTitle}
      />
    </div>
  );
}