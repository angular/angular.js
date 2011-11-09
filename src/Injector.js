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
 *    `injector.invoke(self, fn, locals)`
 *     * `self` -  The "`this`" to be used when invoking the function.
 *     * `fn` - The function to be invoked. The function may have the `$inject` property that
 *        lists the set of arguments which should be auto-injected.
 *        (see {@link guide/dev_guide.di dependency injection}).
 *     * `locals(array)` - Optional array of arguments to pass to the function
 *        invocation after the injection arguments.
 *   * An `eager` property which is used to initialize the eager services.
 *     `injector.eager()`
 */


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
function createInjector(modulesToLoad, moduleRegistry) {
  var cache = {},
      $injector = internalInjector(cache),
      providerSuffix = 'Provider',
      providerSuffixLength = providerSuffix.length;

  value('$injector', $injector);
  value('$provide', {service: service, factory: factory, value: value});

  function service(name, provider) {
    if (isFunction(provider)){
      provider = $injector.instantiate(provider);
    }
    if (!provider.$get) {
      throw Error('Providers must define $get factory method.');
    }
    cache['#' + name + providerSuffix] = provider;
  };
  function factory(name, factoryFn) { service(name, { $get:factoryFn }); };
  function value(name, value) { factory(name, valueFn(value)); };

  function internalInjector(cache) {
    var path = [];

    function injector(value) {
      switch(typeof value) {
        case 'function':
          return invoke(null, value);
        case 'string':
          var instanceKey = '#' + value,
              instance = cache[instanceKey];
          if (instance !== undefined || cache.hasOwnProperty(instanceKey)) {
            return instance;
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
          if (isArray(value)) {
            return invoke(null, value);
          }
        default:
          throw Error('Injector expects name or function.');
      }
    }

    function invoke(self, fn, locals){
      var args = [],
          $inject,

          length,
          key;

      if (typeof fn == 'function') {
        $inject = inferInjectionArgs(fn);
        length = $inject.length;
      } else {
        if (isArray(fn)) {
          $inject = fn;
          length = $inject.length;
          fn = $inject[--length];
        }
        assertArgFn(fn, 'fn');
      }

      while(length--) {
        key = $inject[length];
        args.unshift(
          locals && locals.hasOwnProperty(key)
          ? locals[key]
          : injector($inject[length], path)
        );
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
    injector.loadModule = loadModule;
    return injector;
  }

  function loadModule(modulesToLoad){
    forEach(isString(modulesToLoad) ? modulesToLoad.split(',') : modulesToLoad, function(module) {
      if (isString(module)) {
        if (moduleRegistry[module = trim(module)]) {
          module = moduleRegistry[module];
        } else {
          throw Error("Module '" + module + "' is not defined!");
        }
      }
      if (isFunction(module) || isArray(module)) {
        $injector(module);
      } else {
        assertArgFn(module, 'module');
      }
    });
  }


  loadModule(modulesToLoad);

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
