import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import './index.css'

// kintone.events.on("portal.show", (event) => {
//   ReactDOM.createRoot(kintone.portal.getContentSpaceElement()!).render(<App />);
//   return event;
// });

kintone.events.on('app.record.detail.show', (event) => {
  ReactDOM.createRoot(kintone.app.record.getHeaderMenuSpaceElement()!).render(<App />)
  return event
})

// const event = new Event("load");
// // @ts-ignore
// cybozu.eventTarget.dispatchEvent(event);
