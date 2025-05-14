import { Notice } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface NoticePayload extends Partial<Notice> {
	title: string;
	content: string;
}

export const useNotices = () => {
	return useQuery({
		queryKey: ["notices"],
		queryFn: async () => {
			const response = await axios.get("/api/notices");
			return response.data;
		},
	});
};

export const useNotice = (id: string | null) => {
	return useQuery({
		queryKey: ["notice", id],
		queryFn: async () => {
			if (!id || id === "new") return null;
			const response = await axios.get(`/api/notices/${id}`);
			return response.data;
		},
		enabled: !!id && id !== "new",
	});
};

export const useUpsertNotice = () => {
	return useMutation({
		mutationFn: async (data: NoticePayload) => {
			if (data.id) {
				const response = await axios.patch(`/api/notices/${data.id}`, data);
				return response.data;
			}
			const response = await axios.post("/api/notices", data);
			return response.data;
		},
	});
};

export const useDeleteNotice = () => {
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axios.delete(`/api/notices/${id}`);
			return response.data;
		},
	});
};
