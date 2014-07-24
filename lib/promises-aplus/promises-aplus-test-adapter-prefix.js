"use strict";
var INVISIBLE = 1;
var CONFIGURABLE = 2;
var WRITABLE = 4;

var defineProperty = function(target, propertyName, flags, value) {
  if (typeof target === 'object' || typeof target === 'function') {
    var desc = {
      /*jshint bitwise: false */
      enumerable: !(flags & INVISIBLE),
      configurable: !!(flags & CONFIGURABLE),
      writable: !!(flags & WRITABLE)
    };
    if (arguments.length > 3) {
      desc.value = value;
    }
    Object.defineProperty(target, propertyName, desc);
  }
};

var defineProperties = function(target, flags, properties) {
  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      defineProperty(target, key, flags, properties[key]);
    }
  }
};

var createObject = Object.create;
