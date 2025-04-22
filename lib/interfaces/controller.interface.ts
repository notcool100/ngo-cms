/**
 * Base controller interface that all controllers should implement
 */
import { NextResponse } from "next/server";

export interface Controller {
  getAll(request: Request): Promise<NextResponse>;
  getById?(request: Request, params: { id: string }): Promise<NextResponse>;
  create(request: Request): Promise<NextResponse>;
  update(request: Request): Promise<NextResponse>;
  delete(request: Request): Promise<NextResponse>;
}

export interface PermissionRequirement {
  read: string;
  create: string;
  update: string;
  delete: string;
}