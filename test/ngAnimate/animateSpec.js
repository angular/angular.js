'use strict';

describe("ngAnimate", function() {
  var $originalAnimate;
  beforeEach(module(function($provide) {
    $provide.decorator('$animate', function($delegate) {
      $originalAnimate = $delegate;
      return $delegate;
    });
  }));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  function getMaxValue(prop, element, $window) {
    var node = element[0];
    var cs = $window.getComputedStyle(node);
    var prop0 = 'webkit' + prop.charAt(0).toUpperCase() + prop.substr(1);
    var values = (cs[prop0] || cs[prop]).split(/\s*,\s*/);
    var maxDelay = 0;
    forEach(values, function(value) {
      maxDelay = Math.max(parseFloat(value) || 0, maxDelay);
    });
    return maxDelay;
  }

  it("should disable animations on bootstrap for structural animations even after the first digest has passed", function() {
    var hasBeenAnimated = false;
    module(function($animateProvider) {
      $animateProvider.register('.my-structrual-animation', function() {
        return {
          enter: function(element, done) {
            hasBeenAnimated = true;
            done();
          },
          leave: function(element, done) {
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

  it("should disable animations for two digests until all pending HTTP requests are complete during bootstrap", function() {
    var animateSpy = jasmine.createSpy();
    module(function($animateProvider, $compileProvider) {
      $compileProvider.directive('myRemoteDirective', function() {
        return {
          templateUrl: 'remote.html'
        };
      });
      $animateProvider.register('.my-structrual-animation', function() {
        return {
          enter: animateSpy,
          leave: animateSpy
        };
      });
    });
    inject(function($rootScope, $compile, $animate, $rootElement, $document, $httpBackend) {

      $httpBackend.whenGET('remote.html').respond(200, '<strong>content</strong>');

      var element = $compile('<div my-remote-directive class="my-structrual-animation">...</div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      // running this twice just to prove that the dual post digest is run
      $rootScope.$digest();
      $rootScope.$digest();

      $animate.enter(element, $rootElement);
      $rootScope.$digest();

      expect(animateSpy).not.toHaveBeenCalled();

      $httpBackend.flush();
      $rootScope.$digest();

      $animate.leave(element);
      $rootScope.$digest();

      expect(animateSpy).toHaveBeenCalled();
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
        } catch (e) {}
        $animate.enabled(true);
        $rootScope.$digest();
      };
    }));

    afterEach(function() {
      if (ss) {
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
                addClass: function(element, className, done) {
                  count++;
                  done();
                }
              };
            });
          });
          inject(function($compile, $rootScope, $animate, $sniffer, $rootElement) {
            $animate.enabled(true);

            var elm1 = $compile('<div class="animated"></div>')($rootScope);
            var elm2 = $compile('<div class="animated"></div>')($rootScope);
            $rootElement.append(elm1);
            angular.element(document.body).append($rootElement);

            $animate.addClass(elm1, 'klass');
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(count).toBe(1);

            $animate.enabled(false);

            $animate.addClass(elm1, 'klass2');
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(count).toBe(1);

            $animate.enabled(true);

            elm1.append(elm2);

            $animate.addClass(elm2, 'klass');
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(count).toBe(2);

            $animate.enabled(false, elm1);

            $animate.addClass(elm2, 'klass2');
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(count).toBe(2);

            var root = angular.element($rootElement[0]);
            $rootElement.addClass('animated');
            $animate.addClass(root, 'klass2');
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(count).toBe(3);
          });
        });


        it('should skip animations if the element is attached to the $rootElement', function() {
          var count = 0;
          module(function($animateProvider) {
            $animateProvider.register('.animated', function() {
              return {
                addClass: function(element, className, done) {
                  count++;
                  done();
                }
              };
            });
          });
          inject(function($compile, $rootScope, $animate) {
            $animate.enabled(true);

            var elm1 = $compile('<div class="animated"></div>')($rootScope);

            $animate.addClass(elm1, 'klass2');
            $rootScope.$digest();
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
                addClass: function(element, className, done) {
                  captured = true;
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootElement, $rootScope, $compile) {
            angular.bootstrap(rootElm, ['ngAnimate']);

            $animate.enabled(true);

            var element = $compile('<div class="capture-animation"></div>')($rootScope);
            rootElm.append(element);

            expect(captured).toBe(false);
            $animate.addClass(element, 'red');
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(captured).toBe(true);

            captured = false;
            $animate.enabled(false);

            $animate.addClass(element, 'blue');
            $rootScope.$digest();
            $animate.triggerReflow();
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
                done = arguments.length == 4 ? arguments[2] : done;
                $timeout(done, 2000, false);
                return function() {
                  element.addClass('animation-cancelled');
                };
              }
              return {
                leave: animate,
                addClass: animate,
                removeClass: animate
              };
            });
            $animateProvider.register('.custom-long-delay', function($timeout) {
              function animate(element, done) {
                done = arguments.length == 4 ? arguments[2] : done;
                $timeout(done, 20000, false);
                return function(cancelled) {
                  element.addClass(cancelled ? 'animation-cancelled' : 'animation-ended');
                };
              }
              return {
                leave: animate,
                addClass: animate,
                removeClass: animate
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

              forEach(['.ng-hide-add', '.ng-hide-remove', '.ng-enter', '.ng-leave', '.ng-move', '.my-inline-animation'], function(selector) {
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
          inject(function($animate, $rootScope, $sniffer) {
          element[0].removeChild(child[0]);

          expect(element.contents().length).toBe(0);
          $animate.enter(child, element);
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(child.hasClass('ng-enter')).toBe(true);
            expect(child.hasClass('ng-enter-active')).toBe(true);
            browserTrigger(element, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.contents().length).toBe(1);
        }));

        it("should animate the enter animation event with native dom elements",
          inject(function($animate, $rootScope, $sniffer) {
          element[0].removeChild(child[0]);

          expect(element.contents().length).toBe(0);
          $animate.enter(child[0], element[0]);
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(child.hasClass('ng-enter')).toBe(true);
            expect(child.hasClass('ng-enter-active')).toBe(true);
            browserTrigger(element, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.contents().length).toBe(1);
        }));


        it("should animate the leave animation event",
          inject(function($animate, $rootScope, $sniffer) {

          expect(element.contents().length).toBe(1);
          $animate.leave(child);
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(child.hasClass('ng-leave')).toBe(true);
            expect(child.hasClass('ng-leave-active')).toBe(true);
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.contents().length).toBe(0);
        }));

        it("should animate the leave animation event with native dom elements",
          inject(function($animate, $rootScope, $sniffer) {

          expect(element.contents().length).toBe(1);
          $animate.leave(child[0]);
          $rootScope.$digest();

          if ($sniffer.transitions) {
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
          if ($sniffer.transitions) {
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
          if ($sniffer.transitions) {
            $animate.triggerReflow();
          }
          expect(element.text()).toBe('21');
        }));

        it("should perform the animate event",
          inject(function($animate, $compile, $rootScope, $timeout, $sniffer) {

          $rootScope.$digest();
          $animate.animate(element, { color: 'rgb(255, 0, 0)' }, { color: 'rgb(0, 0, 255)' }, 'animated');
          $rootScope.$digest();

          if ($sniffer.transitions) {
            expect(element.css('color')).toBe('rgb(255, 0, 0)');
            $animate.triggerReflow();
          }
          expect(element.css('color')).toBe('rgb(0, 0, 255)');
        }));

        it("should animate the show animation event",
          inject(function($animate, $rootScope, $sniffer) {

          $rootScope.$digest();
          child.addClass('ng-hide');
          expect(child).toBeHidden();
          $animate.removeClass(child, 'ng-hide');
          $rootScope.$digest();
          if ($sniffer.transitions) {
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
          inject(function($animate, $rootScope, $sniffer) {

          $rootScope.$digest();
          expect(child).toBeShown();
          $animate.addClass(child, 'ng-hide');
          $rootScope.$digest();
          if ($sniffer.transitions) {
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
                beforeAddClass: fallback,
                addClass: fallback,
                beforeRemoveClass: fallback,
                removeClass: fallback,

                beforeSetClass: function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                },
                setClass: function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope) {
            child.attr('class','classify no');
            $animate.setClass(child, 'yes', 'no');
            $rootScope.$digest();
            $animate.triggerReflow();

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
                beforeAddClass: fallback,
                addClass: fallback,
                beforeRemoveClass: fallback,
                removeClass: fallback,

                beforeSetClass: function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                },
                setClass: function(element, add, remove, done) {
                  count++;
                  expect(add).toBe('yes');
                  expect(remove).toBe('no');
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope) {
            child.attr('class','classify no');
            $animate.setClass(child[0], 'yes', 'no');
            $rootScope.$digest();
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
                beforeAddClass: function(element, className, done) {
                  count++;
                  expect(className).toBe('yes');
                  done();
                },
                addClass: function(element, className, done) {
                  count++;
                  expect(className).toBe('yes');
                  done();
                },
                beforeRemoveClass: function(element, className, done) {
                  count++;
                  expect(className).toBe('no');
                  done();
                },
                removeClass: function(element, className, done) {
                  count++;
                  expect(className).toBe('no');
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope) {
            child.attr('class','classify no');
            $animate.setClass(child, 'yes', 'no');
            $rootScope.$digest();
            $animate.triggerReflow();

            expect(child.hasClass('yes')).toBe(true);
            expect(child.hasClass('no')).toBe(false);
            expect(count).toBe(4);
          });
        });

        it("should assign the ng-event className to all animation events when transitions/keyframes are used",
          inject(function($animate, $sniffer, $rootScope) {

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
          $animate.triggerCallbackPromise();

          //move
          element.append(after);
          $animate.move(child, element, after);
          $rootScope.$digest();
          $animate.triggerReflow();

          expect(child.attr('class')).toContain('ng-move');
          expect(child.attr('class')).toContain('ng-move-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          $animate.triggerCallbackPromise();

          //hide
          $animate.addClass(child, 'ng-hide');
          $rootScope.$digest();
          $animate.triggerReflow();
          expect(child.attr('class')).toContain('ng-hide-add');
          expect(child.attr('class')).toContain('ng-hide-add-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          //show
          $animate.removeClass(child, 'ng-hide');
          $rootScope.$digest();
          $animate.triggerReflow();
          expect(child.attr('class')).toContain('ng-hide-remove');
          expect(child.attr('class')).toContain('ng-hide-remove-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          //animate
          $animate.animate(child, null, null, 'my-inline-animation');
          $rootScope.$digest();
          $animate.triggerReflow();

          expect(child.attr('class')).toContain('my-inline-animation');
          expect(child.attr('class')).toContain('my-inline-animation-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          $animate.triggerCallbackPromise();

          //leave
          $animate.leave(child);
          $rootScope.$digest();
          $animate.triggerReflow();
          expect(child.attr('class')).toContain('ng-leave');
          expect(child.attr('class')).toContain('ng-leave-active');
          browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
        }));


        it("should trigger a cancellation when the return function is called upon any animation", function() {
          var captures = {};

          module(function($animateProvider) {
            $animateProvider.register('.track-me', function() {
              return {
                enter: track('enter'),
                leave: track('leave'),
                move: track('move'),
                addClass: track('addClass'),
                removeClass: track('removeClass'),
                setClass: track('setClass')
              };

              function track(type) {
                return function(element, add, remove, done) {
                  done = done || remove || add;
                  return function(cancelled) {
                    captures[type]=cancelled;
                  };
                };
              }
            });
          });
          inject(function($animate, $sniffer, $rootScope) {

            var promise;
            $animate.enabled(true);
            $rootScope.$digest();
            element[0].removeChild(child[0]);
            child.addClass('track-me');

            //enter
            promise = $animate.enter(child, element);
            $rootScope.$digest();
            $animate.triggerReflow();

            expect(captures.enter).toBeUndefined();
            $animate.cancel(promise);
            expect(captures.enter).toBeTruthy();
            $animate.triggerCallbackPromise();

            //move
            element.append(after);
            promise = $animate.move(child, element, after);
            $rootScope.$digest();
            $animate.triggerReflow();

            expect(captures.move).toBeUndefined();
            $animate.cancel(promise);
            expect(captures.move).toBeTruthy();
            $animate.triggerCallbackPromise();

            //addClass
            promise = $animate.addClass(child, 'ng-hide');
            $rootScope.$digest();
            $animate.triggerReflow();

            expect(captures.addClass).toBeUndefined();
            $animate.cancel(promise);
            expect(captures.addClass).toBeTruthy();
            $animate.triggerCallbackPromise();

            //removeClass
            promise = $animate.removeClass(child, 'ng-hide');
            $rootScope.$digest();
            $animate.triggerReflow();

            expect(captures.removeClass).toBeUndefined();
            $animate.cancel(promise);
            expect(captures.removeClass).toBeTruthy();
            $animate.triggerCallbackPromise();

            //setClass
            child.addClass('red');
            promise = $animate.setClass(child, 'blue', 'red');
            $rootScope.$digest();
            $animate.triggerReflow();

            expect(captures.setClass).toBeUndefined();
            $animate.cancel(promise);
            expect(captures.setClass).toBeTruthy();
            $animate.triggerCallbackPromise();

            //leave
            promise = $animate.leave(child);
            $rootScope.$digest();

            expect(captures.leave).toBeUndefined();
            $animate.cancel(promise);
            expect(captures.leave).toBeTruthy();
            $animate.triggerCallbackPromise();
          });
        });


        it("should not run if animations are disabled",
          inject(function($animate, $rootScope, $timeout, $sniffer) {

          $animate.enabled(false);

          $rootScope.$digest();

          element.addClass('setup-memo');

          element.text('123');
          expect(element.text()).toBe('123');
          $animate.removeClass(element, 'ng-hide');
          $rootScope.$digest();
          expect(element.text()).toBe('123');

          $animate.enabled(true);

          element.addClass('ng-hide');
          $animate.removeClass(element, 'ng-hide');
          $rootScope.$digest();
          if ($sniffer.transitions) {
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
          $rootScope.$digest();
          if ($sniffer.transitions) {
            expect(child).toBeShown();
          }

          $animate.leave(child);
          $rootScope.$digest();
          if ($sniffer.transitions) {
            $animate.triggerReflow();
          }
          expect(child).toBeHidden(); //hides instantly

          //lets change this to prove that done doesn't fire anymore for the previous hide() operation
          child.css('display','block');
          child.removeClass('ng-hide');

          if ($sniffer.transitions) {
            expect(element.children().length).toBe(1); //still animating
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          $timeout.flush(2000);
          $timeout.flush(2000);
          expect(child).toBeShown();

          expect(element.children().length).toBe(0);
        }));


        it("should retain existing styles of the animated element",
          inject(function($animate, $rootScope, $sniffer) {

          element.append(child);
          child.attr('style', 'width: 20px');

          $animate.addClass(child, 'ng-hide');
          $rootScope.$digest();

          $animate.leave(child);
          $rootScope.$digest();

          if ($sniffer.transitions) {
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
          $rootScope.$digest();
          if ($sniffer.transitions) {
            $animate.triggerReflow();
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          $timeout.flush(2000);

          $animate.addClass(child, 'ng-hide');

          expect(child.hasClass('animation-cancelled')).toBe(true);
        }));

        it("should remove the .ng-animate class after the next animation is run which interrupted the last animation", function() {
          var addClassDone, removeClassDone,
              addClassDoneSpy = jasmine.createSpy(),
              removeClassDoneSpy = jasmine.createSpy();

          module(function($animateProvider) {
            $animateProvider.register('.hide', function() {
              return {
                addClass: function(element, className, done) {
                  addClassDone = done;
                  return addClassDoneSpy;
                },
                removeClass: function(element, className, done) {
                  removeClassDone = done;
                  return removeClassDoneSpy;
                }
              };
            });
          });

          inject(function($animate, $rootScope) {
            $animate.addClass(element, 'hide');
            $rootScope.$digest();

            expect(element).toHaveClass('ng-animate');

            $animate.triggerReflow();

            $animate.removeClass(element, 'hide');
            $rootScope.$digest();
            expect(addClassDoneSpy).toHaveBeenCalled();

            $animate.triggerReflow();

            expect(element).toHaveClass('ng-animate');

            removeClassDone();
            $animate.triggerCallbackPromise();

            expect(element).not.toHaveClass('ng-animate');
          });
        });

        it("should skip a class-based animation if the same element already has an ongoing structural animation",
          inject(function($animate, $rootScope, $sniffer) {

          var completed = false;
          $animate.enter(child, element, null).then(function() {
            completed = true;
          });
          $rootScope.$digest();

          expect(completed).toBe(false);

          $animate.addClass(child, 'green');
          $rootScope.$digest();
          expect(element.hasClass('green'));

          expect(completed).toBe(false);
          if ($sniffer.transitions) {
            $animate.triggerReflow();
            browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          $animate.triggerCallbackPromise();

          expect(completed).toBe(true);
        }));

        it("should skip class-based animations if animations are directly disabled on the same element", function() {
          var capture;
          module(function($animateProvider) {
            $animateProvider.register('.capture', function() {
              return {
                addClass: function(element, className, done) {
                  capture = true;
                  done();
                }
              };
            });
          });
          inject(function($animate, $rootScope) {
            $animate.enabled(true);
            $animate.enabled(false, element);

            $animate.addClass(element, 'capture');
            $rootScope.$digest();
            expect(element.hasClass('capture')).toBe(true);
            expect(capture).not.toBe(true);
          });
        });

        it("should not apply a cancellation when addClass is done multiple times",
          inject(function($animate, $rootScope, $sniffer, $timeout) {

          element.append(child);

          $animate.addClass(child, 'custom-delay');
          $rootScope.$digest();

          $animate.addClass(child, 'custom-long-delay');
          $rootScope.$digest();

          $animate.triggerReflow();

          expect(child.hasClass('animation-cancelled')).toBe(false);
          expect(child.hasClass('animation-ended')).toBe(false);

          $timeout.flush();
          expect(child.hasClass('animation-ended')).toBe(true);
        }));


        it("should NOT clobber all data on an element when animation is finished",
          inject(function($animate, $rootScope) {

          child.css('display','none');
          element.data('foo', 'bar');

          $animate.removeClass(element, 'ng-hide');
          $rootScope.$digest();

          $animate.addClass(element, 'ng-hide');
          $rootScope.$digest();

          expect(element.data('foo')).toEqual('bar');
        }));


        it("should allow multiple JS animations which run in parallel",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            $animate.addClass(element, 'custom-delay custom-long-delay');
            $rootScope.$digest();
            $animate.triggerReflow();
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
          $rootScope.$digest();

          if ($sniffer.transitions) {
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

        it('should apply directive styles and provide the style collection to the animation function', function() {
          var animationDone;
          var animationStyles;
          var proxyAnimation = function() {
            var limit = arguments.length - 1;
            animationStyles = arguments[limit];
            animationDone = arguments[limit - 1];
          };
          module(function($animateProvider) {
            $animateProvider.register('.capture', function() {
              return {
                enter: proxyAnimation,
                leave: proxyAnimation,
                move: proxyAnimation,
                addClass: proxyAnimation,
                removeClass: proxyAnimation,
                setClass: proxyAnimation
              };
            });
          });
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout, _$rootElement_) {
            $rootElement = _$rootElement_;

            $animate.enabled(true);

            element = $compile(html('<div></div>'))($rootScope);
            var otherParent = $compile('<div></div>')($rootScope);
            var child = $compile('<div class="capture" style="transition: 0s!important; -webkit-transition: 0s!important;"></div>')($rootScope);

            $rootElement.append(otherParent);
            $rootScope.$digest();

            var styles = {
              from: { backgroundColor: 'blue' },
              to: { backgroundColor: 'red' }
            };

            //enter
            $animate.enter(child, element, null, styles);
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(animationStyles).toEqual(styles);
            animationDone();
            animationDone = animationStyles = null;
            $animate.triggerCallbacks();

            //move
            $animate.move(child, null, otherParent, styles);
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(animationStyles).toEqual(styles);
            animationDone();
            animationDone = animationStyles = null;
            $animate.triggerCallbacks();

            //addClass
            $animate.addClass(child, 'on', styles);
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(animationStyles).toEqual(styles);
            animationDone();
            animationDone = animationStyles = null;
            $animate.triggerCallbacks();

            //setClass
            $animate.setClass(child, 'off', 'on', styles);
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(animationStyles).toEqual(styles);
            animationDone();
            animationDone = animationStyles = null;
            $animate.triggerCallbacks();

            //removeClass
            $animate.removeClass(child, 'off', styles);
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(animationStyles).toEqual(styles);
            animationDone();
            animationDone = animationStyles = null;
            $animate.triggerCallbacks();

            //leave
            $animate.leave(child, styles);
            $rootScope.$digest();
            $animate.triggerReflow();
            expect(animationStyles).toEqual(styles);
            animationDone();
            animationDone = animationStyles = null;
            $animate.triggerCallbacks();

            dealoc(otherParent);
          });
        });
      });

      it("should apply animated styles even if there are no detected animations",
        inject(function($compile, $animate, $rootScope, $sniffer, $rootElement, $document) {

        $animate.enabled(true);
        jqLite($document[0].body).append($rootElement);

        element = $compile('<div class="fake-animation"></div>')($rootScope);

        $animate.enter(element, $rootElement, null, {
          to: {borderColor: 'red'}
        });

        $rootScope.$digest();
        expect(element).toHaveClass('ng-animate');

        $animate.triggerReflow();
        $animate.triggerCallbacks();

        expect(element).not.toHaveClass('ng-animate');
        expect(element.attr('style')).toMatch(/border-color: red/);
      }));

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
                leave: function() { log.push('css'); }
              };
            });
            //custom JS animation handler
            $animateProvider.register('.js-animation', function() {
              return {
                leave: function() { log.push('js'); }
              };
            });
          });
          inject(function($animate, $rootScope, $compile, $sniffer) {
            if (!$sniffer.transitions) return;

            element = $compile(html('<div class="js-animation"></div>'))($rootScope);
            $animate.leave(element);
            $rootScope.$digest();
            expect(log).toEqual(['css','js']);
          });
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
            $rootScope.$digest();
            if ($sniffer.animations) {
              $animate.triggerReflow();
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 4000, elapsedTime: 4 });
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
            $rootScope.$digest();
            if ($sniffer.animations) {
              $animate.triggerReflow();
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 6000, elapsedTime: 6 });
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
            $rootScope.$digest();
            if ($sniffer.transitions) {
              $animate.triggerReflow();
              browserTrigger(element,'animationend', { timeStamp: Date.now() + 20000, elapsedTime: 10 });
            }
            expect(element).toBeShown();
          }));


          it("should skip animations if disabled and run when enabled",
              inject(function($animate, $rootScope, $compile) {
            $animate.enabled(false);
            var style = '-webkit-animation: some_animation 2s linear 0s 1 alternate;' +
                                'animation: some_animation 2s linear 0s 1 alternate;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            element = $compile(html('<div>1</div>'))($rootScope);
            element.addClass('ng-hide');
            expect(element).toBeHidden();
            $animate.removeClass(element, 'ng-hide');
            $rootScope.$digest();
            expect(element).toBeShown();
          }));


          it("should finish the previous animation when a new animation is started",
            inject(function($animate, $rootScope, $compile, $sniffer) {
              var style = '-webkit-animation: some_animation 2s linear 0s 1 alternate;' +
                                  'animation: some_animation 2s linear 0s 1 alternate;';

              ss.addRule('.ng-hide-add', style);
              ss.addRule('.ng-hide-remove', style);

              element = $compile(html('<div class="ng-hide">1</div>'))($rootScope);
              element.addClass('custom');

              $animate.removeClass(element, 'ng-hide');
              $rootScope.$digest();

              if ($sniffer.animations) {
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-remove')).toBe(true);
                expect(element.hasClass('ng-hide-remove-active')).toBe(true);
              }

              element.removeClass('ng-hide');
              $animate.addClass(element, 'ng-hide');
              $rootScope.$digest();

              expect(element.hasClass('ng-hide-remove')).toBe(false); //added right away

              if ($sniffer.animations) { //cleanup some pending animations
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-add')).toBe(true);
                expect(element.hasClass('ng-hide-add-active')).toBe(true);
                browserTrigger(element,'animationend', { timeStamp: Date.now() + 2000, elapsedTime: 2 });
              }

              expect(element.hasClass('ng-hide-remove-active')).toBe(false);
            })
          );

          it("should piggy-back-transition the styles with the max keyframe duration if provided by the directive",
            inject(function($compile, $animate, $rootScope, $sniffer) {

            $animate.enabled(true);
            ss.addRule('.on', '-webkit-animation: 1s keyframeanimation; animation: 1s keyframeanimation;');

            element = $compile(html('<div>1</div>'))($rootScope);

            $animate.addClass(element, 'on', {
              to: {borderColor: 'blue'}
            });

            $rootScope.$digest();
            if ($sniffer.transitions) {
              $animate.triggerReflow();
              expect(element.attr('style')).toContain('border-color: blue');
              expect(element.attr('style')).toMatch(/transition:.*1s/);
              browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
            }

            expect(element.attr('style')).toContain('border-color: blue');
          }));

          it("should not apply a piggy-back-transition if the styles object contains no styles",
            inject(function($compile, $animate, $rootScope, $sniffer) {

            if (!$sniffer.animations) return;

            $animate.enabled(true);
            ss.addRule('.on', '-webkit-animation: 1s super-animation; animation: 1s super-animation;');

            element = $compile(html('<div>1</div>'))($rootScope);

            $animate.addClass(element, 'on', {
              to: {}
            });

            $rootScope.$digest();
            $animate.triggerReflow();
            expect(element.attr('style')).not.toMatch(/transition/);
          }));

          it("should pause the playstate when performing a stagger animation",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if (!$sniffer.animations) return;

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
            for (var i = 0; i < 5; i++) {
              newScope = $rootScope.$new();
              element = $compile('<div class="real-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect(elements[0].attr('style')).toBeFalsy();
            for (i = 1; i < 5; i++) {
              expect(elements[i].attr('style')).toMatch(/animation-play-state:\s*paused/);
            }

            //final closing timeout
            $timeout.flush();

            for (i = 0; i < 5; i++) {
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
            for (i = 1; i < 5; i++) {
              expect(elements[i].attr('style')).not.toMatch(/animation-play-state:\s*paused/);
            }
          }));


          it("should block and unblock keyframe animations when a stagger animation kicks in while skipping the first element",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if (!$sniffer.animations) return;

            $animate.enabled(true);

            ss.addRule('.blocked-animation.ng-enter',
              '-webkit-animation:my_animation 1s;' +
              'animation:my_animation 1s;');

            ss.addRule('.blocked-animation.ng-enter-stagger',
              '-webkit-animation-delay:0.2s;' +
              'animation-delay:0.2s;');

            var container = $compile(html('<div></div>'))($rootScope);

            var elements = [];
            for (var i = 0; i < 4; i++) {
              var newScope = $rootScope.$new();
              var element = $compile('<div class="blocked-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();

            expect(elements[0].attr('style')).toBeUndefined();
            for (i = 1; i < 4; i++) {
              expect(elements[i].attr('style')).toMatch(/animation-play-state:\s*paused/);
            }

            $animate.triggerReflow();

            expect(elements[0].attr('style')).toBeUndefined();
            for (i = 1; i < 4; i++) {
              expect(elements[i].attr('style')).toMatch(/animation-play-state:\s*paused/);
            }

            $timeout.flush(800);

            for (i = 1; i < 4; i++) {
              expect(elements[i].attr('style')).not.toMatch(/animation-play-state/);
            }
          }));

          it("should stagger items when multiple animation durations/delays are defined",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement, $window) {

            if (!$sniffer.transitions) return;

            $animate.enabled(true);

            ss.addRule('.stagger-animation.ng-enter, .stagger-animation.ng-leave',
              '-webkit-animation:my_animation 1s 1s, your_animation 1s 2s;' +
              'animation:my_animation 1s 1s, your_animation 1s 2s;');

            ss.addRule('.stagger-animation.ng-enter-stagger, .stagger-animation.ng-leave-stagger',
              '-webkit-animation-delay:0.1s;' +
              'animation-delay:0.1s;');

            var container = $compile(html('<div></div>'))($rootScope);

            var elements = [];
            for (var i = 0; i < 4; i++) {
              var newScope = $rootScope.$new();
              var element = $compile('<div class="stagger-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            for (i = 1; i < 4; i++) {
              expect(elements[i]).not.toHaveClass('ng-enter-active');
              expect(elements[i]).toHaveClass('ng-enter-pending');
              expect(getMaxValue('animationDelay', elements[i], $window)).toBe(2);
            }

            $timeout.flush(300);

            for (i = 1; i < 4; i++) {
              expect(elements[i]).toHaveClass('ng-enter-active');
              expect(elements[i]).not.toHaveClass('ng-enter-pending');
              expect(getMaxValue('animationDelay', elements[i], $window)).toBe(2);
            }
          }));

          it("should stagger items and apply the transition + directive styles the right time when piggy-back styles are used",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement, $window) {

            if (!$sniffer.transitions) return;

            $animate.enabled(true);

            ss.addRule('.stagger-animation.ng-enter, .stagger-animation.ng-leave',
              '-webkit-animation:my_animation 1s 1s, your_animation 1s 2s;' +
              'animation:my_animation 1s 1s, your_animation 1s 2s;');

            ss.addRule('.stagger-animation.ng-enter-stagger, .stagger-animation.ng-leave-stagger',
              '-webkit-animation-delay:0.1s;' +
              'animation-delay:0.1s;');

            var styles = {
              from: { left: '50px' },
              to: { left: '100px' }
            };
            var container = $compile(html('<div></div>'))($rootScope);

            var elements = [];
            for (var i = 0; i < 4; i++) {
              var newScope = $rootScope.$new();
              var element = $compile('<div class="stagger-animation"></div>')(newScope);
              $animate.enter(element, container, null, styles);
              elements.push(element);
            }

            $rootScope.$digest();

            for (i = 0; i < 4; i++) {
              expect(elements[i]).toHaveClass('ng-enter');
              assertTransitionDuration(elements[i], '2', true);
              assertLeftStyle(elements[i], '50');
            }

            $animate.triggerReflow();

            expect(elements[0]).toHaveClass('ng-enter-active');
            assertLeftStyle(elements[0], '100');
            assertTransitionDuration(elements[0], '1');

            for (i = 1; i < 4; i++) {
              expect(elements[i]).not.toHaveClass('ng-enter-active');
              assertTransitionDuration(elements[i], '1', true);
              assertLeftStyle(elements[i], '100', true);
            }

            $timeout.flush(300);

            for (i = 1; i < 4; i++) {
              expect(elements[i]).toHaveClass('ng-enter-active');
              assertTransitionDuration(elements[i], '1');
              assertLeftStyle(elements[i], '100');
            }

            $timeout.flush();

            for (i = 0; i < 4; i++) {
              expect(elements[i]).not.toHaveClass('ng-enter');
              expect(elements[i]).not.toHaveClass('ng-enter-active');
              assertTransitionDuration(elements[i], '1', true);
              assertLeftStyle(elements[i], '100');
            }

            function assertLeftStyle(element, val, not) {
              var regex = new RegExp('left: ' + val + 'px');
              var style = element.attr('style');
              not ? expect(style).not.toMatch(regex)
                  : expect(style).toMatch(regex);
            }

            function assertTransitionDuration(element, val, not) {
              var regex = new RegExp('transition:.*' + val + 's');
              var style = element.attr('style');
              not ? expect(style).not.toMatch(regex)
                  : expect(style).toMatch(regex);
            }
          }));
        });


        describe("Transitions", function() {

          it("should skip transitions if disabled and run when enabled",
            inject(function($animate, $rootScope, $compile, $sniffer) {

            var style = '-webkit-transition: 1s linear all;' +
                                'transition: 1s linear all;';

            ss.addRule('.ng-hide-add', style);
            ss.addRule('.ng-hide-remove', style);

            $animate.enabled(false);
            element = $compile(html('<div>1</div>'))($rootScope);

            element.addClass('ng-hide');
            expect(element).toBeHidden();
            $animate.removeClass(element, 'ng-hide');
            $rootScope.$digest();
            expect(element).toBeShown();

            $animate.enabled(true);

            element.addClass('ng-hide');
            expect(element).toBeHidden();

            $animate.removeClass(element, 'ng-hide');
            $rootScope.$digest();
            if ($sniffer.transitions) {
              $animate.triggerReflow();
              browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
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
              $rootScope.$digest();

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
            inject(function($animate, $rootScope, $compile, $sniffer) {
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
              $rootScope.$digest();

              expect(element).toBeShown();
              $animate.enabled(true);

              element.addClass('ng-hide');
              expect(element).toBeHidden();

              $animate.removeClass(element, 'ng-hide');
              $rootScope.$digest();
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
            inject(function($animate, $rootScope, $compile, $sniffer) {

              if (!$sniffer.transitions) return;

              var style = '-webkit-transition-duration: 1s, 2000ms, 1s;' +
                          '-webkit-transition-property: height, left, opacity;' +
                                  'transition-duration: 1s, 2000ms, 1s;' +
                                   'transition-property: height, left, opacity;';

              ss.addRule('.ng-hide-add', style);
              ss.addRule('.ng-hide-remove', style);

              element = $compile(html('<div style="width: 100px">foo</div>'))($rootScope);
              element.addClass('ng-hide');

              $animate.removeClass(element, 'ng-hide');
              $rootScope.$digest();

              $animate.triggerReflow();

              var now = Date.now();
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });
              browserTrigger(element,'transitionend', { timeStamp: now + 1000, elapsedTime: 1 });

              element.css('width', '200px');
              browserTrigger(element,'transitionend', { timeStamp: now + 2000, elapsedTime: 2 });
              expect(element.css('width')).toBe("200px");
            }));

          it("should NOT overwrite styles when a transition with a specific property is used",
            inject(function($animate, $rootScope, $compile, $sniffer) {

            if (!$sniffer.transitions) return;

            var style = '-webkit-transition: border linear .2s;' +
                                'transition: border linear .2s;';

            ss.addRule('.on', style);
            element = $compile(html('<div style="height:200px"></div>'))($rootScope);
            $animate.addClass(element, 'on');
            $rootScope.$digest();

            $animate.triggerReflow();

            var now = Date.now();
            browserTrigger(element,'transitionend', { timeStamp: now + 200, elapsedTime: 0.2 });
            expect(element.css('height')).toBe("200px");
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
              $rootScope.$digest();
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
            inject(function($animate, $rootScope, $compile, $sniffer) {
              var style = '-webkit-transition: 1s linear all;' +
                                  'transition: 1s linear all;';

              ss.addRule('.ng-hide-add', style);
              ss.addRule('.ng-hide-remove', style);

              element = $compile(html('<div>1</div>'))($rootScope);

              element.addClass('ng-hide');
              $animate.removeClass(element, 'ng-hide');
              $rootScope.$digest();

              if ($sniffer.transitions) {
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-remove')).toBe(true);
                expect(element.hasClass('ng-hide-remove-active')).toBe(true);
                browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
              }
              expect(element.hasClass('ng-hide-remove')).toBe(false);
              expect(element.hasClass('ng-hide-remove-active')).toBe(false);
              expect(element).toBeShown();

              $animate.addClass(element, 'ng-hide');
              $rootScope.$digest();

              if ($sniffer.transitions) {
                $animate.triggerReflow();
                expect(element.hasClass('ng-hide-add')).toBe(true);
                expect(element.hasClass('ng-hide-add-active')).toBe(true);
              }
            })
          );

          it("should place a hard block when a structural CSS transition is run",
            inject(function($animate, $rootScope, $compile, $sniffer) {

            if (!$sniffer.transitions) return;

            ss.addRule('.leave-animation.ng-leave',
              '-webkit-transition:5s linear all;' +
                      'transition:5s linear all;' +
                      'opacity:1;');

            ss.addRule('.leave-animation.ng-leave.ng-leave-active', 'opacity:1');

            element = $compile(html('<div class="leave-animation">1</div>'))($rootScope);

            $animate.leave(element);
            $rootScope.$digest();

            expect(element.attr('style')).toMatch(/transition.*?:\s*none/);

            $animate.triggerReflow();

            expect(element.attr('style')).not.toMatch(/transition.*?:\s*none/);
          }));

          it("should not place a hard block when a class-based CSS transition is run",
            inject(function($animate, $rootScope, $compile, $sniffer) {

            if (!$sniffer.transitions) return;

            ss.addRule('.my-class', '-webkit-transition:5s linear all;' +
                                    'transition:5s linear all;');

            element = $compile(html('<div>1</div>'))($rootScope);

            $animate.addClass(element, 'my-class');
            $rootScope.$digest();

            expect(element.attr('style')).not.toMatch(/transition.*?:\s*none/);
            expect(element.hasClass('my-class')).toBe(false);
            expect(element.hasClass('my-class-add')).toBe(true);

            $animate.triggerReflow();
            $rootScope.$digest();

            expect(element.attr('style')).not.toMatch(/transition.*?:\s*none/);
            expect(element.hasClass('my-class')).toBe(true);
            expect(element.hasClass('my-class-add')).toBe(true);
            expect(element.hasClass('my-class-add-active')).toBe(true);
          }));

          it("should stagger the items when the correct CSS class is provided",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement, $browser) {

            if (!$sniffer.transitions) return;

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
            for (var i = 0; i < 5; i++) {
              newScope = $rootScope.$new();
              element = $compile('<div class="real-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect($browser.deferredFns.length).toEqual(5); //4 staggers + 1 combined timeout
            $timeout.flush();

            for (i = 0; i < 5; i++) {
              dealoc(elements[i]);
              newScope = $rootScope.$new();
              element = $compile('<div class="fake-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements[i] = element;
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            expect($browser.deferredFns.length).toEqual(0); //no animation was triggered
          }));


          it("should stagger items when multiple transition durations/delays are defined",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement, $window) {

            if (!$sniffer.transitions) return;

            $animate.enabled(true);

            ss.addRule('.stagger-animation.ng-enter, .ani.ng-leave',
              '-webkit-transition:1s linear color 2s, 3s linear font-size 4s;' +
              'transition:1s linear color 2s, 3s linear font-size 4s;');

            ss.addRule('.stagger-animation.ng-enter-stagger, .ani.ng-leave-stagger',
              '-webkit-transition-delay:0.1s;' +
              'transition-delay:0.1s;');

            var container = $compile(html('<div></div>'))($rootScope);

            var elements = [];
            for (var i = 0; i < 4; i++) {
              var newScope = $rootScope.$new();
              var element = $compile('<div class="stagger-animation"></div>')(newScope);
              $animate.enter(element, container);
              elements.push(element);
            }

            $rootScope.$digest();
            $animate.triggerReflow();

            for (i = 1; i < 4; i++) {
              expect(elements[i]).not.toHaveClass('ng-enter-active');
              expect(elements[i]).toHaveClass('ng-enter-pending');
              expect(getMaxValue('transitionDelay', elements[i], $window)).toBe(4);
            }

            $timeout.flush(300);

            for (i = 1; i < 4; i++) {
              expect(elements[i]).toHaveClass('ng-enter-active');
              expect(elements[i]).not.toHaveClass('ng-enter-pending');
              expect(getMaxValue('transitionDelay', elements[i], $window)).toBe(4);
            }
          }));

          it("should stagger items, apply directive styles but not apply a transition style when the stagger step kicks in",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement, $window) {

            if (!$sniffer.transitions) return;

            $animate.enabled(true);

            ss.addRule('.stagger-animation.ng-enter, .ani.ng-leave',
              '-webkit-transition:1s linear color 2s, 3s linear font-size 4s;' +
              'transition:1s linear color 2s, 3s linear font-size 4s;');

            ss.addRule('.stagger-animation.ng-enter-stagger, .ani.ng-leave-stagger',
              '-webkit-transition-delay:0.1s;' +
              'transition-delay:0.1s;');

            var styles = {
              from: { left: '155px' },
              to: { left: '255px' }
            };
            var container = $compile(html('<div></div>'))($rootScope);

            var elements = [];
            for (var i = 0; i < 4; i++) {
              var newScope = $rootScope.$new();
              var element = $compile('<div class="stagger-animation"></div>')(newScope);
              $animate.enter(element, container, null, styles);
              elements.push(element);
            }

            $rootScope.$digest();

            for (i = 0; i < 4; i++) {
              expect(elements[i]).toHaveClass('ng-enter');
              assertLeftStyle(elements[i], '155');
            }

            $animate.triggerReflow();

            expect(elements[0]).toHaveClass('ng-enter-active');
            assertLeftStyle(elements[0], '255');
            assertNoTransitionDuration(elements[0]);

            for (i = 1; i < 4; i++) {
              expect(elements[i]).not.toHaveClass('ng-enter-active');
              assertLeftStyle(elements[i], '255', true);
            }

            $timeout.flush(300);

            for (i = 1; i < 4; i++) {
              expect(elements[i]).toHaveClass('ng-enter-active');
              assertNoTransitionDuration(elements[i]);
              assertLeftStyle(elements[i], '255');
            }

            $timeout.flush();

            for (i = 0; i < 4; i++) {
              expect(elements[i]).not.toHaveClass('ng-enter');
              expect(elements[i]).not.toHaveClass('ng-enter-active');
              assertNoTransitionDuration(elements[i]);
              assertLeftStyle(elements[i], '255');
            }

            function assertLeftStyle(element, val, not) {
              var regex = new RegExp('left: ' + val + 'px');
              var style = element.attr('style');
              not ? expect(style).not.toMatch(regex)
                  : expect(style).toMatch(regex);
            }

            function assertNoTransitionDuration(element) {
              var style = element.attr('style');
              expect(style).not.toMatch(/transition/);
            }
          }));

          it("should apply a closing timeout to close all pending transitions",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout) {

            if (!$sniffer.transitions) return;

            ss.addRule('.animated-element', '-webkit-transition:5s linear all;' +
                                                    'transition:5s linear all;');

            element = $compile(html('<div class="animated-element">foo</div>'))($rootScope);

            $animate.addClass(element, 'some-class');
            $rootScope.$digest();

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
                  if (timer) {
                    cancellations++;
                    return _cancel.apply($delegate, arguments);
                  }
                };
                return $delegate;
              });

              return function($sniffer) {
                if ($sniffer.transitions) {
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

          it('should apply a closing timeout to close all parallel class-based animations on the same element',
            inject(function($sniffer, $compile, $rootScope, $rootElement, $animate, $timeout) {

            if (!$sniffer.transitions) return;

            ss.addRule('.base-class', '-webkit-transition:2s linear all;' +
                                              'transition:2s linear all;');

            var element = $compile('<div class="base-class"></div>')($rootScope);
            $rootElement.append(element);
            jqLite($document[0].body).append($rootElement);

            $animate.addClass(element, 'one');
            $animate.addClass(element, 'two');

            $animate.triggerReflow();

            $timeout.flush(3000); //2s * 1.5

            expect(element.hasClass('one-add')).toBeFalsy();
            expect(element.hasClass('one-add-active')).toBeFalsy();
            expect(element.hasClass('two-add')).toBeFalsy();
            expect(element.hasClass('two-add-active')).toBeFalsy();
            expect(element.hasClass('ng-animate')).toBeFalsy();
          }));

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
            for (var i = 0; i < 5; i++) {
              kids.push(angular.element('<div class="entering-element"></div>'));
              $animate.enter(kids[i], element);
            }
            $rootScope.$digest();

            $animate.triggerReflow(); //reflow
            expect(element.children().length).toBe(5);

            for (i = 1; i < 5; i++) {
              expect(kids[i]).not.toHaveClass('ng-enter-active');
              expect(kids[i]).toHaveClass('ng-enter-pending');
            }

            $timeout.flush(2000);

            for (i = 1; i < 5; i++) {
              expect(kids[i]).toHaveClass('ng-enter-active');
              expect(kids[i]).not.toHaveClass('ng-enter-pending');
            }

            //(stagger * index) + (duration + delay) * 150%
            //0.5 * 4 + 5 * 1.5 = 9500;
            //9500 - 2000 - 7499 = 1
            $timeout.flush(7499);

            for (i = 0; i < 5; i++) {
              expect(kids[i].hasClass('ng-enter-active')).toBe(true);
            }

            $timeout.flush(1); //up to 2000ms

            for (i = 0; i < 5; i++) {
              expect(kids[i].hasClass('ng-enter-active')).toBe(false);
            }
          }));

          it("should cancel all the existing stagger timers when the animation is cancelled",
            inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $browser) {

            if (!$sniffer.transitions) return;

            ss.addRule('.entering-element.ng-enter',
              '-webkit-transition:5s linear all;' +
                      'transition:5s linear all;');

            ss.addRule('.entering-element.ng-enter-stagger',
              '-webkit-transition-delay:1s;' +
                      'transition-delay:1s;');

            var cancellations = [];
            element = $compile(html('<div></div>'))($rootScope);
            var kids = [];
            for (var i = 0; i < 5; i++) {
              kids.push(angular.element('<div class="entering-element"></div>'));
              cancellations.push($animate.enter(kids[i], element));
            }
            $rootScope.$digest();

            $animate.triggerReflow(); //reflow
            expect(element.children().length).toBe(5);

            for (i = 1; i < 5; i++) {
              expect(kids[i]).not.toHaveClass('ng-enter-active');
              expect(kids[i]).toHaveClass('ng-enter-pending');
            }

            expect($browser.deferredFns.length).toEqual(5); //4 staggers + 1 combined timeout

            forEach(cancellations, function(promise) {
              $animate.cancel(promise);
            });

            for (i = 1; i < 5; i++) {
              expect(kids[i]).not.toHaveClass('ng-enter');
              expect(kids[i]).not.toHaveClass('ng-enter-active');
              expect(kids[i]).not.toHaveClass('ng-enter-pending');
            }

            //the staggers are gone, but the global timeout remains
            expect($browser.deferredFns.length).toEqual(1);
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
            $rootScope.$digest();

            $animate.triggerReflow(); //reflow
            expect(element.hasClass('some-class-add-active')).toBe(true);

            $animate.removeClass(element, 'some-class');
            $rootScope.$digest();

            $animate.triggerReflow(); //second reflow

            $timeout.flush(7500); //closing timeout for the first animation
            expect(element.hasClass('some-class-remove-active')).toBe(true);

            $timeout.flush(15000); //closing timeout for the second animation
            expect(element.hasClass('some-class-remove-active')).toBe(false);

            $timeout.verifyNoPendingTasks();
          }));
        });


        it("should apply staggering to both transitions and keyframe animations when used within the same animation",
          inject(function($animate, $rootScope, $compile, $sniffer, $timeout, $document, $rootElement, $browser) {

          if (!$sniffer.transitions) return;

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
          for (var i = 0; i < 3; i++) {
            var newScope = $rootScope.$new();
            var element = $compile('<div class="stagger-animation"></div>')(newScope);
            $animate.enter(element, container);
            elements.push(element);
          }

          $rootScope.$digest();
          $animate.triggerReflow();
          expect($browser.deferredFns.length).toEqual(3); //2 staggers + 1 combined timeout

          expect(elements[0].attr('style')).toBeFalsy();
          expect(elements[1].attr('style')).toMatch(/animation-play-state:\s*paused/);
          expect(elements[2].attr('style')).toMatch(/animation-play-state:\s*paused/);

          for (i = 1; i < 3; i++) {
            expect(elements[i]).not.toHaveClass('ng-enter-active');
            expect(elements[i]).toHaveClass('ng-enter-pending');
          }

          $timeout.flush(0.4 * 1000);

          for (i = 1; i < 3; i++) {
            expect(elements[i]).toHaveClass('ng-enter-active');
            expect(elements[i]).not.toHaveClass('ng-enter-pending');
          }

          for (i = 0; i < 3; i++) {
            browserTrigger(elements[i],'transitionend', { timeStamp: Date.now() + 22000, elapsedTime: 22000 });
            expect(elements[i].attr('style')).toBeFalsy();
          }
        }));

        it("should create a piggy-back-transition which has a duration the same as the max keyframe duration if any directive styles are provided",
          inject(function($compile, $animate, $rootScope, $sniffer) {

          $animate.enabled(true);
          ss.addRule('.on', '-webkit-transition: 1s linear all; transition: 1s linear all;');

          element = $compile(html('<div>1</div>'))($rootScope);

          $animate.addClass(element, 'on', {
            to: {color: 'red'}
          });

          $rootScope.$digest();
          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(element.attr('style')).toContain('color: red');
            expect(element.attr('style')).not.toContain('transition');
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }

          expect(element.attr('style')).toContain('color: red');
        }));
      });


      describe('animation evaluation', function() {

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
            $animate.triggerCallbackPromise();
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
            $animate.triggerCallbackPromise();
          }
          expect(element.hasClass('xyz')).toBe(true);
        }));


        it('should only append active to the newly append CSS className values',
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

          ss.addRule('.ng-enter', '-webkit-transition:9s linear all;' +
                                          'transition:9s linear all;');

          var parent = jqLite('<div><span></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          angular.element(document.body).append($rootElement);

          element.attr('class','one two');

          $animate.enter(element, parent);
          $rootScope.$digest();

          if ($sniffer.transitions) {
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
                removeClass: function(element, className, done) {
                  $timeout(done, 2000);
                }
              };
            });
            $animateProvider.register('.other', function($timeout) {
              return {
                enter: function(element, done) {
                  $timeout(done, 10000);
                }
              };
            });
          });
        });


        it("should fire the enter callback",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          var parent = jqLite('<div><span></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          body.append($rootElement);

          var flag = false;
          $animate.enter(element, parent, null).then(function() {
            flag = true;
          });
          $rootScope.$digest();

          $animate.triggerCallbackPromise();

          expect(flag).toBe(true);
        }));


        it("should fire the leave callback",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          var parent = jqLite('<div><span></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          body.append($rootElement);

          var flag = false;
          $animate.leave(element).then(function() {
            flag = true;
          });
          $rootScope.$digest();

          $animate.triggerCallbackPromise();

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
          $animate.move(element, parent, parent2).then(function() {
            flag = true;
          });
          $rootScope.$digest();

          $animate.triggerCallbackPromise();

          expect(flag).toBe(true);
          expect(element.parent().id).toBe(parent2.id);

          dealoc(element);
        }));


        it("should fire the addClass/removeClass callbacks",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          var parent = jqLite('<div><span></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          body.append($rootElement);

          var signature = '';
          $animate.addClass(element, 'on').then(function() {
            signature += 'A';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $animate.removeClass(element, 'on').then(function() {
            signature += 'B';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $animate.triggerCallbackPromise();

          expect(signature).toBe('AB');
        }));

        it("should fire the setClass callback",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          var parent = jqLite('<div><span class="off"></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          body.append($rootElement);

          expect(element.hasClass('on')).toBe(false);
          expect(element.hasClass('off')).toBe(true);

          var signature = '';
          $animate.setClass(element, 'on', 'off').then(function() {
            signature += 'Z';
          });
          $rootScope.$digest();

          $animate.triggerReflow();
          $animate.triggerCallbackPromise();

          expect(signature).toBe('Z');
          expect(element.hasClass('on')).toBe(true);
          expect(element.hasClass('off')).toBe(false);
        }));

        it('should fire DOM callbacks on the element being animated',
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          if (!$sniffer.transitions) return;

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

          $animate.addClass(element, 'klass').then(function() {
            steps.push(['done', 'klass', 'addClass']);
          });
          $rootScope.$digest();

          $animate.triggerCallbackEvents();

          expect(steps.pop()).toEqual(['before', 'klass', 'addClass']);

          $animate.triggerReflow();

          $animate.triggerCallbackEvents();

          expect(steps.pop()).toEqual(['after', 'klass', 'addClass']);

          browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

          $animate.triggerCallbackEvents();

          expect(steps.shift()).toEqual(['close', 'klass', 'addClass']);

          $animate.triggerCallbackPromise();

          expect(steps.shift()).toEqual(['done', 'klass', 'addClass']);
        }));

        it('should fire the DOM callbacks even if no animation is rendered',
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

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

          $animate.triggerCallbackEvents();

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
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          var parent = jqLite('<div><span></span></div>');
          var element = parent.find('span');
          $rootElement.append(parent);
          body.append($rootElement);

          var flag = false;
          $animate.removeClass(element, 'ng-hide').then(function() {
            flag = true;
          });
          $rootScope.$digest();

          $animate.triggerCallbackPromise();
          expect(flag).toBe(true);
        }));


        it("should fire a done callback when provided with a css animation/transition",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          ss.addRule('.ng-hide-add', '-webkit-transition:1s linear all;' +
                                             'transition:1s linear all;');
          ss.addRule('.ng-hide-remove', '-webkit-transition:1s linear all;' +
                                                'transition:1s linear all;');

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = parent.find('span');

          var flag = false;
          $animate.addClass(element, 'ng-hide').then(function() {
            flag = true;
          });
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
          }
          $animate.triggerCallbackPromise();
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
          $animate.removeClass(element, 'ng-hide').then(function() {
            flag = true;
          });
          $rootScope.$digest();

          $animate.triggerCallbackPromise();
          expect(flag).toBe(true);
        }));


        it("should fire the callback right away if another animation is called right after",
          inject(function($animate, $rootScope, $compile, $sniffer, $rootElement) {

          ss.addRule('.ng-hide-add', '-webkit-transition:9s linear all;' +
                                             'transition:9s linear all;');
          ss.addRule('.ng-hide-remove', '-webkit-transition:9s linear all;' +
                                                'transition:9s linear all;');

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = parent.find('span');

          var signature = '';
          $animate.removeClass(element, 'ng-hide').then(function() {
            signature += 'A';
          });
          $rootScope.$digest();
          $animate.addClass(element, 'ng-hide').then(function() {
            signature += 'B';
          });
          $rootScope.$digest();

          $animate.addClass(element, 'ng-hide'); //earlier animation cancelled
          if ($sniffer.transitions) {
            $animate.triggerReflow();
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 9 });
          }
          $animate.triggerCallbackPromise();
          expect(signature).toBe('AB');
        }));
      });

      describe("options", function() {

        it('should add and remove the temporary className value is provided', function() {
          var captures = {};
          module(function($animateProvider) {
            $animateProvider.register('.capture', function() {
              return {
                enter: capture('enter'),
                leave: capture('leave'),
                move: capture('move'),
                addClass: capture('addClass'),
                removeClass: capture('removeClass'),
                setClass: capture('setClass')
              };

              function capture(event) {
                return function(element, add, remove, styles, done) {
                  //some animations only have one extra param
                  done = arguments[arguments.length - 2]; //the last one is the styles array
                  captures[event]=done;
                };
              }
            });
          });
          inject(function($animate, $rootScope, $compile, $rootElement, $document) {
            var container = jqLite('<div class="container"></div>');
            var container2 = jqLite('<div class="container2"></div>');
            var element = jqLite('<div class="capture"></div>');
            $rootElement.append(container);
            $rootElement.append(container2);
            angular.element($document[0].body).append($rootElement);

            $compile(element)($rootScope);

            assertTempClass('enter', 'temp-enter', function() {
              $animate.enter(element, container, null, {
                tempClasses: 'temp-enter'
              });
            });

            assertTempClass('move', 'temp-move', function() {
              $animate.move(element, null, container2, {
                tempClasses: 'temp-move'
              });
            });

            assertTempClass('addClass', 'temp-add', function() {
              $animate.addClass(element, 'add', {
                tempClasses: 'temp-add'
              });
            });

            assertTempClass('removeClass', 'temp-remove', function() {
              $animate.removeClass(element, 'add', {
                tempClasses: 'temp-remove'
              });
            });

            element.addClass('remove');
            assertTempClass('setClass', 'temp-set', function() {
              $animate.setClass(element, 'add', 'remove', {
                tempClasses: 'temp-set'
              });
            });

            assertTempClass('leave', 'temp-leave', function() {
              $animate.leave(element, {
                tempClasses: 'temp-leave'
              });
            });

            function assertTempClass(event, className, animationOperation) {
              expect(element).not.toHaveClass(className);
              animationOperation();
              $rootScope.$digest();
              expect(element).toHaveClass(className);
              $animate.triggerReflow();
              captures[event]();
              $animate.triggerCallbacks();
              expect(element).not.toHaveClass(className);
            }
          });
        });
      });

      describe("addClass / removeClass", function() {

        var captured;
        beforeEach(function() {
          module(function($animateProvider) {
            $animateProvider.register('.klassy', function($timeout) {
              return {
                addClass: function(element, className, done) {
                  captured = 'addClass-' + className;
                  $timeout(done, 500, false);
                },
                removeClass: function(element, className, done) {
                  captured = 'removeClass-' + className;
                  $timeout(done, 3000, false);
                }
              };
            });
          });
        });


        it("should not perform an animation, and the followup DOM operation, if the class is " +
           "already present during addClass or not present during removeClass on the element",
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

          var element = jqLite('<div class="klassy"></div>');
          $rootElement.append(element);
          body.append($rootElement);

          //skipped animations
          captured = 'none';
          $animate.removeClass(element, 'some-class');
          $rootScope.$digest();
          expect(element.hasClass('some-class')).toBe(false);
          expect(captured).toBe('none');

          element.addClass('some-class');

          captured = 'nothing';
          $animate.addClass(element, 'some-class');
          $rootScope.$digest();
          expect(captured).toBe('nothing');
          expect(element.hasClass('some-class')).toBe(true);

          //actual animations
          captured = 'none';
          $animate.removeClass(element, 'some-class');
          $rootScope.$digest();
          $animate.triggerReflow();
          expect(element.hasClass('some-class')).toBe(false);
          expect(captured).toBe('removeClass-some-class');

          captured = 'nothing';
          $animate.addClass(element, 'some-class');
          $rootScope.$digest();
          $animate.triggerReflow();
          expect(element.hasClass('some-class')).toBe(true);
          expect(captured).toBe('addClass-some-class');
        }));

        it("should perform the animation if passed native dom element",
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

          var element = jqLite('<div class="klassy"></div>');
          $rootElement.append(element);
          body.append($rootElement);

          //skipped animations
          captured = 'none';
          $animate.removeClass(element[0], 'some-class');
          $rootScope.$digest();
          expect(element.hasClass('some-class')).toBe(false);
          expect(captured).toBe('none');

          element.addClass('some-class');

          captured = 'nothing';
          $animate.addClass(element[0], 'some-class');
          $rootScope.$digest();
          expect(captured).toBe('nothing');
          expect(element.hasClass('some-class')).toBe(true);

          //actual animations
          captured = 'none';
          $animate.removeClass(element[0], 'some-class');
          $rootScope.$digest();
          $animate.triggerReflow();
          expect(element.hasClass('some-class')).toBe(false);
          expect(captured).toBe('removeClass-some-class');

          captured = 'nothing';
          $animate.addClass(element[0], 'some-class');
          $rootScope.$digest();
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
          $rootScope.$digest();
          $animate.triggerReflow();

          expect(element.hasClass('klass')).toBe(true);

          $animate.removeClass(element,'klass');
          $rootScope.$digest();
          $animate.triggerReflow();

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

          $animate.addClass(element,'klass').then(function() {
            signature += 'A';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          expect(element.hasClass('klass')).toBe(true);

          $animate.removeClass(element,'klass').then(function() {
            signature += 'B';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $animate.triggerCallbackPromise();
          expect(element.hasClass('klass')).toBe(false);
          expect(signature).toBe('AB');
        }));


        it("should end the current addClass animation, add the CSS class and then run the removeClass animation",
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

          ss.addRule('.klass-add', '-webkit-transition:3s linear all;' +
                                           'transition:3s linear all;');
          ss.addRule('.klass-remove', '-webkit-transition:3s linear all;' +
                                              'transition:3s linear all;');

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = jqLite(parent.find('span'));

          var signature = '';

          $animate.addClass(element,'klass').then(function() {
            signature += '1';
          });
          $rootScope.$digest();

          if ($sniffer.transitions) {
            expect(element.hasClass('klass-add')).toBe(true);
            $animate.triggerReflow();
            expect(element.hasClass('klass')).toBe(true);
            expect(element.hasClass('klass-add-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
          }

          $animate.triggerCallbackPromise();

          //this cancels out the older animation
          $animate.removeClass(element,'klass').then(function() {
            signature += '2';
          });
          $rootScope.$digest();

          if ($sniffer.transitions) {
            expect(element.hasClass('klass-remove')).toBe(true);

            $animate.triggerReflow();
            expect(element.hasClass('klass')).toBe(false);
            expect(element.hasClass('klass-add')).toBe(false);
            expect(element.hasClass('klass-add-active')).toBe(false);

            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 3000, elapsedTime: 3 });
          }

          $animate.triggerCallbackPromise();

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

          $animate.addClass(element,'klassy').then(function() {
            signature += 'X';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $timeout.flush(500);

          expect(element.hasClass('klassy')).toBe(true);

          $animate.removeClass(element,'klassy').then(function() {
            signature += 'Y';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $timeout.flush(3000);

          expect(element.hasClass('klassy')).toBe(false);

          $animate.triggerCallbackPromise();
          expect(signature).toBe('XY');
        }));

        it("should properly execute JS animations if passed native dom element",
          inject(function($animate, $rootScope, $sniffer, $rootElement, $timeout) {

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = jqLite(parent.find('span'));

          var signature = '';

          $animate.addClass(element[0],'klassy').then(function() {
            signature += 'X';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $timeout.flush(500);

          expect(element.hasClass('klassy')).toBe(true);

          $animate.removeClass(element[0],'klassy').then(function() {
            signature += 'Y';
          });
          $rootScope.$digest();
          $animate.triggerReflow();

          $timeout.flush(3000);

          expect(element.hasClass('klassy')).toBe(false);

          $animate.triggerCallbackPromise();
          expect(signature).toBe('XY');
        }));

        it("should properly execute CSS animations/transitions and use callbacks when using addClass / removeClass",
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

          ss.addRule('.klass-add', '-webkit-transition:11s linear all;' +
                                           'transition:11s linear all;');
          ss.addRule('.klass-remove', '-webkit-transition:11s linear all;' +
                                              'transition:11s linear all;');

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = jqLite(parent.find('span'));

          var signature = '';

          $animate.addClass(element,'klass').then(function() {
            signature += 'd';
          });
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(element.hasClass('klass-add')).toBe(true);
            expect(element.hasClass('klass-add-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
            expect(element.hasClass('klass-add')).toBe(false);
            expect(element.hasClass('klass-add-active')).toBe(false);
          }

          $animate.triggerCallbackPromise();
          expect(element.hasClass('klass')).toBe(true);

          $animate.removeClass(element,'klass').then(function() {
            signature += 'b';
          });
          $rootScope.$digest();

          if ($sniffer.transitions) {
            $animate.triggerReflow();
            expect(element.hasClass('klass-remove')).toBe(true);
            expect(element.hasClass('klass-remove-active')).toBe(true);
            browserTrigger(element,'transitionend', { timeStamp: Date.now() + 11000, elapsedTime: 11 });
            expect(element.hasClass('klass-remove')).toBe(false);
            expect(element.hasClass('klass-remove-active')).toBe(false);
          }

          $animate.triggerCallbackPromise();
          expect(element.hasClass('klass')).toBe(false);

          expect(signature).toBe('db');
        }));


        it("should allow for multiple css classes to be animated plus a callback when added",
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

          ss.addRule('.one-add', '-webkit-transition:7s linear all;' +
                                         'transition:7s linear all;');
          ss.addRule('.two-add', '-webkit-transition:7s linear all;' +
                                         'transition:7s linear all;');

          var parent = jqLite('<div><span></span></div>');
          $rootElement.append(parent);
          body.append($rootElement);
          var element = jqLite(parent.find('span'));

          var flag = false;
          $animate.addClass(element,'one two').then(function() {
            flag = true;
          });

          $rootScope.$digest();

          if ($sniffer.transitions) {
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

          $animate.triggerCallbackPromise();

          expect(element.hasClass('one')).toBe(true);
          expect(element.hasClass('two')).toBe(true);

          expect(flag).toBe(true);
        }));


        it("should allow for multiple css classes to be animated plus a callback when removed",
          inject(function($animate, $rootScope, $sniffer, $rootElement) {

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
          $animate.removeClass(element,'one two').then(function() {
            flag = true;
          });
          $rootScope.$digest();

          if ($sniffer.transitions) {
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

          $animate.triggerCallbackPromise();

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
      inject(function($compile, $rootScope, $animate, $sniffer) {

      ss.addRule('.ng-enter', '-webkit-transition:1s linear all;' +
                                      'transition:1s linear all;');

      var element = html($compile('<div>...</div>')($rootScope));
      var child = $compile('<div>...</div>')($rootScope);

      $animate.enter(child, element);
      $rootScope.$digest();

      if ($sniffer.transitions) {
        $animate.triggerReflow();
        expect(child.hasClass('ng-enter')).toBe(true);
        expect(child.hasClass('ng-enter-active')).toBe(true);
        browserTrigger(child,'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });
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

      if ($sniffer.transitions) {
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
            enter: function(element, done) {
              element.addClass('i-was-animated');
              $timeout(done, 10, false);
            }
          };
        });
      });
      inject(function($compile, $rootScope, $animate, $sniffer) {

        ss.addRule('.ng-enter', '-webkit-transition: 1s linear all;' +
                                        'transition: 1s linear all;');

        var element = html($compile('<div>...</div>')($rootScope));
        var child = $compile('<div>...</div>')($rootScope);

        expect(child.hasClass('i-was-animated')).toBe(false);

        child.addClass('custom');
        $animate.enter(child, element);
        $rootScope.$digest();

        if ($sniffer.transitions) {
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
            leave: function(element, done) {
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
        if ($sniffer.transitions) {
          $animate.triggerReflow();
          expect(child.hasClass('ng-enter')).toBe(true);
          expect(child.hasClass('ng-enter-active')).toBe(true);
        }

        expect(child.hasClass('this-is-mine-now')).toBe(false);
        child.addClass('usurper');
        $animate.leave(child);
        $rootScope.$digest();
        $animate.triggerCallbackPromise();

        expect(child.hasClass('ng-enter')).toBe(false);
        expect(child.hasClass('ng-enter-active')).toBe(false);

        expect(child.hasClass('usurper')).toBe(true);
        expect(child.hasClass('this-is-mine-now')).toBe(true);

        $timeout.flush(55);
      });
    });


    it("should not perform the active class animation if the animation has been cancelled before the reflow occurs", function() {
      inject(function($compile, $rootScope, $animate, $sniffer) {
        if (!$sniffer.transitions) return;

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
  //      $animate.triggerCallbackPromise();
  //    }
  //
  //    $animate.triggerCallbackPromise();
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
  //    $animate.triggerCallbackPromise();
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
  //        $animate.triggerCallbackPromise();
  //        expect(element).toBeShown();
  //        $timeout.flush(5555);
  //      }
  //      $animate.triggerCallbackPromise();
  //      expect(element).toBeHidden();
  //
  //      expect(element.hasClass('showing')).toBe(false);
  //      expect(element.hasClass('hiding')).toBe(true);
  //      $animate.removeClass(element, 'ng-hide');
  //
  //      if($sniffer.transitions) {
  //        expect(element).toBeHidden();
  //        $animate.triggerCallbackPromise();
  //        expect(element).toBeHidden();
  //        $timeout.flush(5580);
  //      }
  //      $animate.triggerCallbackPromise();
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
            move: function(element, done) {
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
      inject(function($compile, $rootScope, $animate) {
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
            removeClass: function(element, className, done) {
              element.data('classify','remove-' + className);
              done();
            },
            addClass: function(element, className, done) {
              element.data('classify','add-' + className);
              done();
            }
          };
        });
      });
      inject(function($compile, $rootScope, $animate) {
        var element = html($compile('<div class="classify"></div>')($rootScope));

        $animate.addClass(element, 'super');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(element.data('classify')).toBe('add-super');

        $animate.removeClass(element, 'super');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(element.data('classify')).toBe('remove-super');

        $animate.addClass(element, 'superguy');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(element.data('classify')).toBe('add-superguy');
      });
    });


    it("should not skip ngAnimate animations when any pre-existing CSS transitions are present on the element", function() {
      inject(function($compile, $rootScope, $animate, $timeout, $sniffer) {
        if (!$sniffer.transitions) return;

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
        catch (e) {}

        expect(empty).toBe(false);
      });
    });


    it("should wait until both the duration and delay are complete to close off the animation",
      inject(function($compile, $rootScope, $animate, $timeout, $sniffer) {

      if (!$sniffer.transitions) return;

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
        $animateProvider.register('.animan', function() {
          return {
            enter: function(element, done) {
              animationState = 'enter';
              step = done;
              return function(cancelled) {
                animationState = cancelled ? 'enter-cancel' : animationState;
              };
            },
            addClass: function(element, className, done) {
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
        if ($sniffer.transitions) {
          expect(child.hasClass('ng-enter')).toBe(true);
          $animate.triggerReflow();
          expect(child.hasClass('ng-enter-active')).toBe(true);
        }

        $animate.move(element, container);
        if ($sniffer.transitions) {
          expect(child.hasClass('ng-enter')).toBe(false);
          expect(child.hasClass('ng-enter-active')).toBe(false);
        }

        expect(animationState).toBe('enter-cancel');

        $rootScope.$digest();
        $animate.triggerCallbacks();

        $animate.addClass(child, 'something');
        $rootScope.$digest();
        if ($sniffer.transitions) {
          $animate.triggerReflow();
        }
        expect(animationState).toBe('addClass');
        if ($sniffer.transitions) {
          expect(child.hasClass('something-add')).toBe(true);
          expect(child.hasClass('something-add-active')).toBe(true);
        }

        $animate.leave(container);
        expect(animationState).toBe('addClass-cancel');
        if ($sniffer.transitions) {
          expect(child.hasClass('something-add')).toBe(false);
          expect(child.hasClass('something-add-active')).toBe(false);
        }
      });

    });

    it('should coalesce all class-based animation calls together into a single animation', function() {
      var log = [];
      var track = function(name) {
        return function() {
          log.push({ name: name, className: arguments[1] });
        };
      };
      module(function($animateProvider) {
        $animateProvider.register('.animate', function() {
          return {
            addClass: track('addClass'),
            removeClass: track('removeClass')
          };
        });
      });
      inject(function($rootScope, $animate, $compile, $rootElement, $document) {
        $animate.enabled(true);

        var element = $compile('<div class="animate three"></div>')($rootScope);
        $rootElement.append(element);
        angular.element($document[0].body).append($rootElement);

        $animate.addClass(element, 'one');
        $animate.addClass(element, 'two');
        $animate.removeClass(element, 'three');
        $animate.removeClass(element, 'four');
        $animate.setClass(element, 'four five', 'two');

        $rootScope.$digest();
        $animate.triggerReflow();

        expect(log.length).toBe(2);
        expect(log[0]).toEqual({ name: 'addClass', className: 'one four five' });
        expect(log[1]).toEqual({ name: 'removeClass', className: 'three' });
      });
    });

    it('should intelligently cancel out redundant class-based animations', function() {
      var log = [];
      var track = function(name) {
        return function() {
          log.push({ name: name, className: arguments[1] });
        };
      };
      module(function($animateProvider) {
        $animateProvider.register('.animate', function() {
          return {
            addClass: track('addClass'),
            removeClass: track('removeClass')
          };
        });
      });
      inject(function($rootScope, $animate, $compile, $rootElement, $document) {
        $animate.enabled(true);

        var element = $compile('<div class="animate three four"></div>')($rootScope);
        $rootElement.append(element);
        angular.element($document[0].body).append($rootElement);

        $animate.removeClass(element, 'one');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(log.length).toBe(0);
        $animate.triggerCallbacks();

        $animate.addClass(element, 'two');
        $animate.addClass(element, 'two');
        $animate.removeClass(element, 'two');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(log.length).toBe(0);
        $animate.triggerCallbacks();

        $animate.removeClass(element, 'three');
        $animate.addClass(element, 'three');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(log.length).toBe(0);
        $animate.triggerCallbacks();

        $animate.removeClass(element, 'four');
        $animate.addClass(element, 'four');
        $animate.removeClass(element, 'four');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(log.length).toBe(1);
        $animate.triggerCallbacks();
        expect(log[0]).toEqual({ name: 'removeClass', className: 'four' });

        $animate.addClass(element, 'five');
        $animate.addClass(element, 'five');
        $animate.addClass(element, 'five');
        $animate.removeClass(element, 'five');
        $animate.addClass(element, 'five');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(log.length).toBe(2);
        $animate.triggerCallbacks();
        expect(log[1]).toEqual({ name: 'addClass', className: 'five' });
      });
    });

    it('should skip class-based animations if the element is removed before the digest occurs', function() {
      var spy = jasmine.createSpy();
      module(function($animateProvider) {
        $animateProvider.register('.animated', function() {
          return {
            beforeAddClass: spy,
            beforeRemoveClass: spy,
            beforeSetClass: spy
          };
        });
      });
      inject(function($rootScope, $animate, $compile, $rootElement, $document) {
        $animate.enabled(true);

        var one = $compile('<div class="animated"></div>')($rootScope);
        var two = $compile('<div class="animated"></div>')($rootScope);
        var three = $compile('<div class="animated three"></div>')($rootScope);

        $rootElement.append(one);
        $rootElement.append(two);
        angular.element($document[0].body).append($rootElement);

        $animate.addClass(one, 'active-class');
        one.remove();

        $rootScope.$digest();
        expect(spy).not.toHaveBeenCalled();

        $animate.addClass(two, 'active-class');

        $rootScope.$digest();
        expect(spy).toHaveBeenCalled();

        spy.reset();
        $animate.removeClass(two, 'active-class');
        two.remove();

        $rootScope.$digest();
        expect(spy).not.toHaveBeenCalled();

        $animate.setClass(three, 'active-class', 'three');
        three.remove();

        $rootScope.$digest();
        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('should skip class-based animations if ngRepeat has marked the element or its parent for removal', function() {
      var spy = jasmine.createSpy();
      module(function($animateProvider) {
        $animateProvider.register('.animated', function() {
          return {
            beforeAddClass: spy,
            beforeRemoveClass: spy,
            beforeSetClass: spy
          };
        });
      });
      inject(function($rootScope, $animate, $compile, $rootElement, $document) {
        $animate.enabled(true);

        var element = $compile(
          '<div>' +
          '  <div ng-repeat="item in items" class="animated">' +
          '    <span>{{ $index }}</span>' +
          '  </div>' +
          '</div>'
        )($rootScope);

        $rootElement.append(element);
        angular.element($document[0].body).append($rootElement);

        $rootScope.items = [1,2,3];
        $rootScope.$digest();

        var child = element.find('div');

        $animate.addClass(child, 'start-animation');
        $rootScope.items = [2,3];
        $rootScope.$digest();

        expect(spy).not.toHaveBeenCalled();

        var innerChild = element.find('span');

        $animate.addClass(innerChild, 'start-animation');
        $rootScope.items = [3];
        $rootScope.$digest();

        expect(spy).not.toHaveBeenCalled();
        dealoc(element);
      });
    });

    it('should call class-based animation callbacks in the correct order when animations are skipped', function() {
      var continueAnimation;
      module(function($animateProvider) {
        $animateProvider.register('.animate', function() {
          return {
            addClass: function(element, className, done) {
              continueAnimation = done;
            }
          };
        });
      });
      inject(function($rootScope, $animate, $compile, $rootElement, $document) {
        $animate.enabled(true);

        var element = $compile('<div class="animate"></div>')($rootScope);
        $rootElement.append(element);
        angular.element($document[0].body).append($rootElement);

        var log = '';
        $animate.addClass(element, 'one').then(function() {
          log += 'A';
        });
        $rootScope.$digest();

        $animate.addClass(element, 'one').then(function() {
          log += 'B';
        });
        $rootScope.$digest();
        $animate.triggerCallbackPromise();

        $animate.triggerReflow();
        continueAnimation();
        $animate.triggerCallbackPromise();
        expect(log).toBe('BA');
      });
    });

    it('should skip class-based animations when add class and remove class cancel each other out', function() {
      var spy = jasmine.createSpy();
      module(function($animateProvider) {
        $animateProvider.register('.animate', function() {
          return {
            addClass: spy,
            removeClass: spy
          };
        });
      });
      inject(function($rootScope, $animate, $compile) {
        $animate.enabled(true);

        var element = $compile('<div class="animate"></div>')($rootScope);

        var count = 0;
        var callback = function() {
          count++;
        };

        $animate.addClass(element, 'on').then(callback);
        $animate.addClass(element, 'on').then(callback);
        $animate.removeClass(element, 'on').then(callback);
        $animate.removeClass(element, 'on').then(callback);

        $rootScope.$digest();
        $animate.triggerCallbackPromise();

        expect(spy).not.toHaveBeenCalled();
        expect(count).toBe(4);
      });
    });

    it("should wait until a queue of animations are complete before performing a reflow",
      inject(function($rootScope, $compile, $timeout, $sniffer, $animate) {

      if (!$sniffer.transitions) return;

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
            addClass: function(element, className, done) {
              childAnimated = true;
              done();
            }
          };
        });
        $animateProvider.register('.container', function() {
          return {
            leave: function(element, done) {
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
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(childAnimated).toBe(true);

        childAnimated = false;
        $animate.enabled(false, element);

        $animate.addClass(child, 'super');
        $rootScope.$digest();
        $animate.triggerReflow();
        expect(childAnimated).toBe(false);

        $animate.leave(element);
        $rootScope.$digest();
        expect(containerAnimated).toBe(true);
      });
    });


    it("should disable all child animations on structural animations until the post animation " +
       "timeout has passed as well as all structural animations", function() {
      var intercepted, continueAnimation;
      module(function($animateProvider) {
        $animateProvider.register('.animated', function() {
          return {
            enter: ani('enter'),
            leave: ani('leave'),
            move: ani('move'),
            addClass: ani('addClass'),
            removeClass: ani('removeClass')
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
        $rootScope.$digest();
        $animate.triggerReflow();
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
        $rootScope.$digest();
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
            enter: function(element, done) {
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
          document: jqLite(window.document),
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

        for (var i = 0; i < 20; i++) {
          kid = $compile('<div class="kid"></div>')($rootScope);
          $animate.enter(kid, element);
        }
        $rootScope.$digest();

        //called three times since the classname is the same
        expect(count).toBe(2);

        dealoc(element);
        count = 0;

        for (i = 0; i < 20; i++) {
          kid = $compile('<div class="kid c-' + i + '"></div>')($rootScope);
          $animate.enter(kid, element);
        }

        $rootScope.$digest();

        expect(count).toBe(20);
      });
    });

    it("should cache getComputedStyle with similar className values but with respect to the parent node",
      inject(function($compile, $rootScope, $animate, $sniffer) {

      if (!$sniffer.transitions) return;

      $animate.enabled();

      var html = '<div ng-class="{on:one}">first</div>' +
                 '<div class="second">' +
                 '  <div ng-class="{on:two}">second</div>' +
                 '</div>';

      ss.addRule('.second .on', '-webkit-transition:1s linear all;' +
                                        'transition:1s linear all;');

      var element = $compile(html)($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $rootScope.$apply(function() {
        $rootScope.one = true;
        $rootScope.two = true;
      });

      $animate.triggerReflow();

      var inner = jqLite(jqLite(element[1]).find('div'));

      expect(inner.hasClass('on-add')).toBe(true);
      expect(inner.hasClass('on-add-active')).toBe(true);

      browserTrigger(inner, 'animationend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

      expect(inner.hasClass('on-add')).toBe(false);
      expect(inner.hasClass('on-add-active')).toBe(false);
    }));

    it("should reset the getComputedStyle lookup cache even when no animation is found",
      inject(function($compile, $rootScope, $animate, $sniffer, $document) {

      if (!$sniffer.transitions) return;

      $animate.enabled();

      var html = '<div>' +
                 '  <div class="toggle" ng-if="onOff">On or Off</div>' +
                 '</div>';

      ss.addRule('.activated .toggle', '-webkit-transition:1s linear all;' +
                                               'transition:1s linear all;');

      var child, element = $compile(html)($rootScope);

      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $rootScope.onOff = true;
      $rootScope.$digest();

      child = element.find('div');
      expect(child).not.toHaveClass('ng-enter');
      expect(child.parent()[0]).toEqual(element[0]);
      $animate.triggerReflow();

      $rootScope.onOff = false;
      $rootScope.$digest();

      child = element.find('div');
      expect(child.parent().length).toBe(0);
      $animate.triggerReflow();

      element.addClass('activated');
      $rootScope.$digest();
      $animate.triggerReflow();

      $rootScope.onOff = true;
      $rootScope.$digest();

      child = element.find('div');
      expect(child).toHaveClass('ng-enter');
      $animate.triggerReflow();
      expect(child).toHaveClass('ng-enter-active');

      browserTrigger(child, 'transitionend',
        { timeStamp: Date.now() + 1000, elapsedTime: 2000 });

      $animate.triggerCallbacks();

      $rootScope.onOff = false;
      $rootScope.$digest();

      expect(child).toHaveClass('ng-leave');
      $animate.triggerReflow();
      expect(child).toHaveClass('ng-leave-active');
    }));

    it("should cancel and perform the dom operation only after the reflow has run",
      inject(function($compile, $rootScope, $animate, $sniffer) {

      if (!$sniffer.transitions) return;

      ss.addRule('.green-add', '-webkit-transition:1s linear all;' +
                                       'transition:1s linear all;');

      ss.addRule('.red-add', '-webkit-transition:1s linear all;' +
                                     'transition:1s linear all;');

      var element = $compile('<div></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $animate.addClass(element, 'green');
      $rootScope.$digest();
      expect(element.hasClass('green-add')).toBe(true);

      $animate.addClass(element, 'red');
      $rootScope.$digest();
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
        if (str.length === 0) {
          expect(className.length).toBe(0);
        } else {
          expect(className.split(/\s+/)).toEqual(str.split(' '));
        }
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
            beforeAddClass: function(element, className, done) {
              currentAnimation = 'addClass';
              currentFn = done;
              return function(cancelled) {
                currentAnimation = cancelled ? null : currentAnimation;
              };
            },
            beforeRemoveClass: function(element, className, done) {
              currentAnimation = 'removeClass';
              currentFn = done;
              return function(cancelled) {
                currentAnimation = cancelled ? null : currentAnimation;
              };
            }
          };
        });
      });
      inject(function($compile, $rootScope, $animate) {
        var element = $compile('<div class="animation-enabled only"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $animate.addClass(element, 'on');
        $rootScope.$digest();
        expect(currentAnimation).toBe('addClass');
        currentFn();

        currentAnimation = null;

        $animate.removeClass(element, 'on');
        $rootScope.$digest();

        $animate.addClass(element, 'on');
        $rootScope.$digest();

        expect(currentAnimation).toBe('addClass');
      });
    });

    it('should enable and disable animations properly on the root element', function() {
      var count = 0;
      module(function($animateProvider) {
        $animateProvider.register('.animated', function() {
          return {
            addClass: function(element, className, done) {
              count++;
              done();
            }
          };
        });
      });
      inject(function($compile, $rootScope, $animate, $sniffer, $rootElement) {

        $rootElement.addClass('animated');
        $animate.addClass($rootElement, 'green');
        $rootScope.$digest();
        $animate.triggerReflow();

        expect(count).toBe(1);

        $animate.addClass($rootElement, 'red');
        $rootScope.$digest();
        $animate.triggerReflow();

        expect(count).toBe(2);
      });
    });


    it('should perform pre and post animations', function() {
      var steps = [];
      module(function($animateProvider) {
        $animateProvider.register('.class-animate', function() {
          return {
            beforeAddClass: function(element, className, done) {
              steps.push('before');
              done();
            },
            addClass: function(element, className, done) {
              steps.push('after');
              done();
            }
          };
        });
      });
      inject(function($animate, $rootScope, $compile, $rootElement) {
        $animate.enabled(true);

        var element = $compile('<div class="class-animate"></div>')($rootScope);
        $rootElement.append(element);

        $animate.addClass(element, 'red');
        $rootScope.$digest();

        $animate.triggerReflow();

        expect(steps).toEqual(['before','after']);
      });
    });


    it('should treat the leave event always as a before event and discard the beforeLeave function', function() {
      var parentID, steps = [];
      module(function($animateProvider) {
        $animateProvider.register('.animate', function() {
          return {
            beforeLeave: function(element, done) {
              steps.push('before');
              done();
            },
            leave: function(element, done) {
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
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate) {

      if (!$sniffer.transitions) return;

      ss.addRule('.base-class', '-webkit-transition:1s linear all;' +
                                        'transition:1s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="base-class one two"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $animate.removeClass(element, 'base-class one two');
      $rootScope.$digest();

      //still true since we're before the reflow
      expect(element.hasClass('base-class')).toBe(true);

      //this will cancel the remove animation
      $animate.addClass(element, 'base-class one two');
      $rootScope.$digest();

      //the cancellation was a success and the class was removed right away
      expect(element.hasClass('base-class')).toBe(false);

      //the reflow...
      $animate.triggerReflow();

      //the reflow DOM operation was commenced...
      expect(element.hasClass('base-class')).toBe(true);
    }));


    it('should block and unblock transitions before the dom operation occurs',
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer) {

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
        if (prop == 'class' && val.indexOf('trigger-class') >= 0) {
          var propertyKey = ($sniffer.vendorPrefix == 'Webkit' ? '-webkit-' : '') + 'transition-property';
          capturedProperty = element.css(propertyKey);
        }
        node._setAttribute(prop, val);
      };

      expect(capturedProperty).toBe('none');
      $animate.addClass(element, 'trigger-class');
      $rootScope.$digest();

      $animate.triggerReflow();

      expect(capturedProperty).not.toBe('none');
    }));


    it('should not block keyframe animations around the reflow operation',
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer) {

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
      $rootScope.$digest();

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
            beforeAddClass: function(element, className, done) {
              expect(element[0].style[prop]).not.toContain('none');
              expect($window.getComputedStyle(element[0])[prop + 'Duration']).toBe('1s');
              done();
            },
            addClass: function(element, className, done) {
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

        var element = $compile('<div class="special"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $animate.addClass(element, 'some-klass');
        $rootScope.$digest();

        var prop = $sniffer.vendorPrefix == 'Webkit' ? 'WebkitAnimation' : 'animation';

        expect(element[0].style[prop]).not.toContain('none');
        expect($window.getComputedStyle(element[0])[prop + 'Duration']).toBe('1s');

        $animate.triggerReflow();
      });
    });


    it('should round up long elapsedTime values to close off a CSS3 animation',
      inject(function($rootScope, $compile, $rootElement, $document, $animate, $sniffer) {
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
            enter: function(element, done) {
              capturedAnimation = 'enter';
              done();
            },
            leave: function(element, done) {
              capturedAnimation = 'leave';
              done();
            }
          };
        });
      });
      inject(function($rootScope, $compile, $rootElement, $document, $timeout, $templateCache, $sniffer, $animate) {
        if (!$sniffer.transitions) return;

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
        $animate.triggerCallbackPromise();

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
            enter: buildFn('enter'),
            leave: buildFn('leave')
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
        if (!$sniffer.transitions) return;

        var element = $compile('<div class="capture"></div>')($rootScope);
        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        var enterDone = false;
        $animate.enter(element, $rootElement).then(function() {
          enterDone = true;
        });

        $rootScope.$digest();
        $animate.triggerCallbackPromise();

        expect(captures['enter']).toBeUndefined();
        expect(enterDone).toBe(true);

        element.addClass('prefixed-animation');

        var leaveDone = false;
        $animate.leave(element).then(function() {
          leaveDone = true;
        });

        $rootScope.$digest();
        $animate.triggerCallbackPromise();

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
            enter: buildFn('enter'),
            leave: buildFn('leave')
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
        if (!$sniffer.transitions) return;

        var upperElement = $compile('<div><div ng-if=1><span class="capture prefixed-animation"></span></div></div>')($rootScope);
        $rootElement.append(upperElement);
        jqLite($document[0].body).append($rootElement);

        $rootScope.$digest();
        $animate.triggerCallbacks();

        var element = upperElement.find('span');

        var leaveDone = false;
        $animate.leave(element).then(function() {
          leaveDone = true;
        });

        $rootScope.$digest();
        $animate.triggerCallbacks();

        expect(captures.leave).toBe(true);
        expect(leaveDone).toBe(true);
      });
    });

    it('should respect the most relevant CSS transition property if defined in multiple classes',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate) {

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
      $animate.addClass(element, 'on').then(function() {
        ready = true;
      });
      $rootScope.$digest();

      $animate.triggerReflow();
      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 1 });
      expect(ready).toBe(false);

      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 5 });
      $animate.triggerReflow();
      $animate.triggerCallbackPromise();
      expect(ready).toBe(true);

      ready = false;
      $animate.removeClass(element, 'on').then(function() {
        ready = true;
      });
      $rootScope.$digest();

      $animate.triggerReflow();
      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 1 });
      $animate.triggerCallbackPromise();
      expect(ready).toBe(true);
    }));

    it('should not apply a transition upon removal of a class that has a transition',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate) {

      if (!$sniffer.transitions) return;

      ss.addRule('.base-class.on', '-webkit-transition:5s linear all;' +
                                           'transition:5s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="base-class on"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var ready = false;
      $animate.removeClass(element, 'on').then(function() {
        ready = true;
      });
      $rootScope.$digest();

      $animate.triggerReflow();
      $animate.triggerCallbackPromise();
      expect(ready).toBe(true);
    }));

    it('should immediately close the former animation if the same CSS class is added/removed',
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate) {

      if (!$sniffer.transitions) return;

      ss.addRule('.water-class', '-webkit-transition:2s linear all;' +
                                         'transition:2s linear all;');

      $animate.enabled(true);

      var element = $compile('<div class="water-class on"></div>')($rootScope);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      var signature = '';
      $animate.removeClass(element, 'on').then(function() {
        signature += 'A';
      });
      $rootScope.$digest();

      $animate.addClass(element, 'on').then(function() {
        signature += 'B';
      });
      $rootScope.$digest();

      $animate.triggerReflow();
      $animate.triggerCallbackPromise();
      expect(signature).toBe('A');

      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2000 });
      $animate.triggerCallbackPromise();

      expect(signature).toBe('AB');
    }));

    it('should cancel the previous reflow when new animations are added', function() {
      var cancelReflowCallback = jasmine.createSpy('callback');
      module(function($provide) {
        $provide.value('$$animateReflow', function() {
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
        $rootScope.$digest();

        $animate.addClass(element, 'smooth');
        $rootScope.$digest();
        $animate.triggerReflow();

        expect(cancelReflowCallback).toHaveBeenCalled();
      });
    });

    it('should immediately close off a leave animation if the element is removed from the DOM', function() {
      var stat;
      module(function($animateProvider) {
        $animateProvider.register('.going', function() {
          return {
            leave: function() {
              //left blank so it hangs
              stat = 'leaving';
              return function(cancelled) {
                stat = cancelled && 'gone';
              };
            }
          };
        });
      });
      inject(function($sniffer, $compile, $rootScope, $rootElement, $animate) {

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
            enter: spy,
            leave: spy,
            addClass: spy,
            removeClass: spy
          };
        }
      }));

      it('should animate based on a boolean flag', inject(function($animate, $sniffer, $rootScope, $compile) {
        var html = '<section class="parent" ng-if="on1" ng-animate-children="bool">' +
                   '  <div class="child" ng-if="on2">...</div>' +
                   '</section>';

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

        var html = '<section class="parent" ng-if="on1" ng-animate-children>' +
                   '  <div class="child" ng-if="on2">...</div>' +
                   '</section>';

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

        var html = '<section ng-animate-children="false">' +
                   '  <aside class="parent" ng-if="on" ng-animate-children="true">' +
                   '    <div class="child" ng-if="on">...</div>' +
                   '  </aside>' +
                   '</section>';

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

      it('should permit class-based animations when ng-animate-children is true for a structural animation', function() {
          var spy = jasmine.createSpy();

          module(function($animateProvider) {
            $animateProvider.register('.inner', function() {
              return {
                beforeAddClass: function(element, className, done) {
                  spy();
                  done();
                },
                beforeRemoveClass: function(element, className, done) {
                  spy();
                  done();
                }
              };
            });
          });

          inject(function($animate, $sniffer, $rootScope, $compile) {

          $animate.enabled(true);

          var html = '<div ng-animate-children>' +
                     '  <div class="inner" ng-class="{animate:bool}">...</div>' +
                     '</div>';

          var element = angular.element(html);
          $compile(element)($rootScope);
          var body = angular.element($document[0].body);
          body.append($rootElement);

          $rootScope.$watch('bool', function(bool) {
            if (bool) {
              $animate.enter(element, $rootElement);
            } else if (element.parent().length) {
              $animate.leave(element);
            }
          });

          $rootScope.$digest();
          expect(spy.callCount).toBe(0);

          $rootScope.bool = true;
          $rootScope.$digest();
          $animate.triggerReflow();
          $animate.triggerCallbacks();
          expect(spy.callCount).toBe(1);

          $rootScope.bool = false;
          $rootScope.$digest();
          $animate.triggerReflow();
          $animate.triggerCallbacks();
          expect(spy.callCount).toBe(2);
        });
      });
    });

    describe('SVG', function() {
      it('should properly apply transitions on an SVG element',
        inject(function($animate, $rootScope, $compile, $rootElement, $sniffer) {

        //jQuery doesn't handle SVG elements natively. Instead, an add-on library
        //is required which is called jquery.svg.js. Therefore, when jQuery is
        //active here there is no point to test this since it won't work by default.
        if (!$sniffer.transitions) return;

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

        expect(jqLiteHasClass(child[0], 'ng-enter')).toBe(true);
        expect(jqLiteHasClass(child[0], 'ng-enter-active')).toBe(true);

        browserTrigger(child, 'transitionend', { timeStamp: Date.now() + 1000, elapsedTime: 1 });

        expect(jqLiteHasClass(child[0], 'ng-enter')).toBe(false);
        expect(jqLiteHasClass(child[0], 'ng-enter-active')).toBe(false);
      }));


      it('should properly remove classes from SVG elements', inject(function($animate, $rootScope) {
        var element = jqLite('<svg width="500" height="500"><rect class="class-of-doom"></rect></svg>');
        var child = element.find('rect');
        $animate.removeClass(child, 'class-of-doom');

        $rootScope.$digest();
        expect(child.attr('class')).toBe('');

        dealoc(element);
      }));
    });
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
        addClass = spyOn($originalAnimate, '$$addClassImmediately').andCallThrough();
        removeClass = spyOn($originalAnimate, '$$removeClassImmediately').andCallThrough();
      });
    }

    function setupClassManipulationLogger(log) {
      inject(function($animate) {
        var addClassImmediately = $originalAnimate.$$addClassImmediately;
        var removeClassImmediately = $originalAnimate.$$removeClassImmediately;
        addClass = spyOn($originalAnimate, '$$addClassImmediately').andCallFake(function(element, classes) {
          var names = classes;
          if (Object.prototype.toString.call(classes) === '[object Array]') names = classes.join(' ');
          log('addClass(' + names + ')');
          return addClassImmediately.call($originalAnimate, element, classes);
        });
        removeClass = spyOn($originalAnimate, '$$removeClassImmediately').andCallFake(function(element, classes) {
          var names = classes;
          if (Object.prototype.toString.call(classes) === '[object Array]') names = classes.join(' ');
          log('removeClass(' + names + ')');
          return removeClassImmediately.call($originalAnimate, element, classes);
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
