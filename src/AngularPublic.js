'use strict';

var browserSingleton;
/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$browser
 * @requires $log
 *
 * @description
 * Represents the browser.
 */
angularService('$browser', function($log){
  if (!browserSingleton) {
    browserSingleton = new Browser(window, jqLite(window.document), jqLite(window.document.body),
                                   XHR, $log);
    browserSingleton.bind();
  }
  return browserSingleton;
}, {$inject:['$log']});


extend(angular, {
  // disabled for now until we agree on public name
  //'annotate': annotate,
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'equals': equals,
  'forEach': forEach,
  'injector': createInjector,
  'noop':noop,
  'bind':bind,
  'toJson': toJson,
  'fromJson': fromJson,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isObject': isObject,
  'isNumber': isNumber,
  'isArray': isArray,
  'version': version
});

//try to bind to jquery now so that one can write angular.element().read()
//but we will rebind on bootstrap again.
bindJQuery();


