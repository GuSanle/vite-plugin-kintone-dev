import {
  type ConfigEnv,
  type ResolvedConfig,
  normalizePath,
  loadEnv,
} from "vite";
import fs from "node:fs";
import path from "node:path";
import { type EnvSetting } from "kintone-types";
import userInquirer from "./inquirer";
import type { Answers } from "inquirer";

function checkEnvType(env: any) {
  // 使用类型断言
  const myEnv = env as Partial<EnvSetting>;

  // 检查必需的环境变量
  if (
    typeof myEnv.VITE_KINTONE_URL !== "string" ||
    typeof myEnv.VITE_KINTONE_USER_NAME !== "string" ||
    typeof myEnv.VITE_KINTONE_PASSWORD !== "string"
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
    let answers: Answers;
    try {
      answers = await userInquirer();
    } catch (e) {
      console.log("env error");
      return;
    }
    const { kintoneUrl, userName, passWord, appId } = answers;
    let env: EnvSetting = {
      VITE_KINTONE_URL: kintoneUrl,
      VITE_KINTONE_USER_NAME: userName,
      VITE_KINTONE_PASSWORD: passWord,
    };
    if (appId !== undefined) {
      env = { ...env, VITE_KINTONE_APP: appId };
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
