'use strict';

describe('ngAnimate integration tests', function() {

  beforeEach(module('ngAnimate'));

  var html, ss;
  beforeEach(module(function() {
    return function($rootElement, $document, $window, $animate) {
      $animate.enabled(true);

      ss = createMockStyleSheet($document, $window);

      var body = jqLite($document[0].body);
      html = function(element) {
        body.append($rootElement);
        $rootElement.append(element);
      };
    };
  }));

  describe('CSS animations', function() {
    if (!browserSupportsCssAnimations()) return;

    they('should render an $prop animation',
      ['enter', 'leave', 'move', 'addClass', 'removeClass', 'setClass'], function(event) {

      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF) {
        var element = jqLite('<div class="animate-me"></div>');
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
        $$rAF.flush();
        expect(element).toHaveClass(activeClass);

        browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });

        expect(element).not.toHaveClass(setupClass);
        expect(element).not.toHaveClass(activeClass);

        $rootScope.$digest();

        expect(animationCompleted).toBe(true);
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

      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF) {
        var element = jqLite('<div class="animate-me"></div>');
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
        $$rAF.flush();
        expect(animateCompleteCallbackFired).toBe(true);

        $rootScope.$digest();
        expect(animationCompleted).toBe(true);
      });
    });
  });
});
