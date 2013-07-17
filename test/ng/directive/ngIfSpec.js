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
    element.append($compile('<div id="testElement" class="my-class" ng-if="' + expr + '"><div>Hi</div></div>')($scope));
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

  it('should still have the directive element attached to the DOM in the $destroy handler', function() {
    $scope.value = true;
    makeIf('value');
    expect(element.children().length).toBe(1);
    // Attach a $destroy handler to the test element that will be removed
    var destroyHandler = jasmine.createSpy('$destroy handler').andCallFake(function() {
      expect(element.children().length).toBe(1);
    });
    var ifScope = element.children().scope();
    ifScope.$on('$destroy', destroyHandler);
    $scope.$apply('value = false');
    expect(element.children().length).toBe(0);
    expect(destroyHandler).toHaveBeenCalled();
  });

});

describe('ngIf ngAnimate', function () {
  var vendorPrefix, window;
  var body, element;

  function html(html) {
    body.html(html);
    element = body.children().eq(0);
    return element;
  }

  beforeEach(function() {
    // we need to run animation on attached elements;
    body = jqLite(document.body);
  });

  afterEach(function(){
    dealoc(body);
    dealoc(element);
  });

  beforeEach(module(function($animationProvider, $provide) {
    $provide.value('$window', window = angular.mock.createMockWindow());
    return function($sniffer, $animator) {
      vendorPrefix = '-' + $sniffer.vendorPrefix + '-';
      $animator.enabled(true);
    };
  }));

  it('should fire off the enter animation + add and remove the css classes',
    inject(function($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(html(
        '<div>' +
          '<div ng-if="value" style="' + style + '" ng-animate="{enter: \'custom-enter\', leave: \'custom-leave\'}"><div>Hi</div></div>' +
        '</div>'
      ))($scope);

      $rootScope.$digest();
      $scope.$apply('value = true');


      expect(element.children().length).toBe(1);
      var first = element.children()[0];

      if ($sniffer.transitions) {
        expect(first.className).toContain('custom-enter');
        window.setTimeout.expect(1).process();
        expect(first.className).toContain('custom-enter-active');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(first.className).not.toContain('custom-enter');
      expect(first.className).not.toContain('custom-enter-active');
  }));

  it('should fire off the leave animation + add and remove the css classes',
    inject(function ($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(html(
        '<div>' +
          '<div ng-if="value" style="' + style + '" ng-animate="{enter: \'custom-enter\', leave: \'custom-leave\'}"><div>Hi</div></div>' +
        '</div>'
      ))($scope);
      $scope.$apply('value = true');

      expect(element.children().length).toBe(1);
      var first = element.children()[0];

      if ($sniffer.transitions) {
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      $scope.$apply('value = false');
      expect(element.children().length).toBe($sniffer.transitions ? 1 : 0);

      if ($sniffer.transitions) {
        expect(first.className).toContain('custom-leave');
        window.setTimeout.expect(1).process();
        expect(first.className).toContain('custom-leave-active');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(element.children().length).toBe(0);
  }));

  it('should catch and use the correct duration for animation',
    inject(function ($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 0.5s linear all';
      element = $compile(html(
        '<div>' +
          '<div ng-if="value" style="' + style + '" ng-animate="{enter: \'custom-enter\', leave: \'custom-leave\'}"><div>Hi</div></div>' +
        '</div>'
      ))($scope);
      $scope.$apply('value = true');

      if ($sniffer.transitions) {
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(500).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }
  }));

});
