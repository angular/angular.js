'use strict';

describe("ngAnimate $$animateCssDriver", function() {

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  function int(x) {
    return parseInt(x, 10);
  }

  function hasAll(array, vals) {
    for (var i = 0; i < vals.length; i++) {
      if (array.indexOf(vals[i]) === -1) return false;
    }
    return true;
  }

  it('should return a noop driver handler if the browser does not support CSS transitions and keyframes', function() {
    module(function($provide) {
      $provide.value('$sniffer', {});
    });
    inject(function($$animateCssDriver) {
      expect($$animateCssDriver).toBe(noop);
    });
  });

  describe('when active', function() {
    if (!browserSupportsCssAnimations()) return;

    var element;
    var ss;
    afterEach(function() {
      dealoc(element);
      if (ss) {
        ss.destroy();
      }
    });

    var capturedAnimation;
    var captureLog;
    var driver;
    var captureFn;
    beforeEach(module(function($provide) {
      capturedAnimation = null;
      captureLog = [];
      captureFn = noop;

      $provide.factory('$animateCss', function($$AnimateRunner) {
        return function() {
          var runner = new $$AnimateRunner();

          capturedAnimation = arguments;
          captureFn.apply(null, arguments);
          captureLog.push({
            element: arguments[0],
            args: arguments,
            runner: runner
          });

          return {
            $$willAnimate: true,
            start: function() {
              return runner;
            }
          };
        };
      });

      element = jqLite('<div></div>');

      return function($$animateCssDriver, $document, $window) {
        driver = function(details, cb) {
          return $$animateCssDriver(details, cb || noop);
        };
        ss = createMockStyleSheet($document, $window);
      };
    }));

    it('should register the $$animateCssDriver into the list of drivers found in $animateProvider',
      module(function($animateProvider) {

      expect($animateProvider.drivers).toContain('$$animateCssDriver');
    }));

    it('should register the $$animateCssDriver into the list of drivers found in $animateProvider',
      module(function($animateProvider) {

      expect($animateProvider.drivers).toContain('$$animateCssDriver');
    }));

    describe("regular animations", function() {
      it("should render an animation on the given element", inject(function() {
        driver({ element: element });
        expect(capturedAnimation[0]).toBe(element);
      }));

      it("should return an object with a start function", inject(function() {
        var runner = driver({ element: element });
        expect(isFunction(runner.start)).toBeTruthy();
      }));

      it("should not signal $animateCss to apply the classes early when animation is structural", inject(function() {
        driver({ element: element });
        expect(capturedAnimation[1].applyClassesEarly).toBeFalsy();

        driver({ element: element, structural: true });
        expect(capturedAnimation[1].applyClassesEarly).toBeTruthy();
      }));

      it("should only set the event value if the animation is structural", inject(function() {
        driver({ element: element, structural: true, event: 'superman' });
        expect(capturedAnimation[1].event).toBe('superman');

        driver({ element: element, event: 'batman' });
        expect(capturedAnimation[1].event).toBeFalsy();
      }));
    });

    describe("anchored animations", function() {
      var from, to, fromAnimation, toAnimation;

      beforeEach(module(function() {
        return function($rootElement, $$body) {
          from = element;
          to = jqLite('<div></div>');
          fromAnimation = { element: from, event: 'enter' };
          toAnimation = { element: to, event: 'leave' };
          $rootElement.append(from);
          $rootElement.append(to);

          // we need to do this so that style detection works
          $$body.append($rootElement);
        };
      }));

      it("should not return anything if no animation is detected", function() {
        module(function($provide) {
          $provide.value('$animateCss', function() {
            return { $$willAnimate: false };
          });
        });
        inject(function() {
          var runner = driver({
            from: fromAnimation,
            to: toAnimation
          });
          expect(runner).toBeFalsy();
        });
      });

      it("should return a start method", inject(function() {
        var animator = driver({
          from: fromAnimation,
          to: toAnimation
        });
        expect(isFunction(animator.start)).toBeTruthy();
      }));

      they("should return a runner with a $prop() method which will end the animation",
        ['end', 'cancel'], function(method) {

        var closeAnimation;
        module(function($provide) {
          $provide.factory('$animateCss', function($q, $$AnimateRunner) {
            return function() {
              return {
                $$willAnimate: true,
                start: function() {
                  return new $$AnimateRunner({
                    end: function() {
                      closeAnimation();
                    }
                  });
                }
              };
            };
          });
        });

        inject(function() {
          var animator = driver({
            from: fromAnimation,
            to: toAnimation
          });

          var animationClosed = false;
          closeAnimation = function() {
            animationClosed = true;
          };

          var runner = animator.start();

          expect(isFunction(runner[method])).toBe(true);
          runner[method]();
          expect(animationClosed).toBe(true);
        });
      });

      it("should end the animation for each of the from and to elements as well as all the anchors", function() {
        var closeLog = {};
        module(function($provide) {
          $provide.factory('$animateCss', function($q, $$AnimateRunner) {
            return function(element, options) {
              var type = options.event || 'anchor';
              closeLog[type] = closeLog[type] || [];
              return {
                $$willAnimate: true,
                start: function() {
                  return new $$AnimateRunner({
                    end: function() {
                      closeLog[type].push(element);
                    }
                  });
                }
              };
            };
          });
        });

        inject(function() {
          //we'll just use one animation to make the test smaller
          var anchorAnimation = {
            'in': jqLite('<div></div>'),
            'out': jqLite('<div></div>')
          };

          fromAnimation.structural = true;
          fromAnimation.element.append(anchorAnimation['out']);
          toAnimation.structural = true;
          toAnimation.element.append(anchorAnimation['in']);

          var animator = driver({
            from: fromAnimation,
            to: toAnimation,
            anchors: [
              anchorAnimation,
              anchorAnimation,
              anchorAnimation
            ]
          });

          var runner = animator.start();
          runner.end();

          expect(closeLog.enter[0]).toEqual(fromAnimation.element);
          expect(closeLog.leave[0]).toEqual(toAnimation.element);
          expect(closeLog.anchor.length).toBe(3);
        });
      });

      it("should render an animation on both the from and to elements", inject(function() {
        captureFn = function(element, details) {
          element.addClass(details.event);
        };

        fromAnimation.structural = true;
        toAnimation.structural = true;

        var runner = driver({
          from: fromAnimation,
          to: toAnimation
        });

        expect(captureLog.length).toBe(2);
        expect(fromAnimation.element).toHaveClass('enter');
        expect(toAnimation.element).toHaveClass('leave');
      }));

      it("should start the animations on the from and to elements in parallel", function() {
        var animationLog = [];
        module(function($provide) {
          $provide.factory('$animateCss', function($$AnimateRunner) {
            return function(element, details) {
              return {
                $$willAnimate: true,
                start: function() {
                  animationLog.push([element, details.event]);
                  return new $$AnimateRunner();
                }
              };
            };
          });
        });
        inject(function() {
          fromAnimation.structural = true;
          toAnimation.structural = true;

          var runner = driver({
            from: fromAnimation,
            to: toAnimation
          });

          expect(animationLog.length).toBe(0);
          runner.start();
          expect(animationLog).toEqual([
            [fromAnimation.element, 'enter'],
            [toAnimation.element, 'leave']
          ]);
        });
      });

      it("should start an animation for each anchor", inject(function() {
        var o1 = jqLite('<div></div>');
        from.append(o1);
        var o2 = jqLite('<div></div>');
        from.append(o2);
        var o3 = jqLite('<div></div>');
        from.append(o3);

        var i1 = jqLite('<div></div>');
        to.append(i1);
        var i2 = jqLite('<div></div>');
        to.append(i2);
        var i3 = jqLite('<div></div>');
        to.append(i3);

        var anchors = [
          { 'out': o1, 'in': i1, classes: 'red' },
          { 'out': o2, 'in': i2, classes: 'blue' },
          { 'out': o2, 'in': i2, classes: 'green' }
        ];

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: anchors
        });

        expect(captureLog.length).toBe(5);
      }));

      it("should create a clone of the starting element for each anchor animation", inject(function() {
        var o1 = jqLite('<div class="out1"></div>');
        from.append(o1);
        var o2 = jqLite('<div class="out2"></div>');
        from.append(o2);

        var i1 = jqLite('<div class="in1"></div>');
        to.append(i1);
        var i2 = jqLite('<div class="in2"></div>');
        to.append(i2);

        var anchors = [
          { 'out': o1, 'in': i1 },
          { 'out': o2, 'in': i2 }
        ];

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: anchors
        });

        var a2 = captureLog.pop().element;
        var a1 = captureLog.pop().element;

        expect(a1).not.toEqual(o1);
        expect(a1.attr('class')).toMatch(/\bout1\b/);
        expect(a2).not.toEqual(o2);
        expect(a2.attr('class')).toMatch(/\bout2\b/);
      }));

      it("should create a clone of the starting element and place it at the end of the $rootElement container",
        inject(function($rootElement) {

        //stick some garbage into the rootElement
        $rootElement.append(jqLite('<div></div>'));
        $rootElement.append(jqLite('<div></div>'));
        $rootElement.append(jqLite('<div></div>'));

        var fromAnchor = jqLite('<div class="out"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div class="in"></div>');
        to.append(toAnchor);

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'in': fromAnchor,
            'out': toAnchor
          }]
        });

        var anchor = captureLog.pop().element;
        var anchorNode = anchor[0];
        var contents = $rootElement.contents();

        expect(contents.length).toBeGreaterThan(1);
        expect(contents[contents.length - 1]).toEqual(anchorNode);
      }));

      it("should first do an addClass('ng-anchor-out') animation on the cloned anchor", inject(function($rootElement) {
        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        });

        var anchorDetails = captureLog.pop().args[1];
        expect(anchorDetails.addClass).toBe('ng-anchor-out');
        expect(anchorDetails.event).toBeFalsy();
      }));

      it("should then do an addClass('ng-anchor-in') animation on the cloned anchor and remove the old class",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        captureLog.pop().runner.end();

        var anchorDetails = captureLog.pop().args[1];
        expect(anchorDetails.removeClass.trim()).toBe('ng-anchor-out');
        expect(anchorDetails.addClass.trim()).toBe('ng-anchor-in');
        expect(anchorDetails.event).toBeFalsy();
      }));

      they("should only fire the ng-anchor-$prop animation if only a $prop animation is defined",
        ['out', 'in'], function(direction) {

        var expectedClass = 'ng-anchor-' + direction;
        var animationStarted;
        var runner;

        module(function($provide) {
          $provide.factory('$animateCss', function($$AnimateRunner) {
            return function(element, options) {
              var addClass = (options.addClass || '').trim();
              return {
                $$willAnimate: addClass === expectedClass,
                start: function() {
                  animationStarted = addClass;
                  return runner = new $$AnimateRunner();
                }
              };
            };
          });
        });

        inject(function($rootElement, $animate) {
          var fromAnchor = jqLite('<div></div>');
          from.append(fromAnchor);
          var toAnchor = jqLite('<div></div>');
          to.append(toAnchor);

          $rootElement.append(fromAnchor);
          $rootElement.append(toAnchor);

          var complete = false;

          driver({
            from: fromAnimation,
            to: toAnimation,
            anchors: [{
              'out': fromAnchor,
              'in': toAnchor
            }]
          }).start().done(function() {
            complete = true;
          });

          expect(animationStarted).toBe(expectedClass);
          runner.end();
          $animate.flush();
          expect(complete).toBe(true);
        });
      });


      it("should provide an explicit delay setting in the options provided to $animateCss for anchor animations",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        });

        expect(capturedAnimation[1].delay).toBeTruthy();
      }));

      it("should begin the anchor animation by seeding the from styles based on where the from anchor element is positioned",
        inject(function($rootElement) {

        ss.addRule('.starting-element', 'width:200px; height:100px; display:block;');

        var fromAnchor = jqLite('<div class="starting-element"' +
                                    ' style="margin-top:500px; margin-left:150px;"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        });

        var anchorAnimation = captureLog.pop();
        var anchorElement = anchorAnimation.element;
        var anchorDetails = anchorAnimation.args[1];

        var fromStyles = anchorDetails.from;
        expect(int(fromStyles.width)).toBe(200);
        expect(int(fromStyles.height)).toBe(100);
        // some browsers have their own body margin defaults
        expect(int(fromStyles.top)).toBeGreaterThan(499);
        expect(int(fromStyles.left)).toBeGreaterThan(149);
      }));

      it("should append a `px` value for all seeded animation styles", inject(function($rootElement) {
        ss.addRule('.starting-element', 'width:10px; height:20px; display:inline-block;');

        var fromAnchor = jqLite('<div class="starting-element"' +
                                    ' style="margin-top:30px; margin-left:40px;"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        var runner = driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        });

        var anchorAnimation = captureLog.pop();
        var anchorDetails = anchorAnimation.args[1];

        forEach(anchorDetails.from, function(value) {
          expect(value.substr(value.length - 2)).toBe('px');
        });

        // the out animation goes first
        anchorAnimation.runner.end();

        anchorAnimation = captureLog.pop();
        anchorDetails = anchorAnimation.args[1];

        forEach(anchorDetails.to, function(value) {
          expect(value.substr(value.length - 2)).toBe('px');
        });
      }));

      it("should then do an removeClass('out') + addClass('in') animation on the cloned anchor",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        // the out animation goes first
        captureLog.pop().runner.end();

        var anchorDetails = captureLog.pop().args[1];
        expect(anchorDetails.removeClass).toMatch(/\bout\b/);
        expect(anchorDetails.addClass).toMatch(/\bin\b/);
        expect(anchorDetails.event).toBeFalsy();
      }));

      it("should add the `ng-anchor` class to the cloned anchor element",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        var clonedAnchor = captureLog.pop().element;
        expect(clonedAnchor).toHaveClass('ng-anchor');
      }));

      it("should add and remove the `ng-animate-shim` class on the in anchor element during the animation",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        expect(fromAnchor).toHaveClass('ng-animate-shim');

        // the out animation goes first
        captureLog.pop().runner.end();
        captureLog.pop().runner.end();

        expect(fromAnchor).not.toHaveClass('ng-animate-shim');
      }));

      it("should add and remove the `ng-animate-shim` class on the out anchor element during the animation",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        expect(toAnchor).toHaveClass('ng-animate-shim');

        // the out animation goes first
        captureLog.pop().runner.end();

        expect(toAnchor).toHaveClass('ng-animate-shim');
        captureLog.pop().runner.end();

        expect(toAnchor).not.toHaveClass('ng-animate-shim');
      }));

      it("should create the cloned anchor with all of the classes from the from anchor element",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div class="yes no maybe"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        var addedClasses = captureLog.pop().element.attr('class').split(' ');
        expect(hasAll(addedClasses, ['yes', 'no', 'maybe'])).toBe(true);
      }));

      it("should remove the classes of the starting anchor from the cloned anchor node during the in animation and also add the classes of the destination anchor within the same animation",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div class="yes no maybe"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div class="why ok so-what"></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        // the out animation goes first
        captureLog.pop().runner.end();

        var anchorDetails = captureLog.pop().args[1];
        var removedClasses = anchorDetails.removeClass.split(' ');
        var addedClasses = anchorDetails.addClass.split(' ');

        expect(hasAll(removedClasses, ['yes', 'no', 'maybe'])).toBe(true);
        expect(hasAll(addedClasses, ['why', 'ok', 'so-what'])).toBe(true);
      }));

      it("should not attempt to add/remove any classes that contain a `ng-` prefix",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div class="ng-yes ng-no sure"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div class="ng-bar ng-foo maybe"></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        // the out animation goes first
        captureLog.pop().runner.end();

        var inAnimation = captureLog.pop();
        var details = inAnimation.args[1];

        var addedClasses = details.addClass.split(' ');
        var removedClasses = details.removeClass.split(' ');

        expect(addedClasses).not.toContain('ng-foo');
        expect(addedClasses).not.toContain('ng-bar');

        expect(removedClasses).not.toContain('ng-yes');
        expect(removedClasses).not.toContain('ng-no');
      }));

      it("should not remove any shared CSS classes between the starting and destination anchor element during the in animation",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div class="blue green red"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div class="blue brown red black"></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        // the out animation goes first
        captureLog.pop().runner.end();

        var inAnimation = captureLog.pop();
        var clonedAnchor = inAnimation.element;
        var details = inAnimation.args[1];

        var addedClasses = details.addClass.split(' ');
        var removedClasses = details.removeClass.split(' ');

        expect(hasAll(addedClasses, ['brown', 'black'])).toBe(true);
        expect(hasAll(removedClasses, ['green'])).toBe(true);

        expect(addedClasses).not.toContain('red');
        expect(addedClasses).not.toContain('blue');

        expect(removedClasses).not.toContain('brown');
        expect(removedClasses).not.toContain('black');

        expect(removedClasses).not.toContain('red');
        expect(removedClasses).not.toContain('blue');

        inAnimation.runner.end();

        expect(clonedAnchor).toHaveClass('red');
        expect(clonedAnchor).toHaveClass('blue');
      }));

      it("should continue the anchor animation by seeding the to styles based on where the final anchor element will be positioned",
      inject(function($rootElement) {
        ss.addRule('.ending-element', 'width:9999px; height:6666px; display:inline-block;');

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);

        var toAnchor = jqLite('<div class="ending-element"' +
                                  ' style="margin-top:300px; margin-left:20px;"></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        captureLog.pop().runner.end();

        var anchorAnimation = captureLog.pop();
        var anchorElement = anchorAnimation.element;
        var anchorDetails = anchorAnimation.args[1];

        var toStyles = anchorDetails.to;
        expect(int(toStyles.width)).toBe(9999);
        expect(int(toStyles.height)).toBe(6666);
        // some browsers have their own body margin defaults
        expect(int(toStyles.top)).toBeGreaterThan(300);
        expect(int(toStyles.left)).toBeGreaterThan(20);
      }));

      it("should remove the cloned anchor node from the DOM once the 'in' animation is complete",
        inject(function($rootElement) {

        var fromAnchor = jqLite('<div class="blue green red"></div>');
        from.append(fromAnchor);
        var toAnchor = jqLite('<div class="blue brown red black"></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start();

        // the out animation goes first
        var inAnimation = captureLog.pop();
        var clonedAnchor = inAnimation.element;
        expect(clonedAnchor.parent().length).toBe(1);
        inAnimation.runner.end();

        // now the in animation completes
        expect(clonedAnchor.parent().length).toBe(1);
        captureLog.pop().runner.end();

        expect(clonedAnchor.parent().length).toBe(0);
      }));

      it("should pass the provided domOperation into $animateCss to be run right after the element is animated if a leave animation is present",
        inject(function($rootElement) {

        toAnimation.structural = true;
        toAnimation.event = 'enter';
        toAnimation.options = {};

        fromAnimation.structural = true;
        fromAnimation.event = 'leave';
        fromAnimation.options = {};

        var leaveOp = function() { };
        fromAnimation.options.domOperation = leaveOp;

        driver({
          from: fromAnimation,
          to: toAnimation
        }).start();

        var leaveAnimation = captureLog.shift();
        var enterAnimation = captureLog.shift();

        expect(leaveAnimation.args[1].onDone).toBe(leaveOp);
        expect(enterAnimation.args[1].onDone).toBeUndefined();
      }));

      it("should fire the returned runner promise when the from, to and anchor animations are all complete",
        inject(function($rootElement, $rootScope, $animate) {

        ss.addRule('.ending-element', 'width:9999px; height:6666px; display:inline-block;');

        var fromAnchor = jqLite('<div></div>');
        from.append(fromAnchor);

        var toAnchor = jqLite('<div></div>');
        to.append(toAnchor);

        $rootElement.append(fromAnchor);
        $rootElement.append(toAnchor);

        var completed = false;
        driver({
          from: fromAnimation,
          to: toAnimation,
          anchors: [{
            'out': fromAnchor,
            'in': toAnchor
          }]
        }).start().then(function() {
          completed = true;
        });

        captureLog.pop().runner.end(); //from
        captureLog.pop().runner.end(); //to
        captureLog.pop().runner.end(); //anchor(out)
        captureLog.pop().runner.end(); //anchor(in)

        $animate.flush();
        $rootScope.$digest();

        expect(completed).toBe(true);
      }));
    });
  });
});
