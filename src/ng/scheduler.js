'use strict';

function $SchedulerProvider()
{
  var defaultRun = 100;
  var defaultSleep = 50;

  this.run = function(value)
  {
    if (arguments.length)
    {
      defaultRun = value;
    }

    return defaultRun;
  };

  this.sleep = function(value)
  {
    if (arguments.length)
    {
      defaultSleep = value;
    }

    return defaultSleep;
  };

  this.$get = ["$browser", "$exceptionHandler",
    function($browser, $exceptionHandler)
    {
      service.options = function(run, sleep)
      {
        var sleepId, idleId, startedAt, running, pending = [];
        var async = !((run === null) || (run === false));

        (!(run === true) && (run >= 0)) || (run = defaultRun);
        (sleep >= 0) || (sleep = defaultSleep);

        var result =
        {
          exceptionHandler: $exceptionHandler,
          handler: function(callback)
          {
            var self = this;

            if (isFunction(callback))
            {
              pending.unshift(callback);
            }

            if (running)
            {
              return;
            }

            if (async)
            {
              if (sleepId != null)
              {
                if (callback)
                {
                  return;
                }

                $browser.defer.cancel(sleepId);
                sleepId = undefined;
                startedAt = undefined;

                if (idleId != null)
                {
                  $browser.defer.cancel(idleId);
                  idleId = undefined;
                }
              }

              if (!pending.length)
              {
                return;
              }

              if (idleId == null)
              {
                idleId = $browser.defer(
                  function ()
                  {
                    idleId = undefined;
                    startedAt = undefined;
                  });
              }

              if (startedAt == null)
              {
                startedAt = new Date().getTime();
              }
            }

            while(pending.length)
            {
              running = true;

              try
              {
                pending.pop()();
              }
              catch(e)
              {
                self.exceptionHandler(e);
              }
              finally
              {
                running = false;
              }

              if (async)
              {
                if (new Date().getTime() - startedAt >= run)
                {
                  startedAt = undefined;

                  if (idleId != null)
                  {
                    $browser.defer.cancel(idleId);
                    idleId = undefined;
                  }

                  if (pending.length)
                  {
                    sleepId = $browser.defer(
                      function ()
                      {
                        sleepId = undefined;

                        if (pending.length)
                        {
                          self.handler();
                        }
                      },
                      sleep);
                  }

                  break;
                }
              }
            }
          }
        };

        return result;
      };

      return service;

      function service(options)
      {
        options || (options = service.options());

        return qFactory(
          function(callback) { options.handler(callback); },
          function(e) { options.exceptionHandler(e); });
      }
    }];
}