import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Icons({ compiler: "jsx", jsx: "react", autoInstall: true }),
  ],
  resolve: {
    alias: {
      "file-browser": new URL("../fb/src/index.ts", import.meta.url).pathname,
    },
  },
});
