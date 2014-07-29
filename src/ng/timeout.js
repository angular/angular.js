'use strict';


function $TimeoutProvider() {
  this.$get = ['$rootScope', '$browser', '$q', '$$q', '$exceptionHandler',
       function($rootScope,   $browser,   $q,   $$q,   $exceptionHandler) {
    var deferreds = {};


     /**
      * @ngdoc service
      * @name $timeout
      *
      * @description
      * Angular's wrapper for `window.setTimeout`. The `fn` function is wrapped into a try/catch
      * block and delegates any exceptions to
      * {@link ng.$exceptionHandler $exceptionHandler} service.
      *
      * The return value of registering a timeout function is a promise, which will be resolved when
      * the timeout is reached and the timeout function is executed.
      *
      * To cancel a timeout request, call `$timeout.cancel(promise)`.
      *
      * In tests you can use {@link ngMock.$timeout `$timeout.flush()`} to
      * synchronously flush the queue of deferred functions.
      *
      * @param {function()} fn A function, whose execution should be delayed.
      * @param {number=} [delay=0] Delay in milliseconds.
      * @param {(boolean|Scope)=} [invokeApply=true] By default, {@link ng.$rootScope.Scope#$apply $apply}
      * is called on the {@link ng.$rootScope $rootScope} when the timeout is reached.
      * The default behavior can be changed by setting the parameter to one of:
      *  - `true` (default) calls {@link ng.$rootScope.Scope#$apply $apply} on the {@link ng.$rootScope $rootScope}
      *  - `false` skips dirty checking completely. Can be useful for performance.
      *  - `Scope` calls {@link ng.$rootScope.Scope#$apply $apply} on the given {@link ng.$rootScope.Scope Scope}.
      *  Useful if the scope was created as partially digestible {@link ng.$rootScope.Scope#$new partialDigest}.
      * @returns {Promise} Promise that will be resolved when the timeout is reached. The value this
      *   promise will be resolved with is the return value of the `fn` function.
      *
      */
    function timeout(fn, delay, invokeApply) {
      var skipApply = (isDefined(invokeApply) && !invokeApply),
          scope = isScope(invokeApply) ? invokeApply : $rootScope,
          deferred = (skipApply ? $$q : $q).defer(),
          promise = deferred.promise,
          timeoutId;

      timeoutId = $browser.defer(function() {
        try {
          deferred.resolve(fn());
        } catch(e) {
          deferred.reject(e);
          $exceptionHandler(e);
        }
        finally {
          delete deferreds[promise.$$timeoutId];
        }

        if (!skipApply) scope.$apply();
      }, delay);

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;

      return promise;
    }


     /**
      * @ngdoc method
      * @name $timeout#cancel
      *
      * @description
      * Cancels a task associated with the `promise`. As a result of this, the promise will be
      * resolved with a rejection.
      *
      * @param {Promise=} promise Promise returned by the `$timeout` function.
      * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
      *   canceled.
      */
    timeout.cancel = function(promise) {
      if (promise && promise.$$timeoutId in deferreds) {
        deferreds[promise.$$timeoutId].reject('canceled');
        delete deferreds[promise.$$timeoutId];
        return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
    };

    return timeout;
  }];
}
