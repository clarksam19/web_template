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
    this.chuckNorris= new APIAction(apis.chuckNorris);
    this.eventFunctions = new EventAction();
    this.handlers = this.eventFunctions.handlers;
    this.elements = this.getElements();
    this.bindEventHandlers(this.handlers);
    this.setEventListeners();
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
      sidebarLeft: document.getElementById('sidebarLeft'),
    }
  }

  renderTemplates() {
    let template = this.chuckNorris.templates.sidebarLeft;
    let element = this.elements.sidebarLeft;
    this.chuckNorris.request(this.chuckNorris.endpoints.getCategories, (e) => {
      app.handlers.populateTemplateFromRequest(e, template, 'category', element);
    })
  }

  setEventListeners() {
    // this.elements.element.onevent = (e) => {
    //   let template = this.templates.template;
    //   this.handlers.handler(e, template);
    // } 
  }
}