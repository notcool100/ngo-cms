"use client";

import type React from "react";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DataTableProps<T> {
	data: T[];
	columns: {
		key: string;
		title: string;
		render?: (item: T) => React.ReactNode;
	}[];
	pagination?: {
		total: number;
		pages: number;
		page: number;
		limit: number;
	};
	onPageChange?: (page: number) => void;
	onSearch?: (query: string) => void;
	searchPlaceholder?: string;
}

export function DataTable<T>({
	data,
	columns,
	pagination,
	onPageChange,
	onSearch,
	searchPlaceholder = "Search...",
}: DataTableProps<T>) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (onSearch) {
			onSearch(searchQuery);
		}
	};

	return (
		<div className="space-y-4">
			{onSearch && (
				<form
					onSubmit={handleSearch}
					className="flex w-full max-w-sm items-center space-x-2"
				>
					<Input
						placeholder={searchPlaceholder}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Button type="submit" size="icon">
						<Search className="h-4 w-4" />
						<span className="sr-only">Search</span>
					</Button>
				</form>
			)}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.key}>{column.title}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={index}>
									{columns.map((column) => (
										<TableCell key={`${index}-${column.key}`}>
											{column.render
												? column.render(item)
												: (item as any)[column.key]}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			{pagination && pagination.pages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (pagination.page > 1 && onPageChange) {
										onPageChange(pagination.page - 1);
									}
								}}
								className={
									pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
								}
							/>
						</PaginationItem>
						{Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
							(page) => (
								<PaginationItem key={page}>
									<PaginationLink
										href="#"
										onClick={(e) => {
											e.preventDefault();
											if (onPageChange) {
												onPageChange(page);
											}
										}}
										isActive={page === pagination.page}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							),
						)}
						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (pagination.page < pagination.pages && onPageChange) {
										onPageChange(pagination.page + 1);
									}
								}}
								className={
									pagination.page >= pagination.pages
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
