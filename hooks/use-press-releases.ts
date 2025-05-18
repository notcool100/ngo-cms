import useSWR from "swr";
import type { PressRelease } from "@/app/admin/press-releases/columns";

const fetcher = async (url: string) => {
	console.log("Fetching press releases from:", url);
	const response = await fetch(url, {
		credentials: "include",
	});
	const data = await response.json();
	console.log("Fetched press releases:", data);
	return data;
};

export function usePressReleases() {
	const { data, error, isLoading, mutate } = useSWR<PressRelease[]>(
		"/api/press-releases",
		fetcher,
	);

	return {
		pressReleases: data,
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
