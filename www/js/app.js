import { Application } from "./app/application.js";

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  app.elements.header.onclick = (e) => app.handlers.alertType(e);
})