describe("$animate", function() {

  describe("without animation", function() {
    var window;

    beforeEach(inject(function($compile, _$rootElement_, $rootScope) {
      element = $compile('<div></div>')($rootScope);
      $rootElement = _$rootElement_;
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

    it("should animate the show animation event", inject(function($animate) {
      element.addClass('ng-hide');
      $animate.show(element);
      expect(element).toBeShown();
    }));

    it("should animate the hide animation event", inject(function($animate) {
      expect(element).toBeShown();
      $animate.hide(element);
      expect(element).toBeHidden();
    }));

    it("should still perform DOM operations even if animations are disabled", inject(function($animate) {
      $animate.enabled(false);
      expect(element).toBeShown();
      $animate.hide(element);
      expect(element).toBeHidden();
    }));
  });
});
