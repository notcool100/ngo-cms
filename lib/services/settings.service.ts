import prisma from "@/lib/prisma";
import type { SiteSettings } from "@prisma/client";

export class SettingsService {
  /**
   * Get the site settings
   * If no settings exist, create default settings
   */
  async getSettings(): Promise<SiteSettings> {
    // Get the first settings record or create it if it doesn't exist
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      return this.createDefaultSettings();
    }
    
    return settings;
  }

  /**
   * Create default settings
   */
  async createDefaultSettings(): Promise<SiteSettings> {
    return prisma.siteSettings.create({
      data: {
        siteName: "INWOLAG",
        siteDescription: "Empowering women through education and support",
        contactEmail: "contact@empowertogether.org",
        maintenanceMode: false,
        backupFrequency: "weekly",
        cacheLifetime: 3600,
        debugMode: false,
        emailNotifications: true,
        donationAlerts: true,
        volunteerAlerts: true,
        contactFormAlerts: true,
      },
    });
  }

  /**
   * Update general settings
   */
  async updateGeneralSettings(data: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
  }): Promise<SiteSettings> {
    const settings = await this.getSettings();
    
    return prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(data: {
    emailNotifications: boolean;
    donationAlerts: boolean;
    volunteerAlerts: boolean;
    contactFormAlerts: boolean;
  }): Promise<SiteSettings> {
    const settings = await this.getSettings();
    
    return prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  }

  /**
   * Update advanced settings
   */
  async updateAdvancedSettings(data: {
    backupFrequency: string;
    cacheLifetime: number;
    debugMode: boolean;
  }): Promise<SiteSettings> {
    const settings = await this.getSettings();
    
    return prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  }
}

export const settingsService = new SettingsService();