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

 * @param {<string, function()>} modules... A list of module functions or their aliases. See
 *        {@link angular.module}. The `NG` module must be explicitly added.
 * @returns {function()} Injector function. See {@link angular.module.AUTO.$injector $injector}.
 *
 * @example
 * Typical usage
 * <pre>
 *   // create an injector
 *   var $injector = angular.injector('NG');
 *
 *   // use the injector to kick of your application
 *   // use the type inference to auto inject arguments, or use implicit injection
 *   $injector(function($rootScope, $compile, $document){
 *     $compile($document)($rootScope);
 *     $rootScope.$digest();
 *   });
 * </pre>
 */


/**
 * @ngdoc overview
 * @name angular.module.AUTO
 * @description
 *
 * Implicit module which gets automatically added to each {@link angular.module.AUTO.$injector $injector}.
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

/**
 * @ngdoc function
 * @name angular.module.AUTO.$injector
 * @function
 *
 * @description
 *
 * `$injector` function is used to retrieve object instances. Object instances are defined by
 * {@link angular.module.AUTO.$provide provider}.
 *
 * The following always holds true:
 *
 * <pre>
 *   var $injector = angular.injector();
 *   expect($injector('$injector')).toBe($injector);
 *   expect($injector(function($injector){
 *     return $injector;
 *   }).toBe($injector);
 * </pre>
 *
 * # Injection Function Annotation
 *
 * JavaScript does not have annotations, and annotations are needed for dependency injection. The
 * following ways are all valid way of annotating function with injection arguments and are equivalent.
 *
 * <pre>
 *   // inferred (only works if code not minified/obfuscated)
 *   $inject.invoke(function(serviceA){});
 *
 *   // annotated
 *   function explicit(serviceA) {};
 *   explicit.$inject = ['serviceA'];
 *   $inject.invoke(explicit);
 *
 *   // inline
 *   $inject.invoke(['serviceA', function(serviceA){}]);
 * </pre>
 *
 * ## Inference
 *
 * In JavaScript calling `toString()` on a function returns the function definition. The definition can then be
 * parsed and the function arguments can be extracted. *NOTE:* This does not work with minfication, and obfuscation
 * tools since these tools change the argument names.
 *
 * ## `$inject` Annotation
 * By adding a `$inject` property onto a function the injection parameters can be specified.
 *
 * ## Inline
 * As an array of injection names, where the last item in the array is the function to call.
 *
 * @param {string, function()} argument  If the `argument` is:
 *
 *    - `string`: Retrieve an instance of a named object. If object does not exist, use the provider to create
 *                a new instance. Calling the method repeatedly with the same name will always return the same
 *                instance.
 *    - `function`: Invoke the function. This is a short hand for `$injector.`{@link #invoke invoke(null, argument)}.
 * @return the object instance or the return value of the invoked function.
 */

/**
 * @ngdoc method
 * @name angular.module.AUTO.$injector#invoke
 * @methodOf angular.module.AUTO.$injector
 *
 * @description
 * Invoke the method and supply the method arguments from the `$injector`.
 *
 * @param {Object} self The `this` for the invoked method.
 * @param {function} fn The function to invoke. The function arguments come form the function annotation.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
 *   the `$injector` is consulted.
 * @return the value returned by the invoked `fn` function.
 */

/**
 * @ngdoc method
 * @name angular.module.AUTO.$injector#instantiate
 * @methodOf angular.module.AUTO.$injector
 * @description
 * Create a new instance of JS type. The method takes a constructor function invokes the new operator and supplies
 * all of the arguments to the constructor function as specified by the constructor annotation.
 *
 * @param {function} Type Annotated constructor function.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
 *   the `$injector` is consulted.
 * @return new instance of `Type`.
 */

/**
 * @ngdoc method
 * @name angular.module.AUTO.$injector#loadModule
 * @methodOf angular.module.AUTO.$injector
 * @description
 * Load additional modules into the current injector configuration
 *
 * @param {Array} modules An array of modules, where module is a:
 *
 *   - `string`: look up the module function from {@link angular.module} and then treat as `function`.
 *   - `function`: execute the module configuration function using
 *      {@link angular.module.AUTO.$injector#invoke $injector.invoke()}
 */



/**
 * @ngdoc object
 * @name angular.module.AUTO.$provide
 *
 * @description
 *
 * Use `$provide` to register new providers with the `$injector`. The providers are the factories for the instance.
 * The providers share the same name as the instance they create with the `Provide` suffixed to them.
 *
 * A provider is an object with a `$get()` method. The injector calls the `$get` method to create a new instance of
 * a service. The Provider can have additional methods which would allow for configuration of the provider.
 *
 * <pre>
 *   function GreetProvider() {
 *     var salutation = 'Hello';
 *
 *     this.salutation = function(text) {
 *       salutation = text;
 *     };
 *
 *     this.$get = function() {
 *       return function (name) {
 *         return salutation + ' ' + name + '!';
 *       };
 *     };
 *   }
 *
 *   describe('Greeter', function(){
 *
 *     beforeEach(inject(function($provide) {
 *       $provide.service('greet', GreetProvider);
 *     });
 *
 *     it('should greet', inject(function(greet) {
 *       expect(greet('angular')).toEqual('Hello angular!');
 *     }));
 *
 *     it('should allow configuration of salutation', inject(
 *       function(greetProvider) {
 *         greetProvider.salutation('Ahoj');
 *       },
 *       function(greet) {
 *         expect(greet('angular')).toEqual('Ahoj angular!');
 *       }
 *     )};
 *
 *   });
 * </pre>
 */

/**
 * @ngdoc method
 * @name angular.module.AUTO.$provide#service
 * @methodOf angular.module.AUTO.$provide
 * @description
 *
 * Register a provider for a service. The providers can be retrieved and can have additional configuration methods.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provide'` key.
 * @param {(Object|function())} provider If the provider is:
 * 
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *               {@link angular.module.AUTO.$injector#invoke $injector.invoke()} when an instance needs to be created.
 *   - `Constructor`: a new instance of the provider will be created using
 *               {@link angular.module.AUTO.$injector#instantiate $injector.instantiate()}, then treated as `object`.
 *
 */

/**
 * @ngdoc method
 * @name angular.module.AUTO.$provide#factory
 * @methodOf angular.module.AUTO.$provide
 * @description
 *
 * A short hand for configuring services if only `$get` method is required.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provide'` key.
 * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand for
 * `$provide.service(name, {$get:$getFn})`.
 */


/**
 * @ngdoc method
 * @name angular.module.AUTO.$provide#value
 * @methodOf angular.module.AUTO.$provide
 * @description
 *
 * A short hand for configuring services if the `$get` method is a constant.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provide'` key.
 * @param {function()} value The $getFn for the instance creation. Internally this is a short hand for
 * `$provide.service(name, {$get:function(){ return value; }})`.
 */


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
