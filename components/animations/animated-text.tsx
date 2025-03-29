"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
	text: string;
	className?: string;
	once?: boolean;
	delay?: number;
}

export function AnimatedText({
	text,
	className,
	once = true,
	delay = 0,
}: AnimatedTextProps) {
	const words = text.split(" ");

	const container = {
		hidden: { opacity: 0 },
		visible: (i = 1) => ({
			opacity: 1,
			transition: { staggerChildren: 0.12, delayChildren: delay },
		}),
	};

	const child = {
		hidden: {
			opacity: 0,
			y: 20,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				damping: 12,
				stiffness: 100,
			},
		},
	};

	return (
		<motion.div
			className={cn("flex flex-wrap", className)}
			variants={container}
			initial="hidden"
			whileInView="visible"
			viewport={{ once }}
		>
			{words.map((word, index) => (
				<motion.span key={index} className="mr-1.5 mt-1.5" variants={child}>
					{word}
				</motion.span>
			))}
		</motion.div>
	);
}
