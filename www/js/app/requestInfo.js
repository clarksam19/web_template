// RequestInfo object constructor
export function RequestInfo() {
  return {
    action: '', // string to match corresponding endpoint in apis.js
    handlers: {}, // stores initialization handler followed by all event handlers used with owner element
    data: null, // stores data to be sent to server (path ids go in data.ids: [])
    targets: {}, // stores owner element followed by all elements to be be affected by a request originating from owner element
    templates: {}, // stores initialization template followed by all templates to be passed reponse data from requests originating from owner element
    context: { // stores context data for all templates in 'templates' property
      'base': {}, // element initialization context
      'add': {}, // element add to base context
      'new': {}, // element total update context
    } // each template renders differently depending on emptiness of 'new' and 'update'
  } // make sure that template variables are unique across templates, since contexts for multiple templates can be stored in one object
}
