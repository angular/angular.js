'use strict';

var OPTION_MATCHER = /^\s*([\w-]+)="([^"]+)"\s+([\s\S]*)/;
var VALID_OPTIONS = ['sinceVersion', 'removeVersion'];

module.exports = {
  name: 'deprecated',
  transforms: function(doc, tag, value) {
    var result = {};
    var invalidOptions = [];
    value = value.trim();
    while (OPTION_MATCHER.test(value)) {
      value = value.replace(OPTION_MATCHER, function(_, key, value, rest) {
        if (VALID_OPTIONS.indexOf(key) !== -1) {
          result[key] = value;
        } else {
          invalidOptions.push(key);
        }
        return rest;
      });
    }
    if (invalidOptions.length > 0) {
      throw new Error('Invalid options: ' + humanList(invalidOptions) + '. Value options are: ' + humanList(VALID_OPTIONS));
    }
    result.description = value;
    return result;
  }
};

function humanList(values, sep, lastSep) {
  if (sep === undefined) sep = ', ';
  if (lastSep === undefined) lastSep = ' and ';

  return values.reduce(function(output, value, index, list) {
    output += '"' + value + '"';
    switch (list.length - index) {
      case 1: return output;
      case 2: return output + lastSep;
      default: return output + sep;
    }
  }, '');
}
