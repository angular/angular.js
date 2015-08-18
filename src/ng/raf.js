'use strict';

function $$RAFProvider() { //rAF

  var provider = this;
  provider.$$bufferLimit = 10;

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

    function RAFTaskQueue(fn) {
      this.queue = [];
      this.count = 0;
      this.afterFlushFn = fn;
    }

    RAFTaskQueue.prototype = {
      push: function(fn) {
        var self = this;

        self.queue.push(fn);
        self.count++;

        self.rafWait(function() {
          self.flush();
        });
      },
      remove: function(index) {
        if (this.queue[index] !== noop) {
          this.queue[index] = noop;
          if (--this.count === 0) {
            this.reset();
            this.flush();
          }
        }
      },
      reset:function() {
        (this.cancelRaf || noop)();
        this.count = this.queue.length = 0;
      },
      rafWait: function(fn) {
        var self = this;
        if (!self.cancelRaf) {
          self.cancelRaf = rafFn(function() {
            self.cancelRaf = null;
            fn();
          });
        }
      },
      flush: function() {
        for (var i = 0; i < this.queue.length; i++) {
          this.queue[i]();
        }
        this.count = this.queue.length = 0;
        this.afterFlushFn(this);
      }
    };

    var tasks = [];
    return queueFn;

    function queueFn(fn) {
      var lastTask = tasks.length && tasks[tasks.length - 1];
      if (!lastTask || lastTask.count === provider.$$bufferLimit) {
        lastTask = tasks[tasks.length] = new RAFTaskQueue(function(self) {
          var taskIndex = tasks.indexOf(self);
          if (taskIndex >= 0) {
            tasks.splice(taskIndex, 1);
          }
        });
      }
      lastTask.push(fn);
      var index = lastTask.count - 1;
      return function cancelQueueFn() {
        if (index >= 0) {
          lastTask.remove(index);
          index = null;
        }
      };
    }
  }];
}
