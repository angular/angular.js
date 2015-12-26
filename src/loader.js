'use strict';

/**
 * @ngdoc type
 * @name angular.Module
 * @module ng
 * @description
 *
 * Interface for configuring angular {@link angular.module modules}.
 */

function setupModuleLoader(window) {

  var $injectorMinErr = minErr('$injector');
  var ngMinErr = minErr('ng');

  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  var angular = ensure(window, 'angular', Object);

  // We need to expose `angular.$$minErr` to modules such as `ngResource` that reference it during bootstrap
  angular.$$minErr = angular.$$minErr || minErr;

  return ensure(angular, 'module', function() {
    /** @type {Object.<string, angular.Module>} */
    var modules = {};

    /**
     * @ngdoc function
     * @name angular.module
     * @module ng
     * @description
     *
     * The `angular.module` is a global place for creating, registering and retrieving Angular
     * modules.
     * All modules (angular core or 3rd party) that should be available to an application must be
     * registered using this mechanism.
     *
     * Passing one argument retrieves an existing {@link angular.Module},
     * whereas passing more than one argument creates a new {@link angular.Module}
     *
     *
     * # Module
     *
     * A module is a collection of services, directives, controllers, filters, and configuration information.
     * `angular.module` is used to configure the {@link auto.$injector $injector}.
     *
     * ```js
     * // Create a new module
     * var myModule = angular.module('myModule', []);
     *
     * // register a new service
     * myModule.value('appName', 'MyCoolApp');
     *
     * // configure existing services inside initialization blocks.
     * myModule.config(['$locationProvider', function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix('!');
     * }]);
     * ```
     *
     * Then you can create an injector and load your modules like this:
     *
     * ```js
     * var injector = angular.injector(['ng', 'myModule'])
     * ```
     *
     * However it's more likely that you'll just use
     * {@link ng.directive:ngApp ngApp} or
     * {@link angular.bootstrap} to simplify this process for you.
     *
     * @param {!string} name The name of the module to create or retrieve.
     * @param {!Array.<string>=} requires If specified then new module is being created. If
     *        unspecified then the module is being retrieved for further configuration.
     * @param {Function=} configFn Optional configuration function for the module. Same as
     *        {@link angular.Module#config Module#config()}.
     * @returns {module} new module with the {@link angular.Module} api.
     */
    return function module(name, requires, configFn) {
      var assertNotHasOwnProperty = function(name, context) {
        if (name === 'hasOwnProperty') {
          throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
        }
      };

      assertNotHasOwnProperty(name, 'module');
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw $injectorMinErr('nomod', "Module '{0}' is not available! You either misspelled " +
             "the module name or forgot to load it. If registering a module ensure that you " +
             "specify the dependencies as the second argument.", name);
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {!Array.<Function>} */
        var configBlocks = [];

        /** @type {!Array.<Function>} */
        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke', 'push', configBlocks);

        /** @type {angular.Module} */
        var moduleInstance = {
          // Private state
          _invokeQueue: invokeQueue,
          _configBlocks: configBlocks,
          _runBlocks: runBlocks,

          /**
           * @ngdoc property
           * @name angular.Module#requires
           * @module ng
           *
           * @description
           * Holds the list of modules which the injector will load before the current module is
           * loaded.
           */
          requires: requires,

          /**
           * @ngdoc property
           * @name angular.Module#name
           * @module ng
           *
           * @description
           * Name of the module.
           */
          name: name,


          /**
           * @ngdoc method
           * @name angular.Module#provider
           * @module ng
           * @param {string} name service name
           * @param {Function} providerType Construction function for creating new instance of the
           *                                service.
           * @description
           * See {@link auto.$provide#provider $provide.provider()}.
           */
          provider: invokeLaterAndSetModuleName('$provide', 'provider'),

          /**
           * @ngdoc method
           * @name angular.Module#factory
           * @module ng
           * @param {string} name service name
           * @param {Function} providerFunction Function for creating new instance of the service.
           * @description
           * See {@link auto.$provide#factory $provide.factory()}.
           */
          factory: invokeLaterAndSetModuleName('$provide', 'factory'),

          /**
           * @ngdoc method
           * @name angular.Module#service
           * @module ng
           * @param {string} name service name
           * @param {Function} constructor A constructor function that will be instantiated.
           * @description
           * See {@link auto.$provide#service $provide.service()}.
           */
          service: invokeLaterAndSetModuleName('$provide', 'service'),

          /**
           * @ngdoc method
           * @name angular.Module#value
           * @module ng
           * @param {string} name service name
           * @param {*} object Service instance object.
           * @description
           * See {@link auto.$provide#value $provide.value()}.
           */
          value: invokeLater('$provide', 'value'),

          /**
           * @ngdoc method
           * @name angular.Module#constant
           * @module ng
           * @param {string} name constant name
           * @param {*} object Constant value.
           * @description
           * Because the constants are fixed, they get applied before other provide methods.
           * See {@link auto.$provide#constant $provide.constant()}.
           */
          constant: invokeLater('$provide', 'constant', 'unshift'),

           /**
           * @ngdoc method
           * @name angular.Module#decorator
           * @module ng
           * @param {string} The name of the service to decorate.
           * @param {Function} This function will be invoked when the service needs to be
           *                                    instantiated and should return the decorated service instance.
           * @description
           * See {@link auto.$provide#decorator $provide.decorator()}.
           */
          decorator: invokeLaterAndSetModuleName('$provide', 'decorator'),

          /**
           * @ngdoc method
           * @name angular.Module#animation
           * @module ng
           * @param {string} name animation name
           * @param {Function} animationFactory Factory function for creating new instance of an
           *                                    animation.
           * @description
           *
           * **NOTE**: animations take effect only if the **ngAnimate** module is loaded.
           *
           *
           * Defines an animation hook that can be later used with
           * {@link $animate $animate} service and directives that use this service.
           *
           * ```js
           * module.animation('.animation-name', function($inject1, $inject2) {
           *   return {
           *     eventName : function(element, done) {
           *       //code to run the animation
           *       //once complete, then run done()
           *       return function cancellationFunction(element) {
           *         //code to cancel the animation
           *       }
           *     }
           *   }
           * })
           * ```
           *
           * See {@link ng.$animateProvider#register $animateProvider.register()} and
           * {@link ngAnimate ngAnimate module} for more information.
           */
          animation: invokeLaterAndSetModuleName('$animateProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#filter
           * @module ng
           * @param {string} name Filter name - this must be a valid angular expression identifier
           * @param {Function} filterFactory Factory function for creating new instance of filter.
           * @description
           * See {@link ng.$filterProvider#register $filterProvider.register()}.
           *
           * <div class="alert alert-warning">
           * **Note:** Filter names must be valid angular {@link expression} identifiers, such as `uppercase` or `orderBy`.
           * Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace
           * your filters, then you can use capitalization (`myappSubsectionFilterx`) or underscores
           * (`myapp_subsection_filterx`).
           * </div>
           */
          filter: invokeLaterAndSetModuleName('$filterProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#controller
           * @module ng
           * @param {string|Object} name Controller name, or an object map of controllers where the
           *    keys are the names and the values are the constructors.
           * @param {Function} constructor Controller constructor function.
           * @description
           * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
           */
          controller: invokeLaterAndSetModuleName('$controllerProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#directive
           * @module ng
           * @param {string|Object} name Directive name, or an object map of directives where the
           *    keys are the names and the values are the factories.
           * @param {Function} directiveFactory Factory function for creating new instance of
           * directives.
           * @description
           * See {@link ng.$compileProvider#directive $compileProvider.directive()}.
           */
          directive: invokeLaterAndSetModuleName('$compileProvider', 'directive'),

          /**
           * @ngdoc method
           * @name angular.Module#component
           * @module ng
           * @param {string} name Name of the component in camel-case (i.e. myComp which will match as my-comp)
           * @param {Object} options Component definition object (a simplified
           *    {@link ng.$compile#directive-definition-object directive definition object}),
           *    has the following properties (all optional):
           *
           *    - `controller` – `{(string|function()=}` – Controller constructor function that should be
           *      associated with newly created scope or the name of a {@link ng.$compile#-controller-
           *      registered controller} if passed as a string. Empty function by default.
           *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
           *      If present, the controller will be published to scope under the `controllerAs` name.
           *      If not present, this will default to be the same as the component name.
           *    - `template` – `{string=|function()=}` – html template as a string or a function that
           *      returns an html template as a string which should be used as the contents of this component.
           *      Empty string by default.
           *
           *      If `template` is a function, then it is {@link guide/di injectable}, and receives
           *      the following locals:
           *
           *      - `$element` - Current element
           *      - `$attrs` - Current attributes object for the element
           *
           *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
           *      template that should be used  as the contents of this component.
           *
           *      If `templateUrl` is a function, then it is {@link guide/di injectable}, and receives
           *      the following locals:
           *
           *      - `$element` - Current element
           *      - `$attrs` - Current attributes object for the element
           *    - `bindings` – `{object=}` – Define DOM attribute binding to component properties.
           *      Component properties are always bound to the component controller and not to the scope.
           *    - `transclude` – `{boolean=}` – Whether {@link $compile#transclusion transclusion} is enabled.
           *      Enabled by default.
           *    - `isolate` – `{boolean=}` – Whether the new scope is isolated. Isolated by default.
           *    - `restrict` - `{string=}` - String of subset of {@link ng.$compile#-restrict- EACM} which
           *      restricts the component to specific directive declaration style. If omitted, this defaults to 'E'.
           *    - `$canActivate` – `{function()=}` – TBD.
           *    - `$routeConfig` – `{object=}` – TBD.
           *
           * @description
           * Register a component definition with the compiler. This is short for registering a specific
           * subset of directives which represents actual UI components in your application. Component
           * definitions are very simple and do not require the complexity behind defining directives.
           * Component definitions usually consist only of the template and the controller backing it.
           * In order to make the definition easier, components enforce best practices like controllerAs
           * and default behaviors like scope isolation, restrict to elements and allow transclusion.
           *
           * <br />
           * Here are a few examples of how you would usually define components:
           *
           * ```js
           *   var myMod = angular.module(...);
           *   myMod.component('myComp', {
           *     template: '<div>My name is {{myComp.name}}</div>',
           *     controller: function() {
           *       this.name = 'shahar';
           *     }
           *   });
           *
           *   myMod.component('myComp', {
           *     template: '<div>My name is {{myComp.name}}</div>',
           *     bindings: {name: '@'}
           *   });
           *
           *   myMod.component('myComp', {
           *     templateUrl: 'views/my-comp.html',
           *     controller: 'MyCtrl as ctrl',
           *     bindings: {name: '@'}
           *   });
           *
           * ```
           *
           * <br />
           * Components are also useful as route templates (e.g. when using
           * {@link ngRoute ngRoute}):
           *
           * ```js
           *   var myMod = angular.module('myMod', ['ngRoute']);
           *
           *   myMod.component('home', {
           *     template: '<h1>Home</h1><p>Hello, {{ home.user.name }} !</p>',
           *     controller: function() {
           *       this.user = {name: 'world'};
           *     }
           *   });
           *
           *   myMod.config(function($routeProvider) {
           *     $routeProvider.when('/', {
           *       template: '<home></home>'
           *     });
           *   });
           * ```
           *
           * <br />
           * When using {@link ngRoute.$routeProvider $routeProvider}, you can often avoid some
           * boilerplate, by assigning the resolved dependencies directly on the route scope:
           *
           * ```js
           *   var myMod = angular.module('myMod', ['ngRoute']);
           *
           *   myMod.component('home', {
           *     template: '<h1>Home</h1><p>Hello, {{ home.user.name }} !</p>',
           *     bindings: {user: '='}
           *   });
           *
           *   myMod.config(function($routeProvider) {
           *     $routeProvider.when('/', {
           *       template: '<home user="$resolve.user"></home>',
           *       resolve: {user: function($http) { return $http.get('...'); }}
           *     });
           *   });
           * ```
           *
           * <br />
           * See also {@link ng.$compileProvider#directive $compileProvider.directive()}.
           */
          component: function(name, options) {
            function factory($injector) {
              function makeInjectable(fn) {
                if (isFunction(fn) || Array.isArray(fn)) {
                  return function(tElement, tAttrs) {
                    return $injector.invoke(fn, this, {$element: tElement, $attrs: tAttrs});
                  };
                } else {
                  return fn;
                }
              }

              var template = (!options.template && !options.templateUrl ? '' : options.template);
              return {
                controller: options.controller || function() {},
                controllerAs: identifierForController(options.controller) || options.controllerAs || name,
                template: makeInjectable(template),
                templateUrl: makeInjectable(options.templateUrl),
                transclude: options.transclude === undefined ? true : options.transclude,
                scope: options.isolate === false ? true : {},
                bindToController: options.bindings || {},
                restrict: options.restrict || 'E'
              };
            }

            if (options.$canActivate) {
              factory.$canActivate = options.$canActivate;
            }
            if (options.$routeConfig) {
              factory.$routeConfig = options.$routeConfig;
            }
            factory.$inject = ['$injector'];

            return moduleInstance.directive(name, factory);
          },

          /**
           * @ngdoc method
           * @name angular.Module#config
           * @module ng
           * @param {Function} configFn Execute this function on module load. Useful for service
           *    configuration.
           * @description
           * Use this method to register work which needs to be performed on module loading.
           * For more about how to configure services, see
           * {@link providers#provider-recipe Provider Recipe}.
           */
          config: config,

          /**
           * @ngdoc method
           * @name angular.Module#run
           * @module ng
           * @param {Function} initializationFn Execute this function after injector creation.
           *    Useful for application initialization.
           * @description
           * Use this method to register work which should be performed when the injector is done
           * loading all modules.
           */
          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return moduleInstance;

        /**
         * @param {string} provider
         * @param {string} method
         * @param {String=} insertMethod
         * @returns {angular.Module}
         */
        function invokeLater(provider, method, insertMethod, queue) {
          if (!queue) queue = invokeQueue;
          return function() {
            queue[insertMethod || 'push']([provider, method, arguments]);
            return moduleInstance;
          };
        }

        /**
         * @param {string} provider
         * @param {string} method
         * @returns {angular.Module}
         */
        function invokeLaterAndSetModuleName(provider, method) {
          return function(recipeName, factoryFunction) {
            if (factoryFunction && isFunction(factoryFunction)) factoryFunction.$$moduleName = name;
            invokeQueue.push([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
  });

}
