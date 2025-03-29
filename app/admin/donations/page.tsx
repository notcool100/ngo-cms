"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { AdminLoading } from "@/components/admin/loading";
import { toast } from "@/components/ui/use-toast";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Donation {
	id: string;
	amount: number;
	currency: string;
	status: string;
	type: string;
	name: string | null;
	email: string | null;
	message: string | null;
	createdAt: string;
	program: {
		title: string;
	} | null;
}

interface PaginationData {
	total: number;
	pages: number;
	page: number;
	limit: number;
}

export default function DonationsPage() {
	const [donations, setDonations] = useState<Donation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		pages: 1,
		page: 1,
		limit: 10,
	});
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchDonations();
	}, [currentPage, searchQuery]);

	const fetchDonations = async () => {
		try {
			setIsLoading(true);
			const queryParams = new URLSearchParams({
				page: currentPage.toString(),
				limit: "10",
			});

			if (searchQuery) {
				queryParams.append("search", searchQuery);
			}

			const response = await fetch(`/api/donations?${queryParams.toString()}`);

			if (!response.ok) {
				throw new Error("Failed to fetch donations");
			}

			const data = await response.json();
			setDonations(data.donations || []);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Error fetching donations:", error);
			toast({
				title: "Error",
				description: "Failed to load donations",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Add a search function
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return <Badge className="bg-green-500">Completed</Badge>;
			case "PENDING":
				return (
					<Badge variant="outline" className="text-yellow-600">
						Pending
					</Badge>
				);
			case "FAILED":
				return <Badge variant="destructive">Failed</Badge>;
			case "REFUNDED":
				return <Badge variant="secondary">Refunded</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const columns = [
		{
			key: "donor",
			title: "Donor",
			render: (donation: Donation) => (
				<div>
					<div className="font-medium">{donation.name || "Anonymous"}</div>
					{donation.email && (
						<div className="text-sm text-muted-foreground">
							{donation.email}
						</div>
					)}
				</div>
			),
		},
		{
			key: "amount",
			title: "Amount",
			render: (donation: Donation) => (
				<div className="font-medium">
					{donation.currency} {donation.amount.toFixed(2)}
				</div>
			),
		},
		{
			key: "status",
			title: "Status",
			render: (donation: Donation) => getStatusBadge(donation.status),
		},
		{
			key: "type",
			title: "Type",
			render: (donation: Donation) => (
				<Badge variant="outline">
					{donation.type === "ONE_TIME"
						? "One-time"
						: donation.type === "MONTHLY"
							? "Monthly"
							: donation.type}
				</Badge>
			),
		},
		{
			key: "program",
			title: "Program",
			render: (donation: Donation) =>
				donation.program?.title || "General Donation",
		},
		{
			key: "date",
			title: "Date",
			render: (donation: Donation) =>
				new Date(donation.createdAt).toLocaleDateString(),
		},
		{
			key: "actions",
			title: "Actions",
			render: (donation: Donation) => (
				<div className="flex gap-2">
					<Button variant="outline" size="icon">
						<Eye className="h-4 w-4" />
						<span className="sr-only">View Details</span>
					</Button>
				</div>
			),
		},
	];

	if (isLoading) {
		return <AdminLoading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Donations</h1>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Export CSV
				</Button>
			</div>

			<DataTable
				data={donations}
				columns={columns}
				pagination={pagination}
				onPageChange={setCurrentPage}
				searchPlaceholder="Search donations..."
				onSearch={handleSearch}
			/>
		</div>
	);
}
