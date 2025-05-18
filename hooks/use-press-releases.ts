import useSWR from "swr";
import type { PressRelease } from "@/app/admin/press-releases/columns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
