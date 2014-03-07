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

      browserTrigger(element, startEvent,{
        keys: [],
        x: 100,
        y: 20
      });

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

      browserTrigger(element, startEvent,{
        keys: [],
        x: 100,
        y: 20
      });

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent,{
        keys: [],
        x: 140,
        y: 20
      });

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

      browserTrigger(element, moveEvent,{
        keys: [],
        x: 100,
        y: 40
      });

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

      browserTrigger(element, endEvent,{
        keys: [],
        x: 100,
        y: 40
      });

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

      browserTrigger(element, startEvent,{
        keys: [],
        x: 100,
        y: 40
      });

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent,{
        keys: [],
        x: 120,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 130,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 140,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 150,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 160,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 170,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 180,
        y: 40
      });

      expect(events.start).toHaveBeenCalled();
      expect(events.move.calls.length).toBe(7);

      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent,{
        keys: [],
        x: 200,
        y: 40
      });

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

      browserTrigger(element, startEvent,{
        keys: [],
        x: 100,
        y: 40
      });

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent,{
        keys: [],
        x: 101,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 105,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 110,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 115,
        y: 40
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 120,
        y: 40
      });

      expect(events.start).toHaveBeenCalled();
      expect(events.move.calls.length).toBe(3);

      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent,{
        keys: [],
        x: 200,
        y: 40
      });

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

      browserTrigger(element, startEvent,{
        keys: [],
        x: 100,
        y: 40
      });

      expect(events.start).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.cancel).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, moveEvent,{
        keys: [],
        x: 101,
        y: 41
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 105,
        y: 55
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 110,
        y: 60
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 115,
        y: 70
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 120,
        y: 80
      });

      expect(events.start).toHaveBeenCalled();
      expect(events.cancel).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();

      browserTrigger(element, endEvent,{
        keys: [],
        x: 200,
        y: 40
      });

      expect(events.start).toHaveBeenCalled();
      expect(events.cancel).toHaveBeenCalled();

      expect(events.move).not.toHaveBeenCalled();
      expect(events.end).not.toHaveBeenCalled();
    }));
  });
}

swipeTests('touch', /* restrictBrowers */ true, 'touchstart', 'touchmove', 'touchend');
swipeTests('mouse', /* restrictBrowers */ false, 'mousedown',  'mousemove', 'mouseup');

