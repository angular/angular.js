'use strict';
/*jshint newcap: false */
/* Layout for Promise$$bitField:
 * QQWF NCTR BPHS UDLL LLLL LLLL LLLL LLLL
 *
 * Q = isGcQueued (unused)
 * W = isFollowing (The promise that is being followed is not stored explicitly)
 * F = isFulfilled
 * N = isRejected
 * C = isCancellable (unused)
 * T = isFinal
 * B = isBound (unused)
 * P = isProxied (Optimization when .then listeners on a promise are just respective fate sealers
 *     on some other promise)
 * H = isRejectionUnhandled
 * S = isCarryingStackTrace
 * U = isUnhandledRejectionNotified
 * D = isDisposable
 * R = [Reserved]
 * L = Length (18 bit unsigned)
 */

/*jshint bitwise: false */
var NO_STATE                        = 0x00000000|0;
var IS_GC_QUEUED                    = 0xC0000000|0;
var IS_FOLLOWING                    = 0x20000000|0;
var IS_FULFILLED                    = 0x10000000|0;
var IS_REJECTED                     = 0x08000000|0;
//  IS_CANCELLABLE                  = 0x04000000|0; Cancelling not supported
var IS_FINAL                        = 0x02000000|0;
//  RESERVED BIT                      0x01000000|0
var IS_BOUND                        = 0x00800000|0;
var IS_PROXIED                      = 0x00400000|0;
var IS_REJECTION_UNHANDLED          = 0x00200000|0;
var IS_CARRYING_STACK_TRACE         = 0x00100000|0;
var IS_UNHANDLED_REJECTION_NOTIFIED = 0x00080000|0;
var IS_DISPOSABLE                   = 0x00040000|0;
var LENGTH_MASK                     = 0x0003FFFF|0;
var IS_REJECTED_OR_FULFILLED = IS_REJECTED | IS_FULFILLED;
var IS_FOLLOWING_OR_REJECTED_OR_FULFILLED = IS_REJECTED_OR_FULFILLED | IS_FOLLOWING;
var MAX_LENGTH = LENGTH_MASK;

var CALLBACK_FULFILL_OFFSET = 0;
var CALLBACK_REJECT_OFFSET = 1;
var CALLBACK_PROGRESS_OFFSET = 2;
var CALLBACK_PROMISE_OFFSET = 3;
var CALLBACK_RECEIVER_OFFSET = 4;
var CALLBACK_SIZE = 5;

var unhandledRejectionHandled;

function internalPromiseResolver() {}

function thrower(e) {
  throw e;
}

function isError(obj) {
  return obj instanceof Error;
}

var $Deferred = function Deferred(Q) {
  defineProperties(this, INVISIBLE|WRITABLE, {
    promise: new Q(internalPromiseResolver)
  });
};

defineProperties($Deferred.prototype, WRITABLE, {
  resolve: function Deferred$resolve(value) {
    var promise = this.promise;
    if (promise.isResolved() || promise.$$tryFollow(value)) {
      return;
    }

    promise.$$invoke(promise.$$fulfill, promise, value);
  },


  reject: function Deferred$reject(reason) {
    var promise = this.promise;
    if (promise.isResolved()) return;
    var trace = isError(reason) ? reason : new Error(reason + '');
    promise.$$attachExtraTrace(trace);
    promise.$$invoke(promise.$$reject, promise, reason);
  },


  rejectGently: function Deferred$rejectGently(reason) {
    var promise = this.promise;
    if (promise.isResolved()) return;
    var trace = isError(reason) ? reason : new Error(reason + '');
    promise.$$attachExtraTrace(trace);
    promise.$$invoke(promise.$$rejectGently, promise, reason);
  },


  notify: function Deferred$notify(value) {
    this.promise.$$progress(value);
  },


  isResolved: function Deferred$isResolved() {
    return this.promise.isResolved();
  },


  isFulfilled: function Deferred$isFulfilled() {
    return this.promise.isFulfilled();
  },


  isRejected: function Deferred$isRejected() {
    return this.promise.isRejected();
  },


  isPending: function Deferred$isPending() {
    return this.promise.isPending();
  }
});


function $Q(resolver, nextTick) {
  if (!isFunction(resolver)) {
    // todo(@caitp): minErr this.
    throw new TypeError('Cannot instantion $Q Promise: `resolver` must be a function.');
  }

  // Private properties
  defineProperties(this, INVISIBLE|WRITABLE, {
    $$bitField: NO_STATE,

    // From Bluebird: Typical promise has exactly one parallel handler,
    // store the first ones directly on the Promise.
    $$fulfillmentHandler0: void 0,
    $$rejectionHandler0: void 0,

    // store nextTick in the prototype, so that types which use $rootScope.$evalAsync and types
    // which use $browser.defer() are both instances of the same Promise type.
    $$nextTick: nextTick,

    $$promise0: void 0,
    $$receiver0: void 0,
    $$settledValue: void 0
  });

  if (resolver !== internalPromiseResolver) this.$$resolveFromResolver(resolver);
}


function Promise$$cast(obj, originalPromise, Q) {
  if (obj && typeof obj === 'object') {
    if (obj instanceof Q) {
      return obj;
    } else {
      var then;
      try {
        then = obj.then;
      } catch (e) {
        if (originalPromise !== void 0 && isError(e)) {
          originalPromise.$$attachExtraTrace(e);
        }
        return Q.reject(e);
      }
      if (typeof then === 'function') {
        return Promise$$doThenable(obj, then, originalPromise, Q);
      }
    }
  }
  return obj;
}


function Promise$$castToPromise(obj, originalPromise, Q) {
  obj = Promise$$cast(obj, originalPromise, Q);
  if (!(obj instanceof Q)) {
    return {
      then: function Promise$$castToPromiseThen(callback) {
        return Q.resolved(callback(obj));
      }
    };
  }
  return obj;
}


function Promise$$doThenable(x, then, originalPromise, Q) {
  var resolver = Q.defer();
  var called = false;
  try {
    then.call(x, Promise$_resolveFromThenable, Promise$_rejectFromThenable,
      Promise$_progressFromThenable);
  } catch (e) {
    if (!called) {
      called = true;
      var trace = isError(e) ? e : new Error(e + '');
      if (originalPromise !== void 0) {
        originalPromise.$$attachExtraTrace(trace);
      }
      resolver.promise.$$reject(e, trace);
    }
  }
  return resolver.promise;

  function Promise$_resolveFromThenable(y) {
    if (called) return;
    called = true;

    if (x === y) {
      var e = new Error('self-resolution error');
      if (originalPromise !== void 0) {
        originalPromise.$$attachExtraTrace(e);
      }
      resolver.promise.$$reject(e, void 0);
    }
    resolver.resolve(y);
  }

  function Promise$_rejectFromThenable(r) {
    if (called) return;
    called = true;

    var trace = isError(r) ? r : new Error(r + '');
    if (originalPromise !== void 0) {
      originalPromise.$$attachExtraTrace(r);
    }
    resolver.promise.$$reject(r, trace);
  }

  function Promise$_progressFromThenable(v) {
    if (called) return;
    var promise = resolver.promise;
    if (isFunction(promise.$$progress)) {
      promise.$$progress(v);
    }
  }
}


function Promise$makePromise(value, resolved, Q) {
  var result = new Q(internalPromiseResolver);
  if (resolved) {
    result.$$fulfillUnchecked(value);
  } else {
    result.$$rejectUnchecked(value);
  }
  return result;
}


function Promise$handleFinalCallback(callback, value, isResolved, Q) {
  var callbackOutput = null;
  try {
    callbackOutput = (callback || noop)();
  } catch (e) {
    return Promise$makePromise(e, false, Q);
  }
  if (callbackOutput && isFunction(callbackOutput.then)) {
    return callbackOutput.then(function() {
      return Promise$makePromise(value, isResolved, Q);
    }, function(error) {
      return Promise$makePromise(error, false, Q);
    });
  } else {
    return Promise$makePromise(value, isResolved, Q);
  }
}


defineProperties($Q.prototype, INVISIBLE|WRITABLE, {
  then: function Promise$then(didFulfill, didReject, didProgress) {
    var ret = new $Q(internalPromiseResolver, this.$$nextTick);
    var callbackIndex = this.$$addCallbacks(didFulfill, didReject, didProgress, ret, void 0);
    if (this.isResolved()) {
      this.$$invoke(this.$$queueSettleAt, this, callbackIndex);
    }

    return ret;
  },


  catch: function Promise$catch(handler) {
    var ret = new $Q(internalPromiseResolver, this.$$nextTick);
    var callbackIndex = this.$$addCallbacks(null, handler, null, ret, void 0);
    if (this.isResolved()) {
      this.$$invoke(this.$$queueSettleAt, this, callbackIndex);
    }
    return ret;
  },


  'finally': function Promise$finally(handler) {
    var Q = this.constructor;

    return this.then(function(value) {
      return Promise$handleFinalCallback(handler, value, true, Q);
    }, function(error) {
      return Promise$handleFinalCallback(handler, error, false, Q);      
    });
  },


  isResolved: function() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_REJECTED_OR_FULFILLED) > 0;
  },


  isFulfilled: function() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_FULFILLED) > 0;
  },


  isRejected: function() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_REJECTED) > 0;
  },


  isPending: function() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_REJECTED_OR_FULFILLED) === 0;
  },


  toString: function Promise$$toString() {
    return '[object Promise]';
  },


  $$addCallbacks: function(fulfill, reject, progress, promise, receiver) {
    var index = this.$$length();

    if (index >= MAX_LENGTH - CALLBACK_SIZE) {
      index = 0;
      this.$$setLength(0);
    }

    if (index === 0) {
      this.$$promise0 = promise;
      if (receiver !== void 0) {
        this.$$receiver0 = receiver;
      }
      if (isFunction(fulfill) && !this.$$isCarryingStackTrace()) {
        this.$$fulfillmentHandler0 = fulfill;
      }
      if (isFunction(reject)) {
        this.$$rejectionHandler0 = reject;
      }
      if (isFunction(progress)) {
        this.$$progressHandler0 = progress;
      }
    } else {
      var base = (index << 2) + index - CALLBACK_SIZE;
      this[base + CALLBACK_PROMISE_OFFSET] = promise;
      this[base + CALLBACK_RECEIVER_OFFSET] = receiver;
      this[base + CALLBACK_FULFILL_OFFSET] = isFunction(fulfill) ? fulfill : void 0;
      this[base + CALLBACK_REJECT_OFFSET] = isFunction(reject) ? reject : void 0;
      this[base + CALLBACK_PROGRESS_OFFSET] = isFunction(progress) ? progress : void 0;
    }

    this.$$setLength(index + 1);
    return index;
  },


  $$fulfill: function Promise$$fulfill(value) {
    if (this.$$isFollowingOrFulfilledOrRejected()) return;
    this.$$fulfillUnchecked(value);
  },


  $$fulfillUnchecked: function Promise$$fulfillUnchecked(value) {
    if (!this.isPending()) return;
    if (value === this) {
      var err = new Error('Self-resolution forbidden');
      this.$$attachExtraTrace(err);
      return this.$$rejectUnchecked(err);
    }

    this.$$setFulfilled();
    this.$$settledValue = value;

    var len = this.$$length();
    if (len > 0) {
      this.$$invoke(this.$$settlePromises, this, len);
    }
  },


  $$setTrace: function(trace) {
    // TODO: improve error logging
  },


  $$attachExtraTrace: function Promise$$attachExtraTrace(trace) {
    // TODO: improve error logging
  },


  $$isCarryingStackTrace: function Promise$$isCarryingStackTrace() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_CARRYING_STACK_TRACE) > 0;
  },


  $$getCarriedStackTrace: function Promise$$getCarriedStackTrace() {
    return this.$$isCarryingStackTrace() ?
           this.$$fulfillmentHandler0 :
           void 0;
  },


  $$setCarriedStackTrace: function Promise$$setCarriedStackTrace(capturedTrace) {
    // ASSERT(this.isRejected())
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField | IS_CARRYING_STACK_TRACE);
    this.$$fulfillmentHandler0 = capturedTrace;
  },


  $$unsetCarriedStackTrace: function Promise$$unsetCarriedStackTrace() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField & (~IS_CARRYING_STACK_TRACE));
    this.$$fulfillmentHandler0 = void 0;
  },


  $$proxyPromise: function Promise$$proxyPromise(promise, slot) {
    if (arguments.length === 1) slot = -1;
    promise.$$setProxied();
    this.$$setProxyHandlers(promise, slot);
  },


  $$follow: function Promise$$follow(promise) {
    this.$$setFollowing();

    if (promise.isPending()) {
      promise.$$proxyPromise(this);
    } else if (promise.isFulfilled()) {
      this.$$fulfillUnchecked(promise.$$settledValue);
    } else {
      this.$$rejectUnchecked(promise.$$settledValue, promise.$$getCarriedStackTrace());
    }

    if (promise.$$isRejectionUnhandled()) promise.$$unsetRejectionIsUnhandled();
  },


  $$followResolve: function Promise$$followResolve(promise) {
    this.$$setFollowing();

    if (promise.isPending()) {
      promise.proxyPromise(this, 0);
    } else {
      this.$$fulfillUnchecked(promise.$$settledValue);
    }

    if (promise.$$isRejectionUnhandled()) promise.$$unsetRejectionIsUnhandled();
  },


  $$isFollowingOrFulfilledOrRejected: function Promise$$isFollowingOrFulfilledOrRejected() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_FOLLOWING_OR_REJECTED_OR_FULFILLED) > 0;
  },


  $$isFollowing: function() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_FOLLOWING) === IS_FOLLOWING;
  },


  $$resolveFromResolver: function Promise$$resolveFromResolver(resolver) {
    var promise = this;
    this.$$setTrace(void 0);

    function Promise$$resolver(val) {
      if (promise.$$tryFollow(val)) {
        return;
      }
      promise.$$fulfill(val);
    }

    function Promise$$rejecter(val) {
      var trace = isError(val) ? val : new Error(val + '');
      promise.$$attachExtraTrace(trace);
      promise.$$reject(val, trace === val ? void 0 : trace);
    }

    try {
      resolver.call(null, Promise$$resolver, Promise$$rejecter);
    } catch (e) {
      this.$$reject(e, isError(e) ? e : new Error(e + ''));
    }
  },


  $$progress: function Promise$$progress(progressValue) {
    if (this.$$isFollowingOrFulfilledOrRejected() || !this.$$length()) return;
    this.$$invoke(this.$$progressUnchecked, this, progressValue);
  },


  $$progressUnchecked: function Promise$$progressUnchecked(progressValue) {
    if (!this.isPending()) return;
    var len = this.$$length();
    var progress = this.$$progress;
    for (var i=0; i<len; ++i) {
      var handler = this.$$progressHandlerAt(i);
      var promise = this.$$promiseAt(i);
      var receiver = this.$$receiverAt(i);
      var ret;

      if (isFunction(handler)) {
        try {
          ret = handler.call(receiver, progressValue);
          if (promise instanceof $Q) {
            promise.$$progress(ret);
          }
        } catch (e) {
          // TODO(@caitp): improve error logging
          if (this.$$unhandledException) {
            
          }
        }
      } else if (receiver instanceof $Q && receiver.$$isProxied()) {
        receiver.$$progressUnchecked(progressValue);
      }
    }
  },


  $$reject: function Promise$$reject(reason, carriedStackTrace) {
    if (this.$$isFollowingOrFulfilledOrRejected()) return;
    this.$$rejectUnchecked(reason, carriedStackTrace);
  },


  $$rejectGently: function Promise$$rejectGently(reason, carriedStackTrace) {
    if (this.$$isFollowingOrFulfilledOrRejected()) return;
    this.$$rejectUnchecked(reason, carriedStackTrace, true);
  },


  $$rejectUnchecked: function Promise$$rejectUnchecked(reason, trace, gentle) {
    var promise = this;
    if (!promise.isPending()) return;
    if (reason === this) {
      var err = new Error('Self-resolution forbidden');
      this.$$attachExtraTrace(err);
      return this.$$rejectUnchecked(err);
    }

    this.$$setRejected();
    this.$$settledValue = reason;

    if (this.$$isFinal()) {
      this.$$invoke(thrower, void 0, trace === void 0 ? reason : trace);
      return;
    }

    var len = this.$$length();

    if (trace !== void 0) this.$$setCarriedStackTrace(trace);

    if (len > 0) {
      this.$$invoke(this.$$rejectPromises, this, void 0);
    } else if (!gentle) {
      this.$$ensurePossibleRejectionHandled();
    }
  },


  $$rejectPromises: function Promise$$rejectPromise() {
    this.$$settlePromises();
    this.$$unsetCarriedStackTrace();
  },


  $$settlePromises: function Promise$$settlePromises() {
    var len = this.$$length();
    for (var i=0; i<len; ++i) {
      this.$$settlePromiseAt(i);
    }
  },


  $$fulfillmentHandlerAt: function Promise$$fulfillmentHandlerAt(index) {
    return index === 0 ?
           this.$$fulfillmentHandler0 :
           this[(index << 2) + index - CALLBACK_SIZE + CALLBACK_FULFILL_OFFSET];
  },


  $$rejectionHandlerAt: function Promise$$rejectionHandlerAt(index) {
    return index === 0 ?
           this.$$rejectionHandler0 :
           this[(index << 2) + index - CALLBACK_SIZE + CALLBACK_REJECT_OFFSET];
  },


  $$progressHandlerAt: function Promise$$progressHandlerAt(index) {
    return index === 0 ?
           this.$$progressHandler0 :
           this[(index << 2) + index - CALLBACK_SIZE + CALLBACK_PROGRESS_OFFSET];
  },


  $$promiseAt: function Promise$$promiseAt(index) {
    return index === 0 ?
           this.$$promise0 :
           this[(index << 2) + index - CALLBACK_SIZE + CALLBACK_PROMISE_OFFSET];
  },


  $$receiverAt: function Promise$$receiverAt(index) {
    return index === 0 ?
           this.$$receiver0 :
           this[(index << 2) + index - CALLBACK_SIZE + CALLBACK_RECEIVER_OFFSET];
  },


  $$settlePromiseFromHandler: function Promise$$settlePromiseFromHandler(
      handler, receiver, value, promise) {
    if (!(promise instanceof $Q)) {
      // if promise is not instanceof Promise, it is internally smuggled data
      handler.call(receiver, value, promise);
      return;
    }

    if (promise.$$isFollowing()) return;
    var error = void 0;
    var x;
    var thrown = false;
    var trace;

    try {
      x = handler.call(receiver, value);
    } catch (e) {
      error = e;
      thrown = true;
    }

    if (thrown || x === promise) {
      error = x === promise ?
              new Error('self-resolution error') :
              error;

      trace = isError(error) ? error : new Error(error + '');
      promise.$$attachExtraTrace(trace);
      promise.$$rejectUnchecked(error, trace);
      this.$$exceptionHandler(error);
    } else {
      var castValue = Promise$$cast(x, promise, this.constructor);
      if (castValue instanceof $Q) {
        if (castValue.isRejected() && !castValue.$$isCarryingStackTrace() &&
            !isError(castValue.$$settledValue)) {
          trace = new Error(castValue.$$settledValue + '');
          promise.$$attachExtraTrace(trace);
          castValue.$$setCarriedStackTrace(trace);
        }
        promise.$$follow(castValue);
      } else {
        promise.$$fulfillUnchecked(x);
      }
    }
  },


  $$settlePromiseAt: function Promise$$settlePromiseAt(index) {
    var isFulfilled = this.isFulfilled();
    var handler = isFulfilled ?
                  this.$$fulfillmentHandlerAt(index) :
                  this.$$rejectionHandlerAt(index);
    var value = this.$$settledValue;
    var receiver = this.$$receiverAt(index);
    var promise = this.$$promiseAt(index);

    if (isFunction(handler)) {
      this.$$settlePromiseFromHandler(handler, receiver, value, promise);
    } else {
      var done = false;
      // optimization when .then listeners on a promise are just respective
      // fate sealers on some other promise
      if (receiver !== void 0) {
        if (receiver instanceof $Q && receiver.$$isProxied()) {
          // Must smuggle data if proxied
          receiver.$$unsetProxied();

          if (isFulfilled) receiver.$$fulfillUnchecked(value);
          else receiver.$$rejectUnchecked(value, this.$$getCarriedStackTrace());
          done = true;
        }
      }

      if (!done) {
        if (isFulfilled) promise.$$fulfill(value);
        else promise.$$reject(value, this.$$getCarriedStackTrace());
      }
    }

    // This is only necessary against index inflation with long-lived promises that accumulate the
    // index size over time, not because the data wouldn't be GC'd otherwise
    // if (index >= 256) {
    //   this.$$queueGC();
    // }
  },


  $$isProxied: function Promise$$isProxied() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_PROXIED) === IS_PROXIED;
  },


  $$length: function Promise$$length() {
    /*jshint bitwise: false */
    return this.$$bitField & LENGTH_MASK;
  },


  $$setLength: function Promise$$setLength(length) {
    /*jshint bitwise: false */
    this.$$bitField = ((this.$$bitField & (~LENGTH_MASK)) | (length & LENGTH_MASK));
  },


  $$setRejected: function Promise$$setRejected() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField | IS_REJECTED);
  },


  $$setFulfilled: function Promise$$setFulfilled() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField | IS_FULFILLED);
  },


  $$unsetFollowing: function Promise$$unsetFollowing() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField & (~IS_FOLLOWING));
  },


  $$setFollowing: function Promise$$setFollowing() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField | IS_FOLLOWING);
  },


  $$setFinal: function Promise$$setFinal() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField | IS_FINAL);
  },


  $$isFinal: function Promise$$isFinal() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_FINAL) > 0;
  },


  $$setRejectionIsUnhandled: function Promise$$setRejectionIsUnhandled() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField | IS_REJECTION_UNHANDLED);
  },


  $$unsetRejectionIsUnhandled: function Promise$$unsetRejectionIsUnhandled() {
    /*jshint bitwise: false */
    this.$$bitField = (this.$$bitField & ~IS_REJECTION_UNHANDLED);
  },


  $$isRejectionUnhandled: function Promise$$isRejectionUnhandled() {
    /*jshint bitwise: false */
    return (this.$$bitField & IS_REJECTION_UNHANDLED) > 0;
  },


  $$setProxyHandlers: function Promise$$setProxyHandlers(receiver, promiseSlotValue) {
    var index = this.$$length();

    if (index >= MAX_LENGTH - CALLBACK_SIZE) {
      index = 0;
      this.$$setLength(0);
    }
    if (index === 0) {
      this.$$promise0 = promiseSlotValue;
      this.$$receiver0 = receiver;
    } else {
      var base = (index << 2) + index - CALLBACK_SIZE;
      this[base + CALLBACK_PROMISE_OFFSET] = promiseSlotValue;
      this[base + CALLBACK_RECEIVER_OFFSET] = receiver;
      this[base + CALLBACK_FULFILL_OFFSET] =
      this[base + CALLBACK_REJECT_OFFSET] =
      this[base + CALLBACK_PROGRESS_OFFSET] = void 0;
    }
    this.$$setLength(index + 1);
  },


  $$setProxied: function Promise$$setProxied() {
    this.$$bitField = (this.$$bitField | IS_PROXIED);
  },


  $$unsetProxied: function Promise$$unsetProxied() {
    this.$$bitField = (this.$$bitField & (~IS_PROXIED));
  },


  $$tryFollow: function Promise$$tryFollow(value) {
    if (this.$$isFollowingOrFulfilledOrRejected() || value === this) {
      return false;
    }

    var maybePromise = Promise$$cast(value, void 0, this.constructor);
    if (!(maybePromise instanceof $Q)) {
      return false;
    }

    this.$$follow(maybePromise);
    return true;
  },


  $$invoke: function Promise$$invokeAsync(method, receiver, arg0) {
    this.$$nextTick(function() {
      method.call(receiver, arg0);
    });
  },


  $$queueSettleAt: function Promise$$queueSettleAt(index) {
    if (this.$$isRejectionUnhandled()) this.$$unsetRejectionIsUnhandled();
    this.$$invoke(this.$$settlePromiseAt, this, index);
  },


  $$possiblyUnhandledRejection: function() {},

  // TODO(@caitp): This is just a proxy for $exceptionHandler, but this should all be handled
  // in $$possiblyUnhandledRejection instead...
  $$exceptionHandler: function(e) {},

  $$ensurePossibleRejectionHandled: function Promise$$ensurePossibleRejectionHandled() {
    this.$$setRejectionIsUnhandled();
    // TODO(@caitp): improve error logging in $q
    // if (this.$$possiblyUnhandledRejection !== void 0) {
    //   this.$$invoke(this.$$notifyUnhandledRejection, this, void 0);
    // }
  },


  $$notifyUnhandledRejectionIsHandled: function Promise$$notifyUnhandledRejectionIsHandled() {
    // TODO(@caitp): improve error logging in $q
    // if (isFunction(this.$$unhandledRejectionHandled)) {
    //   this.$$invoke(this.$$unhandledRejectionHandled, this, void 0);
    // }
  },


  $$notifyUnhandledRejection: function Promise$$notifyUnhandledRejection() {
    // TODO(@caitp): improve error logging in $q
    // if (this.$$isRejectionUnhandled()) {
    //   var reason = this.$$settledValue;
    //   var trace = this.$$getCarriedStackTrace();
    //
    //   this.$$setUnhandledRejectionIsNotified();
    //
    //   if (trace !== void 0) {
    //     this.$$unsetCarriedStackTrace();
    //     reason = trace;
    //   }
    //
    //   if (isFunction(this.$$possiblyUnhandledRejection)) {
    //     this.$$possiblyUnhandledRejection(reason, this);
    //   }
    // }
  },


  $$setUnhandledRejectionIsNotified: function Promise$$setUnhandledRejectionIsNotified() {
    this.$$bitField = this.$$bitField | IS_UNHANDLED_REJECTION_NOTIFIED;
  },


  $$unsetUnhandledRejectionIsNotified: function Promise$$unsetUnhandledRejectionIsNotified() {
    this.$$bitField = this.$$bitField & (~IS_UNHANDLED_REJECTION_NOTIFIED);
  },


  $$isUnhandledRejectionNotified: function Promise$$isUnhandledRejectionNotified() {
    return (this.$$bitField & IS_UNHANDLED_REJECTION_NOTIFIED) > 0;
  }
});

/**
 * @ngdoc service
 * @name $q
 * @requires $rootScope
 *
 * @description
 * A promise/deferred implementation inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).
 *
 * $q can be used in two fashions --- One, which is more similar to Kris Kowal's Q or jQuery's Deferred
 * implementations, the other resembles ES6 promises to some degree.
 *
 * # $q constructor
 *
 * The streamlined ES6 style promise is essentially just using $q as a constructor which takes a `resolver`
 * function as the first argument). This is similar to the native Promise implementation from ES6 Harmony,
 * see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 *
 * While the constructor-style use is supported, not all of the supporting methods from Harmony promises are
 * available yet.
 *
 * It can be used like so:
 *
 * ```js
 * return $q(function(resolve, reject) {
 *   // perform some asynchronous operation, resolve or reject the promise when appropriate.
 *   setInterval(function() {
 *     if (pollStatus > 0) {
 *       resolve(polledValue);
 *     } else if (pollStatus < 0) {
 *       reject(polledValue);
 *     } else {
 *       pollStatus = pollAgain(function(value) {
 *         polledValue = value;
 *       });
 *     }
 *   }, 10000);
 * }).
 *   then(function(value) {
 *     // handle success
 *   }, function(reason) {
 *     // handle failure
 *   });
 * ```
 *
 * Note, progress/notify callbacks are not currently supported via the ES6-style interface.
 *
 * However, the more traditional CommonJS style usage is still available, and documented below.
 *
 * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an
 * interface for interacting with an object that represents the result of an action that is
 * performed asynchronously, and may or may not be finished at any given point in time.
 *
 * From the perspective of dealing with error handling, deferred and promise APIs are to
 * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.
 *
 * ```js
 *   // for the purpose of this example let's assume that variables `$q`, `scope` and `okToGreet`
 *   // are available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     var deferred = $q.defer();
 *
 *     setTimeout(function() {
 *       deferred.notify('About to greet ' + name + '.');
 *
 *       if (okToGreet(name)) {
 *         deferred.resolve('Hello, ' + name + '!');
 *       } else {
 *         deferred.reject('Greeting ' + name + ' is not allowed.');
 *       }
 *     }, 1000);
 *
 *     return deferred.promise;
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   }, function(update) {
 *     alert('Got notification: ' + update);
 *   });
 * ```
 *
 * At first it might not be obvious why this extra complexity is worth the trouble. The payoff
 * comes in the way of guarantees that promise and deferred APIs make, see
 * https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md.
 *
 * Additionally the promise api allows for composition that is very hard to do with the
 * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.
 * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the
 * section on serial or parallel joining of promises.
 *
 * # The Deferred API
 *
 * A new instance of deferred is constructed by calling `$q.defer()`.
 *
 * The purpose of the deferred object is to expose the associated Promise instance as well as APIs
 * that can be used for signaling the successful or unsuccessful completion, as well as the status
 * of the task.
 *
 * **Methods**
 *
 * - `resolve(value)` – resolves the derived promise with the `value`. If the value is a rejection
 *   constructed via `$q.reject`, the promise will be rejected instead.
 * - `reject(reason)` – rejects the derived promise with the `reason`. This is equivalent to
 *   resolving it with a rejection constructed via `$q.reject`.
 * - `notify(value)` - provides updates on the status of the promise's execution. This may be called
 *   multiple times before the promise is either resolved or rejected.
 *
 * **Properties**
 *
 * - promise – `{Promise}` – promise object associated with this deferred.
 *
 *
 * # The Promise API
 *
 * A new promise instance is created when a deferred instance is created and can be retrieved by
 * calling `deferred.promise`.
 *
 * The purpose of the promise object is to allow for interested parties to get access to the result
 * of the deferred task when it completes.
 *
 * **Methods**
 *
 * - `then(successCallback, errorCallback, notifyCallback)` – regardless of when the promise was or
 *   will be resolved or rejected, `then` calls one of the success or error callbacks asynchronously
 *   as soon as the result is available. The callbacks are called with a single argument: the result
 *   or rejection reason. Additionally, the notify callback may be called zero or more times to
 *   provide a progress indication, before the promise is resolved or rejected.
 *
 *   This method *returns a new promise* which is resolved or rejected via the return value of the
 *   `successCallback`, `errorCallback`. It also notifies via the return value of the
 *   `notifyCallback` method. The promise can not be resolved or rejected from the notifyCallback
 *   method.
 *
 * - `catch(errorCallback)` – shorthand for `promise.then(null, errorCallback)`
 *
 * - `finally(callback)` – allows you to observe either the fulfillment or rejection of a promise,
 *   but to do so without modifying the final value. This is useful to release resources or do some
 *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full
 *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for
 *   more information.
 *
 *   Because `finally` is a reserved word in JavaScript and reserved keywords are not supported as
 *   property names by ES3, you'll need to invoke the method like `promise['finally'](callback)` to
 *   make your code IE8 and Android 2.x compatible.
 *
 * # Chaining promises
 *
 * Because calling the `then` method of a promise returns a new derived promise, it is easily
 * possible to create a chain of promises:
 *
 * ```js
 *   promiseB = promiseA.then(function(result) {
 *     return result + 1;
 *   });
 *
 *   // promiseB will be resolved immediately after promiseA is resolved and its value
 *   // will be the result of promiseA incremented by 1
 * ```
 *
 * It is possible to create chains of any length and since a promise can be resolved with another
 * promise (which will defer its resolution further), it is possible to pause/defer resolution of
 * the promises at any point in the chain. This makes it possible to implement powerful APIs like
 * $http's response interceptors.
 *
 *
 * # Differences between Kris Kowal's Q and $q
 *
 *  There are two main differences:
 *
 * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation
 *   mechanism in angular, which means faster propagation of resolution or rejection into your
 *   models and avoiding unnecessary browser repaints, which would result in flickering UI.
 * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains
 *   all the important functionality needed for common async tasks.
 *
 *  # Testing
 *
 *  ```js
 *    it('should simulate promise', inject(function($q, $rootScope) {
 *      var deferred = $q.defer();
 *      var promise = deferred.promise;
 *      var resolvedValue;
 *
 *      promise.then(function(value) { resolvedValue = value; });
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Simulate resolving of promise
 *      deferred.resolve(123);
 *      // Note that the 'then' function does not get called synchronously.
 *      // This is because we want the promise API to always be async, whether or not
 *      // it got called synchronously or asynchronously.
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Propagate promise resolution to 'then' functions using $apply().
 *      $rootScope.$apply();
 *      expect(resolvedValue).toEqual(123);
 *    }));
 *  ```
 *
 * @param {function(function, function)} resolver Function which is responsible for resolving or
 *   rejecting the newly created promise. The first parameteter is a function which resolves the
 *   promise, the second parameter is a function which rejects the promise.
 *
 * @returns {Promise} The newly created promise.
 */
function $QProvider() {

  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
    return qFactory(function(callback) {
      $rootScope.$evalAsync(callback);
    }, $exceptionHandler);
  }];
}

function $$QProvider() {
  this.$get = ['$browser', '$exceptionHandler', function($browser, $exceptionHandler) {
    return qFactory(function(callback) {
      $browser.defer(callback);
    }, $exceptionHandler);
  }];
}

/**
 * Constructs a promise manager.
 *
 * @param {function(Function)} nextTick Function for executing functions in the next turn.
 * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
 *     debugging purposes.
 * @returns {object} Promise manager.
 */
function qFactory(nextTick, exceptionHandler) {

  /**
   * @ngdoc method
   * @name $q#defer
   * @kind function
   *
   * @description
   * Creates a `Deferred` object which represents a task which will finish in the future.
   *
   * @returns {Deferred} Returns a new instance of deferred.
   */
  var ref = function(value) {
    if (isPromiseLike(value)) return value;
    return {
      then: function(callback) {
        var result = Q.defer();
        nextTick(function() {
          result.resolve(callback(value));
        });
        return result.promise;
      }
    };
  };


  var createInternalRejectedPromise = function(reason) {
    return {
      then: function(callback, errback) {
        var result = Q.defer();
        nextTick(function() {
          try {
            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
          } catch(e) {
            result.reject(e);
            exceptionHandler(e);
          }
        });
        return result.promise;
      }
    };
  };


  function defaultCallback(value) {
    return value;
  }


  function defaultErrback(reason) {
    return Q.reject(reason);
  }


  function Q(resolver) {
    if (!(this instanceof Q)) {
      return new Q(resolver);
    }

    $Q.call(this, resolver, nextTick);
  }

  // Inherit from shared $Q
  Q.prototype = createObject($Q.prototype);


  defineProperties(Q.prototype, INVISIBLE|WRITABLE|CONFIGURABLE, {
    constructor: Q
  });


  defineProperties(Q.prototype, INVISIBLE|WRITABLE, {
    $$possiblyUnhandledRejection: exceptionHandler || function(e) {},
    $$exceptionHandler: exceptionHandler || function(e) {}
  });


  defineProperties(Q, WRITABLE, {
    defer: function Q$defer() {
      return new $Deferred(Q, nextTick);
    },


    resolved: function Q$resolved(value) {
      var deferred = Q.defer();
      deferred.resolve(value);
      return deferred.promise;
    },


    /**
     * @ngdoc method
     * @name $q#all
     * @kind function
     *
     * @description
     * Combines multiple promises into a single promise that is resolved when all of the input
     * promises are resolved.
     *
     * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
     * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
     *   each value corresponding to the promise at the same index/key in the `promises` array/hash.
     *   If any of the promises is resolved with a rejection, this resulting promise will be rejected
     *   with the same rejection value.
     */
    all: function Q$all(promises) {
      var deferred = Q.defer(),
          counter = 0,
          results = isArray(promises) ? [] : {};

      forEach(promises, function(promise, key) {
        counter++;
        ref(promise).then(function(value) {
          if (results.hasOwnProperty(key)) return;
          results[key] = value;
          if (!(--counter)) deferred.resolve(results);
        }, function(reason) {
          if (results.hasOwnProperty(key)) return;
          deferred.reject(reason);
        });
      });

      if (counter === 0) {
        deferred.resolve(results);
      }

      return deferred.promise;
    },


    /**
     * @ngdoc method
     * @name $q#reject
     * @kind function
     *
     * @description
     * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
     * used to forward rejection in a chain of promises. If you are dealing with the last promise in
     * a promise chain, you don't need to worry about it.
     *
     * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
     * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
     * a promise error callback and you want to forward the error to the promise derived from the
     * current promise, you have to "rethrow" the error by returning a rejection constructed via
     * `reject`.
     *
     * ```js
     *   promiseB = promiseA.then(function(result) {
     *     // success: do something and resolve promiseB
     *     //          with the old or a new result
     *     return result;
     *   }, function(reason) {
     *     // error: handle the error if possible and
     *     //        resolve promiseB with newPromiseOrValue,
     *     //        otherwise forward the rejection to promiseB
     *     if (canHandle(reason)) {
     *      // handle the error and recover
     *      return newPromiseOrValue;
     *     }
     *     return $q.reject(reason);
     *   });
     * ```
     *
     * @param {*} reason Constant, message, exception or an object representing the rejection reason.
     * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
     */
    reject: function(reason) {
      var deferred = Q.defer();
      deferred.reject(reason);
      return deferred.promise;
    },


    /**
     * @ngdoc method
     * @name $q#when
     * @kind function
     *
     * @description
     * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
     * This is useful when you are dealing with an object that might or might not be a promise, or if
     * the promise comes from a source that can't be trusted.
     *
     * @param {*} value Value or a promise
     * @returns {Promise} Returns a promise of the passed value or promise
     */
    when: function Q$when(value, callback, errback, progressback) {
      var result = Q.defer();

      function fulfillWhen(value) {
        try {
          if (isFunction(callback)) value = callback(value);
          result.resolve(value);
          return value;
        } catch (e) {
          return Q.reject(e);
        }
      }


      function rejectWhen(reason) {
        try {
          var value = isFunction(errback) ? errback(reason) : Q.reject(reason);
          return value;
        } catch (e) {
          return Q.reject(e);
        }
      }


      function progressWhen(progress) {
        try {
          if (isFunction(progressback)) progress = progressback(progress);
          result.notify(progress);
          return progress;
        } catch (e) {
          // Exceptions thrown from progress callbacks are ignored
        }
      }


      nextTick(function awaitValue() {
        Promise$$castToPromise(value, void 0, Q).then(function(value) {
          result.resolve(Promise$$castToPromise(value, result.promise, Q).
            then(fulfillWhen, rejectWhen, progressWhen));        
        }, function(reason) {
          result.resolve(rejectWhen(reason));
        }, progressWhen);
      });

      return result.promise;
    }
  });

  return Q;
}
