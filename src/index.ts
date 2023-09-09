import { ResolvedConfig, type Plugin, ConfigEnv } from "vite";
import { OutputOptions } from "rollup";
import { devUpdate, devFileName } from "./devUpdate";
import path from "node:path";
import fs from "node:fs";
import { type TypeInput } from "kintone-types";
import kintoneModuleInject from "./kintoneModuleInject";
import getServerInfo from "./getServerInfo";
import getIndexScripts from "./getIndexScripts";
import getEnvInfo from "./getEnvInfo";
import getEntry from "./getEntry";
import getDirFiles from "./getDirFiles";

export default function kintoneDev(options: TypeInput): Plugin[] {
  let viteConfig: ResolvedConfig;
  let envConfig: ConfigEnv;

  return [
    {
      name: "vite-plugin-kintone-dev:dev",
      apply: "serve",
      enforce: "post",
      config: (config, env) => (envConfig = env),
      configResolved(config) {
        viteConfig = config;
      },
      configureServer(server) {
        server.httpServer?.once("listening", async () => {
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
            kintoneModuleInject(devServerUrl, scriptList, options.react)
          );
          const env = getEnvInfo(envConfig, viteConfig);
          if (env) {
            devUpdate(env, [fileUrl], options)
              .then((r) => {
                fs.unlinkSync(fileUrl);
              })
              .catch(() => {
                console.log("upload failed");
              });
          } else {
            console.log("env error");
          }
        });
      },
    },
    {
      name: "vite-plugin-kintone-dev:build",
      apply: "build",
      enforce: "post",
      config(config, env) {
        const entry = getEntry(config);
        envConfig = env;

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

        if (options?.build?.outputName !== undefined) {
          (
            config.build.rollupOptions?.output as OutputOptions
          ).entryFileNames = `${options?.build?.outputName}.js`;
          (config.build.rollupOptions?.output as OutputOptions).assetFileNames =
            (assetInfo): string => {
              if (assetInfo.name?.endsWith(".css")) {
                return `${options?.build?.outputName}[extname]`;
              } else {
                return assetInfo.name as string;
              }
            };
        }
      },

      configResolved(config) {
        viteConfig = config;
      },
      async closeBundle() {
        const outputDir = path.resolve(viteConfig.build.outDir);
        const extList = ["js", "css"];
        const fileList = getDirFiles(outputDir, extList);
        const env = getEnvInfo(envConfig, viteConfig);
        if (env) {
          //是否需要根据output name来判断是否进行上传？
          if (options.build?.upload) {
            devUpdate(env, fileList, options).catch(() => {
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
