"use client";

import type React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export function HoverCard({ children, className, ...props }: HoverCardProps) {
	return (
		<motion.div
			className={cn("transition-all duration-300", className)}
			whileHover={{
				y: -5,
				boxShadow:
					"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}
