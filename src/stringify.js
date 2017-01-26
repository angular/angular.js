'use strict';

/* global toDebugString: true */

function serializeObject(obj, maxDepth) {
  var seen = [];

  // There is no direct way to stringify object until reaching a specific depth
  // and a very deep object can cause a performance issue, so we copy the object
  // based on this specific depth and then stringify it.
  if (isValidObjectMaxDepth(maxDepth)) {
    obj = copy(obj, null, maxDepth);
  }
  return JSON.stringify(obj, function(key, val) {
    val = toJsonReplacer(key, val);
    if (isObject(val)) {

      if (seen.indexOf(val) >= 0) return '...';

      seen.push(val);
    }
    return val;
  });
}

function toDebugString(obj, maxDepth) {
  if (typeof obj === 'function') {
    return obj.toString().replace(/ \{[\s\S]*$/, '');
  } else if (isUndefined(obj)) {
    return 'undefined';
  } else if (typeof obj !== 'string') {
    return serializeObject(obj, maxDepth);
  }
  return obj;
}
