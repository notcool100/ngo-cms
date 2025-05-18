"use client";

import { motion } from "framer-motion";
import PressReleaseCard from "@/components/press-release-card";
import type { PressRelease } from "@/app/admin/press-releases/columns";

interface PressReleasesClientProps {
	featured: PressRelease[];
	regular: PressRelease[];
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export function PressReleasesClient({
	featured,
	regular,
}: PressReleasesClientProps) {
	return (
		<div className="container py-12">
			<h1 className="mb-8 text-4xl font-bold">Press Releases</h1>

			{featured.length > 0 && (
				<div className="mb-12">
					<h2 className="mb-6 text-2xl font-semibold">
						Featured Press Releases
					</h2>
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
					>
						{featured.map((pressRelease) => (
							<motion.div key={pressRelease.id} variants={item}>
								<PressReleaseCard pressRelease={pressRelease} featured />
							</motion.div>
						))}
					</motion.div>
				</div>
			)}

			<div>
				<h2 className="mb-6 text-2xl font-semibold">Latest Press Releases</h2>
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
				>
					{regular.map((pressRelease) => (
						<motion.div key={pressRelease.id} variants={item}>
							<PressReleaseCard pressRelease={pressRelease} />
						</motion.div>
					))}
				</motion.div>
			</div>

			{featured.length === 0 && regular.length === 0 && (
				<p className="text-center text-muted-foreground">
					No press releases available at the moment.
				</p>
			)}
		</div>
	);
}
