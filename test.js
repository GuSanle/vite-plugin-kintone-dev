(function () {
  const viteClientInject = document.createElement("script");
  viteClientInject.type = type;
  viteClientInject.src = "http://[::1]:5173" + "/@vite/client";
  document.body.appendChild(viteClientInject);

  const scriptList = [{ type: "module", src: "/src/main.tsx" }];
  function loadScript(src, type) {
    const script = document.createElement("script");
    script.type = type;
    script.src = "http://[::1]:5173" + src;
    document.body.appendChild(script);
  }
  for (const script of scriptList) {
    const { src, type } = script;
    loadScript(src, type);
  }
})();

// (function () {
//   const scriptElement = document.createElement("script");
//   scriptElement.type = "module";
//   scriptElement.textContent = `import RefreshRuntime from 'http://[::1]:5173/@react-refresh';
//   RefreshRuntime.injectIntoGlobalHook(window);
//   window.$RefreshReg$ = () => {};
//   window.$RefreshSig$ = () => (type) => type;
//   window.__vite_plugin_react_preamble_installed__ = true;`;
//   document.body.appendChild(scriptElement);
//   const scriptList = [{ type: "module", src: "/src/main.tsx" }];
//   function loadScript(src, type) {
//     const script = document.createElement("script");
//     script.type = type;
//     script.src = "http://[::1]:5173" + src;
//     document.body.appendChild(script);
//   }
//   for (const script of scriptList) {
//     const { src, type } = script;
//     loadScript(src, type);
//   }
// })();
