import { type ScriptList } from "kintone-types";

function reactInject(devServerUrl: string) {
  return `const scriptElement = document.createElement("script");
  scriptElement.type = "module";
  scriptElement.textContent = \`import RefreshRuntime from '${devServerUrl}/@react-refresh';
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
  window.__vite_plugin_react_preamble_installed__ = true;\`;
  document.body.appendChild(scriptElement);`;
}

export default function kintoneModuleInject(
  devServerUrl: string,
  scriptList: ScriptList,
  react?: boolean
): string {
  return `(function () {
    const viteClientInject = document.createElement("script");
    viteClientInject.type = "module";
    viteClientInject.src = "${devServerUrl}"+'/@vite/client';
    document.body.appendChild(viteClientInject);
    ${react ? reactInject(devServerUrl) : ""}
    const scriptList = ${JSON.stringify(scriptList)};
    function loadScript(src,type) {
      const script = document.createElement("script");
      script.type = type;
      script.src = "${devServerUrl}"+src;
      document.body.appendChild(script);
    }
    for (const script of scriptList){
      const {src,type}=script
      loadScript(src,type)
    }
  })();
  `;
}
