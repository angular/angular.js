var browserSingleton;
angularService('$browser', function browserFactory(){
  if (!browserSingleton) {
    browserSingleton = new Browser(window.location, window.document);
    browserSingleton.startUrlWatcher();
    browserSingleton.bind();
  }
  return browserSingleton;
});

extend(angular, {
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'foreach': foreach,
  'noop':noop,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isNumber': isNumber,
  'isArray': isArray
});

