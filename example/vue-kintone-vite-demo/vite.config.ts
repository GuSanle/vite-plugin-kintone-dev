import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import kintoneDev from "vite-plugin-kintone-dev";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    kintoneDev({ outputName: "DESKTOP" }),
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
