/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$defer
 * @requires $browser
 * @requires $exceptionHandler
 * @requires $updateView
 *
 * @description
 * Delegates to {@link angular.service.$browser.defer $browser.defer}, but wraps the `fn` function
 * into a try/catch block and delegates any exceptions to
 * {@link angular.services.$exceptionHandler $exceptionHandler} service.
 *
 * In tests you can use `$browser.defer.flush()` to flush the queue of deferred functions.
 *
 * @param {function()} fn A function, who's execution should be deferred.
 */
angularServiceInject('$defer', function($browser, $exceptionHandler, $updateView) {
  var scope = this;

  return function(fn) {
    $browser.defer(function() {
      try {
        fn();
      } catch(e) {
        $exceptionHandler(e);
      } finally {
        $updateView();
      }
    });
  };
}, ['$browser', '$exceptionHandler', '$updateView']);
