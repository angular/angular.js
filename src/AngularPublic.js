'use strict';

var browserSingleton;

angularService('$browser', function($log, $sniffer) {
  if (!browserSingleton) {
    browserSingleton = new Browser(window, jqLite(window.document), jqLite(window.document.body),
                                   XHR, $log, $sniffer);
  }
  return browserSingleton;
}, {$inject: ['$log', '$sniffer']});


extend(angular, {
  // disabled for now until we agree on public name
  //'annotate': annotate,
  'compile': compile,
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
  'version': version,
  'isDate': isDate,
  'lowercase': lowercase,
  'uppercase': uppercase
});

//try to bind to jquery now so that one can write angular.element().read()
//but we will rebind on bootstrap again.
bindJQuery();


