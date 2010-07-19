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
  'equals': equals,
  'foreach': foreach,
  'noop':noop,
  'bind':bind,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isObject': isObject,
  'isNumber': isNumber,
  'isArray': isArray
});

