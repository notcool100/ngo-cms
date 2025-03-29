import type React from "react";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Empower Together - Women's Empowerment NGO",
	description:
		"Empowering women through education, support, and community initiatives",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex min-h-screen flex-col">
						<Header />
						<main className="flex-1">
							{" "}
							<Providers>{children} </Providers>
						</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}

import "./globals.css";
