'use strict';

describe('$$rAF', function() {
  it('should queue and block animation frames', inject(function($$rAF) {
    if (!$$rAF.supported) return;

    var message;
    $$rAF(function() {
      message = 'yes';
    });

    expect(message).toBeUndefined();
    $$rAF.flush();
    expect(message).toBe('yes');
  }));

  it('should provide a cancellation method', inject(function($$rAF) {
    if (!$$rAF.supported) return;

    var present = true;
    var cancel = $$rAF(function() {
      present = false;
    });

    expect(present).toBe(true);
    cancel();

    try {
      $$rAF.flush();
    } catch (e) {}
    expect(present).toBe(true);
  }));

  it('should only consume only one RAF if multiple async functions are registered before the first frame kicks in', inject(function($$rAF) {
    if (!$$rAF.supported) return;

    //we need to create our own injector to work around the ngMock overrides
    var rafLog = [];
    var injector = createInjector(['ng', function($provide) {
      $provide.value('$window', {
        location: window.location,
        history: window.history,
        webkitRequestAnimationFrame: function(fn) {
          rafLog.push(fn);
        }
      });
    }]);

    $$rAF = injector.get('$$rAF');

    var log = [];
    function logFn() {
      log.push(log.length);
    }

    $$rAF(logFn);
    $$rAF(logFn);
    $$rAF(logFn);

    expect(log).toEqual([]);
    expect(rafLog.length).toBe(1);

    rafLog[0]();

    expect(log).toEqual([0,1,2]);
    expect(rafLog.length).toBe(1);

    $$rAF(logFn);

    expect(log).toEqual([0,1,2]);
    expect(rafLog.length).toBe(2);
  }));

  describe('$timeout fallback', function() {
    it("it should use a $timeout incase native rAF isn't suppored", function() {
      var timeoutSpy = jasmine.createSpy('callback');

      //we need to create our own injector to work around the ngMock overrides
      var injector = createInjector(['ng', function($provide) {
        $provide.value('$timeout', timeoutSpy);
        $provide.value('$window', {
          location: window.location
        });
      }]);

      var $$rAF = injector.get('$$rAF');
      expect($$rAF.supported).toBe(false);

      var message;
      $$rAF(function() {
        message = 'on';
      });

      expect(message).toBeUndefined();
      expect(timeoutSpy).toHaveBeenCalled();

      timeoutSpy.mostRecentCall.args[0]();

      expect(message).toBe('on');
    });
  });

  describe('mocks', function() {
    it('should throw an error if no frames are present', inject(function($$rAF) {
      if ($$rAF.supported) {
        var failed = false;
        try {
          $$rAF.flush();
        } catch (e) {
          failed = true;
        }
        expect(failed).toBe(true);
      }
    }));
  });

  describe('mobile', function() {
    it('should provide a cancellation method for an older version of Android', function() {
      //we need to create our own injector to work around the ngMock overrides
      var injector = createInjector(['ng', function($provide) {
        $provide.value('$window', {
          location: window.location,
          history: window.history,
          webkitRequestAnimationFrame: jasmine.createSpy('$window.webkitRequestAnimationFrame'),
          webkitCancelRequestAnimationFrame: jasmine.createSpy('$window.webkitCancelRequestAnimationFrame')
        });
      }]);

      var $$rAF = injector.get('$$rAF');
      var $window = injector.get('$window');
      var cancel = $$rAF(function() {});

      expect($$rAF.supported).toBe(true);

      try {
        cancel();
      } catch (e) {}

      expect($window.webkitCancelRequestAnimationFrame).toHaveBeenCalled();
    });
  });
});
