import kintoneApi from "./kintoneApi";
import logger from "./logger";
import path from "node:path";
const devFileName = "kintone_module_hack.js";

type Type = "DESKTOP" | "MOBILE" | "DESKTOP_CSS" | "MOBILE_CSS";
type TypeInput = "DESKTOP" | "MOBILE";
type JsList = {
  DESKTOP: string[];
  MOBILE: string[];
  DESKTOP_CSS: string[];
  MOBILE_CSS: string[];
};
type KintoneInfo = {
  url: string;
  username: string;
  password: string;
};

const urlPrefix = (url: string) => {
  if (
    url.substring(0, 7).toLowerCase() == "http://" ||
    url.substring(0, 8).toLowerCase() == "https://"
  ) {
    url = url;
  } else {
    url = "https://" + url;
  }
  return url;
};

//步骤：上传文件，获取系统设置，准备新的自定义文件列表，更新系统设置
export default async function devUpdate(
  kintoneInfo: KintoneInfo,
  fileList: Array<string>,
  type: TypeInput
) {
  const { url, username, password } = kintoneInfo;
  const k = new kintoneApi(urlPrefix(url), username, password);
  try {
    //上传文件
    const fileNameList = fileList.map((filePath) => path.basename(filePath));
    const uploadPromise = await Promise.all(
      fileList.map((filePath) => {
        return k.uploadFile(filePath, path.basename(filePath));
      })
    );

    let jsList: JsList = {
      DESKTOP: [],
      MOBILE: [],
      DESKTOP_CSS: [],
      MOBILE_CSS: [],
    };

    //准备构建好的文件
    for (const index in uploadPromise) {
      const { fileKey } = uploadPromise[index];
      const fileType: Type =
        path.extname(fileNameList[index]).slice(1) === "js"
          ? type
          : `${type}_CSS`;
      jsList[fileType].push(fileKey);
    }
    //获取自定义设置
    const systemSetting = await k.getSystemSetting();
    const { scripts, scope } = systemSetting.result;

    //补充之前的自定义配置，排除老的构建文件
    scripts.forEach((setting) => {
      const { locationType, type, name, contentUrl, contentId } = setting;
      if (locationType === "URL") {
        jsList[type as Type].push(contentUrl);
      } else if (locationType === "BLOB") {
        if (!fileNameList.includes(name) && name !== devFileName) {
          jsList[type as Type].push(contentId);
        }
      }
    });

    const jsFiles = [
      { jsType: "DESKTOP", fileKeys: jsList["DESKTOP"] },
      { jsType: "MOBILE", fileKeys: jsList["MOBILE"] },
      { jsType: "DESKTOP_CSS", fileKeys: jsList["DESKTOP_CSS"] },
      { jsType: "MOBILE_CSS", fileKeys: jsList["MOBILE_CSS"] },
    ];
    //更新系统设置
    await k.updateSystemSetting(scope, jsFiles);
    return logger.info("file update success");
  } catch (err) {
    return logger.info(err as string);
  }
}
