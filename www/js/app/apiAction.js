import { Utils } from "./utils.js"
export class APIAction {
  constructor(api) {
    this.baseUrl = api.baseUrl;
    this.endpoints = api.endpoints;
    this.testData = api.testData;
  }

  request(action, handler, data) {
    action = typeof action === 'string' ? this.endpoints[action] : action;

    let request = new XMLHttpRequest();
    let url = this.baseUrl + this.insertIds(action.path, this.getIds(data));
    
    if (data) {
      if (data instanceof FormData) {
        data = this.serializeForm(data, action.dataType);
      } else {
        data = this.serialize(data, action.dataType);
        url += data;
      }

    }
    
    request.open(action.method, url);
    request.onload = handler;
    request.send(data);
  }

  testGetEndpoints(testData, handler) {
    for (let point in this.endpoints) {
      if (this.endpoints.hasOwnProperty(point)) {
        if (this.endpoints[point].method === 'GET') {
          this.request(point, handler, testData[point]);
        }
      }
    }
  }

  insertIds(path, ids) {
    if (ids) {
      let replacements = ids.slice();
      return path.replace(/:id/g, (id) => replacements.shift());
    } else {
      return path;
    }  
  }

  getIds(data) {
    return data ? data.ids : null;
  }

  serializeForm(data, dataType) {
    switch (dataType) {
      case 'json':
        data = Object.fromEntries(data);
        data = JSON.stringify(data);
        return data;
      case 'query':
        data = new URLSearchParams(data).toString();
        return '?' + data;
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
        data = new URLSearchParams(data).toString();
        return '?' + data;
    }
  }
}