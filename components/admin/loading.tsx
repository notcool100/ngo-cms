import { Skeleton } from "@/components/ui/skeleton";

export function AdminLoading() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-[200px]" />
				<Skeleton className="h-10 w-[120px]" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<div className="border rounded-md">
					<div className="p-4">
						<Skeleton className="h-8 w-full" />
					</div>
					<div className="p-4 space-y-4">
						{Array(5)
							.fill(null)
							.map((_, index) => (
								<Skeleton key={index} className="h-12 w-full" />
							))}
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<Skeleton className="h-10 w-[300px]" />
				</div>
			</div>
		</div>
	);
}
