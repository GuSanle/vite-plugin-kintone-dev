# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

[English](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.md)  | 日本語 | [简体中文](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.zh-CN.md)

これは、Viteを使用してkintoneの開発を行うためのViteプラグインです。Viteはモジュールの読み込みにESMを使用していることを知っていますが、カスタムJavaScriptをkintoneにアップロードする際にESMを使用することを指定することはできません。このプラグインを使用すると、ローカル開発時にコードのESMモジュールの読み込みを可能にし、Viteビルドを実現できます。HMRを使用することで、開発体験は稲妻のように速くなります。

## Install

```sh
# yarn
yarn add -D vite-plugin-kintone-dev
# npm
npm i -D vite-plugin-kintone-dev
```
## Configuration
setting the .env (sample)
```sh
VITE_KINTONE_URL=a.cybozu.com
VITE_KINTONE_USER_NAME=a
VITE_KINTONE_PASSWORD=a
## if you are developing in "app", please set the VITE_APP
VITE_KINTONE_APP=1
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import kintoneDev from "vite-plugin-kintone-dev";

//platform: "APP" | "PORTAL"   (Portal Customize or Application Customize)
//type: "DESKTOP" | "MOBILE"   (on Desktop or on Mobile)
export default defineConfig({
  plugins: [
    kintoneDev({platform: "APP",type: "DESKTOP"}),
    // kintoneDev({platform: "APP";type: "MOBILE"}),
    // kintoneDev({platform: "PORTAL";type: "DESKTOP"}),
    // kintoneDev({platform: "PORTAL";type: "MOBILE"}),
  ],
});
```
 
'vite dev'を起動すると、'kintone_module_hack.js'スクリプトがKintoneのカスタム設定ページに自動アップロードされます。 'vite build'の際には、このJavaScriptスクリプトが削除され、ビルド後のJSファイルが生成されます。


## Example
kintone + vue + vite   
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)


