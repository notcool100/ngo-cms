/**
 * Controller for handling About section API requests
 */
import { NextResponse } from "next/server";
import { Controller, PermissionRequirement } from "@/lib/interfaces/controller.interface";
import { AboutSectionService, TeamMemberService } from "@/lib/services/about.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { BaseController } from "@/lib/controllers/base.controller";

export class AboutController extends BaseController implements Controller {
  private aboutSectionService: AboutSectionService;
  private teamMemberService: TeamMemberService;

  constructor() {
    super({
      read: "about:read",
      create: "about:create",
      update: "about:update",
      delete: "about:delete"
    });
    
    this.aboutSectionService = new AboutSectionService();
    this.teamMemberService = new TeamMemberService();
  }

  async getAll(request: Request): Promise<NextResponse> {
    try {
      // Check permissions
      const permissionResult = await this.checkUserPermission(request, "read");
      if (!permissionResult.success) {
        return permissionResult.response!;
      }

      // Get query parameters
      const { searchParams } = new URL(request.url);
      const type = searchParams.get("type");

      // Fetch about sections with optional type filter
      const filter = type ? { type } : undefined;
      const sections = await this.aboutSectionService.getAll(filter);
      
      // Fetch team members
      const team = await this.teamMemberService.getAll();
      
      return ApiResponse.success({
        sections,
        team,
      });
    } catch (error) {
      return this.handleError(error, "Failed to fetch about data");
    }
  }

  async create(request: Request): Promise<NextResponse> {
    try {
      // Check permissions
      const permissionResult = await this.checkUserPermission(request, "create");
      if (!permissionResult.success) {
        return permissionResult.response!;
      }

      const data = await request.json();
      const { contentType, ...contentData } = data;

      if (contentType === "section") {
        // Create a new about section
        const newSection = await this.aboutSectionService.create(contentData);
        return ApiResponse.created(newSection);
      } else if (contentType === "team") {
        // Create a new team member
        const newTeamMember = await this.teamMemberService.create(contentData);
        return ApiResponse.created(newTeamMember);
      } else {
        return ApiResponse.badRequest("Invalid content type");
      }
    } catch (error) {
      return this.handleError(error, "Failed to create about content");
    }
  }

  async update(request: Request): Promise<NextResponse> {
    try {
      // Check permissions
      const permissionResult = await this.checkUserPermission(request, "update");
      if (!permissionResult.success) {
        return permissionResult.response!;
      }

      const data = await request.json();
      const { contentType, id, ...contentData } = data;

      if (!id) {
        return ApiResponse.badRequest("Missing id");
      }

      if (contentType === "section") {
        // Update an about section
        const updatedSection = await this.aboutSectionService.update(id, contentData);
        return ApiResponse.success(updatedSection);
      } else if (contentType === "team") {
        // Update a team member
        const updatedTeamMember = await this.teamMemberService.update(id, contentData);
        return ApiResponse.success(updatedTeamMember);
      } else {
        return ApiResponse.badRequest("Invalid content type");
      }
    } catch (error) {
      return this.handleError(error, "Failed to update about content");
    }
  }

  async delete(request: Request): Promise<NextResponse> {
    try {
      // Check permissions
      const permissionResult = await this.checkUserPermission(request, "delete");
      if (!permissionResult.success) {
        return permissionResult.response!;
      }

      const { searchParams } = new URL(request.url);
      const contentType = searchParams.get("contentType");
      const id = searchParams.get("id");

      if (!contentType) {
        return ApiResponse.badRequest("Missing contentType parameter");
      }

      // Parse and validate ID
      const idResult = this.parseId(id);
      if (!idResult.valid) {
        return idResult.response!;
      }

      if (contentType === "section") {
        // Delete an about section
        await this.aboutSectionService.delete(idResult.id!);
        return ApiResponse.noContent();
      } else if (contentType === "team") {
        // Delete a team member
        await this.teamMemberService.delete(idResult.id!);
        return ApiResponse.noContent();
      } else {
        return ApiResponse.badRequest("Invalid content type");
      }
    } catch (error) {
      return this.handleError(error, "Failed to delete about content");
    }
  }
}