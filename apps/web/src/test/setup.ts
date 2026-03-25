import "@testing-library/jest-dom";
import { vi } from "vitest";

// Suppress console noise from Next.js internals in tests
vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key");

// Mock next/navigation globally – modules can override per-test
vi.mock("next/navigation", async () => {
  const mod = await import("./mocks/next-navigation");
  return mod;
});

vi.mock("next/cache", async () => {
  const mod = await import("./mocks/next-cache");
  return mod;
});

vi.mock("next/headers", async () => {
  const mod = await import("./mocks/next-headers");
  return mod;
});
