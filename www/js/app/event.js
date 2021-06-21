export class EventAction {
  constructor() {
    this.handlers = this.getHandlers();
  }

  getHandlers() {
    return {
      alertType: this.alertType,
    }
  }

  alertType(e) {
    alert(e.type);
  }
  parse(data) {
    data = JSON.parse(data);
    return data;
  }


}