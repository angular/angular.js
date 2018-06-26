'use strict';

/** @this */
function $$IntervalFactoryProvider() {
  this.$get = ['$browser', '$q', '$$q', '$rootScope',
       function($browser,   $q,   $$q,   $rootScope) {
    return function intervalFactory(setIntervalFn, clearIntervalFn) {
      return function intervalFn(fn, delay, count, invokeApply) {
        var hasParams = arguments.length > 4,
            args = hasParams ? sliceArgs(arguments, 4) : [],
            iteration = 0,
            skipApply = isDefined(invokeApply) && !invokeApply,
            deferred = (skipApply ? $$q : $q).defer(),
            promise = deferred.promise;

        count = isDefined(count) ? count : 0;

        function callback() {
          if (!hasParams) {
            fn(iteration);
          } else {
            fn.apply(null, args);
          }
        }

        function tick() {
          if (skipApply) {
            $browser.defer(callback);
          } else {
            $rootScope.$evalAsync(callback);
          }
          deferred.notify(iteration++);

          if (count > 0 && iteration >= count) {
            deferred.resolve(iteration);
            clearIntervalFn(promise.$$intervalId);
          }

          if (!skipApply) $rootScope.$apply();
        }

        promise.$$intervalId = setIntervalFn(tick, delay, deferred, skipApply);

        return promise;
      };
    };
  }];
}
