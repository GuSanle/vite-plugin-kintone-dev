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
初回起動時に、自動的にenvファイルの設定テンプレートをチェックします。設定がない場合は、コマンドラインインタラクションを起動して設定情報を入力させ、自動的にenvファイルを更新します。     
envファイルの設定が間違っている場合は、自分で修正することができます。 
（serveモードでは ".env.development" ファイル、buildモードでは ".env.production" ファイル）    

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
ビルド時に、ファイル名を指定したい場合は、パラメーター{outputName:"xxx"}を追加してください。自動的にkintoneにアップロードしたい場合は、パラメーター{upload:true}を追加してください。   
```ts
kintoneDev({
  outputName:"mobile",
  upload:true
})
```
 
'vite dev'を起動すると、'vite_plugin_kintone_dev_module_hack.js'スクリプトがKintoneのカスタム設定ページに自動アップロードされます。 'vite build'の際には、このJavaScriptスクリプトが削除され、ビルド後のJSファイルが生成されます。


## Example
kintone + vue + vite   
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)

## Note
開発時に[イベントハンドラー登録の適切なタイミングについて](https://cybozudev.zendesk.com/hc/ja/articles/360000882123)の問題に遭遇した場合、kintoneイベントの使用後にマウントし、以下のコードを使用して問題を解決することができます。  
（ビルド時には、esmモードを使用しないので、非同期ロードの問題は存在しないため、削除することができます。）   
src/main.tsの例：  

```ts
import { createApp } from "vue";
import App from "./App.vue";

kintone.events.on("app.record.detail.show", (event) => {
  const app = createApp(App);
  app.mount(kintone.app.record.getHeaderMenuSpaceElement()!);
  return event;
});

//kintoneイベントを手動で実行することで、非同期イベントの実行タイミングの問題を解決します。
const event = new Event("load");
// @ts-ignore
cybozu.eventTarget.dispatchEvent(event);
```
