'use strict';

describe('$$rAF', function() {
  it('should queue and block animation frames', inject(function($$rAF) {
    if(!$$rAF.supported) return;

    var message;
    $$rAF(function() {
      message = 'yes';
    });

    expect(message).toBeUndefined();
    $$rAF.flush();
    expect(message).toBe('yes');
  }));

  it('should provide a cancellation method', inject(function($$rAF) {
    if(!$$rAF.supported) return;

    var present = true;
    var cancel = $$rAF(function() {
      present = false;
    });

    expect(present).toBe(true);
    cancel();

    try {
      $$rAF.flush();
    } catch(e) {};
    expect(present).toBe(true);
  }));

  describe('$timeout fallback', function() {
    it("it should use a $timeout incase native rAF isn't suppored", function() {
      var timeoutSpy = jasmine.createSpy('callback');

      //we need to create our own injector to work around the ngMock overrides
      var injector = createInjector(['ng', function($provide) {
        $provide.value('$timeout', timeoutSpy);
        $provide.decorator('$window', function($delegate) {
          $delegate.requestAnimationFrame = false;
          $delegate.webkitRequestAnimationFrame = false;
          $delegate.mozRequestAnimationFrame = false;
          return $delegate;
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
      if($$rAF.supported) {
        var failed = false;
        try {
          $$rAF.flush();
        } catch(e) {
          failed = true;
        }
        expect(failed).toBe(true);
      }
    }));
  });
});
