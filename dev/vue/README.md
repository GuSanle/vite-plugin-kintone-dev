# vue3-kintone-vite-demo

This demo was built using create-vue. 
Please refer to [create-vue](https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application)
```
npm create vue@latest
```

## Project setup
1. Add the "vite-plugin-kintone-dev" plugin.   
2. Add .env file    
3. Rollup doesn't have a loader like Webpack that allows you to inline assets resources.
So, there may be cases where external resources need to be fetched after the build. It's recommended to use plugins to import small SVG resources and to import large image resources using external URLs.
Plugin for SVG images:
[unplugin-icons](https://github.com/unplugin/unplugin-icons)。


## Project run
```
npm run dev
```

## Project build
```
npm run build
```
