# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

English | [日本語](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.ja.md) | [简体中文](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.zh-CN.md)

This is a Vite plugin that allows you to develop for kintone using Vite. We know that Vite uses ESM for module loading, but when uploading custom JavaScript to kintone, you cannot specify the use of ESM for loading. With this plugin, you can use ESM module loading for your code during local development, enabling Vite builds. With HMR, your development experience will be as fast as lightning.

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
On the first launch, it will automatically check your env file's setting template. If it is not configured, it will start a command line interaction for you to enter configuration information, and automatically update your env file.    
(In serve mode, it's the ".env.development" file, in build mode, it's the ".env.production" file)   
If your env file settings are incorrect, you can modify them yourself.   
setting the .env (sample)
```sh
VITE_KINTONE_URL=a.cybozu.com
VITE_KINTONE_USER_NAME=a
VITE_KINTONE_PASSWORD=a
## if you are developing in "app", please set the VITE_KINTONE_APP
VITE_KINTONE_APP=1
```

## Usage

### Required Parameters
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
### Optional Parameters
If using React, please add react: true.
```ts
kintoneDev({platform: "PORTAL", type: "DESKTOP", react:true})
```
If you want to specify parameters during the build, please add build: { outputName: "xxx", upload: true }.
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
    
After launching vite dev the 'vite_plugin_kintone_dev_module_hack.js' script will be automatically uploaded to the custom settings page of kintone. During vite build, this JavaScript script will be deleted, and the post-build JS file will be generated


## Example
kintone + vue + vite   
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)

## Note
If you encounter the  issue [イベントハンドラー登録の適切なタイミングについて](https://cybozudev.zendesk.com/hc/ja/articles/360000882123) during development, you can try to solve the problem with the following code. (You can delete it during the build, because the esm mode is no longer used during the build, and there is no asynchronous loading problem.)
```ts
const event = new Event("load");
// @ts-ignore
cybozu.eventTarget.dispatchEvent(event);
```




