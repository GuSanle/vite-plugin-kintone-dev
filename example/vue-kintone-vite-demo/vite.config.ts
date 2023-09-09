import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import kintoneDev from "./vite-plugin-kintone-dev";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

// https://vitejs.dev/config/
export default defineConfig({
  //不知道为何不生效？？
  // server: {
  //   origin: "http://localhost:8080",
  // },
  // build: {
  //   modulePreload: { polyfill: false },
  //   // 在 outDir 中生成 manifest.json
  //   manifest: true,
  //   rollupOptions: {
  //     // 覆盖默认的 .html 入口
  //     input: "src/main.ts",
  //   },
  // },
  plugins: [
    vue(),
    kintoneDev({ platform: "PORTAL", type: "DESKTOP" }),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons({
      autoInstall: true,
      customCollections: {
        "my-icons": FileSystemIconLoader("./src/assets"),
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
