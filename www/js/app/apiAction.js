import { Utils } from "./utils.js"
export class APIAction {
  constructor(baseUrl, endpoints) {
    this.baseUrl = baseUrl;
    this.endpoints = endpoints;
  }

  request(action, data, handler) {
    action = this.endpoints[action];

    let request = new XMLHttpRequest();
    request.open(action.method, this.baseUrl + this.insertIds(action.path));

    if (data) {
      if (data instanceof FormData) {
        data = this.serializeForm(data, action.dataType);
      } else {
        data = this.serialize(data, action.dataType);
      }

      request.onload = handler;
      request.send(data);
    }
    
    request.onload = handler;
    request.send(data);
  }

  insertIds(ids, path) {
    let replacements = ids.slice();
    return path.replace(/:id/g, (id) => replacements.shift());
  }

  serializeForm(data, dataType) {
    switch (dataType) {
      case 'json':
        data = Object.fromEntries(data);
        data = JSON.stringify(data);
        return data;
      case 'query':
        data = new URLSearchParams(data);
        return data;
    }
  }

  serialize(data, dataType) {
    if (!Utils.isObject(data)) {
      throw new Error('Invalid data type. Must be an object');
    }
    switch (dataType) {
      case 'json':
        data = JSON.stringify(data);
        return data;
      case 'query':
        data = new URLSearchParams(data);
        return data;
    }
  }
}