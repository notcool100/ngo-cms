/**
 * Base service interface that all services should implement
 */

export interface Service<T, CreateInput, UpdateInput> {
  getAll(filter?: Record<string, any>): Promise<T[]>;
  getById?(id: number): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: number, data: UpdateInput): Promise<T>;
  delete(id: number): Promise<void>;
}