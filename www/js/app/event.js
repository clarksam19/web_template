export class EventAction {
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

  getHandlers() {
    return {
      logStatus: this.logStatus,
      initElementFromResponse: this.initElementFromResponse,
      updateMainWithJoke: this.updateMainWithJoke,
    }
  }

  // handler(e, template) {
  //   let data = e.target.response;
  //   data = EventAction.parse(data, 'json');
  //   return data;
  // }

  initElementFromResponse(e, info) {
    let template = info.templates[Object.keys(info.templates)[0]];
    let element = info.targets[Object.keys(info.targets)[0]];
    info.data = EventAction.parse(e.target.response, 'json');
    info.context['base'] = Object.assign(info.data, info.context['base']);
    element.innerHTML = template(info.context);
  }

  updateElementFromResponse(e, info) {
    info.data = EventAction.parse(e.target.response, 'json');
    info.context['update'] = Object.assign(info.data, info.context['update']);
    element.innerHTML = template(info.context);
  }

  updateMainWithJoke(e, info) {
    info.data = EventAction.parse(e.target.response, 'json');
    info.context['base']['joke'] = info.data.value;
    let template = info.templates['main'];
    info.targets['main'].innerHTML = template(info.context);
  }

  logStatus(e) {
    console.log(e.currentTarget.status);
  }
  
}