'use strict';

describe("ngAnimate", function() {

  beforeEach(module('ngAnimate'));

  var ss, body;
  beforeEach(module(function() {
    body = jqLite(document.body);
    return function($window, $document, $animate, $timeout) {
      ss = createMockStyleSheet($document, $window);
      try {
        $timeout.flush();
      } catch(e) {}
      $animate.enabled(true);
    };
  }));

  afterEach(function(){
    if(ss) {
      ss.destroy();
    }
    dealoc(body);
  });

  describe("$animate", function() {

    var element, $rootElement;

    function html(html) {
      body.append($rootElement);
      $rootElement.html(html);
      element = $rootElement.children().eq(0);
      return element;
    }

    describe("enable / disable", function() {

      it("should work for all animations", function() {
        var $animate, initialState = null;

        angular.bootstrap(body, ['ngAnimate',function() {
          return function(_$animate_) {
            $animate = _$animate_;
            initialState = $animate.enabled();
          }
        }]);

        expect(initialState).toBe(false);

        expect($animate.enabled()).toBe(true);

        expect($animate.enabled(0)).toBe(false);
        expect($animate.enabled()).toBe(false);

        expect($animate.enabled(1)).toBe(true);
        expect($animate.enabled()).toBe(true);
      });

      it('should place a hard disable on all child animations', function() {
        var count = 0;
        module(function($animateProvider) {
          $animateProvider.register('.animated', function() {
            return {
              addClass : function(element, className, done) {
                count++;
                done();
              }
            }
          });
        });
        inject(function($compile, $rootScope, $animate, $sniffer, $rootElement, $timeout) {
          $animate.enabled(true);

          var elm1 = $compile('<div class="animated"></div>')($rootScope);
          var elm2 = $compile('<div class="animated"></div>')($rootScope);
          $rootElement.append(elm1);
          angular.element(document.body).append($rootElement);

          $animate.addClass(elm1, 'klass');
          expect(count).toBe(1);

          $animate.enabled(false);

          $animate.addClass(elm1, 'klass2');
          expect(count).toBe(1);

          $animate.enabled(true);

          elm1.append(elm2);

          $animate.addClass(elm2, 'klass');
          expect(count).toBe(2);

          $animate.enabled(false, elm1);

          $animate.addClass(elm2, 'klass2');
          expect(count).toBe(2);

          var root = angular.element($rootElement[0]);
          $rootElement.addClass('animated');
          $animate.addClass(root, 'klass2');
          expect(count).toBe(3);
        });
      });

      it('should skip animations if the element is attached to the $rootElement', function() {
        var count = 0;
        module(function($animateProvider) {
          $animateProvider.register('.animated', function() {
            return {
              addClass : function(element, className, done) {
                count++;
                done();
              }
            }
          });
        });
        inject(function($compile, $rootScope, $animate, $sniffer, $rootElement, $timeout) {
          $animate.enabled(true);

          var elm1 = $compile('<div class="animated"></div>')($rootScope);

          $animate.addClass(elm1, 'klass2');
          expect(count).toBe(0);
        });
      });

      it('should check enable/disable animations up until the $rootElement element', function() {
        var rootElm = jqLite('<div></div>');

        var captured = false;
        module(function($provide, $animateProvider) {
          $provide.value('$rootElement', rootElm);
          $animateProvider.register('.capture-animation', function() {
            return {
              addClass : function(element, className, done) {
                captured = true;
                done();
              }
            }
          });
        });
        inject(function($animate, $rootElement, $rootScope, $compile, $timeout) {
          var initialState;
          angular.bootstrap(rootElm, ['ngAnimate']);

          $animate.enabled(true);

          var element = $compile('<div class="capture-animation"></div>')($rootScope);
          rootElm.append(element);

          expect(captured).toBe(false);
          $animate.addClass(element, 'red');
          expect(captured).toBe(true);

          captured = false;
          $animate.enabled(false);

          $animate.addClass(element, 'blue');
          expect(captured).toBe(false);

          //clean up the mess
          $animate.enabled(false, rootElm);
          dealoc(rootElm);
        });
      });
    });

    describe("with polyfill", function() {

      var child, after;

      beforeEach(function() {
        module(function($animateProvider) {
          $animateProvider.register('.custom', function() {
            return {
              start: function(element, done) {
                done();
              }
            }
          });
         $animateProvider.register('.custom-delay', function($timeout) {
            function animate(element, done) {
              done = arguments.length == 3 ? arguments[2] : done;
              $timeout(done, 2000, false);
              return function() {
                element.addClass('animation-cancelled');
              }
            }
            return {
              leave : animate,
              addClass : animate,
              removeClass : animate
            }
          });
         $animateProvider.register('.custom-long-delay', function($timeout) {
            function animate(element, done) {
              done = arguments.length == 3 ? arguments[2] : done;
              $timeout(done, 20000, false);
              return function(cancelled) {
                element.addClass(cancelled ? 'animation-cancelled' : 'animation-ended');
              }
            }
            return {
              leave : animate,
              addClass : animate,
              removeClass : animate
            }
          });
         $animateProvider.register('.setup-memo', function() {
            return {
              removeClass: function(element, className, done) {
                element.text('memento');
                done();
              }
            }
          });
          return function($animate, $compile, $rootScope, $rootElement) {
            element = $compile('<div></div>')($rootScope);

            forEach(['.ng-hide-add', '.ng-hide-remove', '.ng-enter', '.ng-leave', '.ng-move'], function(selector) {
              ss.addRule(selector, '-webkit-transition:1s linear all;' +
                                           'transition:1s linear all;');
            });

            child = $compile('<div>...</div>')($rootScope);
            jqLite($document[0].body).append($rootElement);
            element.append(child);

            after   = $compile('<div></div>')($rootScope);
            $rootElement.append(element);
          };
        });
      })

      it("should animate the enter animation event",
        inject(function($animate, $rootScope, $sniffer, $timeout) {
        element[0].removeChild(child[0]);

        expect(element.contents().length).toBe(0);
        $animate.enter(child, element);
        $rootScope.$digest();

        if($sniffer.transitions) {
          $timeout.flush();
          expect(child.hasClass('ng-enter')).toBe(true);
          expect(child.hasClass('ng-enter-active')).toBe(true);
          browserTrigger(element, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }

        expect(element.contents().length).toBe(1);
      }));

      it("should animate the leave animation event",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        expect(element.contents().length).toBe(1);
        $animate.leave(child);
        $rootScope.$digest();

        if($sniffer.transitions) {
          $timeout.flush();
          expect(child.hasClass('ng-leave')).toBe(true);
          expect(child.hasClass('ng-leave-active')).toBe(true);
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }

        expect(element.contents().length).toBe(0);
      }));

      it("should animate the move animation event",
        inject(function($animate, $compile, $rootScope, $timeout, $sniffer) {

        $rootScope.$digest();
        element.html('');

        var child1 = $compile('<div>1</div>')($rootScope);
        var child2 = $compile('<div>2</div>')($rootScope);
        element.append(child1);
        element.append(child2);
        expect(element.text()).toBe('12');
        $animate.move(child1, element, child2);
        $rootScope.$digest();
        if($sniffer.transitions) {
          $timeout.flush();
        }
        expect(element.text()).toBe('21');
      }));

      it("should animate the show animation event",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        $rootScope.$digest();
        child.addClass('ng-hide');
        expect(child).toBeHidden();
        $animate.removeClass(child, 'ng-hide');
        if($sniffer.transitions) {
          $timeout.flush();
          expect(child.hasClass('ng-hide-remove')).toBe(true);
          expect(child.hasClass('ng-hide-remove-active')).toBe(true);
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        expect(child.hasClass('ng-hide-remove')).toBe(false);
        expect(child.hasClass('ng-hide-remove-active')).toBe(false);
        expect(child).toBeShown();
      }));

      it("should animate the hide animation event",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        $rootScope.$digest();
        expect(child).toBeShown();
        $animate.addClass(child, 'ng-hide');
        if($sniffer.transitions) {
          $timeout.flush();
          expect(child.hasClass('ng-hide-add')).toBe(true);
          expect(child.hasClass('ng-hide-add-active')).toBe(true);
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        expect(child).toBeHidden();
      }));

      it("should assign the ng-event className to all animation events when transitions/keyframes are used",
        inject(function($animate, $sniffer, $rootScope, $timeout) {

        if (!$sniffer.transitions) return;

        $rootScope.$digest();
        element[0].removeChild(child[0]);

        //enter
        $animate.enter(child, element);
        $rootScope.$digest();
        $timeout.flush();

        expect(child.attr('class')).toContain('ng-enter');
        expect(child.attr('class')).toContain('ng-enter-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        $timeout.flush();

        //move
        element.append(after);
        $animate.move(child, element, after);
        $rootScope.$digest();
        $timeout.flush();

        expect(child.attr('class')).toContain('ng-move');
        expect(child.attr('class')).toContain('ng-move-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        $timeout.flush();

        //hide
        $animate.addClass(child, 'ng-hide');
        $timeout.flush();
        expect(child.attr('class')).toContain('ng-hide-add');
        expect(child.attr('class')).toContain('ng-hide-add-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

        //show
        $animate.removeClass(child, 'ng-hide');
        $timeout.flush();
        expect(child.attr('class')).toContain('ng-hide-remove');
        expect(child.attr('class')).toContain('ng-hide-remove-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

        //leave
        $animate.leave(child);
        $rootScope.$digest();
        $timeout.flush();
        expect(child.attr('class')).toContain('ng-leave');
        expect(child.attr('class')).toContain('ng-leave-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
      }));

      it("should not run if animations are disabled",
        inject(function($animate, $rootScope, $timeout, $sniffer) {

        $animate.enabled(false);

        $rootScope.$digest();

        element.addClass('setup-memo');

        element.text('123');
        expect(element.text()).toBe('123');
        $animate.removeClass(element, 'ng-hide');
        expect(element.text()).toBe('123');

        $animate.enabled(true);

        element.addClass('ng-hide');
        $animate.removeClass(element, 'ng-hide');
        if($sniffer.transitions) {
          $timeout.flush();
        }
        expect(element.text()).toBe('memento');
      }));

      it("should only call done() once and right away if another animation takes place in between",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        element.append(child);
        child.addClass('custom-delay');

        expect(element).toBeShown();
        $animate.addClass(child, 'ng-hide');
        if($sniffer.transitions) {
          expect(child).toBeShown();
        }

        $animate.leave(child);
        $rootScope.$digest();
        $timeout.flush();
        expect(child).toBeHidden(); //hides instantly

        //lets change this to prove that done doesn't fire anymore for the previous hide() operation
        child.css('display','block');
        child.removeClass('ng-hide');

        if($sniffer.transitions) {
          expect(element.children().length).toBe(1); //still animating
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        $timeout.flush(2000);
        $timeout.flush(2000);
        expect(child).toBeShown();

        expect(element.children().length).toBe(0);
      }));

      it("should call the cancel callback when another animation is called on the same element",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        element.append(child);

        child.addClass('custom-delay ng-hide');
        $animate.removeClass(child, 'ng-hide');
        if($sniffer.transitions) {
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        $timeout.flush(2000);

        $animate.addClass(child, 'ng-hide');

        expect(child.hasClass('animation-cancelled')).toBe(true);
      }));

      it("should skip a class-based animation if the same element already has an ongoing structural animation",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        var completed = false;
        $animate.enter(child, element, null, function() {
          completed = true; 
        });
        $rootScope.$digest();

        expect(completed).toBe(false);

        $animate.addClass(child, 'green');
        expect(element.hasClass('green'));

        expect(completed).toBe(false);
        if($sniffer.transitions) {
          $timeout.flush();
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        $timeout.flush();

        expect(completed).toBe(true);
      }));

      it("should fire the cancel/end function with the correct flag in the parameters",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        element.append(child);

        $animate.addClass(child, 'custom-delay');
        $animate.addClass(child, 'custom-long-delay');

        expect(child.hasClass('animation-cancelled')).toBe(true);
        expect(child.hasClass('animation-ended')).toBe(false);

        $timeout.flush();
        expect(child.hasClass('animation-ended')).toBe(true);
      }));


      it("should NOT clobber all data on an element when animation is finished",
        inject(function($animate) {

        child.css('display','none');
        element.data('foo', 'bar');

        $animate.removeClass(element, 'ng-hide');
        $animate.addClass(element, 'ng-hide');
        expect(element.data('foo')).toEqual('bar');
      }));


      it("should allow multiple JS animations which run in parallel",
        inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

          $animate.addClass(element, 'custom-delay custom-long-delay');
          $timeout.flush(2000);
          $timeout.flush(20000);
          expect(element.hasClass('custom-delay')).toBe(true);
          expect(element.hasClass('custom-long-delay')).toBe(true);
      }));

      it("should allow both multiple JS and CSS animations which run in parallel",
        inject(function($animate, $rootScope, $compile, $sniffer, $timeout, _$rootElement_) {
        $rootElement = _$rootElement_;

        ss.addRule('.ng-hide-add', '-webkit-transition:1s linear all;' +
                                           'transition:1s linear all;');
        ss.addRule('.ng-hide-remove', '-webkit-transition:1s linear all;' +
                                              'transition:1s linear all;');

        element = $compile(html('<div>1</div>'))($rootScope);
        element.addClass('custom-delay custom-long-delay');
        $rootScope.$digest();

        $animate.removeClass(element, 'ng-hide');

        if($sniffer.transitions) {
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        $timeout.flush(2000);
        $timeout.flush(20000);

        expect(element.hasClass('custom-delay')).toBe(true);
        expect(element.hasClass('custom-delay-add')).toBe(false);
        expect(element.hasClass('custom-delay-add-active')).toBe(false);

        expect(element.hasClass('custom-long-delay')).toBe(true);
        expect(element.hasClass('custom-long-delay-add')).toBe(false);
        expect(element.hasClass('custom-long-delay-add-active')).toBe(false);
      }));
    });

    describe("with CSS3", function() {
      beforeEach(function() {
        module(function() {
          return function(_$rootElement_) {
            $rootElement = _$rootElement_;
          };
        })
      });

      describe("Animations", function() {
        it("should properly detect and make use of CSS Animations",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

          ss.addRule('.ng-hide-add',
                         '-webkit-animation: some_animation 4s linear 0s 1 alternate;' +
                                 'animation: some_animation 4s linear 0s 1 alternate;');
          ss.addRule('.ng-hide-remove',
                         '-webkit-animation: some_animation 4s linear 0s 1 alternate;' +
                                 'animation: some_animation 4s linear 0s 1 alternate;');

          element = $compile(html('<div>1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.removeClass(element, 'ng-hide');
          if ($sniffer.animations) {
            $timeout.flush();
            browserTrigger(element,'animationend', { timeStamp: Date.now() + 4000, elapsedTime: 4 });
          }
          expect(element).toBeShown();
        }));

        it("should properly detect and make use of CSS Animations with multiple iterations",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

          var style = '-webkit-animation-duration: 2s;' +
                      '-webkit-animation-iteration-count: 3;' +
                              'animation-duration: 2s;' +
                              'animation-iteration-count: 3;';

          ss.addRule('.ng-hide-add', style);
          ss.addRule('.ng-hide-remove', style);

          element = $compile(html('<div>1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.removeClass(element, 'ng-hide');
          if ($sniffer.animations) {
            $timeout.flush();
            browserTrigger(element,'animationend', { timeStamp: Date.now() + 6000, elapsedTime: 6 });
          }
          expect(element).toBeShown();
        }));

        it("should fallback to the animation duration if an infinite iteration is provided",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

          var style = '-webkit-animation-duration: 2s;' +
                      '-webkit-animation-iteration-count: infinite;' +
                              'animation-duration: 2s;' +
                              'animation-iteration-count: infinite;';

          ss.addRule('.ng-hide-add', style);
          ss.addRule('.ng-hide-remove', style);

          element = $compile(html('<div>1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.removeClass(element, 'ng-hide');
          if ($sniffer.animations) {
            $timeout.flush();
            browserTrigger(element,'animationend', { timeStamp: Date.now() + 2000, elapsedTime: 2 });
          }
          expect(element).toBeShown();
        }));

        it("should not consider the animation delay is provided",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

          var style = '-webkit-animation-duration: 2s;' +
                      '-webkit-animation-delay: 10s;' +
                      '-webkit-animation-iteration-count: 5;' +
                              'animation-duration: 2s;' +
                              'animation-delay: 10s;' +
                              'animation-iteration-count: 5;';

          ss.addRule('.ng-hide-add', style);
          ss.addRule('.ng-hide-remove', style);

          element = $compile(html('<div>1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.removeClass(element, 'ng-hide');
          if ($sniffer.transitions) {
            $timeout.flush();
            browserTrigger(element,'animationend', { timeStamp : Date.now() + 20000, elapsedTime: 10 });
          }
          expect(element).toBeShown();
        }));

        it("should skip animations if disabled and run when enabled",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {
          $animate.enabled(false);
          var style = '-webkit-animation: some_animation 2s linear 0s 1 alternate;' +
                              'animation: some_animation 2s linear 0s 1 alternate;';

          ss.addRule('.ng-hide-add', style);
          ss.addRule('.ng-hide-remove', style);

          element = $compile(html('<div>1</div>'))($rootScope);
          element.addClass('ng-hide');
          expect(element).toBeHidden();
          $animate.removeClass(element, 'ng-hide');
          expect(element).toBeShown();
        }));

        it("should finish the previous animation when a new animation is started",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {
            var style = '-webkit-animation: some_animation 2s linear 0s 1 alternate;' +
                                'animation: some_animation 2s linear 0s 1 alternate;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div class="ng-hide">1</div>'))($rootScope);
            element.addClass('custom');

            $animate.removeClass(element, 'ng-hide');

            if($sniffer.animations) {
              $timeout.flush();
              expect(element.hasClass('ng-hide-remove')).toBe(true);
              expect(element.hasClass('ng-hide-remove-active')).toBe(true);
            }

            element.removeClass('ng-hide');
            $animate.addClass(element, 'ng-hide');
            expect(element.hasClass('ng-hide-remove')).toBe(false); //added right away


            if($sniffer.animations) { //cleanup some pending animations
              $timeout.flush();
              expect(element.hasClass('ng-hide-add')).toBe(true);
              expect(element.hasClass('ng-hide-add-active')).toBe(true);
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 2000, elapsedTime: 2 });
            }

            expect(element.hasClass('ng-hide-remove-active')).toBe(false);
        }));

        it("should stagger the items when the correct CSS class is provided",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

          if(!$sniffer.animations) return;

          $animate.enabled(true);

          ss.addRule('.real-animation.ng-enter, .real-animation.ng-leave, .real-animation-fake.ng-enter, .real-animation-fake.ng-leave',
            '-webkit-animation:1s my_animation;' + 
            'animation:1s my_animation;');

          ss.addRule('.real-animation.ng-enter-stagger, .real-animation.ng-leave-stagger',
            '-webkit-animation-delay:0.1s;' +
            '-webkit-animation-duration:0s;' +
            'animation-delay:0.1s;' + 
            'animation-duration:0s;');

          ss.addRule('.fake-animation.ng-enter-stagger, .fake-animation.ng-leave-stagger',
            '-webkit-animation-delay:0.1s;' +
            '-webkit-animation-duration:1s;' +
            'animation-delay:0.1s;' + 
            'animation-duration:1s;');

          var container = $compile(html('<div></div>'))($rootScope);

          var elements = [];
          for(var i = 0; i < 5; i++) {
            var newScope = $rootScope.$new();
            var element = $compile('<div class="real-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements.push(element);
          };

          $rootScope.$digest();
          $timeout.flush();

          expect(elements[0].attr('style')).toBeFalsy();
          expect(elements[1].attr('style')).toMatch(/animation-delay: 0\.1\d*s/);
          expect(elements[2].attr('style')).toMatch(/animation-delay: 0\.2\d*s/);
          expect(elements[3].attr('style')).toMatch(/animation-delay: 0\.3\d*s/);
          expect(elements[4].attr('style')).toMatch(/animation-delay: 0\.4\d*s/);

          for(var i = 0; i < 5; i++) {
            dealoc(elements[i]);
            var newScope = $rootScope.$new();
            var element = $compile('<div class="fake-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements[i] = element;
          };

          $rootScope.$digest();
          $timeout.flush();

          expect(elements[0].attr('style')).toBeFalsy();
          expect(elements[1].attr('style')).not.toMatch(/animation-delay: 0\.1\d*s/);
          expect(elements[2].attr('style')).not.toMatch(/animation-delay: 0\.2\d*s/);
          expect(elements[3].attr('style')).not.toMatch(/animation-delay: 0\.3\d*s/);
          expect(elements[4].attr('style')).not.toMatch(/animation-delay: 0\.4\d*s/);
        }));

        it("should stagger items when multiple animation durations/delays are defined",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

          if(!$sniffer.transitions) return;

          $animate.enabled(true);

          ss.addRule('.stagger-animation.ng-enter, .stagger-animation.ng-leave',
            '-webkit-animation:my_animation 1s 1s, your_animation 1s 2s;' + 
            'animation:my_animation 1s 1s, your_animation 1s 2s;');

          ss.addRule('.stagger-animation.ng-enter-stagger, .stagger-animation.ng-leave-stagger',
            '-webkit-animation-delay:0.1s;' +
            'animation-delay:0.1s;');

          var container = $compile(html('<div></div>'))($rootScope);

          var elements = [];
          for(var i = 0; i < 4; i++) {
            var newScope = $rootScope.$new();
            var element = $compile('<div class="stagger-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements.push(element);
          };

          $rootScope.$digest();
          $timeout.flush();

          expect(elements[0].attr('style')).toBeFalsy();
          expect(elements[1].attr('style')).toMatch(/animation-delay: 1\.1\d*s,\s*2\.1\d*s/);
          expect(elements[2].attr('style')).toMatch(/animation-delay: 1\.2\d*s,\s*2\.2\d*s/);
          expect(elements[3].attr('style')).toMatch(/animation-delay: 1\.3\d*s,\s*2\.3\d*s/);
        }));
      });

      describe("Transitions", function() {
        it("should only apply the fallback transition property unless all properties are being animated",
          inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

          if (!$sniffer.animations) return;

          ss.addRule('.all.ng-enter',  '-webkit-transition:1s linear all;' +
                                               'transition:1s linear all');

          ss.addRule('.one.ng-enter',  '-webkit-transition:1s linear color;' +
                                               'transition:1s linear color');

          var element = $compile('<div></div>')($rootScope);
          var child = $compile('<div class="all">...</div>')($rootScope);
          $rootElement.append(element);
          var body = jqLite($document[0].body);
          body.append($rootElement);

          $animate.enter(child, element);
          $rootScope.$digest();
          $timeout.flush();

          expect(child.attr('style') || '').not.toContain('transition-property');
          expect(child.hasClass('ng-animate-start')).toBe(true);
          expect(child.hasClass('ng-animate-active')).toBe(true);

          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1000 });
          $timeout.flush();

          expect(child.hasClass('ng-animate')).toBe(false);
          expect(child.hasClass('ng-animate-active')).toBe(false);

          child.remove();

          var child2 = $compile('<div class="one">...</div>')($rootScope);

          $animate.enter(child2, element);
          $rootScope.$digest();
          $timeout.flush();

          //IE removes the -ms- prefix when placed on the style
          var fallbackProperty = $sniffer.msie ? 'zoom' : 'clip';
          var regExp = new RegExp("transition-property:\\s+color\\s*,\\s*" + fallbackProperty + "\\s*;");
          expect(child2.attr('style') || '').toMatch(regExp);
          expect(child2.hasClass('ng-animate')).toBe(true);
          expect(child2.hasClass('ng-animate-active')).toBe(true);

          browserTrigger(child2,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1000 });
          $timeout.flush();

          expect(child2.hasClass('ng-animate')).toBe(false);
          expect(child2.hasClass('ng-animate-active')).toBe(false);
        }));

        it("should not apply the fallback classes if no animations are going on or if CSS animations are going on",
          inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

          if (!$sniffer.animations) return;

          ss.addRule('.transitions',  '-webkit-transition:1s linear all;' +
                                              'transition:1s linear all');

          ss.addRule('.keyframes',  '-webkit-animation:my_animation 1s;' +
                                            'animation:my_animation 1s');

          var element = $compile('<div class="transitions">...</div>')($rootScope);
          $rootElement.append(element);
          jqLite($document[0].body).append($rootElement);

          $animate.enabled(false);

          $animate.addClass(element, 'klass');

          expect(element.hasClass('ng-animate-start')).toBe(false);

          element.removeClass('klass');

          $animate.enabled(true);

          $animate.addClass(element, 'klass');

          $timeout.flush();

          expect(element.hasClass('ng-animate-start')).toBe(true);
          expect(element.hasClass('ng-animate-active')).toBe(true);

          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          expect(element.hasClass('ng-animate-start')).toBe(false);
          expect(element.hasClass('ng-animate-active')).toBe(false);

          element.attr('class', 'keyframes');

          $animate.addClass(element, 'klass2');

          $timeout.flush();

          expect(element.hasClass('ng-animate-start')).toBe(false);
          expect(element.hasClass('ng-animate-active')).toBe(false);
        }));

        it("should skip transitions if disabled and run when enabled",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

          var style = '-webkit-transition: 1s linear all;' +
                              'transition: 1s linear all;';

          ss.addRule('.ng-hide-add', style);
          ss.addRule('.ng-hide-remove', style);

          $animate.enabled(false);
          element = $compile(html('<div>1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();
          $animate.removeClass(element, 'ng-hide');
          expect(element).toBeShown();

          $animate.enabled(true);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.removeClass(element, 'ng-hide');
          if ($sniffer.transitions) {
            $timeout.flush();
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          expect(element).toBeShown();
        }));

        it("should skip animations if disabled and run when enabled picking the longest specified duration",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            var style = '-webkit-transition-duration: 1s, 2000ms, 1s;' +
                        '-webkit-transition-property: height, left, opacity;' +
                                'transition-duration: 1s, 2000ms, 1s;' +
                                 'transition-property: height, left, opacity;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>foo</div>'))($rootScope);
            element.addClass('ng-hide');

            $animate.removeClass(element, 'ng-hide');

            if ($sniffer.transitions) {
              $timeout.flush();
              var now = Date.now();
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });
              browserTrigger(element,'transitionend', { timeStamp: now + 2000, elapsedTime: 2 });
              expect(element.hasClass('ng-animate')).toBe(false);
            }
            expect(element).toBeShown();
          }));

        it("should skip animations if disabled and run when enabled picking the longest specified duration/delay combination",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {
            $animate.enabled(false);
            var style = '-webkit-transition-duration: 1s, 0s, 1s; ' +
                        '-webkit-transition-delay: 2s, 1000ms, 2s; ' +
                        '-webkit-transition-property: height, left, opacity;' +
                                'transition-duration: 1s, 0s, 1s; ' +
                                'transition-delay: 2s, 1000ms, 2s; ' +
                                'transition-property: height, left, opacity;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>foo</div>'))($rootScope);

            element.addClass('ng-hide');
            $animate.removeClass(element, 'ng-hide');
            $timeout.flush(0);
            expect(element).toBeShown();
            $animate.enabled(true);

            element.addClass('ng-hide');
            expect(element).toBeHidden();

            $animate.removeClass(element, 'ng-hide');
            if ($sniffer.transitions) {
              $timeout.flush();
              var now = Date.now();
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });
              browserTrigger(element,'transitionend', { timeStamp: now + 3000, elapsedTime: 3 });
              browserTrigger(element,'transitionend', { timeStamp: now + 3000, elapsedTime: 3 });
            }
            expect(element).toBeShown();
        }));

        it("should animate for the highest duration",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {
            var style = '-webkit-transition:1s linear all 2s;' +
                                'transition:1s linear all 2s;' +
                        '-webkit-animation:my_ani 10s 1s;' +
                                'animation:my_ani 10s 1s;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>foo</div>'))($rootScope);

            element.addClass('ng-hide');
            expect(element).toBeHidden();

            $animate.removeClass(element, 'ng-hide');
            if ($sniffer.transitions) {
              $timeout.flush();
            }
            expect(element).toBeShown();
            if ($sniffer.transitions) {
              expect(element.hasClass('ng-animate-active')).toBe(true);
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
              expect(element.hasClass('ng-animate-active')).toBe(false);
            }
        }));

        it("should finish the previous transition when a new animation is started",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {
            var style = '-webkit-transition: 1s linear all;' +
                                'transition: 1s linear all;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>1</div>'))($rootScope);

            element.addClass('ng-hide');
            $animate.removeClass(element, 'ng-hide');

            if($sniffer.transitions) {
              $timeout.flush();
              expect(element.hasClass('ng-hide-remove')).toBe(true);
              expect(element.hasClass('ng-hide-remove-active')).toBe(true);
              browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
            }
            expect(element.hasClass('ng-hide-remove')).toBe(false);
            expect(element.hasClass('ng-hide-remove-active')).toBe(false);
            expect(element).toBeShown();

            $animate.addClass(element, 'ng-hide');

            if($sniffer.transitions) {
              $timeout.flush();
              expect(element.hasClass('ng-hide-add')).toBe(true);
              expect(element.hasClass('ng-hide-add-active')).toBe(true);
            }
        }));

        it("should stagger the items when the correct CSS class is provided",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

          if(!$sniffer.transitions) return;

          $animate.enabled(true);

          ss.addRule('.real-animation.ng-enter, .real-animation.ng-leave, .real-animation-fake.ng-enter, .real-animation-fake.ng-leave',
            '-webkit-transition:1s linear all;' + 
            'transition:1s linear all;');

          ss.addRule('.real-animation.ng-enter-stagger, .real-animation.ng-leave-stagger',
            '-webkit-transition-delay:0.1s;' +
            '-webkit-transition-duration:0s;' +
            'transition-delay:0.1s;' + 
            'transition-duration:0s;');

          ss.addRule('.fake-animation.ng-enter-stagger, .fake-animation.ng-leave-stagger',
            '-webkit-transition-delay:0.1s;' +
            '-webkit-transition-duration:1s;' +
            'transition-delay:0.1s;' + 
            'transition-duration:1s;');

          var container = $compile(html('<div></div>'))($rootScope);

          var elements = [];
          for(var i = 0; i < 5; i++) {
            var newScope = $rootScope.$new();
            var element = $compile('<div class="real-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements.push(element);
          };

          $rootScope.$digest();
          $timeout.flush();

          expect(elements[0].attr('style')).toBeFalsy();
          expect(elements[1].attr('style')).toMatch(/transition-delay: 0\.1\d*s/);
          expect(elements[2].attr('style')).toMatch(/transition-delay: 0\.2\d*s/);
          expect(elements[3].attr('style')).toMatch(/transition-delay: 0\.3\d*s/);
          expect(elements[4].attr('style')).toMatch(/transition-delay: 0\.4\d*s/);

          for(var i = 0; i < 5; i++) {
            dealoc(elements[i]);
            var newScope = $rootScope.$new();
            var element = $compile('<div class="fake-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements[i] = element;
          };

          $rootScope.$digest();
          $timeout.flush();

          expect(elements[0].attr('style')).toBeFalsy();
          expect(elements[1].attr('style')).not.toMatch(/transition-delay: 0\.1\d*s/);
          expect(elements[2].attr('style')).not.toMatch(/transition-delay: 0\.2\d*s/);
          expect(elements[3].attr('style')).not.toMatch(/transition-delay: 0\.3\d*s/);
          expect(elements[4].attr('style')).not.toMatch(/transition-delay: 0\.4\d*s/);
        }));

        it("should stagger items when multiple transition durations/delays are defined",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

          if(!$sniffer.transitions) return;

          $animate.enabled(true);

          ss.addRule('.stagger-animation.ng-enter, .ani.ng-leave',
            '-webkit-transition:1s linear color 2s, 3s linear font-size 4s;' + 
            'transition:1s linear color 2s, 3s linear font-size 4s;');

          ss.addRule('.stagger-animation.ng-enter-stagger, .ani.ng-leave-stagger',
            '-webkit-transition-delay:0.1s;' +
            'transition-delay:0.1s;');

          var container = $compile(html('<div></div>'))($rootScope);

          var elements = [];
          for(var i = 0; i < 4; i++) {
            var newScope = $rootScope.$new();
            var element = $compile('<div class="stagger-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements.push(element);
          };

          $rootScope.$digest();
          $timeout.flush();

          expect(elements[0].attr('style')).not.toContain('transition-delay');
          expect(elements[1].attr('style')).toMatch(/transition-delay: 2\.1\d*s,\s*4\.1\d*s/);
          expect(elements[2].attr('style')).toMatch(/transition-delay: 2\.2\d*s,\s*4\.2\d*s/);
          expect(elements[3].attr('style')).toMatch(/transition-delay: 2\.3\d*s,\s*4\.3\d*s/);
        }));
      });

      it("should apply staggering to both transitions and keyframe animations when used within the same animation",
        inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

        if(!$sniffer.transitions) return;

        $animate.enabled(true);

        ss.addRule('.stagger-animation.ng-enter, .stagger-animation.ng-leave',
          '-webkit-animation:my_animation 1s 1s, your_animation 1s 2s;' + 
          'animation:my_animation 1s 1s, your_animation 1s 2s;' +
          '-webkit-transition:1s linear all 1s;' + 
          'transition:1s linear all 1s;');

        ss.addRule('.stagger-animation.ng-enter-stagger, .stagger-animation.ng-leave-stagger',
          '-webkit-transition-delay:0.1s;' +
          'transition-delay:0.1s;' +
          '-webkit-animation-delay:0.2s;' +
          'animation-delay:0.2s;');

        var container = $compile(html('<div></div>'))($rootScope);

        var elements = [];
        for(var i = 0; i < 3; i++) {
          var newScope = $rootScope.$new();
          var element = $compile('<div class="stagger-animation"></div>')(newScope);
          $animate.enter(element, container);
          elements.push(element);
        };

        $rootScope.$digest();
        $timeout.flush();

        expect(elements[0].attr('style')).toBeFalsy();

        expect(elements[1].attr('style')).toMatch(/transition-delay:\s+1.1\d*/);
        expect(elements[1].attr('style')).toMatch(/animation-delay: 1\.2\d*s,\s*2\.2\d*s/);

        expect(elements[2].attr('style')).toMatch(/transition-delay:\s+1.2\d*/);
        expect(elements[2].attr('style')).toMatch(/animation-delay: 1\.4\d*s,\s*2\.4\d*s/);

        for(var i = 0; i < 3; i++) {
          browserTrigger(elements[i],'transitionend', { timeStamp: Date.now() + 22000, elapsedTime: 22000 });
          expect(elements[i].attr('style')).toBeFalsy();
        }
      }));
    });

    describe('animation evaluation', function () {
      it('should re-evaluate the CSS classes for an animation each time',
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout, $compile) {

        ss.addRule('.abc.ng-enter', '-webkit-transition:22s linear all;' +
                                    'transition:22s linear all;');
        ss.addRule('.xyz.ng-enter', '-webkit-transition:11s linear all;' +
                                    'transition:11s linear all;');

        var parent = $compile('<div><span ng-class="klass"></span></div>')($rootScope);
        var element = parent.find('span');
        $rootElement.append(parent);
        angular.element(document.body).append($rootElement);

        $rootScope.klass = 'abc';
        $animate.enter(element, parent);
        $rootScope.$digest();

        if ($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('abc')).toBe(true);
          expect(element.hasClass('ng-enter')).toBe(true);
          expect(element.hasClass('ng-enter-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 22000, elapsedTime: 22 });
          $timeout.flush();
        }
        expect(element.hasClass('abc')).toBe(true);

        $rootScope.klass = 'xyz';
        $animate.enter(element, parent);
        $rootScope.$digest();

        if ($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('xyz')).toBe(true);
          expect(element.hasClass('ng-enter')).toBe(true);
          expect(element.hasClass('ng-enter-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
          $timeout.flush();
        }
        expect(element.hasClass('xyz')).toBe(true);
      }));

      it('should only append active to the newly append CSS className values',
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        ss.addRule('.ng-enter', '-webkit-transition:9s linear all;' +
                                        'transition:9s linear all;');
        ss.addRule('.ng-enter', '-webkit-transition:9s linear all;' +
                                        'transition:9s linear all;');

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        angular.element(document.body).append($rootElement);

        element.attr('class','one two');

        $animate.enter(element, parent);
        $rootScope.$digest();

        if($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('one')).toBe(true);
          expect(element.hasClass('two')).toBe(true);
          expect(element.hasClass('ng-enter')).toBe(true);
          expect(element.hasClass('ng-enter-active')).toBe(true);
          expect(element.hasClass('one-active')).toBe(false);
          expect(element.hasClass('two-active')).toBe(false);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
        }

        expect(element.hasClass('one')).toBe(true);
        expect(element.hasClass('two')).toBe(true);
      }));
    });

    describe("Callbacks", function() {
      beforeEach(function() {
        module(function($animateProvider) {
          $animateProvider.register('.custom', function($timeout) {
            return {
              removeClass : function(element, className, done) {
                $timeout(done, 2000);
              }
            }
          });
          $animateProvider.register('.other', function() {
            return {
              enter : function(element, done) {
                $timeout(done, 10000);
              }
            }
          });
        })
      });

      it("should fire the enter callback",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.enter(element, parent, null, function() {
          flag = true;
        });
        $rootScope.$digest();

        $timeout.flush();

        expect(flag).toBe(true);
      }));

      it("should fire the leave callback",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.leave(element, function() {
          flag = true;
        });
        $rootScope.$digest();

        $timeout.flush();

        expect(flag).toBe(true);
      }));

      it("should fire the move callback",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        var parent2 = jqLite('<div id="nice"></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.move(element, parent, parent2, function() {
          flag = true;
        });
        $rootScope.$digest();

        $timeout.flush();

        expect(flag).toBe(true);
        expect(element.parent().id).toBe(parent2.id);
      }));

      it("should fire the addClass/removeClass callbacks",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var signature = '';
        $animate.addClass(element, 'on', function() {
          signature += 'A';
        });

        $animate.removeClass(element, 'on', function() {
          signature += 'B';
        });

        $timeout.flush();

        expect(signature).toBe('AB');
      }));

      it("should fire a done callback when provided with no animation",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.removeClass(element, 'ng-hide', function() {
          flag = true;
        });

        $timeout.flush();
        expect(flag).toBe(true);
      }));

      it("should fire a done callback when provided with a css animation/transition",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        ss.addRule('.ng-hide-add', '-webkit-transition:1s linear all;' +
                                           'transition:1s linear all;');
        ss.addRule('.ng-hide-remove', '-webkit-transition:1s linear all;' +
                                              'transition:1s linear all;');

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = parent.find('span');

        var flag = false;
        $animate.removeClass(element, 'ng-hide', function() {
          flag = true;
        });

        if($sniffer.transitions) {
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }
        $timeout.flush();
        expect(flag).toBe(true);
      }));

      it("should fire a done callback when provided with a JS animation",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = parent.find('span');
        element.addClass('custom');

        var flag = false;
        $animate.removeClass(element, 'ng-hide', function() {
          flag = true;
        });

        $timeout.flush();
        expect(flag).toBe(true);
      }));

      it("should fire the callback right away if another animation is called right after",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

        ss.addRule('.ng-hide-add', '-webkit-transition:9s linear all;' +
                                           'transition:9s linear all;');
        ss.addRule('.ng-hide-remove', '-webkit-transition:9s linear all;' +
                                              'transition:9s linear all;');

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = parent.find('span');

        var signature = '';
        $animate.removeClass(element, 'ng-hide', function() {
          signature += 'A';
        });
        $animate.addClass(element, 'ng-hide', function() {
          signature += 'B';
        });

        $animate.addClass(element, 'ng-hide'); //earlier animation cancelled
        $timeout.flush();
        expect(signature).toBe('AB');
      }));
    });

    describe("addClass / removeClass", function() {
      var captured;
      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $animateProvider.register('.klassy', function($timeout) {
            return {
              addClass : function(element, className, done) {
                captured = 'addClass-' + className;
                $timeout(done, 500, false);
              },
              removeClass : function(element, className, done) {
                captured = 'removeClass-' + className;
                $timeout(done, 3000, false);
              }
            }
          });
        });
      });

      it("should not perform an animation, and the followup DOM operation, if the class is " +
         "already present during addClass or not present during removeClass on the element",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        var element = jqLite('<div class="klassy"></div>');
        $rootElement.append(element);
        body.append($rootElement);

        //skipped animations
        captured = 'none';
        $animate.removeClass(element, 'some-class');
        expect(element.hasClass('some-class')).toBe(false);
        expect(captured).toBe('none');

        element.addClass('some-class');

        captured = 'nothing';
        $animate.addClass(element, 'some-class');
        expect(captured).toBe('nothing');
        expect(element.hasClass('some-class')).toBe(true);

        //actual animations
        captured = 'none';
        $animate.removeClass(element, 'some-class');
        $timeout.flush();
        expect(element.hasClass('some-class')).toBe(false);
        expect(captured).toBe('removeClass-some-class');

        captured = 'nothing';
        $animate.addClass(element, 'some-class');
        $timeout.flush();
        expect(element.hasClass('some-class')).toBe(true);
        expect(captured).toBe('addClass-some-class');
      }));

      it("should add and remove CSS classes after an animation even if no animation is present",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        $animate.addClass(element,'klass');

        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass');

        expect(element.hasClass('klass')).toBe(false);
        expect(element.hasClass('klass-remove')).toBe(false);
        expect(element.hasClass('klass-remove-active')).toBe(false);
      }));

      it("should add and remove CSS classes with a callback",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klass', function() {
          signature += 'A';
        });

        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass', function() {
          signature += 'B';
        });

        $timeout.flush();
        expect(element.hasClass('klass')).toBe(false);
        expect(signature).toBe('AB');
      }));

      it("should end the current addClass animation, add the CSS class and then run the removeClass animation",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        ss.addRule('.klass-add', '-webkit-transition:3s linear all;' +
                                         'transition:3s linear all;');
        ss.addRule('.klass-remove', '-webkit-transition:3s linear all;' +
                                            'transition:3s linear all;');

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klass', function() {
          signature += '1';
        });

        if($sniffer.transitions) {
          expect(element.hasClass('klass-add')).toBe(true);
          $timeout.flush();
          expect(element.hasClass('klass')).toBe(true);
          expect(element.hasClass('klass-add-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
        }
        $timeout.flush();

        //this cancels out the older animation
        $animate.removeClass(element,'klass', function() {
          signature += '2';
        });

        if($sniffer.transitions) {
          expect(element.hasClass('klass-remove')).toBe(true);

          $timeout.flush();
          expect(element.hasClass('klass')).toBe(false);
          expect(element.hasClass('klass-add')).toBe(false);
          expect(element.hasClass('klass-add-active')).toBe(false);

          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
        }
        $timeout.flush();

        expect(element.hasClass('klass')).toBe(false);
        expect(signature).toBe('12');
      }));

      it("should properly execute JS animations and use callbacks when using addClass / removeClass",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klassy', function() {
          signature += 'X';
        });

        $timeout.flush(500);

        expect(element.hasClass('klassy')).toBe(true);

        $animate.removeClass(element,'klassy', function() {
          signature += 'Y';
        });

        $timeout.flush(3000);

        expect(element.hasClass('klassy')).toBe(false);

        expect(signature).toBe('XY');
      }));

      it("should properly execute CSS animations/transitions and use callbacks when using addClass / removeClass",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        ss.addRule('.klass-add', '-webkit-transition:11s linear all;' +
                                         'transition:11s linear all;');
        ss.addRule('.klass-remove', '-webkit-transition:11s linear all;' +
                                            'transition:11s linear all;');

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klass', function() {
          signature += 'd';
        });

        if($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('klass-add')).toBe(true);
          expect(element.hasClass('klass-add-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
          expect(element.hasClass('klass-add')).toBe(false);
          expect(element.hasClass('klass-add-active')).toBe(false);
        }

        $timeout.flush();
        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass', function() {
          signature += 'b';
        });

        if($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('klass-remove')).toBe(true);
          expect(element.hasClass('klass-remove-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
          expect(element.hasClass('klass-remove')).toBe(false);
          expect(element.hasClass('klass-remove-active')).toBe(false);
        }

        $timeout.flush();
        expect(element.hasClass('klass')).toBe(false);

        expect(signature).toBe('db');
      }));

      it("should allow for multiple css classes to be animated plus a callback when added",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        ss.addRule('.one-add', '-webkit-transition:7s linear all;' +
                                       'transition:7s linear all;');
        ss.addRule('.two-add', '-webkit-transition:7s linear all;' +
                                       'transition:7s linear all;');

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var flag = false;
        $animate.addClass(element,'one two', function() {
          flag = true;
        });

        if($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('one-add')).toBe(true);
          expect(element.hasClass('two-add')).toBe(true);

          expect(element.hasClass('one-add-active')).toBe(true);
          expect(element.hasClass('two-add-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 7000, elapsedTime: 7 });

          expect(element.hasClass('one-add')).toBe(false);
          expect(element.hasClass('one-add-active')).toBe(false);
          expect(element.hasClass('two-add')).toBe(false);
          expect(element.hasClass('two-add-active')).toBe(false);
        }

        $timeout.flush();

        expect(element.hasClass('one')).toBe(true);
        expect(element.hasClass('two')).toBe(true);

        expect(flag).toBe(true);
      }));

      it("should allow for multiple css classes to be animated plus a callback when removed",
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

        ss.addRule('.one-remove', '-webkit-transition:9s linear all;' +
                                          'transition:9s linear all;');
        ss.addRule('.two-remove', '-webkit-transition:9s linear all;' +
                                          'transition:9s linear all;');

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        element.addClass('one two');
        expect(element.hasClass('one')).toBe(true);
        expect(element.hasClass('two')).toBe(true);

        var flag = false;
        $animate.removeClass(element,'one two', function() {
          flag = true;
        });

        if($sniffer.transitions) {
          $timeout.flush();
          expect(element.hasClass('one-remove')).toBe(true);
          expect(element.hasClass('two-remove')).toBe(true);

          expect(element.hasClass('one-remove-active')).toBe(true);
          expect(element.hasClass('two-remove-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 9000, elapsedTime: 9 });

          expect(element.hasClass('one-remove')).toBe(false);
          expect(element.hasClass('one-remove-active')).toBe(false);
          expect(element.hasClass('two-remove')).toBe(false);
          expect(element.hasClass('two-remove-active')).toBe(false);
        }

        $timeout.flush();

        expect(element.hasClass('one')).toBe(false);
        expect(element.hasClass('two')).toBe(false);

        expect(flag).toBe(true);
      }));
    });
  });

  var $rootElement, $document;
  beforeEach(module(function() {
    return function(_$rootElement_, _$document_, $animate) {
      $rootElement = _$rootElement_;
      $document = _$document_;
      $animate.enabled(true);
    }
  }));

  function html(element) {
    var body = jqLite($document[0].body);
    $rootElement.append(element);
    body.append($rootElement);
    return element;
  }

  it("should properly animate and parse CSS3 transitions",
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

    ss.addRule('.ng-enter', '-webkit-transition:1s linear all;' +
                                    'transition:1s linear all;');

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div>...</div>')($rootScope);

    $animate.enter(child, element);
    $rootScope.$digest();

    if($sniffer.transitions) {
      $timeout.flush();
      expect(child.hasClass('ng-enter')).toBe(true);
      expect(child.hasClass('ng-enter-active')).toBe(true);
      browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
    }

    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);
  }));

  it("should properly animate and parse CSS3 animations",
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

    ss.addRule('.ng-enter', '-webkit-animation: some_animation 4s linear 1s 2 alternate;' +
                                    'animation: some_animation 4s linear 1s 2 alternate;');

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div>...</div>')($rootScope);

    $animate.enter(child, element);
    $rootScope.$digest();

    if($sniffer.transitions) {
      $timeout.flush();
      expect(child.hasClass('ng-enter')).toBe(true);
      expect(child.hasClass('ng-enter-active')).toBe(true);
      browserTrigger(child,'transitionend', { timeStamp: Date.now() + 9000, elapsedTime: 9 });
    }
    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);
  }));

  it("should not set the transition property flag if only CSS animations are used",
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

    if (!$sniffer.animations) return;

    ss.addRule('.sleek-animation.ng-enter', '-webkit-animation: my_animation 2s linear;' +
                                            'animation: my_animation 2s linear');

    ss.addRule('.trans.ng-enter',  '-webkit-transition:1s linear all;' +
                                           'transition:1s linear all');

    var propertyKey = ($sniffer.vendorPrefix == 'Webkit' ? '-webkit-' : '') + 'transition-property';

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div class="skeep-animation">...</div>')($rootScope);
    child.css(propertyKey,'background-color');

    $animate.enter(child, element);
    $rootScope.$digest();
    $timeout.flush();

    browserTrigger(child,'transitionend', { timeStamp: Date.now() + 2000, elapsedTime: 2 });

    expect(child.css(propertyKey)).toBe('background-color');
    child.remove();

    child = $compile('<div class="sleek-animation">...</div>')($rootScope);
    child.attr('class','trans');
    $animate.enter(child, element);
    $rootScope.$digest();

    expect(child.css(propertyKey)).not.toBe('background-color');
  }));

  it("should skip animations if the browser does not support CSS3 transitions and CSS3 animations",
    inject(function($compile, $rootScope, $animate, $sniffer) {

    $sniffer.animations = false;
    $sniffer.transitions = false;

    ss.addRule('.ng-enter', '-webkit-animation: some_animation 4s linear 1s 2 alternate;' +
                                    'animation: some_animation 4s linear 1s 2 alternate;');

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div>...</div>')($rootScope);

    expect(child.hasClass('ng-enter')).toBe(false);
    $animate.enter(child, element);
    $rootScope.$digest();
    expect(child.hasClass('ng-enter')).toBe(false);
  }));

  it("should run other defined animations inline with CSS3 animations", function() {
    module(function($animateProvider) {
      $animateProvider.register('.custom', function($timeout) {
        return {
          enter : function(element, done) {
            element.addClass('i-was-animated');
            $timeout(done, 10, false);
          }
        }
      });
    })
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

      ss.addRule('.ng-enter', '-webkit-transition: 1s linear all;' +
                                      'transition: 1s linear all;');

      var element = html($compile('<div>...</div>')($rootScope));
      var child = $compile('<div>...</div>')($rootScope);

      expect(child.hasClass('i-was-animated')).toBe(false);

      child.addClass('custom');
      $animate.enter(child, element);
      $rootScope.$digest();

      $timeout.flush(10);

      if($sniffer.transitions) {
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
      }

      expect(child.hasClass('i-was-animated')).toBe(true);
    });
  });

  it("should properly cancel CSS transitions or animations if another animation is fired", function() {
    module(function($animateProvider) {
      $animateProvider.register('.usurper', function($timeout) {
        return {
          leave : function(element, done) {
            element.addClass('this-is-mine-now');
            $timeout(done, 55, false);
          }
        }
      });
    });
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {
      ss.addRule('.ng-enter', '-webkit-transition: 2s linear all;' +
                                      'transition: 2s linear all;');
      ss.addRule('.ng-leave', '-webkit-transition: 2s linear all;' +
                                      'transition: 2s linear all;');

      var element = html($compile('<div>...</div>')($rootScope));
      var child = $compile('<div>...</div>')($rootScope);

      $animate.enter(child, element);
      $rootScope.$digest();

      //this is added/removed right away otherwise
      if($sniffer.transitions) {
        $timeout.flush();
        expect(child.hasClass('ng-enter')).toBe(true);
        expect(child.hasClass('ng-enter-active')).toBe(true);
      }

      expect(child.hasClass('this-is-mine-now')).toBe(false);
      child.addClass('usurper');
      $animate.leave(child);
      $rootScope.$digest();
      $timeout.flush();

      expect(child.hasClass('ng-enter')).toBe(false);
      expect(child.hasClass('ng-enter-active')).toBe(false);

      expect(child.hasClass('usurper')).toBe(true);
      expect(child.hasClass('this-is-mine-now')).toBe(true);

      $timeout.flush(55);
    });
  });

  it("should not perform the active class animation if the animation has been cancelled before the reflow occurs", function() {
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {
      if(!$sniffer.transitions) return;

      ss.addRule('.animated.ng-enter', '-webkit-transition: 2s linear all;' +
                                               'transition: 2s linear all;');

      var element = html($compile('<div>...</div>')($rootScope));
      var child = $compile('<div class="animated">...</div>')($rootScope);

      $animate.enter(child, element);
      $rootScope.$digest();

      expect(child.hasClass('ng-enter')).toBe(true);

      $animate.leave(child);
      $rootScope.$digest();

      $timeout.flush();
      expect(child.hasClass('ng-enter-active')).toBe(false);
    });
  });

//  it("should add and remove CSS classes and perform CSS animations during the process",
//    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {
//
//    ss.addRule('.on-add', '-webkit-transition: 10s linear all; ' +
//                                  'transition: 10s linear all;');
//    ss.addRule('.on-remove', '-webkit-transition: 10s linear all; ' +
//                                     'transition: 10s linear all;');
//
//    var element = html($compile('<div></div>')($rootScope));
//
//    expect(element.hasClass('on')).toBe(false);
//
//    $animate.addClass(element, 'on');
//
//    if($sniffer.transitions) {
//      expect(element.hasClass('on')).toBe(false);
//      expect(element.hasClass('on-add')).toBe(true);
//      $timeout.flush();
//    }
//
//    $timeout.flush();
//
//    expect(element.hasClass('on')).toBe(true);
//    expect(element.hasClass('on-add')).toBe(false);
//    expect(element.hasClass('on-add-active')).toBe(false);
//
//    $animate.removeClass(element, 'on');
//    if($sniffer.transitions) {
//      expect(element.hasClass('on')).toBe(true);
//      expect(element.hasClass('on-remove')).toBe(true);
//      $timeout.flush(10000);
//    }
//
//    $timeout.flush();
//    expect(element.hasClass('on')).toBe(false);
//    expect(element.hasClass('on-remove')).toBe(false);
//    expect(element.hasClass('on-remove-active')).toBe(false);
//  }));
//
//  it("should show and hide elements with CSS & JS animations being performed in the process", function() {
//    module(function($animateProvider) {
//      $animateProvider.register('.displayer', function($timeout) {
//        return {
//          removeClass : function(element, className, done) {
//            element.removeClass('hiding');
//            element.addClass('showing');
//            $timeout(done, 25, false);
//          },
//          addClass : function(element, className, done) {
//            element.removeClass('showing');
//            element.addClass('hiding');
//            $timeout(done, 555, false);
//          }
//        }
//      });
//    })
//    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {
//
//      ss.addRule('.ng-hide-add', '-webkit-transition: 5s linear all;' +
//                                         'transition: 5s linear all;');
//      ss.addRule('.ng-hide-remove', '-webkit-transition: 5s linear all;' +
//                                            'transition: 5s linear all;');
//
//      var element = html($compile('<div></div>')($rootScope));
//
//      element.addClass('displayer');
//
//      expect(element).toBeShown();
//      expect(element.hasClass('showing')).toBe(false);
//      expect(element.hasClass('hiding')).toBe(false);
//
//      $animate.addClass(element, 'ng-hide');
//
//      if($sniffer.transitions) {
//        expect(element).toBeShown(); //still showing
//        $timeout.flush();
//        expect(element).toBeShown();
//        $timeout.flush(5555);
//      }
//      $timeout.flush();
//      expect(element).toBeHidden();
//
//      expect(element.hasClass('showing')).toBe(false);
//      expect(element.hasClass('hiding')).toBe(true);
//      $animate.removeClass(element, 'ng-hide');
//
//      if($sniffer.transitions) {
//        expect(element).toBeHidden();
//        $timeout.flush();
//        expect(element).toBeHidden();
//        $timeout.flush(5580);
//      }
//      $timeout.flush();
//      expect(element).toBeShown();
//
//      expect(element.hasClass('showing')).toBe(true);
//      expect(element.hasClass('hiding')).toBe(false);
//    });
//  });
  it("should remove all the previous classes when the next animation is applied before a reflow", function() {
    var fn, interceptedClass;
    module(function($animateProvider) {
      $animateProvider.register('.three', function() {
        return {
          move : function(element, done) {
            fn = function() {
              done();
            }
            return function() {
              interceptedClass = element.attr('class');
            }
          }
        }
      });
    });
    inject(function($compile, $rootScope, $animate, $timeout) {
      var parent = html($compile('<div class="parent"></div>')($rootScope));
      var one = $compile('<div class="one"></div>')($rootScope);
      var two = $compile('<div class="two"></div>')($rootScope);
      var three = $compile('<div class="three klass"></div>')($rootScope);

      parent.append(one);
      parent.append(two);
      parent.append(three);

      $animate.move(three, null, two);
      $rootScope.$digest();

      $animate.move(three, null, one);
      $rootScope.$digest();

      //this means that the former animation was cleaned up before the new one starts
      expect(interceptedClass.indexOf('ng-animate') >= 0).toBe(false);
    });
  });

  it("should provide the correct CSS class to the addClass and removeClass callbacks within a JS animation", function() {
    module(function($animateProvider) {
      $animateProvider.register('.classify', function() {
        return {
          removeClass : function(element, className, done) {
            element.data('classify','remove-' + className);
            done();
          },
          addClass : function(element, className, done) {
            element.data('classify','add-' + className);
            done();
          }
        }
      });
    })
    inject(function($compile, $rootScope, $animate) {
      var element = html($compile('<div class="classify"></div>')($rootScope));

      $animate.addClass(element, 'super');
      expect(element.data('classify')).toBe('add-super');

      $animate.removeClass(element, 'super');
      expect(element.data('classify')).toBe('remove-super');

      $animate.addClass(element, 'superguy');
      expect(element.data('classify')).toBe('add-superguy');
    });
  });

  it("should not skip ngAnimate animations when any pre-existing CSS transitions are present on the element", function() {
    inject(function($compile, $rootScope, $animate, $timeout, $sniffer) {
      if(!$sniffer.transitions) return;

      var element = html($compile('<div class="animated parent"></div>')($rootScope));
      var child   = html($compile('<div class="animated child"></div>')($rootScope));

      ss.addRule('.animated',  '-webkit-transition:1s linear all;' +
                                       'transition:1s linear all;');
      ss.addRule('.super-add', '-webkit-transition:2s linear all;' +
                                       'transition:2s linear all;');

      $rootElement.append(element);
      jqLite(document.body).append($rootElement);

      $animate.addClass(element, 'super');

      var empty = true;
      try {
        $timeout.flush();
        empty = false;
      }
      catch(e) {}

      expect(empty).toBe(false);
    });
  });

  it("should wait until both the duration and delay are complete to close off the animation",
    inject(function($compile, $rootScope, $animate, $timeout, $sniffer) {

    if(!$sniffer.transitions) return;

    var element = html($compile('<div class="animated parent"></div>')($rootScope));
    var child   = html($compile('<div class="animated child"></div>')($rootScope));

    ss.addRule('.animated.ng-enter',  '-webkit-transition: width 1s, background 1s 1s;' +
                                              'transition: width 1s, background 1s 1s;');

    $rootElement.append(element);
    jqLite(document.body).append($rootElement);

    $animate.enter(child, element);
    $rootScope.$digest();
    $timeout.flush();

    expect(child.hasClass('ng-enter')).toBe(true);
    expect(child.hasClass('ng-enter-active')).toBe(true);

    browserTrigger(child, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 0 });

    expect(child.hasClass('ng-enter')).toBe(true);
    expect(child.hasClass('ng-enter-active')).toBe(true);

    browserTrigger(child, 'transitionend', { timeStamp: Date.now() + 2000, elapsedTime: 2 });

    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);

    expect(element.contents().length).toBe(1);
  }));

  it("should cancel all child animations when a leave or move animation is triggered on a parent element", function() {

    var step, animationState;
    module(function($animateProvider) {
      $animateProvider.register('.animan', function($timeout) {
        return {
          enter : function(element, done) {
            animationState = 'enter';
            step = done;
            return function(cancelled) {
              animationState = cancelled ? 'enter-cancel' : animationState;
            }
          },
          addClass : function(element, className, done) {
            animationState = 'addClass';
            step = done;
            return function(cancelled) {
              animationState = cancelled ? 'addClass-cancel' : animationState;
            }
          }
        };
      });
    });

    inject(function($animate, $compile, $rootScope, $timeout, $sniffer) {
      var element = html($compile('<div class="parent"></div>')($rootScope));
      var container = html($compile('<div class="container"></div>')($rootScope));
      var child   = html($compile('<div class="animan child"></div>')($rootScope));

      ss.addRule('.animan.ng-enter, .animan.something-add',  '-webkit-transition: width 1s, background 1s 1s;' +
                                                             'transition: width 1s, background 1s 1s;');

      $rootElement.append(element);
      jqLite(document.body).append($rootElement);

      $animate.enter(child, element);
      $rootScope.$digest();

      expect(animationState).toBe('enter');
      if($sniffer.transitions) {
        expect(child.hasClass('ng-enter')).toBe(true);
        $timeout.flush();
        expect(child.hasClass('ng-enter-active')).toBe(true);
      }

      $animate.move(element, container);
      if($sniffer.transitions) {
        expect(child.hasClass('ng-enter')).toBe(false);
        expect(child.hasClass('ng-enter-active')).toBe(false);
      }

      expect(animationState).toBe('enter-cancel');

      $rootScope.$digest();
      $timeout.flush();

      $animate.addClass(child, 'something');
      if($sniffer.transitions) {
        $timeout.flush();
      }
      expect(animationState).toBe('addClass');
      if($sniffer.transitions) {
        expect(child.hasClass('something-add')).toBe(true);
        expect(child.hasClass('something-add-active')).toBe(true);
      }

      $animate.leave(container);
      expect(animationState).toBe('addClass-cancel');
      if($sniffer.transitions) {
        expect(child.hasClass('something-add')).toBe(false);
        expect(child.hasClass('something-add-active')).toBe(false);
      }
    });
  });

  it("should wait until a queue of animations are complete before performing a reflow",
    inject(function($rootScope, $compile, $timeout,$sniffer) {

    if(!$sniffer.transitions) return;

    $rootScope.items = [1,2,3,4,5];
    var element = html($compile('<div><div class="animated" ng-repeat="item in items"></div></div>')($rootScope));

    ss.addRule('.animated.ng-enter',  '-webkit-transition: width 1s, background 1s 1s;' +
                                              'transition: width 1s, background 1s 1s;');

    $rootScope.$digest();
    expect(element[0].querySelectorAll('.ng-enter-active').length).toBe(0);
    $timeout.flush();
    expect(element[0].querySelectorAll('.ng-enter-active').length).toBe(5);

    forEach(element.children(), function(kid) {
      browserTrigger(kid, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
    });

    expect(element[0].querySelectorAll('.ng-enter-active').length).toBe(0);
  }));


  it("should work to disable all child animations for an element", function() {
    var childAnimated = false,
        containerAnimated = false;
    module(function($animateProvider) {
      $animateProvider.register('.child', function() {
        return {
          addClass : function(element, className, done) {
            childAnimated = true;
            done();
          }
        }
      });
      $animateProvider.register('.container', function() {
        return {
          leave : function(element, done) {
            containerAnimated = true;
            done();
          }
        }
      });
    });
      
    inject(function($compile, $rootScope, $animate, $timeout, $rootElement) {
      $animate.enabled(true);

      var element = $compile('<div class="container"></div>')($rootScope);
      jqLite($document[0].body).append($rootElement);
      $rootElement.append(element);

      var child = $compile('<div class="child"></div>')($rootScope);
      element.append(child);

      $animate.enabled(true, element);

      $animate.addClass(child, 'awesome');
      expect(childAnimated).toBe(true);

      childAnimated = false;
      $animate.enabled(false, element);

      $animate.addClass(child, 'super');
      expect(childAnimated).toBe(false);

      $animate.leave(element);
      $rootScope.$digest();
      expect(containerAnimated).toBe(true);
    });
  });

  it("should disable all child animations on structural animations until the first reflow has passed", function() {
    var intercepted;
    module(function($animateProvider) {
      $animateProvider.register('.animated', function() {
        return {
          enter : ani('enter'),
          leave : ani('leave'),
          move : ani('move'),
          addClass : ani('addClass'),
          removeClass : ani('removeClass')
        };

        function ani(type) {
          return function(element, className, done) {
            intercepted = type;
            (done || className)();
          }
        }
      });
    });

    inject(function($animate, $rootScope, $sniffer, $timeout, $compile, _$rootElement_) {
      $rootElement = _$rootElement_;

      $animate.enabled(true);
      $rootScope.$digest();

      var element = $compile('<div class="element animated">...</div>')($rootScope);
      var child1 = $compile('<div class="child1 animated">...</div>')($rootScope);
      var child2 = $compile('<div class="child2 animated">...</div>')($rootScope);
      var container = $compile('<div class="container">...</div>')($rootScope);

      jqLite($document[0].body).append($rootElement);
      $rootElement.append(container);
      element.append(child1);
      element.append(child2);

      $animate.move(element, null, container);
      $rootScope.$digest();

      expect(intercepted).toBe('move');

      $animate.addClass(child1, 'test');
      expect(child1.hasClass('test')).toBe(true);

      expect(intercepted).toBe('move');
      $animate.leave(child1);
      $rootScope.$digest();

      expect(intercepted).toBe('move');

      //reflow has passed
      $timeout.flush();

      $animate.leave(child2);
      $rootScope.$digest();
      expect(intercepted).toBe('leave');
    });
  });

  it("should not disable any child animations when any parent class-based animations are run", function() {
    var intercepted;
    module(function($animateProvider) {
      $animateProvider.register('.animated', function() {
        return {
          enter : function(element, done) {
            intercepted = true;
            done();
          }
        }
      });
    });

    inject(function($animate, $rootScope, $sniffer, $timeout, $compile, $document, $rootElement) {
      $animate.enabled(true);

      var element = $compile('<div ng-class="{klass:bool}"> <div ng-if="bool" class="animated">value</div></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $rootScope.bool = true;
      $rootScope.$digest();
      expect(intercepted).toBe(true);
    });
  });

  it("should cache the response from getComputedStyle if each successive element has the same className value and parent until the first reflow hits", function() {
    var count = 0;
    module(function($provide) {
      $provide.value('$window', {
        document : jqLite(window.document),
        getComputedStyle: function(element) {
          count++;
          return window.getComputedStyle(element);
        }
      });
    });

    inject(function($animate, $rootScope, $compile, $rootElement, $timeout, $document, $sniffer) {
    if(!$sniffer.transitions) return;

      $animate.enabled(true);

      var element = $compile('<div></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      for(var i=0;i<20;i++) {
        var kid = $compile('<div class="kid"></div>')($rootScope);
        $animate.enter(kid, element);
      }
      $rootScope.$digest();
      $timeout.flush();

      //called three times since the classname is the same
      expect(count).toBe(2);

      dealoc(element);
      count = 0;

      for(var i=0;i<20;i++) {
        var kid = $compile('<div class="kid c-'+i+'"></div>')($rootScope);
        $animate.enter(kid, element);
      }

      $rootScope.$digest();
      $timeout.flush();

      expect(count).toBe(20);
    });
  });

  it("should cancel an ongoing class-based animation only if the new class contains transition/animation CSS code",
    inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

    if (!$sniffer.transitions) return;

    ss.addRule('.green-add', '-webkit-transition:1s linear all;' +
                                     'transition:1s linear all;');

    ss.addRule('.blue-add', 'background:blue;');

    ss.addRule('.red-add', '-webkit-transition:1s linear all;' +
                                   'transition:1s linear all;');

    ss.addRule('.yellow-add', '-webkit-animation: some_animation 4s linear 1s 2 alternate;' +
                                      'animation: some_animation 4s linear 1s 2 alternate;');

    var element = $compile('<div></div>')($rootScope);
    $rootElement.append(element);
    jqLite($document[0].body).append($rootElement);

    $animate.addClass(element, 'green');
    expect(element.hasClass('green-add')).toBe(true);
 
    $animate.addClass(element, 'blue');
    expect(element.hasClass('blue')).toBe(true); 
    expect(element.hasClass('green-add')).toBe(true); //not cancelled

    $animate.addClass(element, 'red');
    expect(element.hasClass('green-add')).toBe(false);
    expect(element.hasClass('red-add')).toBe(true);

    $animate.addClass(element, 'yellow');
    expect(element.hasClass('red-add')).toBe(false); 
    expect(element.hasClass('yellow-add')).toBe(true);
  }));

  it('should enable and disable animations properly on the root element', function() {
    var count = 0;
    module(function($animateProvider) {
      $animateProvider.register('.animated', function() {
        return {
          addClass : function(element, className, done) {
            count++;
            done();
          }
        }
      });
    });
    inject(function($compile, $rootScope, $animate, $sniffer, $rootElement, $timeout) {

      $rootElement.addClass('animated');
      $animate.addClass($rootElement, 'green');
      expect(count).toBe(1);

      $animate.addClass($rootElement, 'red');
      expect(count).toBe(2);
    });
  });

  it('should perform pre and post animations', function() {
    var steps = []; 
    module(function($animateProvider) {
      $animateProvider.register('.class-animate', function() {
        return {
          beforeAddClass : function(element, className, done) {
            steps.push('before');
            done();
          },
          addClass : function(element, className, done) {
            steps.push('after');
            done();
          }
        };
      });
    });
    inject(function($animate, $rootScope, $compile, $rootElement, $timeout) {
      $animate.enabled(true);

      var element = $compile('<div class="class-animate"></div>')($rootScope);
      $rootElement.append(element);

      $animate.addClass(element, 'red');

      expect(steps).toEqual(['before','after']);
    });
  });

  it('should treat the leave event always as a before event and discard the beforeLeave function', function() {
    var parentID, steps = []; 
    module(function($animateProvider) {
      $animateProvider.register('.animate', function() {
        return {
          beforeLeave : function(element, done) {
            steps.push('before');
            done();
          },
          leave : function(element, done) {
            parentID = element.parent().attr('id');
            steps.push('after');
            done();
          }
        };
      });
    });
    inject(function($animate, $rootScope, $compile, $rootElement) {
      $animate.enabled(true);

      var element = $compile('<div id="parentGuy"></div>')($rootScope);
      var child = $compile('<div class="animate"></div>')($rootScope);
      $rootElement.append(element);
      element.append(child);

      $animate.leave(child);
      $rootScope.$digest();

      expect(steps).toEqual(['after']);
      expect(parentID).toEqual('parentGuy');
    });
  });

});
