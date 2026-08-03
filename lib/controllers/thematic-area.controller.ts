/**
 * Controller for handling Thematic Area API requests
 */
import { NextResponse } from "next/server";
import { Controller } from "@/lib/interfaces/controller.interface";
import { ThematicAreaService } from "@/lib/services/thematic-area.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { BaseController } from "@/lib/controllers/base.controller";

export class ThematicAreaController extends BaseController implements Controller {
	private thematicAreaService: ThematicAreaService;

	constructor() {
		super({
			read: "about:read",
			create: "about:create",
			update: "about:update",
			delete: "about:delete",
		});

		this.thematicAreaService = new ThematicAreaService();
	}

	async getAll(request: Request): Promise<NextResponse> {
		try {
			const permissionResult = await this.checkUserPermission(request, "read");
			if (!permissionResult.success) {
				return permissionResult.response!;
			}

			const areas = await this.thematicAreaService.getAll();
			return ApiResponse.success(areas);
		} catch (error) {
			return this.handleError(error, "Failed to fetch thematic areas");
		}
	}

	async create(request: Request): Promise<NextResponse> {
		try {
			const permissionResult = await this.checkUserPermission(request, "create");
			if (!permissionResult.success) {
				return permissionResult.response!;
			}

			const data = await request.json();
			const newArea = await this.thematicAreaService.create(data);
			return ApiResponse.created(newArea);
		} catch (error) {
			return this.handleError(error, "Failed to create thematic area");
		}
	}

	async update(request: Request): Promise<NextResponse> {
		try {
			const permissionResult = await this.checkUserPermission(request, "update");
			if (!permissionResult.success) {
				return permissionResult.response!;
			}

			const data = await request.json();
			const { id, ...contentData } = data;

			if (!id) {
				return ApiResponse.badRequest("Missing id");
			}

			const updatedArea = await this.thematicAreaService.update(id, contentData);
			return ApiResponse.success(updatedArea);
		} catch (error) {
			return this.handleError(error, "Failed to update thematic area");
		}
	}

	async delete(request: Request): Promise<NextResponse> {
		try {
			const permissionResult = await this.checkUserPermission(request, "delete");
			if (!permissionResult.success) {
				return permissionResult.response!;
			}

			const { searchParams } = new URL(request.url);
			const id = searchParams.get("id");

			if (!id) {
				return ApiResponse.badRequest("Missing id parameter");
			}

			await this.thematicAreaService.delete(id);
			return ApiResponse.noContent();
		} catch (error) {
			return this.handleError(error, "Failed to delete thematic area");
		}
	}
}
