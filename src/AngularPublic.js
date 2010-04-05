var browserSingleton;
angularService('$browser', function browserFactory(){
  if (!browserSingleton) {
    var XHR = XMLHttpRequest;
    if (isUndefined(XHR)) {
      XHR = function () {
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
        throw new Error("This browser does not support XMLHttpRequest.");
      };
    }
    browserSingleton = new Browser(window.location, XHR);
    browserSingleton.startUrlWatcher();
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

