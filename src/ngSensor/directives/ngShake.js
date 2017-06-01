'use strict';

/**
 * @ngdoc directive
 * @name ngSensor.directive:ngShake
 *
 * @description
 * The `ngShake` directive allows you to specify custom behavior on shake event.
 * A shake event is triggered when the difference of two tracked DeviceMotionEvents
 * is greater than a configurable intense.
 * After a shake event is tracked no other shake event is triggered in a configurable timeout.
 *
 * @element ANY
 * @param {expression} ngShake {@link guide/expression Expression} to evaluate upon
 * shake. (DeviceMotionEvent object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

ngSensor.directive('ngShake', [
    '$parse', '$motion',
    function ($parse, $motion) {
        var INTENSE = 10; // Intense
        var TIMEOUT = 500; // Timeout in ms

        return function (scope, element, attr) {
            var callback = $parse(attr.ngShake);
            var last = {};
            var lastTrigger = 0;

            var checkForShakeFunction = function (motionEvent) {
                var acceleration = motionEvent.accelerationIncludingGravity;

                angular.forEach(['x', 'y', 'z'], function (axis) {
                    var current = acceleration[axis];
                    if (!angular.isUndefined(last)) {
                        if (Math.abs(last[axis] - current) > INTENSE) {
                            var currentTimestamp = new Date().getTime();
                            if (lastTrigger + TIMEOUT < currentTimestamp) {
                                scope.$apply(function () {
                                    callback(scope, {$event: motionEvent});
                                });
                                lastTrigger = currentTimestamp;
                            }
                        }
                        last[axis] = current;
                    }
                });
            };
            $motion.register(checkForShakeFunction);

            // unregister on scope destroy
            scope.$on("$destroy", function () {
                $motion.unregister(checkForShakeFunction);
            });

        };
    }]);