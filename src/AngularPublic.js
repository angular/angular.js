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
    browserSingleton = new Browser(
        window.location,
        jqLite(window.document),
        jqLite(window.document.getElementsByTagName('head')[0]),
        XHR,
        $log,
        window.setTimeout);
    browserSingleton.startPoller(50, function(delay, fn){setTimeout(delay,fn);});
    browserSingleton.bind();
  }
  return browserSingleton;
}, {inject:['$log']});

extend(angular, {
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'equals': equals,
  'foreach': foreach,
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
  'isArray': isArray
});

