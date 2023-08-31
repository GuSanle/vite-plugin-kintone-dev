import fs from "node:fs";
import path from "node:path";

const { join } = path;
const { existsSync, readdirSync, statSync, unlinkSync, rmdirSync } = fs;

export default function outputClean(outputDir: string) {
  if (existsSync(outputDir)) {
    let files = readdirSync(outputDir);
    files.forEach((file) => {
      let filePath = join(outputDir, file);
      if (statSync(filePath).isDirectory()) {
        outputClean(filePath);
        rmdirSync(filePath);
      } else {
        unlinkSync(filePath);
      }
    });
  }
}
