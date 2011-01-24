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
    var addPollFn = browserSingleton.addPollFn;
    browserSingleton.addPollFn = function(){
      browserSingleton.addPollFn = addPollFn;
      browserSingleton.startPoller(100, function(delay, fn){setTimeout(delay,fn);});
      return addPollFn.apply(browserSingleton, arguments);
    };
    browserSingleton.bind();
  }
  return browserSingleton;
}, {$inject:['$log']});

extend(angular, {
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
  'isArray': isArray
});

