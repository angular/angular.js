'use strict';

describe('ngIf', function () {
  var $scope, $compile, element;

  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile('<div></div>')($scope);
  }));

  afterEach(function () {
    dealoc(element);
  });

  function makeIf(expr) {
    element.append($compile('<div class="my-class" ng-if="' + expr + '"><div>Hi</div></div>')($scope));
    $scope.$apply();
  }

  it('should immediately remove element if condition is false', function () {
    makeIf('false');
    expect(element.children().length).toBe(0);
  });

  it('should leave the element if condition is true', function () {
    makeIf('true');
    expect(element.children().length).toBe(1);
  });

  it('should create then remove the element if condition changes', function () {
    $scope.hello = true;
    makeIf('hello');
    expect(element.children().length).toBe(1);
    $scope.$apply('hello = false');
    expect(element.children().length).toBe(0);
  });

  it('should create a new scope', function () {
    $scope.$apply('value = true');
    element.append($compile(
      '<div ng-if="value"><span ng-init="value=false"></span></div>'
    )($scope));
    $scope.$apply();
    expect(element.children('div').length).toBe(1);
  });

  it('should play nice with other elements beside it', function () {
    $scope.values = [1, 2, 3, 4];
    element.append($compile(
      '<div ng-repeat="i in values"></div>' +
        '<div ng-if="values.length==4"></div>' +
        '<div ng-repeat="i in values"></div>'
    )($scope));
    $scope.$apply();
    expect(element.children().length).toBe(9);
    $scope.$apply('values.splice(0,1)');
    expect(element.children().length).toBe(6);
    $scope.$apply('values.push(1)');
    expect(element.children().length).toBe(9);
  });

  it('should restore the element to its compiled state', function() {
    $scope.value = true;
    makeIf('value');
    expect(element.children().length).toBe(1);
    jqLite(element.children()[0]).removeClass('my-class');
    expect(element.children()[0].className).not.toContain('my-class');
    $scope.$apply('value = false');
    expect(element.children().length).toBe(0);
    $scope.$apply('value = true');
    expect(element.children().length).toBe(1);
    expect(element.children()[0].className).toContain('my-class');
  });

});

describe('ngIf animations', function () {
  var body, element, $rootElement;

  function html(html) {
    $rootElement.html(html);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module('mock.animate'));

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function(){
    dealoc(body);
    dealoc(element);
  });

  beforeEach(module(function($animateProvider, $provide) {
    return function($animate) {
      $animate.enabled(true);
    };
  }));

  it('should fire off the enter animation',
    inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div>' +
          '<div ng-if="value"><div>Hi</div></div>' +
        '</div>'
      ))($scope);

      $rootScope.$digest();
      $scope.$apply('value = true');

      item = $animate.flushNext('enter').element;
      expect(item.text()).toBe('Hi');

      expect(element.children().length).toBe(1);
  }));

  it('should fire off the leave animation',
    inject(function ($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div>' +
          '<div ng-if="value"><div>Hi</div></div>' +
        '</div>'
      ))($scope);
      $scope.$apply('value = true');

      item = $animate.flushNext('enter').element;
      expect(item.text()).toBe('Hi');

      $scope.$apply('value = false');
      expect(element.children().length).toBe(1);

      item = $animate.flushNext('leave').element;
      expect(item.text()).toBe('Hi');

      expect(element.children().length).toBe(0);
  }));

});
