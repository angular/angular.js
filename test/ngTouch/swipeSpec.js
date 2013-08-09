'use strict';

// Wrapper to abstract over using touch events or mouse events.
var swipeTests = function(description, restrictBrowsers, startEvent, moveEvent, endEvent) {
  describe('$swipe with ' + description + ' events', function() {
    var element;

    if (restrictBrowsers) {
      // TODO(braden): Once we have other touch-friendly browsers on CI, allow them here.
      // Currently Firefox and IE refuse to fire touch events.
      var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
      if (!chrome) {
        return;
      }
    }

    // Skip tests on IE < 9. These versions of IE don't support createEvent(), and so
    // we cannot control the (x,y) position of events.
    // It works fine in IE 8 under manual testing.
    var msie = +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
    if (msie < 9) {
      return;
    }

    beforeEach(function() {
      module('ngTouch');
    });

    afterEach(function() {
      dealoc(element);
    });

    it('should trigger the "start" event', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, startEvent, [], 100, 20);

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();
    }));

    it('should trigger the "move" event after a "start"', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, startEvent, [], 100, 20);

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent, [], 140, 20);

      expect(events.start).toHaveBeenCalled();
      expect(events.move).toHaveBeenCalled();

      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();
    }));

    it('should not trigger a "move" without a "start"', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent, [], 100, 40);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();
    }));

    it('should not trigger an "end" without a "start"', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent, [], 100, 40);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();
    }));

    it('should trigger a "start", many "move"s and an "end"', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, startEvent, [], 100, 40);

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent, [], 120, 40);
      browserTrigger(element, moveEvent, [], 130, 40);
      browserTrigger(element, moveEvent, [], 140, 40);
      browserTrigger(element, moveEvent, [], 150, 40);
      browserTrigger(element, moveEvent, [], 160, 40);
      browserTrigger(element, moveEvent, [], 170, 40);
      browserTrigger(element, moveEvent, [], 180, 40);

      expect(events.start).toHaveBeenCalled();
      expect(events.move.calls.length).toBe(7);

      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent, [], 200, 40);

      expect(events.start).toHaveBeenCalled();
      expect(events.move.calls.length).toBe(7);
      expect(events.end).toHaveBeenCalled();

      expect(events.cancel).not.toHaveBeenCalled();
    }));

    it('should not start sending "move"s until enough horizontal motion is accumulated', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, startEvent, [], 100, 40);

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent, [], 101, 40);
      browserTrigger(element, moveEvent, [], 105, 40);
      browserTrigger(element, moveEvent, [], 110, 40);
      browserTrigger(element, moveEvent, [], 115, 40);
      browserTrigger(element, moveEvent, [], 120, 40);

      expect(events.start).toHaveBeenCalled();
      expect(events.move.calls.length).toBe(3);

      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent, [], 200, 40);

      expect(events.start).toHaveBeenCalled();
      expect(events.move.calls.length).toBe(3);
      expect(events.end).toHaveBeenCalled();

      expect(events.cancel).not.toHaveBeenCalled();
    }));

    it('should stop sending anything after vertical motion dominates', inject(function($rootScope, $swipe, $compile) {
      element = $compile('<div></div>')($rootScope);
      var events = {
        start: jasmine.createSpy('startSpy'),
        move: jasmine.createSpy('moveSpy'),
        cancel: jasmine.createSpy('cancelSpy'),
        end: jasmine.createSpy('endSpy')
      };

      $swipe.bind(element, events);

      expect(events.start).not.toHaveBeenCalled();
      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, startEvent, [], 100, 40);

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent, [], 101, 41);
      browserTrigger(element, moveEvent, [], 105, 55);
      browserTrigger(element, moveEvent, [], 110, 60);
      browserTrigger(element, moveEvent, [], 115, 70);
      browserTrigger(element, moveEvent, [], 120, 80);

      expect(events.start).toHaveBeenCalled();
      expect(events.cancel).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent, [], 200, 40);

      expect(events.start).toHaveBeenCalled();
      expect(events.cancel).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();
    }));
  });
}

swipeTests('touch', true  /* restrictBrowers */, 'touchstart', 'touchmove', 'touchend');
swipeTests('mouse', false /* restrictBrowers */, 'mousedown',  'mousemove', 'mouseup');

