"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxGalleryProps {
  images: { imageUrl: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function LightboxGallery({
  images,
  initialIndex,
  isOpen,
  onClose,
  title,
}: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          navigatePrev();
          break;
        case "ArrowRight":
          navigateNext();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  // Reset current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navigateNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const navigatePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-50 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Image title */}
      <div className="absolute left-0 right-0 top-4 text-center text-white">
        <h3 className="text-xl font-medium">
          {title} - Image {currentIndex + 1} of {images.length}
        </h3>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={navigatePrev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={navigateNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Main image */}
      <div className="relative h-[80vh] w-[80vw] max-w-7xl">
        <img
          src={images[currentIndex].imageUrl}
          alt={`${title} - Gallery image ${currentIndex + 1}`}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Thumbnail navigation (optional for larger galleries) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 overflow-x-auto px-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                index === currentIndex ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}