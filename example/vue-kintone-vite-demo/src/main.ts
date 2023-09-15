// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

kintone.events.on("portal.show", (event) => {
  const app = createApp(App);
  app.mount(kintone.portal.getContentSpaceElement()!);
  return event;
});

// kintone.events.on("app.record.detail.show", (event) => {
//   const app = createApp(App);
//   app.mount(kintone.app.record.getHeaderMenuSpaceElement()!);
//   return event;
// });

// const event = new Event("load");
// // @ts-ignore
// cybozu.eventTarget.dispatchEvent(event);
