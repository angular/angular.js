/* global qFactory: false */
'use strict';

var isFunction = function isFunction(value){return typeof value == 'function';};
var isPromiseLike = function isPromiseLike(obj) {return obj && isFunction(obj.then);};
var isObject = function isObject(value){return value != null && typeof value === 'object';};
var isUndefined = function isUndefined(value) {return typeof value === 'undefined';};

var minErr = function minErr (module, constructor) {
  return function (){
    var ErrorConstructor = constructor || Error;
    throw new ErrorConstructor(module + arguments[0] + arguments[1]);
  };
};

var extend = function extend(dst) {
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
};

var $q = qFactory(process.nextTick, function noopExceptionHandler() {});

exports.resolved = $q.resolve;
exports.rejected = $q.reject;
exports.deferred = function () {
    var deferred = $q.defer();

    return {
        promise: deferred.promise,
        resolve: deferred.resolve,
        reject: deferred.reject
    };
};
