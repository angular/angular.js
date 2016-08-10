'use strict';

describe('ngAnimate integration tests', function() {

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  var element, html, ss;
  beforeEach(module(function() {
    return function($rootElement, $document, $animate) {
      $animate.enabled(true);

      ss = createMockStyleSheet($document);

      var body = jqLite($document[0].body);
      html = function(element) {
        body.append($rootElement);
        $rootElement.append(element);
      };
    };
  }));

  afterEach(function() {
    dealoc(element);
    ss.destroy();
  });

 it('should cancel a running and started removeClass animation when a follow-up addClass animation adds the same class',
    inject(function($animate, $rootScope, $$rAF, $document, $rootElement) {

    jqLite($document[0].body).append($rootElement);
    element = jqLite('<div></div>');
    $rootElement.append(element);

    element.addClass('active-class');

    var runner = $animate.removeClass(element, 'active-class');
    $rootScope.$digest();

    var doneHandler = jasmine.createSpy('addClass done');
    runner.done(doneHandler);

    $$rAF.flush(); // Trigger the actual animation

    expect(doneHandler).not.toHaveBeenCalled();

    $animate.addClass(element, 'active-class');
    $rootScope.$digest();

    // Cancelling the removeClass animation triggers the done callback
    expect(doneHandler).toHaveBeenCalled();
  }));

  it('should remove a class that is currently being added by a running animation when another class is added in before in the same digest',
    inject(function($animate, $rootScope, $$rAF, $document, $rootElement) {

    jqLite($document[0].body).append($rootElement);
    element = jqLite('<div></div>');
    $rootElement.append(element);

    var runner = $animate.addClass(element, 'red');

    $rootScope.$digest();

    $animate.addClass(element, 'blue');
    $animate.removeClass(element, 'red');
    $rootScope.$digest();

    $$rAF.flush();

    expect(element).not.toHaveClass('red');
    expect(element).toHaveClass('blue');
  }));


  it('should add a class that is currently being removed by a running animation when another class is removed before in the same digest',
    inject(function($animate, $rootScope, $$rAF, $document, $rootElement) {

    jqLite($document[0].body).append($rootElement);
    element = jqLite('<div></div>');
    $rootElement.append(element);
    element.addClass('red blue');

    var runner = $animate.removeClass(element, 'red');

    $rootScope.$digest();

    $animate.removeClass(element, 'blue');
    $animate.addClass(element, 'red');
    $rootScope.$digest();

    $$rAF.flush();

    expect(element).not.toHaveClass('blue');
    expect(element).toHaveClass('red');
  }));


  describe('CSS animations', function() {
    if (!browserSupportsCssAnimations()) return;

    it('should only create a single copy of the provided animation options',
      inject(function($rootScope, $rootElement, $animate) {

      ss.addRule('.animate-me', 'transition:2s linear all;');

      var element = jqLite('<div class="animate-me"></div>');
      html(element);

      var myOptions = {to: { 'color': 'red' }};

      var spy = spyOn(window, 'copy');
      expect(spy).not.toHaveBeenCalled();

      var animation = $animate.leave(element, myOptions);
      $rootScope.$digest();
      $animate.flush();

      expect(spy).toHaveBeenCalledOnce();
      dealoc(element);
    }));

    they('should render an $prop animation',
      ['enter', 'leave', 'move', 'addClass', 'removeClass', 'setClass'], function(event) {

      inject(function($animate, $compile, $rootScope, $rootElement) {
        element = jqLite('<div class="animate-me"></div>');
        $compile(element)($rootScope);

        var className = 'klass';
        var addClass, removeClass;
        var parent = jqLite('<div></div>');
        html(parent);

        var setupClass, activeClass;
        var args;
        var classRuleSuffix = '';

        switch (event) {
          case 'enter':
          case 'move':
            setupClass = 'ng-' + event;
            activeClass = 'ng-' + event + '-active';
            args = [element, parent];
            break;

          case 'leave':
            parent.append(element);
            setupClass = 'ng-' + event;
            activeClass = 'ng-' + event + '-active';
            args = [element];
            break;

          case 'addClass':
            parent.append(element);
            classRuleSuffix = '.add';
            setupClass = className + '-add';
            activeClass = className + '-add-active';
            addClass = className;
            args = [element, className];
            break;

          case 'removeClass':
            parent.append(element);
            setupClass = className + '-remove';
            activeClass = className + '-remove-active';
            element.addClass(className);
            args = [element, className];
            break;

          case 'setClass':
            parent.append(element);
            addClass = className;
            removeClass = 'removing-class';
            setupClass = addClass + '-add ' + removeClass + '-remove';
            activeClass = addClass + '-add-active ' + removeClass + '-remove-active';
            element.addClass(removeClass);
            args = [element, addClass, removeClass];
            break;
        }

        ss.addRule('.animate-me', 'transition:2s linear all;');

        var runner = $animate[event].apply($animate, args);
        $rootScope.$digest();

        var animationCompleted = false;
        runner.then(function() {
          animationCompleted = true;
        });

        expect(element).toHaveClass(setupClass);
        $animate.flush();
        expect(element).toHaveClass(activeClass);

        browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });
        $animate.flush();

        expect(element).not.toHaveClass(setupClass);
        expect(element).not.toHaveClass(activeClass);

        $rootScope.$digest();

        expect(animationCompleted).toBe(true);
      });
    });

    it('should not throw an error if the element is orphaned before the CSS animation starts',
      inject(function($rootScope, $rootElement, $animate) {

      ss.addRule('.animate-me', 'transition:2s linear all;');

      var parent = jqLite('<div></div>');
      html(parent);

      var element = jqLite('<div class="animate-me">DOING</div>');
      parent.append(element);

      $animate.addClass(parent, 'on');
      $animate.addClass(element, 'on');
      $rootScope.$digest();

      // this will run the first class-based animation
      $animate.flush();

      element.remove();

      expect(function() {
        $animate.flush();
      }).not.toThrow();

      dealoc(element);
    }));

    it('should include the added/removed classes in lieu of the enter animation',
      inject(function($animate, $compile, $rootScope, $rootElement, $document) {

      ss.addRule('.animate-me.ng-enter.on', 'transition:2s linear all;');

      element = jqLite('<div><div ng-if="exp" ng-class="{on:exp2}" class="animate-me"></div></div>');

      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $compile(element)($rootScope);

      $rootScope.exp = true;
      $rootScope.$digest();
      $animate.flush();

      var child = element.find('div');

      expect(child).not.toHaveClass('on');
      expect(child).not.toHaveClass('ng-enter');

      $rootScope.exp = false;
      $rootScope.$digest();

      $rootScope.exp = true;
      $rootScope.exp2 = true;
      $rootScope.$digest();

      child = element.find('div');

      expect(child).toHaveClass('on');
      expect(child).toHaveClass('ng-enter');

      $animate.flush();

      expect(child).toHaveClass('ng-enter-active');

      browserTrigger(child, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });
      $animate.flush();

      expect(child).not.toHaveClass('ng-enter-active');
      expect(child).not.toHaveClass('ng-enter');
    }));

    it('should animate ng-class and a structural animation in parallel on the same element',
      inject(function($animate, $compile, $rootScope, $rootElement, $document) {

      ss.addRule('.animate-me.ng-enter', 'transition:2s linear all;');
      ss.addRule('.animate-me.expand', 'transition:5s linear all; font-size:200px;');

      element = jqLite('<div><div ng-if="exp" ng-class="{expand:exp2}" class="animate-me"></div></div>');

      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $compile(element)($rootScope);

      $rootScope.exp = true;
      $rootScope.exp2 = true;
      $rootScope.$digest();

      var child = element.find('div');

      expect(child).toHaveClass('ng-enter');
      expect(child).toHaveClass('expand-add');
      expect(child).toHaveClass('expand');

      $animate.flush();

      expect(child).toHaveClass('ng-enter-active');
      expect(child).toHaveClass('expand-add-active');

      browserTrigger(child, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });
      $animate.flush();

      expect(child).not.toHaveClass('ng-enter-active');
      expect(child).not.toHaveClass('ng-enter');
      expect(child).not.toHaveClass('expand-add-active');
      expect(child).not.toHaveClass('expand-add');
    }));

    it('should issue a RAF for each element animation on all DOM levels', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $document, $$rAF) {
        element = jqLite(
          '<div ng-class="{parent:exp}">' +
            '<div ng-class="{parent2:exp}">' +
               '<div ng-repeat="item in items" ng-class="{fade:exp}">' +
                  '{{ item }}' +
               '</div>' +
            '</div>' +
          '</div>'
        );

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $compile(element)($rootScope);
        $rootScope.$digest();

        var outer = element;
        var inner = element.find('div');

        $rootScope.exp = true;
        $rootScope.items = [1,2,3,4,5,6,7,8,9,10];

        $rootScope.$digest();
        expect(outer).not.toHaveClass('parent');
        expect(inner).not.toHaveClass('parent2');

        assertTotalRepeats(0);

        $$rAF.flush();
        expect(outer).toHaveClass('parent');

        assertTotalRepeats(0);

        $$rAF.flush();
        expect(inner).toHaveClass('parent2');

        assertTotalRepeats(10);

        function assertTotalRepeats(total) {
          expect(inner[0].querySelectorAll('div.ng-enter').length).toBe(total);
        }
      });
    });

    it('should add the preparation class for an enter animation before a parent class-based animation is applied', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $document) {
        element = jqLite(
          '<div ng-class="{parent:exp}">' +
            '<div ng-if="exp">' +
            '</div>' +
          '</div>'
        );

        ss.addRule('.ng-enter', 'transition:2s linear all;');
        ss.addRule('.parent-add', 'transition:5s linear all;');

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $compile(element)($rootScope);
        $rootScope.exp = true;
        $rootScope.$digest();

        var parent = element;
        var child = element.find('div');

        expect(parent).not.toHaveClass('parent');
        expect(parent).toHaveClass('parent-add');
        expect(child).not.toHaveClass('ng-enter');
        expect(child).toHaveClass('ng-enter-prepare');

        $animate.flush();
        expect(parent).toHaveClass('parent parent-add parent-add-active');
        expect(child).toHaveClass('ng-enter ng-enter-active');
        expect(child).not.toHaveClass('ng-enter-prepare');
      });
    });


    it('should pack level elements into their own RAF flush', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $document) {
        ss.addRule('.inner', 'transition:2s linear all;');

        element = jqLite(
          '<div>' +
            '<div class="outer" ng-class="{on:exp}">' +
               '<div class="inner" ng-if="exp"></div>' +
            '</div>' +
            '<div class="outer" ng-class="{on:exp}">' +
               '<div class="inner" ng-if="exp"></div>' +
            '</div>' +
            '<div class="outer" ng-class="{on:exp}">' +
               '<div class="inner" ng-if="exp"></div>' +
            '</div>' +
            '<div class="outer" ng-class="{on:exp}"></div>' +
          '</div>'
        );

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);
        $compile(element)($rootScope);
        $rootScope.$digest();

        assertGroupHasClass(query('outer'), 'on', true);
        expect(query('inner').length).toBe(0);

        $rootScope.exp = true;
        $rootScope.$digest();

        assertGroupHasClass(query('outer'), 'on', true);
        assertGroupHasClass(query('inner'), 'ng-enter', true);

        $animate.flush();

        assertGroupHasClass(query('outer'), 'on');
        assertGroupHasClass(query('inner'), 'ng-enter');

        function query(className) {
          return element[0].querySelectorAll('.' + className);
        }

        function assertGroupHasClass(elms, className, not) {
          for (var i = 0; i < elms.length; i++) {
            var assert = expect(jqLite(elms[i]));
            (not ? assert.not : assert).toHaveClass(className);
          }
        }
      });
    });

    it('should trigger callbacks at the start and end of an animation',
      inject(function($rootScope, $rootElement, $animate, $compile) {

      ss.addRule('.animate-me', 'transition:2s linear all;');

      var parent = jqLite('<div><div ng-if="exp" class="animate-me"></div></div>');
      element = parent.find('div');
      html(parent);

      $compile(parent)($rootScope);
      $rootScope.$digest();

      var spy = jasmine.createSpy();
      $animate.on('enter', parent, spy);

      $rootScope.exp = true;
      $rootScope.$digest();

      element = parent.find('div');

      $animate.flush();

      expect(spy).toHaveBeenCalledTimes(1);

      browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });
      $animate.flush();

      expect(spy).toHaveBeenCalledTimes(2);

      dealoc(element);
    }));


    it('should remove a class when the same class is currently being added by a joined class-based animation',
      inject(function($animate, $animateCss, $rootScope, $document, $rootElement, $$rAF) {

      ss.addRule('.hide', 'opacity: 0');
      ss.addRule('.hide-add, .hide-remove', 'transition: 1s linear all');

      jqLite($document[0].body).append($rootElement);
      element = jqLite('<div></div>');
      $rootElement.append(element);

      // These animations will be joined together
      $animate.addClass(element, 'red');
      $animate.addClass(element, 'hide');
      $rootScope.$digest();

      expect(element).toHaveClass('red-add');
      expect(element).toHaveClass('hide-add');

      // When a digest has passed, but no $rAF has been issued yet, .hide hasn't been added to
      // the element yet
      $animate.removeClass(element, 'hide');
      $rootScope.$digest();
      $$rAF.flush();

      expect(element).not.toHaveClass('hide-add hide-add-active');
      expect(element).toHaveClass('hide-remove hide-remove-active');

      //End the animation process
      browserTrigger(element, 'transitionend',
        { timeStamp: Date.now() + 1000, elapsedTime: 2 });
      $animate.flush();

      expect(element).not.toHaveClass('hide-add-active red-add-active');
      expect(element).toHaveClass('red');
      expect(element).not.toHaveClass('hide');
    }));

    it('should handle ng-if & ng-class with a class that is removed before its add animation has concluded', function() {
      inject(function($animate, $rootScope, $compile, $timeout, $$rAF) {

        ss.addRule('.animate-me', 'transition: all 0.5s;');

        element = jqLite('<section><div ng-if="true" class="animate-me" ng-class="{' +
          'red: red,' +
          'blue: blue' +
          '}"></div></section>');

        html(element);
        $rootScope.blue = true;
        $rootScope.red = true;
        $compile(element)($rootScope);
        $rootScope.$digest();

        var child = element.find('div');

        // Trigger class removal before the add animation has been concluded
        $rootScope.blue = false;
        $animate.closeAndFlush();

        expect(child).toHaveClass('red');
        expect(child).not.toHaveClass('blue');
      });
    });
  });

  describe('JS animations', function() {
    they('should render an $prop animation',
      ['enter', 'leave', 'move', 'addClass', 'removeClass', 'setClass'], function(event) {

      var endAnimation;
      var animateCompleteCallbackFired = true;

      module(function($animateProvider) {
        $animateProvider.register('.animate-me', function() {
          var animateFactory = {};
          animateFactory[event] = function(element, addClass, removeClass, done) {
            endAnimation = arguments[arguments.length - 2]; // the done method is the 2nd last one
            return function(status) {
              animateCompleteCallbackFired = status === false;
            };
          };
          return animateFactory;
        });
      });

      inject(function($animate, $compile, $rootScope, $rootElement) {
        element = jqLite('<div class="animate-me"></div>');
        $compile(element)($rootScope);

        var className = 'klass';
        var addClass, removeClass;
        var parent = jqLite('<div></div>');
        html(parent);

        var args;
        switch (event) {
          case 'enter':
          case 'move':
            args = [element, parent];
            break;

          case 'leave':
            parent.append(element);
            args = [element];
            break;

          case 'addClass':
            parent.append(element);
            args = [element, className];
            break;

          case 'removeClass':
            parent.append(element);
            element.addClass(className);
            args = [element, className];
            break;

          case 'setClass':
            parent.append(element);
            addClass = className;
            removeClass = 'removing-class';
            element.addClass(removeClass);
            args = [element, addClass, removeClass];
            break;
        }

        var runner = $animate[event].apply($animate, args);
        var animationCompleted = false;
        runner.then(function() {
          animationCompleted = true;
        });

        $rootScope.$digest();

        expect(isFunction(endAnimation)).toBe(true);

        endAnimation();
        $animate.flush();
        expect(animateCompleteCallbackFired).toBe(true);

        $rootScope.$digest();
        expect(animationCompleted).toBe(true);
      });
    });

    they('should not wait for a parent\'s classes to resolve if a $prop is animation used for children',
      ['beforeAddClass', 'beforeRemoveClass', 'beforeSetClass'], function(phase) {

      var capturedChildClasses;
      var endParentAnimationFn;

      module(function($animateProvider) {
        $animateProvider.register('.parent-man', function() {
          var animateFactory = {};
          animateFactory[phase] = function(element, addClass, removeClass, done) {
            // this will wait until things are over
            endParentAnimationFn = done;
          };
          return animateFactory;
        });

        $animateProvider.register('.child-man', function() {
          return {
            enter: function(element, done) {
              capturedChildClasses = element.parent().attr('class');
              done();
            }
          };
        });
      });

      inject(function($animate, $compile, $rootScope, $rootElement) {
        element = jqLite('<div class="parent-man"></div>');
        var child = jqLite('<div class="child-man"></div>');

        html(element);
        $compile(element)($rootScope);

        $animate.enter(child, element);
        switch (phase) {
          case 'beforeAddClass':
            $animate.addClass(element, 'cool');
            break;

          case 'beforeSetClass':
            $animate.setClass(element, 'cool');
            break;

          case 'beforeRemoveClass':
            element.addClass('cool');
            $animate.removeClass(element, 'cool');
            break;
        }

        $rootScope.$digest();
        $animate.flush();

        expect(endParentAnimationFn).toBeTruthy();

        // the spaces are used so that ` cool ` can be matched instead
        // of just a substring like `cool-add`.
        var safeClassMatchString = ' ' + capturedChildClasses + ' ';
        if (phase === 'beforeRemoveClass') {
          expect(safeClassMatchString).toContain(' cool ');
        } else {
          expect(safeClassMatchString).not.toContain(' cool ');
        }
      });
    });

    they('should have the parent\'s classes already applied in time for the children if $prop is used',
      ['addClass', 'removeClass', 'setClass'], function(phase) {

      var capturedChildClasses;
      var endParentAnimationFn;

      module(function($animateProvider) {
        $animateProvider.register('.parent-man', function() {
          var animateFactory = {};
          animateFactory[phase] = function(element, addClass, removeClass, done) {
            // this will wait until things are over
            endParentAnimationFn = done;
          };
          return animateFactory;
        });

        $animateProvider.register('.child-man', function() {
          return {
            enter: function(element, done) {
              capturedChildClasses = element.parent().attr('class');
              done();
            }
          };
        });
      });

      inject(function($animate, $compile, $rootScope, $rootElement) {
        element = jqLite('<div class="parent-man"></div>');
        var child = jqLite('<div class="child-man"></div>');

        html(element);
        $compile(element)($rootScope);

        $animate.enter(child, element);
        switch (phase) {
          case 'addClass':
            $animate.addClass(element, 'cool');
            break;

          case 'setClass':
            $animate.setClass(element, 'cool');
            break;

          case 'removeClass':
            element.addClass('cool');
            $animate.removeClass(element, 'cool');
            break;
        }

        $rootScope.$digest();
        $animate.flush();

        expect(endParentAnimationFn).toBeTruthy();

        // the spaces are used so that ` cool ` can be matched instead
        // of just a substring like `cool-add`.
        var safeClassMatchString = ' ' + capturedChildClasses + ' ';
        if (phase === 'removeClass') {
          expect(safeClassMatchString).not.toContain(' cool ');
        } else {
          expect(safeClassMatchString).toContain(' cool ');
        }
      });
    });

    it('should not alter the provided options values in anyway throughout the animation', function() {
      var animationSpy = jasmine.createSpy();
      module(function($animateProvider) {
        $animateProvider.register('.this-animation', function() {
          return {
            enter: function(element, done) {
              animationSpy();
              done();
            }
          };
        });
      });

      inject(function($animate, $rootScope, $compile) {
        element = jqLite('<div class="parent-man"></div>');
        var child = jqLite('<div class="child-man one"></div>');

        var initialOptions = {
          from: { height: '50px' },
          to: { width: '100px' },
          addClass: 'one',
          removeClass: 'two',
          domOperation: undefined
        };

        var copiedOptions = copy(initialOptions);
        expect(copiedOptions).toEqual(initialOptions);

        html(element);
        $compile(element)($rootScope);

        $animate.enter(child, element, null, copiedOptions);
        $rootScope.$digest();
        expect(copiedOptions).toEqual(initialOptions);

        $animate.flush();
        expect(copiedOptions).toEqual(initialOptions);

        expect(child).toHaveClass('one');
        expect(child).not.toHaveClass('two');

        expect(child.attr('style')).toContain('100px');
        expect(child.attr('style')).toContain('50px');
      });
    });


    it('should execute the enter animation on a <form> with ngIf that has an ' +
      '<input type="email" required>', function() {

      var animationSpy = jasmine.createSpy();

      module(function($animateProvider) {
        $animateProvider.register('.animate-me', function() {
          return {
            enter: function(element, done) {
              animationSpy();
              done();
            }
          };
        });
      });

      inject(function($animate, $rootScope, $compile) {

        element = jqLite(
          '<div>' +
            '<form class="animate-me" ng-if="show">' +
              '<input ng-model="myModel" type="email" required />' +
            '</form>' +
          '</div>');

        html(element);

        $compile(element)($rootScope);

        $rootScope.show = true;
        $rootScope.$digest();

        $animate.flush();
        expect(animationSpy).toHaveBeenCalled();
      });
    });
  });
});
