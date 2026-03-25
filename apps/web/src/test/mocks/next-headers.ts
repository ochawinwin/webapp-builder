import { vi } from "vitest";

export const cookies = vi.fn(() => ({
  get: vi.fn(),
  getAll: vi.fn(() => []),
  set: vi.fn(),
  delete: vi.fn(),
  has: vi.fn(() => false),
}));

export const headers = vi.fn(() => new Headers());
