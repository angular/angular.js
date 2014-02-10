'use strict';

describe('ngShow / ngHide', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });

  describe('ngShow', function() {
    it('should show and hide an element', inject(function($rootScope, $compile) {
      element = jqLite('<div ng-show="exp"></div>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      expect(element).toBeHidden();
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(element).toBeShown();
    }));


    // https://github.com/angular/angular.js/issues/5414
    it('should show if the expression is a function with a no arguments', inject(function($rootScope, $compile) {
      element = jqLite('<div ng-show="exp"></div>');
      element = $compile(element)($rootScope);
      $rootScope.exp = function(){};
      $rootScope.$digest();
      expect(element).toBeShown();
    }));


    it('should make hidden element visible', inject(function($rootScope, $compile) {
      element = jqLite('<div class="ng-hide" ng-show="exp"></div>');
      element = $compile(element)($rootScope);
      expect(element).toBeHidden();
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(element).toBeShown();
    }));
  });

  describe('ngHide', function() {
    it('should hide an element', inject(function($rootScope, $compile) {
      element = jqLite('<div ng-hide="exp"></div>');
      element = $compile(element)($rootScope);
      expect(element).toBeShown();
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(element).toBeHidden();
    }));
  });
});

describe('ngShow / ngHide animations', function() {
  var body, element, $rootElement;

  function html(html) {
    body.append($rootElement);
    $rootElement.html(html);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(function() {
    // we need to run animation on attached elements;
    body = jqLite(document.body);
  });

  afterEach(function(){
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

  describe('ngShow', function() {
    it('should fire off the $animate.show and $animate.hide animation', inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      $scope.on = true;
      element = $compile(html(
        '<div ng-show="on">data</div>'
      ))($scope);
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('removeClass');
      expect(item.element.text()).toBe('data');
      expect(item.element).toBeShown();

      $scope.on = false;
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('addClass');
      expect(item.element.text()).toBe('data');
      expect(item.element).toBeHidden();
    }));
  });

  describe('ngHide', function() {
    it('should fire off the $animate.show and $animate.hide animation', inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      $scope.off = true;
      element = $compile(html(
          '<div ng-hide="off">datum</div>'
      ))($scope);
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('addClass');
      expect(item.element.text()).toBe('datum');
      expect(item.element).toBeHidden();

      $scope.off = false;
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('removeClass');
      expect(item.element.text()).toBe('datum');
      expect(item.element).toBeShown();
    }));
  });
});
