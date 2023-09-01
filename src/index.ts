import type { Plugin, ResolvedConfig } from "vite";
import devUpdate from "./devUpdate";
import outputClean from "./outputClean";
import getNextPort from "./getPort";
import path from "node:path";
import fs from "node:fs";
const fileName = "kintone_module_hack.js";

type Type = "DESKTOP" | "MOBILE";
type KintoneInfo = {
  url: string;
  username: string;
  password: string;
};

const kintoneModuleHack = (port: number) => {
  return `(function () {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://127.0.0.1:${port}/src/main.ts";
    document.body.appendChild(script);
  })();
  `;
};

//kintone开发时的插件。首先指定port，然后清空dist，然后写上传的js，然后上传到kintone，上传再清空dist

export default function kintoneDev(
  kintoneInfo: KintoneInfo,
  outputDir: string,
  type: Type
): Plugin {
  return {
    name: "kintone-dev",
    async configResolved(config: ResolvedConfig) {
      let port = 5173;
      port = await getNextPort(port);
      config.server.port = port;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      outputClean(outputDir);
      const fileUrl = path.resolve(outputDir, fileName);
      fs.writeFileSync(fileUrl, kintoneModuleHack(port));
      //这个文件直接替换？应该没有人用相同名字
      await devUpdate(kintoneInfo, [fileUrl], type);
      outputClean(outputDir);
    },
  };
}
