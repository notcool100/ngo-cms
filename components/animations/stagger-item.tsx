"use client";

import type React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	direction?: "up" | "down" | "left" | "right" | "none";
	className?: string;
	distance?: number;
}

export function StaggerItem({
	children,
	direction = "up",
	className,
	distance = 24,
	...props
}: StaggerItemProps) {
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

	const itemVariants = {
		hidden: {
			opacity: 0,
			...getDirectionOffset(),
		},
		show: {
			opacity: 1,
			x: 0,
			y: 0,
			transition: {
				duration: 0.5,
				ease: [0.22, 1, 0.36, 1],
			},
		},
	};

	return (
		<motion.div variants={itemVariants} className={cn(className)} {...props}>
			{children}
		</motion.div>
	);
}
