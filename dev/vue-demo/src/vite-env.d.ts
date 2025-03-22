/// <reference types="vite/client" />

// 声明Vue模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明SVG资源模块
declare module '*.svg' {
  const content: string
  export default content
}

// 声明图标模块
declare module '~icons/*' {
  import { FunctionalComponent, SVGAttributes } from 'vue'
  const component: FunctionalComponent<SVGAttributes>
  export default component
}

// 声明kintone全局变量
interface KintoneEvent {
  [key: string]: any
}

interface Kintone {
  events: {
    on: (eventName: string, callback: (event: KintoneEvent) => KintoneEvent) => void
  }
  portal: {
    getContentSpaceElement: () => HTMLElement
  }
  app: {
    record: {
      getHeaderMenuSpaceElement: () => HTMLElement
    }
  }
}

declare global {
  const kintone: Kintone
  const cybozu: {
    eventTarget: {
      dispatchEvent: (event: Event) => void
    }
  }
}
