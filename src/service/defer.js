'use strict';

/**
 * @ngdoc service
 * @name angular.service.$defer
 * @requires $browser
 *
 * @description
 * Delegates to {@link angular.service.$browser $browser.defer}, but wraps the `fn` function
 * into a try/catch block and delegates any exceptions to
 * {@link angular.service.$exceptionHandler $exceptionHandler} service.
 *
 * In tests you can use `$browser.defer.flush()` to flush the queue of deferred functions.
 *
 * @param {function()} fn A function, who's execution should be deferred.
 * @param {number=} [delay=0] of milliseconds to defer the function execution.
 * @returns {*} DeferId that can be used to cancel the task via `$defer.cancel()`.
 */

/**
 * @ngdoc function
 * @name angular.service.$defer#cancel
 * @methodOf angular.service.$defer
 *
 * @description
 * Cancels a defered task identified with `deferId`.
 *
 * @param {*} deferId Token returned by the `$defer` function.
 * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfuly canceled.
 */
angularServiceInject('$defer', function($rootScope, $browser) {
  function defer(fn, delay) {
    return $browser.defer(function() {
      $rootScope.$apply(fn);
    }, delay);
  }

  defer.cancel = function(deferId) {
    return $browser.defer.cancel(deferId);
  };

  return defer;
}, ['$rootScope', '$browser']);
