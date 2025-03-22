import { createApp } from 'vue'
import App from './App.vue'

// Declare kintone and cybozu globals if needed for TypeScript
declare const kintone: any

// Use kintone portal page event
// kintone.events.on('portal.show', (event: any) => {
//   const app = createApp(App)
//   app.mount(kintone.portal.getContentSpaceElement()!)
//   return event
// })

// If you need to use app record page, uncomment the following code
kintone.events.on('app.record.detail.show', (event: any) => {
  const app = createApp(App)
  app.mount(kintone.app.record.getHeaderMenuSpaceElement()!)
  return event
})
