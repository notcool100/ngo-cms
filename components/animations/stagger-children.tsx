"use client";

import type React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	staggerDelay?: number;
	className?: string;
	once?: boolean;
}

export function StaggerChildren({
	children,
	staggerDelay = 0.1,
	className,
	once = true,
	...props
}: StaggerChildrenProps) {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay,
			},
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once }}
			className={cn(className)}
			{...props}
		>
			{children}
		</motion.div>
	);
}
