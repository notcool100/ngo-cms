/**
 * Interfaces for Thematic Area data models
 */

export interface ThematicAreaActivity {
	name: string;
	date?: string;
}

export interface ThematicAreaMilestone {
	date: string;
	title: string;
	description?: string;
}

export interface ThematicArea {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	focus?: string | null;
	activities: ThematicAreaActivity[];
	milestones: ThematicAreaMilestone[];
	featured: boolean;
	order: number;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ThematicAreaCreateInput {
	title: string;
	slug: string;
	description: string;
	content: string;
	focus?: string;
	activities?: ThematicAreaActivity[];
	milestones?: ThematicAreaMilestone[];
	featured?: boolean;
	order?: number;
	active?: boolean;
}

export interface ThematicAreaUpdateInput extends Partial<ThematicAreaCreateInput> {
	id: string;
}
