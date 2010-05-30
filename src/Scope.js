function getter(instance, path, unboundFn) {
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
        instance = bind(lastInstance, fn, lastInstance);
        return instance;
      }
    }
  }
  if (!unboundFn && isFunction(instance) && !instance['$$factory']) {
    return bind(lastInstance, instance);
  }
  return instance;
}

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
}

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
  return function(){
    return expFn(this);
  };
}

function rethrow(e) { throw e; }
function errorHandlerFor(element, error) {
  elementError(element, NG_EXCEPTION, isDefined(error) ? toJson(error) : error);
}

var scopeId = 0;
function createScope(parent, services, existing) {
  function Parent(){}
  function API(){}
  function Behavior(){}

  var instance, behavior, api, evalLists = {sorted:[]}, servicesCache = extend({}, existing);

  parent = Parent.prototype = (parent || {});
  api = API.prototype = new Parent();
  behavior = Behavior.prototype = new API();
  instance = new Behavior();

  extend(api, {
    'this': instance,
    $id: (scopeId++),
    $parent: parent,
    $bind: bind(instance, bind, instance),
    $get: bind(instance, getter, instance),
    $set: bind(instance, setter, instance),

    $eval: function $eval(exp) {
      if (exp !== undefined) {
        return expressionCompile(exp).apply(instance, slice.call(arguments, 1, arguments.length));
      } else {
        foreach(evalLists.sorted, function(list) {
          foreach(list, function(eval) {
            instance.$tryEval(eval.fn, eval.handler);
          });
        });
      }
    },

    $tryEval: function (expression, exceptionHandler) {
      try {
        return expressionCompile(expression).apply(instance, slice.call(arguments, 2, arguments.length));
      } catch (e) {
        error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler, e);
        } else if (isFunction(instance.$exceptionHandler)) {
          instance.$exceptionHandler(e);
        }
      }
    },

    $watch: function(watchExp, listener, exceptionHandler) {
      var watch = expressionCompile(watchExp),
          last;
      function watcher(){
        var value = watch.call(instance),
            lastValue = last;
        if (last !== value) {
          last = value;
          instance.$tryEval(listener, exceptionHandler, value, lastValue);
        }
      }
      instance.$onEval(PRIORITY_WATCH, watcher);
      watcher();
    },

    $onEval: function(priority, expr, exceptionHandler){
      if (!isNumber(priority)) {
        exceptionHandler = expr;
        expr = priority;
        priority = 0;
      }
      var evalList = evalLists[priority];
      if (!evalList) {
        evalList = evalLists[priority] = [];
        evalList.priority = priority;
        evalLists.sorted.push(evalList);
        evalLists.sorted.sort(function(a,b){return a.priority-b.priority;});
      }
      evalList.push({
        fn: expressionCompile(expr),
        handler: exceptionHandler
      });
    },

    $become: function(Class) {
      // remove existing
      foreach(behavior, function(value, key){ delete behavior[key]; });
      foreach((Class || noop).prototype, function(fn, name){
        behavior[name] = bind(instance, fn);
      });
      (Class || noop).call(instance);
    }

  });

  if (!parent.$root) {
    api.$root = instance;
    api.$parent = instance;
  }

  function inject(name){
    var service = servicesCache[name], factory, args = [];
    if (isUndefined(service)) {
      factory = services[name];
      if (!isFunction(factory))
        throw "Don't know how to inject '" + name + "'.";
      foreach(factory.inject, function(dependency){
        args.push(inject(dependency));
      });
      servicesCache[name] = service = factory.apply(instance, args);
    }
    return service;
  }

  foreach(services, function(_, name){
    var service = inject(name);
    if (service) {
      setter(instance, name, service);
    }
  });

  return instance;
}
