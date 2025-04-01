"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function ReportsTab() {
	const [reportType, setReportType] = useState<string>("donations");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);

	const handleGenerateReport = async () => {
		if (!startDate || !endDate) {
			toast({
				title: "Missing dates",
				description: "Please select both start and end dates",
				variant: "destructive",
			});
			return;
		}

		if (endDate < startDate) {
			toast({
				title: "Invalid date range",
				description: "End date must be after start date",
				variant: "destructive",
			});
			return;
		}

		setIsGenerating(true);

		try {
			// Format dates for API
			const formattedStartDate = startDate.toISOString().split("T")[0];
			const formattedEndDate = endDate.toISOString().split("T")[0];

			// Call the appropriate API endpoint based on report type
			const response = await fetch(
				`/api/reports/${reportType}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
			);

			if (!response.ok) {
				throw new Error("Failed to generate report");
			}

			// Get the blob from the response
			const blob = await response.blob();

			// Create a download link and trigger download
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${reportType}-report-${formattedStartDate}-to-${formattedEndDate}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);

			toast({
				title: "Report generated",
				description: "Your report has been downloaded",
			});
		} catch (error) {
			console.error("Error generating report:", error);
			toast({
				title: "Error",
				description: "Failed to generate report",
				variant: "destructive",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Generate Reports</CardTitle>
					<CardDescription>
						Export data for analysis and record-keeping
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Report Type</label>
							<Select value={reportType} onValueChange={setReportType}>
								<SelectTrigger>
									<SelectValue placeholder="Select report type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="donations">Donations Report</SelectItem>
									<SelectItem value="volunteers">Volunteers Report</SelectItem>
									<SelectItem value="events">Events Report</SelectItem>
									<SelectItem value="programs">Programs Report</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Start Date</label>
							<DatePicker date={startDate} setDate={setStartDate} />
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">End Date</label>
							<DatePicker date={endDate} setDate={setEndDate} />
						</div>
					</div>

					<Button
						onClick={handleGenerateReport}
						disabled={isGenerating}
						className="w-full"
					>
						{isGenerating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating...
							</>
						) : (
							<>
								<Download className="mr-2 h-4 w-4" />
								Generate Report
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Donations Report</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Export all donation records with donor information, amounts, and
							dates.
						</p>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => {
								setReportType("donations");
								setStartDate(undefined);
								setEndDate(undefined);
							}}
						>
							<FileText className="mr-2 h-4 w-4" />
							Select
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Volunteers Report</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Export volunteer applications with contact information, skills,
							and availability.
						</p>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => {
								setReportType("volunteers");
								setStartDate(undefined);
								setEndDate(undefined);
							}}
						>
							<FileText className="mr-2 h-4 w-4" />
							Select
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Events Report</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Export event data including attendees, registrations, and event
							details.
						</p>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => {
								setReportType("events");
								setStartDate(undefined);
								setEndDate(undefined);
							}}
						>
							<FileText className="mr-2 h-4 w-4" />
							Select
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
