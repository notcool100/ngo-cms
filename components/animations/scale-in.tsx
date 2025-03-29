"use client";

import type React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScaleInProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
	once?: boolean;
}

export function ScaleIn({
	children,
	delay = 0,
	duration = 0.5,
	className,
	once = true,
	...props
}: ScaleInProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			whileInView={{
				opacity: 1,
				scale: 1,
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
