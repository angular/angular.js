'use strict';

/**
 * @ngdoc service
 * @name $exceptionHandler
 * @requires ng.$log
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 *
 * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by
 * {@link ngMock.$exceptionHandler mock $exceptionHandler} which aids in testing.
 *
 * ## Example:
 *
 * ```js
 *   angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
 *     return function (exception, cause) {
 *       exception.message += ' (caused by "' + cause + '")';
 *       throw exception;
 *     };
 *   });
 * ```
 *
 * This example will override the normal action of `$exceptionHandler`, to make angular
 * exceptions fail hard when they happen, instead of just logging to the console.
 *
 * <hr />
 * Note, that code executed outside of the Angular context does not delegate exceptions to the
 * {@link ng.$exceptionHandler $exceptionHandler}. Some common such cases include functions invoked
 * by third party libraries and callbacks associated with XHR, setTimeout/setInterval and browser
 * DOM events (including callbacks registered using jqLite's/jQuery's `on`/`bind` methods).
 * For some of those cases, Angular provides native wrappers that transparently manage the $digest
 * cycle and delegate exceptions to the {@link ng.$exceptionHandler $exceptionHandler} (e.g.
 * {@link ng.$http $http} for XHR, {@link ng.$timeout $timeout}/{@link ng.$interval $interval} for
 * setTimeout/setInterval). For the rest, you can explicitly ensure that the code is excecuted
 * inside of the Angular context, by wrapping it in
 * {@link ng.$rootScope.Scope#$apply scope.$apply()}.
 *
 * @param {Error} exception Exception associated with the error.
 * @param {string=} cause optional information about the context in which
 *       the error was thrown.
 *
 */
function $ExceptionHandlerProvider() {
  this.$get = ['$log', function($log) {
    return function(exception, cause) {
      $log.error.apply($log, arguments);
    };
  }];
}
