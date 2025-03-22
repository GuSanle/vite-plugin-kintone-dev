# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

[English](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.md) | 日本語 | [简体中文](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.zh-CN.md)

これは、Vite を使用して kintone の開発を行うための Vite プラグインです。Vite はモジュールの読み込みに ESM を使用していることを知っていますが、カスタム JavaScript を kintone にアップロードする際に ESM を使用することを指定することはできません。このプラグインを使用すると、ローカル開発時にコードの ESM モジュールの読み込みを可能にし、Vite ビルドを実現できます。HMR を使用することで、開発体験は稲妻のように速くなります。

## Disclaimer

この OSS は、私個人の著作物であり、サイボウズ株式会社、その他、私の所属する組織とは一切関係ありません。

This OSS is my own personal work and does not have any relationship with Cybozu Inc. or any other organization which I belong to.

## Install

```sh
# yarn
yarn add -D vite-plugin-kintone-dev
# npm
npm i -D vite-plugin-kintone-dev
# pnpm
pnpm add -D vite-plugin-kintone-dev
```

## Configuration

初回起動時に、自動的に env ファイルの設定テンプレートをチェックします。設定がない場合は、コマンドラインインタラクションを起動して設定情報を入力させ、自動的に env ファイルを更新します。  
env ファイルの設定が間違っている場合は、自分で修正することができます。
（serve モードでは ".env.development" ファイル、build モードでは ".env.production" ファイル）

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import kintoneDev from "vite-plugin-kintone-dev";

export default defineConfig({
  plugins: [kintoneDev()],
});
```

## Optional Parameters

ビルド時に、ファイル名を指定したい場合は、パラメーター{outputName:"xxx"}を追加してください。自動的に kintone にアップロードしたい場合は、パラメーター{upload:true}を追加してください。

```ts
kintoneDev({
  outputName: "mobile",
  upload: true,
});
```

'vite dev'を起動すると、'vite_plugin_kintone_dev_module_hack.js'スクリプトが Kintone のカスタム設定ページに自動アップロードされます。 'vite build'の際には、この JavaScript スクリプトが削除され、ビルド後の JS ファイルが生成されます。

## Vite 6 サポート
このプラグインは現在Vite 6をサポートしており、パフォーマンスとエラー処理が向上しています。必要なサーバー設定（host、cors）はすべてプラグインによって自動的に追加されるため、手動で設定する必要はありません。

## kintoneイベント登録タイミングの自動修正

このプラグインは、ESMモジュールを使用する際のkintoneイベントハンドラー登録タイミングの一般的な問題を自動的に解決します。この問題は、kintoneページイベントがESMモジュールが完全に読み込まれる前に発火されることによって発生し、イベントハンドラーがイベントを捕捉できなくなります。

### 修正された問題：

- **イベント登録タイミング**：プラグインはカスタムコードが読み込まれる前に発生するkintoneイベントを傍受して保存します
- **自動再トリガー**：ESMモジュールがイベントハンドラーを登録すると、プラグインは保存されたイベントを自動的に再トリガーします
- **開発モードのみ**：この解決策は開発モードでのみ適用されます（本番ビルドはESMを使用しないため）
- **コード変更不要**：アプリケーションに特別なコードを追加する必要はありません

この解決策は、[イベントハンドラー登録の適切なタイミングについて](https://cybozudev.zendesk.com/hc/ja/articles/360000882123)のkintoneドキュメントで説明されている問題を、アプリケーションに追加コードを必要とせずに解決します。

## サンプル
kintone + vue + vite   
サンプル: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

kintone + react + vite   
サンプル: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)
