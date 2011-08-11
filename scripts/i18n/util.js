/**
 * alll synchronous uitility functions that are used in closure-slurpur.js are listed here.
 */

exports.equals = equals;
exports. findLocaleID = findLocaleID;

//This function is not tested as it is a direct copy from anuglar's equals
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (o1 instanceof Array) {
      if ((length = o1.length) == o2.length) {
        for(key=0; key<length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      keySet = {};
      for(key in o1) {
        if (key.charAt(0) !== '$' && !isFunction(o1[key]) && !equals(o1[key], o2[key])) return false;
        keySet[key] = true;
      }
      for(key in o2) {
        if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

//This function is not tested as it is a direct copy from anuglar's isFunction
function isFunction(value){ return typeof value == 'function';}

function findLocaleID(str, type) {
  if (type === 'num') {
    return (str.match(/^NumberFormatSymbols_(.+)$/) || [])[1];
  } else if (type == 'datetime') {
    return (str.match(/^DateTimeSymbols_(.+)$/) || [])[1];
  }
}
