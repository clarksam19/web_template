import { Application } from "./app/application.js";
import { Utils } from "./app/utils.js";

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  const api = app.chuckNorris;
  //api.testGetEndpoints(app.handlers.logStatus, 'logStatus');
})