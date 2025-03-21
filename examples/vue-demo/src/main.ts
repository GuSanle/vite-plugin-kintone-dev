import { createApp } from 'vue'
import App from './App.vue'

// Declare kintone and cybozu globals if needed for TypeScript
declare const kintone: any
declare const cybozu: any

// Use kintone portal page event
kintone.events.on('portal.show', (event: any) => {
  const app = createApp(App)
  app.mount(kintone.portal.getContentSpaceElement()!)
  return event
})

// If you need to use app record page, uncomment the following code
// kintone.events.on("app.record.detail.show", (event: any) => {
//   const app = createApp(App);
//   app.mount(kintone.app.record.getHeaderMenuSpaceElement()!);
//   return event;
// });

// Solve timing issues with asynchronous event execution
const event = new Event('load')
// We need to access the cybozu.eventTarget which is not in the type definitions
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
cybozu.eventTarget.dispatchEvent(event)
