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
    /** @type {Object.<string, angular.Module>} */
    var modules = {};

    /**
     * @ngdoc function
     * @name angular.module
     * @description
     *
     * The `angular.module` is a global place for registering angular modules. All modules
     * (angular core or 3rd party) that should be available to an application must be registered using this mechanism.
     *
     * # Module
     *
     * A module is a collocation of services, directives, filters, and configure information. Module is used to configure the,
     * {@link angular.module.AUTO.$injector $injector}.
     *
     * <pre>
     * // Create a new module
     * var myModule = angular.module('myModule', []);
     *
     * // configure a new service
     * myModule.value('appName', 'MyCoolApp');
     *
     * // configure existing services inside initialization blocks.
     * myModule.init(function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix = '!';
     * });
     * </pre>
     *
     * Then you can load your module like this:
     *
     * <pre>
     * var injector = angular.injector('ng', 'MyModule')
     * </pre>
     *
     * @param {!string} name The name of the module to create or retrieve.
     * @param {Array.<string>=} requires If specified then new module is being created. If unspecified then the
     *        the module is being retrieved for further configuration.
     * @param {Function} initFn Option configuration function for the module. Same as
     *        {@link angular.Module#init Module.init()}.
     * @return {angular.Module}
     */
    return function module(name, requires, initFn) {
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw Error('No module: ' + name);
        }

        function init(fn) {
          invokeQueue.push(['$injector', 'invoke', [null, fn]]);
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {angular.Module} */
        var moduleInstance = {
          /**
           * @ngdoc property
           * @name angular.Module#requires
           * @propertyOf angular.Module
           * @returns {Array.<string>} List of module names which must be loaded before this module.
           * @description
           * Holds the list of modules which the injector will load before the current module is loaded.
           */
          requires: requires,
          invokeQueue: invokeQueue,

          /**
           * @ngdoc method
           * @name angular.Module#service
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} providerType Construction function for creating new instance of the service.
           * @description
           * See {@link angular.module.AUTO.$provide#service $provide.service()}.
           */
          service: invokeLater('$provide', 'service'),

          /**
           * @ngdoc method
           * @name angular.Module#factory
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} providerFunction Function for creating new instance of the service.
           * @description
           * See {@link angular.module.AUTO.$provide#service $provide.factory()}.
           */
          factory: invokeLater('$provide', 'factory'),

          /**
           * @ngdoc method
           * @name angular.Module#value
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {*} object Service instance object.
           * @description
           * See {@link angular.module.AUTO.$provide#value $provide.value()}.
           */
          value: invokeLater('$provide', 'value'),

          /**
           * @ngdoc method
           * @name angular.Module#filter
           * @methodOf angular.Module
           * @param {string} name filterr name
           * @param {Function} filterFactory Factory function for creating new instance of filter.
           * @description
           * See {@link angular.module.ng.$filterProvider#register $filterProvider.register()}.
           */
          filter: invokeLater('$filterProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#init
           * @methodOf angular.Module
           * @param {Function} initializationFn Execute this function on module load, allowing it to do any
           *   service configuration..
           * @description
           * Use this method to register work which needs to be performed on module loading.
           */
          init: init
        };

        if (initFn) {
          init(initFn);
        }

        return  moduleInstance;

        /**
         * @param {string} provider
         * @param {string} method
         * @returns {angular.Module}
         */
        function invokeLater(provider, method) {
          return function() {
            invokeQueue.push([provider, method, arguments]);
            return moduleInstance;
          }
        }
      });
    };
  });

}
