"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Region = {
	id: string;
	name: string;
	description: string;
	countries: string[];
};

const regions: Region[] = [
	{
		id: "north-america",
		name: "North America",
		description:
			"Supporting women's leadership and education initiatives across the United States and Canada.",
		countries: ["United States", "Canada", "Mexico"],
	},
	{
		id: "south-america",
		name: "South America",
		description:
			"Empowering women through economic opportunities and education in Brazil, Colombia, and Peru.",
		countries: ["Brazil", "Colombia", "Peru", "Argentina", "Chile"],
	},
	{
		id: "africa",
		name: "Africa",
		description:
			"Providing resources for women's health, education, and entrepreneurship across multiple African nations.",
		countries: ["Kenya", "Nigeria", "South Africa", "Ghana", "Ethiopia"],
	},
	{
		id: "europe",
		name: "Europe",
		description:
			"Partnering with local organizations to advance women's rights and leadership opportunities.",
		countries: ["United Kingdom", "France", "Germany", "Spain", "Italy"],
	},
	{
		id: "asia",
		name: "Asia",
		description:
			"Supporting women's economic empowerment and education initiatives across Asia.",
		countries: ["India", "Japan", "China", "Thailand", "Philippines"],
	},
];

export default function WorldMap() {
	const [activeRegion, setActiveRegion] = useState<Region | null>(null);

	return (
		<div className="relative">
			<div className="flex flex-col md:flex-row gap-8 items-start">
				<div className="w-full md:w-1/3">
					<h3 className="text-2xl font-bold mb-6">
						{activeRegion ? activeRegion.name : "Select a Region"}
					</h3>
					<p className="text-muted-foreground mb-4">
						{activeRegion
							? activeRegion.description
							: "Click on a region on the map to learn more about our work there."}
					</p>

					{activeRegion && (
						<div>
							<h4 className="font-medium mb-2">Countries:</h4>
							<ul className="list-disc list-inside space-y-1 text-muted-foreground">
								{activeRegion.countries.map((country) => (
									<li key={country}>{country}</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="w-full md:w-2/3 relative">
					<svg
						viewBox="0 0 1000 500"
						className="w-full h-auto"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						{/* World Map SVG - Simplified version */}
						<g>
							{/* North America */}
							<motion.path
								d="M150 120 L280 120 L300 200 L200 250 L150 200 Z"
								fill={
									activeRegion?.id === "north-america" ? "#3CBFAE" : "#3CBFAE80"
								}
								stroke="#fff"
								strokeWidth="2"
								whileHover={{ scale: 1.02 }}
								onClick={() =>
									setActiveRegion(
										regions.find((r) => r.id === "north-america") || null,
									)
								}
								className="cursor-pointer"
							/>

							{/* South America */}
							<motion.path
								d="M250 280 L300 280 L320 380 L270 450 L220 400 Z"
								fill={
									activeRegion?.id === "south-america" ? "#3CBFAE" : "#3CBFAE80"
								}
								stroke="#fff"
								strokeWidth="2"
								whileHover={{ scale: 1.02 }}
								onClick={() =>
									setActiveRegion(
										regions.find((r) => r.id === "south-america") || null,
									)
								}
								className="cursor-pointer"
							/>

							{/* Europe */}
							<motion.path
								d="M450 120 L550 120 L570 180 L500 200 L450 180 Z"
								fill={activeRegion?.id === "europe" ? "#3CBFAE" : "#3CBFAE80"}
								stroke="#fff"
								strokeWidth="2"
								whileHover={{ scale: 1.02 }}
								onClick={() =>
									setActiveRegion(
										regions.find((r) => r.id === "europe") || null,
									)
								}
								className="cursor-pointer"
							/>

							{/* Africa */}
							<motion.path
								d="M450 220 L550 220 L580 350 L500 400 L420 350 Z"
								fill={activeRegion?.id === "africa" ? "#3CBFAE" : "#3CBFAE80"}
								stroke="#fff"
								strokeWidth="2"
								whileHover={{ scale: 1.02 }}
								onClick={() =>
									setActiveRegion(
										regions.find((r) => r.id === "africa") || null,
									)
								}
								className="cursor-pointer"
							/>

							{/* Asia */}
							<motion.path
								d="M600 120 L800 120 L820 250 L700 300 L600 250 Z"
								fill={activeRegion?.id === "asia" ? "#3CBFAE" : "#3CBFAE80"}
								stroke="#fff"
								strokeWidth="2"
								whileHover={{ scale: 1.02 }}
								onClick={() =>
									setActiveRegion(regions.find((r) => r.id === "asia") || null)
								}
								className="cursor-pointer"
							/>
						</g>
					</svg>
				</div>
			</div>
		</div>
	);
}
