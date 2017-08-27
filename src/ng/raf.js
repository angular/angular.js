'use strict';

/** @this */
function $$RAFProvider() { //rAF
  this.$get = ['$window', '$timeout', function($window, $timeout) {
    var requestAnimationFrame = $window.requestAnimationFrame ||
                                $window.webkitRequestAnimationFrame;

    var cancelAnimationFrame = $window.cancelAnimationFrame ||
                               $window.webkitCancelAnimationFrame ||
                               $window.webkitCancelRequestAnimationFrame;

    var rafSupported = !!requestAnimationFrame;
    var raf = rafSupported
      ? function(fn) {
          var id = requestAnimationFrame(fn);
          return function() {
            cancelAnimationFrame(id);
          };
        }
      : function(fn) {
          var timer = $timeout(fn, 16.66, false); // 1000 / 60 = 16.666
          return function() {
            $timeout.cancel(timer);
          };
        };

    raf.supported = rafSupported;

    return raf;
  }];
}
