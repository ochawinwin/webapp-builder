// Client (browser) — use in Client Components
export { createBrowserClient } from "./client";

// Server — use in Server Components, Server Actions, Route Handlers
export { createServerClient } from "./server";

// Middleware — use in middleware.ts
export { createMiddlewareClient } from "./middleware";

// Database types — re-export for consumers
export type { Database, Json } from "./database.types";
