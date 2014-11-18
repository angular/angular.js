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

    it("should enter the element to the start of the parent container",
      inject(function($animate, $compile, $rootScope) {

      for (var i = 0; i < 5; i++) {
        element.append(jqLite('<div> ' + i + '</div>'));
      }

      var child = jqLite('<div>first</div>');
      $animate.enter(child, element);

      expect(element.text()).toEqual('first 0 1 2 3 4');
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

    it("should apply styles instantly to the element",
      inject(function($animate, $compile, $rootScope) {

      $animate.animate(element, { color: 'rgb(0, 0, 0)' });
      expect(element.css('color')).toBe('rgb(0, 0, 0)');

      $animate.animate(element, { color: 'rgb(255, 0, 0)' }, { color: 'rgb(0, 255, 0)' });
      expect(element.css('color')).toBe('rgb(0, 255, 0)');
    }));

    it("should still perform DOM operations even if animations are disabled (post-digest)", inject(function($animate, $rootScope) {
      $animate.enabled(false);
      expect(element).toBeShown();
      $animate.addClass(element, 'ng-hide');
      $rootScope.$digest();
      expect(element).toBeHidden();
    }));

    it("should run each method and return a promise", inject(function($animate, $document) {
      var element = jqLite('<div></div>');
      var move   = jqLite('<div></div>');
      var parent = jqLite($document[0].body);
      parent.append(move);

      expect($animate.enter(element, parent)).toBeAPromise();
      expect($animate.move(element, move)).toBeAPromise();
      expect($animate.addClass(element, 'on')).toBeAPromise();
      expect($animate.removeClass(element, 'off')).toBeAPromise();
      expect($animate.setClass(element, 'on', 'off')).toBeAPromise();
      expect($animate.leave(element)).toBeAPromise();
    }));

    it("should provide noop `enabled` and `cancel` methods", inject(function($animate) {
      expect($animate.enabled).toBe(angular.noop);
      expect($animate.enabled()).toBeUndefined();

      expect($animate.cancel).toBe(angular.noop);
      expect($animate.cancel()).toBeUndefined();
    }));

    it("should add and remove classes on SVG elements", inject(function($animate, $rootScope) {
      if (!window.SVGElement) return;
      var svg = jqLite('<svg><rect></rect></svg>');
      var rect = svg.children();
      $animate.enabled(false);
      expect(rect).toBeShown();
      $animate.addClass(rect, 'ng-hide');
      $rootScope.$digest();
      expect(rect).toBeHidden();
      $animate.removeClass(rect, 'ng-hide');
      $rootScope.$digest();
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

    it("should apply and retain inline styles on the element that is animated", inject(function($animate, $rootScope) {
      var element = jqLite('<div></div>');
      var parent = jqLite('<div></div>');
      var other = jqLite('<div></div>');
      parent.append(other);
      $animate.enabled(true);

      $animate.enter(element, parent, null, {
        to: { color: 'red' }
      });
      assertColor('red');

      $animate.move(element, null, other, {
        to: { color: 'yellow' }
      });
      assertColor('yellow');

      $animate.addClass(element, 'on', {
        to: { color: 'green' }
      });
      $rootScope.$digest();
      assertColor('green');

      $animate.setClass(element, 'off', 'on', {
        to: { color: 'black' }
      });
      $rootScope.$digest();
      assertColor('black');

      $animate.removeClass(element, 'off', {
        to: { color: 'blue' }
      });
      $rootScope.$digest();
      assertColor('blue');

      $animate.leave(element, {
        to: { color: 'yellow' }
      });
      $rootScope.$digest();
      assertColor('yellow');

      function assertColor(color) {
        expect(element[0].style.color).toBe(color);
      }
    }));

    it("should merge the from and to styles that are provided",
      inject(function($animate, $rootScope) {

      var element = jqLite('<div></div>');

      element.css('color', 'red');
      $animate.addClass(element, 'on', {
        from: { color: 'green' },
        to: { borderColor: 'purple' }
      });
      $rootScope.$digest();

      var style = element[0].style;
      expect(style.color).toBe('green');
      expect(style.borderColor).toBe('purple');
    }));
  });

  describe('CSS class DOM manipulation', function() {
    var element;
    var addClass;
    var removeClass;

    beforeEach(module(provideLog));

    afterEach(function() {
      dealoc(element);
    });

    function setupClassManipulationSpies() {
      inject(function($animate) {
        addClass = spyOn($animate, '$$addClassImmediately').andCallThrough();
        removeClass = spyOn($animate, '$$removeClassImmediately').andCallThrough();
      });
    }

    function setupClassManipulationLogger(log) {
      inject(function($animate) {
        var addClassImmediately = $animate.$$addClassImmediately;
        var removeClassImmediately = $animate.$$removeClassImmediately;
        addClass = spyOn($animate, '$$addClassImmediately').andCallFake(function(element, classes) {
          var names = classes;
          if (Object.prototype.toString.call(classes) === '[object Array]') names = classes.join(' ');
          log('addClass(' + names + ')');
          return addClassImmediately.call($animate, element, classes);
        });
        removeClass = spyOn($animate, '$$removeClassImmediately').andCallFake(function(element, classes) {
          var names = classes;
          if (Object.prototype.toString.call(classes) === '[object Array]') names = classes.join(' ');
          log('removeClass(' + names + ')');
          return removeClassImmediately.call($animate, element, classes);
        });
      });
    }

    it('should defer class manipulation until end of digest', inject(function($rootScope, $animate, log) {
      setupClassManipulationLogger(log);
      element = jqLite('<p>test</p>');

      $rootScope.$apply(function() {
        $animate.addClass(element, 'test-class1');
        expect(element).not.toHaveClass('test-class1');

        $animate.removeClass(element, 'test-class1');

        $animate.addClass(element, 'test-class2');
        expect(element).not.toHaveClass('test-class2');

        $animate.setClass(element, 'test-class3', 'test-class4');
        expect(element).not.toHaveClass('test-class3');
        expect(element).not.toHaveClass('test-class4');
        expect(log).toEqual([]);
      });

      expect(element).not.toHaveClass('test-class1');
      expect(element).not.toHaveClass('test-class4');
      expect(element).toHaveClass('test-class2');
      expect(element).toHaveClass('test-class3');
      expect(log).toEqual(['addClass(test-class2 test-class3)']);
      expect(addClass.callCount).toBe(1);
      expect(removeClass.callCount).toBe(0);
    }));


    it('should defer class manipulation until postDigest when outside of digest', inject(function($rootScope, $animate, log) {
      setupClassManipulationLogger(log);
      element = jqLite('<p class="test-class4">test</p>');

      $animate.addClass(element, 'test-class1');
      $animate.removeClass(element, 'test-class1');
      $animate.addClass(element, 'test-class2');
      $animate.setClass(element, 'test-class3', 'test-class4');

      expect(log).toEqual([]);
      $rootScope.$digest();


      expect(log).toEqual(['addClass(test-class2 test-class3)', 'removeClass(test-class4)']);
      expect(element).not.toHaveClass('test-class1');
      expect(element).toHaveClass('test-class2');
      expect(element).toHaveClass('test-class3');
      expect(addClass.callCount).toBe(1);
      expect(removeClass.callCount).toBe(1);
    }));


    it('should perform class manipulation in expected order at end of digest', inject(function($rootScope, $animate, log) {
      element = jqLite('<p class="test-class3">test</p>');

      setupClassManipulationLogger(log);

      $rootScope.$apply(function() {
        $animate.addClass(element, 'test-class1');
        $animate.addClass(element, 'test-class2');
        $animate.removeClass(element, 'test-class1');
        $animate.removeClass(element, 'test-class3');
        $animate.addClass(element, 'test-class3');
      });
      expect(log).toEqual(['addClass(test-class2)']);
    }));


    it('should return a promise which is resolved on a different turn', inject(function(log, $animate, $browser, $rootScope) {
      element = jqLite('<p class="test2">test</p>');

      $animate.addClass(element, 'test1').then(log.fn('addClass(test1)'));
      $animate.removeClass(element, 'test2').then(log.fn('removeClass(test2)'));

      $rootScope.$digest();
      expect(log).toEqual([]);
      $browser.defer.flush();
      expect(log).toEqual(['addClass(test1)', 'removeClass(test2)']);

      log.reset();
      element = jqLite('<p class="test4">test</p>');

      $rootScope.$apply(function() {
        $animate.addClass(element, 'test3').then(log.fn('addClass(test3)'));
        $animate.removeClass(element, 'test4').then(log.fn('removeClass(test4)'));
        expect(log).toEqual([]);
      });

      $browser.defer.flush();
      expect(log).toEqual(['addClass(test3)', 'removeClass(test4)']);
    }));


    it('should defer class manipulation until end of digest for SVG', inject(function($rootScope, $animate) {
      if (!window.SVGElement) return;
      setupClassManipulationSpies();
      element = jqLite('<svg><g></g></svg>');
      var target = element.children().eq(0);

      $rootScope.$apply(function() {
        $animate.addClass(target, 'test-class1');
        expect(target).not.toHaveClass('test-class1');

        $animate.removeClass(target, 'test-class1');

        $animate.addClass(target, 'test-class2');
        expect(target).not.toHaveClass('test-class2');

        $animate.setClass(target, 'test-class3', 'test-class4');
        expect(target).not.toHaveClass('test-class3');
        expect(target).not.toHaveClass('test-class4');
      });

      expect(target).not.toHaveClass('test-class1');
      expect(target).toHaveClass('test-class2');
      expect(addClass.callCount).toBe(1);
      expect(removeClass.callCount).toBe(0);
    }));


    it('should defer class manipulation until postDigest when outside of digest for SVG', inject(function($rootScope, $animate, log) {
      if (!window.SVGElement) return;
      setupClassManipulationLogger(log);
      element = jqLite('<svg><g class="test-class4"></g></svg>');
      var target = element.children().eq(0);

      $animate.addClass(target, 'test-class1');
      $animate.removeClass(target, 'test-class1');
      $animate.addClass(target, 'test-class2');
      $animate.setClass(target, 'test-class3', 'test-class4');

      expect(log).toEqual([]);
      $rootScope.$digest();

      expect(log).toEqual(['addClass(test-class2 test-class3)', 'removeClass(test-class4)']);
      expect(target).not.toHaveClass('test-class1');
      expect(target).toHaveClass('test-class2');
      expect(target).toHaveClass('test-class3');
      expect(addClass.callCount).toBe(1);
      expect(removeClass.callCount).toBe(1);
    }));


    it('should perform class manipulation in expected order at end of digest for SVG', inject(function($rootScope, $animate, log) {
      if (!window.SVGElement) return;
      element = jqLite('<svg><g class="test-class3"></g></svg>');
      var target = element.children().eq(0);

      setupClassManipulationLogger(log);

      $rootScope.$apply(function() {
        $animate.addClass(target, 'test-class1');
        $animate.addClass(target, 'test-class2');
        $animate.removeClass(target, 'test-class1');
        $animate.removeClass(target, 'test-class3');
        $animate.addClass(target, 'test-class3');
      });
      expect(log).toEqual(['addClass(test-class2)']);
    }));
  });
});
