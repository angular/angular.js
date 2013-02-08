'use strict';

/**
 * @ngdoc interface
 * @name angular.Module
 * @description
 *
 * Interface for configuring angular {@link angular.module modules}.
 */

function setupModuleLoader(window) {

  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  return ensure(ensure(window, 'angular', Object), 'module', function() {
    /** @type {Object.<ng.Module|null>} */ // TODO(i): do we want to allow null?!?
    var modules = {};

    /**
     * @ngdoc function
     * @name angular.module
     * @description
     *
     * The `angular.module` is a global place for creating and registering Angular modules. All
     * modules (angular core or 3rd party) that should be available to an application must be
     * registered using this mechanism.
     *
     *
     * # Module
     *
     * A module is a collocation of services, directives, filters, and configuration information. Module
     * is used to configure the {@link AUTO.$injector $injector}.
     *
     * <pre>
     * // Create a new module
     * var myModule = angular.module('myModule', []);
     *
     * // register a new service
     * myModule.value('appName', 'MyCoolApp');
     *
     * // configure existing services inside initialization blocks.
     * myModule.config(function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix('!');
     * });
     * </pre>
     *
     * Then you can create an injector and load your modules like this:
     *
     * <pre>
     * var injector = angular.injector(['ng', 'MyModule'])
     * </pre>
     *
     * However it's more likely that you'll just use
     * {@link ng.directive:ngApp ngApp} or
     * {@link angular.bootstrap} to simplify this process for you.
     *
     * @param {!string} name The name of the module to create or retrieve.
     * @param {Array.<string>=} requires If specified then new module is being created. If unspecified then the
     *        the module is being retrieved for further configuration.
     * @param {Function=} configFn Optional configuration function for the module. Same as
     *        {@link angular.Module#config Module#config()}.
     * @returns {ng.Module} new module with the {@link angular.Module} api.
     */
    return function module(name, requires, configFn) {
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw Error('No module: ' + name);
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {!Array.<Function>} */
        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke');

        var moduleInstance = /** @lends {ng.Module}*/{
          // Private state
          _invokeQueue: invokeQueue,
          _runBlocks: runBlocks,

          /**
           * @ngdoc property
           * @name angular.Module#requires
           * @propertyOf angular.Module
           *
           * @description
           * Holds the list of modules which the injector will load before the current module is loaded.
           *
           * @type {Array.<string>} List of module names which must be loaded before this module.
           */
          requires: requires,

          /**
           * @ngdoc property
           * @name angular.Module#name
           * @propertyOf angular.Module
           * @type {string} Name of the module.
           */
          name: name,


          /**
           * @ngdoc method
           * @name angular.Module#provider
           * @methodOf angular.Module
           *
           * @description
           * See {@link AUTO.$provide#provider $provide.provider()}.
           *
           * @param {string} name service name
           * @param {Function} providerType Construction function for creating new instance of the service.
           */
          provider: invokeLater('$provide', 'provider'),

          /**
           * @ngdoc method
           * @name angular.Module#factory
           * @methodOf angular.Module
           *
           * @description
           * See {@link AUTO.$provide#factory $provide.factory()}.
           *
           * @param {string} name service name
           * @param {Function} providerFunction Function for creating new instance of the service.
           */
          factory: invokeLater('$provide', 'factory'),

          /**
           * @ngdoc method
           * @name angular.Module#service
           * @methodOf angular.Module
           *
           * @description
           * See {@link AUTO.$provide#service $provide.service()}.
           *
           * @param {string} name service name
           * @param {Function} constructor A constructor function that will be instantiated.
           */
          service: invokeLater('$provide', 'service'),

          /**
           * @ngdoc method
           * @name angular.Module#value
           * @methodOf angular.Module
           *
           * @description
           * See {@link AUTO.$provide#value $provide.value()}.
           *
           * @param {string} name service name
           * @param {*} object Service instance object.
           */
          value: invokeLater('$provide', 'value'),

          /**
           * @ngdoc method
           * @name angular.Module#constant
           * @methodOf angular.Module
           *
           * @description
           * Because the constant are fixed, they get applied before other provide methods.
           * See {@link AUTO.$provide#constant $provide.constant()}.
           *
           * @param {string} name constant name
           * @param {*} object Constant value.
           */
          constant: invokeLater('$provide', 'constant', 'unshift'),

          /**
           * @ngdoc method
           * @name angular.Module#filter
           * @methodOf angular.Module
           *
           * @description
           * See {@link ng.$filterProvider#register $filterProvider.register()}.
           *
           * @param {string} name Filter name.
           * @param {Function} filterFactory Factory function for creating new instance of filter.
           */
          filter: invokeLater('$filterProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#controller
           * @methodOf angular.Module
           *
           * @description
           * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
           *
           * @param {string} name Controller name.
           * @param {Function} constructor Controller constructor function.
           */
          controller: invokeLater('$controllerProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#directive
           * @methodOf angular.Module
           *
           * @description
           * See {@link ng.$compileProvider#directive $compileProvider.directive()}.
           *
           * @param {string} name directive name
           * @param {Function} directiveFactory Factory function for creating new instance of
           * directives.
           */
          directive: invokeLater('$compileProvider', 'directive'),

          /**
           * @ngdoc method
           * @name angular.Module#config
           * @methodOf angular.Module
           *
           * @description
           * Use this method to register work which needs to be performed on module loading.
           *
           * @param {Function} configFn Execute this function on module load. Useful for service
           *    configuration.
           */
          config: config,

          /**
           * @ngdoc method
           * @name angular.Module#run
           * @methodOf angular.Module
           *
           * @description
           * Use this method to register work which should be performed when the injector is done
           * loading all modules.
           *
           * @param {Function} initializationFn Execute this function after injector creation.
           *    Useful for application initialization.
           */
          run: function(initializationFn) {
            runBlocks.push(initializationFn);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return  moduleInstance;

        /**
         * @param {string} provider
         * @param {string} method
         * @param {string=} insertMethod
         * @returns {function(...[*]):ng.Module}
         */
        function invokeLater(provider, method, insertMethod) {
          return function() {
            /** @type {Function} */(
                /** @type {Object} */(invokeQueue)[insertMethod || 'push'])([provider, method, arguments]);
            return moduleInstance;
          }
        }
      });
    };
  });
}
