/**
 * Service for handling Thematic Area data operations
 */
import { prisma as db } from "@/lib/prisma";
import {
	ThematicArea,
	ThematicAreaCreateInput,
	ThematicAreaUpdateInput,
} from "@/lib/interfaces/thematic-area.interface";

export class ThematicAreaService {
	async getAll(filter?: Record<string, any>): Promise<ThematicArea[]> {
		const where = filter || {};
		const areas = await db.thematicArea.findMany({
			where,
			orderBy: { order: "asc" },
		});
		return areas as unknown as ThematicArea[];
	}

	async getById(id: string): Promise<ThematicArea | null> {
		const area = await db.thematicArea.findUnique({
			where: { id },
		});
		return area as unknown as ThematicArea | null;
	}

	async create(data: ThematicAreaCreateInput): Promise<ThematicArea> {
		const area = await db.thematicArea.create({
			data: data as any,
		});
		return area as unknown as ThematicArea;
	}

	async update(
		id: string,
		data: Omit<ThematicAreaUpdateInput, "id">,
	): Promise<ThematicArea> {
		const area = await db.thematicArea.update({
			where: { id },
			data: data as any,
		});
		return area as unknown as ThematicArea;
	}

	async delete(id: string): Promise<void> {
		await db.thematicArea.delete({
			where: { id },
		});
	}
}
