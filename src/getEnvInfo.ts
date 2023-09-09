import {
  type ConfigEnv,
  type ResolvedConfig,
  normalizePath,
  loadEnv,
} from "vite";
import path from "node:path";
import { type EnvSetting } from "kintone-types";

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

export default function validateEnv(
  envConfig: ConfigEnv,
  viteConfig: ResolvedConfig
): EnvSetting | undefined {
  const resolvedRoot = normalizePath(
    viteConfig.root ? path.resolve(viteConfig.root) : process.cwd()
  );

  const envDir = viteConfig.envDir
    ? normalizePath(path.resolve(resolvedRoot, viteConfig.envDir))
    : resolvedRoot;

  const env = loadEnv(envConfig.mode, envDir, viteConfig.envPrefix);
  return isEnvSetting(env) ? env : undefined;
}
