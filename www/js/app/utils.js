export const Utils = {
  isObject: function(data) {
    return (typeof data === 'object' && data !== null);
  },
  forOwnIn: function(object, callback) {
    for (let prop in object) {
      if (object.hasOwnProperty(prop)) {
        callback(object[prop]);
      }
    }
  }
}
