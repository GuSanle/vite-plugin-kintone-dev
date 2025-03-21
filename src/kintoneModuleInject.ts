import type { ScriptList } from 'kintone-types'

/**
 * 生成React刷新注入脚本
 * @param devServerUrl 开发服务器URL
 * @returns React刷新注入脚本代码
 */
function createReactRefreshScript(devServerUrl: string): string {
  return `const scriptElement = document.createElement("script");
  scriptElement.type = "module";
  scriptElement.textContent = \`import RefreshRuntime from '${devServerUrl}/@react-refresh';
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
  window.__vite_plugin_react_preamble_installed__ = true;\`;
  document.body.appendChild(scriptElement);`
}

/**
 * 生成Vite开发模式注入脚本
 * @param devServerUrl 开发服务器URL
 * @param scriptList 脚本列表
 * @param isReactMode 是否启用React模式
 * @returns 注入脚本代码
 */
export default function kintoneModuleInject(devServerUrl: string, scriptList: ScriptList, isReactMode = false): string {
  const reactScript = isReactMode ? createReactRefreshScript(devServerUrl) : ''

  return `(function () {
    // 注入Vite客户端
    const viteClientInject = document.createElement("script");
    viteClientInject.type = "module";
    viteClientInject.src = "${devServerUrl}/@vite/client";
    document.body.appendChild(viteClientInject);

    // 注入React刷新支持
    ${reactScript}

    // 加载应用脚本
    const scriptList = ${JSON.stringify(scriptList)};

    function loadScript(src, type) {
      const script = document.createElement("script");
      script.type = type;
      script.src = "${devServerUrl}" + src;
      document.body.appendChild(script);
    }

    // 加载所有脚本
    for (const { src, type } of scriptList) {
      loadScript(src, type);
    }
  })();
  `
}
