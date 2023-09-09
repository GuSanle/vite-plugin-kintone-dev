# react-kintone-vite-demo

1. This demo was built using @vitejs/vite-plugin-react. 
Please refer to [@vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react)
2. Rollup doesn't have a loader like Webpack that allows you to inline asset resources.
So, there may be cases where external resources need to be fetched after the build. It's recommended to use plugins to import small SVG resources and to import large image resources using external URLs.
Plugin for SVG images:[vite-plugin-svgr](https://www.npmjs.com/package/vite-plugin-svgr)

## Project run
```
npm run dev
```

## Project build
```
npm run build
```