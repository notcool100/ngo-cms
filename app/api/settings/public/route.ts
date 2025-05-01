import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/lib/services/settings.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const settings = await settingsService.getSettings();
    
    // Return only the public settings that are needed for the frontend
    return NextResponse.json({
      settings: {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        maintenanceMode: settings.maintenanceMode,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}