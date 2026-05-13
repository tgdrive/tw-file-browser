import { defineConfig } from "tsup";
import Icons from "unplugin-icons/esbuild";

export default defineConfig({
  clean: true,
  target: "es2019",
  format: ["esm"],
  treeshake: true,
  entry: ["src/index.ts"],
  dts: {
    compilerOptions: {
      noUnusedLocals: false,
    },
  },
  esbuildPlugins: [
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
  ],
  external: ["react", "react-dom"],
});
