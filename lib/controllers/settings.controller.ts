import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/lib/services/settings.service";
import { checkPermission } from "@/lib/api-permissions";
import { BaseController } from "./base.controller";

export class SettingsController extends BaseController {
  /**
   * Get the site settings
   */
  async getSettings(req: NextRequest): Promise<NextResponse> {
    try {
      const permissionCheck = await checkPermission("manage:settings", req);
      
      if (!permissionCheck.success) {
        return permissionCheck.response;
      }
      
      const settings = await settingsService.getSettings();
      
      return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update general settings
   */
  async updateGeneralSettings(req: NextRequest): Promise<NextResponse> {
    try {
      const permissionCheck = await checkPermission("manage:settings", req);
      
      if (!permissionCheck.success) {
        return permissionCheck.response;
      }
      
      const data = await req.json();
      
      // Validate required fields
      if (!data.siteName || !data.siteDescription || !data.contactEmail) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      const settings = await settingsService.updateGeneralSettings({
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        contactEmail: data.contactEmail,
        maintenanceMode: !!data.maintenanceMode,
      });
      
      return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(req: NextRequest): Promise<NextResponse> {
    try {
      const permissionCheck = await checkPermission("manage:settings", req);
      
      if (!permissionCheck.success) {
        return permissionCheck.response;
      }
      
      const data = await req.json();
      
      const settings = await settingsService.updateNotificationSettings({
        emailNotifications: !!data.emailNotifications,
        donationAlerts: !!data.donationAlerts,
        volunteerAlerts: !!data.volunteerAlerts,
        contactFormAlerts: !!data.contactFormAlerts,
      });
      
      return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update advanced settings
   */
  async updateAdvancedSettings(req: NextRequest): Promise<NextResponse> {
    try {
      const permissionCheck = await checkPermission("manage:settings", req);
      
      if (!permissionCheck.success) {
        return permissionCheck.response;
      }
      
      const data = await req.json();
      
      // Validate required fields
      if (!data.backupFrequency || !data.cacheLifetime) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      const settings = await settingsService.updateAdvancedSettings({
        backupFrequency: data.backupFrequency,
        cacheLifetime: parseInt(data.cacheLifetime, 10),
        debugMode: !!data.debugMode,
      });
      
      return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const settingsController = new SettingsController();