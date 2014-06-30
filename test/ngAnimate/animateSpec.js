'use strict';

describe("ngAnimate", function() {

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));


  it("should disable animations on bootstrap for structural animations even after the first digest has passed", function() {
    var hasBeenAnimated = false;
    module(function($animateProvider) {
      $animateProvider.register('.my-structrual-animation', function() {
        return {
          enter : function(element, done) {
            hasBeenAnimated = true;
            done();
          },
          leave : function(element, done) {
            hasBeenAnimated = true;
            done();
          }
        };
      });
    });
    inject(function($rootScope, $compile, $animate, $rootElement, $document) {
      var element = $compile('<div class="my-structrual-animation">...</div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $animate.enter(element, $rootElement);
      $rootScope.$digest();

      expect(hasBeenAnimated).toBe(false);

      $animate.leave(element);
      $rootScope.$digest();

      expect(hasBeenAnimated).toBe(true);
    });
  });


  //we use another describe block because the before/after operations below
  //are used across all animations tests and we don't want that same behavior
  //to be used on the root describe block at the start of the animateSpec.js file
  describe('', function() {

    var ss, body;
    beforeEach(module(function() {
      body = jqLite(document.body);
      return function($window, $document, $animate, $timeout, $rootScope) {
        ss = createMockStyleSheet($document, $window);
        try {
          $timeout.flush();
        } catch(e) {}
        $animate.enabled(true);
        $rootScope.$digest();
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

      function html(content) {
        body.append($rootElement);
        $rootElement.html(content);
        element = $rootElement.children().eq(0);
        return element;
      }

      describe("enable / disable", function() {

        it("should work for all animations", inject(function($animate) {

          expect($animate.enabled()).toBe(true);

          expect($animate.enabled(0)).toBe(false);
          expect($animate.enabled()).toBe(false);

          expect($animate.enabled(1)).toBe(true);
          expect($animate.enabled()).toBe(true);
        }));


        it('should place a hard disable on all child animations', function() {
          var count = 0;
          module(function($animateProvider) {
            $animateProvider.register('.animated', function() {
              return {
                addClass : function(element, className, done) {
                  count++;
                  done();
                }
              };
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
              };
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
              };
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
              };
            });
            $animateProvider.register('.custom-delay', function($timeout) {
              function animate(element, done) {
                done = arguments.length == 3 ? arguments[2] : done;
                $timeout(done, 2000, false);
                return function() {
                  element.addClass('animation-cancelled');
                };
              }
              return {
                leave : animate,
                addClass : animate,
                removeClass : animate
              };
            });
            $animateProvider.register('.custom-long-delay', function($timeout) {
              function animate(element, done) {
                done = arguments.length == 3 ? arguments[2] : done;
                $timeout(done, 20000, false);
                return function(cancelled) {
                  element.addClass(cancelled ? 'animation-cancelled' : 'animation-ended');
                };
              }
              return {
                leave : animate,
                addClass : animate,
                removeClass : animate
              };
            });
            $animateProvider.register('.setup-memo', function() {
              return {
                removeClass: function(element, className, done) {
                  element.text('memento');
                  done();
                }
              };
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
        });


        it("should animate the enter animation event",
          inject(function($animate, $rootScope, $sniffer, $timeout) {
          element[0].removeChild(child[0]);

          expect(element.contents().length).toBe(0);
          $animate.enter(child, element);
          $rootScope.$digest();

          if($sniffer.transitions) {
            $animate.triggerReflow();
            expect(child.hasClass('ng-enter')).toBe(true);
            expect(child.hasClass('ng-enter-active')).toBe(true);
            browserTrigger(element, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.contents().length).toBe(1);
        }));

        it("should animate the enter animation event with native dom elements",
          inject(function($animate, $rootScope, $sniffer, $timeout) {
          element[0].removeChild(child[0]);

          expect(element.contents().length).toBe(0);
          $animate.enter(child[0], element[0]);
          $rootScope.$digest();

          if($sniffer.transitions) {
            $animate.triggerReflow();
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
            $animate.triggerReflow();
            expect(child.hasClass('ng-leave')).toBe(true);
            expect(child.hasClass('ng-leave-active')).toBe(true);
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.contents().length).toBe(0);
        }));

        it("should animate the leave animation event with native dom elements",
          inject(function($animate, $rootScope, $sniffer, $timeout) {

          expect(element.contents().length).toBe(1);
          $animate.leave(child[0]);
          $rootScope.$digest();

          if($sniffer.transitions) {
            $animate.triggerReflow();
            expect(child.hasClass('ng-leave')).toBe(true);
            expect(child.hasClass('ng-leave-active')).toBe(true);
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.contents().length).toBe(0);
        }));

        it("should animate the move animation event",
          inject(function($animate, $compile, $rootScope, $timeout, $sniffer) {

          $rootScope.$digest();
          element.empty();

          var child1 = $compile('<div>1</div>')($rootScope);
          var child2 = $compile('<div>2</div>')($rootScope);
          element.append(child1);
          element.append(child2);
          expect(element.text()).toBe('12');
          $animate.move(child1, element, child2);
          $rootScope.$digest();
          if($sniffer.transitions) {
            $animate.triggerReflow();
          }
          expect(element.text()).toBe('21');
        }));

        it("should animate the move animation event with native dom elements",
          inject(function($animate, $compile, $rootScope, $timeout, $sniffer) {

          $rootScope.$digest();
          element.empty();

          var child1 = $compile('<div>1</div>')($rootScope);
          var child2 = $compile('<div>2</div>')($rootScope);
          element.append(child1);
          element.append(child2);
          expect(element.text()).toBe('12');
          $animate.move(child1[0], element[0], child2[0]);
          $rootScope.$digest();
          if($sniffer.transitions) {
            $animate.triggerReflow();
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
            $animate.triggerReflow();
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
            $animate.triggerReflow();
            expect(child.hasClass('ng-hide-add')).toBe(true);
            expect(child.hasClass('ng-hide-add-active')).toBe(true);
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          expect(child).toBeHidden();
        }));


        it("should exclusively animate the setClass animation event", function() {
          var count = 0, fallback = jasmine.createSpy('callback');
          module(function($animateProvider) {
            $animateProvider.register('.classify', function() {
              return {
                beforeAddClass : fallback,
                addClass : fallback,
                beforeRemoveClass : fallback,
                removeClass : fallback,

                beforeSetClass : function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                },
                setClass : function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope, $sniffer, $timeout) {
            child.attr('class','classify no');
            $animate.setClass(child, 'yes', 'no');

            expect(child.hasClass('yes')).toBe(true);
            expect(child.hasClass('no')).toBe(false);
            expect(count).toBe(2);

            expect(fallback).not.toHaveBeenCalled();
          });
        });

        it("should exclusively animate the setClass animation event with native dom elements", function() {
          var count = 0, fallback = jasmine.createSpy('callback');
          module(function($animateProvider) {
            $animateProvider.register('.classify', function() {
              return {
                beforeAddClass : fallback,
                addClass : fallback,
                beforeRemoveClass : fallback,
                removeClass : fallback,

                beforeSetClass : function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                },
                setClass : function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope, $sniffer, $timeout) {
            child.attr('class','classify no');
            $animate.setClass(child[0], 'yes', 'no');
            $animate.triggerReflow();

            expect(child.hasClass('yes')).toBe(true);
            expect(child.hasClass('no')).toBe(false);
            expect(count).toBe(2);

            expect(fallback).not.toHaveBeenCalled();
          });
        });

        it("should delegate down to addClass/removeClass if a setClass animation is not found", function() {
          var count = 0;
          module(function($animateProvider) {
            $animateProvider.register('.classify', function() {
              return {
                beforeAddClass : function(element, className, done) {
                  count++;
                  expect(className).toBe('yes');
                  done();
                },
                addClass : function(element, className, done) {
                  count++;
                  expect(className).toBe('yes');
                  done();
                },
                beforeRemoveClass : function(element, className, done) {
                  count++;
                  expect(className).toBe('no');
                  done();
                },
                removeClass : function(element, className, done) {
                  count++;
                  expect(className).toBe('no');
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope, $sniffer, $timeout) {
            child.attr('class','classify no');
            $animate.setClass(child, 'yes', 'no');

            expect(child.hasClass('yes')).toBe(true);
            expect(child.hasClass('no')).toBe(false);
            expect(count).toBe(4);
          });
        });

        it("should assign the ng-event className to all animation events when transitions/keyframes are used",
          inject(function($animate, $sniffer, $rootScope, $timeout) {

          if (!$sniffer.transitions) return;

          $rootScope.$digest();
          element[0].removeChild(child[0]);

          //enter
          $animate.enter(child, element);
          $rootScope.$digest();
          $animate.triggerReflow();

          expect(child.attr('class')).toContain('ng-enter');
          expect(child.attr('class')).toContain('ng-enter-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          $animate.triggerCallbacks();

          //move
          element.append(after);
          $animate.move(child, element, after);
          $rootScope.$digest();
          $animate.triggerReflow();

          expect(child.attr('class')).toContain('ng-move');
          expect(child.attr('class')).toContain('ng-move-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          $animate.triggerCallbacks();

          //hide
          $animate.addClass(child, 'ng-hide');
          $animate.triggerReflow();
          expect(child.attr('class')).toContain('ng-hide-add');
          expect(child.attr('class')).toContain('ng-hide-add-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          //show
          $animate.removeClass(child, 'ng-hide');
          $animate.triggerReflow();
          expect(child.attr('class')).toContain('ng-hide-remove');
          expect(child.attr('class')).toContain('ng-hide-remove-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          //leave
          $animate.leave(child);
          $rootScope.$digest();
          $animate.triggerReflow();
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
            $animate.triggerReflow();
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
          if($sniffer.transitions) {
            $animate.triggerReflow();
          }
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


        it("should retain existing styles of the animated element",
          inject(function($animate, $rootScope, $sniffer, $timeout) {

          element.append(child);
          child.attr('style', 'width: 20px');

          $animate.addClass(child, 'ng-hide');
          $animate.leave(child);
          $rootScope.$digest();

          if($sniffer.transitions) {
            $animate.triggerReflow();

            //this is to verify that the existing style is appended with a semicolon automatically
            expect(child.attr('style')).toMatch(/width: 20px;.*?/i);
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(child.attr('style')).toMatch(/width: 20px/i);
        }));


        it("should call the cancel callback when another animation is called on the same element",
          inject(function($animate, $rootScope, $sniffer, $timeout) {

          element.append(child);

          child.addClass('custom-delay ng-hide');
          $animate.removeClass(child, 'ng-hide');
          if($sniffer.transitions) {
            $animate.triggerReflow();
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
            $animate.triggerReflow();
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          $animate.triggerCallbacks();

          expect(completed).toBe(true);
        }));

        it("should skip class-based animations if animations are directly disabled on the same element", function() {
          var capture;
          module(function($animateProvider) {
            $animateProvider.register('.capture', function() {
              return {
                addClass : function(element, className, done) {
                  capture = true;
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope, $sniffer, $timeout) {
            $animate.enabled(true);
            $animate.enabled(false, element);

            $animate.addClass(element, 'capture');
            expect(element.hasClass('capture')).toBe(true);
            expect(capture).not.toBe(true);
          });
        });

        it("should not apply a cancellation when addClass is done multiple times",
          inject(function($animate, $rootScope, $sniffer, $timeout) {

          element.append(child);

          $animate.addClass(child, 'custom-delay');
          $animate.addClass(child, 'custom-long-delay');

          expect(child.hasClass('animation-cancelled')).toBe(false);
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
          })
        );


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
          });
        });

        /* The CSS animation handler must always be rendered before the other JS animation
           handlers. This is important since the CSS animation handler may place temporary
           styling on the HTML element before the reflow commences which in turn may override
           other transition or keyframe styles that any former JS animations may have placed
           on the element: https://github.com/angular/angular.js/issues/6675 */
        it("should always perform the CSS animation before the JS animation", function() {
          var log = [];
          module(function($animateProvider) {
            //CSS animation handler
            $animateProvider.register('', function() {
              return {
                leave : function() { log.push('css'); }
              };
            });
            //custom JS animation handler
            $animateProvider.register('.js-animation', function() {
              return {
                leave : function() { log.push('js'); }
              };
            });
          });
          inject(function($animate, $rootScope, $compile, $sniffer) {
            if(!$sniffer.transitions) return;

            element = $compile(html('<div class="js-animation"></div>'))($rootScope);
            $animate.leave(element);
            $rootScope.$digest();
            expect(log).toEqual(['css','js']);
          });
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
              $animate.triggerReflow();
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
              $animate.triggerReflow();
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 6000, elapsedTime: 6 });
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
              $animate.triggerReflow();
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
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-remove')).toBe(true);
                expect(element.hasClass('ng-hide-remove-active')).toBe(true);
              }

              element.removeClass('ng-hide');
              $animate.addClass(element, 'ng-hide');
              expect(element.hasClass('ng-hide-remove')).toBe(false); //added right away

              if($sniffer.animations) { //cleanup some pending animations
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-add')).toBe(true);
                expect(element.hasClass('ng-hide-add-active')).toBe(true);
                browserTrigger(element,'animationend', { timeStamp: Date.now() + 2000, elapsedTime: 2 });
              }

              expect(element.hasClass('ng-hide-remove-active')).toBe(false);
            })
          );


          it("should stagger the items when the correct CSS class is provided",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

            if(!$sniffer.animations) return;

            $animate.enabled(true);

            ss.addRule('.real-animation.ng-enter, .real-animation.ng-leave',
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

            var newScope, element, elements = [];
            for(var i = 0; i < 5; i++) {
              newScope = $rootScope.$new();
              element = $compile('<div class="real-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect(elements[0].attr('style')).toBeFalsy();
            expect(elements[1].attr('style')).toMatch(/animation-delay: 0\.1\d*s/);
            expect(elements[2].attr('style')).toMatch(/animation-delay: 0\.2\d*s/);
            expect(elements[3].attr('style')).toMatch(/animation-delay: 0\.3\d*s/);
            expect(elements[4].attr('style')).toMatch(/animation-delay: 0\.4\d*s/);

            //final closing timeout
            $timeout.flush();

            for(i = 0; i < 5; i++) {
              dealoc(elements[i]);
              newScope = $rootScope.$new();
              element = $compile('<div class="fake-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements[i] = element;
            }

            $rootScope.$digest();

            //this means no animations were triggered
            $timeout.verifyNoPendingTasks();

            expect(elements[0].attr('style')).toBeFalsy();
            expect(elements[1].attr('style')).not.toMatch(/animation-delay: 0\.1\d*s/);
            expect(elements[2].attr('style')).not.toMatch(/animation-delay: 0\.2\d*s/);
            expect(elements[3].attr('style')).not.toMatch(/animation-delay: 0\.3\d*s/);
            expect(elements[4].attr('style')).not.toMatch(/animation-delay: 0\.4\d*s/);
          }));


          it("should block and unblock keyframe animations when a stagger animation kicks in while skipping the first element",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement) {

            if(!$sniffer.animations) return;

            $animate.enabled(true);

            ss.addRule('.blocked-animation.ng-enter',
              '-webkit-animation:my_animation 1s;' +
              'animation:my_animation 1s;');

            ss.addRule('.blocked-animation.ng-enter-stagger',
              '-webkit-animation-delay:0.2s;' +
              'animation-delay:0.2s;');

            var container = $compile(html('<div></div>'))($rootScope);

            var elements = [];
            for(var i = 0; i < 4; i++) {
              var newScope = $rootScope.$new();
              var element = $compile('<div class="blocked-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();

            expect(elements[0].attr('style')).toBeUndefined();
            expect(elements[1].attr('style')).toMatch(/animation:.*?none/);
            expect(elements[2].attr('style')).toMatch(/animation:.*?none/);
            expect(elements[3].attr('style')).toMatch(/animation:.*?none/);

            $animate.triggerReflow();

            expect(elements[0].attr('style')).toBeUndefined();
            expect(elements[1].attr('style')).not.toMatch(/animation:.*?none/);
            expect(elements[1].attr('style')).toMatch(/animation-delay: 0.2\d*s/);
            expect(elements[2].attr('style')).not.toMatch(/animation:.*?none/);
            expect(elements[2].attr('style')).toMatch(/animation-delay: 0.4\d*s/);
            expect(elements[3].attr('style')).not.toMatch(/animation:.*?none/);
            expect(elements[3].attr('style')).toMatch(/animation-delay: 0.6\d*s/);
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
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect(elements[0].attr('style')).toBeFalsy();
            expect(elements[1].attr('style')).toMatch(/animation-delay: 1\.1\d*s,\s*2\.1\d*s/);
            expect(elements[2].attr('style')).toMatch(/animation-delay: 1\.2\d*s,\s*2\.2\d*s/);
            expect(elements[3].attr('style')).toMatch(/animation-delay: 1\.3\d*s,\s*2\.3\d*s/);
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
              $animate.triggerReflow();
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
                $animate.triggerReflow();
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
              expect(element).toBeShown();
              $animate.enabled(true);

              element.addClass('ng-hide');
              expect(element).toBeHidden();

              $animate.removeClass(element, 'ng-hide');
              if ($sniffer.transitions) {
                $animate.triggerReflow();
                var now = Date.now();
                browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });
                browserTrigger(element,'transitionend', { timeStamp: now + 3000, elapsedTime: 3 });
                browserTrigger(element,'transitionend', { timeStamp: now + 3000, elapsedTime: 3 });
              }
              expect(element).toBeShown();
            })
          );


          it("should NOT overwrite styles with outdated values when animation completes",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

              if(!$sniffer.transitions) return;

              var style = '-webkit-transition-duration: 1s, 2000ms, 1s;' +
                          '-webkit-transition-property: height, left, opacity;' +
                                  'transition-duration: 1s, 2000ms, 1s;' +
                                   'transition-property: height, left, opacity;';

              ss.addRule('.ng-hide-add', style);
              ss.addRule('.ng-hide-remove', style);

              element = $compile(html('<div style="width: 100px">foo</div>'))($rootScope);
              element.addClass('ng-hide');

              $animate.removeClass(element, 'ng-hide');

              $animate.triggerReflow();

              var now = Date.now();
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });

              element.css('width', '200px');
              browserTrigger(element,'transitionend', { timeStamp: now + 2000, elapsedTime: 2 });
              expect(element.css('width')).toBe("200px");
            }));

          it("should NOT overwrite styles when a transition with a specific property is used",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if(!$sniffer.transitions) return;

            var style = '-webkit-transition: border linear .2s;' +
                                'transition: border linear .2s;';

            ss.addRule('.on', style);
            element = $compile(html('<div style="height:200px"></div>'))($rootScope);
            $animate.addClass(element, 'on');

            $animate.triggerReflow();

            var now = Date.now();
            browserTrigger(element,'transitionend', { timeStamp: now + 200, elapsedTime: 0.2 });
            expect(element.css('height')).toBe("200px");
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
                $animate.triggerReflow();
              }
              expect(element).toBeShown();
              if ($sniffer.transitions) {
                expect(element.hasClass('ng-hide-remove-active')).toBe(true);
                browserTrigger(element,'animationend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
                expect(element.hasClass('ng-hide-remove-active')).toBe(false);
              }
            })
          );


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
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-remove')).toBe(true);
                expect(element.hasClass('ng-hide-remove-active')).toBe(true);
                browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
              }
              expect(element.hasClass('ng-hide-remove')).toBe(false);
              expect(element.hasClass('ng-hide-remove-active')).toBe(false);
              expect(element).toBeShown();

              $animate.addClass(element, 'ng-hide');

              if($sniffer.transitions) {
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-add')).toBe(true);
                expect(element.hasClass('ng-hide-add-active')).toBe(true);
              }
            })
          );


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

            var newScope, element, elements = [];
            for(var i = 0; i < 5; i++) {
              newScope = $rootScope.$new();
              element = $compile('<div class="real-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect(elements[0].attr('style')).toBeFalsy();
            expect(elements[1].attr('style')).toMatch(/transition-delay: 0\.1\d*s/);
            expect(elements[2].attr('style')).toMatch(/transition-delay: 0\.2\d*s/);
            expect(elements[3].attr('style')).toMatch(/transition-delay: 0\.3\d*s/);
            expect(elements[4].attr('style')).toMatch(/transition-delay: 0\.4\d*s/);

            for(i = 0; i < 5; i++) {
              dealoc(elements[i]);
              newScope = $rootScope.$new();
              element = $compile('<div class="fake-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements[i] = element;
            }

            $rootScope.$digest();
            $animate.triggerReflow();

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
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect(elements[0].attr('style')).toMatch(/transition-duration: 1\d*s,\s*3\d*s;/);
            expect(elements[0].attr('style')).not.toContain('transition-delay');
            expect(elements[1].attr('style')).toMatch(/transition-delay: 2\.1\d*s,\s*4\.1\d*s/);
            expect(elements[2].attr('style')).toMatch(/transition-delay: 2\.2\d*s,\s*4\.2\d*s/);
            expect(elements[3].attr('style')).toMatch(/transition-delay: 2\.3\d*s,\s*4\.3\d*s/);
          }));


          it("should apply a closing timeout to close all pending transitions",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if (!$sniffer.transitions) return;

            ss.addRule('.animated-element', '-webkit-transition:5s linear all;' +
                                                    'transition:5s linear all;');

            element = $compile(html('<div class="animated-element">foo</div>'))($rootScope);

            $animate.addClass(element, 'some-class');

            $animate.triggerReflow(); //reflow
            expect(element.hasClass('some-class-add-active')).toBe(true);

            $timeout.flush(7500); //closing timeout
            expect(element.hasClass('some-class-add-active')).toBe(false);
          }));

          it("should intelligently cancel former timeouts and close off a series of elements a final timeout", function() {
            var currentTimestamp, cancellations = 0;
            module(function($provide) {
              $provide.decorator('$timeout', function($delegate) {
                var _cancel = $delegate.cancel;
                $delegate.cancel = function(timer) {
                  if(timer) {
                    cancellations++;
                    return _cancel.apply($delegate, arguments);
                  }
                };
                return $delegate;
              });

              return function($sniffer) {
                if($sniffer.transitions) {
                  currentTimestamp = Date.now();
                  spyOn(Date,'now').andCallFake(function() {
                    return currentTimestamp;
                  });
                }
              };
            });
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {
              if (!$sniffer.transitions) return;

              ss.addRule('.animate-me div', '-webkit-transition:1s linear all;' +
                                                      'transition:1s linear all;');

              ss.addRule('.animate-me-longer div', '-webkit-transition:1.5s linear all;' +
                                                       'transition:1.5s linear all;');

              element = $compile(html('<div class="animate-me-longer">' +
                                      '  <div ng-repeat="item in items"></div>' +
                                      '</div>'))($rootScope);
              $rootScope.items = [0];
              $rootScope.$digest();
              $animate.triggerReflow();

              currentTimestamp += 2250; //1.5 * 1500 = 2250

              element[0].className = 'animate-me';

              $rootScope.items = [1,2,3,4,5,6,7,8,9,10];
              var totalOperations = $rootScope.items.length;

              $rootScope.$digest();

              $rootScope.items = [0];
              $animate.triggerReflow();

              currentTimestamp += 1500; //1.5 * 1000 = 1500
              $timeout.flush(1500);

              expect(cancellations).toBe(1);
              expect(element.children().length).toBe(10);
              cancellations = 0;

              $rootScope.items = [1];
              $rootScope.$digest();

              $animate.triggerReflow();
              $timeout.flush(1500);
              expect(element.children().length).toBe(1);
              expect(cancellations).toBe(1);
            });
          });

          it("apply a closing timeout with respect to a staggering animation",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if (!$sniffer.transitions) return;

            ss.addRule('.entering-element.ng-enter',
              '-webkit-transition:5s linear all;' +
                      'transition:5s linear all;');

            ss.addRule('.entering-element.ng-enter-stagger',
              '-webkit-transition-delay:0.5s;' +
                      'transition-delay:0.5s;');

            element = $compile(html('<div></div>'))($rootScope);
            var kids = [];
            for(var i = 0; i < 5; i++) {
              kids.push(angular.element('<div class="entering-element"></div>'));
              $animate.enter(kids[i], element);
            }
            $rootScope.$digest();

            $animate.triggerReflow(); //reflow
            expect(element.children().length).toBe(5);

            for(i = 0; i < 5; i++) {
              expect(kids[i].hasClass('ng-enter-active')).toBe(true);
            }

            $timeout.flush(7500);

            for(i = 0; i < 5; i++) {
              expect(kids[i].hasClass('ng-enter-active')).toBe(true);
            }

            //(stagger * index) + (duration + delay) * 150%
            //0.5 * 4 + 5 * 1.5 = 9500;
            //9500 - 7500 = 2000
            $timeout.flush(1999); //remove 1999 more

            for(i = 0; i < 5; i++) {
              expect(kids[i].hasClass('ng-enter-active')).toBe(true);
            }

            $timeout.flush(1); //up to 2000ms

            for(i = 0; i < 5; i++) {
              expect(kids[i].hasClass('ng-enter-active')).toBe(false);
            }
          }));


          it("should not allow the closing animation to close off a successive animation midway",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if (!$sniffer.transitions) return;

            ss.addRule('.some-class-add', '-webkit-transition:5s linear all;' +
                                                  'transition:5s linear all;');
            ss.addRule('.some-class-remove', '-webkit-transition:10s linear all;' +
                                                     'transition:10s linear all;');

            element = $compile(html('<div>foo</div>'))($rootScope);

            $animate.addClass(element, 'some-class');

            $animate.triggerReflow(); //reflow
            expect(element.hasClass('some-class-add-active')).toBe(true);

            $animate.removeClass(element, 'some-class');

            $animate.triggerReflow(); //second reflow

            $timeout.flush(7500); //closing timeout for the first animation
            expect(element.hasClass('some-class-remove-active')).toBe(true);

            $timeout.flush(15000); //closing timeout for the second animation
            expect(element.hasClass('some-class-remove-active')).toBe(false);

            $timeout.verifyNoPendingTasks();
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
          }

          $rootScope.$digest();
          $animate.triggerReflow();

          expect(elements[0].attr('style')).toBeFalsy();

          expect(elements[1].attr('style')).toMatch(/transition-delay:\s+1.1\d*/);
          expect(elements[1].attr('style')).toMatch(/animation-delay: 1\.2\d*s,\s*2\.2\d*s/);

          expect(elements[2].attr('style')).toMatch(/transition-delay:\s+1.2\d*/);
          expect(elements[2].attr('style')).toMatch(/animation-delay: 1\.4\d*s,\s*2\.4\d*s/);

          for(i = 0; i < 3; i++) {
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
            $animate.triggerReflow();
            expect(element.hasClass('abc')).toBe(true);
            expect(element.hasClass('ng-enter')).toBe(true);
            expect(element.hasClass('ng-enter-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 22000, elapsedTime: 22 });
            $animate.triggerCallbacks();
          }
          expect(element.hasClass('abc')).toBe(true);

          $rootScope.klass = 'xyz';
          $animate.enter(element, parent);
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(element.hasClass('xyz')).toBe(true);
            expect(element.hasClass('ng-enter')).toBe(true);
            expect(element.hasClass('ng-enter-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
            $animate.triggerCallbacks();
          }
          expect(element.hasClass('xyz')).toBe(true);
        }));


        it('should only append active to the newly append CSS className values',
          inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

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
            $animate.triggerReflow();
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
              };
            });
            $animateProvider.register('.other', function($timeout) {
              return {
                enter : function(element, done) {
                  $timeout(done, 10000);
                }
              };
            });
          });
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

          $animate.triggerCallbacks();

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

          $animate.triggerCallbacks();

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

          $animate.triggerCallbacks();

          expect(flag).toBe(true);
          expect(element.parent().id).toBe(parent2.id);

          dealoc(element);
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

          $animate.triggerCallbacks();

          expect(signature).toBe('AB');
        }));

        it("should fire the setClass callback",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

          var parent = jqLite('<div><span class="off"></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          body.append($rootElement);

          expect(element.hasClass('on')).toBe(false);
          expect(element.hasClass('off')).toBe(true);

          var signature = '';
          $animate.setClass(element, 'on', 'off', function() {
            signature += 'Z';
          });

          $animate.triggerCallbacks();

          expect(signature).toBe('Z');
          expect(element.hasClass('on')).toBe(true);
          expect(element.hasClass('off')).toBe(false);
        }));

        it('should fire DOM callbacks on the element being animated',
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

          if(!$sniffer.transitions) return;

          $animate.enabled(true);

          ss.addRule('.klass-add', '-webkit-transition:1s linear all;' +
                                           'transition:1s linear all;');

          var element = jqLite('<div></div>');
          $rootElement.append(element);
          body.append($rootElement);

          var steps = [];
          element.on('$animate:before', function(e, data) {
            steps.push(['before', data.className, data.event]);
          });

          element.on('$animate:after', function(e, data) {
            steps.push(['after', data.className, data.event]);
          });

          element.on('$animate:close', function(e, data) {
            steps.push(['close', data.className, data.event]);
          });

          $animate.addClass(element, 'klass', function() {
            steps.push(['done', 'klass', 'addClass']);
          });

          $animate.triggerCallbacks();

          expect(steps.pop()).toEqual(['before', 'klass', 'addClass']);

          $animate.triggerReflow();

          $animate.triggerCallbacks();

          expect(steps.pop()).toEqual(['after', 'klass', 'addClass']);

          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          $animate.triggerCallbacks();

          expect(steps.shift()).toEqual(['close', 'klass', 'addClass']);

          expect(steps.shift()).toEqual(['done', 'klass', 'addClass']);
        }));

        it('should fire the DOM callbacks even if no animation is rendered',
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

          $animate.enabled(true);

          var parent = jqLite('<div></div>');
          var element = jqLite('<div></div>');
          $rootElement.append(parent);
          body.append($rootElement);

          var steps = [];
          element.on('$animate:before', function(e, data) {
            steps.push(['before', data.className, data.event]);
          });

          element.on('$animate:after', function(e, data) {
            steps.push(['after', data.className, data.event]);
          });

          $animate.enter(element, parent);
          $rootScope.$digest();

          $animate.triggerCallbacks();

          expect(steps.shift()).toEqual(['before', 'ng-enter', 'enter']);
          expect(steps.shift()).toEqual(['after',  'ng-enter', 'enter']);
        }));

        it('should not fire DOM callbacks on the element being animated unless registered',
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement, $timeout) {

          $animate.enabled(true);

          var element = jqLite('<div></div>');
          $rootElement.append(element);
          body.append($rootElement);

          $animate.addClass(element, 'class');
          $rootScope.$digest();

          $timeout.verifyNoPendingTasks();
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

          $animate.triggerCallbacks();
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
          $animate.addClass(element, 'ng-hide', function() {
            flag = true;
          });

          if($sniffer.transitions) {
            $animate.triggerReflow();
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          $animate.triggerCallbacks();
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

          $animate.triggerCallbacks();
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
          if($sniffer.transitions) {
            $animate.triggerReflow();
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 9 });
          }
          $animate.triggerCallbacks();
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
              };
            });
          });
        });


        it("should not perform an animation, and the followup DOM operation, if the class is " +
           "already present during addClass or not present during removeClass on the element",
          inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout, $browser) {

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

        it("should perform the animation if passed native dom element",
          inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout, $browser) {

          var element = jqLite('<div class="klassy"></div>');
          $rootElement.append(element);
          body.append($rootElement);

          //skipped animations
          captured = 'none';
          $animate.removeClass(element[0], 'some-class');
          expect(element.hasClass('some-class')).toBe(false);
          expect(captured).toBe('none');

          element.addClass('some-class');

          captured = 'nothing';
          $animate.addClass(element[0], 'some-class');
          expect(captured).toBe('nothing');
          expect(element.hasClass('some-class')).toBe(true);

          //actual animations
          captured = 'none';
          $animate.removeClass(element[0], 'some-class');
          $animate.triggerReflow();
          expect(element.hasClass('some-class')).toBe(false);
          expect(captured).toBe('removeClass-some-class');

          captured = 'nothing';
          $animate.addClass(element[0], 'some-class');
          $animate.triggerReflow();
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

          $animate.triggerCallbacks();
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
            $animate.triggerReflow();
            expect(element.hasClass('klass')).toBe(true);
            expect(element.hasClass('klass-add-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
          }

          $animate.triggerCallbacks();

          //this cancels out the older animation
          $animate.removeClass(element,'klass', function() {
            signature += '2';
          });

          if($sniffer.transitions) {
            expect(element.hasClass('klass-remove')).toBe(true);

            $animate.triggerReflow();
            expect(element.hasClass('klass')).toBe(false);
            expect(element.hasClass('klass-add')).toBe(false);
            expect(element.hasClass('klass-add-active')).toBe(false);

            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
          }

          $animate.triggerCallbacks();

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

          $animate.triggerCallbacks();
          expect(signature).toBe('XY');
        }));

        it("should properly execute JS animations if passed native dom element",
          inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = jqLite(parent.find('span'));

          var signature = '';

          $animate.addClass(element[0],'klassy', function() {
            signature += 'X';
          });
          $animate.triggerReflow();

          $timeout.flush(500);

          expect(element.hasClass('klassy')).toBe(true);

          $animate.removeClass(element[0],'klassy', function() {
            signature += 'Y';
          });
          $animate.triggerReflow();

          $timeout.flush(3000);

          expect(element.hasClass('klassy')).toBe(false);

          $animate.triggerCallbacks();
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
            $animate.triggerReflow();
            expect(element.hasClass('klass-add')).toBe(true);
            expect(element.hasClass('klass-add-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
            expect(element.hasClass('klass-add')).toBe(false);
            expect(element.hasClass('klass-add-active')).toBe(false);
          }

          $animate.triggerCallbacks();
          expect(element.hasClass('klass')).toBe(true);

          $animate.removeClass(element,'klass', function() {
            signature += 'b';
          });

          if($sniffer.transitions) {
            $animate.triggerReflow();
            expect(element.hasClass('klass-remove')).toBe(true);
            expect(element.hasClass('klass-remove-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
            expect(element.hasClass('klass-remove')).toBe(false);
            expect(element.hasClass('klass-remove-active')).toBe(false);
          }

          $animate.triggerCallbacks();
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
            $animate.triggerReflow();
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

          $animate.triggerCallbacks();

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
            $animate.triggerReflow();
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

          $animate.triggerCallbacks();

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
      };
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
        $animate.triggerReflow();
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
        $animate.triggerReflow();
        expect(child.hasClass('ng-enter')).toBe(true);
        expect(child.hasClass('ng-enter-active')).toBe(true);
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 9000, elapsedTime: 9 });
      }
      expect(child.hasClass('ng-enter')).toBe(false);
      expect(child.hasClass('ng-enter-active')).toBe(false);
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
          };
        });
      });
      inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

        ss.addRule('.ng-enter', '-webkit-transition: 1s linear all;' +
                                        'transition: 1s linear all;');

        var element = html($compile('<div>...</div>')($rootScope));
        var child = $compile('<div>...</div>')($rootScope);

        expect(child.hasClass('i-was-animated')).toBe(false);

        child.addClass('custom');
        $animate.enter(child, element);
        $rootScope.$digest();

        if($sniffer.transitions) {
          $animate.triggerReflow();
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
          };
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
          $animate.triggerReflow();
          expect(child.hasClass('ng-enter')).toBe(true);
          expect(child.hasClass('ng-enter-active')).toBe(true);
        }

        expect(child.hasClass('this-is-mine-now')).toBe(false);
        child.addClass('usurper');
        $animate.leave(child);
        $rootScope.$digest();
        $animate.triggerCallbacks();

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

        $animate.triggerReflow();
        expect(child.hasClass('ng-enter-active')).toBe(false);
      });
    });

    //
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
  //      $animate.triggerCallbacks();
  //    }
  //
  //    $animate.triggerCallbacks();
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
  //    $animate.triggerCallbacks();
  //    expect(element.hasClass('on')).toBe(false);
  //    expect(element.hasClass('on-remove')).toBe(false);
  //    expect(element.hasClass('on-remove-active')).toBe(false);
  //  }));
  //
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
  //        $animate.triggerCallbacks();
  //        expect(element).toBeShown();
  //        $timeout.flush(5555);
  //      }
  //      $animate.triggerCallbacks();
  //      expect(element).toBeHidden();
  //
  //      expect(element.hasClass('showing')).toBe(false);
  //      expect(element.hasClass('hiding')).toBe(true);
  //      $animate.removeClass(element, 'ng-hide');
  //
  //      if($sniffer.transitions) {
  //        expect(element).toBeHidden();
  //        $animate.triggerCallbacks();
  //        expect(element).toBeHidden();
  //        $timeout.flush(5580);
  //      }
  //      $animate.triggerCallbacks();
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
              };
              return function() {
                interceptedClass = element.attr('class');
              };
            }
          };
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
          };
        });
      });
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
          $animate.triggerReflow();
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
      $animate.triggerReflow();

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
              };
            },
            addClass : function(element, className, done) {
              animationState = 'addClass';
              step = done;
              return function(cancelled) {
                animationState = cancelled ? 'addClass-cancel' : animationState;
              };
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
          $animate.triggerReflow();
          expect(child.hasClass('ng-enter-active')).toBe(true);
        }

        $animate.move(element, container);
        if($sniffer.transitions) {
          expect(child.hasClass('ng-enter')).toBe(false);
          expect(child.hasClass('ng-enter-active')).toBe(false);
        }

        expect(animationState).toBe('enter-cancel');

        $rootScope.$digest();
        $animate.triggerCallbacks();

        $animate.addClass(child, 'something');
        if($sniffer.transitions) {
          $animate.triggerReflow();
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
      inject(function($rootScope, $compile, $timeout, $sniffer, $animate) {

      if(!$sniffer.transitions) return;

      $rootScope.items = [1,2,3,4,5];
      var element = html($compile('<div><div class="animated" ng-repeat="item in items"></div></div>')($rootScope));

      ss.addRule('.animated.ng-enter',  '-webkit-transition: width 1s, background 1s 1s;' +
                                                'transition: width 1s, background 1s 1s;');

      $rootScope.$digest();
      expect(element[0].querySelectorAll('.ng-enter-active').length).toBe(0);
      $animate.triggerReflow();
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
          };
        });
        $animateProvider.register('.container', function() {
          return {
            leave : function(element, done) {
              containerAnimated = true;
              done();
            }
          };
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


    it("should disable all child animations on structural animations until the post animation" +
       "timeout has passed as well as all structural animations", function() {
      var intercepted, continueAnimation;
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
              continueAnimation = function() {
                continueAnimation = angular.noop;
                (done || className)();
              };
            };
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

        var body = angular.element($document[0].body);
        body.append($rootElement);
        $rootElement.append(container);
        element.append(child1);
        element.append(child2);

        $animate.enter(element, container);
        $rootScope.$digest();

        expect(intercepted).toBe('enter');
        continueAnimation();

        $animate.addClass(child1, 'test');
        expect(child1.hasClass('test')).toBe(true);

        expect(element.children().length).toBe(2);

        expect(intercepted).toBe('enter');
        $animate.leave(child1);
        $rootScope.$digest();

        expect(element.children().length).toBe(1);

        expect(intercepted).toBe('enter');

        $animate.move(element, null, container);
        $rootScope.$digest();

        expect(intercepted).toBe('move');

        //flush the POST enter callback
        $animate.triggerCallbacks();

        $animate.addClass(child2, 'testing');
        expect(intercepted).toBe('move');

        continueAnimation();

        //flush the POST move callback
        $animate.triggerCallbacks();

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
          };
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
        if (!$sniffer.transitions) return;

        $animate.enabled(true);

        var kid, element = $compile('<div></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        for(var i=0;i<20;i++) {
          kid = $compile('<div class="kid"></div>')($rootScope);
          $animate.enter(kid, element);
        }
        $rootScope.$digest();

        //called three times since the classname is the same
        expect(count).toBe(2);

        dealoc(element);
        count = 0;

        for(i=0;i<20;i++) {
          kid = $compile('<div class="kid c-'+i+'"></div>')($rootScope);
          $animate.enter(kid, element);
        }

        $rootScope.$digest();

        expect(count).toBe(20);
      });
    });



    it("should cancel and perform the dom operation only after the reflow has run",
      inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {

      if (!$sniffer.transitions) return;

      ss.addRule('.green-add', '-webkit-transition:1s linear all;' +
                                       'transition:1s linear all;');

      ss.addRule('.red-add', '-webkit-transition:1s linear all;' +
                                     'transition:1s linear all;');

      var element = $compile('<div></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $animate.addClass(element, 'green');
      expect(element.hasClass('green-add')).toBe(true);

      $animate.addClass(element, 'red');
      expect(element.hasClass('red-add')).toBe(true);

      expect(element.hasClass('green')).toBe(false);
      expect(element.hasClass('red')).toBe(false);

      $animate.triggerReflow();

      expect(element.hasClass('green')).toBe(true);
      expect(element.hasClass('red')).toBe(true);
    }));

    it("should properly add and remove CSS classes when multiple classes are applied",
      inject(function($compile, $rootScope, $animate) {

      $animate.enabled();

      var exp = "{{ className ? 'before ' + className + ' after' : '' }}";
      var element = $compile('<div class="' + exp + '"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      function assertClasses(str) {
        var className = element.attr('class');
        str.length === 0
            ? className.length === 0
            : expect(className.split(/\s+/)).toEqual(str.split(' '));
      }

      $rootScope.className = '';
      $rootScope.$digest();
      $animate.triggerReflow();

      assertClasses('');

      $rootScope.className = 'one';
      $rootScope.$digest();
      $animate.triggerReflow();

      assertClasses('before one after');

      $rootScope.className = 'two';
      $rootScope.$digest();
      $animate.triggerReflow();

      assertClasses('before after two');

      $rootScope.className = '';
      $rootScope.$digest();
      //intentionally avoiding the triggerReflow operation

      assertClasses('');
    }));

    it("should avoid mixing up substring classes during add and remove operations", function() {
      var currentAnimation, currentFn;
      module(function($animateProvider) {
        $animateProvider.register('.on', function() {
          return {
            beforeAddClass : function(element, className, done) {
              currentAnimation = 'addClass';
              currentFn = done;
              return function(cancelled) {
                currentAnimation = cancelled ? null : currentAnimation;
              };
            },
            beforeRemoveClass : function(element, className, done) {
              currentAnimation = 'removeClass';
              currentFn = done;
              return function(cancelled) {
                currentAnimation = cancelled ? null : currentAnimation;
              };
            }
          };
        });
      });
      inject(function($compile, $rootScope, $animate, $sniffer, $timeout) {
        var element = $compile('<div class="animation-enabled only"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $animate.addClass(element, 'on');
        expect(currentAnimation).toBe('addClass');
        currentFn();

        currentAnimation = null;

        $animate.removeClass(element, 'on');
        $animate.addClass(element, 'on');

        expect(currentAnimation).toBe('addClass');
      });
    });

    it('should enable and disable animations properly on the root element', function() {
      var count = 0;
      module(function($animateProvider) {
        $animateProvider.register('.animated', function() {
          return {
            addClass : function(element, className, done) {
              count++;
              done();
            }
          };
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


    it('should only perform the DOM operation once',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate, $timeout) {

      if (!$sniffer.transitions) return;

      ss.addRule('.base-class', '-webkit-transition:1s linear all;' +
                                        'transition:1s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="base-class one two"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $animate.removeClass(element, 'base-class one two');

      //still true since we're before the reflow
      expect(element.hasClass('base-class')).toBe(false);

      //this will cancel the remove animation
      $animate.addClass(element, 'base-class one two');

      //the cancellation was a success and the class was added right away
      //since there was no successive animation for the after animation
      expect(element.hasClass('base-class')).toBe(false);

      //the reflow...
      $animate.triggerReflow();

      //the reflow DOM operation was commenced but it ran before so it
      //shouldn't run agaun
      expect(element.hasClass('base-class')).toBe(true);
    }));


    it('should block and unblock transitions before the dom operation occurs',
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer, $timeout) {

      if (!$sniffer.transitions) return;

      $animate.enabled(true);

      ss.addRule('.cross-animation', '-webkit-transition:1s linear all;' +
                                             'transition:1s linear all;');

      var capturedProperty = 'none';

      var element = $compile('<div class="cross-animation"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var node = element[0];
      node._setAttribute = node.setAttribute;
      node.setAttribute = function(prop, val) {
        if(prop == 'class' && val.indexOf('trigger-class') >= 0) {
          var propertyKey = ($sniffer.vendorPrefix == 'Webkit' ? '-webkit-' : '') + 'transition-property';
          capturedProperty = element.css(propertyKey);
        }
        node._setAttribute(prop, val);
      };

      expect(capturedProperty).toBe('none');
      $animate.addClass(element, 'trigger-class');

      $animate.triggerReflow();

      expect(capturedProperty).not.toBe('none');
    }));


    it('should not block keyframe animations around the reflow operation',
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer, $timeout) {

      if (!$sniffer.animations) return;

      $animate.enabled(true);

      ss.addRule('.cross-animation', '-webkit-animation:1s my_animation;' +
                                             'animation:1s my_animation;');

      var element = $compile('<div class="cross-animation"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var node = element[0];
      var animationKey = $sniffer.vendorPrefix == 'Webkit' ? 'WebkitAnimation' : 'animation';

      $animate.addClass(element, 'trigger-class');

      expect(node.style[animationKey]).not.toContain('none');

      $animate.triggerReflow();

      expect(node.style[animationKey]).not.toContain('none');

      browserTrigger(element, 'animationend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

      expect(node.style[animationKey]).not.toContain('none');
    }));


    it('should not block keyframe animations at anytime before a followup JS animation occurs', function() {
      module(function($animateProvider) {
        $animateProvider.register('.special', function($sniffer, $window) {
          var prop = $sniffer.vendorPrefix == 'Webkit' ? 'WebkitAnimation' : 'animation';
          return {
            beforeAddClass : function(element, className, done) {
              expect(element[0].style[prop]).not.toContain('none');
              expect($window.getComputedStyle(element[0])[prop + 'Duration']).toBe('1s');
              done();
            },
            addClass : function(element, className, done) {
              expect(element[0].style[prop]).not.toContain('none');
              expect($window.getComputedStyle(element[0])[prop + 'Duration']).toBe('1s');
              done();
            }
          };
        });
      });
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer, $timeout, $window) {
        if (!$sniffer.animations) return;

        $animate.enabled(true);

        ss.addRule('.special', '-webkit-animation:1s special_animation;' +
                                       'animation:1s special_animation;');

        var capturedProperty = 'none';

        var element = $compile('<div class="special"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $animate.addClass(element, 'some-klass');

        var prop = $sniffer.vendorPrefix == 'Webkit' ? 'WebkitAnimation' : 'animation';

        expect(element[0].style[prop]).not.toContain('none');
        expect($window.getComputedStyle(element[0])[prop + 'Duration']).toBe('1s');

        $animate.triggerReflow();
      });
    });


    it('should round up long elapsedTime values to close off a CSS3 animation',
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer, $timeout, $window) {
        if (!$sniffer.animations) return;

        ss.addRule('.millisecond-transition.ng-leave', '-webkit-transition:510ms linear all;' +
                                                       'transition:510ms linear all;');

        var element = $compile('<div class="millisecond-transition"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $animate.leave(element);
        $rootScope.$digest();

        $animate.triggerReflow();

        browserTrigger(element, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 0.50999999991 });

        expect($rootElement.children().length).toBe(0);
      })
    );


    it('should properly animate elements with compound directives', function() {
      var capturedAnimation;
      module(function($animateProvider) {
        $animateProvider.register('.special', function() {
          return {
            enter : function(element, done) {
              capturedAnimation = 'enter';
              done();
            },
            leave : function(element, done) {
              capturedAnimation = 'leave';
              done();
            }
          };
        });
      });
      inject(function($rootScope, $compile, $rootElement, $document, $timeout, $templateCache, $sniffer, $animate) {
        if(!$sniffer.transitions) return;

        $templateCache.put('item-template', 'item: #{{ item }} ');
        var element = $compile('<div>' +
                               ' <div ng-repeat="item in items"' +
                               '      ng-include="tpl"' +
                               '      class="special"></div>' +
                               '</div>')($rootScope);

        ss.addRule('.special', '-webkit-transition:1s linear all;' +
                                       'transition:1s linear all;');

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $rootScope.tpl = 'item-template';
        $rootScope.items = [1,2,3];
        $rootScope.$digest();
        $animate.triggerReflow();

        expect(capturedAnimation).toBe('enter');
        expect(element.text()).toContain('item: #1');

        forEach(element.children(), function(kid) {
          browserTrigger(kid, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        });
        $animate.triggerCallbacks();

        $rootScope.items = [];
        $rootScope.$digest();
        $animate.triggerReflow();

        expect(capturedAnimation).toBe('leave');
      });
    });

    it('should animate only the specified CSS className', function() {
      var captures = {};
      module(function($animateProvider) {
        $animateProvider.classNameFilter(/prefixed-animation/);
        $animateProvider.register('.capture', function() {
          return {
            enter : buildFn('enter'),
            leave : buildFn('leave')
          };

          function buildFn(key) {
            return function(element, className, done) {
              captures[key] = true;
              (done || className)();
            };
          }
        });
      });
      inject(function($rootScope, $compile, $rootElement, $document, $timeout, $templateCache, $sniffer, $animate) {
        if(!$sniffer.transitions) return;

        var element = $compile('<div class="capture"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        var enterDone = false;
        $animate.enter(element, $rootElement, null, function() {
          enterDone = true;
        });

        $rootScope.$digest();
        $animate.triggerCallbacks();

        expect(captures['enter']).toBeUndefined();
        expect(enterDone).toBe(true);

        element.addClass('prefixed-animation');

        var leaveDone = false;
        $animate.leave(element, function() {
          leaveDone = true;
        });

        $rootScope.$digest();
        $animate.triggerCallbacks();

        expect(captures['leave']).toBe(true);
        expect(leaveDone).toBe(true);
      });
    });

    it('should animate only the specified CSS className inside ng-if', function() {
      var captures = {};
      module(function($animateProvider) {
        $animateProvider.classNameFilter(/prefixed-animation/);
        $animateProvider.register('.capture', function() {
          return {
            enter : buildFn('enter'),
            leave : buildFn('leave')
          };

          function buildFn(key) {
            return function(element, className, done) {
              captures[key] = true;
              (done || className)();
            };
          }
        });
      });
      inject(function($rootScope, $compile, $rootElement, $document, $sniffer, $animate) {
        if(!$sniffer.transitions) return;

        var upperElement = $compile('<div><div ng-if=1><span class="capture prefixed-animation"></span></div></div>')($rootScope);
        $rootElement.append(upperElement);
        jqLite($document[0].body).append($rootElement);

        $rootScope.$digest();
        $animate.triggerCallbacks();

        var element = upperElement.find('span');

        var leaveDone = false;
        $animate.leave(element, function() {
          leaveDone = true;
        });

        $rootScope.$digest();
        $animate.triggerCallbacks();

        expect(captures['leave']).toBe(true);
        expect(leaveDone).toBe(true);
      });
    });

    it('should respect the most relevant CSS transition property if defined in multiple classes',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate, $timeout) {

      if (!$sniffer.transitions) return;

      ss.addRule('.base-class', '-webkit-transition:1s linear all;' +
                                        'transition:1s linear all;');

      ss.addRule('.base-class.on', '-webkit-transition:5s linear all;' +
                                           'transition:5s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="base-class"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var ready = false;
      $animate.addClass(element, 'on', function() {
        ready = true;
      });

      $animate.triggerReflow();
      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 1 });
      expect(ready).toBe(false);

      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 5 });
      $animate.triggerReflow();
      $animate.triggerCallbacks();
      expect(ready).toBe(true);

      ready = false;
      $animate.removeClass(element, 'on', function() {
        ready = true;
      });

      $animate.triggerReflow();
      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 1 });
      $animate.triggerCallbacks();
      expect(ready).toBe(true);
    }));

    it('should not apply a transition upon removal of a class that has a transition',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate, $timeout) {

      if (!$sniffer.transitions) return;

      ss.addRule('.base-class.on', '-webkit-transition:5s linear all;' +
                                           'transition:5s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="base-class on"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var ready = false;
      $animate.removeClass(element, 'on', function() {
        ready = true;
      });

      $animate.triggerCallbacks();
      expect(ready).toBe(true);
    }));

    it('should immediately close the former animation if the same CSS class is added/removed',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate, $timeout) {

      if (!$sniffer.transitions) return;

      ss.addRule('.water-class', '-webkit-transition:2s linear all;' +
                                         'transition:2s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="water-class on"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var signature = '';
      $animate.removeClass(element, 'on', function() {
        signature += 'A';
      });
      $animate.addClass(element, 'on', function() {
        signature += 'B';
      });

      $animate.triggerReflow();
      $animate.triggerCallbacks();
      expect(signature).toBe('A');

      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2000 });
      $animate.triggerCallbacks();

      expect(signature).toBe('AB');
    }));

    it('should cancel the previous reflow when new animations are added', function() {
      var cancelReflowCallback = jasmine.createSpy('callback');
      module(function($provide) {
        $provide.value('$$animateReflow', function(fn) {
          return cancelReflowCallback;
        });
      });
      inject(function($animate, $sniffer, $rootScope, $compile) {
        if (!$sniffer.transitions) return;

        ss.addRule('.fly', '-webkit-transition:2s linear all;' +
                                   'transition:2s linear all;');

        $animate.enabled(true);

        var element = $compile('<div class="fly"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        expect(cancelReflowCallback).not.toHaveBeenCalled();

        $animate.addClass(element, 'fast');
        $animate.addClass(element, 'smooth');
        $animate.triggerReflow();

        expect(cancelReflowCallback).toHaveBeenCalled();
      });
    });

    it('should immediately close off a leave animation if the element is removed from the DOM', function() {
      var stat;
      module(function($animateProvider) {
        $animateProvider.register('.going', function() {
          return {
            leave : function() {
              //left blank so it hangs
              stat = 'leaving';
              return function(cancelled) {
                stat = cancelled && 'gone';
              };
            }
          };
        });
      });
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate, $timeout) {

        $animate.enabled(true);

        var element = $compile('<div id="parentGuy"></div>')($rootScope);
        var child = $compile('<div class="going"></div>')($rootScope);
        $rootElement.append(element);
        element.append(child);

        $animate.leave(child);
        $rootScope.$digest();

        expect(stat).toBe('leaving');

        child.remove();

        expect(stat).toBe('gone');
      });
    });

    it('should remove all element and comment nodes during leave animation',
      inject(function($compile, $rootScope) {

      $rootScope.items = [1,2,3,4,5];

      var element = html($compile(
        '<div>' +
        '  <div class="animated" ng-repeat-start="item in items">start</div>' +
        '  <div ng-repeat-end>end</div>' +
        '</div>'
      )($rootScope));

      $rootScope.$digest();

      $rootScope.items = [];

      $rootScope.$digest();

      expect(element.children().length).toBe(0);
    }));

    it('should not throw an error when only comment nodes are rendered in the animation',
      inject(function($rootScope, $compile) {

      $rootScope.items = [1,2,3,4,5];

      var element = html($compile('<div><div class="animated" ng-if="valid" ng-repeat="item in items"></div></div>')($rootScope));

      $rootScope.$digest();

      $rootScope.items = [];

      $rootScope.$digest();

      expect(element.children().length).toBe(0);
    }));

    describe('ngAnimateChildren', function() {
      var spy;

      beforeEach(module(function($animateProvider) {
        spy = jasmine.createSpy();
        $animateProvider.register('.parent', mockAnimate);
        $animateProvider.register('.child', mockAnimate);
        return function($animate) {
          $animate.enabled(true);
        };

        function mockAnimate() {
          return {
            enter : spy,
            leave : spy,
            addClass : spy,
            removeClass : spy
          };
        }
      }));

      it('should animate based on a boolean flag', inject(function($animate, $sniffer, $rootScope, $compile) {
        var html = '<div class="parent" ng-if="on1" ng-animate-children="bool">' +
                   '  <p class="child" ng-if="on2">...</p>' +
                   '</div>';

        var element = $compile(html)($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        var scope = $rootScope;

        scope.bool = true;
        scope.$digest();

        scope.on1 = true;
        scope.on2 = true;
        scope.$digest();

        $animate.triggerReflow();

        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toBe(2);

        scope.bool = false;
        scope.$digest();

        scope.on1 = false;
        scope.$digest();

        scope.on2 = false;
        scope.$digest();

        $animate.triggerReflow();

        expect(spy.callCount).toBe(3);
      }));

      it('should default to true when no expression is provided',
        inject(function($animate, $sniffer, $rootScope, $compile) {

        var html = '<div class="parent" ng-if="on1" ng-animate-children>' +
                   '  <p class="child" ng-if="on2">...</p>' +
                   '</div>';

        var element = $compile(html)($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $rootScope.on1 = true;
        $rootScope.$digest();

        $rootScope.on2 = true;
        $rootScope.$digest();

        $animate.triggerReflow();

        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toBe(2);
      }));

      it('should not perform inherited animations if any parent restricts it',
        inject(function($animate, $sniffer, $rootScope, $compile) {

        var html = '<div ng-animate-children="false">' +
                   '  <div class="parent" ng-if="on" ng-animate-children="true">' +
                   '    <p class="child" ng-if="on">...</p>' +
                   '  </div>' +
                   '</div>';

        var element = $compile(html)($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $rootScope.$digest();

        $rootScope.on = true;
        $rootScope.$digest();

        $animate.triggerReflow();

        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toBe(1);
      }));
    });

    describe('SVG', function() {
      it('should properly apply transitions on an SVG element',
        inject(function($animate, $rootScope, $compile, $rootElement, $sniffer) {

        //jQuery doesn't handle SVG elements natively. Instead, an add-on library
        //is required which is called jquery.svg.js. Therefore, when jQuery is
        //active here there is no point to test this since it won't work by default.
        if(!$sniffer.transitions || !_jqLiteMode) return;

        ss.addRule('circle.ng-enter', '-webkit-transition:1s linear all;' +
                                              'transition:1s linear all;');

        var element = $compile('<svg width="500" height="500">' +
                                 '<circle cx="15" cy="5" r="100" fill="orange" ng-if="on" />' +
                               '</svg>')($rootScope);

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $rootScope.$digest();

        $rootScope.on = true;
        $rootScope.$digest();
        $animate.triggerReflow();

        var child = element.find('circle');

        expect(child.hasClass('ng-enter')).toBe(true);
        expect(child.hasClass('ng-enter-active')).toBe(true);

        browserTrigger(child, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

        expect(child.hasClass('ng-enter')).toBe(false);
        expect(child.hasClass('ng-enter-active')).toBe(false);
      }));
    });
  });
});
