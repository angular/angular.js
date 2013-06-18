'use strict';

describe("ngAnimate", function() {

  beforeEach(module('ngAnimate'));

  describe("$animate", function() {

    var body, element, $rootElement;

    function html(html) {
      body.append($rootElement);
      $rootElement.html(html);
      element = $rootElement.children().eq(0);
      return element;
    }

    beforeEach(module(function() {
      // we need to run animation on attached elements;
      body = jqLite(document.body);
      return function($animate) {
        $animate.enabled(true);
      };
    }));

    afterEach(function(){
      dealoc(body);
    });

    describe("enable / disable", function() {

      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $provide.value('$window', angular.mock.createMockWindow());
        });
      });

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

      var child, after, window;

      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $provide.value('$window', window = angular.mock.createMockWindow());
          $animateProvider.register('.custom', function() {
            return {
              start: function(element, done) {
                done();
              }
            }
          });
         $animateProvider.register('.custom-delay', function() {
            function animate(element, done) {
              done = arguments.length == 3 ? arguments[2] : done;
              window.setTimeout(done, 2000);
              return function() {
                element.addClass('animation-cancelled');
              }
            }
            return {
              show : animate,
              hide : animate,
              leave : animate,
              addClass : animate,
              removeClass : animate
            }
          });
         $animateProvider.register('.custom-long-delay', function() {
            function animate(element, done) {
              done = arguments.length == 3 ? arguments[2] : done;
              window.setTimeout(done, 20000);
              return function() {
                element.addClass('animation-cancelled');
              }
            }
            return {
              show : animate,
              hide : animate,
              leave : animate,
              addClass : animate,
              removeClass : animate
            }
          });
         $animateProvider.register('.setup-memo', function() {
            return {
              show: function(element, done) {
                element.text('memento');
                done();
              }
            }
          });
          return function($animate, $compile, $rootScope, $rootElement) {
            element = $compile('<div></div>')($rootScope);
            child   = $compile('<div></div>')($rootScope);
            after   = $compile('<div></div>')($rootScope);
            $rootElement.append(element);
          };
        });
      })

      it("should animate the enter animation event", inject(function($animate, $rootScope, $sniffer) {
        expect(element.contents().length).toBe(0);
        $animate.enter(child, element);
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        expect(element.contents().length).toBe(1);
      }));

      it("should animate the leave animation event", inject(function($animate, $rootScope, $sniffer) {
        element.append(child);
        expect(element.contents().length).toBe(1);
        $animate.leave(child);
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        expect(element.contents().length).toBe(0);
      }));

      it("should animate the move animation event", inject(function($animate, $compile, $rootScope, $sniffer) {
        $rootScope.$digest();
        var child1 = $compile('<div>1</div>')($rootScope);
        var child2 = $compile('<div>2</div>')($rootScope);
        element.append(child1);
        element.append(child2);
        expect(element.text()).toBe('12');
        $animate.move(child1, element, child2);
        expect(element.text()).toBe('21');
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
      }));

      it("should animate the show animation event", inject(function($animate, $rootScope, $sniffer) {
        $rootScope.$digest();
        element.addClass('ng-hide');
        expect(element).toBeHidden();
        $animate.show(element);
        if($sniffer.transitions) {
          expect(element.hasClass('ng-hide-remove')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('ng-hide-remove-active')).toBe(true);
          window.setTimeout.expect(0).process();
        }
        expect(element).toBeShown();
      }));

      it("should animate the hide animation event", inject(function($animate, $rootScope, $sniffer) {
        $rootScope.$digest();
        expect(element).toBeShown();
        $animate.hide(element);
        if($sniffer.transitions) {
          expect(element.hasClass('ng-hide-add')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('ng-hide-add-active')).toBe(true);
          window.setTimeout.expect(0).process();
        }
        expect(element).toBeHidden();
      }));

      it("should assign the ngAnimate string to all events if a string is given",
        inject(function($animate, $sniffer, $rootScope) {

        if (!$sniffer.transitions) return;

        $rootScope.$digest();

        //enter
        $animate.enter(child, element);
        expect(child.attr('class')).toContain('ng-enter');
        window.setTimeout.expect(1).process();
        expect(child.attr('class')).toContain('ng-enter-active');
        window.setTimeout.expect(0).process();

        //leave
        element.append(after);
        $animate.move(child, element, after);
        expect(child.attr('class')).toContain('ng-move');
        window.setTimeout.expect(1).process();
        expect(child.attr('class')).toContain('ng-move-active');
        window.setTimeout.expect(0).process();

        //hide
        $animate.hide(child);
        expect(child.attr('class')).toContain('ng-hide-add');
        window.setTimeout.expect(1).process();
        expect(child.attr('class')).toContain('ng-hide-add-active');
        window.setTimeout.expect(0).process();

        //show
        $animate.show(child);
        expect(child.attr('class')).toContain('ng-hide-remove');
        window.setTimeout.expect(1).process();
        expect(child.attr('class')).toContain('ng-hide-remove-active');
        window.setTimeout.expect(0).process();

        //leave
        $animate.leave(child);
        expect(child.attr('class')).toContain('ng-leave');
        window.setTimeout.expect(1).process();
        expect(child.attr('class')).toContain('ng-leave-active');
        window.setTimeout.expect(0).process();
      }));

      it("should not run if animations are disabled", inject(function($animate, $rootScope, $sniffer) {
        $animate.enabled(false);

        $rootScope.$digest();

        element.addClass('setup-memo');

        element.text('123');
        expect(element.text()).toBe('123');
        $animate.show(element);
        expect(element.text()).toBe('123');

        $animate.enabled(true);

        $animate.show(element);
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        expect(element.text()).toBe('memento');
      }));

      it("should only call done() once and right away if another animation takes place in between",
        inject(function($animate, $rootScope, $sniffer) {

        element.append(child);
        child.addClass('custom-delay');

        expect(element).toBeShown();
        $animate.hide(child);
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        expect(child).toBeShown();

        $animate.leave(child);
        expect(child).toBeHidden(); //hides instantly

        //lets change this to prove that done doesn't fire anymore for the previous hide() operation
        child.css('display','block'); 
        child.removeClass('ng-hide');

        window.setTimeout.expect(2000).process();
        if($sniffer.transitions) {
          window.setTimeout.expect(0).process();
        }
        expect(child).toBeShown();

        expect(element.children().length).toBe(1); //still animating

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        window.setTimeout.expect(2000).process();
        if($sniffer.transitions) {
          window.setTimeout.expect(0).process();
        }
        expect(element.children().length).toBe(0);
      }));

      it("should call the cancel callback when another animation is called on the same element",
        inject(function($animate, $rootScope, $sniffer) {

        element.append(child);

        child.addClass('custom-delay ng-hide');
        $animate.show(child);
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }

        $animate.hide(child);

        expect(child.hasClass('animation-cancelled')).toBe(true);
      }));


      it("should NOT clobber all data on an element when animation is finished",
        inject(function($animate, $rootScope, $sniffer) {

        child.css('display','none');
        element.data('foo', 'bar');

        $animate.show(element);
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }

        $animate.hide(element);

        expect(element.data('foo')).toEqual('bar');
      }));


      it("should allow multiple JS animations which run in parallel",
        inject(function($animate, $rootScope, $compile, $sniffer) {

          $animate.addClass(element, 'custom-delay custom-long-delay');
          if($sniffer.transitions) {
            expect(element[0].className).toContain('custom-delay-add custom-long-delay-add');
            window.setTimeout.expect(1).process();
            expect(element[0].className).toContain('custom-delay-add-active custom-long-delay-add-active');
          }
          window.setTimeout.expect(2000).process();
          window.setTimeout.expect(20000).process();
          if($sniffer.transitions) {
            window.setTimeout.expect(0).process(); //css animation
          }

          expect(element.hasClass('custom-delay')).toBe(true);
          expect(element.hasClass('custom-delay-add')).toBe(false);
          expect(element.hasClass('custom-delay-add-active')).toBe(false);

          expect(element.hasClass('custom-long-delay')).toBe(true);
          expect(element.hasClass('custom-long-delay-add')).toBe(false);
          expect(element.hasClass('custom-long-delay-add-active')).toBe(false);
      }));

      it("should allow both multiple JS and CSS animations which run in parallel",
        inject(function($animate, $rootScope, $compile, $sniffer, _$rootElement_) {
        $rootElement = _$rootElement_;

        var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
        var style = 'transition: 1s linear all;' +
                    vendorPrefix + 'transition: 1s linear all;'

        element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
        element.addClass('custom-delay custom-long-delay');
        $rootScope.$digest();

        $animate.show(element); 

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        window.setTimeout.expect(2000).process(); //1st JavaScript Animation
        window.setTimeout.expect(20000).process(); //2nd JavaScript Animation
        if($sniffer.transitions) {
          window.setTimeout.expect(1000).process(); //CSS animation
        }

        expect(element.hasClass('custom-delay')).toBe(true);
        expect(element.hasClass('custom-delay-add')).toBe(false);
        expect(element.hasClass('custom-delay-add-active')).toBe(false);

        expect(element.hasClass('custom-long-delay')).toBe(true);
        expect(element.hasClass('custom-long-delay-add')).toBe(false);
        expect(element.hasClass('custom-long-delay-add-active')).toBe(false);
      }));
    });

    describe("with CSS3", function() {
      var window, prefix, vendorPrefix;

      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $provide.value('$window', window = angular.mock.createMockWindow());
          return function($sniffer, _$rootElement_, $animate) {
            vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
            $rootElement = _$rootElement_;
          };
        })
      });

      describe("Animations", function() {
        it("should properly detect and make use of CSS Animations",
            inject(function($animate, $rootScope, $compile, $sniffer) {
          var style = 'animation: some_animation 4s linear 0s 1 alternate;' +
                      vendorPrefix + 'animation: some_animation 4s linear 0s 1 alternate;';
          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.show(element);
          if ($sniffer.animations) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(4000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element).toBeShown();
        }));

        it("should properly detect and make use of CSS Animations with multiple iterations",
            inject(function($animate, $rootScope, $compile, $sniffer) {
          var style = 'animation-duration: 2s;' + 
                      'animation-iteration-count: 3;' +
                      vendorPrefix + 'animation-duration: 2s;' + 
                      vendorPrefix + 'animation-iteration-count: 3;';
          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.show(element);
          if ($sniffer.animations) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(6000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element).toBeShown();
        }));

        it("should fallback to the animation duration if an infinite iteration is provided",
            inject(function($animate, $rootScope, $compile, $sniffer) {
          var style = 'animation-duration: 2s;' + 
                      'animation-iteration-count: infinite;' +
                      vendorPrefix + 'animation-duration: 2s;' + 
                      vendorPrefix + 'animation-iteration-count: infinite;';
          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.show(element);
          if ($sniffer.animations) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(2000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element).toBeShown();
        }));

        it("should consider the animation delay is provided",
            inject(function($animate, $rootScope, $compile, $sniffer) {
          var style = 'animation-duration: 2s;' + 
                      'animation-delay: 10s;' +
                      'animation-iteration-count: 5;' +
                      vendorPrefix + 'animation-duration: 2s;' + 
                      vendorPrefix + 'animation-delay: 10s;' +
                      vendorPrefix + 'animation-iteration-count: 5;';
          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.show(element);
          if ($sniffer.transitions) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(20000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element).toBeShown();
        }));

        it("should skip animations if disabled and run when enabled",
            inject(function($animate, $rootScope, $compile, $sniffer) {
          $animate.enabled(false);
          var style = 'animation: some_animation 2s linear 0s 1 alternate;' +
                      vendorPrefix + 'animation: some_animation 2s linear 0s 1 alternate;'

          element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
          element.addClass('ng-hide');
          expect(element).toBeHidden();
          $animate.show(element);
          expect(element).toBeShown();
        }));

        it("should finish the previous animation when a new animation is started",
          inject(function($animate, $rootScope, $compile, $sniffer) {
            var style = 'animation: some_animation 2s linear 0s 1 alternate;' +
                        vendorPrefix + 'animation: some_animation 2s linear 0s 1 alternate;'

            element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);
            element.addClass('custom');

            $animate.show(element);
            if($sniffer.animations) {
              window.setTimeout.expect(1).process();
              expect(element.hasClass('ng-hide-remove')).toBe(true);
              expect(element.hasClass('ng-hide-remove-active')).toBe(true);
            }
            else { //animation is skipped
              expect(window.setTimeout.queue.length).toBe(0);
            }

            $animate.hide(element);
            expect(element.hasClass('ng-hide-remove')).toBe(false); //added right away

            if($sniffer.animations) { //cleanup some pending animations
              window.setTimeout.expect(2000).process();
              window.setTimeout.expect(1).process();
              expect(element.hasClass('ng-hide-add')).toBe(true);
              expect(element.hasClass('ng-hide-add-active')).toBe(true);
            }

            expect(element.hasClass('ng-hide-remove-active')).toBe(false);
        }));
      });

      describe("Transitions", function() {
        it("should skip transitions if disabled and run when enabled",
            inject(function($animate, $rootScope, $compile, $sniffer) {
          $animate.enabled(false);
          element = $compile(html('<div style="' + vendorPrefix + 'transition: 1s linear all">1</div>'))($rootScope);

          element.addClass('ng-hide');
          expect(element).toBeHidden();
          $animate.show(element);
          expect(element).toBeShown();

          $animate.enabled(true);

          element.addClass('ng-hide');
          expect(element).toBeHidden();

          $animate.show(element);
          if ($sniffer.transitions) {
            window.setTimeout.expect(1).process();
            window.setTimeout.expect(1000).process();
          }
          else {
            expect(window.setTimeout.queue.length).toBe(0);
          }
          expect(element).toBeShown();
        }));

        it("should skip animations if disabled and run when enabled picking the longest specified duration",
          inject(function($animate, $rootScope, $compile, $sniffer) {
            element = $compile(html('<div style="' + vendorPrefix + 'transition-duration: 1s, 2000ms, 1s; ' + vendorPrefix + 'transition-property: height, left, opacity">foo</div>'))($rootScope);
            element.addClass('ng-hide');
            $animate.show(element);
            if ($sniffer.transitions) {
              expect(element).toBeHidden();
              window.setTimeout.expect(1).process();
              window.setTimeout.expect(2000).process();
            }
            else {
              expect(window.setTimeout.queue.length).toBe(0);
            }
            expect(element).toBeShown();
          }));

        it("should skip animations if disabled and run when enabled picking the longest specified duration/delay combination",
          inject(function($animate, $rootScope, $compile, $sniffer) {
            $animate.enabled(false);
            element = $compile(html('<div style="' + vendorPrefix + 
              'transition-duration: 1s, 0s, 1s; ' + vendorPrefix +
              'transition-delay: 2s, 1000ms, 2s; ' + vendorPrefix + 
              'transition-property: height, left, opacity">foo</div>'))($rootScope);

            element.addClass('ng-hide');
            $animate.show(element);
            expect(element).toBeShown();

            $animate.enabled(true);

            element.addClass('ng-hide');
            expect(element).toBeHidden();

            $animate.show(element);
            if ($sniffer.transitions) {
              window.setTimeout.expect(1).process();
              window.setTimeout.expect(3000).process();
            }
            else {
              expect(window.setTimeout.queue.length).toBe(0);
            }
            expect(element).toBeShown();
        }));

        it("should select the highest duration and delay",
          inject(function($animate, $rootScope, $compile, $sniffer) {
            var styles = 'transition:1s linear all 2s;' + 
                         vendorPrefix + 'transition:1s linear all 2s;' + 
                         'animation:my_ani 10s 1s;' + 
                         vendorPrefix + 'animation:my_ani 10s 1s;';

            element = $compile(html('<div style="' + styles + '">foo</div>'))($rootScope);

            element.addClass('ng-hide');
            expect(element).toBeHidden();

            $animate.show(element);
            if ($sniffer.transitions) {
              window.setTimeout.expect(1).process();
              window.setTimeout.expect(11000).process();
            }
            else {
              expect(window.setTimeout.queue.length).toBe(0);
            }
            expect(element).toBeShown();
        }));

        it("should finish the previous transition when a new animation is started",
          inject(function($animate, $rootScope, $compile, $sniffer) {
            var style = 'transition: 1s linear all;' +
                        vendorPrefix + 'transition: 1s linear all;'

            element = $compile(html('<div style="' + style + '">1</div>'))($rootScope);

            element.addClass('ng-hide');
            $animate.show(element);
            if($sniffer.transitions) {
              expect(element.hasClass('ng-hide-remove')).toBe(true);
              window.setTimeout.expect(1).process();
              expect(element.hasClass('ng-hide-remove-active')).toBe(true);
              window.setTimeout.expect(1000).process();
            }
            else { //animation is skipped
              expect(window.setTimeout.queue.length).toBe(0);
            }
            expect(element.hasClass('ng-hide-remove')).toBe(false);
            expect(element.hasClass('ng-hide-remove-active')).toBe(false);
            expect(element).toBeShown();

            $animate.hide(element);
            if($sniffer.transitions) {
              expect(element.hasClass('ng-hide-add')).toBe(true);
              window.setTimeout.expect(1).process();
              expect(element.hasClass('ng-hide-add-active')).toBe(true);
            }
            else {
              expect(window.setTimeout.queue.length).toBe(0);
            }
        }));
      });
    });

    describe('animation evaluation', function () {
      beforeEach(module(function($provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
      }));

      it('should re-evaluate the CSS classes for an animation each time',
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        angular.element(document.body).append($rootElement);

        element[0].className = 'abc';
        $animate.enter(element, parent);
        if ($sniffer.transitions) {
          expect(element.hasClass('abc ng-enter')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('abc ng-enter ng-enter-active')).toBe(true);
          window.setTimeout.expect(0).process();
        }
        expect(element.hasClass('abc')).toBe(true);

        element[0].className = 'xyz';
        $animate.enter(element, parent);
        if ($sniffer.transitions) {
          expect(element.hasClass('xyz')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('xyz ng-enter ng-enter-active')).toBe(true);
          window.setTimeout.expect(0).process();
        }
        expect(element.hasClass('xyz')).toBe(true);
      }));

      it('should only append active to the newly append CSS className values',
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        angular.element(document.body).append($rootElement);

        element.attr('class','one two');

        $animate.enter(element, parent);
        if($sniffer.transitions) {
          expect(element.hasClass('one two ng-enter')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('one two ng-enter ng-enter-active')).toBe(true);
          expect(element.hasClass('one-active')).toBe(false);
          expect(element.hasClass('two-active')).toBe(false);
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }

        expect(element.hasClass('one two')).toBe(true);
      }));
    });

    describe("Callbacks", function() {

      var window, vendorPrefix;
      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $provide.value('$window', window = angular.mock.createMockWindow());
          $animateProvider.register('.custom', function() {
            return {
              show : function(element, done) {
                window.setTimeout(done, 2000);
              }
            }
          });
          $animateProvider.register('.other', function() {
            return {
              start : function(element, done) {
                window.setTimeout(done, 10000);
              }
            }
          });
        })
        inject(function($sniffer, $animate) {
          vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
        });
      });

      it("should fire the enter callback",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.enter(element, parent, null, function() {
          flag = true;
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(flag).toBe(true);
      }));

      it("should fire the leave callback",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.leave(element, function() {
          flag = true;
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(flag).toBe(true);
      }));

      it("should fire the move callback",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var parent2 = jqLite('<div id="nice"></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.move(element, parent, parent2, function() {
          flag = true;
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }

        expect(flag).toBe(true);
        expect(element.parent().id).toBe(parent2.id);
      }));

      it("should fire the addClass/removeClass callbacks",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var signature = '';
        $animate.addClass(element, 'on', function() {
          signature += 'A';
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }

        $animate.removeClass(element, 'on', function() {
          signature += 'B';
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }

        expect(signature).toBe('AB');
      }));

      it("should fire a done callback when provided with no animation",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        var element = parent.find('span');
        $rootElement.append(parent);
        body.append($rootElement);

        var flag = false;
        $animate.show(element, function() {
          flag = true;
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(flag).toBe(true);
      }));

      it("should fire a done callback when provided with a css animation/transition",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var transition = 'transition:1s linear all;';
        var style = transition + ' ' + vendorPrefix + transition;
        var parent = jqLite('<div><span style="' + style + '"></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = parent.find('span');

        var flag = false;
        $animate.show(element, function() {
          flag = true;
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(1000).process();
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }
        expect(flag).toBe(true);
      }));

      it("should fire a done callback when provided with a JS animation",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = parent.find('span');
        element.addClass('custom');

        var flag = false;
        $animate.show(element, function() {
          flag = true;
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        window.setTimeout.expect(2000).process();
        if($sniffer.transitions) {
          window.setTimeout.expect(0).process();
        }
        expect(flag).toBe(true);
      }));

      it("should fire the callback right away if another animation is called right after",
        inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = parent.find('span');

        var signature = '';
        $animate.show(element, function() {
          signature += 'A';
        });
        $animate.hide(element, function() {
          signature += 'B';
        });

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        $animate.hide(element); //earlier animation cancelled
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        expect(signature).toBe('AB');
      }));
    });

    describe("addClass / removeClass", function() {

      var window, vendorPrefix;
      beforeEach(function() {
        module(function($animateProvider, $provide) {
          $provide.value('$window', window = angular.mock.createMockWindow());
          $animateProvider.register('.klassy', function() {
            return {
              addClass : function(element, className, done) {
                window.setTimeout(done, 500);
              },
              removeClass : function(element, className, done) {
                window.setTimeout(done, 3000);
              }
            }
          });
        })
        inject(function($sniffer, $animate) {
          vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
        });
      });

      it("should add and remove CSS classes after an animation even if no animation is present",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        $animate.addClass(element,'klass');

        if($sniffer.transitions) {
          expect(element.hasClass('klass-add')).toBe(true);
        }

        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          expect(element.hasClass('klass-add')).toBe(true);
          expect(element.hasClass('klass-add-active')).toBe(true);
          expect(element.hasClass('klass')).toBe(false);

          window.setTimeout.expect(0).process();
          expect(element.hasClass('klass-add')).toBe(false);
          expect(element.hasClass('klass-add-active')).toBe(false);
        }
        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass');

        if($sniffer.transitions) {
          expect(element.hasClass('klass')).toBe(true);
          expect(element.hasClass('klass-remove')).toBe(true);

          window.setTimeout.expect(1).process();
          expect(element.hasClass('klass')).toBe(true);
          expect(element.hasClass('klass-remove')).toBe(true);
          expect(element.hasClass('klass-remove-active')).toBe(true);

          window.setTimeout.expect(0).process();
        }

        expect(element.hasClass('klass')).toBe(false);
        expect(element.hasClass('klass-remove')).toBe(false);
        expect(element.hasClass('klass-remove-active')).toBe(false);
      }));

      it("should add and remove CSS classes with a callback",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klass', function() {
          signature += 'A';
        });

        if($sniffer.transitions) {
          expect(element.hasClass('klass')).toBe(false);
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass', function() {
          signature += 'B';
        });

        if($sniffer.transitions) {
          expect(element.hasClass('klass')).toBe(true);
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }
        expect(element.hasClass('klass')).toBe(false);

        expect(signature).toBe('AB');
      }));

      it("should end the current addClass animation, add the CSS class and then run the removeClass animation",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klass', function() {
          signature += '1';
        });
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
          expect(element.hasClass('klass')).toBe(false);
          expect(element.hasClass('klass-add')).toBe(true);
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
          window.setTimeout.expect(0).process();
          window.setTimeout.expect(1).process();
          window.setTimeout.expect(0).process();
        }

        expect(element.hasClass('klass')).toBe(false);
        expect(signature).toBe('12');
      }));

      it("should properly execute JS animations and use callbacks when using addClass / removeClass",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {
        var parent = jqLite('<div><span></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klassy', function() {
          signature += 'X';
        });
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        window.setTimeout.expect(500).process();
        if($sniffer.transitions) {
          window.setTimeout.expect(0).process();
        }
        expect(element.hasClass('klassy')).toBe(true);

        $animate.removeClass(element,'klassy', function() {
          signature += 'Y';
        });
        if($sniffer.transitions) {
          window.setTimeout.expect(1).process();
        }
        window.setTimeout.expect(3000).process();
        if($sniffer.transitions) {
          window.setTimeout.expect(0).process();
        }
        expect(element.hasClass('klassy')).toBe(false);

        expect(signature).toBe('XY');
      }));

      it("should properly execute CSS animations/transitions and use callbacks when using addClass / removeClass",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var transition = 'transition:11s linear all;';
        var style = transition + ' ' + vendorPrefix + transition;
        var parent = jqLite('<div><span style="' + style + '"></span></div>');
        $rootElement.append(parent);
        body.append($rootElement);
        var element = jqLite(parent.find('span'));

        var signature = '';

        $animate.addClass(element,'klass', function() {
          signature += 'd';
        });
        if($sniffer.transitions) {
          expect(element.hasClass('klass-add')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('klass-add-active')).toBe(true);
          window.setTimeout.expect(11000).process();
          expect(element.hasClass('klass-add')).toBe(false);
          expect(element.hasClass('klass-add-active')).toBe(false);
        }
        expect(element.hasClass('klass')).toBe(true);

        $animate.removeClass(element,'klass', function() {
          signature += 'b';
        });
        if($sniffer.transitions) {
          expect(element.hasClass('klass-remove')).toBe(true);
          window.setTimeout.expect(1).process();
          expect(element.hasClass('klass-remove-active')).toBe(true);
          window.setTimeout.expect(11000).process();
          expect(element.hasClass('klass-remove')).toBe(false);
          expect(element.hasClass('klass-remove-active')).toBe(false);
        }
        expect(element.hasClass('klass')).toBe(false);

        expect(signature).toBe('db');
      }));

      it("should allow for multiple css classes to be animated plus a callback when added",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var transition = 'transition:7s linear all;';
        var style = transition + ' ' + vendorPrefix + transition;
        var parent = jqLite('<div><span style="' + style + '"></span></div>');
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
          window.setTimeout.expect(1).process();

          expect(element.hasClass('one-add-active')).toBe(true);
          expect(element.hasClass('two-add-active')).toBe(true);
          window.setTimeout.expect(7000).process();

          expect(element.hasClass('one-add')).toBe(false);
          expect(element.hasClass('one-add-active')).toBe(false);
          expect(element.hasClass('two-add')).toBe(false);
          expect(element.hasClass('two-add-active')).toBe(false);
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }

        expect(element.hasClass('one')).toBe(true);
        expect(element.hasClass('two')).toBe(true);

        expect(flag).toBe(true);
      }));

      it("should allow for multiple css classes to be animated plus a callback when removed",
        inject(function($animate, $rootScope, $sniffer, $rootElement) {

        var transition = 'transition:9s linear all;';
        var style = transition + ' ' + vendorPrefix + transition;
        var parent = jqLite('<div><span style="' + style + '"></span></div>');
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
          window.setTimeout.expect(1).process();

          expect(element.hasClass('one-remove-active')).toBe(true);
          expect(element.hasClass('two-remove-active')).toBe(true);
          window.setTimeout.expect(9000).process();

          expect(element.hasClass('one-remove')).toBe(false);
          expect(element.hasClass('one-remove-active')).toBe(false);
          expect(element.hasClass('two-remove')).toBe(false);
          expect(element.hasClass('two-remove-active')).toBe(false);
        }
        else {
          expect(window.setTimeout.queue.length).toBe(0);
        }

        expect(element.hasClass('one')).toBe(false);
        expect(element.hasClass('two')).toBe(false);

        expect(flag).toBe(true);
      }));
    });
  });
    
  var $rootElement, $document, window;
  beforeEach(module(function($provide) {
    $provide.value('$window', window = angular.mock.createMockWindow());

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

    var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
    var style = 'transition: 1s linear all;' +
                vendorPrefix + 'transition: 1s linear all;';
    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div style="' + style + '">...</div>')($rootScope);

    $animate.enter(child, element);

    if($sniffer.transitions) {
      expect(child.hasClass('ng-enter')).toBe(true);
      window.setTimeout.expect(1).process();
      expect(child.hasClass('ng-enter-active')).toBe(true);
      window.setTimeout.expect(1000).process();
    }
    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);
  }));

  it("should properly animate and parse CSS3 animations",
    inject(function($compile, $rootScope, $animate, $sniffer) {

    var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
    var style = 'animation: some_animation 4s linear 1s 2 alternate;' +
                vendorPrefix + 'animation: some_animation 4s linear 1s 2 alternate;';
    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div style="' + style + '">...</div>')($rootScope);
    $animate.enter(child, element);

    if($sniffer.transitions) {
      expect(child.hasClass('ng-enter')).toBe(true);
      window.setTimeout.expect(1).process();
      expect(child.hasClass('ng-enter-active')).toBe(true);
      window.setTimeout.expect(9000).process();
    }
    expect(child.hasClass('ng-enter')).toBe(false);
    expect(child.hasClass('ng-enter-active')).toBe(false);
  }));

  it("should skip animations if the browser does not support CSS3 transitions and CSS3 animations",
    inject(function($compile, $rootScope, $animate, $sniffer) {

    $sniffer.animations = false;
    $sniffer.transitions = false;

    var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
    var style = 'animation: some_animation 4s linear 1s 2 alternate;' +
                vendorPrefix + 'animation: some_animation 4s linear 1s 2 alternate;';
    var element = html($compile('<div>...</div>')($rootScope));
    var child = $compile('<div style="' + style + '">...</div>')($rootScope);

    expect(child.hasClass('ng-enter')).toBe(false);
    $animate.enter(child, element);
    expect(window.setTimeout.queue.length).toBe(0);
    expect(child.hasClass('ng-enter')).toBe(false);
  }));

  it("should run other defined animations inline with CSS3 animations", function() {
    module(function($animateProvider) {
      $animateProvider.register('.custom', function($window) {
        return {
          enter : function(element, done) {
            element.addClass('i-was-animated');
            $window.setTimeout(done, 10);
          }
        }
      });
    })
    inject(function($compile, $rootScope, $animate, $sniffer) {
      var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
      var style = 'transition: 1s linear all;' +
                  vendorPrefix + 'transition: 1s linear all;';
      var element = html($compile('<div>...</div>')($rootScope));
      var child = $compile('<div style="' + style + '">...</div>')($rootScope);

      expect(child.hasClass('i-was-animated')).toBe(false);

      child.addClass('custom');
      $animate.enter(child, element);

      expect(child.hasClass('ng-enter')).toBe(true);
      if($sniffer.transitions) {
        window.setTimeout.expect(1).process();
        expect(child.hasClass('ng-enter-active')).toBe(true);
      }

      window.setTimeout.expect(10).process();

      if($sniffer.transitions) {
        expect(child.hasClass('ng-enter-active')).toBe(true);
        window.setTimeout.expect(1000).process();
        expect(child.hasClass('ng-enter')).toBe(false);
        expect(child.hasClass('ng-enter-active')).toBe(false);
      }

      expect(child.hasClass('i-was-animated')).toBe(true);
    });
  });

  it("should properly cancel CSS transitions or animations if another animation is fired", function() {
    module(function($animateProvider) {
      $animateProvider.register('.usurper', function($window) {
        return {
          leave : function(element, done) {
            element.addClass('this-is-mine-now');
            $window.setTimeout(done, 55);
          }
        }
      });
    });
    inject(function($compile, $rootScope, $animate, $sniffer) {
      var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
      var style = 'transition: 2s linear all;' +
                  vendorPrefix + 'transition: 2s linear all;';
      var element = html($compile('<div>...</div>')($rootScope));
      var child = $compile('<div style="' + style + '">...</div>')($rootScope);

      $animate.enter(child, element);

      if($sniffer.transitions) {
        expect(child.hasClass('ng-enter')).toBe(true);
      }

      expect(child.hasClass('this-is-mine-now')).toBe(false);
      child.addClass('usurper');
      $animate.leave(child);

      expect(child.hasClass('ng-enter')).toBe(false);
      expect(child.hasClass('ng-enter-active')).toBe(false);

      expect(child.hasClass('usurper')).toBe(true);
      expect(child.hasClass('this-is-mine-now')).toBe(true);
      if($sniffer.transitions) {
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(1).process();
      }
      window.setTimeout.expect(55).process();
      if($sniffer.transitions) {
        window.setTimeout.expect(2000).process();

        //even though this exists, the animation will still not happen
        //since the done function has already been called in the cancellation
        window.setTimeout.expect(2000).process();
      }

      expect(child.hasClass('usurper-active')).toBe(false);
    });
  });

  it("should add and remove CSS classes and perform CSS animations during the process",
    inject(function($compile, $rootScope, $animate, $sniffer) {

    var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
    var style = 'transition: 10s linear all;' +
                vendorPrefix + 'transition: 10s linear all;';
    var element = html($compile('<div style="' + style + '"></div>')($rootScope));

    expect(element.hasClass('on')).toBe(false);

    $animate.addClass(element, 'on');

    if($sniffer.transitions) {
      expect(element.hasClass('on')).toBe(false);
      expect(element.hasClass('on-add')).toBe(true);
      window.setTimeout.expect(1).process();
      expect(element.hasClass('on-add-active')).toBe(true);
      window.setTimeout.expect(10000).process();
    }

    expect(element.hasClass('on')).toBe(true);
    expect(element.hasClass('on-add')).toBe(false);
    expect(element.hasClass('on-add-active')).toBe(false);

    $animate.removeClass(element, 'on');
    if($sniffer.transitions) {
      expect(element.hasClass('on')).toBe(true);
      expect(element.hasClass('on-remove')).toBe(true);
      window.setTimeout.expect(1).process();
      expect(element.hasClass('on-remove-active')).toBe(true);
      window.setTimeout.expect(10000).process();
    }

    expect(element.hasClass('on')).toBe(false);
    expect(element.hasClass('on-remove')).toBe(false);
    expect(element.hasClass('on-remove-active')).toBe(false);
  }));

  it("should show and hide elements with CSS & JS animations being performed in the process", function() {
    module(function($animateProvider) {
      $animateProvider.register('.displayer', function($window) {
        return {
          show : function(element, done) {
            element.removeClass('hiding');
            element.addClass('showing');
            $window.setTimeout(done, 25);
          },
          hide : function(element, done) {
            element.removeClass('showing');
            element.addClass('hiding');
            $window.setTimeout(done, 555);
          }
        }
      });
    })
    inject(function($compile, $rootScope, $animate, $sniffer) {
      var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
      var style = 'transition: 5s linear all;' +
                  vendorPrefix + 'transition: 5s linear all;';
      var element = html($compile('<div style="' + style + '"></div>')($rootScope));

      element.addClass('displayer');

      expect(element).toBeShown();
      expect(element.hasClass('showing')).toBe(false);
      expect(element.hasClass('hiding')).toBe(false);

      $animate.hide(element);

      if($sniffer.transitions) {
        expect(element).toBeShown(); //still showing
        window.setTimeout.expect(1).process();
        expect(element).toBeShown();
      }
      window.setTimeout.expect(555).process();
      if($sniffer.transitions) {
        expect(element).toBeShown();
        window.setTimeout.expect(5000).process();
      }
      expect(element).toBeHidden();

      expect(element.hasClass('showing')).toBe(false);
      expect(element.hasClass('hiding')).toBe(true);
      $animate.show(element);

      if($sniffer.transitions) {
        expect(element).toBeHidden();
        window.setTimeout.expect(1).process();
        expect(element).toBeHidden();
      }
      window.setTimeout.expect(25).process();
      if($sniffer.transitions) {
        expect(element).toBeHidden();
        window.setTimeout.expect(5000).process();
      }
      expect(element).toBeShown();

      expect(element.hasClass('showing')).toBe(true);
      expect(element.hasClass('hiding')).toBe(false);
    });
  });

});
