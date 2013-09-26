'use strict';

var copy = angular.copy,
    equals = angular.equals,
    extend = angular.extend,
    forEach = angular.forEach,
    isDefined = angular.isDefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    jqLite = angular.element,
    noop = angular.noop,
    toJson = angular.toJson;


function inherit(parent, extra) {
  return extend(new (extend(function() {}, {prototype:parent}))(), extra);
}
