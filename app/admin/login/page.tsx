"use client";
import { useRouter } from "next/navigation";
import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				toast({
					title: "Error",
					description: "Invalid email or password",
					variant: "destructive",
				});
				setIsLoading(false);
				return;
			}

			toast({
				title: "Success",
				description: "Logged in successfully",
			});

			router.push("/admin/dashboard");
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-[80vh] items-center justify-center py-12">
			<div className="w-full max-w-md px-4">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold">Admin Login</h1>
					<p className="mt-2 text-muted-foreground">
						Sign in to access the admin dashboard
					</p>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Enter your credentials to access the admin panel
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Link
										href="/admin/forgot-password"
										className="text-sm text-primary hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="pr-10"
									/>
									<span
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-gray-500 text-sm"
									>
										{showPassword ? "👁️" : "🙈"}
									</span>
								</div>

							</div>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign In"}
							</Button>
						</form>
						<div className="mt-4">
							<Button
								variant="outline"
								className="w-full"
								onClick={() =>
									signIn("google", { callbackUrl: "/admin/dashboard" })
								}
							>
								Sign in with Google
							</Button>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<div className="text-center text-sm text-muted-foreground">
							<p>
								This login is restricted to authorized administrators only. If
								you need access, please contact the IT department.
							</p>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
