'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global isFunction: false */
/* global noop: false */
/* global toJson: false */
/* global $$stringify: false */

// Convert an index into the string into line/column for use in error messages
// As such, this doesn't have to be efficient.
function indexToLineAndColumn(text, index) {
  var lines = text.split(/\n/g);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
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
          listener(text, text, scope);
          unwatch();
        },
        objectEquality);
    return unwatch;
  };
  PARSE_CACHE_FOR_TEXT_LITERALS[text] = parsedFn;
  parsedFn['exp'] = text; // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
  parsedFn['expressions'] = []; // Require this to call $compile.$$addBindingInfo() which allows Protractor to find elements by binding.
  return parsedFn;
}

function subtractOffset(expressionFn, offset) {
  if (offset === 0) {
    return expressionFn;
  }
  function minusOffset(value) {
    return (value == null) ? value : value - offset;
  }
  function parsedFn(context) { return minusOffset(expressionFn(context)); }
  var unwatch;
  parsedFn['$$watchDelegate'] = function watchDelegate(scope, listener, objectEquality) {
    unwatch = scope['$watch'](expressionFn,
        function pluralExpressionWatchListener(newValue, oldValue) {
          listener(minusOffset(newValue), minusOffset(oldValue), scope);
        },
        objectEquality);
    return unwatch;
  };
  return parsedFn;
}
