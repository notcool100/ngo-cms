import { NextRequest, NextResponse } from "next/server";
import { settingsController } from "@/lib/controllers/settings.controller";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return settingsController.getSettings(req);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  
  switch (type) {
    case "general":
      return settingsController.updateGeneralSettings(req);
    case "notifications":
      return settingsController.updateNotificationSettings(req);
    case "advanced":
      return settingsController.updateAdvancedSettings(req);
    default:
      return NextResponse.json(
        { error: "Invalid settings type" },
        { status: 400 }
      );
  }
}