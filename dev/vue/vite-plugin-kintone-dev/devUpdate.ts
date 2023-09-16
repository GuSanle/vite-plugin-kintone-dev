import kintoneApi from "./kintoneApi";
import path from "node:path";

import type { Type, EnvSetting, JsList } from "kintone-types";

export const devFileName = "vite_plugin_kintone_dev_module_hack.js";

function urlPrefix(url: string) {
  if (
    url.substring(0, 7).toLowerCase() == "http://" ||
    url.substring(0, 8).toLowerCase() == "https://"
  ) {
    url = url;
  } else {
    url = "https://" + url;
  }
  return url;
}

function checkEnvType(env: any) {
  // 使用类型断言
  const myEnv = env as Partial<EnvSetting>;

  // 检查必需的环境变量
  if (
    typeof myEnv.VITE_KINTONE_URL !== "string" ||
    typeof myEnv.VITE_KINTONE_USER_NAME !== "string" ||
    typeof myEnv.VITE_KINTONE_PASSWORD !== "string" ||
    (myEnv.VITE_KINTONE_PLATFORM !== "APP" &&
      myEnv.VITE_KINTONE_PLATFORM !== "PORTAL") ||
    (myEnv.VITE_KINTONE_TYPE !== "DESKTOP" &&
      myEnv.VITE_KINTONE_TYPE !== "MOBILE")
  ) {
    return false;
  }

  // 检查可选的环境变量
  if (
    myEnv.VITE_KINTONE_APP !== undefined &&
    typeof myEnv.VITE_KINTONE_APP !== "string"
  ) {
    return false;
  }
  return true;
}

//步骤：上传文件，获取系统设置，准备新的自定义文件列表，更新系统设置
export const devUpdate = async (env: any, fileList: string[]) => {
  if (!checkEnvType(env)) {
    console.log("env error");
    return;
  }
  const {
    VITE_KINTONE_URL: url,
    VITE_KINTONE_USER_NAME: username,
    VITE_KINTONE_PASSWORD: password,
    VITE_KINTONE_APP: app,
    VITE_KINTONE_PLATFORM: platform,
    VITE_KINTONE_TYPE: type,
  } = env;
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
    let customSetting;
    let appName = "";

    if (platform === "PORTAL") {
      customSetting = await k.getSystemSetting();
    } else if (app) {
      const result = await k.getAppInfo(app);
      appName = result.name;
      customSetting = await k.getAppSetting(app);
    } else {
      console.log("env setting error");
      return;
    }

    const { scripts, scope } = customSetting.result;

    //补充之前的自定义配置，排除老的构建文件
    scripts.forEach((setting) => {
      const {
        locationType,
        type: settingType,
        name,
        contentUrl,
        contentId,
      } = setting;
      if (locationType === "URL") {
        jsList[settingType as Type].push(contentUrl);
      } else if (locationType === "BLOB") {
        if (!fileNameList.includes(name) && name !== devFileName) {
          jsList[settingType as Type].push(contentId);
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
    if (platform === "PORTAL") {
      await k.updateSystemSetting(scope, jsFiles);
    } else if (app) {
      await k.updateAppSetting(app, scope, jsFiles, appName);
      await k.deploySetting(app);
    }
    console.log("update success");
  } catch (err: any) {
    console.log("upload failed!" + err.message);
  }
};
