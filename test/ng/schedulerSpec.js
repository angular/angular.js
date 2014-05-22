'use strict';

describe("$scheduler's q", function()
{
  beforeEach(module(provideLog));

  beforeEach(module(function($schedulerProvider)
  {
    $schedulerProvider.run(0);
    $schedulerProvider.sleep(0);
  }));

  it('should complete', inject(function ($browser, $scheduler)
  {
    var q = $scheduler();
    var count = 10;
    var i = 0;

    q.run(function(promise)
    {
      return promise.thenWhile(
        function() { return i < count; },
        function() { ++i });
    });

    $browser.defer.flush(count * 2);

    expect(i).toBe(count);
  }));

  it('has thenIf function', inject(function($browser, $scheduler)
  {
    var q = $scheduler();
    var result;

    q.run(function(promise)
    {
      return promise.thenIf(
        function() { return 1 < 2; },
        function() { result = "then" });
    });

    $browser.defer.flush(100);

    expect(result).toBe("then");

    q.run(function(promise)
    {
      return promise.thenIf(
        function() { return 1 > 2; },
        function() { result = "then" },
        function() { result = "else" });
    });

    $browser.defer.flush(100);

    expect(result).toBe("else");
  }));

  it('has thenWhile function', inject(function($browser, $scheduler)
  {
    var q = $scheduler();
    var s = 0, i = 0, count = 1000;

    q.run(function(promise)
    {
      return promise.thenWhile(
        function() { return i++ < count; },
        function() { s += i; });
    });

    $browser.defer.flush(count * 2);

    expect(s).toBe(count * (count + 1) / 2);
  }));

  it('has thenDoWhile function', inject(function($browser, $scheduler)
  {
    var q = $scheduler();
    var s = 0, i = 0, count = 1000;

    q.run(function(promise)
    {
      return promise.thenDoWhile(
        function() { return i < count; },
        function() { s += ++i; });
    });

    $browser.defer.flush(count * 2);

    expect(s).toBe(count * (count + 1) / 2);
  }));

  it('has thenForEach function', inject(function($browser, $scheduler)
  {
    var q = $scheduler();
    var s = 0, count = 1000, items = [];

    for(var i = 0; i < count; ++i)
    {
      items[i] = i + 1;
    }

    q.run(function(promise)
    {
      return promise.thenForEach(
        function() { return items; },
        function(item) { s += item; });
    });

    $browser.defer.flush(count * 2);

    expect(s).toBe(count * (count + 1) / 2);

    var t = "";
    var o =
    {
      first: 1,
      second: 2,
      third: 3
    };

    q.run(function(promise)
    {
      return promise.thenForEach(
        function() { return o; },
        function(value, key)
        {
          if (t)
          {
            t += ",";
          }

          t += key + ":" + value;
        });
    });

    $browser.defer.flush(100);

    expect(t).toBe("first:1,second:2,third:3");
  }));

  it('has thenFor function', inject(function($browser, $scheduler)
  {
    var q = $scheduler();
    var s = 0, i, count = 1000;

    q.run(function(promise)
    {
      return promise.thenFor(
        function() { i = 0; },
        function() { return i < count; },
        function() { ++i; },
        function() { s += i + 1; });
    });

    $browser.defer.flush(count * 2);

    expect(s).toBe(count * (count + 1) / 2);
  }));

  it('may complete with an error', function()
  {
    module(function($exceptionHandlerProvider)
    {
      $exceptionHandlerProvider.mode('log');
    });

    inject(function($browser, $scheduler)
    {
      var q = $scheduler();
      var i = 0;
      var error = null;

      q.run(function(promise)
      {
        return promise.thenWhile(
          function() { return true; },
          function()
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
          })
        ["catch"](function(e) { error = e });
      });

      $browser.defer.flush(1000);

      expect(i).toBe(2);
      expect(error).not.toBeNull();
    })
  });
});
