'use strict';

describe('ngVisible / ngInvisible', function() {
  var $scope, $compile, element;

  function expectVisibility(exprs, ngVisibleOrNgInvisible, shownOrHidden) {
    element = $compile('<div></div>')($scope);
    forEach(exprs, function(expr) {
      var childElem = $compile('<div ' + ngVisibleOrNgInvisible + '="' + expr + '"></div>')($scope);
      element.append(childElem);
      $scope.$digest();
      expect(childElem)[shownOrHidden === 'shown' ? 'toBeVisible' : 'toBeInvisible']();
    });
  }

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  afterEach(function() {
    dealoc(element);
  });

  describe('ngVisible', function() {
    function expectShown() {
      expectVisibility(arguments, 'ng-visible', 'shown');
    }

    function expectHidden() {
      expectVisibility(arguments, 'ng-visible', 'hidden');
    }

    it('should show and hide an element', function() {
      element = jqLite('<div ng-visible="exp"></div>');
      element = $compile(element)($scope);
      $scope.$digest();
      expect(element).toBeInvisible();
      $scope.exp = true;
      $scope.$digest();
      expect(element).toBeVisible();
    });

    // https://github.com/angular/angular.js/issues/5414
    it('should show if the expression is a function with a no arguments', function() {
      element = jqLite('<div ng-visible="exp"></div>');
      element = $compile(element)($scope);
      $scope.exp = function() {};
      $scope.$digest();
      expect(element).toBeVisible();
    });

    it('should make hidden element visible', function() {
      element = jqLite('<div class="ng-invisible" ng-visible="exp"></div>');
      element = $compile(element)($scope);
      expect(element).toBeInvisible();
      $scope.exp = true;
      $scope.$digest();
      expect(element).toBeVisible();
    });

    it('should hide the element if condition is falsy', function() {
      expectHidden('false', 'undefined', 'null', 'NaN', '\'\'', '0');
    });

    it('should show the element if condition is a non-empty string', function() {
      expectShown('\'f\'', '\'0\'', '\'false\'', '\'no\'', '\'n\'', '\'[]\'');
    });

    it('should show the element if condition is an object', function() {
      expectShown('[]', '{}');
    });
  });

  describe('ngInvisible', function() {
    function expectShown() {
      expectVisibility(arguments, 'ng-invisible', 'shown');
    }

    function expectHidden() {
      expectVisibility(arguments, 'ng-invisible', 'hidden');
    }

    it('should hide an element', function() {
      element = jqLite('<div ng-invisible="exp"></div>');
      element = $compile(element)($scope);
      expect(element).toBeVisible();
      $scope.exp = true;
      $scope.$digest();
      expect(element).toBeInvisible();
    });

    it('should show the element if condition is falsy', function() {
      expectShown('false', 'undefined', 'null', 'NaN', '\'\'', '0');
    });

    it('should hide the element if condition is a non-empty string', function() {
      expectHidden('\'f\'', '\'0\'', '\'false\'', '\'no\'', '\'n\'', '\'[]\'');
    });

    it('should hide the element if condition is an object', function() {
      expectHidden('[]', '{}');
    });
  });
});

describe('ngVisible / ngInvisible animations', function() {
  var body, element, $rootElement;

  function html(content) {
    body.append($rootElement);
    $rootElement.html(content);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(function() {
    // we need to run animation on attached elements;
    body = jqLite(document.body);
  });

  afterEach(function() {
    dealoc(body);
    dealoc(element);
    body.removeAttr('ng-animation-running');
  });

  beforeEach(module('ngAnimateMock'));

  beforeEach(module(function($animateProvider, $provide) {
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
    };
  }));

  describe('ngVisible', function() {
    it('should fire off the $animate.show and $animate.hide animation', inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      $scope.on = true;
      element = $compile(html(
        '<div ng-visible="on">data</div>'
      ))($scope);
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('removeClass');
      expect(item.element.text()).toBe('data');
      expect(item.element).toBeVisible();

      $scope.on = false;
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('addClass');
      expect(item.element.text()).toBe('data');
      expect(item.element).toBeInvisible();
    }));

    it('should apply the temporary `.ng-invisible-animate` class to the element',
      inject(function($compile, $rootScope, $animate) {

      var item;
      var $scope = $rootScope.$new();
      $scope.on = false;
      element = $compile(html(
        '<div class="show-hide" ng-visible="on">data</div>'
      ))($scope);
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toEqual('addClass');
      expect(item.options.tempClasses).toEqual('ng-invisible-animate');

      $scope.on = true;
      $scope.$digest();
      item = $animate.queue.shift();
      expect(item.event).toEqual('removeClass');
      expect(item.options.tempClasses).toEqual('ng-invisible-animate');
    }));
  });

  describe('ngInvisible', function() {
    it('should fire off the $animate.show and $animate.hide animation', inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      $scope.off = true;
      element = $compile(html(
          '<div ng-invisible="off">datum</div>'
      ))($scope);
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('addClass');
      expect(item.element.text()).toBe('datum');
      expect(item.element).toBeInvisible();

      $scope.off = false;
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('removeClass');
      expect(item.element.text()).toBe('datum');
      expect(item.element).toBeVisible();
    }));

    it('should apply the temporary `.ng-invisible-animate` class to the element',
      inject(function($compile, $rootScope, $animate) {

      var item;
      var $scope = $rootScope.$new();
      $scope.on = false;
      element = $compile(html(
        '<div class="show-hide" ng-invisible="on">data</div>'
      ))($scope);
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toEqual('removeClass');
      expect(item.options.tempClasses).toEqual('ng-invisible-animate');

      $scope.on = true;
      $scope.$digest();
      item = $animate.queue.shift();
      expect(item.event).toEqual('addClass');
      expect(item.options.tempClasses).toEqual('ng-invisible-animate');
    }));
  });
});
