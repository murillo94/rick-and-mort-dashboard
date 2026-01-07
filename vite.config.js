import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
  resolve: {
    alias: {
      "@/ui": path.resolve(__dirname, "./src/app/ui"),
      "@/utils": path.resolve(__dirname, "./src/app/utils"),
      "@/data-access": path.resolve(__dirname, "./src/app/data-access"),
      "@/lib": path.resolve(__dirname, "./src/app/lib"),
    },
  },
});
