import { ResolvedConfig, type Plugin, ConfigEnv } from "vite";
import { OutputOptions } from "rollup";
import { devUpdate, devFileName } from "./devUpdate";
import path from "node:path";
import fs from "node:fs";
import kintoneModuleInject from "./kintoneModuleInject";
import getServerInfo from "./getServerInfo";
import getIndexScripts from "./getIndexScripts";
import { validateEnv, checkEnv } from "./getEnvInfo";
import getEntry from "./getEntry";
import getDirFiles from "./getDirFiles";
import { TypeInput } from "kintone-types";

export default function kintoneDev(options?: TypeInput): Plugin[] {
  let viteConfig: ResolvedConfig;
  let envConfig: ConfigEnv;

  return [
    {
      name: "vite-plugin-kintone-dev:dev",
      apply: "serve",
      enforce: "post",
      config: (config, env) => (envConfig = env),
      async configResolved(config) {
        await checkEnv(envConfig, config);
        viteConfig = config;
      },
      configureServer(server) {
        server.httpServer?.once("listening", async () => {
          const { isEnvOk, env } = validateEnv(envConfig, viteConfig);
          if (!isEnvOk) {
            console.log("env error");
            return;
          }
          const devServerUrl = getServerInfo(server);
          if (!server.config.server.origin) {
            server.config.server.origin = devServerUrl;
          }
          const outputDir = path.resolve(viteConfig.build.outDir);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
          }
          const scriptList = getIndexScripts();
          const fileUrl = path.resolve(outputDir, devFileName);

          fs.writeFileSync(
            fileUrl,
            kintoneModuleInject(
              devServerUrl,
              scriptList,
              env.VITE_KINTONE_REACT === "true" ? true : false
            )
          );
          devUpdate(env, [fileUrl]).then((r) => {
            fs.unlinkSync(fileUrl);
          });
        });
      },
    },
    {
      name: "vite-plugin-kintone-dev:build",
      apply: "build",
      enforce: "post",
      config(config, env) {
        envConfig = env;
        const entry = getEntry(config);
        config.build = {
          modulePreload: { polyfill: false },
          manifest: true,
          cssCodeSplit: false,
          rollupOptions: {
            input: entry,
            output: {
              format: "iife",
            },
          },
        };

        if (options?.outputName !== undefined) {
          (
            config.build.rollupOptions?.output as OutputOptions
          ).entryFileNames = `${options?.outputName}.js`;
          (config.build.rollupOptions?.output as OutputOptions).assetFileNames =
            (assetInfo): string => {
              if (assetInfo.name?.endsWith(".css")) {
                return `${options?.outputName}[extname]`;
              } else {
                return assetInfo.name as string;
              }
            };
        }
      },
      async configResolved(config) {
        await checkEnv(envConfig, config);
        viteConfig = config;
      },
      async closeBundle() {
        const outputDir = path.resolve(viteConfig.build.outDir);
        const extList = ["js", "css"];
        const fileList = getDirFiles(outputDir, extList);
        const { isEnvOk, env } = validateEnv(envConfig, viteConfig);
        if (isEnvOk) {
          //是否需要根据output name来判断是否进行上传？
          if (options?.upload) {
            devUpdate(env, fileList).catch(() => {
              console.log("upload failed");
            });
          }
        } else {
          console.log("env error");
        }
      },
    },
  ];
}
