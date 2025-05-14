"use client";

import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { SiteSettingsProvider } from "@/lib/contexts/site-settings-context";

export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<SessionProvider>
			<SiteSettingsProvider>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</SiteSettingsProvider>
		</SessionProvider>
	);
}
