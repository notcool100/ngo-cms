"use client";

import type React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	direction?: "up" | "down" | "left" | "right" | "none";
	delay?: number;
	duration?: number;
	className?: string;
	once?: boolean;
	distance?: number;
}

export function FadeIn({
	children,
	direction = "up",
	delay = 0,
	duration = 0.5,
	className,
	once = true,
	distance = 24,
	...props
}: FadeInProps) {
	const getDirectionOffset = () => {
		switch (direction) {
			case "up":
				return { y: distance };
			case "down":
				return { y: -distance };
			case "left":
				return { x: distance };
			case "right":
				return { x: -distance };
			default:
				return {};
		}
	};

	return (
		<motion.div
			initial={{
				opacity: 0,
				...getDirectionOffset(),
			}}
			whileInView={{
				opacity: 1,
				x: 0,
				y: 0,
				transition: {
					duration,
					delay,
					ease: [0.22, 1, 0.36, 1],
				},
			}}
			viewport={{ once }}
			className={cn(className)}
			{...props}
		>
			{children}
		</motion.div>
	);
}
