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
      module('ngTouch');
    });

    afterEach(function() {
      dealoc(element);
    });

    it('should swipe to the left', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys : [],
        x : 100,
        y : 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe to the right', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 90,
        y: 20
      });
      expect($rootScope.swiped).toBe(true);
    }));

    it('should pass event object', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-left="event = $event"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      browserTrigger(element, startEvent, {
        keys : [],
        x : 100,
        y : 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      expect($rootScope.event).toBeDefined();
    }));

    it('should not swipe if you move too far vertically', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent,{
        keys: [],
        x: 90,
        y: 20
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 70,
        y: 200
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 20,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if you slide only a short distance', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent,{
        keys: [],
        x: 90,
        y: 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 80,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if the swipe leaves the element', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      browserTrigger(element, moveEvent,{
        keys: [],
        x: 40,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if the swipe starts outside the element', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, moveEvent,{
        keys: [],
        x: 10,
        y: 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 90,
        y: 20
      });

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should emit "swipeleft" events for left swipes', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();
      var eventFired = false;
      element.on('swipeleft', function() {
        eventFired = true;
      });

      browserTrigger(element, startEvent,{
        keys: [],
        x: 100,
        y: 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      expect(eventFired).toEqual(true);
    }));

    it('should emit "swiperight" events for right swipes', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();
      var eventFired = false;
      element.on('swiperight', function() {
        eventFired = true;
      });

      browserTrigger(element, startEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      browserTrigger(element, endEvent,{
        keys: [],
        x: 100,
        y: 20
      });
      expect(eventFired).toEqual(true);
    }));

    it('should swipe to the left, even if swipe completed outside ngSwipeLeft div', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys : [],
        x : 100,
        y : 20
      });
      browserTrigger($window.document.body, endEvent,{
        keys: [],
        x: 20,
        y: 20
      });
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe to the right, even if swipe completed outside ngSwipeRight div', inject(function($rootScope, $compile, $window) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      angular.element($window.document.body).append(element);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, {
        keys : [],
        x : 20,
        y : 20
      });
      browserTrigger($window.document.body, endEvent,{
        keys: [],
        x: 100,
        y: 20
      });
      expect($rootScope.swiped).toBe(true);
    }));
  });
}

swipeTests('touch', true  /* restrictBrowers */, 'touchstart', 'touchmove', 'touchend');
swipeTests('mouse', false /* restrictBrowers */, 'mousedown',  'mousemove', 'mouseup');