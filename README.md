# vite-plugin-kintone-dev

[![NPM Version](https://img.shields.io/npm/dt/vite-plugin-kintone-dev)](https://www.npmjs.com/package/vite-plugin-kintone-dev)
![GitHub](https://img.shields.io/github/license/GuSanle/vite-plugin-kintone-dev)

English | [日本語](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.ja.md) | [简体中文](https://github.com/GuSanle/vite-plugin-kintone-dev/blob/main/README.zh-CN.md)

This is a Vite plugin that allows you to develop for kintone using Vite. We know that Vite uses ESM for module loading, but when uploading custom JavaScript to kintone, you cannot specify the use of ESM for loading. With this plugin, you can use ESM module loading for your code during local development, enabling Vite builds. With HMR, your development experience will be as fast as lightning.

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

On the first launch, it will automatically check your env file's setting template. If it is not configured, it will start a command line interaction for you to enter configuration information, and automatically update your env file.  
If your env file settings are incorrect, you can modify them yourself.  
(In serve mode, it's the ".env.development" file, in build mode, it's the ".env.production" file)

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import kintoneDev from "vite-plugin-kintone-dev";

export default defineConfig({
  plugins: [
    kintoneDev(),
  ]
});
```

## Optional Parameters

When building, if you want to specify the file name, please add the parameter {outputName:"xxx"}. If you want to automatically upload to kintone, please add the parameter {upload:true}.

```ts
kintoneDev({
  outputName: "mobile",
  upload: true
})
```
    
After launching vite dev the 'vite_plugin_kintone_dev_module_hack.js' script will be automatically uploaded to the custom settings page of kintone. During vite build, this JavaScript script will be deleted, and the post-build JS file will be generated.

## Vite 6 Support
This plugin now supports Vite 6 with improved performance and better error handling. All necessary server configurations (host, cors) are automatically added by the plugin, so you don't need to manually set them up.

## Example

Some kintone mobile demo:  
**React + TypeScript + Vite + kintone + material-ui**  
example: [kintone mobile custom demo(react)](https://github.com/GuSanle/kintone-vite-mui-demo)

**vue3 + vite4 + + vant4 + typescript**  
<img src="images/vantdemo.png" width="200" >  
example: [kintone mobile custom demo(vue)](https://github.com/GuSanle/kintone-mobile-custom-demo)

**kintone + vue + vite**  
example: [vue-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/vue-kintone-vite-demo)

**kintone + react + vite**  
example: [react-kintone-vite-demo](https://github.com/GuSanle/vite-plugin-kintone-dev/tree/main/example/react-kintone-vite-demo)

## Note

If you encounter the issue of [イベントハンドラー登録の適切なタイミングについて](https://cybozudev.zendesk.com/hc/ja/articles/360000882123) during development,you can try to solve the problem by using the following code after mounting after using the kintone event.  
(During the build, it can be deleted, because the esm mode is no longer used during the build, there is no asynchronous loading problem.)  
Example of src/main.ts:

```ts
import { createApp } from "vue";
import App from "./App.vue";

kintone.events.on("app.record.detail.show", (event) => {
  const app = createApp(App);
  app.mount(kintone.app.record.getHeaderMenuSpaceElement()!);
  return event;
});

//Solve the timing issue of asynchronous event execution by manually executing the kintone event.
const event = new Event("load");
// @ts-ignore
cybozu.eventTarget.dispatchEvent(event);
```

## Development

This project uses pnpm workspaces for development. The recommended workflow is:

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your environment variables in the example project:
   ```bash
   cd examples/vue-demo
   cp .env.sample .env.development
   # Edit .env.development with your Kintone credentials
   ```
4. Start the development server:
   ```bash
   # From the root directory
   pnpm dev
   ```

## Testing Your Own Changes

If you've made changes to the plugin and want to test them:

1. Build the plugin:
   ```bash
   pnpm build
   ```
2. Run the example project:
   ```bash
   pnpm dev
   ```

The example project uses the local version of the plugin through the workspace dependency.

## Static Resources Handling

When developing for Kintone, handling static resources like SVG icons properly is important. Unlike Webpack, Rollup (used by Vite) doesn't have loaders that allow you to inline asset resources directly.

### Recommended Approaches:

1. **For SVG Icons**: Use plugins like [unplugin-icons](https://github.com/unplugin/unplugin-icons) to import SVG as Vue components.

2. **For Large Images**: Import them as external URLs.

### Example Setup:

```ts
// vite.config.ts
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
  plugins: [
    // ...other plugins
    
    // Auto import components
    Components({
      resolvers: [IconsResolver()],
    }),
    
    // Configure icons
    Icons({
      autoInstall: true,
      customCollections: {
        // Load custom icons from assets directory
        'my-icons': FileSystemIconLoader('./src/assets'),
      },
    }),
  ],
})
```

### Using Icons in Components:

```vue
<script setup>
// Import SVG as component
import IconLogo from '~icons/my-icons/logo'

// Or import as URL
import logoUrl from './assets/logo.svg'
</script>

<template>
  <!-- Use as component -->
  <IconLogo />
  
  <!-- Use as image source -->
  <img :src="logoUrl" alt="Logo" />
</template>
```

See the example project for a full implementation.


```

Then configure Vite:

```ts
// vite.config.ts
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [kintoneDev()]
})
```

### Method 2: Using Vite's Auto-Generated Certificates

Vite can generate self-signed certificates automatically, but browsers will show security warnings:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [kintoneDev()],
  server: {
    https: {} // Vite will generate certificates automatically
  }
})
```

To bypass browser warnings:
1. Navigate to `https://localhost:5173` (or your dev server URL)
2. Click "Advanced" and proceed to the site
3. Accept the security risk




