import type { Notice } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface NoticeWithAuthor extends Notice {
	author: {
		id: string;
		name: string | null;
		image: string | null;
	};
}

interface NoticePayload extends Partial<Notice> {
	title: string;
	content: string;
}

export const useNotices = (params?: {
	important?: boolean;
	active?: boolean;
	limit?: number;
}) => {
	const queryString = new URLSearchParams();
	if (params?.important) queryString.append("important", "true");
	if (params?.active) queryString.append("active", "true");
	if (params?.limit) queryString.append("limit", params.limit.toString());

	return useQuery<NoticeWithAuthor[]>({
		queryKey: ["notices", params],
		queryFn: async () => {
			const response = await axios.get(`/api/notices?${queryString}`);
			return response.data;
		},
	});
};

export const useNotice = (id: string | null) => {
	return useQuery<NoticeWithAuthor>({
		queryKey: ["notice", id],
		queryFn: async () => {
			const response = await axios.get(`/api/notices/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
};

export const useUpsertNotice = () => {
	return useMutation<Notice, Error, NoticePayload>({
		mutationFn: async (data: NoticePayload) => {
			if (data.id) {
				const response = await axios.put(`/api/notices/${data.id}`, data);
				return response.data;
			}
			const response = await axios.post("/api/notices", data);
			return response.data;
		},
	});
};

export const useDeleteNotice = () => {
	return useMutation<void, Error, string>({
		mutationFn: async (id: string) => {
			await axios.delete(`/api/notices/${id}`);
		},
	});
};
