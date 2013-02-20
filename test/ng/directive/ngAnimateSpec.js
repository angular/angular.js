'use strict';

describe('ngAnimate', function() {

  var element, $compile, scope, animation;
  var animationProvider;

  beforeEach(module(function($animationProvider) {
    animationProvider = $animationProvider;

    return function(_$compile_, $rootScope, $animation) {
      $compile = _$compile_;
      scope = $rootScope.$new();
      animation = $animation;
    };
  }));
  beforeEach(inject());

  afterEach(function(){
    dealoc(element);
  });

  it("should not throw an error when no defaults are provided", function() {
    var fn1 = function() {
      var html = '<div ng-animate></div>';
      element = $compile(html)(scope);
      dealoc(element);
    };
    expect(fn1).not.toThrow();

    var fn2 = function() {
      var html = '<div ng-animate=""></div>';
      element = $compile(html)(scope);
      dealoc(element);
    };
    expect(fn2).not.toThrow();
  });

  it("should throw an error when any of the animators are not defined", function() {
    var fn1 = function() {
      element = jqLite('<div ng-animate="enter: missing1"></div>');
      $compile(element)(scope);
    };
    expect(fn1).toThrow();
    dealoc(element);

    var fn2 = function() {
      element = jqLite('<div ng-animate="leave: missing2"></div>');
      $compile(element)(scope);
    };
    expect(fn2).toThrow();
    dealoc(element);

    var fn3 = function() {
      element = jqLite('<div ng-animate="move: missing3"></div>');
      $compile(element)(scope);
    };
    expect(fn3).toThrow();
    dealoc(element);

    var fn4 = function() {
      element = jqLite('<div ng-animate="enter: noop-enter; leave: missing4"></div>');
      $compile(element)(scope);
    };
    expect(fn4).toThrow();
    dealoc(element);
  });

  describe("custom animations", function() {

    it("should not throw an error when a custom animation is already defined", function() {
      animationProvider.register('custom-animation', function() {
        return function() {};
      });

      var fn1 = function() {
        var html = '<div ng-animate="enter: custom-animation"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn1).not.toThrow();

      var fn2 = function() {
        var html = '<div ng-animate="enter: customAnimation"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn2).not.toThrow();
    });

  });

  describe("noop animations", function() {
    it("should have an enter animation defined", function() {
      var fn1 = function() {
        var html = '<div ng-animate="enter: noop-enter"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn1).not.toThrow();

      var fn2 = function() {
        var html = '<div ng-animate="enter: noopEnter"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn2).not.toThrow();
    });

    it("should have a leave animation defined", function() {
      var fn1 = function() {
        element = jqLite('<div><div ng-animate="enter: noop-leave"></div></div>');
        $compile(element)(scope);
        dealoc(element);
      };
      expect(fn1).not.toThrow();

      var fn2 = function() {
        var html = '<div ng-animate="enter: noopLeave"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn2).not.toThrow();
    });

    it("should have a move animation defined", function() {
      var fn1 = function() {
        var html = '<div ng-animate="enter: noop-move"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn1).not.toThrow();

      var fn2 = function() {
        var html = '<div ng-animate="enter: noopMove"></div>';
        element = $compile(html)(scope);
        dealoc(element);
      };
      expect(fn2).not.toThrow();
    });
  });

  describe("ngRepeat", function() {

    describe("with noop animations", function() {
      beforeEach(function() {
        scope.items = [1,2,3];
        var html = '<div><div ng-repeat="item in items" ng-animate></div></div>';
        element = $compile(html)(scope);
        scope.$digest();
      });

      it("should have entered the values properly", function() {
        expect(element.children().length).toBe(3);
      });

      it("should perform an enter animation properly", function() {
        scope.items.push(4);
        scope.$digest();
        expect(element.children().length).toBe(4);
      });

      it("should perform a leave animation properly", function() {
        scope.items = [1,2];
        scope.$digest();
        expect(element.children().length).toBe(2);
      });

      it("should perform a move animation properly", function() {
        scope.items = [3,2,1];
        scope.$digest();
        expect(element.children().length).toBe(3);
      });
    });

    describe("with no ngAnimate directive", function() {
      beforeEach(function() {
        scope.items = [1,2,3,4];
        var html = '<div><div ng-repeat="item in items"></div></div>';
        element = $compile(html)(scope);
        scope.$digest();
      });

      it("should have entered the values properly", function() {
        expect(element.children().length).toBe(4);
      });

      it("should perform an enter animation properly", function() {
        scope.items.push(5);
        scope.$digest();
        expect(element.children().length).toBe(5);
      });

      it("should perform a leave animation properly", function() {
        scope.items = [1,2,3];
        scope.$digest();
        expect(element.children().length).toBe(3);
      });

      it("should perform a move animation properly", function() {
        scope.items = [4,3,2,1];
        scope.$digest();
        expect(element.children().length).toBe(4);
      });
    });

  });

});
