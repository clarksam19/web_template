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
    this.progressHandlers = this.getProgressHandlers();
  }

// Store all event handlers for access in application
  getHandlers() {
    return {
      logStatus: this.logStatus,
      initElementFromResponse: this.initElementFromResponse,
      updateMainWithJoke: this.updateMainWithJoke,
    }
  }

  getProgressHandlers() {
    return {
      logLoadStart: this.logLoadStart,
      logLoadReadyStateChange: this.logLoadReadyStateChange,
      logLoadProgress: this.logLoadProgress,
      logLoadError: this.logLoadError,
      logLoadAbort: this.logLoadAbort,
      logLoadTimeout: this.logLoadTimeout,
      logLoadEnd: this.logLoadEnd,
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

// EVENT HANDLERS FOR TESTING API ENDPOINTS

// Basic example
  logStatus(e) {
    console.log(e.currentTarget.status);
  }

// REQUEST PROGRESS EVENT HANDLERS (besides onload)

  logLoadStart(e) {
    console.log('Load Started');
    console.log(e);
  }
  logLoadReadyStateChange(e) {
    console.log('Readystate Changed');
    console.log(e);
  }
  logLoadProgress(e) {
    console.log('Load Progressing');
    console.log(e);
  }
  logLoadError(e) {
    console.log('Load Error');
    console.log(e);
  }
  logLoadAbort(e) {
    console.log('Load Aborted');
    console.log(e);
  }
  logLoadTimeout(e) {
    console.log('Load Timed Out');
    console.log(e);
  }
  logLoadEnd(e) {
    console.log('Load Has Ended');
    console.log(e);
  }
// ONLOAD EVENT HANDLERS

  updateMainWithJoke(e, info) {
    info.data = EventAction.parse(e.target.response, 'json');
    info.context['base']['joke'] = info.data.value;
    let template = info.templates['main'];
    info.targets['main'].innerHTML = template(info.context);
  }
}