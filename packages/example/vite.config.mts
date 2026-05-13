import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "file-browser": new URL(
        "../fb/dist/index.mjs",
        import.meta.url,
      ).pathname,
    },
  },
});
