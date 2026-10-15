import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // Load every .env variable (not just VITE_*) so the database test can find POSTGRES_DB_URL.
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
