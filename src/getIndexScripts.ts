import path from "node:path";
import fs from "node:fs";
import { load } from "cheerio";
import { type ScriptList } from "kintone-types";

export default function getIndexScripts(): ScriptList {
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
}
