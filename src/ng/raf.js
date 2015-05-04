'use strict';

function $$RAFProvider() { //rAF
  this.$get = ['$window', '$timeout', function($window, $timeout) {
    var requestAnimationFrame = $window.requestAnimationFrame ||
                                $window.webkitRequestAnimationFrame;

    var cancelAnimationFrame = $window.cancelAnimationFrame ||
                               $window.webkitCancelAnimationFrame ||
                               $window.webkitCancelRequestAnimationFrame;

    var rafSupported = !!requestAnimationFrame;
    var rafFn = rafSupported
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

    queueFn.supported = rafSupported;

    var cancelLastRAF;
    var taskCount = 0;
    var taskQueue = [];
    return queueFn;

    function flush() {
      for (var i = 0; i < taskQueue.length; i++) {
        var task = taskQueue[i];
        if (task) {
          taskQueue[i] = null;
          task();
        }
      }
      taskCount = taskQueue.length = 0;
    }

    function queueFn(asyncFn) {
      var index = taskQueue.length;

      taskCount++;
      taskQueue.push(asyncFn);

      if (index === 0) {
        cancelLastRAF = rafFn(flush);
      }

      return function cancelQueueFn() {
        if (index >= 0) {
          taskQueue[index] = null;
          index = null;

          if (--taskCount === 0 && cancelLastRAF) {
            cancelLastRAF();
            cancelLastRAF = null;
            taskQueue.length = 0;
          }
        }
      };
    }
  }];
}
