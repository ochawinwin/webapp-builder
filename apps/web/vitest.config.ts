import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/app/actions/**/*.ts",
        "src/lib/data/**/*.ts",
        "src/components/**/*.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Mock next/navigation
      "next/navigation": path.resolve(
        __dirname,
        "./src/test/mocks/next-navigation.ts"
      ),
      "next/cache": path.resolve(__dirname, "./src/test/mocks/next-cache.ts"),
      "next/headers": path.resolve(__dirname, "./src/test/mocks/next-headers.ts"),
    },
  },
});
