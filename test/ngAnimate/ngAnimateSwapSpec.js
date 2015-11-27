'use strict';

describe("ngAnimateSwap", function() {

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  var element;
  afterEach(function() {
    dealoc(element);
  });

  var $rootScope, $compile, $animate;
  beforeEach(inject(function(_$rootScope_, _$animate_, _$compile_) {
    $rootScope = _$rootScope_;
    $animate = _$animate_;
    $compile = _$compile_;

    $animate.enabled(false);
  }));


  it('should render a new container when the expression changes', inject(function() {
    element = $compile('<div><div ng-animate-swap="exp">{{ exp }}</div></div>')($rootScope);
    $rootScope.$digest();

    var first = element.find('div')[0];
    expect(first).toBeFalsy();

    $rootScope.exp = 'yes';
    $rootScope.$digest();

    var second = element.find('div')[0];
    expect(second.textContent).toBe('yes');

    $rootScope.exp = 'super';
    $rootScope.$digest();

    var third = element.find('div')[0];
    expect(third.textContent).toBe('super');
    expect(third).not.toEqual(second);
    expect(second.parentNode).toBeFalsy();
  }));

  it('should render a new container only when the expression property changes', inject(function() {
    element = $compile('<div><div ng-animate-swap="exp.prop">{{ exp.value }}</div></div>')($rootScope);
    $rootScope.exp = {
      prop: 'hello',
      value: 'world'
    };
    $rootScope.$digest();

    var one = element.find('div')[0];
    expect(one.textContent).toBe('world');

    $rootScope.exp.value = 'planet';
    $rootScope.$digest();

    var two = element.find('div')[0];
    expect(two.textContent).toBe('planet');
    expect(two).toBe(one);

    $rootScope.exp.prop = 'goodbye';
    $rootScope.$digest();

    var three = element.find('div')[0];
    expect(three.textContent).toBe('planet');
    expect(three).not.toBe(two);
  }));

  it('should watch the expression as a collection', inject(function() {
    element = $compile('<div><div ng-animate-swap="exp">{{ exp.a }} {{ exp.b }} {{ exp.c }}</div></div>')($rootScope);
    $rootScope.exp = {
      a: 1,
      b: 2
    };
    $rootScope.$digest();

    var one = element.find('div')[0];
    expect(one.textContent.trim()).toBe('1 2');

    $rootScope.exp.a++;
    $rootScope.$digest();

    var two = element.find('div')[0];
    expect(two.textContent.trim()).toBe('2 2');
    expect(two).not.toEqual(one);

    $rootScope.exp.c = 3;
    $rootScope.$digest();

    var three = element.find('div')[0];
    expect(three.textContent.trim()).toBe('2 2 3');
    expect(three).not.toEqual(two);

    $rootScope.exp = { c: 4 };
    $rootScope.$digest();

    var four = element.find('div')[0];
    expect(four.textContent.trim()).toBe('4');
    expect(four).not.toEqual(three);
  }));

  they('should consider $prop as a falsy value', [false, undefined, null], function(value) {
    inject(function() {
      element = $compile('<div><div ng-animate-swap="value">{{ value }}</div></div>')($rootScope);
      $rootScope.value = true;
      $rootScope.$digest();

      var one = element.find('div')[0];
      expect(one).toBeTruthy();

      $rootScope.value = value;
      $rootScope.$digest();

      var two = element.find('div')[0];
      expect(two).toBeFalsy();
    });
  });

  it('should consider "0" as a truthy value', inject(function() {
    element = $compile('<div><div ng-animate-swap="value">{{ value }}</div></div>')($rootScope);
    $rootScope.$digest();

    var one = element.find('div')[0];
    expect(one).toBeFalsy();

    $rootScope.value = 0;
    $rootScope.$digest();

    var two = element.find('div')[0];
    expect(two).toBeTruthy();
  }));


  describe("animations", function() {
    it('should trigger a leave animation followed by an enter animation upon swap',
      inject(function() {

      element = $compile('<div><div ng-animate-swap="exp">{{ exp }}</div></div>')($rootScope);
      $rootScope.exp = 1;
      $rootScope.$digest();

      var first = $animate.queue.shift();
      expect(first.event).toBe('enter');
      expect($animate.queue.length).toBe(0);

      $rootScope.exp = 2;
      $rootScope.$digest();

      var second = $animate.queue.shift();
      expect(second.event).toBe('leave');

      var third = $animate.queue.shift();
      expect(third.event).toBe('enter');
      expect($animate.queue.length).toBe(0);

      $rootScope.exp = false;
      $rootScope.$digest();

      var forth = $animate.queue.shift();
      expect(forth.event).toBe('leave');
      expect($animate.queue.length).toBe(0);
    }));
  });
});
