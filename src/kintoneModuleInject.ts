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
 * 创建kintone事件代理和重触发机制脚本
 * @returns kintone事件处理脚本
 */
function createKintoneEventProxy(): string {
  return `
  // 存储所有kintone原生事件及其参数
  const kintoneEventStore = [];
  // 用于标记ESM模块是否已加载完成
  window.__KINTONE_DEV_ESM_LOADED__ = false;

  // 保存原始事件注册方法
  const originalAddEventListener = kintone.events && kintone.events.on;

  if (originalAddEventListener) {
    // 重写kintone事件注册方法
    kintone.events.on = function(...args) {
      const [eventType, callback] = args;

      // 如果ESM已加载完成，使用常规方式注册
      if (window.__KINTONE_DEV_ESM_LOADED__) {
        return originalAddEventListener.apply(this, args);
      }

      // 否则记录事件处理函数，等待ESM加载完成后重触发
      console.log('[kintone-dev] Registering event:', eventType);
      const result = originalAddEventListener.apply(this, args);

      // 如果事件已经触发过，立即重触发
      const storedEvents = kintoneEventStore.filter(e => e.type === eventType);
      if (storedEvents.length > 0) {
        console.log('[kintone-dev] Re-triggering event:', eventType);
        storedEvents.forEach(event => {
          try {
            callback(event.event);
          } catch (err) {
            console.error('[kintone-dev] Re-triggering event handling error:', err);
          }
        });
      }

      return result;
    };

    // 拦截并存储所有kintone事件
    const originalDispatchEvent = cybozu.eventTarget.dispatchEvent;
    cybozu.eventTarget.dispatchEvent = function(event) {
      // 记录事件和参数
      if (event.type.startsWith('app.')) {
        console.log('[kintone-dev] Capturing kintone event:', event.type);
        kintoneEventStore.push({
          type: event.type,
          event: event
        });
      }
      return originalDispatchEvent.apply(this, arguments);
    };
  }

  // 标记脚本加载完成的函数
  window.__KINTONE_DEV_MARK_LOADED__ = function() {
    window.__KINTONE_DEV_ESM_LOADED__ = true;
    console.log('[kintone-dev] ESM module loading completed');
  };
  `
}

/**
 * 创建ESM加载完成标记脚本
 * @returns 加载完成脚本
 */
function createLoadCompleteScript(): string {
  return `
  // 标记ESM模块已加载完成
  if (window.__KINTONE_DEV_MARK_LOADED__) {
    window.__KINTONE_DEV_MARK_LOADED__();
  }
  `
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
  const kintoneEventProxyScript = createKintoneEventProxy()

  return `(function () {
    // 注入kintone事件代理
    ${kintoneEventProxyScript}

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

      // 对最后一个模块脚本添加加载完成标记
      if (type === "module" && src === scriptList[scriptList.length - 1].src) {
        const originalScript = script.src;
        script.src = \`data:text/javascript;charset=utf-8,\${encodeURIComponent(\`
          import * as mod from "\${originalScript}";
          ${createLoadCompleteScript()}
          export default mod;
        \`)}\`;
      }

      document.body.appendChild(script);
    }

    // 加载所有脚本
    for (const { src, type } of scriptList) {
      loadScript(src, type);
    }
  })();
  `
}
