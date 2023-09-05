import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  outDir: "dist",
  clean: true,
});
