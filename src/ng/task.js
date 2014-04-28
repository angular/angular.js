'use strict';

function $TaskProvider()
{
  this.$get = ["$q", "$browser",
    function($q, $browser)
    {
      /**
       * @ngdoc service
       * @name $task
       *
       * @description
       * Returns a deferred object that completes when task completes.
       *
       * @param {function()} task a function that executes a step of work.
       *   task is repeatedly called until it returns false.
       * @param {number} run a time in milliseconds to call task before 
       *   yielding an execution to other tasks. Default is 100 ms.
       *   if value is null then task will run till completion 
       *   without continuations.
       * @param {number} sleep a time in milliseconds to sleep
       *   between execution cycles. Default is 50 ms.
       * @param {number|Promise} timeout a timeout in milliseconds, or 
       *   {@link ng.$q promise} that should abort the request when resolved.
       */
      return function(task, run, sleep, timeout)
      {
        (run >= 0) || (run == null) || (run = 100);
        (sleep >= 0) || (sleep = 50);

        var defer = $q.defer();
        var startedAt = new Date().getTime();
        var sleepId;
        var aborted;

        if (!angular.isFunction(task))
        {
          defer.resolve();

          return defer.promise;
        }

        // If timeout is a Promise then listen it to trigger abort.
        if (timeout && timeout.then)
        {
          timeout.then(abort);
        }

        // Main work.
        next();

        return defer.promise;

        function abort(value)
        {
          aborted = true;
          (sleepId != null) && $browser.defer.cancel(sleepId);
          defer.reject(value);
        }

        function next()
        {
          try
          {
            sleepId = null;

            var runAt = new Date().getTime();

            // Cycle while not aborted, there are steps to run, and 
            // no time quota is exceeded.
            while(!aborted)
            {
              // Run payload.
              var result = task();

              if (!result)
              {
                defer.resolve();

                break;
              }

              var now = new Date().getTime();

              // If timeout is a number then reject task if it's timed out.
              if ((timeout > 0) && (now - startedAt >= timeout - sleep))
              {
                defer.reject("timeout");

                break;
              }

              // If task returns deferred object then continue when it's ready.
              if (result.then)
              {
                result.then(next, abort);

                break;
              }

              // Schedule a next run if time quota is exceeded.
              if (now - runAt >= run)
              {
                sleepId = $browser.defer(next, sleep);

                break;
              }
            }
          }
          catch(e)
          {
            defer.reject(e);
          }
        }
      };
    }];
}