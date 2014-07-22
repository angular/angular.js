'use strict';

describe('ngClick', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });

  it('should get called on a click', inject(function($rootScope, $compile) {
    element = $compile('<div ng-click="clicked = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.clicked).toBeFalsy();

    browserTrigger(element, 'click');
    expect($rootScope.clicked).toEqual(true);
  }));

  it('should pass event object', inject(function($rootScope, $compile) {
    element = $compile('<div ng-click="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'click');
    expect($rootScope.event).toBeDefined();
  }));

  it('should abort apply if abort argument is invoked', inject(function($rootScope, $compile) {
    element = $compile('<div ng-click="a = 1; $abortApply()">{{a}}</div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'click');
    expect(element.text()).toBe('');
  }));
});
