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
第一次启动时，会自动检查你的env文件的设置模版。如果没有配置，会启动命令行交互，让你输入配置信息。同时自动更新你的env文件。   
如果你的env文件设置有误，可以自行去修改。
（serve模式下为".env.development"文件, build模式下为".env.production"文件）  

## Usage
```ts
// vite.config.ts
import { defineConfig } from "vite";
import kintoneDev from "vite-plugin-kintone-dev";

export default defineConfig({
  plugins: [
    kintoneDev(),
  ],
});
```

## Optional Parameters
如果打包时，希望指定文件名，请加上参数{outputName:"xxx"}
```ts
kintoneDev({
  outputName:"mobile"
})
```

vite dev启动后，会在kintone的自定义设置页面自动上传“vite_plugin_kintone_dev_module_hack.js”脚本。
vite build时，会删除这段js脚本。并生成build后的js文件。


## Example
kintone + vue + vite   
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)

## Note
如果开发时遇到[事件句柄的注册时机](https://cybozudev.kf5.com/hc/kb/article/1434396) 问题，
可以尝试在使用kintone事件后挂载后，使用如下代码解决问题。  
（构建时，可以删除，因为构建时，不再使用esm模式，不存在异步加载问题。）   
src/main.ts的示例：  

```ts
import { createApp } from "vue";
import App from "./App.vue";

kintone.events.on("app.record.detail.show", (event) => {
  const app = createApp(App);
  app.mount(kintone.app.record.getHeaderMenuSpaceElement()!);
  return event;
});

//通过手动执行kintone事件，来解决异步事件执行时机问题
const event = new Event("load");
// @ts-ignore
cybozu.eventTarget.dispatchEvent(event);
```









