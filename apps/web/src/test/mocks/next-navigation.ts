import { vi } from "vitest";

export const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}));

export const usePathname = vi.fn(() => "/");

export const useSearchParams = vi.fn(() => ({
  get: vi.fn(() => null),
  getAll: vi.fn(() => []),
  has: vi.fn(() => false),
  toString: vi.fn(() => ""),
}));
