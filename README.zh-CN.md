# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

[English](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.md) | [日本語](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.ja.md) ｜ 简体中文


这是一个vite插件，让你可以使用vite来进行kintone开发。我们知道vite使用esm来进行模块加载，而kintone上传自定义js时无法指定使用esm来加载。通过这个插件，能让你在本地开发时使用esm模块加载你的代码，实现vite构建。通过hmr，让你的开发体验快如闪电。

## Disclaimer

このOSSは、私個人の著作物であり、サイボウズ株式会社、その他、私の所属する組織とは一切関係ありません。
 
This OSS is my own personal work and does not have any relationship with Cybozu Inc. or any other organization which I belong to.

## Install

```sh
# yarn
yarn add -D vite-plugin-kintone-dev
# npm
npm i -D vite-plugin-kintone-dev
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

## Usage

### 必选参数
```ts
// vite.config.ts
import { defineConfig } from "vite";
import kintoneDev from "vite-plugin-kintone-dev";

export default defineConfig({
  plugins: [
    //platform: "APP" | "PORTAL"   (Portal or App)
    //type: "DESKTOP" | "MOBILE"   (Desktop or Mobile)
    kintoneDev({platform: "PORTAL", type: "DESKTOP"}),
  ],
});
```

### 可选参数
如果使用react，请加上react:true
```ts
kintoneDev({platform: "PORTAL", type: "DESKTOP", react:true})
```
如果打包时，希望指定参数请加上build:{outputName:"xxx",upload:true}
```ts
kintoneDev({
  platform: "PORTAL",
  type: "DESKTOP",
  build:{
    outputName:"mobile",
    upload:true
  }
})
```

vite dev启动后，会在kintone的自定义设置页面自动上传“kintone_module_hack.js”脚本。
vite build时，会删除这段js脚本。并生成build后的js文件。


## Example
kintone + vue + vite   
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)








