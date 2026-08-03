import { ThematicAreaController } from "@/lib/controllers/thematic-area.controller";

const thematicAreaController = new ThematicAreaController();

// GET - Fetch all thematic areas (admin)
export async function GET(request: Request) {
	return thematicAreaController.getAll(request);
}

// POST - Create a new thematic area
export async function POST(request: Request) {
	return thematicAreaController.create(request);
}

// PUT - Update an existing thematic area
export async function PUT(request: Request) {
	return thematicAreaController.update(request);
}

// DELETE - Delete a thematic area
export async function DELETE(request: Request) {
	return thematicAreaController.delete(request);
}
