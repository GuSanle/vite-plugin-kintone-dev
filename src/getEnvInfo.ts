import {
  type ConfigEnv,
  type ResolvedConfig,
  normalizePath,
  loadEnv,
} from "vite";
import fs from "node:fs";
import path from "node:path";
import { type EnvSetting } from "kintone-types";
import userInquirer from "./cli";

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

  if (
    myEnv.VITE_KINTONE_REACT !== undefined &&
    myEnv.VITE_KINTONE_REACT !== "true" &&
    myEnv.VITE_KINTONE_REACT !== "false"
  ) {
    return false;
  }

  return true;
}

export function validateEnv(envConfig: ConfigEnv, viteConfig: ResolvedConfig) {
  const resolvedRoot = normalizePath(
    viteConfig.root ? path.resolve(viteConfig.root) : process.cwd()
  );
  const envDir = viteConfig.envDir
    ? normalizePath(path.resolve(resolvedRoot, viteConfig.envDir))
    : resolvedRoot;
  const env = loadEnv(envConfig.mode, envDir, viteConfig.envPrefix);
  return {
    isEnvOk: checkEnvType(env),
    env: env,
  };
}

export async function checkEnv(
  envConfig: ConfigEnv,
  viteConfig: ResolvedConfig
) {
  let { isEnvOk, env: existingEnv } = validateEnv(envConfig, viteConfig);
  if (!isEnvOk) {
    const answers = await userInquirer(envConfig.command);
    let env: EnvSetting = {
      VITE_KINTONE_URL: answers.kintoneUrl,
      VITE_KINTONE_USER_NAME: answers.userName,
      VITE_KINTONE_PASSWORD: answers.passWord,
      VITE_KINTONE_PLATFORM: answers.platform,
      VITE_KINTONE_TYPE: answers.type,
    };
    if (answers.isReact !== undefined) {
      env = { ...env, VITE_KINTONE_REACT: answers.isReact };
    }
    if (answers.appId !== undefined) {
      env = { ...env, VITE_KINTONE_APP: answers.appId };
    }
    const resolvedRoot = normalizePath(
      viteConfig.root ? path.resolve(viteConfig.root) : process.cwd()
    );

    const envDir = viteConfig.envDir
      ? normalizePath(path.resolve(resolvedRoot, viteConfig.envDir))
      : resolvedRoot;

    let envUrl =
      envConfig.mode === "development"
        ? path.resolve(envDir, ".env.development")
        : path.resolve(envDir, ".env.production");

    const envContent = { ...existingEnv, ...env };

    // 将环境变量写入到.env文件
    const envContentStr = Object.entries(envContent)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    fs.writeFileSync(envUrl, envContentStr);
  }
}
