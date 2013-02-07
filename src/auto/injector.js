'use strict';

/**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an injector function that can be used for retrieving services as well as for
 * dependency injection (see {@link guide/di dependency injection}).
 *

 * @param {Array.<string|Function>} modules A list of module functions or their aliases. See
 *        {@link angular.module}. The `ng` module must be explicitly added.
 * @returns {function()} Injector function. See {@link AUTO.$injector $injector}.
 *
 * @example
 * Typical usage
 * <pre>
 *   // create an injector
 *   var $injector = angular.injector(['ng']);
 *
 *   // use the injector to kick off your application
 *   // use the type inference to auto inject arguments, or use implicit injection
 *   $injector.invoke(function($rootScope, $compile, $document){
 *     $compile($document)($rootScope);
 *     $rootScope.$digest();
 *   });
 * </pre>
 */


/**
 * @ngdoc overview
 * @name AUTO
 * @description
 *
 * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.
 */

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function annotate(fn) {
  var $inject,
      fnText,
      argDecl,
      last;

  if (typeof fn == 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      fnText = fn.toString().replace(STRIP_COMMENTS, '');
      argDecl = fnText.match(FN_ARGS);
      forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
        arg.replace(FN_ARG, function(all, underscore, name){
          $inject.push(name);
        });
      });
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn')
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}

///////////////////////////////////////

/**
 * @ngdoc object
 * @name AUTO.$injector
 * @function
 *
 * @description
 *
 * `$injector` is used to retrieve object instances as defined by
 * {@link AUTO.$provide provider}, instantiate types, invoke methods,
 * and load modules.
 *
 * The following always holds true:
 *
 * <pre>
 *   var $injector = angular.injector();
 *   expect($injector.get('$injector')).toBe($injector);
 *   expect($injector.invoke(function($injector){
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
 * parsed and the function arguments can be extracted. *NOTE:* This does not work with minification, and obfuscation
 * tools since these tools change the argument names.
 *
 * ## `$inject` Annotation
 * By adding a `$inject` property onto a function the injection parameters can be specified.
 *
 * ## Inline
 * As an array of injection names, where the last item in the array is the function to call.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#get
 * @methodOf AUTO.$injector
 *
 * @description
 * Return an instance of the service.
 *
 * @param {string} name The name of the instance to retrieve.
 * @return {*} The instance.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#invoke
 * @methodOf AUTO.$injector
 *
 * @description
 * Invoke the method and supply the method arguments from the `$injector`.
 *
 * @param {!function} fn The function to invoke. The function arguments come form the function annotation.
 * @param {Object=} self The `this` for the invoked method.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
 *   the `$injector` is consulted.
 * @returns {*} the value returned by the invoked `fn` function.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#instantiate
 * @methodOf AUTO.$injector
 * @description
 * Create a new instance of JS type. The method takes a constructor function invokes the new operator and supplies
 * all of the arguments to the constructor function as specified by the constructor annotation.
 *
 * @param {function} Type Annotated constructor function.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
 *   the `$injector` is consulted.
 * @returns {Object} new instance of `Type`.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#annotate
 * @methodOf AUTO.$injector
 *
 * @description
 * Returns an array of service names which the function is requesting for injection. This API is used by the injector
 * to determine which services need to be injected into the function when the function is invoked. There are three
 * ways in which the function can be annotated with the needed dependencies.
 *
 * # Argument names
 *
 * The simplest form is to extract the dependencies from the arguments of the function. This is done by converting
 * the function into a string using `toString()` method and extracting the argument names.
 * <pre>
 *   // Given
 *   function MyController($scope, $route) {
 *     // ...
 *   }
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * </pre>
 *
 * This method does not work with code minfication / obfuscation. For this reason the following annotation strategies
 * are supported.
 *
 * # The `$inject` property
 *
 * If a function has an `$inject` property and its value is an array of strings, then the strings represent names of
 * services to be injected into the function.
 * <pre>
 *   // Given
 *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
 *     // ...
 *   }
 *   // Define function dependencies
 *   MyController.$inject = ['$scope', '$route'];
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * </pre>
 *
 * # The array notation
 *
 * It is often desirable to inline Injected functions and that's when setting the `$inject` property is very
 * inconvenient. In these situations using the array notation to specify the dependencies in a way that survives
 * minification is a better choice:
 *
 * <pre>
 *   // We wish to write this (not minification / obfuscation safe)
 *   injector.invoke(function($compile, $rootScope) {
 *     // ...
 *   });
 *
 *   // We are forced to write break inlining
 *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
 *     // ...
 *   };
 *   tmpFn.$inject = ['$compile', '$rootScope'];
 *   injector.invoke(tempFn);
 *
 *   // To better support inline function the inline annotation is supported
 *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
 *     // ...
 *   }]);
 *
 *   // Therefore
 *   expect(injector.annotate(
 *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
 *    ).toEqual(['$compile', '$rootScope']);
 * </pre>
 *
 * @param {function|Array.<string|Function>} fn Function for which dependent service names need to be retrieved as described
 *   above.
 *
 * @returns {Array.<string>} The names of the services which the function requires.
 */




/**
 * @ngdoc object
 * @name AUTO.$provide
 *
 * @description
 *
 * Use `$provide` to register new providers with the `$injector`. The providers are the factories for the instance.
 * The providers share the same name as the instance they create with the `Provider` suffixed to them.
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
 *     beforeEach(module(function($provide) {
 *       $provide.provider('greet', GreetProvider);
 *     });
 *
 *     it('should greet', inject(function(greet) {
 *       expect(greet('angular')).toEqual('Hello angular!');
 *     }));
 *
 *     it('should allow configuration of salutation', function() {
 *       module(function(greetProvider) {
 *         greetProvider.salutation('Ahoj');
 *       });
 *       inject(function(greet) {
 *         expect(greet('angular')).toEqual('Ahoj angular!');
 *       });
 *     )};
 *
 *   });
 * </pre>
 */

/**
 * @ngdoc method
 * @name AUTO.$provide#provider
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a provider for a service. The providers can be retrieved and can have additional configuration methods.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provider'` key.
 * @param {(Object|function())} provider If the provider is:
 *
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *               {@link AUTO.$injector#invoke $injector.invoke()} when an instance needs to be created.
 *   - `Constructor`: a new instance of the provider will be created using
 *               {@link AUTO.$injector#instantiate $injector.instantiate()}, then treated as `object`.
 *
 * @returns {Object} registered provider instance
 */

/**
 * @ngdoc method
 * @name AUTO.$provide#factory
 * @methodOf AUTO.$provide
 * @description
 *
 * A short hand for configuring services if only `$get` method is required.
 *
 * @param {string} name The name of the instance.
 * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand for
 * `$provide.provider(name, {$get: $getFn})`.
 * @returns {Object} registered provider instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#service
 * @methodOf AUTO.$provide
 * @description
 *
 * A short hand for registering service of given class.
 *
 * @param {string} name The name of the instance.
 * @param {Function} constructor A class (constructor function) that will be instantiated.
 * @returns {Object} registered provider instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#value
 * @methodOf AUTO.$provide
 * @description
 *
 * A short hand for configuring services if the `$get` method is a constant.
 *
 * @param {string} name The name of the instance.
 * @param {*} value The value.
 * @returns {Object} registered provider instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#constant
 * @methodOf AUTO.$provide
 * @description
 *
 * A constant value, but unlike {@link AUTO.$provide#value value} it can be injected
 * into configuration function (other modules) and it is not interceptable by
 * {@link AUTO.$provide#decorator decorator}.
 *
 * @param {string} name The name of the constant.
 * @param {*} value The constant value.
 * @returns {Object} registered instance
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#decorator
 * @methodOf AUTO.$provide
 * @description
 *
 * Decoration of service, allows the decorator to intercept the service instance creation. The
 * returned instance may be the original instance, or a new instance which delegates to the
 * original instance.
 *
 * @param {string} name The name of the service to decorate.
 * @param {function()} decorator This function will be invoked when the service needs to be
 *    instanciated. The function is called using the {@link AUTO.$injector#invoke
 *    injector.invoke} method and is therefore fully injectable. Local injection arguments:
 *
 *    * `$delegate` - The original service instance, which can be monkey patched, configured,
 *      decorated or delegated to.
 */


function createInjector(modulesToLoad) {
  var INSTANTIATING = {},
      providerSuffix = 'Provider',
      path = [],
      loadedModules = new HashMap(),
      providerCache = {
        $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
      },
      providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function() {
            throw Error("Unknown provider: " + path.join(' <- '));
          })),
      instanceCache = {},
      instanceInjector = (instanceCache.$injector =
          createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider);
          }));


  forEach(loadModules(modulesToLoad), function(fn) { instanceInjector.invoke(fn || noop); });

  return instanceInjector;

  ////////////////////////////////////
  // $provider
  ////////////////////////////////////

  function supportObject(delegate) {
    return function(key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    }
  }

  function provider(name, provider_) {
    if (isFunction(provider_) || isArray(provider_)) {
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw Error('Provider ' + name + ' must define $get factory method.');
    }
    return providerCache[name + providerSuffix] = provider_;
  }

  function factory(name, factoryFn) { return provider(name, { $get: factoryFn }); }

  function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }

  function value(name, value) { return factory(name, valueFn(value)); }

  function constant(name, value) {
    providerCache[name] = value;
    instanceCache[name] = value;
  }

  function decorator(serviceName, decorFn) {
    var origProvider = providerInjector.get(serviceName + providerSuffix),
        orig$get = origProvider.$get;

    origProvider.$get = function() {
      var origInstance = instanceInjector.invoke(orig$get, origProvider);
      return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
    };
  }

  ////////////////////////////////////
  // Module Loading
  ////////////////////////////////////
  function loadModules(modulesToLoad){
    var runBlocks = [];
    forEach(modulesToLoad, function(module) {
      if (loadedModules.get(module)) return;
      loadedModules.put(module, true);
      if (isString(module)) {
        var moduleFn = angularModule(module);
        runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);

        try {
          for(var invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
            var invokeArgs = invokeQueue[i],
                provider = providerInjector.get(invokeArgs[0]);

            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
          }
        } catch (e) {
          if (e.message) e.message += ' from ' + module;
          throw e;
        }
      } else if (isFunction(module)) {
        try {
          runBlocks.push(providerInjector.invoke(module));
        } catch (e) {
          if (e.message) e.message += ' from ' + module;
          throw e;
        }
      } else if (isArray(module)) {
        try {
          runBlocks.push(providerInjector.invoke(module));
        } catch (e) {
          if (e.message) e.message += ' from ' + String(module[module.length - 1]);
          throw e;
        }
      } else {
        assertArgFn(module, 'module');
      }
    });
    return runBlocks;
  }

  ////////////////////////////////////
  // internal Injector
  ////////////////////////////////////

  function createInternalInjector(cache, factory) {

    function getService(serviceName) {
      if (typeof serviceName !== 'string') {
        throw Error('Service name expected');
      }
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw Error('Circular dependency: ' + path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          return cache[serviceName] = factory(serviceName);
        } finally {
          path.shift();
        }
      }
    }

    function invoke(fn, self, locals){
      var args = [],
          $inject = annotate(fn),
          length, i,
          key;

      for(i = 0, length = $inject.length; i < length; i++) {
        key = $inject[i];
        args.push(
          locals && locals.hasOwnProperty(key)
          ? locals[key]
          : getService(key)
        );
      }
      if (!fn.$inject) {
        // this means that we must be an array.
        fn = fn[length];
      }


      // Performance optimization: http://jsperf.com/apply-vs-call-vs-invoke
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
    }

    function instantiate(Type, locals) {
      var Constructor = function() {},
          instance, returnedValue;

      Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
      instance = new Constructor();
      returnedValue = invoke(Type, instance, locals);

      return isObject(returnedValue) ? returnedValue : instance;
    }

    return {
      invoke: invoke,
      instantiate: instantiate,
      get: getService,
      annotate: annotate
    };
  }
}
