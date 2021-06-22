import { Utils } from "./utils.js"
import { RequestInfo } from "./requestInfo.js";

export class APIAction {
  constructor(api) {
    this.baseUrl = api.baseUrl;
    this.endpoints = api.endpoints;
    this.testData = api.testData;
  }

// One method for sending all AJAX requests
// Takes RequestInfo object and name of onload event handler
  request(info, onload) {
    let apiAction = this.endpoints[info.action];
    let request = new XMLHttpRequest();
    let url = this.baseUrl + this.insertIds(apiAction.path, this.getIds(info.data));
    
    if (info.data) {
      if (info.data instanceof FormData) {
        info.data = this.serializeForm(info.data, apiAction.dataType);
      } else {
        info.data = this.serialize(info.data, apiAction.dataType);
        url += info.data;
      }

    }
    request.open(apiAction.method, url);
    request.onload = (e) => {
      let handler = info.handlers[onload];
      handler(e, info);
    }
    request.send(info.data);
  }

// Iterates through all endpoints and sends all GET requests with a new 
// RequestInfo object populated with test data -- all of which comes from apis.js
  testGetEndpoints(handler, handlerName) {
    for (let point in this.endpoints) {
      if (this.endpoints.hasOwnProperty(point)) {
        if (this.endpoints[point].method === 'GET') {
          let test = new RequestInfo();
          test.action = point;
          test.handlers[handlerName] = handler;
          test.data = this.testData[point];
          this.request(test, handlerName);
        }
      }
    }
  }

// Helper method for inserting ids into request paths
  insertIds(path, ids) {
    if (ids) {
      let replacements = ids.slice();
      return path.replace(/:id/g, (id) => replacements.shift());
    } else {
      return path;
    }  
  }

// Accesses ids in RequestInfo instance and returns null if none found
  getIds(data) {
    return data ? data.ids : null;
  }

// General helper method for serializing form data. Can add more cases as needed
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

// General helper for serializing non-form data. Can add more cases as needed
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