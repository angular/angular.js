'use strict';

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$defer
 * @requires $browser
 * @requires $exceptionHandler
 * @requires $updateView
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
 */
angularServiceInject('$defer', function($browser) {
  var scope = this;
  return function(fn, delay) {
    $browser.defer(function() {
      scope.$apply(fn);
    }, delay);
  };
}, ['$browser', '$exceptionHandler', '$updateView']);
