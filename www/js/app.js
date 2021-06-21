import { Application } from "./app/application.js";
import { Utils } from "./app/utils.js";

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  let api = app.chuckNorris;
  let context = {category: ['foo', 'bar', 'baz', 'quz', 'qux', 'biz', 'zap']};
  app.elements.sidebarLeft.innerHTML = app.templates.sidebarLeft(context);
  // api.testGetEndpoints(api.testData, app.handlers.test);
  
})