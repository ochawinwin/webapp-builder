import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@futurecareer/types": path.resolve(__dirname, "../../packages/types/src"),
      "@futurecareer/supabase": path.resolve(__dirname, "../../packages/supabase/src"),
      "@futurecareer/supabase/client": path.resolve(__dirname, "../../packages/supabase/src/client"),
    },
  },
});
