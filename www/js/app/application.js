import apis from "./apis.js";
import { RequestInfo } from "./requestInfo.js";
import { APIAction } from "./apiAction.js";
import { EventAction } from "./event.js";
import { Utils } from "./utils.js";

export class Application {

  static registerPartials() {
    Handlebars.partials = {
      //select precompiled templates by name and add here like so:
      //'partialName': Handlebars.templates['partialName'],
    };
  }

  static registerHelpers() {
    // Register custom Handlebars helpers here
  }

  constructor() {
    this.chuckNorris = new APIAction(apis.chuckNorris);
    this.handlers = new EventAction().handlers;
    this.templates = Handlebars.templates;
    this.elements = this.getElements();
    this.bindEventHandlers(this.handlers, this.progressHandlers);
    Application.registerPartials();
    Application.registerHelpers();
    this.elementRequestInfo = {};
    this.initElementRequestInfo();
    this.initElements();
    this.setEventListeners();
  }

// Bind event handlers to app
  bindEventHandlers(handlers, progressHandlers) {
    for (let handler in handlers) {
      if (Object.hasOwnProperty(handler)) {
        handler.bind(this);
      }
    }
    for (let handler in progressHandlers) {
      if (Object.hasOwnProperty(handler)) {
        handler.bind(this);
      }
    }
  }

// Access all layout elements
  getElements() {
    return {
      header: document.getElementById('header'),
      sidebarLeft: document.getElementById('sidebarLeft'),
      sidebarRight: document.getElementById('sidebarRight'),
      main: document.getElementById('main'),
      footer: document.getElementById('footer'),
    }
  }

// Add RequestInfo object to all primary layout elements
  initElementRequestInfo() {
    for (let element in this.elements) {
      if (this.elements.hasOwnProperty(element)) {
        this.elementRequestInfo[element] = new RequestInfo(); // --> see requestInfo.js
      }
    }
  }

// Initialize primary layout elements with the appropriate RequestInfo values
  initElements() {
    let sidebarLeftInfo = this.elementRequestInfo.sidebarLeft;
    sidebarLeftInfo.action = 'getCategories';
    sidebarLeftInfo.handlers['initElementFromResponse'] = this.handlers.initElementFromResponse;
    sidebarLeftInfo.targets['sidebarLeft'] = this.elements.sidebarLeft;
    sidebarLeftInfo.templates['sidebarLeft'] = this.templates.sidebarLeft;
    sidebarLeftInfo.context['base'] = {'sidebarLeftHeading': 'Choose a category:'};
    this.chuckNorris.request(sidebarLeftInfo, 'initElementFromResponse');

    let sidebarRightInfo = this.elementRequestInfo.sidebarRight;
    sidebarRightInfo.targets['sidebarRight'] = this.elements.sidebarRight;
    sidebarRightInfo.templates['sidebarRight'] = this.templates.sidebarRight;
    sidebarRightInfo.context['base'] = {'text': 'Chuck Norris'};
    this.initElement(sidebarRightInfo, 'sidebarRight');

    let mainInfo = this.elementRequestInfo.main;
    mainInfo.targets['main'] = this.elements.main;
    mainInfo.templates['main'] = this.templates.main;
    mainInfo.context['base'] = {
      'mainHeading': 'Meticulously curated joke',
      'joke': 'Joke goes here',
     };
    this.initElement(mainInfo, 'main');

    let headerInfo = this.elementRequestInfo.header;
    headerInfo.targets['header'] = this.elements.header;
    headerInfo.templates['header'] = this.templates.header;
    headerInfo.context['base'] = {
      'title': 'Chuck Norris Jokes',
      'subtitle': 'Your One-Stop Shop for Chuck Norris Related Humor',
    };
    this.initElement(headerInfo, 'header');

    let footerInfo = this.elementRequestInfo.footer;
    footerInfo.targets['footer'] = this.elements.footer;
    footerInfo.templates['footer'] = this.templates.footer;
    footerInfo.context['base'] = {'tagline': 'Brought to you by Sam Clark'};
    this.initElement(footerInfo, 'footer');
  }

// Helper method for locally initializing layout elements
  initElement(info) {
    let element = info.targets[Object.keys(info.targets)[0]];
    let template = info.templates[Object.keys(info.templates)[0]];
    element.innerHTML = template(info.context);
  }

// Helper method for sending requests upon user events
  updateElement(info, handler) {
    this.chuckNorris.request(info, handler);
  }

// Set all event listeners
  setEventListeners() {
    this.getJokeFromClickOnCategoryLink();
  }

// USER EVENT LISTENERS

  getJokeFromClickOnCategoryLink() {
    this.elements.sidebarLeft.onclick = (e) => {
      let info = this.elementRequestInfo.main;
      info.data = {'category': e.target.textContent.trim()};
      info.action = 'getJokeFromCategory';
      if (!info.handlers['updateMainWithJoke']) {
        info.handlers['updateMainWithJoke'] = this.handlers.updateMainWithJoke;
      }
      this.updateElement(info, 'updateMainWithJoke');
    }
  }

}