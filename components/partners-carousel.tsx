"use client";

import * as React from "react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import type { Partner } from "@/lib/partners";

interface PartnersCarouselProps {
	partners: readonly Partner[];
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
						key={partner.name}
						className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
					>
						<div
							className="flex h-28 items-center justify-center rounded-xl border border-muted/20 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
							title={partner.name}
						>
							<div className="relative h-full w-full">
								<Image
									src={partner.logo}
									alt={partner.name}
									fill
									sizes="200px"
									className="object-contain"
								/>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
