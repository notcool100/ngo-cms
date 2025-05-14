"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";

const publicationTypes = [
	{
		label: "All",
		value: null,
	},
	{
		label: "Books",
		value: "BOOK",
	},
	{
		label: "Articles",
		value: "ARTICLE",
	},
	{
		label: "Reports",
		value: "REPORT",
	},
	{
		label: "Acts",
		value: "ACT",
	},
	{
		label: "Rules",
		value: "RULE",
	},
	{
		label: "Guidelines",
		value: "GUIDELINE",
	},
	{
		label: "Other",
		value: "OTHER",
	},
];

export const PublicationFilter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: categories, isLoading: loadingCategories } = useCategories();

	const categoryId = searchParams.get("categoryId");
	const type = searchParams.get("type");
	const featured = searchParams.get("featured");

	const onClick = (value: string | null, key: string) => {
		const current = qs.parse(searchParams.toString());

		const query = {
			...current,
			[key]: value,
		};

		if (!value) {
			delete query[key];
		}

		const url = qs.stringifyUrl(
			{
				url: window.location.pathname,
				query,
			},
			{ skipNull: true },
		);

		router.push(url);
	};

	return (
		<div className="mb-8 space-y-4">
			<div className="flex flex-wrap gap-2">
				{publicationTypes.map((filter) => (
					<Button
						key={filter.value || "all"}
						onClick={() => onClick(filter.value, "type")}
						className={cn(
							"rounded-full",
							type === filter.value
								? "bg-black text-white"
								: "bg-transparent text-gray-800",
						)}
						variant={type === filter.value ? "default" : "outline"}
						size="sm"
					>
						{filter.label}
					</Button>
				))}
			</div>
			<div className="flex flex-wrap gap-2">
				{categories?.map((category) => (
					<Button
						key={category.id}
						onClick={() => onClick(category.id, "categoryId")}
						className={cn(
							"rounded-full",
							categoryId === category.id
								? "bg-black text-white"
								: "bg-transparent text-gray-800",
						)}
						variant={categoryId === category.id ? "default" : "outline"}
						size="sm"
					>
						{category.name}
					</Button>
				))}
			</div>
			<div className="flex items-center gap-2">
				<Button
					onClick={() =>
						onClick(featured === "true" ? null : "true", "featured")
					}
					className={cn(
						"rounded-full",
						featured === "true"
							? "bg-black text-white"
							: "bg-transparent text-gray-800",
					)}
					variant={featured === "true" ? "default" : "outline"}
					size="sm"
				>
					Featured
				</Button>
			</div>
		</div>
	);
};
