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

    // Skip tests on IE < 9. These versions of IE don't support createEvent(), and so
    // we cannot control the (x,y) position of events.
    // It works fine in IE 8 under manual testing.
    var msie = +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
    if (msie < 9) {
      return;
    }

    beforeEach(function() {
      module('ngMobile');
    });

    afterEach(function() {
      dealoc(element);
    });

    it('should swipe to the left', inject(function($rootScope, $compile) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 100, 20);
      browserTrigger(element, endEvent, [], 20, 20);
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe to the right', inject(function($rootScope, $compile) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 20, 20);
      browserTrigger(element, endEvent, [], 90, 20);
      expect($rootScope.swiped).toBe(true);
    }));

    it('should not swipe if you move too far vertically', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 90, 20);
      browserTrigger(element, moveEvent, [], 70, 200);
      browserTrigger(element, endEvent, [], 20, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if you slide only a short distance', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 90, 20);
      browserTrigger(element, endEvent, [], 80, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if the swipe leaves the element', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 20, 20);
      browserTrigger(element, moveEvent, [], 40, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if the swipe starts outside the element', inject(function($rootScope, $compile, $rootElement) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, moveEvent, [], 10, 20);
      browserTrigger(element, endEvent, [], 90, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));
  });
}

swipeTests('touch', true  /* restrictBrowers */, 'touchstart', 'touchmove', 'touchend');
swipeTests('mouse', false /* restrictBrowers */, 'mousedown',  'mousemove', 'mouseup');

