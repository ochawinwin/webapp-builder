import { vi } from "vitest";

/**
 * Creates a chainable Supabase query mock.
 * Each method returns `this` so you can chain .eq().single() etc.
 * The terminal methods (single, maybeSingle) resolve to `resolvedValue`.
 */
export function createQueryMock(resolvedValue: {
  data: unknown;
  error: unknown;
  count?: number | null;
}) {
  const mock: Record<string, unknown> = {};
  const chain = () => mock;

  mock.select = vi.fn(chain);
  mock.insert = vi.fn(chain);
  mock.update = vi.fn(chain);
  mock.delete = vi.fn(chain);
  mock.upsert = vi.fn(chain);
  mock.eq = vi.fn(chain);
  mock.neq = vi.fn(chain);
  mock.in = vi.fn(chain);
  mock.ilike = vi.fn(chain);
  mock.order = vi.fn(chain);
  mock.range = vi.fn(chain);
  mock.limit = vi.fn(chain);
  mock.filter = vi.fn(chain);

  mock.single = vi.fn(async () => resolvedValue);
  mock.maybeSingle = vi.fn(async () => ({
    data: resolvedValue.data ? resolvedValue.data : null,
    error: resolvedValue.error,
  }));

  // Make the mock itself awaitable (for non-terminal chains)
  // e.g. `await supabase.from("x").insert(...)` (no .single())
  // We attach a then so the mock resolves when awaited directly.
  (mock as { then?: unknown }).then = (
    resolve: (v: { data: unknown; error: unknown; count?: number | null }) => void
  ) => resolve(resolvedValue);

  return mock;
}

/**
 * Creates a full mock Supabase client.
 * Pass `tables` as a map of tableName → query mock config.
 */
export function createSupabaseMock(config: {
  authUser?: { id: string; email: string } | null;
  authError?: unknown;
  signInResult?: { error: unknown };
  signUpResult?: { data: { user: { id: string } | null }; error: unknown };
  signOutResult?: { error: unknown };
  tables?: Record<
    string,
    { data: unknown; error: unknown; count?: number | null }
  >;
}) {
  const {
    authUser = null,
    authError = null,
    signInResult = { error: null },
    signUpResult = { data: { user: null }, error: null },
    signOutResult = { error: null },
    tables = {},
  } = config;

  const client = {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: authUser },
        error: authError,
      })),
      signInWithPassword: vi.fn(async () => signInResult),
      signUp: vi.fn(async () => signUpResult),
      signOut: vi.fn(async () => signOutResult),
      admin: {
        getUserById: vi.fn(async () => ({
          data: { user: authUser ? { ...authUser } : null },
          error: null,
        })),
      },
    },
    from: vi.fn((tableName: string) => {
      const tableConfig = tables[tableName] ?? { data: null, error: null };
      return createQueryMock(tableConfig);
    }),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(async () => ({ data: { path: "test/file.pdf" }, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://test.url/file.pdf" } })),
        createSignedUrl: vi.fn(async () => ({
          data: { signedUrl: "https://test.url/signed/file.pdf" },
          error: null,
        })),
      })),
    },
  };

  return client;
}
