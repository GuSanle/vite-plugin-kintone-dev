import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import kintoneDev from "./vite-plugin/index";
import kintoneDev from "vite-plugin-kintone-dev";

type TypeInput = {
  platform: "APP" | "PORTAL";
  type: "DESKTOP" | "MOBILE";
};

const inputType: TypeInput = {
  platform: "PORTAL",
  type: "DESKTOP",
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), kintoneDev(inputType)],
});
