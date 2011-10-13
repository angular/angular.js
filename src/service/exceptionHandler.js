'use strict';

/**
 * @ngdoc service
 * @name angular.service.$exceptionHandler
 * @requires $log
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 *
 * In unit tests, if `angular-mocks.js` is loaded, this service is overriden by
 * {@link angular.mock.service.$exceptionHandler mock $exceptionHandler}
 *
 * @example
 */
var $exceptionHandlerFactory; //reference to be used only in tests
angularServiceInject('$exceptionHandler', $exceptionHandlerFactory = function($log){
  return function(e) {
    $log.error(e);
  };
}, ['$log']);
