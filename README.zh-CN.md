# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

[English](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.md) | [日本語](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.ja.md) ｜ 简体中文


这是一个vite插件，让你可以使用vite来进行kintone开发。我们知道vite使用esm来进行模块加载，而kintone上传自定义js时无法指定使用esm来加载。通过这个插件，能让你在本地开发时使用esm模块加载你的代码，实现vite构建。通过hmr，让你的开发体验快如闪电。

## Install

```sh
# yarn
yarn add -D vite-plugin-kintone-dev
# npm
npm i -D vite-plugin-kintone-dev
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import kintoneDev from "vite-plugin-kintone-dev";

//platform: "APP" | "PORTAL"   (首页自定义 or 应用自定义)
//type: "DESKTOP" | "MOBILE"   (PC端 or 移动端)
export default defineConfig({
  plugins: [
    kintoneDev({platform: "APP";type: "DESKTOP"}),
    // kintoneDev({platform: "APP";type: "MOBILE"}),
    // kintoneDev({platform: "PORTAL";type: "DESKTOP"}),
    // kintoneDev({platform: "PORTAL";type: "MOBILE"}),
  ],
});
```

## Configuration
env文件的设置模版
.env
```sh
VITE_KINTONE_URL=a.cybozu.com
VITE_KINTONE_USER_NAME=a
VITE_KINTONE_PASSWORD=a
## 如果你是应用的开发，请设置应用id
VITE_KINTONE_APP=1
```





