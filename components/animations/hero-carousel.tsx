"use client";

import * as React from "react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";

interface HeroCarouselImage {
	src: string;
	alt: string;
}

interface HeroCarouselProps {
	images: HeroCarouselImage[];
	intervalMs?: number;
}

export function HeroCarousel({ images, intervalMs = 5000 }: HeroCarouselProps) {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);

	React.useEffect(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap());
		api.on("select", () => setCurrent(api.selectedScrollSnap()));
	}, [api]);

	React.useEffect(() => {
		if (!api || images.length < 2) return;
		const id = setInterval(() => {
			api.scrollNext();
		}, intervalMs);
		return () => clearInterval(id);
	}, [api, images.length, intervalMs]);

	return (
		<section className="relative h-[90vh] overflow-hidden">
			<Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
				<CarouselContent className="ml-0 h-[90vh]">
					{images.map((image, index) => (
						<CarouselItem key={image.src} className="relative h-[90vh] pl-0">
							<Image
								src={image.src}
								alt={image.alt}
								fill
								priority={index === 0}
								quality={90}
								className="object-cover"
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{images.length > 1 && (
				<div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
					{images.map((image, index) => (
						<button
							key={image.src}
							type="button"
							aria-label={`Show slide ${index + 1}`}
							onClick={() => api?.scrollTo(index)}
							className={`h-2 rounded-full transition-all ${
								current === index ? "w-6 bg-white" : "w-2 bg-white/50"
							}`}
						/>
					))}
				</div>
			)}
		</section>
	);
}
