'use strict';

describe('ngHold (mobile)', function() {
  var element;

  // TODO(braden): Once we have other touch-friendly browsers on CI, allow them here.
  // Currently Firefox and IE refuse to fire touch events.
  var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
  if (!chrome) {
    return;
  }


  beforeEach(function() {
    module('ngMobile');
  });

  afterEach(function() {
    dealoc(element);
  });


  it('should trigger hold if the timeout occurs and the user does not move', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();

    browserTrigger(element, 'touchstart');
    $timeout.flush();
    browserTrigger($document, 'touchend');
    expect($rootScope.held).toEqual(true);
  }));

  it('should not trigger hold if touchend comes before the timeout', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();

    browserTrigger(element, 'touchstart');
    browserTrigger($document, 'touchend');
    expect(function () {
      $timeout.flush();
    }).toThrow(new Error("No deferred tasks to be flushed"));

    expect($rootScope.held).toBeUndefined();
  }));

  it('should not trigger hold if the user breaks the move threshold', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchmove', [], 400, 400);
    expect(function () {
      $timeout.flush();
    }).toThrow(new Error("No deferred tasks to be flushed"));
    browserTrigger($document, 'touchend', [], 10, 10);

    expect($rootScope.held).toBeUndefined();
  }));

  it('should trigger hold on right click / context menu by default', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();
    browserTrigger(element, 'contextmenu', [], 0, 0, 2);  // Right mouse button selected
    expect($rootScope.held).toEqual(true);
  }));


  it('should not trigger hold on right click / context menu when requested', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true" accept-right-click="false"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();
    browserTrigger(element, 'contextmenu', [], 0, 0, 2);  // Right mouse button selected
    expect($rootScope.held).toBeUndefined();
  }));

});
