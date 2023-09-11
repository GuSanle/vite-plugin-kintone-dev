# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

[English](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.md)  | 日本語 | [简体中文](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.zh-CN.md)

これは、Viteを使用してkintoneの開発を行うためのViteプラグインです。Viteはモジュールの読み込みにESMを使用していることを知っていますが、カスタムJavaScriptをkintoneにアップロードする際にESMを使用することを指定することはできません。このプラグインを使用すると、ローカル開発時にコードのESMモジュールの読み込みを可能にし、Viteビルドを実現できます。HMRを使用することで、開発体験は稲妻のように速くなります。

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
setting the .env (sample)
```sh
VITE_KINTONE_URL=a.cybozu.com
VITE_KINTONE_USER_NAME=a
VITE_KINTONE_PASSWORD=a
## if you are developing in "app", please set the VITE_APP
VITE_KINTONE_APP=1
```

## Usage

### 必要なパラメータ
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
### オプションのパラメータ
Reactを使用する場合、react: trueを追加してください。
```ts
kintoneDev({platform: "PORTAL", type: "DESKTOP", react:true})
```
ビルド時にパラメータを指定したい場合、build: { outputName: "xxx", upload: true }を追加してください。
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
 
'vite dev'を起動すると、'kintone_module_hack.js'スクリプトがKintoneのカスタム設定ページに自動アップロードされます。 'vite build'の際には、このJavaScriptスクリプトが削除され、ビルド後のJSファイルが生成されます。


## Example
kintone + vue + vite   
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)

## Note
Kintoneのイベント登録のタイミングの問題により、[イベントハンドラー登録の適切なタイミングについて](https://cybozudev.zendesk.com/hc/ja/articles/360000882123) 以下のイベントはViteを使用した開発に適していません。Viteを使用してビルドする際に問題はありません。
app.record.create.show   
app.record.edit.show   
app.record.detail.show  
