export class EventAction {
// Helper method for all response data parsing. Can add more cases as needed.
  static parse(data, dataType) {
    switch (dataType) {
      case 'json':
        data = JSON.parse(data);
        return data;
      default:
        return data;
    } 
  }

  constructor() {
    this.handlers = this.getHandlers();
  }

// Store all event handlers for access in application
  getHandlers() {
    return {
      logStatus: this.logStatus,
      initElementFromResponse: this.initElementFromResponse,
      updateMainWithJoke: this.updateMainWithJoke,
    }
  }

// Event handler for intializing layout elements that use API response data
  initElementFromResponse(e, info) {
    let template = info.templates[Object.keys(info.templates)[0]];
    let element = info.targets[Object.keys(info.targets)[0]];
    info.data = EventAction.parse(e.target.response, 'json');
    info.context['base'] = Object.assign(info.data, info.context['base']);
    element.innerHTML = template(info.context);
  }

// EVENT HANDLERS FOR TESTING

// Basic example
  logStatus(e) {
    console.log(e.currentTarget.status);
  }


// APPLICATION-SPECIFIC EVENT HANDLERS

  updateMainWithJoke(e, info) {
    info.data = EventAction.parse(e.target.response, 'json');
    info.context['base']['joke'] = info.data.value;
    let template = info.templates['main'];
    info.targets['main'].innerHTML = template(info.context);
  }
}