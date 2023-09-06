// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

kintone.events.on("portal.show", (event) => {
  const app = createApp(App);
  app.use(router);
  app.mount(kintone.portal.getContentSpaceElement()!);
  return event;
});
