'use strict';

describe('ngTap', function() {
  var element, time, orig_now;

  // TODO(braden): Once we have other touch-friendly browsers on CI, allow them here.
  // Currently Firefox and IE refuse to fire touch events.
  var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
  if (!chrome) {
    return;
  }

  function mockTime() {
    return time;
  }

  beforeEach(function() {
    module('ngMobile');
    orig_now = Date.now;
    time = 0;
    Date.now = mockTime;
  });

  afterEach(function() {
    dealoc(element);
    Date.now = orig_now;
  });

  it('should get called on a tap', inject(function($rootScope, $compile) {
    element = $compile('<div ng-tap="tapped = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeFalsy();

    browserTrigger(element, 'touchstart');
    browserTrigger(element, 'touchend');
    expect($rootScope.tapped).toEqual(true);
  }));

  it('should pass event object', inject(function($rootScope, $compile) {
    element = $compile('<div ng-tap="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'touchstart');
    browserTrigger(element, 'touchend');
    expect($rootScope.event).toBeDefined();
  }));

  it('should not click if the touch is held too long', inject(function($rootScope, $compile, $rootElement) {
    element = $compile('<div ng-tap="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeFalsy();

    time = 10;
    browserTrigger(element, 'touchstart', [], 10, 10);

    time = 900;
    browserTrigger(element, 'touchend', [], 10, 10);

    expect($rootScope.tapped).toBeFalsy();
  }));

  it('should not click if the touchend is too far away', inject(function($rootScope, $compile, $rootElement) {
    element = $compile('<div ng-tap="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeFalsy();

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger(element, 'touchend', [], 400, 400);

    expect($rootScope.tapped).toBeFalsy();
  }));

  it('should not click if a touchmove comes before touchend', inject(function($rootScope, $compile, $rootElement) {
    element = $compile('<div ng-tap="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeFalsy();

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger(element, 'touchmove');
    browserTrigger(element, 'touchend', [], 400, 400);

    expect($rootScope.tapped).toBeFalsy();
  }));


  describe('the clickbuster', function() {
    var element1, element2;

    afterEach(function() {
      dealoc(element1);
      dealoc(element2);
    });

    it('should cancel the following click event', inject(function($rootScope, $compile, $rootElement, $document) {
      element = $compile('<div ng-tap="taps = taps + 1" ng-click="clicked = true"></div>')($rootScope);
      $rootElement.append(element);
      $document.find('body').append($rootElement);

      $rootScope.taps = 0;
      $rootScope.$digest();

      expect($rootScope.taps).toBe(0);
      expect($rootScope.clicked).toBeFalsy();

      // Fire touchstart at 10ms, touchend at 50ms, the click at 300ms.
      time = 10;
      browserTrigger(element, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger(element, 'touchend', [], 10, 10);

      time = 100;
      browserTrigger(element, 'click', [], 10, 10);

      expect($rootScope.taps).toBe(1);
      expect($rootScope.clicked).toBeFalsy();
    }));

    it('should cancel the following click event even when the element has changed', inject(function($rootScope, $compile, $rootElement, $document) {
      element1 = $compile('<div ng-show="!tapped" ng-tap="tapped = true" ng-click="clicked1 = true"></div>')($rootScope);
      element2 = $compile('<div ng-show="tapped" ng-click="clicked2 = true"></div>')($rootScope);
      $rootElement.append(element1);
      $rootElement.append(element2);
      $document.find('body').append($rootElement);

      $rootScope.$digest();

      expect($rootScope.tapped).toBeFalsy();
      expect($rootScope.clicked1).toBeFalsy();
      expect($rootScope.clicked2).toBeFalsy();

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger(element1, 'touchend', [], 10, 10);

      time = 100;
      browserTrigger(element2, 'click', [], 10, 10);

      expect($rootScope.tapped).toEqual(true);
      expect($rootScope.clicked1).toBeFalsy();
      expect($rootScope.clicked2).toBeFalsy();
    }));

    it('should not cancel clicks on distant elements', inject(function($rootScope, $compile, $rootElement, $document) {
      element1 = $compile('<div ng-tap="taps = taps+1" ng-click="badClick = true"></div>')($rootScope);
      element2 = $compile('<div ng-click="clicked = true"></div>')($rootScope);

      $rootElement.append(element1);
      $rootElement.append(element2);
      document.body.appendChild($rootElement[0]);

      $rootScope.taps = 0;

      $rootScope.$digest();

      expect($rootScope.taps).toBe(0);
      expect($rootScope.clicked).toBeFalsy();
      expect($rootScope.badClick).toBeFalsy();

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger(element1, 'touchend', [], 10, 10);

      time = 90;
      browserTrigger(element1, 'click', [], 10, 10);

      time = 100;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 130;
      browserTrigger(element1, 'touchend', [], 10, 10);

      // Click on other element that should go through.
      time = 150;
      browserTrigger(element2, 'touchstart', [], 100, 120);
      browserTrigger(element2, 'touchend', [], 100, 120);
      browserTrigger(element2, 'click', [], 100, 120);

      // Click event for the element that should be busted.
      time = 200;
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.clicked).toBe(true);
      expect($rootScope.badClick).toBeFalsy();
      expect($rootScope.taps).toBe(2);
    }));

    it('should not cancel clicks that come long after', inject(function($rootScope, $compile, $rootElement, $document) {
      element1 = $compile('<div ng-tap="tapped = true" ng-click="clicks = clicks + 1"></div>')($rootScope);
      element2 = {};

      $rootElement.append(element1);

      $rootScope.clicks = 0;

      $rootScope.$digest();

      expect($rootScope.tapped).toBeFalsy();
      expect($rootScope.clicks).toBe(0);

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger(element1, 'touchend', [], 10, 10);

      time = 2700;
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.tapped).toBe(true);
      expect($rootScope.clicks).toBe(1);
    }));

    it('should not cancel clicks that come long after', inject(function($rootScope, $compile, $rootElement, $document) {
      element1 = $compile('<div ng-tap="tapped = true" ng-click="clicks = clicks + 1"></div>')($rootScope);
      element2 = {};

      $rootElement.append(element1);

      $rootScope.clicks = 0;

      $rootScope.$digest();

      expect($rootScope.tapped).toBeFalsy();
      expect($rootScope.clicks).toBe(0);

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger(element1, 'touchend', [], 10, 10);

      time = 2700;
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.tapped).toBe(true);
      expect($rootScope.clicks).toBe(1);
    }));
  });
});

describe('ngTap click fallback', function() {
  var element;

  beforeEach(module('ngMobile'));
  afterEach(function() {
    dealoc(element);
  });

  it('should treat a click as a tap on desktop', inject(function($rootScope, $compile) {
    element = $compile('<div ng-tap="tapped = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeFalsy();

    browserTrigger(element, 'click');
    expect($rootScope.tapped).toEqual(true);
  }));

  it('should pass event object', inject(function($rootScope, $compile) {
    element = $compile('<div ng-tap="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'click');
    expect($rootScope.event).toBeDefined();
  }));
});
