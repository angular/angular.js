'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

var $interpolateMinErr = angular['$interpolateMinErr'];

var noop = angular['noop'],
    isFunction = angular['isFunction'],
    toJson = angular['toJson'];

function stringify(value) {
  if (value == null /* null/undefined */) { return ''; }
  switch (typeof value) {
    case 'string':     return value;
    case 'number':     return '' + value;
    default:           return toJson(value);
  }
}

// Convert an index into the string into line/column for use in error messages
// As such, this doesn't have to be efficient.
function indexToLineAndColumn(text, index) {
  var lines = text.split(/\n/g);
  for (var i=0; i < lines.length; i++) {
    var line=lines[i];
    if (index >= line.length) {
      index -= line.length;
    } else {
      return { line: i + 1, column: index + 1 };
    }
  }
}
var PARSE_CACHE_FOR_TEXT_LITERALS = Object.create(null);

function parseTextLiteral(text) {
  var cachedFn = PARSE_CACHE_FOR_TEXT_LITERALS[text];
  if (cachedFn != null) {
    return cachedFn;
  }
  function parsedFn(context) { return text; }
  parsedFn['$$watchDelegate'] = function watchDelegate(scope, listener, objectEquality) {
    var unwatch = scope['$watch'](noop,
        function textLiteralWatcher() {
          if (isFunction(listener)) { listener.call(null, text, text, scope); }
          unwatch();
        },
        objectEquality);
    return unwatch;
  };
  PARSE_CACHE_FOR_TEXT_LITERALS[text] = parsedFn;
  parsedFn.exp = text; // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
  parsedFn.expressions = []; // Require this to call $compile.$$addBindingInfo() which allows Protractor to find elements by binding.
  return parsedFn;
}

function subtractOffset(expressionFn, offset) {
  if (offset === 0) {
    return expressionFn;
  }
  function minusOffset(value) {
    return (value == void 0) ? value : value - offset;
  }
  function parsedFn(context) { return minusOffset(expressionFn(context)); }
  var unwatch;
  parsedFn['$$watchDelegate'] = function watchDelegate(scope, listener, objectEquality) {
    unwatch = scope['$watch'](expressionFn,
        function pluralExpressionWatchListener(newValue, oldValue) {
          if (isFunction(listener)) { listener.call(null, minusOffset(newValue), minusOffset(oldValue), scope); }
        },
        objectEquality);
    return unwatch;
  };
  return parsedFn;
}
