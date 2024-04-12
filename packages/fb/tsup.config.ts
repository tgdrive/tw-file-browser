import { defineConfig } from "tsup";
import Icons from "unplugin-icons/esbuild";
export default defineConfig({
  clean: true,
  target: "es2019",
  format: ["esm"],
  treeshake: true,
  dts: true,
  entry: ["src/index.ts"],
  esbuildPlugins: [
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
  ],
});
