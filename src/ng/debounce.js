'use strict';


function $DebounceProvider() {
  this.$get = ['$timeout', '$q', '$rootScope', function($timeout, $q, $rootScope, invokeApply) {

   /**
    * @ngdoc service
    * @name $debounce
    *
    * @description
    * The $debounce service provides a mechanism for creating a **debounced** function from a
    * **wrapped** function, which ensures that the **wrapped** function is not called until a given
    * time period (**delay**) has expired since the last time the **debounced** function was called.
    *
    * The result of calling `$debounce()` is a new **debounced** function, which you can call in the
    * same way as the original **wrapped** function.  All parameters in the call to the
    * **debounced** function are forwarded on to the original **wrapped** function.
    *
    *
    * @param {!Function} fn              The function to be debounced
    * @param {number} delay              The minimum time between calls to `fn`
    * @param {boolean} [immediate=false] If true then `fn` is invoked on the first call to
    *                                    the debounced function. Otherwise the first call will not
    *                                    happen until after the `delay` time has expired
    * @return {Function}                 A debounced wrapper function around the `fn` function.
    *
    *
    * @example
    * <example name="debounce" module="debounce-example">
    * <file name="index.html">
    *   <div ng-controller="DebounceController">
    *     <p>
    *       Each time you click the "increment" button, the counter will increase. In contrast, if
    *       you click the "debounced increment" button, the counter will only increase 500ms after
    *       you stop clicking.
    *     </p>
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
    *     $scope.debouncedIncrement = $debounce($scope.increment, 500);
    *   });
    * </file>
    * </example>
    */
    return function $debounce(func, delay, immediate) {
      var callCount = 0;

      return function debouncedFn() {
        var context = this, args = arguments;

        // This is the function that will be called when the delay period is complete
        var delayComplete = function() {

          callCount -= 1;

          // If the debounce is immediate then the call would have been made already
          if(!immediate && callCount === 0) {
            func.apply(context,args);
          }
        };

        // Reset the timeout
        $timeout(delayComplete, delay);

        if (immediate && callCount === 0) {
          func.apply(context,args);
        }

        callCount += 1;
      };
    };
  }];

}
