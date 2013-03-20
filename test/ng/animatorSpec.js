'use strict';

describe("$animator", function() {

  var element;

  afterEach(function(){
    dealoc(element);
  });

  describe("when not defined", function() {
    var child, after, window, animator;

    beforeEach(function() {
      module(function($animationProvider, $provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
      })
      inject(function($animator, $compile, $rootScope) {
        animator = $animator({});
        element = $compile('<div></div>')($rootScope);
      })
    });

    it("should properly animate the enter animation event", inject(function($animator, $compile, $rootScope) {
      var child = $compile('<div></div>')($rootScope);
      expect(element.contents().length).toBe(0);
      animator.enter(child, element);
      expect(element.contents().length).toBe(1);
    }));

    it("should properly animate the leave animation event", inject(function($animator, $compile, $rootScope) {
      var child = $compile('<div></div>')($rootScope);
      element.append(child);
      expect(element.contents().length).toBe(1);
      animator.leave(child, element);
      expect(element.contents().length).toBe(0);
    }));

    it("should properly animate the move animation event", inject(function($animator, $compile, $rootScope) {
      var child1 = $compile('<div>1</div>')($rootScope);
      var child2 = $compile('<div>2</div>')($rootScope);
      element.append(child1);
      element.append(child2);
      expect(element.text()).toBe('12');
      animator.move(child1, element, child2);
      expect(element.text()).toBe('21');
    }));

    it("should properly animate the show animation event", inject(function($animator, $compile, $rootScope) {
      element.css('display','none');
      expect(element.css('display')).toBe('none');
      animator.show(element);
      expect(element.css('display')).toBe('block');
    }));

    it("should properly animate the hide animation event", inject(function($animator, $compile, $rootScope) {
      element.css('display','block');
      expect(element.css('display')).toBe('block');
      animator.hide(element);
      expect(element.css('display')).toBe('none');
    }));

    it("should silently run the custom animation", inject(function($animator, $compile, $rootScope) {
      animator.animate('custom', element);
    }));

  });

  describe("when defined", function() {

    var child, after, window, animator;

    beforeEach(function() {
      module(function($animationProvider, $provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
        $animationProvider.register('custom', function() {
          return function(element, done) {
            done();
          }
        });
      })
      inject(function($animator, $compile, $rootScope) {
        element = $compile('<div></div>')($rootScope);
        child   = $compile('<div></div>')($rootScope);
        after   = $compile('<div></div>')($rootScope);
      })
    });

    it("should properly animate the enter animation event", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'enter: custom'
      });
      expect(element.contents().length).toBe(0);
      animator.enter(child, element);
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(0).process();
    }));

    it("should properly animate the leave animation event", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'leave: custom'
      });
      element.append(child);
      expect(element.contents().length).toBe(1);
      animator.leave(child, element);
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(0).process();
      expect(element.contents().length).toBe(0);
    }));

    it("should properly animate the move animation event", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'move: custom'
      });
      var child1 = $compile('<div>1</div>')($rootScope);
      var child2 = $compile('<div>2</div>')($rootScope);
      element.append(child1);
      element.append(child2);
      expect(element.text()).toBe('12');
      animator.move(child1, element, child2);
      expect(element.text()).toBe('21');
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(0).process();
    }));

    it("should properly animate the show animation event", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'show: custom'
      });
      element.css('display','none');
      expect(element.css('display')).toBe('none');
      animator.show(element);
      expect(element.css('display')).toBe('block');
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(0).process();
      expect(element.css('display')).toBe('block');
    }));

    it("should properly animate the hide animation event", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'hide: custom'
      });
      element.css('display','block');
      expect(element.css('display')).toBe('block');
      animator.hide(element);
      expect(element.css('display')).toBe('block');
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(0).process();
      expect(element.css('display')).toBe('none');
    }));

    it("should silently run the custom animation", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'custom: custom'
      });
      animator.animate('custom', element);
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(0).process();
    }));

    it("should assign the ngAnimate string to all events if a string is given", inject(function($animator, $compile, $rootScope) {
      animator = $animator({
        ngAnimate : 'custom'
      });

      //enter
      animator.enter(child, element);
      expect(child.attr('class')).toContain('custom-enter-setup');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-enter-start');
      window.setTimeout.expect(0).process();

      //leave
      element.append(after);
      animator.move(child, element, after);
      expect(child.attr('class')).toContain('custom-move-setup');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-move-start');
      window.setTimeout.expect(0).process();

      //hide
      animator.hide(child);
      expect(child.attr('class')).toContain('custom-hide-setup');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-hide-start');
      window.setTimeout.expect(0).process();

      //show
      animator.show(child);
      expect(child.attr('class')).toContain('custom-show-setup');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-show-start');
      window.setTimeout.expect(0).process();

      //leave
      animator.leave(child);
      expect(child.attr('class')).toContain('custom-leave-setup');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-leave-start');
      window.setTimeout.expect(0).process();

      //custom
      animator.animate('custom', child);
      expect(child.attr('class')).toContain('custom-setup');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-start');
      window.setTimeout.expect(0).process();
    }));
  });

  it("should fire off any custom animations", function() {

    var window;

    module(function($animationProvider, $provide) {
      $provide.value('$window', window = angular.mock.createMockWindow());
      $animationProvider.register('custom', function() {
        return {
          setup : function() { },
          start : function(element, done) {
            element.addClass('i-was-here');
            done();
          }
        }
      })
    });
      
    inject(function($animator, $compile, $rootScope) {
      var animator = $animator({ ngAnimate: 'customAni: custom' });
      element = $compile('<div></div>')($rootScope);
      animator.animate('customAni', element);
      window.setTimeout.expect(1).process();
      expect(element.hasClass('i-was-here')).toBe(true);
    });

  });

});
