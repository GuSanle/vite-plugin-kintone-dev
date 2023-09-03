import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entryPoints: ["src/index.ts"],
  // external: ["axios", "lodash-es"],
  format: ["cjs", "esm"],
  // minify: true,
  outDir: "dist",
  clean: true,
});
