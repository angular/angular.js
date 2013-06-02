'use strict';

describe("$animator", function() {

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
  });

  describe("enable / disable", function() {

    beforeEach(function() {
      module(function($animationProvider, $provide) {
        $provide.value('$window', angular.mock.createMockWindow());
      });
    });

    it("should disable and enable the animations", function() {
      var initialState = null;
      var animator;

      angular.bootstrap(body, [function() {
        return function($animator) {
          animator = $animator;
          initialState = $animator.enabled();
        }
      }]);

      expect(initialState).toBe(false);

      expect(animator.enabled()).toBe(true);

      expect(animator.enabled(0)).toBe(false);
      expect(animator.enabled()).toBe(false);

      expect(animator.enabled(1)).toBe(true);
      expect(animator.enabled()).toBe(true);
    });

  });

  describe("without animation", function() {
    var window, animator;

    beforeEach(function() {
      module(function($animationProvider, $provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
      })
      inject(function($animator, $compile, $rootScope, _$rootElement_) {
        animator = $animator($rootScope, {});
        element = $compile('<div></div>')($rootScope);
        $rootElement = _$rootElement_;
      })
    });

    it("should add element at the start of enter animation", inject(function($animator, $compile, $rootScope) {
      var child = $compile('<div></div>')($rootScope);
      expect(element.contents().length).toBe(0);
      animator.enter(child, element);
      expect(element.contents().length).toBe(1);
    }));

    it("should remove the element at the end of leave animation", inject(function($animator, $compile, $rootScope) {
      var child = $compile('<div></div>')($rootScope);
      element.append(child);
      expect(element.contents().length).toBe(1);
      animator.leave(child, element);
      expect(element.contents().length).toBe(0);
    }));

    it("should reorder the move animation", inject(function($animator, $compile, $rootScope) {
      var child1 = $compile('<div>1</div>')($rootScope);
      var child2 = $compile('<div>2</div>')($rootScope);
      element.append(child1);
      element.append(child2);
      expect(element.text()).toBe('12');
      animator.move(child1, element, child2);
      expect(element.text()).toBe('21');
    }));

    it("should animate the show animation event", inject(function() {
      element.css('display','none');
      expect(element.css('display')).toBe('none');
      animator.show(element);
      expect(element[0].style.display).toBe('');
    }));

    it("should animate the hide animation event", inject(function() {
      element.css('display','block');
      expect(element.css('display')).toBe('block');
      animator.hide(element);
      expect(element.css('display')).toBe('none');
    }));

    it("should still perform DOM operations even if animations are disabled", inject(function($animator) {
      $animator.enabled(false);
      element.css('display','block');
      expect(element.css('display')).toBe('block');
      animator.hide(element);
      expect(element.css('display')).toBe('none');
    }));
  });

  describe("with polyfill", function() {

    var child, after, window, animator;

    beforeEach(function() {
      module(function($animationProvider, $provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
        $animationProvider.register('custom', function() {
          return {
            start: function(element, done) {
              done();
            }
          }
        });
       $animationProvider.register('custom-delay', function() {
          return {
            start: function(element, done) {
              window.setTimeout(done, 2000);
            },
            cancel : function(element) {
              element.addClass('animation-cancelled');
            }
          }
        });
       $animationProvider.register('setup-memo', function() {
          return {
            setup: function(element) {
              return "memento";
            },
            start: function(element, done, memento) {
              element.text(memento);
              done();
            }
          }
        });
      })
      inject(function($animator, $compile, $rootScope, $rootElement) {
        element = $compile('<div></div>')($rootScope);
        child   = $compile('<div></div>')($rootScope);
        after   = $compile('<div></div>')($rootScope);
        $rootElement.append(element);
      });
    })

    it("should animate the enter animation event", inject(function($animator, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{enter: \'custom\'}'
      });

      expect(element.contents().length).toBe(0);
      animator.enter(child, element);
      window.setTimeout.expect(1).process();
    }));

    it("should animate the leave animation event", inject(function($animator, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{leave: \'custom\'}'
      });

      element.append(child);
      expect(element.contents().length).toBe(1);
      animator.leave(child, element);
      window.setTimeout.expect(1).process();
      expect(element.contents().length).toBe(0);
    }));

    it("should animate the move animation event", inject(function($animator, $compile, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{move: \'custom\'}'
      });
      $rootScope.$digest();
      var child1 = $compile('<div>1</div>')($rootScope);
      var child2 = $compile('<div>2</div>')($rootScope);
      element.append(child1);
      element.append(child2);
      expect(element.text()).toBe('12');
      animator.move(child1, element, child2);
      expect(element.text()).toBe('21');
      window.setTimeout.expect(1).process();
    }));

    it("should animate the show animation event", inject(function($animator, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{show: \'custom\'}'
      });
      $rootScope.$digest();
      element.css('display','none');
      expect(element.css('display')).toBe('none');
      animator.show(element);
      expect(element[0].style.display).toBe('');
      window.setTimeout.expect(1).process();
      expect(element[0].style.display).toBe('');
    }));

    it("should animate the hide animation event", inject(function($animator, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{hide: \'custom\'}'
      });
      $rootScope.$digest();
      element.css('display','block');
      expect(element.css('display')).toBe('block');
      animator.hide(element);
      expect(element.css('display')).toBe('block');
      window.setTimeout.expect(1).process();
      expect(element.css('display')).toBe('none');
    }));

    it("should assign the ngAnimate string to all events if a string is given",
        inject(function($animator, $sniffer, $rootScope) {
      $animator.enabled(true);
      if (!$sniffer.transitions) return;
      animator = $animator($rootScope, {
        ngAnimate : '"custom"'
      });

      $rootScope.$digest();

      //enter
      animator.enter(child, element);
      expect(child.attr('class')).toContain('custom-enter');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-enter-active');
      window.setTimeout.expect(0).process();

      //leave
      element.append(after);
      animator.move(child, element, after);
      expect(child.attr('class')).toContain('custom-move');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-move-active');
      window.setTimeout.expect(0).process();

      //hide
      animator.hide(child);
      expect(child.attr('class')).toContain('custom-hide');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-hide-active');
      window.setTimeout.expect(0).process();

      //show
      animator.show(child);
      expect(child.attr('class')).toContain('custom-show');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-show-active');
      window.setTimeout.expect(0).process();

      //leave
      animator.leave(child);
      expect(child.attr('class')).toContain('custom-leave');
      window.setTimeout.expect(1).process();
      expect(child.attr('class')).toContain('custom-leave-active');
      window.setTimeout.expect(0).process();
    }));

    it("should run polyfillSetup and return the memento", inject(function($animator, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{show: \'setup-memo\'}'
      });
      $rootScope.$digest();
      expect(element.text()).toEqual('');
      animator.show(element);
      window.setTimeout.expect(1).process();
      expect(element.text()).toBe('memento');
    }));

    it("should not run if animations are disabled", inject(function($animator, $rootScope) {
      $animator.enabled(false);

      animator = $animator($rootScope, {
        ngAnimate : '{show: \'setup-memo\'}'
      });
      $rootScope.$digest();

      element.text('123');
      expect(element.text()).toBe('123');
      animator.show(element);
      expect(element.text()).toBe('123');

      $animator.enabled(true);

      animator.show(element);
      window.setTimeout.expect(1).process();
      expect(element.text()).toBe('memento');
    }));

    it("should only call done() once and right away if another animation takes place in between",
      inject(function($animator, $rootScope) {
      $animator.enabled(true);

      animator = $animator($rootScope, {
        ngAnimate : '{hide: \'custom-delay\', leave: \'custom-delay\'}'
      });

      element.append(child);

      child.css('display','block');
      animator.hide(child);
      window.setTimeout.expect(1).process();
      expect(child.css('display')).toBe('block');

      animator.leave(child);
      expect(child.css('display')).toBe('none'); //hides instantly

      //lets change this to prove that done doesn't fire anymore for the previous hide() operation
      child.css('display','block'); 

      window.setTimeout.expect(2000).process();
      expect(child.css('display')).toBe('block'); //doesn't run the done() method to hide it

      expect(element.children().length).toBe(1); //still animating

      window.setTimeout.expect(1).process();
      window.setTimeout.expect(2000).process();
      expect(element.children().length).toBe(0);
    }));

    it("should call the cancel callback when another animation is called on the same element",
      inject(function($animator, $rootScope) {
      $animator.enabled(true);

      animator = $animator($rootScope, {
        ngAnimate : '{hide: \'custom-delay\', show: \'custom-delay\'}'
      });

      child.css('display','none');
      element.data('foo', 'bar');
      animator.show(element);
      window.setTimeout.expect(1).process();

      animator.hide(element);

      expect(element.hasClass('animation-cancelled')).toBe(true);
      expect(element.data('foo')).toEqual('bar');
    }));

    it("should NOT clobber all data on an element when animation is finished",
      inject(function($animator, $rootScope) {
      $animator.enabled(true);

      animator = $animator($rootScope, {
        ngAnimate : '{hide: \'custom-delay\', show: \'custom-delay\'}'
      });

      child.css('display','none');
      element.data('foo', 'bar');

      animator.show(element);
      window.setTimeout.expect(1).process();

      animator.hide(element);

      expect(element.data('foo')).toEqual('bar');
    }));


    it("should properly animate custom animation events", inject(function($animator, $rootScope) {
      $animator.enabled(true);
      animator = $animator($rootScope, {
        ngAnimate : '{custom: \'setup-memo\'}'
      });

      element.text('123');
      animator.animate('custom',element);
      window.setTimeout.expect(1).process();
      expect(element.text()).toBe('memento');
    }));
  });

  describe("with CSS3", function() {
    var window, animator, prefix, vendorPrefix;

    beforeEach(function() {
      module(function($animationProvider, $provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
        return function($sniffer, _$rootElement_, $animator) {
          vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
          $rootElement = _$rootElement_;
          $animator.enabled(true);
        };
      })
    });

    it("should properly animate custom animations for specific animation events",
      inject(function($animator, $rootScope, $compile, $sniffer) {

      $animator.enabled(true);
      var element = $compile(html('<div></div>'))($rootScope);

      animator = $animator($rootScope, {
        ngAnimate : '{custom: \'special\'}'
      });

      animator.animate('custom',element);
      if($sniffer.transitions) {
        expect(element.hasClass('special')).toBe(true);
        window.setTimeout.expect(1).process();
        expect(element.hasClass('special-active')).toBe(true);
      }
      else {
        expect(window.setTimeout.queue.length).toBe(0);
      }
    }));

    it("should not animate custom animations if not specifically defined",
      inject(function($animator, $rootScope, $compile) {

      $animator.enabled(true);
      var element = $compile(html('<div></div>'))($rootScope);

      animator = $animator($rootScope, {
        ngAnimate : '{custom: \'special\'}'
      });

      expect(window.setTimeout.queue.length).toBe(0);
      animator.animate('custom1',element);
      expect(element.hasClass('special')).toBe(false);
      expect(window.setTimeout.queue.length).toBe(0);
    }));

    it("should properly animate custom animations for general animation events",
      inject(function($animator, $rootScope, $compile, $sniffer) {

      $animator.enabled(true);
      var element = $compile(html('<div></div>'))($rootScope);

      animator = $animator($rootScope, {
        ngAnimate : "'special'"
      });

      animator.animate('custom',element);
      if($sniffer.transitions) {
        expect(element.hasClass('special-custom')).toBe(true);
        window.setTimeout.expect(1).process();
        expect(element.hasClass('special-custom-active')).toBe(true);
      }
      else {
        expect(window.setTimeout.queue.length).toBe(0);
      }
    }));

    describe("Animations", function() {
      it("should properly detect and make use of CSS Animations",
          inject(function($animator, $rootScope, $compile, $sniffer) {
        var style = 'animation: some_animation 4s linear 0s 1 alternate;' +
                    vendorPrefix + 'animation: some_animation 4s linear 0s 1 alternate;';
        element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
        var animator = $animator($rootScope, {
          ngAnimate : '{show: \'inline-show\'}'
        });

        element.css('display','none');
        expect(element.css('display')).toBe('none');

        animator.show(element);
        if ($sniffer.animations) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(4000).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(element[0].style.display).toBe('');
      }));

      it("should properly detect and make use of CSS Animations with multiple iterations",
          inject(function($animator, $rootScope, $compile, $sniffer) {
        var style = 'animation-duration: 2s;' + 
                    'animation-iteration-count: 3;' +
                    vendorPrefix + 'animation-duration: 2s;' + 
                    vendorPrefix + 'animation-iteration-count: 3;';
        element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
        var animator = $animator($rootScope, {
          ngAnimate : '{show: \'inline-show\'}'
        });

        element.css('display','none');
        expect(element.css('display')).toBe('none');

        animator.show(element);
        if ($sniffer.animations) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(6000).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(element[0].style.display).toBe('');
      }));

      it("should fallback to the animation duration if an infinite iteration is provided",
          inject(function($animator, $rootScope, $compile, $sniffer) {
        var style = 'animation-duration: 2s;' + 
                    'animation-iteration-count: infinite;' +
                    vendorPrefix + 'animation-duration: 2s;' + 
                    vendorPrefix + 'animation-iteration-count: infinite;';
        element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
        var animator = $animator($rootScope, {
          ngAnimate : '{show: \'inline-show\'}'
        });

        element.css('display','none');
        expect(element.css('display')).toBe('none');

        animator.show(element);
        if ($sniffer.animations) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(2000).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(element[0].style.display).toBe('');
      }));

      it("should consider the animation delay is provided",
          inject(function($animator, $rootScope, $compile, $sniffer) {
        var style = 'animation-duration: 2s;' + 
                    'animation-delay: 10s;' +
                    'animation-iteration-count: 5;' +
                    vendorPrefix + 'animation-duration: 2s;' + 
                    vendorPrefix + 'animation-delay: 10s;' +
                    vendorPrefix + 'animation-iteration-count: 5;';
        element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
        var animator = $animator($rootScope, {
          ngAnimate : '{show: \'inline-show\'}'
        });

        element.css('display','none');
        expect(element.css('display')).toBe('none');

        animator.show(element);
        if ($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(20000).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(element[0].style.display).toBe('');
      }));

      it("should skip animations if disabled and run when enabled",
          inject(function($animator, $rootScope, $compile, $sniffer) {
        $animator.enabled(false);
        var style = 'animation: some_animation 2s linear 0s 1 alternate;' +
                    vendorPrefix + 'animation: some_animation 2s linear 0s 1 alternate;'

        element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
        var animator = $animator($rootScope, {
          ngAnimate : '{show: \'inline-show\'}'
        });
        element.css('display','none');
        expect(element.css('display')).toBe('none');
        animator.show(element);
        expect(element[0].style.display).toBe('');
      }));

      it("should finish the previous animation when a new animation is started",
        inject(function($animator, $rootScope, $compile, $sniffer) {
          var style = 'animation: some_animation 2s linear 0s 1 alternate;' +
                      vendorPrefix + 'animation: some_animation 2s linear 0s 1 alternate;'

          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
          var animator = $animator($rootScope, {
            ngAnimate : '{show: \'show\', hide: \'hide\'}'
          });

          animator.show(element);
          if($sniffer.animations) {
            window.setTimeout.expect(1).process();
            expect(element.hasClass('show')).toBe(true);
            expect(element.hasClass('show-active')).toBe(true);
          }
          else { //animation is skipped
            expect(window.setTimeout.queue.length).toBe(0);
          }

          animator.hide(element);
          if(!$sniffer.animations) {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element.hasClass('show')).toBe(false);
          expect(element.hasClass('show-active')).toBe(false);
      }));
    });

    describe("Transitions", function() {
      it("should skip transitions if disabled and run when enabled",
          inject(function($animator, $rootScope, $compile, $sniffer) {
        $animator.enabled(false);
        element = $compile(html('<div style="' + vendorPrefix + 'transition: 1s linear all">1</div>'))($rootScope);
        var animator = $animator($rootScope, {
          ngAnimate : '{show: \'inline-show\'}'
        });

        element.css('display','none');
        expect(element.css('display')).toBe('none');
        animator.show(element);
        expect(element[0].style.display).toBe('');

        $animator.enabled(true);

        element.css('display','none');
        expect(element.css('display')).toBe('none');

        animator.show(element);
        if ($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(1000).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(element[0].style.display).toBe('');
      }));

      it("should skip animations if disabled and run when enabled picking the longest specified duration",
        inject(function($animator, $rootScope, $compile, $sniffer) {
          $animator.enabled(true);
          element = $compile(html('<div style="' + vendorPrefix + 'transition-duration: 1s, 2000ms, 1s; ' + vendorPrefix + 'transition-property: height, left, opacity">foo</div>'))($rootScope);
          var animator = $animator($rootScope, {
            ngAnimate : '{show: \'inline-show\'}'
          });
          element.css('display','none');
          animator.show(element);
          if ($sniffer.transitions) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(2000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element[0].style.display).toBe('');
        }));

      it("should skip animations if disabled and run when enabled picking the longest specified duration/delay combination",
        inject(function($animator, $rootScope, $compile, $sniffer) {
          $animator.enabled(false);
          element = $compile(html('<div style="' + vendorPrefix + 
            'transition-duration: 1s, 0s, 1s; ' + vendorPrefix +
            'transition-delay: 2s, 1000ms, 2s; ' + vendorPrefix + 
            'transition-property: height, left, opacity">foo</div>'))($rootScope);

          var animator = $animator($rootScope, {
            ngAnimate : '{show: \'inline-show\'}'
          });

          element.css('display','none');
          expect(element.css('display')).toBe('none');
          animator.show(element);
          expect(element[0].style.display).toBe('');

          $animator.enabled(true);

          element.css('display','none');
          expect(element.css('display')).toBe('none');

          animator.show(element);
          if ($sniffer.transitions) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(3000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element[0].style.display).toBe('');
      }));

      it("should select the highest duration and delay",
        inject(function($animator, $rootScope, $compile, $sniffer) {
          var styles = 'transition:1s linear all 2s;' + 
                       vendorPrefix + 'transition:1s linear all 2s;' + 
                       'animation:my_ani 10s 1s;' + 
                       vendorPrefix + 'animation:my_ani 10s 1s;';

          element = $compile(html('<div style="' + styles + '">foo</div>'))($rootScope);

          var animator = $animator($rootScope, {
            ngAnimate : '{show: \'inline-show\'}'
          });

          element.css('display','none');
          expect(element.css('display')).toBe('none');

          animator.show(element);
          if ($sniffer.transitions) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(11000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element[0].style.display).toBe('');
      }));

      it("should finish the previous transition when a new animation is started",
        inject(function($animator, $rootScope, $compile, $sniffer) {
          var style = 'transition: 1s linear all;' +
                      vendorPrefix + 'transition: 1s linear all;'

          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
          var animator = $animator($rootScope, {
            ngAnimate : '{show: \'show\', hide: \'hide\'}'
          });

          animator.show(element);
          if($sniffer.transitions) {
            window.setTimeout.expect(1).process();
            expect(element.hasClass('show')).toBe(true);
            expect(element.hasClass('show-active')).toBe(true);
          }
          else { //animation is skipped
            expect(window.setTimeout.queue.length).toBe(0);
          }

          animator.hide(element);
          if(!$sniffer.transitions) {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element.hasClass('show')).toBe(false);
          expect(element.hasClass('show-active')).toBe(false);
      }));
    });
  });

  describe('anmation evaluation', function () {
    it('should re-evaluate the animation expression on each animation', inject(function($animator, $rootScope) {
      var parent = jqLite('<div><span></span></div>');
      var element = parent.find('span');

      $rootScope.animationFn = function () { throw new Error('too early'); };
      var animate = $animator($rootScope, { ngAnimate: 'animationFn()' });
      var log = '';

      $rootScope.animationFn = function () { log = 'abc' };
      animate.enter(element, parent);
      expect(log).toEqual('abc');

      $rootScope.animationFn = function () { log = 'xyz' };
      animate.enter(element, parent);
      expect(log).toEqual('xyz');
    }));
  });

  it("should throw an error when an invalid ng-animate syntax is provided", inject(function($animator, $rootScope) {
    expect(function() {
      var animate = $animator($rootScope, { ngAnimate: ':' });
      animate.enter();
    }).toThrow("[NgErr24] Syntax Error: Token ':' not a primary expression at column 1 of the expression [:] starting at [:].");
  }));
});
