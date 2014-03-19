'use strict';


function $DebounceProvider() {
  this.$get = ['$timeout', '$q', '$rootScope', function($timeout, $q, $rootScope, invokeApply) {

   /**
    * @ngdoc service
    * @name $debounce
    *
    * @description
    * The $debounce service provides a mechanism for creating a wrapper around a function that
    * ensures that the function is not called more frequently than a given time interval.
    *
    * The result of calling `$debounce()` is a new debounced function, which you can call in the
    * same way as the original function.  All parameters in the call are forwarded on to the
    * original function.
    *
    * @param {!function(...)} fn         The function to be debounced
    * @param {number} delay              The minimum time between calls to `fn`
    * @param {boolean} [immediate=false] If true then `fn` is invoked on the first call to
    *                                    the debounced function. Otherwise the first call will not
    *                                    happen until after the `delay` time has expired
    * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
    *                                    will invoke a {@link ng.$rootScope.Scope#$digest}
    *                                    after running `fn`.
    * @return {function(...) : Promise}  A debounced wrapper function around the `fn` function.
    *                                    This function will return a promise to the return value of
    *                                    `fn`, when it is eventually called.
    *
    * @example
    * <example name="debounce" module="debounce-example">
    * <file name="index.html">
    *   <div ng-controller="DebounceController">
    *     <button ng-click="increment()">Increment</button>
    *     <button ng-click="debouncedIncrement()">Debounced Increment</button>
    *     <div>Counter: {{counter}}</div>
    *   </div>
    * </file>
    * <file name="app.js">
    *   angular.module('debounce-example', [])
    *
    *   .controller('DebounceController', function($scope, $debounce) {
    *     $scope.counter = 0;
    *     $scope.increment = function() {
    *       $scope.counter += 1;
    *     };
    *     $scope.debouncedIncrement = $debounce($scope.increment, 500, true);
    *   });
    * </file>
    * </example>
    */
    return function(func, delay, immediate, invokeApply) {
      var timeout,
          skipApply = (isDefined(invokeApply) && !invokeApply);

      return function() {
        var context = this, args = arguments;

        // Run the wrapped function with an apply if necessary
        var applyFn = function() {
          var result;
          try {
            result = func.apply(context,args);
          } finally {
            if ( !skipApply ) {
              $rootScope.$apply();
            }
          }
          return result;
        };

        // This is the function that will be called when the delay period is complete
        var delayComplete = function() {

          // The timeout has completed so we can clear this
          timeout = null;

          // If the debounce is immediate then the call would have been made already
          if(!immediate) {
            return $q.when(applyFn());
          }
        };
        
        var callNow = immediate && !timeout;
        
        // Reset the timeout
        if ( timeout ) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(delayComplete, delay, false);
 
        if (callNow) {
          return $q.when(applyFn());
        }

        return timeout;
      };
    };
  }];

}
