"use client";

import type React from "react";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxScrollProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	speed?: number;
	className?: string;
	direction?: "up" | "down";
}

export function ParallaxScroll({
	children,
	speed = 0.5,
	className,
	direction = "up",
	...props
}: ParallaxScrollProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	const factor = direction === "up" ? -1 : 1;
	const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed * factor]);

	return (
		<div ref={ref} className={cn("overflow-hidden", className)} {...props}>
			<motion.div style={{ y }}>{children}</motion.div>
		</div>
	);
}
