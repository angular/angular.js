'use strict';

var $$AnimateAsyncRunFactoryProvider = /** @this */ function() {
  this.$get = ['$$rAF', function($$rAF) {
    var waitQueue = [];

    function waitForTick(fn) {
      waitQueue.push(fn);
      if (waitQueue.length > 1) return;
      $$rAF(function() {
        for (var i = 0; i < waitQueue.length; i++) {
          waitQueue[i]();
        }
        waitQueue = [];
      });
    }

    return function() {
      var passed = false;
      waitForTick(function() {
        passed = true;
      });
      return function(callback) {
        if (passed) {
          callback();
        } else {
          waitForTick(callback);
        }
      };
    };
  }];
};

var $$AnimateRunnerFactoryProvider = /** @this */ function() {
  this.$get = ['$q', '$sniffer', '$$animateAsyncRun', '$$isDocumentHidden', '$timeout',
       function($q,   $sniffer,   $$animateAsyncRun,   $$isDocumentHidden,   $timeout) {

    var INITIAL_STATE = 0;
    var DONE_PENDING_STATE = 1;
    var DONE_COMPLETE_STATE = 2;

    AnimateRunner.chain = function(chain, callback) {
      var index = 0;

      next();
      function next() {
        if (index === chain.length) {
          callback(true);
          return;
        }

        chain[index](function(response) {
          if (response === false) {
            callback(false);
            return;
          }
          index++;
          next();
        });
      }
    };

    AnimateRunner.all = function(runners, callback) {
      var count = 0;
      var status = true;
      forEach(runners, function(runner) {
        runner.done(onProgress);
      });

      function onProgress(response) {
        status = status && response;
        if (++count === runners.length) {
          callback(status);
        }
      }
    };

    function AnimateRunner(host) {
      this.setHost(host);

      var rafTick = $$animateAsyncRun();
      var timeoutTick = function(fn) {
        $timeout(fn, 0, false);
      };

      this._doneCallbacks = [];
      this._tick = function(fn) {
        if ($$isDocumentHidden()) {
          timeoutTick(fn);
        } else {
          rafTick(fn);
        }
      };
      this._state = 0;
    }

    AnimateRunner.prototype = {
      setHost: function(host) {
        this.host = host || {};
      },

      done: function(fn) {
        if (this._state === DONE_COMPLETE_STATE) {
          fn();
        } else {
          this._doneCallbacks.push(fn);
        }
      },

      progress: noop,

      getPromise: function() {
        if (!this.promise) {
          var self = this;
          this.promise = $q(function(resolve, reject) {
            self.done(function(status) {
              if (status === false) {
                reject();
              } else {
                resolve();
              }
            });
          });
        }
        return this.promise;
      },

      then: function(resolveHandler, rejectHandler) {
        return this.getPromise().then(resolveHandler, rejectHandler);
      },

      'catch': function(handler) {
        return this.getPromise()['catch'](handler);
      },

      'finally': function(handler) {
        return this.getPromise()['finally'](handler);
      },

      pause: function() {
        if (this.host.pause) {
          this.host.pause();
        }
      },

      resume: function() {
        if (this.host.resume) {
          this.host.resume();
        }
      },

      end: function() {
        if (this.host.end) {
          this.host.end();
        }
        this._resolve(true);
      },

      cancel: function() {
        if (this.host.cancel) {
          this.host.cancel();
        }
        this._resolve(false);
      },

      complete: function(response) {
        var self = this;
        if (self._state === INITIAL_STATE) {
          self._state = DONE_PENDING_STATE;
          self._tick(function() {
            self._resolve(response);
          });
        }
      },

      _resolve: function(response) {
        if (this._state !== DONE_COMPLETE_STATE) {
          forEach(this._doneCallbacks, function(fn) {
            fn(response);
          });
          this._doneCallbacks.length = 0;
          this._state = DONE_COMPLETE_STATE;
        }
      }
    };

    return AnimateRunner;
  }];
};
