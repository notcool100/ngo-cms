import type { PressRelease } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PressReleaseWithAuthor extends PressRelease {
	author: {
		id: string;
		name: string | null;
		image: string | null;
	};
}

interface PressReleasePayload extends Partial<PressRelease> {
	title: string;
	slug: string;
	content: string;
}

export const usePressReleases = (params?: {
	featured?: boolean;
	limit?: number;
}) => {
	const queryString = new URLSearchParams();
	if (params?.featured) queryString.append("featured", "true");
	if (params?.limit) queryString.append("limit", params.limit.toString());

	return useQuery<PressReleaseWithAuthor[]>({
		queryKey: ["press-releases", params],
		queryFn: async () => {
			const response = await axios.get(`/api/press-releases?${queryString}`);
			return response.data;
		},
	});
};

export const usePressRelease = (id: string | null) => {
	return useQuery<PressReleaseWithAuthor>({
		queryKey: ["press-release", id],
		queryFn: async () => {
			const response = await axios.get(`/api/press-releases/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
};

export const usePressReleaseBySlug = (slug: string | null) => {
	return useQuery<PressReleaseWithAuthor>({
		queryKey: ["press-release", slug],
		queryFn: async () => {
			const response = await axios.get(`/api/press-releases?slug=${slug}`);
			return response.data;
		},
		enabled: !!slug,
	});
};

export const useUpsertPressRelease = () => {
	return useMutation<PressRelease, Error, PressReleasePayload>({
		mutationFn: async (data: PressReleasePayload) => {
			if (data.id) {
				const response = await axios.put(
					`/api/press-releases/${data.id}`,
					data,
				);
				return response.data;
			}
			const response = await axios.post("/api/press-releases", data);
			return response.data;
		},
	});
};

export const useDeletePressRelease = () => {
	return useMutation<void, Error, string>({
		mutationFn: async (id: string) => {
			await axios.delete(`/api/press-releases/${id}`);
		},
	});
};
