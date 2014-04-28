'use strict';

describe('$task', function()
{

  beforeEach(module(provideLog));

  it('should complete', inject(function ($task, $browser)
  {
    var count = 10;
    var i = 0;

    $task(step, 0, 0);
    $browser.defer.flush(100);

    expect(i).toBe(count);

    function step()
    {
      if (i >= count)
      {
        return false;
      }

      ++i;

      return true;
    }
  }));

  it('is cancellable', inject(function($task, $q, $browser)
  {
    var count = 10;
    var i = 0;
    var token = $q.defer();

    $task(step, 0, 0, token.promise);

    token.resolve();

    $browser.defer.flush(100);

    expect(i).not.toBe(count);

    function step()
    {
      if (i >= count)
      {
        return false;
      }

      ++i;

      return true;
    }
  }));

  it('may return promise', inject(function($task, $q, $browser)
  {
    var count = 10;
    var i = 0;

    $task(step, 0, 0);
    $browser.defer.flush(100);

    expect(i).toBe(count);

    function step()
    {
      if (i >= count)
      {
        return false;
      }

      ++i;

      var d = $q.defer();

      d.resolve();

      return d.promise;
    }
  }));

  it('may complete with an error', inject(function($task, $browser)
  {
    var count = 10;
    var i = 0;
    var error = null;

    $task(step, 0, 0)["catch"](function(e) { error = e});
    $browser.defer.flush(100);

    expect(i).toBe(2);
    expect(error).not.toBeNull(1);

    function step()
    {
      if (i == 0)
      {
        i = 1;

        return true;
      }
      else if (i == 1)
      {
        i = 2;

        throw "error";
      }
      else
      {
        i = 3;
      }
    }
  }));

});
