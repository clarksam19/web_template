import { Utils } from "./utils.js"
import { RequestInfo } from "./requestInfo.js";
import { EventAction } from "./event.js";

export class APIAction {
  constructor(api) {
    this.baseUrl = api.baseUrl;
    this.endpoints = api.endpoints;
    this.testData = api.testData;
    this.progressHandlers = new EventAction().progressHandlers;
  }

// One method for sending all AJAX requests
// Takes RequestInfo object and name of onload event handler
  request(info, onload, progress = false) {
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

    progress ? this.showProgress(request, info) : null;
    
    request.onload = (e) => {
      let handler = info.handlers[onload];
      handler(e, info);
    }

    request.send(info.data);
  }

// AJAX REQUEST HELPER METHODS

// Inserts ids into request paths
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

// Serializes form data. Add more dataType cases as needed
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

// Serializes non-form data. Add more dataType cases as needed
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

// API TESTING METHODS

// Iterates through all endpoints and sends all GET requests with a new 
// RequestInfo object populated with test data -- all of which comes from apis.js
  testGetEndpoints(handler, handlerName, progress = false) {
    for (let point in this.endpoints) {
      if (this.endpoints.hasOwnProperty(point)) {
        if (this.endpoints[point].method === 'GET') {
          let test = new RequestInfo();
          test.action = point;
          test.handlers[handlerName] = handler;
          test.progressHandlers = this.progressHandlers;
          test.data = this.testData[point];
          this.request(test, handlerName, progress);
        }
      }
    }
  }

// Log load progress events if 'progress' arg set to 'true' in testing functions
  showProgress(request, info) {
    request.onloadstart = (e) => {
      let handler = info.progressHandlers['logLoadStart'];
      handler(e);
    }
    request.onreadystatechange = (e) => {
      let handler = info.progressHandlers['logLoadReadyStateChange'];
      handler(e);
    }
    request.onprogress = (e) => {
      let handler = info.progressHandlers['logLoadProgress'];
      handler(e);
    }
    request.onerror = (e) => {
      let handler = info.progressHandlers['logLoadError'];
      handler(e);
    }
    request.onabort = (e) => {
      let handler = info.progressHandlers['logLoadAbort'];
      handler(e);
    }
    request.ontimeout = (e) => {
      let handler = info.progressHandlers['logLoadTimeout'];
      handler(e);
    }
    request.onloadend = (e) => {
      let handler = info.progressHandlers['logLoadEnd'];
      handler(e);
    }
  }
}