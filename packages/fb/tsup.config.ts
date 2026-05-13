import { defineConfig } from "tsup";
import Icons from "unplugin-icons/esbuild";

export default defineConfig({
  clean: true,
  target: "es2019",
  format: ["esm"],
  treeshake: true,
  entry: ["src/index.ts"],
  dts: true,
  esbuildPlugins: [
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
  ],
});
