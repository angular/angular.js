'use strict';

describe("$animate", function() {

  describe("without animation", function() {
    var element, $rootElement;

    beforeEach(module(function() {
      return function($compile, _$rootElement_, $rootScope) {
        element = $compile('<div></div>')($rootScope);
        $rootElement = _$rootElement_;
      };
    }));

    it("should add element at the start of enter animation", inject(function($animate, $compile, $rootScope) {
      var child = $compile('<div></div>')($rootScope);
      expect(element.contents().length).toBe(0);
      $animate.enter(child, element);
      expect(element.contents().length).toBe(1);
    }));

    it("should remove the element at the end of leave animation", inject(function($animate, $compile, $rootScope) {
      var child = $compile('<div></div>')($rootScope);
      element.append(child);
      expect(element.contents().length).toBe(1);
      $animate.leave(child);
      expect(element.contents().length).toBe(0);
    }));

    it("should reorder the move animation", inject(function($animate, $compile, $rootScope) {
      var child1 = $compile('<div>1</div>')($rootScope);
      var child2 = $compile('<div>2</div>')($rootScope);
      element.append(child1);
      element.append(child2);
      expect(element.text()).toBe('12');
      $animate.move(child1, element, child2);
      expect(element.text()).toBe('21');
    }));

    it("should still perform DOM operations even if animations are disabled", inject(function($animate) {
      $animate.enabled(false);
      expect(element).toBeShown();
      $animate.addClass(element, 'ng-hide');
      expect(element).toBeHidden();
    }));

    it("should add and remove classes on SVG elements", inject(function($animate) {
      if (!window.SVGElement) return;
      var svg = jqLite('<svg><rect></rect></svg>');
      var rect = svg.children();
      $animate.enabled(false);
      expect(rect).toBeShown();
      $animate.addClass(rect, 'ng-hide');
      expect(rect).toBeHidden();
      $animate.removeClass(rect, 'ng-hide');
      expect(rect).not.toBeHidden();
    }));

    it("should throw error on wrong selector", function() {
      module(function($animateProvider) {
        expect(function() {
          $animateProvider.register('abc', null);
        }).toThrowMinErr("$animate", "notcsel", "Expecting class selector starting with '.' got 'abc'.");
      });
      inject();
    });
  });
});
