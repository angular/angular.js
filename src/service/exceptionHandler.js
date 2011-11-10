'use strict';

/**
 * @ngdoc function
 * @name angular.module.NG.$exceptionHandler
 * @requires $log
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 *
 * In unit tests, if `angular-mocks.js` is loaded, this service is overriden by
 * {@link angular.module.NG_MOCK.$exceptionHandler mock $exceptionHandler}
 */
function $ExceptionHandlerProvider(){
  this.$get = ['$log', function($log){
    return function(e) {
      $log.error(e);
    };
  }];
}
