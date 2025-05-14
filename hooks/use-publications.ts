import type { Publication, PublicationType } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

interface PublicationPayload {
	id?: string;
	slug?: string;
	title: string;
	description: string;
	fileUrl: string;
	coverImage?: string;
	type: PublicationType;
	featured?: boolean;
	published?: boolean;
	categoryId?: string;
	authorId: string;
}

export const usePublications = (admin?: boolean) => {
	return useQuery({
		queryKey: ["publications", admin],
		queryFn: async () => {
			const response = await axios.get<Publication[]>(
				`/api/publications${admin ? "?admin=true" : ""}`,
			);
			return response.data;
		},
	});
};

export const usePublication = (slug: string | null) => {
	return useQuery({
		queryKey: ["publication", slug],
		queryFn: async () => {
			if (!slug || slug === "new") return null;
			const response = await axios.get<Publication>(
				`/api/publications?slug=${slug}`,
			);
			return response.data;
		},
		enabled: !!slug && slug !== "new",
	});
};

export const useUpsertPublication = () => {
	return useMutation<Publication, Error | AxiosError, PublicationPayload>({
		mutationFn: async (data: PublicationPayload) => {
			if (data.slug) {
				const response = await axios.put<Publication>(
					"/api/publications",
					data,
				);
				return response.data;
			}
			const response = await axios.post<Publication>("/api/publications", data);
			return response.data;
		},
		onError: (error: Error | AxiosError) => {
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.error || "Failed to save publication",
				);
			}
			throw error;
		},
	});
};

export const useDeletePublication = () => {
	return useMutation<{ success: true }, Error | AxiosError, string>({
		mutationFn: async (id: string) => {
			const response = await axios.delete<{ success: true }>(
				`/api/publications?id=${id}`,
			);
			return response.data;
		},
		onError: (error: Error | AxiosError) => {
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.error || "Failed to delete publication",
				);
			}
			throw error;
		},
	});
};
