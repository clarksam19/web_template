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
    Application.registerPartials();
    Application.registerHelpers();
    this.bindEventHandlers(this.handlers, this.progressHandlers);
    this.elementRequestInfo = {};
    this.layoutElements = this.getLayoutElements();
    this.initElementRequestInfo(this.layoutElements);
    this.initLayoutElements();
    this.subElements = this.getSubElements();
    this.initElementRequestInfo(this.subElements);
    this.initSubElements();
    this.setEventListeners();
  }

// INITIALIZATION METHODS

// Bind event handlers to application
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

// Access layout elements
  getLayoutElements() {
    return {
      header: document.getElementById('header'),
      sidebarLeft: document.getElementById('sidebarLeft'),
      sidebarRight: document.getElementById('sidebarRight'),
      main: document.getElementById('main'),
      footer: document.getElementById('footer'),
    }
  }

// Access sub elements
  getSubElements() {
    return {
      surpriseBtn: document.getElementById('surprise'),
      searchInput: document.getElementById('searchInput'),
      searchSubmitButton: document.getElementById('searchSubmitButton'),
    }
  }

// Add RequestInfo object to elements
  initElementRequestInfo(elementCollection) {
    for (let element in elementCollection) {
      if (elementCollection.hasOwnProperty(element)) {
        this.elementRequestInfo[element] = new RequestInfo(); // --> see requestInfo.js
      }
    }
  }

// Initialize layout elements
  initLayoutElements() {
    let app = this.chuckNorris;

    let sidebarLeftContext = {'sidebarLeftHeading': 'Choose a category:'};
    this.initLayoutElementWithRequest('sidebarLeft', sidebarLeftContext, app, 'getCategories');

    let sidebarRightContext = {'text': 'Chuck Norris'};
    this.initLayoutElement('sidebarRight', sidebarRightContext);
    
    let mainContext = {
      'mainHeading': 'Meticulously curated joke',
      'joke': 'Joke goes here',
    };
    this.initLayoutElement('main', mainContext);

    let headerContext = {
      'title': 'Chuck Norris Jokes',
      'subtitle': 'Your One-Stop Shop for Chuck Norris Related Humor',
    };
    this.initLayoutElement('header', headerContext);
    
    let footerContext = {'tagline': 'Brought to you by Sam Clark'};
    this.initLayoutElement('footer', footerContext);
  }

  // Initialize sub elements using parent element name
    initSubElements() {
      let surpriseBtnContext = {'surprise': 'Surprise me'};
      this.initSubElement('sidebarRight', surpriseBtnContext);

      let searchInputContext = {
        'searchInputPlaceholder': 'Search',
        'searchInputLabel': 'Search for a joke',
      };
      this.initSubElement('main', searchInputContext);
    }

// INITIALIZATION HELPER METHODS

// Initialize layout element with AJAX response data
  initLayoutElementWithRequest(name, context, app, action) {
    let info = this.elementRequestInfo[name];
    info.action = action;
    info.handlers.initElementFromResponse = this.handlers.initElementFromResponse;
    info.targets[name] = this.layoutElements[name];
    info.templates[name] = this.templates[name];
    info.context.base = context;
    app.request(info, 'initElementFromResponse');
  }

// Locally initialize layout element
  initLayoutElement(name, context) {
    let info = this.elementRequestInfo[name];
    info.targets[name] = this.layoutElements[name];
    info.templates[name] = this.templates[name];
    info.context.base = context;
    this.initElement(info, name);
  }

// Locally initialize sub element 
  initSubElement(parentName, context) {
    let info = this.elementRequestInfo[parentName];
    info.targets[parentName] = this.layoutElements[parentName];
    info.context.base = Object.assign(context, info.context.base);
    this.initElement(info);
  }

// Pass context to template
  initElement(info) {
    let element = info.targets[Object.keys(info.targets)[0]];
    let template = info.templates[Object.keys(info.templates)[0]];
    element.innerHTML = template(info.context);
  }

// USER EVENT HELPER METHODS

// Send APIAction request upon user event
  updateElement(info, handler) {
    this.chuckNorris.request(info, handler);
  }

// USER EVENT LISTENERS

// Set all event listeners
  setEventListeners() {
    this.getJokeFromClickOnCategoryLink();
    this.getJokeFromClickOnSurpriseButton();
    this.getJokeFromSearch();
  }

  getJokeFromClickOnCategoryLink() {
    this.layoutElements.sidebarLeft.onclick = (e) => {
      e.preventDefault();

      let info = this.elementRequestInfo.main;
      info.action = 'getJokeFromCategory';
      info.data = {'category': e.target.textContent.trim()};

      if (!info.handlers['updateMainWithJoke']) {
        info.handlers['updateMainWithJoke'] = this.handlers.updateMainWithJoke;
      }

      this.updateElement(info, 'updateMainWithJoke');
    }
  }

  getJokeFromClickOnSurpriseButton() {
    this.layoutElements.sidebarRight.onclick = (e) => {
      e.preventDefault();

      if (e.target.getAttribute('id') === 'surprise') {
        let info = this.elementRequestInfo.main;
        info.action = 'getRandomJoke';

        if (!info.handlers['updateMainWithJoke']) {
          info.handlers['updateMainWithJoke'] = this.handlers.updateMainWithJoke;
        }

        this.updateElement(info, 'updateMainWithJoke');
      }
    }
  }

  getJokeFromSearch() {
    this.layoutElements.main.onclick = (e) => {
      e.preventDefault();

      if (e.target.getAttribute('id') === 'searchSubmitButton') {
        let info = this.elementRequestInfo.main;
        info.action = 'textSearch';
        console.log(e.target.previousElementSibling);
        info.data = {'query': e.target.previousElementSibling.value.trim()};
      
        if (!info.handlers['textSearch']) {
          info.handlers['textSearch'] = this.handlers.updateMainWithJoke;
        }

        this.updateElement(info, 'textSearch');
      }
    }
  }

}