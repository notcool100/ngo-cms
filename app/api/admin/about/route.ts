import { AboutController } from "@/lib/controllers/about.controller";

// Initialize the controller
const aboutController = new AboutController();

// GET - Fetch all about sections and team members
export async function GET(request: Request) {
    return aboutController.getAll(request);
}

// POST - Create a new about section or team member
export async function POST(request: Request) {
    return aboutController.create(request);
}

// PUT - Update an existing about section or team member
export async function PUT(request: Request) {
    return aboutController.update(request);
}

// DELETE - Delete an about section or team member
export async function DELETE(request: Request) {
    return aboutController.delete(request);
}
