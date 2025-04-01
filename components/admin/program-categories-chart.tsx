"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";

interface ProgramCategoriesChartProps {
	data: {
		name: string;
		count: number;
	}[];
}

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
];

export function ProgramCategoriesChart({ data }: ProgramCategoriesChartProps) {
	// Filter out categories with 0 programs
	const filteredData = data.filter((item) => item.count > 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Program Categories</CardTitle>
				<CardDescription>
					Distribution of active programs by category
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					{filteredData.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={filteredData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={80}
									fill="#8884d8"
									dataKey="count"
									nameKey="name"
									label={({ name, percent }) =>
										`${name}: ${(percent * 100).toFixed(0)}%`
									}
								>
									{filteredData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={(value) => [`${value} programs`, "Count"]}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-muted-foreground">No active programs</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
