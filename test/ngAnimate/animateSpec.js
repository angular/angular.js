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

      it("should disable and enable the animations", function() {
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

            angular.forEach(['.ng-hide-add', '.ng-hide-remove', '.ng-enter', '.ng-leave', '.ng-move'], function(selector) {
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
        inject(function($animate, $rootScope, $sniffer) {
        element[0].removeChild(child[0]);

        expect(element.contents().length).toBe(0);
        $animate.enter(child, element);
        $rootScope.$digest();

        if($sniffer.transitions) {
          expect(child.hasClass('ng-enter')).toBe(true);
          expect(child.hasClass('ng-enter-active')).toBe(true);
          browserTrigger(element, 'transitionend', { timeStamp: Date.now() + 1000 });
        }

        expect(element.contents().length).toBe(1);
      }));

      it("should animate the leave animation event",
        inject(function($animate, $rootScope, $sniffer) {

        expect(element.contents().length).toBe(1);
        $animate.leave(child);
        $rootScope.$digest();

        if($sniffer.transitions) {
          expect(child.hasClass('ng-leave')).toBe(true);
          expect(child.hasClass('ng-leave-active')).toBe(true);
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
        }

        expect(element.contents().length).toBe(0);
      }));

      it("should animate the move animation event",
        inject(function($animate, $compile, $rootScope) {

        $rootScope.$digest();
        element.html('');

        var child1 = $compile('<div>1</div>')($rootScope);
        var child2 = $compile('<div>2</div>')($rootScope);
        element.append(child1);
        element.append(child2);
        expect(element.text()).toBe('12');
        $animate.move(child1, element, child2);
        $rootScope.$digest();
        expect(element.text()).toBe('21');
      }));

      it("should animate the show animation event",
        inject(function($animate, $rootScope, $sniffer) {

        $rootScope.$digest();
        child.addClass('ng-hide');
        expect(child).toBeHidden();
        $animate.removeClass(child, 'ng-hide');
        if($sniffer.transitions) {
          expect(child.hasClass('ng-hide-remove')).toBe(true);
          expect(child.hasClass('ng-hide-remove-active')).toBe(true);
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
        }
        expect(child.hasClass('ng-hide-remove')).toBe(false);
        expect(child.hasClass('ng-hide-remove-active')).toBe(false);
        expect(child).toBeShown();
      }));

      it("should animate the hide animation event",
        inject(function($animate, $rootScope, $sniffer) {

        $rootScope.$digest();
        expect(child).toBeShown();
        $animate.addClass(child, 'ng-hide');
        if($sniffer.transitions) {
          expect(child.hasClass('ng-hide-add')).toBe(true);
          expect(child.hasClass('ng-hide-add-active')).toBe(true);
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
        }
        expect(child).toBeHidden();
      }));

      it("should assign the ng-event className to all animation events when transitions/keyframes are used",
        inject(function($animate, $sniffer, $rootScope) {

        if (!$sniffer.transitions) return;

        $rootScope.$digest();
        element[0].removeChild(child[0]);

        //enter
        $animate.enter(child, element);
        $rootScope.$digest();

        expect(child.attr('class')).toContain('ng-enter');
        expect(child.attr('class')).toContain('ng-enter-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });

        //move
        element.append(after);
        $animate.move(child, element, after);
        $rootScope.$digest();

        expect(child.attr('class')).toContain('ng-move');
        expect(child.attr('class')).toContain('ng-move-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });

        //hide
        $animate.addClass(child, 'ng-hide');
        expect(child.attr('class')).toContain('ng-hide-add');
        expect(child.attr('class')).toContain('ng-hide-add-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });

        //show
        $animate.removeClass(child, 'ng-hide');
        expect(child.attr('class')).toContain('ng-hide-remove');
        expect(child.attr('class')).toContain('ng-hide-remove-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });

        //leave
        $animate.leave(child);
        $rootScope.$digest();
        expect(child.attr('class')).toContain('ng-leave');
        expect(child.attr('class')).toContain('ng-leave-active');
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
      }));

      it("should not run if animations are disabled",
        inject(function($animate, $rootScope) {

        $animate.enabled(false);

        $rootScope.$digest();

        element.addClass('setup-memo');

        element.text('123');
        expect(element.text()).toBe('123');
        $animate.removeClass(element, 'ng-hide');
        expect(element.text()).toBe('123');

        $animate.enabled(true);

        $animate.removeClass(element, 'ng-hide');
        expect(element.text()).toBe('memento');
      }));

      it("should only call done() once and right away if another animation takes place in between",
        inject(function($animate, $rootScope, $sniffer, $timeout) {

        element.append(child);
        child.addClass('custom-delay');

        expect(element).toBeShown();
        $animate.addClass(child, 'ng-hide');
        expect(child).toBeShown();

        $animate.leave(child);
        $rootScope.$digest();
        expect(child).toBeHidden(); //hides instantly

        //lets change this to prove that done doesn't fire anymore for the previous hide() operation
        child.css('display','block');
        child.removeClass('ng-hide');

        if($sniffer.transitions) {
          expect(element.children().length).toBe(1); //still animating
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
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
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
        }
        $timeout.flush(2000);

        $animate.addClass(child, 'ng-hide');

        expect(child.hasClass('animation-cancelled')).toBe(true);
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
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000 });
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
          inject(function($animate, $rootScope, $compile, $sniffer) {

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
            browserTrigger(element,'animationend', { timeStamp: Date.now() + 4000 });
          }
          expect(element).toBeShown();
        }));

        it("should properly detect and make use of CSS Animations with multiple iterations",
          inject(function($animate, $rootScope, $compile, $sniffer) {

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
            browserTrigger(element,'animationend', { timeStamp: Date.now() + 6000 });
          }
          expect(element).toBeShown();
        }));

        it("should fallback to the animation duration if an infinite iteration is provided",
          inject(function($animate, $rootScope, $compile, $sniffer) {

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
            browserTrigger(element,'animationend', { timeStamp: Date.now() + 2000 });
          }
          expect(element).toBeShown();
        }));

        it("should not consider the animation delay is provided",
          inject(function($animate, $rootScope, $compile, $sniffer) {

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
            browserTrigger(element,'animationend', { timeStamp : Date.now() + 20000 });
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
          inject(function($animate, $rootScope, $compile, $sniffer) {
            var style = '-webkit-animation: some_animation 2s linear 0s 1 alternate;' +
                                'animation: some_animation 2s linear 0s 1 alternate;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>1</div>'))($rootScope);
            element.addClass('custom');

            $animate.removeClass(element, 'ng-hide');
            if($sniffer.animations) {
              expect(element.hasClass('ng-hide-remove')).toBe(true);
              expect(element.hasClass('ng-hide-remove-active')).toBe(true);
            }

            $animate.addClass(element, 'ng-hide');
            expect(element.hasClass('ng-hide-remove')).toBe(false); //added right away


            if($sniffer.animations) { //cleanup some pending animations
              expect(element.hasClass('ng-hide-add')).toBe(true);
              expect(element.hasClass('ng-hide-add-active')).toBe(true);
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 2000 });
            }

            expect(element.hasClass('ng-hide-remove-active')).toBe(false);
        }));
      });

      describe("Transitions", function() {
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
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000 });
          }
          expect(element).toBeShown();
        }));

        it("should skip animations if disabled and run when enabled picking the longest specified duration",
          inject(function($animate, $rootScope, $compile, $sniffer) {

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
              expect(element).toBeHidden();
              var now = Date.now();
              browserTrigger(element,'transitionend', { timeStamp: now + 1000 });
              browserTrigger(element,'transitionend', { timeStamp: now + 1000 });
              browserTrigger(element,'transitionend', { timeStamp: now + 2000 });
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
              var now = Date.now();
              browserTrigger(element,'transitionend', { timeStamp: now + 1000 });
              browserTrigger(element,'transitionend', { timeStamp: now + 3000 });
              browserTrigger(element,'transitionend', { timeStamp: now + 3000 });
            }
            expect(element).toBeShown();
        }));

        it("should animate for the highest duration",
          inject(function($animate, $rootScope, $compile, $sniffer) {
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
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 11000 });
            }
            expect(element).toBeShown();
        }));

        it("should finish the previous transition when a new animation is started",
          inject(function($animate, $rootScope, $compile, $sniffer) {
            var style = '-webkit-transition: 1s linear all;' +
                                'transition: 1s linear all;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>1</div>'))($rootScope);

            element.addClass('ng-hide');
            $animate.removeClass(element, 'ng-hide');
            if($sniffer.transitions) {
              expect(element.hasClass('ng-hide-remove')).toBe(true);
              expect(element.hasClass('ng-hide-remove-active')).toBe(true);
              browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000 });
            }
            expect(element.hasClass('ng-hide-remove')).toBe(false);
            expect(element.hasClass('ng-hide-remove-active')).toBe(false);
            expect(element).toBeShown();

            $animate.addClass(element, 'ng-hide');
            if($sniffer.transitions) {
              expect(element.hasClass('ng-hide-add')).toBe(true);
              expect(element.hasClass('ng-hide-add-active')).toBe(true);
            }
        }));
      });
    });

    describe('animation evaluation', function () {
      it('should re-evaluate the CSS classes for an animation each time',
        inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout, $compile) {

        ss.addRule('.abc', '-webkit-transition:22s linear all;' +
                                   'transition:22s linear all;');
        ss.addRule('.xyz', '-webkit-transition:11s linear all;' +
                                   'transition:11s linear all;');

        var parent = $compile('<div><span ng-class="klass"></span></div>')($rootScope);
        var element = parent.find('span');
        $rootElement.append(parent);
        angular.element(document.body).append($rootElement);

        $rootScope.klass = 'abc';
        $animate.enter(element, parent);
        $rootScope.$digest();

        if ($sniffer.transitions) {
          expect(element.hasClass('abc ng-enter')).toBe(true);
          expect(element.hasClass('abc ng-enter ng-enter-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 22000 });
        }
        expect(element.hasClass('abc')).toBe(true);

        $rootScope.klass = 'xyz';
        $animate.enter(element, parent);
        $rootScope.$digest();

        if ($sniffer.transitions) {
          expect(element.hasClass('xyz')).toBe(true);
          expect(element.hasClass('xyz ng-enter ng-enter-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000 });
        }
        expect(element.hasClass('xyz')).toBe(true);
      }));

      it('should only append active to the newly append CSS className values',
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

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
          expect(element.hasClass('one two ng-enter')).toBe(true);
          expect(element.hasClass('one two ng-enter ng-enter-active')).toBe(true);
          expect(element.hasClass('one-active')).toBe(false);
          expect(element.hasClass('two-active')).toBe(false);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000 });
        }

        expect(element.hasClass('one two')).toBe(true);
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
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000 });
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
      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $animateProvider.register('.klassy', function($timeout) {
            return {
              addClass : function(element, className, done) {
                $timeout(done, 500, false);
              },
              removeClass : function(element, className, done) {
                $timeout(done, 3000, false);
              }
            }
          });
        });
      });

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
          expect(element.hasClass('klass')).toBe(false);
          expect(element.hasClass('klass-add')).toBe(true);
          expect(element.hasClass('klass-add-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000 });
        }

        //this cancels out the older animation
        $animate.removeClass(element,'klass', function() {
          signature += '2';
        });

        if($sniffer.transitions) {
          expect(element.hasClass('klass')).toBe(true);
          expect(element.hasClass('klass-add')).toBe(false);
          expect(element.hasClass('klass-add-active')).toBe(false);

          expect(element.hasClass('klass-remove')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000 });
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
          expect(element.hasClass('klass-add')).toBe(true);
          expect(element.hasClass('klass-add-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000 });
          expect(element.hasClass('klass-add')).toBe(false);
          expect(element.hasClass('klass-add-active')).toBe(false);
        }

        $timeout.flush();
        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass', function() {
          signature += 'b';
        });
        if($sniffer.transitions) {
          expect(element.hasClass('klass-remove')).toBe(true);
          expect(element.hasClass('klass-remove-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000 });
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
          expect(element.hasClass('one-add')).toBe(true);
          expect(element.hasClass('two-add')).toBe(true);

          expect(element.hasClass('one-add-active')).toBe(true);
          expect(element.hasClass('two-add-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 7000 });

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
          expect(element.hasClass('one-remove')).toBe(true);
          expect(element.hasClass('two-remove')).toBe(true);

          expect(element.hasClass('one-remove-active')).toBe(true);
          expect(element.hasClass('two-remove-active')).toBe(true);
          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 9000 });

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
    inject(function($compile, $rootScope, $animate, $sniffer) {

    ss.addRule('.ng-enter', '-webkit-transition:1s linear all;' +
                                    'transition:1s linear all;');

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div>...</div>')($rootScope);

    $animate.enter(child, element);
    $rootScope.$digest();

    if($sniffer.transitions) {
      expect(child.hasClass('ng-enter')).toBe(true);
      expect(child.hasClass('ng-enter-active')).toBe(true);
      browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
    }

    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);
  }));

  it("should properly animate and parse CSS3 animations",
    inject(function($compile, $rootScope, $animate, $sniffer) {

    ss.addRule('.ng-enter', '-webkit-animation: some_animation 4s linear 1s 2 alternate;' +
                                    'animation: some_animation 4s linear 1s 2 alternate;');

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div>...</div>')($rootScope);

    $animate.enter(child, element);
    $rootScope.$digest();

    if($sniffer.transitions) {
      expect(child.hasClass('ng-enter')).toBe(true);
      expect(child.hasClass('ng-enter-active')).toBe(true);
      browserTrigger(child,'transitionend', { timeStamp: Date.now() + 9000 });
    }
    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);
  }));

  it("should not set the transition property flag if only CSS animations are used",
    inject(function($compile, $rootScope, $animate, $sniffer) {

    if (!$sniffer.animations) return;

    ss.addRule('.ani.ng-enter', '-webkit-animation: my_animation 2s linear;' +
                                        'animation: my_animation 2s linear');

    ss.addRule('.trans.ng-enter',  '-webkit-transition:1s linear all;' +
                                           'transition:1s linear all');

    var propertyKey = ($sniffer.vendorPrefix == 'Webkit' ? '-webkit-' : '') + 'transition-property';

    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div class="ani">...</div>')($rootScope);
    child.css(propertyKey,'background-color');

    $animate.enter(child, element);
    $rootScope.$digest();

    browserTrigger(child,'transitionend', { timeStamp: Date.now() + 2000 });

    expect(child.css(propertyKey)).toBe('background-color');
    child.remove();

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
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000 });
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
        expect(child.hasClass('ng-enter')).toBe(true);
        expect(child.hasClass('ng-enter-active')).toBe(true);
      }

      expect(child.hasClass('this-is-mine-now')).toBe(false);
      child.addClass('usurper');
      $animate.leave(child);
      $rootScope.$digest();

      expect(child.hasClass('ng-enter')).toBe(false);
      expect(child.hasClass('ng-enter-active')).toBe(false);

      expect(child.hasClass('usurper')).toBe(true);
      expect(child.hasClass('this-is-mine-now')).toBe(true);

      $timeout.flush(55);
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

  it("should skip ngAnimate animations when any pre-existing CSS transitions are present on the element", function() {
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

      expect(empty).toBe(true);
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

    expect(child.hasClass('ng-enter')).toBe(true);
    expect(child.hasClass('ng-enter-active')).toBe(true);

    browserTrigger(child, 'transitionend', { timeStamp: Date.now() + 1000 });

    expect(child.hasClass('ng-enter')).toBe(true);
    expect(child.hasClass('ng-enter-active')).toBe(true);

    browserTrigger(child, 'transitionend', { timeStamp: Date.now() + 2000 });

    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);

    expect(element.contents().length).toBe(1);
  }));

});
