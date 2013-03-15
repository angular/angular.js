'use strict';

describe("Animator", function() {

  var element;

  afterEach(function(){
    dealoc(element);
  });

  it("should properly use CSS transitions when no animation polyfill is assigned",function() {
    var timeouts = [];

    module(function($provide) {
      $provide.value('$window', extend(window, {
        setTimeout : function(fn, delay) {
          timeouts.push({
            fn: fn,
            delay: delay
          });
        }
      }));
    })

    inject(function($compile, $rootScope, $animation, $window, $sniffer) {
      var animationCntl = new Animator($animation, $window, $sniffer);

      element = $compile('<div></div>')($rootScope);
      var child = $compile('<div style="-webkit-transition:0.5s linear all">...</div>')($rootScope);
      animationCntl.set('enter', 'customEnter');
      animationCntl.animate('enter', child, element);

      expect(child.hasClass('ng-animate-custom-enter-setup')).toBe(true);

      expect(timeouts.length).toBe(1);
      expect(timeouts[0].delay).toBe(1);

      timeouts.pop().fn();
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(true);

      expect(timeouts.length).toBe(1);
      expect(timeouts[0].delay).toBe(500);

      timeouts.pop().fn();
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(false);
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(false);
    });
  })

  it("should properly use the animation polyfill if assigned and still assign css classes",function() {
    var timeouts = [];

    module(function($provide) {
      $provide.value('$window', extend(window, {
        setTimeout : function(fn, delay) {
          timeouts.push({
            fn: fn,
            delay: delay
          });
        }
      }));
    })

    inject(function($compile, $rootScope, $animation, $window, $sniffer) {
      var animationCntl = new Animator($animation, $window, $sniffer);

      element = $compile('<div></div>')($rootScope);
      var child = $compile('<div style="-webkit-transition:0.5s linear all">...</div>')($rootScope);
      animationCntl.set('enter', 'customEnter', function(element, done) {
        element.addClass('i-was-here');
        timeouts.push({
          fn : done,
          delay : 0
        });
      });
      animationCntl.animate('enter', child, element);

      expect(child.hasClass('ng-animate-custom-enter-setup')).toBe(true);

      timeouts.pop().fn();
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(true);

      timeouts.pop().fn();
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(false);
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(false);

      expect(child.hasClass('i-was-here')).toBe(true);
    });
  })

  describe("defaults", function() {
    var animationCntl, child, parent, after;
    beforeEach(inject(function($animation, $window, $sniffer, $compile, $rootScope) {
      animationCntl = new Animator($animation, $window, $sniffer);

      element = $compile('<div></div>')($rootScope);
      child = $compile('<div>one</div>')($rootScope);
    }));

    it("should not assign any css classes if there is no animator set", function() {
      animationCntl.animate('enter', child, element);
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(false);
      expect(child.hasClass('ng-animate-custom-enter-start')).toBe(false);
    })

    it("should enter child node into the DOM properly on enter", function() {
      animationCntl.animate('enter', child, element);
      expect(element.children()[0]).toBe(child[0]);
    })

    it("should remove the child node from the DOM properly on leave", function() {
      element.append(child);
      expect(element.children().length).toBe(1);
      animationCntl.animate('leave', child, element);
      expect(element.children().length).toBe(0);
    })

    it("should move the child node into the DOM properly on move", inject(function($compile, $rootScope) {
      var child2 = $compile('<div>two<div>')($rootScope);

      element.append(child);
      element.append(child2);

      var kid1 = child[0];
      var kid2 = child2[0];

      expect(element.children()[0]).toBe(kid1);
      expect(element.children()[1]).toBe(kid2);

      animationCntl.animate('move', child, element, child2);

      expect(element.children()[0]).toBe(kid2);
      expect(element.children()[1]).toBe(kid1);
    }))

    it("should properly show the node on show", inject(function($compile, $rootScope) {
      element.append(child);
      child.css('display','none');
      animationCntl.animate('show', child, element);
      expect(child.css('display')).toBe('block');
    }))

    it("should properly hide the node on hide", inject(function($compile, $rootScope) {
      element.append(child);
      child.css('display','block');
      animationCntl.animate('hide', child, element);
      expect(child.css('display')).toBe('none');
    }))
  });

});
