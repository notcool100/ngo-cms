"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

interface Milestone {
	date: string;
	title: string;
	description?: string;
}

interface ThematicArea {
	slug: string;
	title: string;
	description: string;
	focus?: string | null;
	milestones: readonly Milestone[];
}

interface ThematicAreaTimelineProps {
	areas: readonly ThematicArea[];
}

export function ThematicAreaTimeline({ areas }: ThematicAreaTimelineProps) {
	const [activeSlug, setActiveSlug] = React.useState<string | null>(null);
	const activeArea = areas.find((area) => area.slug === activeSlug) ?? null;

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2">
				{areas.map((area) => (
					<button
						key={area.slug}
						type="button"
						onClick={() => setActiveSlug(area.slug)}
						className="group rounded-2xl bg-primary/5 px-5 py-4 text-left text-sm text-foreground transition-colors hover:bg-primary/10"
					>
						<div className="mb-2 flex items-center justify-between gap-2">
							<h4 className="text-base font-semibold">{area.title}</h4>
							{area.milestones.length > 0 && (
								<Badge variant="secondary" className="shrink-0">
									{area.milestones.length} milestones
								</Badge>
							)}
						</div>
						<p className="line-clamp-3 text-muted-foreground">
							{area.description}
						</p>
						{area.focus && (
							<p className="mt-2 text-xs font-medium text-primary">
								Focus: {area.focus}
							</p>
						)}
						<span className="mt-3 inline-block text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
							View timeline →
						</span>
					</button>
				))}
			</div>

			<Dialog
				open={activeArea !== null}
				onOpenChange={(open) => !open && setActiveSlug(null)}
			>
				<DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
					{activeArea && (
						<>
							<DialogHeader>
								<DialogTitle>{activeArea.title}</DialogTitle>
								<DialogDescription>{activeArea.description}</DialogDescription>
							</DialogHeader>

							{activeArea.milestones.length > 0 ? (
								<ol className="relative mt-4 space-y-8 border-l border-muted/40 pl-6">
									{activeArea.milestones.map((milestone, index) => (
										<li key={`${milestone.title}-${index}`} className="relative">
											<span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-white" />
											<Badge variant="secondary" className="mb-2">
												{milestone.date}
											</Badge>
											<h4 className="font-semibold text-foreground">
												{milestone.title}
											</h4>
											{milestone.description && (
												<p className="mt-1 text-sm text-muted-foreground">
													{milestone.description}
												</p>
											)}
										</li>
									))}
								</ol>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">
									Detailed milestones for this area are coming soon.
								</p>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
