import { cn } from "@/lib/utils";

interface ContainerProps {
	children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
	return (
		<div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">{children}</div>
		</div>
	);
}
