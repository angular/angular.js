'use strict';

/**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an injector function that can be used for retrieving services as well as for
 * dependency injection (see {@link guide/dev_guide.di dependency injection}).
 *
 * Creating an injector doesn't automatically create all of the `$eager`
 * {@link angular.service services}. You have to call `injector.eager()` to initialize them.
 *
 * @param {Object.<string, function()>=} [factories=angular.service] Map of the service factory
 *     functions.
 * @returns {function()} Injector function:
 *
 *   * `injector(serviceName)`:
 *     * `serviceName` - `{string=}` - Name of the service to retrieve.
 *
 * The injector function also has these properties:
 *
 *   * An `invoke` property which can be used to invoke methods with dependency-injected arguments.
 *    `injector.invoke(self, fn, curryArgs)`
 *     * `self` -  The "`this`" to be used when invoking the function.
 *     * `fn` - The function to be invoked. The function may have the `$inject` property that
 *        lists the set of arguments which should be auto-injected.
 *        (see {@link guide/dev_guide.di dependency injection}).
 *     * `curryArgs(array)` - Optional array of arguments to pass to the function
 *        invocation after the injection arguments (also known as curry arguments or currying).
 *   * An `eager` property which is used to initialize the eager services.
 *     `injector.eager()`
 */
function createInjector(factories) {
  var instanceCache = {
    $injector: injector
  };
  factories = factories || angularService;

  injector.invoke = invoke;

  forEach(factories, function(factory, name){
    if (factory.$eager)
      injector(name);
  });
  return instanceCache.$injector;

  function injector(serviceId, path){
    if (typeof serviceId == 'string') {
      if (!(serviceId in instanceCache)) {
        var factory = factories[serviceId];
        path = path || [];
        path.unshift(serviceId);
        if (!factory) throw Error("Unknown provider for '" + path.join("' <- '") + "'.");
        inferInjectionArgs(factory);
        instanceCache[serviceId] = invoke(null, factory, [], path);
        path.shift();
      }
      return instanceCache[serviceId];
    } else {
      return invoke(null, serviceId, path);
    }
  }

  function invoke(self, fn, args, path){
    args = args || [];
    var injectNames;
    var i;
    if (typeof fn == 'function') {
      injectNames = fn.$inject || [];
      i = injectNames.length;
    } else if (fn instanceof Array) {
      injectNames = fn;
      i = injectNames.length;
      fn = injectNames[--i];
    }
    assertArgFn(fn, 'fn');
    while(i--) {
      args.unshift(injector(injectNames[i], path));
    }
    return fn.apply(self, args);
  }
}

/**
 * THIS IS NOT PUBLIC DOC YET!
 *
 * @name angular.annotate
 * @function
 *
 * @description
 * Annotate the function with injection arguments. This is equivalent to setting the `$inject`
 * property as described in {@link guide.di dependency injection}.
 *
 * <pre>
 * var MyController = angular.annotate('$location', function($location){ ... });
 * </pre>
 *
 * is the same as
 *
 * <pre>
 * var MyController = function($location){ ... };
 * MyController.$inject = ['$location'];
 * </pre>
 *
 * @param {String|Array} serviceName... zero or more service names to inject into the
 *     `annotatedFunction`.
 * @param {function} annotatedFunction function to annotate with `$inject`
 *     functions.
 * @returns {function} `annotatedFunction`
 */
function annotate(services, fn) {
  if (services instanceof Array) {
    fn.$inject = services;
    return fn;
  } else {
    var i = 0,
        length = arguments.length - 1, // last one is the destination function
        $inject = arguments[length].$inject = [];
    for (; i < length; i++) {
      $inject.push(arguments[i]);
    }
    return arguments[length]; // return the last one
  }
}

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $eager:eager});
}


/**
 * @returns the $inject property of function. If not found the
 * the $inject is computed by looking at the toString of function and
 * extracting all arguments which and assuming that they are the
 * injection names.
 */
var FN_ARGS = /^function\s*[^\(]*\(([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(.+?)\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function inferInjectionArgs(fn) {
  assertArgFn(fn);
  if (!fn.$inject) {
    var args = fn.$inject = [];
    var fnText = fn.toString().replace(STRIP_COMMENTS, '');
    var argDecl = fnText.match(FN_ARGS);
    forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
      arg.replace(FN_ARG, function(all, name){
        args.push(name);
      });
    });
  }
  return fn.$inject;
}

///////////////////////////////////////
function createInjector2(modulesToLoad, moduleRegistry) {
  var cache = {},
      $injector = internalInjector(cache),
      providerSuffix = 'Provider',
      providerSuffixLength = providerSuffix.length;

  function $provide(name) {
    var provider = cache['#' + name + providerSuffix];
    if (provider) {
      return provider;
    } else {
      throw Error("No provider for: " + name);
    }
  }

  $provide.service = function(name, provider) {
    if (isFunction(provider)){
      provider = $injector.instantiate(provider);
    }
    if (!provider.$get) {
      throw Error('Providers must define $get factory method.');
    }
    cache['#' + name + providerSuffix] = provider;
  };
  $provide.factory = function(name, factoryFn) { $provide.service(name, { $get:factoryFn }); };
  $provide.value = function(name, value) { $provide.factory(name, valueFn(value)); };

  $provide.value('$injector', $injector);
  $provide.value('$provide', $provide);

  function internalInjector(cache) {
    var path = [];

    function injector(value) {
      switch(typeof value) {
        case 'function':
          return invoke(null, value);
        case 'string':
          var instanceKey = '#' + value;
          if (cache[instanceKey]) {
            return cache[instanceKey];
          }
          try {
            path.unshift(value);
            var providerKey = instanceKey + providerSuffix,
                provider = cache[providerKey];
            if (provider) {
              return cache[instanceKey] = invoke(provider, provider.$get);
            } else {
              throw Error("Unknown provider for '" + path.join("' <- '") + "'.");
            }
          } finally {
            path.shift();
          }
        case 'object':
          if (value instanceof Array) {
            return invoke(null, value);
          }
        default:
          throw Error('Injector expects name or function.');
      }
    }

    function invoke(self, fn){
      var args = [],
          $inject,
          length;

      switch(typeof fn){
        case 'function':
          $inject = inferInjectionArgs(fn);
          length = $inject.length;
          break;
        case 'object':
          if (typeof fn.length == 'number') {
            $inject = fn;
            length = $inject.length;
            fn = $inject[--length];
          }
        default:
          assertArgFn(fn, 'fn');
      };

      while(length--) {
        args.unshift(injector($inject[length], path));
      }

      switch (self ? -1 : args.length) {
        case  0: return fn();
        case  1: return fn(args[0]);
        case  2: return fn(args[0], args[1]);
        case  3: return fn(args[0], args[1], args[2]);
        case  4: return fn(args[0], args[1], args[2], args[3]);
        case  5: return fn(args[0], args[1], args[2], args[3], args[4]);
        case  6: return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
        case  7: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        case  8: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        case  9: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        case 10: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
        default: return fn.apply(self, args);
      }
    };

    injector.invoke = invoke;
    injector.instantiate = function(Type, locals){
      var Constructor = function(){},
          instance;
      Constructor.prototype = Type.prototype;
      instance = new Constructor();
      return invoke(instance, Type, locals) || instance;
    };
    return injector;
  }


  forEach(modulesToLoad, function(module){
    if (isString(module)) {
      module = moduleRegistry[module];
    }
    if (isFunction(module) || isArray(module)) {
      $injector(module);
    } else {
      assertArgFn(module, 'module');
    }
  });

  // instantiate $eager providers
  // for perf we can't do forEach
  for(var name in cache) {
    var index = name.indexOf(providerSuffix);
    if (index  == name.length - providerSuffixLength  && cache[name].$eager) {
      $injector(name.substring(1, index));
    }
  }

  return $injector;
}
