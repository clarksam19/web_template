import apis from "./apis.js";
import { APIAction } from "./apiAction.js";
import { EventAction } from "./event.js";
import { Utils } from "./utils.js";

export class Application {

  static setPartials() {
    Handlebars.partials = {
      'nav-partial': Handlebars.templates['nav-partial'],
    };
  }

  constructor() {
    Application.setPartials();
    this.templates = Handlebars.templates;
    this.apiName1 = new APIAction(apis.apiName1.baseUrl, apis.apiName1.endpoints);
    this.eventFunctions = new EventAction();
    this.handlers = this.eventFunctions.handlers;
    this.elements = this.getElements();
    this.bindEventHandlers(this.handlers);
  }

  bindEventHandlers(handlers) {
    for (let handler in handlers) {
      if (Object.hasOwnProperty(handler)) {
        handler.bind(this);
      }
    }
  }

  getElements() {
    return {
      header: document.querySelector('header'),
    }
  }

}