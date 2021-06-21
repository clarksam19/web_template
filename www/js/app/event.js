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
      test: this.test,
      renderTemplateToElement: this.renderTemplateToElement,
    }
  }

  // handler(e, template) {
  //   let data = e.target.response;
  //   data = EventAction.parse(data, 'json');
  //   return data;
  // }
  renderTemplateToElement(e, template, contextName, element) {
    let data = e.target.response;
    data = EventAction.parse(data, 'json');
    let context = {};
    context[contextName] = data;
    element.innerHTML = template(context);
  }
  test(e) {
    console.log(e.currentTarget.status);
  }
  
}