// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

kintone.events.on("portal.show", (event) => {
  const contentSpaceElement = kintone.portal.getContentSpaceElement();
  const app = createApp(App);
  app.use(router);
  if (contentSpaceElement) {
    app.mount(contentSpaceElement);
  }
  return event;
});
