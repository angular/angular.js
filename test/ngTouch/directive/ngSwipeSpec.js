'use strict';

// Wrapper to abstract over using touch events or mouse events.
var swipeTests = function(description, restrictBrowsers, startEvent, moveEvent, endEvent) {
  describe('ngSwipe with ' + description + ' events', function() {
    var element;

    if (restrictBrowsers) {
      // TODO(braden): Once we have other touch-friendly browsers on CI, allow them here.
      // Currently Firefox and IE refuse to fire touch events.
      var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
      if (!chrome) {
        return;
      }
    }

    beforeEach(function() {
      module('ngTouch');
    });

    afterEach(function() {
      dealoc(element);
    });

    it('should swipe to the left', inject(function($rootScope, $compile) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 100,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe to the right', inject(function($rootScope, $compile) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 90,
        y: 20
      });
      expect($rootScope.swiped).toBe(true);
    }));

    it('should only swipe given ng-swipe-disable-mouse attribute for touch events', inject(function($rootScope, $compile) {
      element = $compile('<div ng-swipe-left="swiped = true" ng-swipe-disable-mouse></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 100,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      expect(!!$rootScope.swiped).toBe(description !== 'mouse');
    }));

    it('should pass event object', inject(function($rootScope, $compile) {
      element = $compile('<div ng-swipe-left="event = $event"></div>')($rootScope);
      $rootScope.$digest();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 100,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      expect($rootScope.event).toBeDefined();
    }));

    it('should not swipe if you move too far vertically', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 90,
        y: 20
      });
      browserTrigger(element, moveEvent, {
        keys: [],
        x: 70,
        y: 200
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 20,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if you slide only a short distance', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 90,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 80,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if the swipe leaves the element', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      browserTrigger(element, moveEvent, {
        keys: [],
        x: 40,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if the swipe starts outside the element', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, moveEvent, {
        keys: [],
        x: 10,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 90,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should emit "swipeleft" events for left swipes', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();
      var eventFired = false;
      element.on('swipeleft', function() {
        eventFired = true;
      });

      browserTrigger(element, startEvent, {
        keys: [],
        x: 100,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      expect(eventFired).toEqual(true);
    }));

    it('should emit "swiperight" events for right swipes', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();
      var eventFired = false;
      element.on('swiperight', function() {
        eventFired = true;
      });

      browserTrigger(element, startEvent, {
        keys: [],
        x: 20,
        y: 20
      });
      browserTrigger(element, endEvent, {
        keys: [],
        x: 100,
        y: 20
      });
      expect(eventFired).toEqual(true);
    }));
  });
};

swipeTests('touch', /* restrictBrowers */ true, 'touchstart', 'touchmove', 'touchend');
swipeTests('mouse', /* restrictBrowers */ false, 'mousedown', 'mousemove', 'mouseup');

