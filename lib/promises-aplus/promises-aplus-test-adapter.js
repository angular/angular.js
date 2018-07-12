'use strict';

/* global qFactory: false */
/* exported
 isFunction,
 isPromiseLike,
 isObject,
 isUndefined,
 minErr,
 extend
*/

/* eslint-disable no-unused-vars */
function isFunction(value) { return typeof value === 'function'; }
function isPromiseLike(obj) { return obj && isFunction(obj.then); }
function isObject(value) { return value !== null && typeof value === 'object'; }
function isUndefined(value) { return typeof value === 'undefined'; }

function minErr(module, constructor) {
  return function() {
    var ErrorConstructor = constructor || Error;
    throw new ErrorConstructor(module + arguments[0] + arguments[1]);
  };
}

function extend(dst) {
  for (var i = 1, ii = arguments.length; i < ii; i++) {
    var obj = arguments[i];
    if (obj) {
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        dst[key] = obj[key];
      }
    }
  }
  return dst;
}
/* eslint-enable */

var $q = qFactory(process.nextTick, function noopExceptionHandler() {});

exports.resolved = $q.resolve;
exports.rejected = $q.reject;
exports.deferred = $q.defer;
