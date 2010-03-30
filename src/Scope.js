function getter(instance, path) {
  if (!path) return instance;
  var element = path.split('.');
  var key;
  var lastInstance = instance;
  var len = element.length;
  for ( var i = 0; i < len; i++) {
    key = element[i];
    if (!key.match(/^[\$\w][\$\w\d]*$/))
        throw "Expression '" + path + "' is not a valid expression for accesing variables.";
    if (instance) {
      lastInstance = instance;
      instance = instance[key];
    }
    if (isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = bind(fn, lastInstance, lastInstance);
        return instance;
      }
    }
  }
  if (typeof instance === 'function' && !instance['$$factory']) {
    return bind(lastInstance, instance);
  }
  return instance;
};

function setter(instance, path, value){
  var element = path.split('.');
  for ( var i = 0; element.length > 1; i++) {
    var key = element.shift();
    var newInstance = instance[key];
    if (!newInstance) {
      newInstance = {};
      instance[key] = newInstance;
    }
    instance = newInstance;
  }
  instance[element.shift()] = value;
  return value;
};

var compileCache = {};
function expressionCompile(exp){
  if (isFunction(exp)) return exp;
  var expFn = compileCache[exp];
  if (!expFn) {
    var parser = new Parser(exp);
    expFn = parser.statements();
    parser.assertAllConsumed();
    compileCache[exp] = expFn;
  }
  return parserNewScopeAdapter(expFn);
};

// return expFn
// TODO(remove this hack)
function parserNewScopeAdapter(fn) {
  return function(){
    return fn({
      state: this,
      scope: {
        set: this.$set,
        get: this.$get
      }
    });
  };
}

function isRenderableElement(element) {
  var name = element && element[0] && element[0].nodeName;
  return name && name.charAt(0) != '#' &&
    !includes(['TR', 'COL', 'COLGROUP', 'TBODY', 'THEAD', 'TFOOT'], name);
}

function rethrow(e) { throw e; }
function errorHandlerFor(element) {
  while (!isRenderableElement(element)) {
    element = element.parent() || jqLite(document.body);
  }
  return function(error) {
    element.attr('ng-error', angular.toJson(error));
    element.addClass('ng-exception');
  };
}

function createScope(parent, Class) {
  function Parent(){}
  function API(){}
  function Behavior(){}

  var instance, behavior, api, watchList = [], evalList = [];

  Class = Class || noop;
  parent = Parent.prototype = parent || {};
  api = API.prototype = new Parent();
  behavior = Behavior.prototype = extend(new API(), Class.prototype);
  instance = new Behavior();

  extend(api, {
    $parent: parent,
    $bind: bind(instance, bind, instance),
    $get: bind(instance, getter, instance),
    $set: bind(instance, setter, instance),

    $eval: function $eval(exp) {
      if (isDefined(exp)) {
        return expressionCompile(exp).apply(instance, slice.call(arguments, 1, arguments.length));
      } else {
        foreach(watchList, function(watch) {
          var value = instance.$tryEval(watch.watch, watch.handler);
          if (watch.last !== value) {
            instance.$tryEval(watch.listener, watch.handler, value, watch.last);
            watch.last = value;
          }
        });
        foreach(evalList, function(eval) {
          instance.$tryEval(eval.fn, eval.handler);
        });
      }
    },

    $tryEval: function (expression, exceptionHandler) {
      try {
        var value = expressionCompile(expression).apply(instance, slice.call(arguments, 2, arguments.length));
        if (exceptionHandler) {
          errorHandlerFor(exceptionHandler)();
        }
        return value;
      } catch (e) {
        error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler)(e);
        }
      }
    },

    $watch: function(watchExp, listener, exceptionHandler) {
      var watch = expressionCompile(watchExp);
      watchList.push({
        watch: watch,
        last: watch.call(instance),
        handler: exceptionHandler,
        listener:expressionCompile(listener)
      });
    },

    $onEval: function(expr, exceptionHandler){
      evalList.push({
        fn: expressionCompile(expr),
        handler: exceptionHandler
      });
    }
  });

  Class.apply(instance, slice.call(arguments, 2, arguments.length));

  return instance;
}
