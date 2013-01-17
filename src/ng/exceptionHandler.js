'use strict';

/**
 * @ngdoc function
 * @name ng.$exceptionHandler
 * @requires $log
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 *
 * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by
 * {@link ngMock.$exceptionHandler mock $exceptionHandler}
 *
 * @param {Error} exception Exception associated with the error.
 * @param {string=} cause optional information about the context in which
 *       the error was thrown.
 * @example
  <example>
    <file name="spec.js">
      describe('$exceptionHandlerProvider', function() {

        it('should capture log messages and exceptions', function() {

          module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
          });

          inject(function($log, $exceptionHandler, $timeout) {
            $timeout(function() { $log.log(1); });
            $timeout(function() { $log.log(2); throw 'banana peel'; });
            $timeout(function() { $log.log(3); });
            expect($exceptionHandler.errors).toEqual([]);
            expect($log.assertEmpty());
            $timeout.flush();
            expect($exceptionHandler.errors).toEqual(['banana peel']);
            expect($log.log.logs).toEqual([[1], [2], [3]]);
        });

      });

    });
  </file>
   </example>
   */
function $ExceptionHandlerProvider() {
  this.$get = ['$log', function($log){
    return function(exception, cause) {
      $log.error.apply($log, arguments);
    };
  }];
}
