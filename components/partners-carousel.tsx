"use client";

import * as React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";

interface PartnersCarouselProps {
	partners: readonly string[];
	intervalMs?: number;
}

export function PartnersCarousel({ partners, intervalMs = 3000 }: PartnersCarouselProps) {
	const [api, setApi] = React.useState<CarouselApi>();

	React.useEffect(() => {
		if (!api || partners.length < 2) return;
		const id = setInterval(() => {
			api.scrollNext();
		}, intervalMs);
		return () => clearInterval(id);
	}, [api, partners.length, intervalMs]);

	return (
		<Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="w-full">
			<CarouselContent className="-ml-4">
				{partners.map((partner) => (
					<CarouselItem
						key={partner}
						className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
					>
						<div className="flex h-24 items-center justify-center rounded-xl border border-muted/20 bg-white px-4 text-center shadow-sm transition-shadow hover:shadow-md">
							<span className="text-sm font-semibold text-muted-foreground">
								{partner}
							</span>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
