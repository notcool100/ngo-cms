/**
 * Base controller with common functionality for all controllers
 */
import { NextResponse } from "next/server";
import { checkPermission } from "@/lib/api-permissions";
import { ApiResponse } from "@/lib/utils/api-response";
import { PermissionRequirement } from "@/lib/interfaces/controller.interface";

export abstract class BaseController {
  protected permissions: PermissionRequirement;

  constructor(permissions: PermissionRequirement) {
    this.permissions = permissions;
  }

  /**
   * Check if the user has the required permission
   */
  protected async checkUserPermission(request: Request, permissionType: keyof PermissionRequirement): Promise<{
    success: boolean;
    response?: NextResponse;
  }> {
    const permission = this.permissions[permissionType];
    const permissionCheck = await checkPermission(request, permission);
    
    if (!permissionCheck.success) {
      return {
        success: false,
        response: ApiResponse.forbidden(permissionCheck.error),
      };
    }
    
    return { success: true };
  }

  /**
   * Handle API errors consistently
   */
  protected handleError(error: unknown, message: string): NextResponse {
    console.error(`${message}:`, error);
    return ApiResponse.error(message);
  }

  /**
   * Parse and validate ID from request parameters
   */
  protected parseId(id: string | null): { valid: boolean; id?: number; response?: NextResponse } {
    if (!id) {
      return { 
        valid: false, 
        response: ApiResponse.badRequest("Missing id parameter") 
      };
    }

    const numericId = Number.parseInt(id);
    if (isNaN(numericId)) {
      return { 
        valid: false, 
        response: ApiResponse.badRequest("Invalid id format") 
      };
    }

    return { valid: true, id: numericId };
  }
}