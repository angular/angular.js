'use strict';

describe('ngAnimate $$animateJs', function() {

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  function getDoneFunction(args) {
    for (var i = 1; i < args.length; i++) {
      var a = args[i];
      if (isFunction(a)) return a;
    }
  }

  it('should return nothing if no animations are registered at all', inject(function($$animateJs) {
    var element = jqLite('<div></div>');
    expect($$animateJs(element, 'enter')).toBeFalsy();
  }));

  it('should return nothing if no matching animations classes are found', function() {
    module(function($animateProvider) {
      $animateProvider.register('.foo', function() {
        return { enter: noop };
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="bar"></div>');
      expect($$animateJs(element, 'enter')).toBeFalsy();
    });
  });

  it('should return nothing if a matching animation class is found, but not a matching event', function() {
    module(function($animateProvider) {
      $animateProvider.register('.foo', function() {
        return { enter: noop };
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="foo"></div>');
      expect($$animateJs(element, 'leave')).toBeFalsy();
    });
  });

  it('should return a truthy value if a matching animation class and event are found', function() {
    module(function($animateProvider) {
      $animateProvider.register('.foo', function() {
        return { enter: noop };
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="foo"></div>');
      expect($$animateJs(element, 'enter')).toBeTruthy();
    });
  });

  it('should strictly query for the animation based on the classes value if passed in', function() {
    module(function($animateProvider) {
      $animateProvider.register('.superman', function() {
        return { enter: noop };
      });
      $animateProvider.register('.batman', function() {
        return { leave: noop };
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="batman"></div>');
      expect($$animateJs(element, 'enter', 'superman')).toBeTruthy();
      expect($$animateJs(element, 'leave', 'legoman batman')).toBeTruthy();
      expect($$animateJs(element, 'enter', 'legoman')).toBeFalsy();
      expect($$animateJs(element, 'leave', {})).toBeTruthy();
    });
  });

  it('should run multiple animations in parallel', function() {
    var doneCallbacks = [];
    function makeAnimation(event) {
      return function() {
        var data = {};
        data[event] = function(element, done) {
          doneCallbacks.push(done);
        };
        return data;
      };
    }
    module(function($animateProvider) {
      $animateProvider.register('.one', makeAnimation('enter'));
      $animateProvider.register('.two', makeAnimation('enter'));
      $animateProvider.register('.three', makeAnimation('enter'));
    });
    inject(function($$animateJs, $animate) {
      var element = jqLite('<div class="one two three"></div>');
      var animator = $$animateJs(element, 'enter');
      var complete = false;
      animator.start().done(function() {
        complete = true;
      });
      expect(doneCallbacks.length).toBe(3);
      forEach(doneCallbacks, function(cb) {
        cb();
      });
      $animate.flush();
      expect(complete).toBe(true);
    });
  });

  they('should $prop the animation when runner.$prop() is called', ['end', 'cancel'], function(method) {
    var ended = false;
    var status;
    module(function($animateProvider) {
      $animateProvider.register('.the-end', function() {
        return {
          enter: function() {
            return function(cancelled) {
              ended = true;
              status = cancelled ? 'cancel' : 'end';
            };
          }
        };
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="the-end"></div>');
      var animator = $$animateJs(element, 'enter');
      var runner = animator.start();

      expect(isFunction(runner[method])).toBe(true);

      expect(ended).toBeFalsy();
      runner[method]();
      expect(ended).toBeTruthy();
      expect(status).toBe(method);
    });
  });

  they('should $prop all of the running the animations when runner.$prop() is called',
    ['end', 'cancel'], function(method) {

    var lookup = {};
    module(function($animateProvider) {
      forEach(['one','two','three'], function(klass) {
        $animateProvider.register('.' + klass, function() {
          return {
            enter: function() {
              return function(cancelled) {
                lookup[klass] = cancelled ? 'cancel' : 'end';
              };
            }
          };
        });
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="one two three"></div>');
      var animator = $$animateJs(element, 'enter');
      var runner = animator.start();

      runner[method]();
      expect(lookup.one).toBe(method);
      expect(lookup.two).toBe(method);
      expect(lookup.three).toBe(method);
    });
  });

  they('should only run the $prop operation once', ['end', 'cancel'], function(method) {
    var ended = false;
    var count = 0;
    module(function($animateProvider) {
      $animateProvider.register('.the-end', function() {
        return {
          enter: function() {
            return function(cancelled) {
              ended = true;
              count++;
            };
          }
        };
      });
    });
    inject(function($$animateJs) {
      var element = jqLite('<div class="the-end"></div>');
      var animator = $$animateJs(element, 'enter');
      var runner = animator.start();

      expect(isFunction(runner[method])).toBe(true);

      expect(ended).toBeFalsy();
      runner[method]();
      expect(ended).toBeTruthy();
      expect(count).toBe(1);

      runner[method]();
      expect(count).toBe(1);
    });
  });

  it('should always run the provided animation in atleast one RAF frame if defined', function() {
    var before, after, endCalled;
    module(function($animateProvider) {
      $animateProvider.register('.the-end', function() {
        return {
          beforeAddClass: function(element, className, done) {
            before = done;
          },
          addClass: function(element, className, done) {
            after = done;
          }
        };
      });
    });
    inject(function($$animateJs, $animate) {
      var element = jqLite('<div class="the-end"></div>');
      var animator = $$animateJs(element, 'addClass', {
        addClass: 'red'
      });

      var runner = animator.start();
      runner.done(function() {
        endCalled = true;
      });

      expect(before).toBeDefined();
      before();

      expect(after).toBeUndefined();
      $animate.flush();
      expect(after).toBeDefined();
      after();

      expect(endCalled).toBeUndefined();
      $animate.flush();
      expect(endCalled).toBe(true);
    });
  });

  they('should still run the associated DOM event when the $prop function is run but no more animations', ['cancel', 'end'], function(method) {
    var log = [];
    module(function($animateProvider) {
      $animateProvider.register('.the-end', function() {
        return {
          beforeAddClass: function() {
            return function(cancelled) {
              var status = cancelled ? 'cancel' : 'end';
              log.push('before addClass ' + status);
            };
          },
          addClass: function() {
            return function(cancelled) {
              var status = cancelled ? 'cancel' : 'end';
              log.push('after addClass' + status);
            };
          }
        };
      });
    });
    inject(function($$animateJs, $animate) {
      var element = jqLite('<div class="the-end"></div>');
      var animator = $$animateJs(element, 'addClass', {
        domOperation: function() {
          log.push('dom addClass');
        }
      });
      var runner = animator.start();
      runner.done(function() {
        log.push('addClass complete');
      });
      runner[method]();

      $animate.flush();
      expect(log).toEqual(
        ['before addClass ' + method,
         'dom addClass',
         'addClass complete']);
    });
  });

  it('should resolve the promise when end() is called', function() {
    module(function($animateProvider) {
      $animateProvider.register('.the-end', function() {
        return { beforeAddClass: noop };
      });
    });
    inject(function($$animateJs, $animate, $rootScope) {
      var element = jqLite('<div class="the-end"></div>');
      var animator = $$animateJs(element, 'addClass');
      var runner = animator.start();
      var done = false;
      var cancelled = false;
      runner.then(function() {
          done = true;
        }, function() {
          cancelled = true;
        });

      runner.end();
      $animate.flush();
      $rootScope.$digest();
      expect(done).toBe(true);
      expect(cancelled).toBe(false);
    });
  });

  it('should reject the promise when cancel() is called', function() {
    module(function($animateProvider) {
      $animateProvider.register('.the-end', function() {
        return { beforeAddClass: noop };
      });
    });
    inject(function($$animateJs, $animate, $rootScope) {
      var element = jqLite('<div class="the-end"></div>');
      var animator = $$animateJs(element, 'addClass');
      var runner = animator.start();
      var done = false;
      var cancelled = false;
      runner.then(function() {
        done = true;
      }, function() {
        cancelled = true;
      });

      runner.cancel();
      $animate.flush();
      $rootScope.$digest();
      expect(done).toBe(false);
      expect(cancelled).toBe(true);
    });
  });

  describe('events', function() {
    var animations, runAnimation, element, log;
    beforeEach(module(function($animateProvider) {
      element = jqLite('<div class="test-animation"></div>');
      animations = {};
      log = [];

      $animateProvider.register('.test-animation', function() {
        return animations;
      });

      return function($$animateJs) {
        runAnimation = function(method, done, error, options) {
          options = extend(options || {}, {
            domOperation: function() {
              log.push('dom ' + method);
            }
          });

          var driver = $$animateJs(element, method, 'test-animation', options);
          driver.start().done(function(status) {
            ((status ? done : error) || noop)();
          });
        };
      };
    }));

    they('$prop should have the function signature of (element, done, options) for the after animation',
      ['enter', 'move', 'leave'], function(event) {
      inject(function() {
        var args;
        var animationOptions = {};
        animationOptions.foo = 'bar';
        animations[event] = function() {
          args = arguments;
        };
        runAnimation(event, noop, noop, animationOptions);

        expect(args.length).toBe(3);
        expect(args[0]).toBe(element);
        expect(isFunction(args[1])).toBe(true);
        expect(args[2].foo).toBe(animationOptions.foo);
      });
    });

    they('$prop should not execute a before function', enterMoveEvents, function(event) {
      inject(function() {
        var args;
        var beforeMethod = 'before' + event.charAt(0).toUpperCase() + event.substr(1);
        var animationOptions = {};
        animations[beforeMethod] = function() {
          args = arguments;
        };

        runAnimation(event, noop, noop, animationOptions);
        expect(args).toBeFalsy();
      });
    });

    they('$prop should have the function signature of (element, className, done, options) for the before animation',
      ['addClass', 'removeClass'], function(event) {
      inject(function() {
        var beforeMethod = 'before' + event.charAt(0).toUpperCase() + event.substr(1);
        var args;
        var className = 'matias';
        animations[beforeMethod] = function() {
          args = arguments;
        };

        var animationOptions = {};
        animationOptions.foo = 'bar';
        animationOptions[event] = className;
        runAnimation(event, noop, noop, animationOptions);

        expect(args.length).toBe(4);
        expect(args[0]).toBe(element);
        expect(args[1]).toBe(className);
        expect(isFunction(args[2])).toBe(true);
        expect(args[3].foo).toBe(animationOptions.foo);
      });
    });

    they('$prop should have the function signature of (element, className, done, options) for the after animation',
      ['addClass', 'removeClass'], function(event) {
      inject(function() {
        var args;
        var className = 'fatias';
        animations[event] = function() {
          args = arguments;
        };

        var animationOptions = {};
        animationOptions.foo = 'bar';
        animationOptions[event] = className;
        runAnimation(event, noop, noop, animationOptions);

        expect(args.length).toBe(4);
        expect(args[0]).toBe(element);
        expect(args[1]).toBe(className);
        expect(isFunction(args[2])).toBe(true);
        expect(args[3].foo).toBe(animationOptions.foo);
      });
    });

    they('setClass should have the function signature of (element, addClass, removeClass, done, options) for the $prop animation', ['before', 'after'], function(event) {
      inject(function() {
        var args;
        var method = event === 'before' ? 'beforeSetClass' : 'setClass';
        animations[method] = function() {
          args = arguments;
        };

        var addClass = 'on';
        var removeClass = 'on';
        var animationOptions = {
          foo: 'bar',
          addClass: addClass,
          removeClass: removeClass
        };
        runAnimation('setClass', noop, noop, animationOptions);

        expect(args.length).toBe(5);
        expect(args[0]).toBe(element);
        expect(args[1]).toBe(addClass);
        expect(args[2]).toBe(removeClass);
        expect(isFunction(args[3])).toBe(true);
        expect(args[4].foo).toBe(animationOptions.foo);
      });
    });

    they('animate should have the function signature of (element, from, to, done, options) for the $prop animation', ['before', 'after'], function(event) {
      inject(function() {
        var args;
        var method = event === 'before' ? 'beforeAnimate' : 'animate';
        animations[method] = function() {
          args = arguments;
        };

        var to = { color: 'red' };
        var from = { color: 'blue' };
        var animationOptions = {
          foo: 'bar',
          to: to,
          from: from
        };
        runAnimation('animate', noop, noop, animationOptions);

        expect(args.length).toBe(5);
        expect(args[0]).toBe(element);
        expect(args[1]).toBe(from);
        expect(args[2]).toBe(to);
        expect(isFunction(args[3])).toBe(true);
        expect(args[4].foo).toBe(animationOptions.foo);
      });
    });

    they('custom events should have the function signature of (element, done, options) for the $prop animation', ['before', 'after'], function(event) {
      inject(function() {
        var args;
        var method = event === 'before' ? 'beforeCustom' : 'custom';
        animations[method] = function() {
          args = arguments;
        };

        var animationOptions = {};
        animationOptions.foo = 'bar';
        runAnimation('custom', noop, noop, animationOptions);

        expect(args.length).toBe(3);
        expect(args[0]).toBe(element);
        expect(isFunction(args[1])).toBe(true);
        expect(args[2].foo).toBe(animationOptions.foo);
      });
    });

    var enterMoveEvents = ['enter', 'move'];
    var otherEvents = ['addClass', 'removeClass', 'setClass'];
    var allEvents = ['leave'].concat(otherEvents).concat(enterMoveEvents);

    they('$prop should asynchronously render the before$prop animation', otherEvents, function(event) {
      inject(function($animate) {
        var beforeMethod = 'before' + event.charAt(0).toUpperCase() + event.substr(1);
        animations[beforeMethod] = function(element, a, b, c) {
          log.push('before ' + event);
          var done = getDoneFunction(arguments);
          done();
        };

        runAnimation(event);
        expect(log).toEqual(['before ' + event]);
        $animate.flush();

        expect(log).toEqual(['before ' + event, 'dom ' + event]);
      });
    });

    they('$prop should asynchronously render the $prop animation', allEvents, function(event) {
      inject(function($animate) {
        animations[event] = function(element, a, b, c) {
          log.push('after ' + event);
          var done = getDoneFunction(arguments);
          done();
        };

        runAnimation(event, function() {
          log.push('complete');
        });

        if (event === 'leave') {
          expect(log).toEqual(['after leave']);
          $animate.flush();
          expect(log).toEqual(['after leave', 'dom leave', 'complete']);
        } else {
          expect(log).toEqual(['dom ' + event, 'after ' + event]);
          $animate.flush();
          expect(log).toEqual(['dom ' + event, 'after ' + event, 'complete']);
        }
      });
    });

    they('$prop should asynchronously render the $prop animation when a start/end animator object is returned',
      allEvents, function(event) {

      inject(function($animate, $$AnimateRunner) {
        var runner;
        animations[event] = function(element, a, b, c) {
          return {
            start: function() {
              log.push('start ' + event);
              runner = new $$AnimateRunner();
              return runner;
            }
          };
        };

        runAnimation(event, function() {
          log.push('complete');
        });

        if (event === 'leave') {
          expect(log).toEqual(['start leave']);
          runner.end();
          $animate.flush();
          expect(log).toEqual(['start leave', 'dom leave', 'complete']);
        } else {
          expect(log).toEqual(['dom ' + event, 'start ' + event]);
          runner.end();
          $animate.flush();
          expect(log).toEqual(['dom ' + event, 'start ' + event, 'complete']);
        }
      });
    });

    they('$prop should asynchronously render the $prop animation when an instance of $$AnimateRunner is returned',
      allEvents, function(event) {

      inject(function($animate, $$AnimateRunner) {
        var runner;
        animations[event] = function(element, a, b, c) {
          log.push('start ' + event);
          runner = new $$AnimateRunner();
          return runner;
        };

        runAnimation(event, function() {
          log.push('complete');
        });

        if (event === 'leave') {
          expect(log).toEqual(['start leave']);
          runner.end();
          $animate.flush();
          expect(log).toEqual(['start leave', 'dom leave', 'complete']);
        } else {
          expect(log).toEqual(['dom ' + event, 'start ' + event]);
          runner.end();
          $animate.flush();
          expect(log).toEqual(['dom ' + event, 'start ' + event, 'complete']);
        }
      });
    });

    they('$prop should asynchronously reject the before animation if the callback function is called with false', otherEvents, function(event) {
      inject(function($animate, $rootScope) {
        var beforeMethod = 'before' + event.charAt(0).toUpperCase() + event.substr(1);
        animations[beforeMethod] = function(element, a, b, c) {
          log.push('before ' + event);
          var done = getDoneFunction(arguments);
          done(false);
        };

        animations[event] = function(element, a, b, c) {
          log.push('after ' + event);
          var done = getDoneFunction(arguments);
          done();
        };

        runAnimation(event,
          function() { log.push('pass'); },
          function() { log.push('fail'); });

        expect(log).toEqual(['before ' + event]);
        $animate.flush();
        expect(log).toEqual(['before ' + event, 'dom ' + event, 'fail']);
      });
    });

    they('$prop should asynchronously reject the after animation if the callback function is called with false', allEvents, function(event) {
      inject(function($animate, $rootScope) {
        animations[event] = function(element, a, b, c) {
          log.push('after ' + event);
          var done = getDoneFunction(arguments);
          done(false);
        };

        runAnimation(event,
          function() { log.push('pass'); },
          function() { log.push('fail'); });

        var expectations = [];
        if (event === 'leave') {
          expect(log).toEqual(['after leave']);
          $animate.flush();
          expect(log).toEqual(['after leave', 'dom leave', 'fail']);
        } else {
          expect(log).toEqual(['dom ' + event, 'after ' + event]);
          $animate.flush();
          expect(log).toEqual(['dom ' + event, 'after ' + event, 'fail']);
        }
      });
    });

    it('setClass should delegate down to addClass/removeClass if not defined', inject(function($animate) {
      animations.addClass = function(element, done) {
        log.push('addClass');
      };

      animations.removeClass = function(element, done) {
        log.push('removeClass');
      };

      expect(animations.setClass).toBeFalsy();

      runAnimation('setClass');

      expect(log).toEqual(['dom setClass', 'removeClass', 'addClass']);
    }));

    it('beforeSetClass should delegate down to beforeAddClass/beforeRemoveClass if not defined',
      inject(function($animate) {

      animations.beforeAddClass = function(element, className, done) {
        log.push('beforeAddClass');
        done();
      };

      animations.beforeRemoveClass = function(element, className, done) {
        log.push('beforeRemoveClass');
        done();
      };

      expect(animations.setClass).toBeFalsy();

      runAnimation('setClass');
      $animate.flush();

      expect(log).toEqual(['beforeRemoveClass', 'beforeAddClass', 'dom setClass']);
    }));

    it('leave should always ignore the `beforeLeave` animation',
      inject(function($animate) {

      animations.beforeLeave = function(element, done) {
        log.push('beforeLeave');
        done();
      };

      animations.leave = function(element, done) {
        log.push('leave');
        done();
      };

      runAnimation('leave');
      $animate.flush();

      expect(log).toEqual(['leave', 'dom leave']);
    }));

    it('should allow custom events to be triggered',
      inject(function($animate) {

      animations.beforeFlex = function(element, done) {
        log.push('beforeFlex');
        done();
      };

      animations.flex = function(element, done) {
        log.push('flex');
        done();
      };

      runAnimation('flex');
      $animate.flush();

      expect(log).toEqual(['beforeFlex', 'dom flex', 'flex']);
    }));
  });
});
