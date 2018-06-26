'use strict';

var $intervalMinErr = minErr('$interval');

/** @this */
function $IntervalProvider() {
  this.$get = ['$$intervalFactory', '$window',
       function($$intervalFactory,   $window) {
    var intervals = {};
    var setIntervalFn = function(tick, delay, deferred) {
      var id = $window.setInterval(tick, delay);
      intervals[id] = deferred;
      return id;
    };
    var clearIntervalFn = function(id) {
      $window.clearInterval(id);
      delete intervals[id];
    };

    /**
     * @ngdoc service
     * @name $interval
     *
     * @description
     * AngularJS's wrapper for `window.setInterval`. The `fn` function is executed every `delay`
     * milliseconds.
     *
     * The return value of registering an interval function is a promise. This promise will be
     * notified upon each tick of the interval, and will be resolved after `count` iterations, or
     * run indefinitely if `count` is not defined. The value of the notification will be the
     * number of iterations that have run.
     * To cancel an interval, call `$interval.cancel(promise)`.
     *
     * In tests you can use {@link ngMock.$interval#flush `$interval.flush(millis)`} to
     * move forward by `millis` milliseconds and trigger any functions scheduled to run in that
     * time.
     *
     * <div class="alert alert-warning">
     * **Note**: Intervals created by this service must be explicitly destroyed when you are finished
     * with them.  In particular they are not automatically destroyed when a controller's scope or a
     * directive's element are destroyed.
     * You should take this into consideration and make sure to always cancel the interval at the
     * appropriate moment.  See the example below for more details on how and when to do this.
     * </div>
     *
     * @param {function()} fn A function that should be called repeatedly. If no additional arguments
     *   are passed (see below), the function is called with the current iteration count.
     * @param {number} delay Number of milliseconds between each function call.
     * @param {number=} [count=0] Number of times to repeat. If not set, or 0, will repeat
     *   indefinitely.
     * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
     *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.
     * @param {...*=} Pass additional parameters to the executed function.
     * @returns {promise} A promise which will be notified on each iteration. It will resolve once all iterations of the interval complete.
     *
     * @example
     * <example module="intervalExample" name="interval-service">
     * <file name="index.html">
     *   <script>
     *     angular.module('intervalExample', [])
     *       .controller('ExampleController', ['$scope', '$interval',
     *         function($scope, $interval) {
     *           $scope.format = 'M/d/yy h:mm:ss a';
     *           $scope.blood_1 = 100;
     *           $scope.blood_2 = 120;
     *
     *           var stop;
     *           $scope.fight = function() {
     *             // Don't start a new fight if we are already fighting
     *             if ( angular.isDefined(stop) ) return;
     *
     *             stop = $interval(function() {
     *               if ($scope.blood_1 > 0 && $scope.blood_2 > 0) {
     *                 $scope.blood_1 = $scope.blood_1 - 3;
     *                 $scope.blood_2 = $scope.blood_2 - 4;
     *               } else {
     *                 $scope.stopFight();
     *               }
     *             }, 100);
     *           };
     *
     *           $scope.stopFight = function() {
     *             if (angular.isDefined(stop)) {
     *               $interval.cancel(stop);
     *               stop = undefined;
     *             }
     *           };
     *
     *           $scope.resetFight = function() {
     *             $scope.blood_1 = 100;
     *             $scope.blood_2 = 120;
     *           };
     *
     *           $scope.$on('$destroy', function() {
     *             // Make sure that the interval is destroyed too
     *             $scope.stopFight();
     *           });
     *         }])
     *       // Register the 'myCurrentTime' directive factory method.
     *       // We inject $interval and dateFilter service since the factory method is DI.
     *       .directive('myCurrentTime', ['$interval', 'dateFilter',
     *         function($interval, dateFilter) {
     *           // return the directive link function. (compile function not needed)
     *           return function(scope, element, attrs) {
     *             var format,  // date format
     *                 stopTime; // so that we can cancel the time updates
     *
     *             // used to update the UI
     *             function updateTime() {
     *               element.text(dateFilter(new Date(), format));
     *             }
     *
     *             // watch the expression, and update the UI on change.
     *             scope.$watch(attrs.myCurrentTime, function(value) {
     *               format = value;
     *               updateTime();
     *             });
     *
     *             stopTime = $interval(updateTime, 1000);
     *
     *             // listen on DOM destroy (removal) event, and cancel the next UI update
     *             // to prevent updating time after the DOM element was removed.
     *             element.on('$destroy', function() {
     *               $interval.cancel(stopTime);
     *             });
     *           }
     *         }]);
     *   </script>
     *
     *   <div>
     *     <div ng-controller="ExampleController">
     *       <label>Date format: <input ng-model="format"></label> <hr/>
     *       Current time is: <span my-current-time="format"></span>
     *       <hr/>
     *       Blood 1 : <font color='red'>{{blood_1}}</font>
     *       Blood 2 : <font color='red'>{{blood_2}}</font>
     *       <button type="button" data-ng-click="fight()">Fight</button>
     *       <button type="button" data-ng-click="stopFight()">StopFight</button>
     *       <button type="button" data-ng-click="resetFight()">resetFight</button>
     *     </div>
     *   </div>
     *
     * </file>
     * </example>
     */
    var interval = $$intervalFactory(setIntervalFn, clearIntervalFn);

    /**
     * @ngdoc method
     * @name $interval#cancel
     *
     * @description
     * Cancels a task associated with the `promise`.
     *
     * @param {Promise=} promise returned by the `$interval` function.
     * @returns {boolean} Returns `true` if the task was successfully canceled.
     */
    interval.cancel = function(promise) {
      if (!promise) return false;

      if (!promise.hasOwnProperty('$$intervalId')) {
        throw $intervalMinErr('badprom',
            '`$interval.cancel()` called with a promise that was not generated by `$interval()`.');
      }

      if (!intervals.hasOwnProperty(promise.$$intervalId)) return false;

      var id = promise.$$intervalId;
      var deferred = intervals[id];

      // Interval cancels should not report an unhandled promise.
      markQExceptionHandled(deferred.promise);
      deferred.reject('canceled');
      clearIntervalFn(id);

      return true;
    };

    return interval;
  }];
}
