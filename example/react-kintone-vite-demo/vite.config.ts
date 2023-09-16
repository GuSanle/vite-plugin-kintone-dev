import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import kintoneDev from "vite-plugin-kintone-dev";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), kintoneDev({ outputName: "DESKTOP" })],
});
