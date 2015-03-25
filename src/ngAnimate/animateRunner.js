'use strict';

var $$rAFMutexFactory = ['$$rAF', function($$rAF) {
  return function() {
    var passed = false;
    $$rAF(function() {
      passed = true;
    });
    return function(fn) {
      passed ? fn() : $$rAF(fn);
    };
  }
}];

var $AnimateRunnerFactory = ['$q', '$$rAFMutex', function($q, $$rAFMutex) {
  var DONE_PENDING_STATE = 1;
  var DONE_COMPLETE_STATE = 2;

  AnimateRunner.chain = function(chain, callback) {
    var status = true;
    var index = 0;

    next();
    function next() {
      if (index === chain.length) {
        callback(status);
        return;
      }

      chain[index](function(response) {
        status = status && response;
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

    this._doneCallbacks = [];
    this._atleastOneRAFPassedSinceStart = $$rAFMutex();
    this._state = 0;
  };

  AnimateRunner.prototype = {
    setHost: function(host) {
      this.host = host || {};
    },

    done: function(fn) {
      if (this.state === DONE_COMPLETE_STATE) {
        fn();
      } else {
        this._doneCallbacks.push(fn);
      }
    },

    progress: noop,

    getPromise : function() {
      if (!this.promise) {
        var self = this;
        this.promise = $q(function(resolve, reject) {
          self.done(function(status) {
            status === false ? reject() : resolve();
          });
        });
      }
      return this.promise;
    },

    then: function(resolveHandler, rejectHandler) {
      return this.getPromise().then(resolveHandler, rejectHandler);
    },

    pause: function() {
      this.host.pause && this.host.pause();
    },

    resume: function() {
      this.host.resume && this.host.resume();
    },

    end: function() {
      this.host.end && this.host.end();
      this._resolve(true);
    },

    cancel: function() {
      this.host.cancel && this.host.cancel();
      this._resolve(false);
    },

    complete: function(response) {
      var self = this;
      if (self._state === 0) {
        self._state = DONE_PENDING_STATE;
        self._atleastOneRAFPassedSinceStart(function() {
          self._resolve(response);
        });
      }
    },

    _resolve: function(response) {
      if (this._state !== DONE_COMPLETE_STATE) {
        angular.forEach(this._doneCallbacks, function(fn) {
          fn(response);
        });
        this._doneCallbacks.length = 0;
        this._state = DONE_COMPLETE_STATE;
      }
    }
  };

  return AnimateRunner;
}];
