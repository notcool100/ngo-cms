import { ThematicAreaService } from "@/lib/services/thematic-area.service";
import { ApiResponse } from "@/lib/utils/api-response";

const thematicAreaService = new ThematicAreaService();

/**
 * Public API endpoint for fetching active thematic areas
 * No authentication required
 */
export async function GET() {
	try {
		const areas = await thematicAreaService.getAll({ active: true });
		return ApiResponse.success(areas);
	} catch (error) {
		console.error("Error fetching thematic areas:", error);
		return ApiResponse.error("Failed to fetch thematic areas");
	}
}
