'use strict';


function $DebounceProvider() {
  this.$get = ['$timeout', '$q', '$exceptionHandler', function($timeout, $q, $exceptionHandler) {

   /**
    * @ngdoc service
    * @name $debounce
    *
    * @description
    * The $debounce service provides a mechanism for creating a wrapper around a function that
    * ensures that the function is not called more frequently than a given time interval.
    *
    * The result of calling `$debounce()` is a new debounced function, which you can call in the
    * same way as the original `func`.  All parameters in the call are forwarded on to the original
    * function.
    *
    * @param {!function(...)} func       The function to be debounced
    * @param {number} delay              The minimum time between calls to `func`
    * @param {boolean} [immediate=false] If true then `func` is invoked on the first call to
    *                                    the debounced function. Otherwise the first call will not
    *                                    happen until after the `delay` time has expired
    * @return {function(...) : Promise}  A debounced wrapper function around the `func` function.
    *                                    This function will return a promise to the return value of
    *                                    `func`, when it is eventually called.
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
    return function(func, delay, immediate) {
      var timeout;
      var deferred = $q.defer();

      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if(!immediate) {
            try {
              deferred.resolve(func.apply(context, args));
            } catch(e) {
              $exceptionHandler(e);
              deferred.reject(e);
            }
            deferred = $q.defer();
          }
        };
        var callNow = immediate && !timeout;
        if ( timeout ) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(later, delay);
        if (callNow) {
          deferred.resolve(func.apply(context,args));
          deferred = $q.defer();
        }
        return deferred.promise;
      };
    };
  }];

}
