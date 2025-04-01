"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface DonationChartProps {
	data: {
		month: string;
		amount: number;
	}[];
}

export function DonationChart({ data }: DonationChartProps) {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Donation Overview</CardTitle>
				<CardDescription>
					Monthly donation trends for the current year
				</CardDescription>
			</CardHeader>
			<CardContent className="pl-2">
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip
								formatter={(value) => [`$${value}`, "Amount"]}
								labelFormatter={(label) => `Month: ${label}`}
							/>
							<Bar dataKey="amount" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
