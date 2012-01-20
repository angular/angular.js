'use strict';

function $ControllerProvider() {
  this.$get = ['$injector', function($injector) {

    /**
     * @ngdoc function
     * @name angular.module.ng.$controller
     * @requires $injector
     *
     * @param {Function} Class Constructor function of a controller to instantiate.
     * @param {Object} scope Related scope.
     * @return {Object} Instance of given controller.
     *
     * @description
     * `$controller` service is responsible for instantiating controllers.
     *
     * It's just simple call to {@link angular.module.AUTO.$injector $injector}, but extracted into
     * a service, so that one can override this service with {@link https://gist.github.com/1649788
     * BC version}.
     */
    return function(Class, scope) {
      return $injector.instantiate(Class, {$scope: scope});
    };
  }];
}
