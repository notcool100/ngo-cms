"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/lib/contexts/site-settings-context";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "About Us", href: "/about" },
	{ name: "Programs", href: "/programs" },
	{ name: "Publications", href: "/publications" },
	{ name: "Media", href: "/media" },
	{ name: "Events", href: "/events" },
	// { name: "Blog", href: "/blog" },
	{ name: "Volunteer", href: "/volunteer" },
	{ name: "Contact", href: "/contact" },
];

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();
	const { settings } = useSiteSettings();

	// Handle scroll effect for header
	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			if (offset > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<motion.header
			className={cn(
				"sticky top-0 z-50 w-full transition-all duration-300",
				scrolled ? "bg-white shadow-sm" : "bg-white/95 shadow-sm",
			)}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="container flex h-20 items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center space-x-3">
						<div className="relative h-10 w-10 overflow-hidden rounded-full">
							<Image
								src="/uploads/logo.jpg"
								alt={settings?.siteName || "IWLAG Logo"}
								fill
								className="object-cover"
								sizes="40px"
								priority
							/>
						</div>
						<motion.span
							className="text-xl font-bold text-gray-800"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							{settings?.siteName || "IWLAG"}
						</motion.span>
					</Link>
				</div>

				<nav className="hidden md:flex gap-8">
					{navigation.map((item, index) => (
						<motion.div
							key={`desktop-nav-${item.name}-${index}`}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 * index }}
						>
							<Link
								href={item.href}
								className={cn(
									"relative text-sm font-medium transition-colors hover:text-primary py-2",
									pathname === item.href
										? "text-primary"
										: scrolled
											? "text-gray-800"
											: "text-gray-800",
								)}
								aria-current={pathname === item.href ? "page" : undefined}
							>
								{item.name}
								{pathname === item.href && (
									<motion.div
										className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
										layoutId="navbar-indicator"
										transition={{ type: "spring", stiffness: 350, damping: 30 }}
									/>
								)}
							</Link>
						</motion.div>
					))}
				</nav>

				<div className="hidden md:flex items-center gap-4">
					{/* <Link href="/donate">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default" 
                size="sm"
                className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </Button>
            </motion.div>
          </Link> */}
					<Link
						href="/admin"
						className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
					>
						Admin
					</Link>
				</div>

				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button
							variant={scrolled ? "outline" : "ghost"}
							size="icon"
							className="h-9 w-9 rounded-full"
							aria-label="Toggle menu"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="w-full max-w-xs sm:max-w-sm border-l"
					>
						<div className="flex justify-between items-center mb-8 mt-2">
							<div className="flex items-center gap-2">
								<div className="relative h-8 w-8 overflow-hidden rounded-full">
									<Image
										src="/uploads/logo.jpg"
										alt={settings?.siteName || "IWLAG Logo"}
										fill
										className="object-cover"
										sizes="32px"
									/>
								</div>
								<span className="text-lg font-bold text-gray-800">
									{settings?.siteName || "IWLAG"}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full"
								onClick={() => setIsOpen(false)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div className="flex flex-col gap-6">
							<AnimatePresence>
								{navigation.map((item, index) => (
									<motion.div
										key={`nav-${item.name}-${index}`}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ delay: 0.05 * index }}
									>
										<Link
											href={item.href}
											className={cn(
												"flex items-center text-base font-medium transition-colors hover:text-primary py-2",
												pathname === item.href
													? "text-primary"
													: "text-gray-800",
											)}
											onClick={() => setIsOpen(false)}
										>
											{item.name}
											{pathname === item.href && (
												<motion.div className="ml-2 h-1 w-1 rounded-full bg-primary" />
											)}
										</Link>
									</motion.div>
								))}
							</AnimatePresence>

							<div className="flex flex-col gap-3 mt-4 pt-6 border-t">
								<Link href="/donate" onClick={() => setIsOpen(false)}>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											variant="default"
											className="w-full rounded-full gap-2 bg-gradient-to-r from-primary to-primary/90"
										>
											<Heart className="h-4 w-4" />
											Donate Now
										</Button>
									</motion.div>
								</Link>
								<Link href="/admin" onClick={() => setIsOpen(false)}>
									<Button variant="outline" className="w-full rounded-full">
										Admin Login
									</Button>
								</Link>
							</div>

							<div className="mt-auto pt-6">
								<div className="flex justify-center space-x-4">
									<a
										href="#"
										className="text-gray-700 hover:text-primary transition-colors"
									>
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
										</svg>
									</a>
								</div>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</motion.header>
	);
}
