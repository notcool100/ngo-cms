"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SiteSettingsProvider } from "@/lib/contexts/site-settings-context";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<SiteSettingsProvider>
				{children}
			</SiteSettingsProvider>
		</SessionProvider>
	);
}
