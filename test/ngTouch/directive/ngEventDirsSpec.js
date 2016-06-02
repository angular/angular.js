'use strict';

describe('ngMousedown (touch)', function() {
  var element;

  beforeEach(function() {
    module('ngTouch');
  });

  afterEach(function() {
    dealoc(element);
  });

  it('should pass event object on mousedown', inject(function($rootScope, $compile) {
    element = $compile('<div ng-mousedown="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'mousedown');
    expect($rootScope.event).toBeDefined();
  }));

  it('should pass event object on touchstart too', inject(function($rootScope, $compile) {
    element = $compile('<div ng-mousedown="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'touchstart');
    expect($rootScope.event).toBeDefined();
  }));
});


describe('ngMousemove (touch)', function() {
  var element;

  beforeEach(function() {
    module('ngTouch');
  });

  afterEach(function() {
    dealoc(element);
  });

  it('should pass event object on mousemove', inject(function($rootScope, $compile) {
    element = $compile('<div ng-mousemove="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'mousemove');
    expect($rootScope.event).toBeDefined();
  }));

  it('should pass event object on touchstart too', inject(function($rootScope, $compile) {
    element = $compile('<div ng-mousemove="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'mousemove');
    expect($rootScope.event).toBeDefined();
  }));
});

describe('ngMouseup (touch)', function() {
  var element;

  beforeEach(function() {
    module('ngTouch');
  });

  afterEach(function() {
    dealoc(element);
  });

  it('should pass event object on mouseup', inject(function($rootScope, $compile) {
    element = $compile('<div ng-mouseup="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'mouseup');
    expect($rootScope.event).toBeDefined();
  }));

  it('should pass event object on touchstart too', inject(function($rootScope, $compile) {
    element = $compile('<div ng-mouseup="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'mouseup');
    expect($rootScope.event).toBeDefined();
  }));
});
