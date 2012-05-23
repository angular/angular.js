'use strict';

/**
 * @ngdoc function
 * @name angular.module.ng.$defer
 * @deprecated Made obsolete by $timeout service. Please migrate your code. This service will be
 *   removed with 1.0 final.
 * @requires $browser
 *
 * @description
 * Delegates to {@link angular.module.ng.$browser#defer $browser.defer}, but wraps the `fn` function
 * into a try/catch block and delegates any exceptions to
 * {@link angular.module.ng.$exceptionHandler $exceptionHandler} service.
 *
 * In tests you can use `$browser.defer.flush()` to flush the queue of deferred functions.
 *
 * @param {function()} fn A function, who's execution should be deferred.
 * @param {number=} [delay=0] of milliseconds to defer the function execution.
 * @returns {*} DeferId that can be used to cancel the task via `$defer.cancel()`.
 */

/**
 * @ngdoc function
 * @name angular.module.ng.$defer#cancel
 * @methodOf angular.module.ng.$defer
 *
 * @description
 * Cancels a defered task identified with `deferId`.
 *
 * @param {*} deferId Token returned by the `$defer` function.
 * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfuly canceled.
 */
function $DeferProvider(){
  this.$get = ['$rootScope', '$browser', '$log', function($rootScope, $browser, $log) {
    $log.warn('$defer service has been deprecated, migrate to $timeout');

    function defer(fn, delay) {
      return $browser.defer(function() {
        $rootScope.$apply(fn);
      }, delay);
    }

    defer.cancel = function(deferId) {
      return $browser.defer.cancel(deferId);
    };

    return defer;
  }];
}
