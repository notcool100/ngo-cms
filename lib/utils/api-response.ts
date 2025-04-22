/**
 * Utility functions for standardizing API responses
 */
import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ data, success: true }, { status });
  }

  static created<T>(data: T): NextResponse {
    return this.success(data, 201);
  }

  static noContent(): NextResponse {
    return NextResponse.json({}, { status: 204 });
  }

  static badRequest(message = "Bad Request"): NextResponse {
    return this.error(message, 400);
  }

  static unauthorized(message = "Unauthorized"): NextResponse {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden"): NextResponse {
    return this.error(message, 403);
  }

  static notFound(message = "Not Found"): NextResponse {
    return this.error(message, 404);
  }

  static error(message: string, status = 500): NextResponse {
    return NextResponse.json({ error: message, success: false }, { status });
  }
}