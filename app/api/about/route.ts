import {
	AboutSectionService,
	TeamMemberService,
} from "@/lib/services/about.service";
import { ApiResponse } from "@/lib/utils/api-response";

// Initialize services
const aboutSectionService = new AboutSectionService();
const teamMemberService = new TeamMemberService();

/**
 * Public API endpoint for fetching about data
 * No authentication required
 */
export async function GET(request: Request) {
	try {
		// Get query parameters
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type");
		// Fetch about sections with optional type filter
		const filter: Record<string, unknown> = { active: true };
		if (type) {
			filter.type = type;
		}
		const sections = await aboutSectionService.getAll(filter);

		// Fetch team members (only active ones for public API)
		const team = await teamMemberService.getAll({ active: true });

		return ApiResponse.success({
			sections,
			team,
		});
	} catch (error) {
		console.error("Error fetching about data:", error);
		return ApiResponse.error("Failed to fetch about data");
	}
}
