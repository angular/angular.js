'use strict';

describe('ngAnimate integration tests', function() {

  beforeEach(module('ngAnimate'));

  var element, html, ss;
  beforeEach(module(function() {
    return function($rootElement, $document, $$body, $window, $animate) {
      $animate.enabled(true);

      ss = createMockStyleSheet($document, $window);

      var body = $$body;
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

  describe('CSS animations', function() {
    if (!browserSupportsCssAnimations()) return;

    they('should render an $prop animation',
      ['enter', 'leave', 'move', 'addClass', 'removeClass', 'setClass'], function(event) {

      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF) {
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
        $$rAF.flush();
        expect(element).toHaveClass(activeClass);

        browserTrigger(element, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });

        expect(element).not.toHaveClass(setupClass);
        expect(element).not.toHaveClass(activeClass);

        $rootScope.$digest();

        expect(animationCompleted).toBe(true);
      });
    });

    it('should not throw an error if the element is orphaned before the CSS animation starts',
      inject(function($rootScope, $rootElement, $animate, $$rAF) {

      ss.addRule('.animate-me', 'transition:2s linear all;');

      var parent = jqLite('<div></div>');
      html(parent);

      var element = jqLite('<div class="animate-me">DOING</div>');
      parent.append(element);

      $animate.addClass(parent, 'on');
      $animate.addClass(element, 'on');
      $rootScope.$digest();

      // this will run the first class-based animation
      $$rAF.flush();

      element.remove();

      expect(function() {
        $$rAF.flush();
      }).not.toThrow();

      dealoc(element);
    }));

    it('should always synchronously add css classes in order for child animations to animate properly',
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {

      ss.addRule('.animations-enabled .animate-me.ng-enter', 'transition:2s linear all;');

      element = jqLite('<div ng-class="{\'animations-enabled\':exp}"></div>');
      var child = jqLite('<div ng-if="exp" class="animate-me"></div>');

      element.append(child);
      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $compile(element)($rootScope);

      $rootScope.exp = true;
      $rootScope.$digest();

      child = element.find('div');

      expect(element).toHaveClass('animations-enabled');
      expect(child).toHaveClass('ng-enter');

      $$rAF.flush();

      expect(child).toHaveClass('ng-enter-active');

      browserTrigger(child, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });

      expect(child).not.toHaveClass('ng-enter-active');
      expect(child).not.toHaveClass('ng-enter');
    }));

    it('should synchronously add/remove ng-class expressions in time for other animations to run on the same element',
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {

      ss.addRule('.animate-me.ng-enter.on', 'transition:2s linear all;');

      element = jqLite('<div><div ng-if="exp" ng-class="{on:exp2}" class="animate-me"></div></div>');

      $rootElement.append(element);
      jqLite($document[0].body).append($rootElement);

      $compile(element)($rootScope);

      $rootScope.exp = true;
      $rootScope.$digest();
      $$rAF.flush();

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

      $$rAF.flush();

      expect(child).toHaveClass('ng-enter-active');

      browserTrigger(child, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });

      expect(child).not.toHaveClass('ng-enter-active');
      expect(child).not.toHaveClass('ng-enter');
    }));

    it('should animate ng-class and a structural animation in parallel on the same element',
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {

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

      $$rAF.flush();

      expect(child).toHaveClass('ng-enter-active');
      expect(child).toHaveClass('expand-add-active');

      browserTrigger(child, 'transitionend', { timeStamp: Date.now(), elapsedTime: 2 });

      expect(child).not.toHaveClass('ng-enter-active');
      expect(child).not.toHaveClass('ng-enter');
      expect(child).not.toHaveClass('expand-add-active');
      expect(child).not.toHaveClass('expand-add');
    }));

    it('should only issue a reflow for each parent CSS class change that contains ready-to-fire child animations', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {
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
        expect($animate.reflows).toBe(0);

        $rootScope.exp = true;
        $rootScope.items = [1,2,3,4,5,6,7,8,9,10];

        $rootScope.$digest();
        expect($animate.reflows).toBe(2);
      });
    });

    it('should issue a reflow for each parent class-based animation that contains active child animations', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {
        element = jqLite(
          '<div ng-class="{one:exp}">' +
             '<div ng-if="exp"></div>' +
          '</div>' +
          '<div ng-class="{two:exp}">' +
             '<div ng-if="exp"></div>' +
          '</div>' +
          '<div ng-class="{three:exp}">' +
             '<div ng-if="false"></div>' +
          '</div>' +
          '<div ng-class="{four:exp}"></div>'
        );

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $compile(element)($rootScope);
        $rootScope.$digest();
        expect($animate.reflows).toBe(0);

        $rootScope.exp = true;
        $rootScope.$digest();
        expect($animate.reflows).toBe(2);
      });
    });

    it('should only issue one reflow for class-based animations if none of them have children with queued animations', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {
        element = jqLite(
          '<div ng-class="{one:exp}">' +
             '<div ng-if="exp2"></div>' +
          '</div>' +
          '<div ng-class="{two:exp}">' +
             '<div ng-if="exp2"></div>' +
          '</div>' +
          '<div ng-class="{three:exp}"></div>'
        );

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $compile(element)($rootScope);
        $rootScope.$digest();
        expect($animate.reflows).toBe(0);

        $rootScope.exp = true;
        $rootScope.$digest();
        expect($animate.reflows).toBe(1);

        $rootScope.exp2 = true;
        $rootScope.$digest();
        expect($animate.reflows).toBe(2);
      });
    });

    it('should always issue atleast one reflow incase there are no parent class-based animations', function() {
      module('ngAnimateMock');
      inject(function($animate, $compile, $rootScope, $rootElement, $$rAF, $document) {
        element = jqLite(
          '<div ng-repeat="item in items" ng-class="{someAnimation:exp}">' +
            '{{ item }}' +
          '</div>'
        );

        $rootElement.append(element);
        jqLite($document[0].body).append($rootElement);

        $compile(element)($rootScope);
        $rootScope.$digest();
        expect($animate.reflows).toBe(0);

        $rootScope.exp = true;
        $rootScope.items = [1,2,3,4,5,6,7,8,9,10];
        $rootScope.$digest();

        expect($animate.reflows).toBe(1);
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
        $$rAF.flush();
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
  });
});
