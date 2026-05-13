import { defineConfig } from "tsup";
import Icons from "unplugin-icons/esbuild";

export default defineConfig({
  clean: true,
  target: "es2019",
  format: ["esm"],
  treeshake: true,
  entry: ["src/index.ts"],
  dts: true,
  platform: "browser",
  external: ["react", "react-dom"],
  banner: {
    js: `import * as requireReact from 'react';
var require = function(m) { if (m === 'react') return requireReact; throw new Error('Unknown module ' + m); };`,
  },
  esbuildPlugins: [
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
  ],
});
