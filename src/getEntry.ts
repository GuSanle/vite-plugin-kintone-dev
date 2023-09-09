import { type UserConfig } from "vite";
import path from "node:path";
import fs from "node:fs";

export default function getEntry(config: UserConfig) {
  let entry: string | string[] | { [entryAlias: string]: string } =
    "src/main.ts";

  // 如果设置了input，则使用设置的值（包括多入口）需要做window的路径判断
  const possibleEntries = [
    "src/main.ts",
    "src/main.js",
    "src/main.jsx",
    "src/main.tsx",
  ];

  if (config.build?.rollupOptions?.input) {
    entry = config.build.rollupOptions.input;
  } else {
    for (const possibleEntry of possibleEntries) {
      const filePath = path.resolve(possibleEntry);
      if (fs.existsSync(filePath)) {
        entry = possibleEntry;
        break;
      }
    }
  }
  return entry;
}
