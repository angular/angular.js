'use strict';

function $ControllerProvider() {
  this.$get = ['$injector', '$window', function($injector, $window) {

    /**
     * @ngdoc function
     * @name angular.module.ng.$controller
     * @requires $injector
     *
     * @param {Function|string} Class Constructor function of a controller to instantiate, or
     *        expression to read from current scope or window.
     * @param {Object} locals Injection locals for Controller.
     * @return {Object} Instance of given controller.
     *
     * @description
     * `$controller` service is responsible for instantiating controllers.
     *
     * It's just simple call to {@link angular.module.AUTO.$injector $injector}, but extracted into
     * a service, so that one can override this service with {@link https://gist.github.com/1649788
     * BC version}.
     */
    return function(Class, locals) {
      if(isString(Class)) {
        var expression = Class;
        Class = getter(locals.$scope, expression, true) || getter($window, expression, true);
        assertArgFn(Class, expression);
      }

      return $injector.instantiate(Class, locals);
    };
  }];
}
