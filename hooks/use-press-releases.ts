import useSWR from "swr";
import type { PressRelease } from "@/app/admin/press-releases/columns";

const fetcher = async (url: string) => {
	console.log("Fetching press releases from:", url);
	const response = await fetch(url, {
		credentials: "include",
	});
	const data = await response.json();
	console.log("Fetched press releases:", data);

	// If the response contains an error, throw it so SWR can handle it
	if (data.error) {
		throw new Error(data.error);
	}

	return data;
};

export function usePressReleases(params?: {
	featured?: boolean;
	limit?: number;
}) {
	const queryString = new URLSearchParams();
	if (params?.featured) queryString.append("featured", "true");
	if (params?.limit) queryString.append("limit", params.limit.toString());

	const url = `/api/press-releases${queryString.toString() ? `?${queryString.toString()}` : ''}`;

	const { data, error, isLoading, mutate } = useSWR<PressRelease[]>(
		url,
		fetcher,
	);

	return {
		data: data || [], // Return empty array if no data
		isLoading,
		isError: error,
		mutate,
	};
}

export function usePressRelease(id: string) {
	const { data, error, isLoading, mutate } = useSWR<PressRelease>(
		id ? `/api/press-releases?id=${id}` : null,
		fetcher,
	);

	return {
		pressRelease: data,
		isLoading,
		isError: error,
		mutate,
	};
}

export function usePressReleaseBySlug(slug: string) {
	const { data, error, isLoading, mutate } = useSWR<PressRelease>(
		slug ? `/api/press-releases?slug=${slug}` : null,
		fetcher,
	);

	return {
		data,
		isLoading,
		isError: error,
		mutate,
	};
}
