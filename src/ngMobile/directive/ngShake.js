'use strict';

ngMobile.directive('ngShake', [
    '$parse', '$motion',
    function ($parse, $motion) {
        var INTENSE = 10; // Intense
        var TIMEOUT = 1000; // Timeout in ms

        function difference(num1, num2) {
            return (num1 > num2) ? num1 - num2 : num2 - num1;
        }

        return function (scope, element, attr) {
            var callback = $parse(attr.ngShake);
            var last = {};
            var lastTrigger = 0;

            var checkForShakeFunction = function (motionEvent) {
                var acceleration = motionEvent.accelerationIncludingGravity;

                angular.forEach(['x', 'y', 'z'], function (axis) {
                    var current = acceleration[axis];
                    if (!angular.isUndefined(last)) {
                        if (difference(last[axis], current) > INTENSE) {
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