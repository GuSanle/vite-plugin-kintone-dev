import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import kintoneDev from "vite-plugin-kintone-dev";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), kintoneDev({ platform: "PORTAL", type: "DESKTOP" })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
