import { ResolvedConfig, type Plugin, loadEnv, normalizePath } from "vite";
import devUpdate from "./devUpdate";
import path from "node:path";
import fs from "node:fs";
import { load } from "cheerio";
const fileName = "kintone_module_hack.js";
import {
  type EnvSetting,
  type TypeInput,
  type ScriptList,
} from "kintone-types";

//类型守卫函数
function isEnvSetting(obj: any): obj is EnvSetting {
  return (
    obj &&
    typeof obj.VITE_KINTONE_URL === "string" &&
    typeof obj.VITE_KINTONE_USER_NAME === "string" &&
    typeof obj.VITE_KINTONE_PASSWORD === "string" &&
    (typeof obj.VITE_KINTONE_APP === "undefined" ||
      typeof obj.VITE_KINTONE_APP === "string")
  );
}

const getIndexHtmlContent = () => {
  const url = path.resolve("index.html");
  const htmlContent = fs.readFileSync(url, "utf-8");

  const $ = load(htmlContent);
  const scriptTags = $("body script");

  const scriptList: ScriptList = [];
  scriptTags.each((index, element) => {
    const data = {
      type: $(element).attr("type"),
      src: $(element).attr("src"),
    };
    scriptList.push(data);
  });
  return scriptList;
};

const kintoneModuleHack = (devServerUrl: string, scriptList: ScriptList) => {
  return `(function () {
    const scriptList = ${JSON.stringify(scriptList)};
    function loadScript(src,type) {
      const script = document.createElement("script");
      script.type = type;
      script.src = "${devServerUrl}"+src;
      document.body.appendChild(script);
    }
    for (const script of scriptList){
      const {src,type}=script
      loadScript(src,type)
    }
  })();
  `;
};

const getDirFiles = (dir: string, extList: string[]) => {
  let result: string[] = [];
  let files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    const filepath = path.join(dir, file.name);
    const ext = path.extname(filepath).slice(1);
    if (file.isFile() && extList.includes(ext)) {
      result.push(filepath);
    } else if (file.isDirectory()) {
      result.push(...getDirFiles(filepath, extList));
    }
  });
  return result;
};

export default function kintoneDev(inputType: TypeInput): Plugin[] {
  let viteConfig: ResolvedConfig;
  const validateEnv = (viteConfig: ResolvedConfig): EnvSetting | undefined => {
    const resolvedRoot = normalizePath(
      viteConfig.root ? path.resolve(viteConfig.root) : process.cwd()
    );

    const envDir = viteConfig.envDir
      ? normalizePath(path.resolve(resolvedRoot, viteConfig.envDir))
      : resolvedRoot;

    const env = loadEnv("", envDir, viteConfig.envPrefix);
    return isEnvSetting(env) ? env : undefined;
  };
  return [
    {
      name: "vite-plugin-kintone-dev:dev",
      apply: "serve",
      enforce: "post", // 指定运行顺序
      configResolved(config) {
        viteConfig = config;
      },
      configureServer(server) {
        server.httpServer?.once("listening", () => {
          const outputDir = path.resolve(viteConfig.build.outDir);
          const address = server.httpServer?.address();
          if (!address || typeof address === "string") {
            console.error("Unexpected dev server address", address);
            process.exit(1);
          }
          const protocol = server.config.server.https ? "https" : "http";
          const host = address.address;
          const port = address.port;
          const devServerUrl = `${protocol}://${host}:${port}`;
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
          }
          const fileUrl = path.resolve(outputDir, fileName);

          const scriptList = getIndexHtmlContent();

          fs.writeFileSync(
            fileUrl,
            kintoneModuleHack(devServerUrl, scriptList)
          );

          const env = validateEnv(viteConfig);

          if (env) {
            devUpdate(env, [fileUrl], inputType).then((r) => {
              fs.unlinkSync(fileUrl);
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
      config: () => ({
        build: {
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              format: "iife",
            },
          },
        },
      }),
      configResolved(config) {
        viteConfig = config;
      },
      async closeBundle() {
        const outputDir = path.resolve(viteConfig.build.outDir);
        const extList = ["js", "css"];
        const fileList = getDirFiles(outputDir, extList);
        const env = validateEnv(viteConfig);
        if (env) {
          devUpdate(env, fileList, inputType);
        } else {
          console.log("env error");
        }
      },
    },
  ];
}
