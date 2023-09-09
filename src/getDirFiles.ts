import path from "node:path";
import fs from "node:fs";

export default function getDirFiles(dir: string, extList: string[]) {
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
}
