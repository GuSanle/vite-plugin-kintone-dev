import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import './index.css'


kintone.events.on("portal.show", (event) => {
  ReactDOM.createRoot(kintone.portal.getContentSpaceElement()!).render(<App />);
  return event;
});
// ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
