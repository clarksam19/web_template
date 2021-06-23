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
    Handlebars.registerHelper('is', (context) => {
      if (context) {
        return Object.keys(context).length > 0;
      }
    })
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
    let bind = (handler) => handler.bind(this);
    Utils.forOwnIn(handlers, bind);
    Utils.forOwnIn(progressHandlers, bind);
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
      mainResult: document.getElementById('mainResult'),
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
    let api = this.chuckNorris;

    let sidebarLeftContext = {'sidebarLeftHeader': 'Choose a category:'};
    this.initLayoutElementWithRequest('sidebarLeft', sidebarLeftContext, api, 'getCategories');

    let sidebarRightContext = {'text': 'Chuck Norris'};
    this.initLayoutElement('sidebarRight', sidebarRightContext);
    
    let mainContext = {
      'mainHeader': 'Meticulously curated joke',
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
        'searchInputLabel': 'Search for a joke:',
      };
      this.initSubElement('main', searchInputContext);
    }

// INITIALIZATION HELPER METHODS

// Initialize layout element with AJAX response data
  initLayoutElementWithRequest(name, context, api, action) {
    let info = this.elementRequestInfo[name];
    info.action = action;
    info.handlers.initElementFromResponse = this.handlers.initElementFromResponse;
    info.targets[name] = this.layoutElements[name];
    info.templates[name] = this.templates[name];
    info.context.base = context;
    api.request(info, 'initElementFromResponse');
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

// Initiate APIAction request with RequestInfo and handler
  updateElement(info, handler) {
    this.chuckNorris.request(info, handler);
  }

// Select event target at id
  isTarget(e, id) {
    return e.target.getAttribute('id') === id;
  }

// Verify RequestInfo instance does not already contain handler and if not, add
  addHandlerToInfo(info, handlerName) {
    if (!info.handlers[handlerName]) {
      info.handlers[handlerName] = this.handlers[handlerName];
    }
  }

// Add API action to RequestInfo instance
  addActionToInfo(info, actionName) {
    info.action = actionName;
  }

// Add API request data to RequestInfo instance
  addDataToInfo(info, data) {
    info.data = data;
  }

// USER EVENT LISTENERS

// Set all event listeners
  setEventListeners() {
    this.getJokeFromClickOnCategoryLink();
    this.getJokeFromClickOnSurpriseButton();
    this.getJokeFromClickOnSearchButton();
  }

  getJokeFromClickOnCategoryLink() {
    this.layoutElements.sidebarLeft.onclick = (e) => {
      e.preventDefault();

      if (this.isTarget(e, 'categoryChoice')) {
        let info = this.elementRequestInfo.main;
        let data = {'category': e.target.textContent.trim()};
        this.addActionToInfo(info, 'getJokeFromCategory')
        this.addDataToInfo(info, data);
        this.addHandlerToInfo(info, 'updateMainJokeFromClickOnCategory');
        this.updateElement(info, 'updateMainJokeFromClickOnCategory');
      }
    }
  }

  getJokeFromClickOnSurpriseButton() {
    this.layoutElements.sidebarRight.onclick = (e) => {
      e.preventDefault();

      if (this.isTarget(e, 'surprise')) {
        let info = this.elementRequestInfo.main;
        this.addActionToInfo(info, 'getRandomJoke');
        this.addHandlerToInfo(info, 'updateMainJokeFromSurpriseBtn');
        this.updateElement(info, 'updateMainJokeFromSurpriseBtn');
      }
    }
  }

  getJokeFromClickOnSearchButton() {
    this.layoutElements.main.onclick = (e) => {
      e.preventDefault();
      
      if (this.isTarget(e, 'searchSubmitButton')) {
        let info = this.elementRequestInfo.main;
        let data = {'query': e.target.previousElementSibling.value.trim()};
        info.targets.mainResult = this.subElements.mainResult;
        this.addActionToInfo(info, 'textSearch');
        this.addDataToInfo(info, data);
        this.addHandlerToInfo(info, 'updateMainJokeFromSearch');
        this.updateElement(info, 'updateMainJokeFromSearch');
      }
    }
  }

}