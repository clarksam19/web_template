// RequestInfo object constructor
export function RequestInfo() {
  return {
    action: '', // string to match corresponding endpoint in apis.js
    handlers: {}, // stores all event handlers used with an element
    data: null, // stores data to be sent to server (path ids go in data.ids: [])
    targets: {}, // stores all elements that can be affected by requests originating from owner element
    templates: {}, // stores all templates that accept data recieved from requests originating from owner element
    context: { // stores context data for all templates in templates property
      'base': {}, // element initialization context
      'update': {}, // element partial update context
      'new': {}, // element total update context
    } // each template renders differently depending on emptiness of 'new' and 'update'
  } // make sure that template variables are unique across templates, since contexts for multiple templates can be stored in one object
}
