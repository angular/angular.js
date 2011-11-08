'use strict';

/**
 * inspired by Kris Kowal's Q (https://github.com/kriskowal/q)
 */

/**
 * Constructs a promise manager.
 *
 * @param {function(function)=} nextTick Function for executing functions in the next turn. Falls
 *    back to `setTimeout` if undefined.
 * @param {function(...*)=} exceptionHandler Function into which unexpected exceptions are passed for
 *     debugging purposes. Falls back to `console.error` if undefined,
 * @returns {object} Promise manager.
 */
function qFactory(nextTick, exceptionHandler) {

  nextTick = nextTick || function(callback) {
    setTimeout(callback, 0); // very rare since most of queueing will be handled within $apply
  };

  exceptionHandler = exceptionHandler || function(e) {
    // TODO(i): console.error is somehow reset to function(a) {}, it might be a JSTD bug
    if (console && console.log) {
      console.log(e);
    }
  }

  var defer = function() {
    var pending = [],
        value, deferred;

    deferred = {

      resolve: function(val) {
        if (pending) {
          var callbacks = pending;
          pending = undefined;
          value = ref(val);

          if (callbacks.length) {
            nextTick(function() {
              var callback;
              for (var i = 0, ii = callbacks.length; i < ii; i++) {
                callback = callbacks[i];
                value.then(callback[0], callback[1]);
              }
            });
          }
        }
      },


      reject: function(reason) {
        deferred.resolve(reject(reason));
      },


      promise: {
        then: function(callback, errback) {
          var result = defer();

          var wrappedCallback = function(value) {
            try {
              result.resolve((callback || defaultCallback)(value));
            } catch(e) {
              exceptionHandler(e);
              result.reject(e);
            }
          };

          var wrappedErrback = function(reason) {
            try {
              result.resolve((errback || defaultErrback)(reason));
            } catch(e) {
              exceptionHandler(e);
              result.reject(e);
            }
          };

          if (pending) {
            pending.push([wrappedCallback, wrappedErrback]);
          } else {
            value.then(wrappedCallback, wrappedErrback);
          }

          return result.promise;
        }
      }
    };

    return deferred;
  };


  var ref = function(value) {
    if (value && value.then) return value;
    return {
      then: function(callback) {
        var result = defer();
        nextTick(function() {
          result.resolve(callback(value));
        });
        return result.promise;
      }
    };
  };


  var reject = function(reason) {
    return {
      then: function(callback, errback) {
        var result = defer();
        nextTick(function() {
          result.resolve(errback(reason));
        });
        return result.promise;
      }
    };
  };


  var when = function(value, callback, errback) {
    var result = defer(),
        done;

    var wrappedCallback = function(value) {
      try {
        return (callback || defaultCallback)(value);
      } catch (e) {
        exceptionHandler(e);
        return reject(e);
      }
    };

    var wrappedErrback = function(reason) {
      try {
        return (errback || defaultErrback)(reason);
      } catch (e) {
        exceptionHandler(e);
        return reject(e);
      }
    };

    nextTick(function() {
      ref(value).then(function(value) {
        if (done) return;
        done = true;
        result.resolve(ref(value).then(wrappedCallback, wrappedErrback));
      }, function(reason) {
        if (done) return;
        done = true;
        result.resolve(wrappedErrback(reason));
      });
    });

    return result.promise;
  };


  function defaultCallback(value) {
    return value;
  }


  function defaultErrback(reason) {
    return reject(reason);
  }


  function all(promises) {
    var deferred = defer(),
        counter = promises.length,
        results = [];

    forEach(promises, function(promise, index) {
      promise.then(function(value) {
        if (index in results) return;
        results[index] = value;
        if (!(--counter)) deferred.resolve(results);
      }, function(reason) {
        if (index in results) return;
        deferred.reject(reason);
      });
    });

    return deferred.promise;
  }

  return {
    defer: defer,
    reject: reject,
    when: when,
    all: all
  };
}

// TODO(i): move elsewhere
function $QProvider() {

  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
    return qFactory(function(callback) {
      $rootScope.$evalAsync(callback);
    }, $exceptionHandler);
  }];
}
