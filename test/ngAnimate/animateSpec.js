'use strict';

describe('animations', function() {

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  var element, applyAnimationClasses;

  beforeEach(module(function() {
    return function($$jqLite) {
      applyAnimationClasses = applyAnimationClassesFactory($$jqLite);
    };
  }));

  afterEach(inject(function() {
    dealoc(element);
  }));


  it('should allow animations if the application is bootstrapped on the document node', function() {
    var capturedAnimation;

    module(function($provide) {
      $provide.factory('$rootElement', function($document) {
        return $document;
      });
      $provide.factory('$$animation', function($$AnimateRunner) {
        return function() {
          capturedAnimation = arguments;
          return new $$AnimateRunner();
        };
      });
    });

    inject(function($animate, $rootScope, $document) {
      $animate.enabled(true);

      element = jqLite('<div></div>');

      $animate.enter(element, jqLite($document[0].body));
      $rootScope.$digest();

      expect(capturedAnimation).toBeTruthy();
    });
  });

  describe('during bootstrap', function() {
    it('should be enabled only after the first digest is fired and the postDigest queue is empty',
      inject(function($animate, $rootScope) {

      var capturedEnabledState;
      $rootScope.$$postDigest(function() {
        capturedEnabledState = $animate.enabled();
      });

      expect($animate.enabled()).toBe(false);
      $rootScope.$digest();

      expect(capturedEnabledState).toBe(false);
      expect($animate.enabled()).toBe(true);
    }));

    it('should be disabled until all pending template requests have been downloaded', function() {
      var mockTemplateRequest = {
        totalPendingRequests: 2
      };

      module(function($provide) {
        $provide.value('$templateRequest', mockTemplateRequest);
      });
      inject(function($animate, $rootScope) {
        expect($animate.enabled()).toBe(false);

        $rootScope.$digest();
        expect($animate.enabled()).toBe(false);

        mockTemplateRequest.totalPendingRequests = 0;
        $rootScope.$digest();
        expect($animate.enabled()).toBe(true);
      });
    });

    it('should stay disabled if set to be disabled even after all templates have been fully downloaded', function() {
      var mockTemplateRequest = {
        totalPendingRequests: 2
      };

      module(function($provide) {
        $provide.value('$templateRequest', mockTemplateRequest);
      });
      inject(function($animate, $rootScope) {
        $animate.enabled(false);
        expect($animate.enabled()).toBe(false);

        $rootScope.$digest();
        expect($animate.enabled()).toBe(false);

        mockTemplateRequest.totalPendingRequests = 0;
        $rootScope.$digest();
        expect($animate.enabled()).toBe(false);
      });
    });
  });

  describe('$animate', function() {
    var parent;
    var parent2;
    var options;
    var capturedAnimation;
    var capturedAnimationHistory;
    var overriddenAnimationRunner;
    var defaultFakeAnimationRunner;

    beforeEach(module(function($provide) {
      overriddenAnimationRunner = null;
      capturedAnimation = null;
      capturedAnimationHistory = [];

      options = {};
      $provide.value('$$animation', function() {
        capturedAnimationHistory.push(capturedAnimation = arguments);
        return overriddenAnimationRunner || defaultFakeAnimationRunner;
      });

      return function($rootElement, $q, $animate, $$AnimateRunner, $document) {
        defaultFakeAnimationRunner = new $$AnimateRunner();
        $animate.enabled(true);

        element = jqLite('<div class="element">element</div>');
        parent = jqLite('<div class="parent1">parent</div>');
        parent2 = jqLite('<div class="parent2">parent</div>');

        $rootElement.append(parent);
        $rootElement.append(parent2);
        jqLite($document[0].body).append($rootElement);
      };
    }));

    it('should not alter the provided options input in any way throughout the animation', inject(function($animate, $rootScope) {
      var initialOptions = {
        from: { height: '50px' },
        to: { width: '50px' },
        addClass: 'one',
        removeClass: 'two',
        domOperation: undefined
      };

      var copiedOptions = copy(initialOptions);
      expect(copiedOptions).toEqual(initialOptions);

      var runner = $animate.enter(element, parent, null, copiedOptions);
      expect(copiedOptions).toEqual(initialOptions);

      $rootScope.$digest();
      expect(copiedOptions).toEqual(initialOptions);
    }));

    it('should skip animations entirely if the document is hidden', function() {
      var hidden = true;

      module(function($provide) {
        $provide.value('$$isDocumentHidden', function() {
          return hidden;
        });
      });

      inject(function($animate, $rootScope) {
        $animate.enter(element, parent);
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
        expect(element[0].parentNode).toEqual(parent[0]);

        hidden = false;

        $animate.leave(element);
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      });
    });

    it('should animate only the specified CSS className matched within $animateProvider.classNameFilter for div', function() {
      module(function($animateProvider) {
        $animateProvider.classNameFilter(/only-allow-this-animation/);
      });
      inject(function($animate, $rootScope) {
        expect(element).not.toHaveClass('only-allow-this-animation');

        $animate.enter(element, parent);
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        element.addClass('only-allow-this-animation');

        $animate.leave(element, parent);
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      });
    });

    it('should animate only the specified CSS className matched within $animateProvider.classNameFilter for svg', function() {
      module(function($animateProvider) {
        $animateProvider.classNameFilter(/only-allow-this-animation-svg/);
      });
      inject(function($animate, $rootScope, $compile) {
        var svgElement = $compile('<svg class="element"></svg>')($rootScope);
        expect(svgElement).not.toHaveClass('only-allow-this-animation-svg');

        $animate.enter(svgElement, parent);
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        svgElement.attr('class', 'element only-allow-this-animation-svg');

        $animate.leave(svgElement, parent);
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      });
    });

    they('should not apply the provided options.$prop value unless it\'s a string or string-based array', ['addClass', 'removeClass'], function(prop) {
      inject(function($animate, $rootScope) {
        var startingCssClasses = element.attr('class') || '';

        var options1 = {};
        options1[prop] = function() {};
        $animate.enter(element, parent, null, options1);

        expect(element.attr('class')).toEqual(startingCssClasses);

        $rootScope.$digest();

        var options2 = {};
        options2[prop] = true;
        $animate.leave(element, options2);

        expect(element.attr('class')).toEqual(startingCssClasses);

        $rootScope.$digest();

        capturedAnimation = null;

        var options3 = {};
        if (prop === 'removeClass') {
          element.addClass('fatias');
          startingCssClasses = element.attr('class');
        }

        options3[prop] = ['fatias'];
        $animate.enter(element, parent, null, options3);

        $rootScope.$digest();

        expect(element.attr('class')).not.toEqual(startingCssClasses);
      });
    });

    it('should throw a minErr if a regex value is used which partially contains or fully matches the `ng-animate` CSS class', function() {
      module(function($animateProvider) {
        assertError(/ng-animate/, true);
        assertError(/first ng-animate last/, true);
        assertError(/ng-animate-special/, false);
        assertError(/first ng-animate-special last/, false);
        assertError(/first ng-animate ng-animate-special last/, true);

        function assertError(regex, bool) {
          var expectation = expect(function() {
            $animateProvider.classNameFilter(regex);
          });

          var message = '$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "ng-animate" CSS class.';

          if (bool) {
            expectation.toThrowMinErr('$animate', 'nongcls', message);
          } else {
            expectation.not.toThrowMinErr('$animate', 'nongcls', message);
          }
        }
      });
    });

    it('should complete the leave DOM operation in case the classNameFilter fails', function() {
      module(function($animateProvider) {
        $animateProvider.classNameFilter(/memorable-animation/);
      });
      inject(function($animate, $rootScope) {
        expect(element).not.toHaveClass('memorable-animation');

        parent.append(element);
        $animate.leave(element);
        $rootScope.$digest();

        expect(capturedAnimation).toBeFalsy();
        expect(element[0].parentNode).toBeFalsy();
      });
    });

    describe('enabled()', function() {
      it('should work for all animations', inject(function($animate) {

        expect($animate.enabled()).toBe(true);

        expect($animate.enabled(0)).toBe(false);
        expect($animate.enabled()).toBe(false);

        expect($animate.enabled(1)).toBe(true);
        expect($animate.enabled()).toBe(true);
      }));

      it('should fully disable all animations in the application if false',
        inject(function($animate, $rootScope) {

        $animate.enabled(false);

        $animate.enter(element, parent);

        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('should disable all animations on the given element',
        inject(function($animate, $rootScope) {

        parent.append(element);

        $animate.enabled(element, false);
        expect($animate.enabled(element)).toBeFalsy();

        $animate.addClass(element, 'red');
        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        $animate.enabled(element, true);
        expect($animate.enabled(element)).toBeTruthy();

        $animate.addClass(element, 'blue');
        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      }));

      it('should disable all animations for a given element\'s children',
        inject(function($animate, $rootScope) {

        $animate.enabled(parent, false);

        $animate.enter(element, parent);
        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        $animate.enabled(parent, true);

        $animate.enter(element, parent);
        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      }));

      it('should run animations on an element and its children if explicitly enabled, even if animations are disabled on the parent',
        inject(function($animate, $rootScope) {

        var child = jqLite('<div></div>');
        element.append(child);
        parent.append(element);

        $animate.enabled(parent, false);

        $animate.addClass(element, 'red');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        $animate.addClass(child, 'red');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        $animate.enabled(element, true);

        $animate.addClass(element, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
        capturedAnimation = null;

        $animate.addClass(child, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      }));
    });

    it('should strip all comment nodes from the animation and not issue an animation if not real elements are found',
      inject(function($rootScope, $compile) {

      // since the ng-if results to false then only comments will be fed into the animation
      element = $compile(
        '<div><div class="animated" ng-if="false" ng-repeat="item in items"></div></div>'
      )($rootScope);

      parent.append(element);

      $rootScope.items = [1,2,3,4,5];
      $rootScope.$digest();

      expect(capturedAnimation).toBeFalsy();
    }));

    it('should not attempt to perform an animation on a text node element',
      inject(function($rootScope, $animate) {

      element.html('hello there');
      var textNode = jqLite(element[0].firstChild);

      $animate.addClass(textNode, 'some-class');
      $rootScope.$digest();

      expect(capturedAnimation).toBeFalsy();
    }));

    it('should not attempt to perform an animation on an empty jqLite collection',
      inject(function($rootScope, $animate) {

        element.html('');
        var emptyNode = jqLite(element[0].firstChild);

        $animate.addClass(emptyNode, 'some-class');
        $rootScope.$digest();

        expect(capturedAnimation).toBeFalsy();
      })
    );

    it('should perform the leave domOperation if a text node is used',
      inject(function($rootScope, $animate) {

      element.html('hello there');
      var textNode = jqLite(element[0].firstChild);
      var parentNode = textNode[0].parentNode;

      $animate.leave(textNode);
      $rootScope.$digest();
      expect(capturedAnimation).toBeFalsy();
      expect(textNode[0].parentNode).not.toBe(parentNode);
    }));

    it('should perform the leave domOperation if a comment node is used',
      inject(function($rootScope, $animate, $document) {

      var doc = $document[0];

      element.html('hello there');
      var commentNode = jqLite(doc.createComment('test comment'));
      var parentNode = element[0];
      parentNode.appendChild(commentNode[0]);

      $animate.leave(commentNode);
      $rootScope.$digest();
      expect(capturedAnimation).toBeFalsy();
      expect(commentNode[0].parentNode).not.toBe(parentNode);
    }));

    it('enter() should issue an enter animation and fire the DOM operation right away before the animation kicks off', inject(function($animate, $rootScope) {
      expect(parent.children().length).toBe(0);

      options.foo = 'bar';
      $animate.enter(element, parent, null, options);

      expect(parent.children().length).toBe(1);

      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(element);
      expect(capturedAnimation[1]).toBe('enter');
      expect(capturedAnimation[2].foo).toEqual(options.foo);
    }));

    it('move() should issue an enter animation and fire the DOM operation right away before the animation kicks off', inject(function($animate, $rootScope) {
      parent.append(element);

      expect(parent.children().length).toBe(1);
      expect(parent2.children().length).toBe(0);

      options.foo = 'bar';
      $animate.move(element, parent2, null, options);

      expect(parent.children().length).toBe(0);
      expect(parent2.children().length).toBe(1);

      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(element);
      expect(capturedAnimation[1]).toBe('move');
      expect(capturedAnimation[2].foo).toEqual(options.foo);
    }));

    they('$prop() should insert the element adjacent to the after element if provided',
      ['enter', 'move'], function(event) {

      inject(function($animate, $rootScope) {
        parent.append(element);
        assertCompareNodes(parent2.next(), element, true);
        $animate[event](element, null, parent2, options);
        assertCompareNodes(parent2.next(), element);
        $rootScope.$digest();
        expect(capturedAnimation[1]).toBe(event);
      });
    });

    they('$prop() should append to the parent incase the after element is destroyed before the DOM operation is issued',
      ['enter', 'move'], function(event) {
      inject(function($animate, $rootScope) {
        parent2.remove();
        $animate[event](element, parent, parent2, options);
        expect(parent2.next()).not.toEqual(element);
        $rootScope.$digest();
        expect(capturedAnimation[1]).toBe(event);
      });
    });

    it('leave() should issue a leave animation with the correct DOM operation', inject(function($animate, $rootScope) {
      parent.append(element);
      options.foo = 'bar';
      $animate.leave(element, options);
      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(element);
      expect(capturedAnimation[1]).toBe('leave');
      expect(capturedAnimation[2].foo).toEqual(options.foo);

      expect(element.parent().length).toBe(1);
      capturedAnimation[2].domOperation();
      expect(element.parent().length).toBe(0);
    }));

    it('should remove all element and comment nodes during leave animation',
      inject(function($compile, $rootScope, $animate, $$AnimateRunner) {

      element = $compile(
        '<div>' +
        '  <div class="animated" ng-repeat-start="item in items">start</div>' +
        '  <div ng-repeat-end>end</div>' +
        '</div>'
      )($rootScope);

      parent.append(element);

      $rootScope.items = [1,2,3,4,5];
      $rootScope.$digest();

      // all the start/end repeat anchors + their adjacent comments
      expect(element[0].childNodes.length).toBe(22);

      var runner = new $$AnimateRunner();
      overriddenAnimationRunner = runner;

      $rootScope.items.length = 0;
      $rootScope.$digest();
      runner.end();
      $animate.flush();

      // we're left with a text node and a comment node
      expect(element[0].childNodes.length).toBeLessThan(3);
    }));


    it('addClass() should issue an addClass animation with the correct DOM operation', inject(function($animate, $rootScope) {
      parent.append(element);
      options.foo = 'bar';
      $animate.addClass(element, 'red', options);
      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(element);
      expect(capturedAnimation[1]).toBe('addClass');
      expect(capturedAnimation[2].foo).toEqual(options.foo);

      expect(element).not.toHaveClass('red');
      applyAnimationClasses(element, capturedAnimation[2]);
      expect(element).toHaveClass('red');
    }));

    it('removeClass() should issue a removeClass animation with the correct DOM operation', inject(function($animate, $rootScope) {
      parent.append(element);
      element.addClass('blue');

      options.foo = 'bar';
      $animate.removeClass(element, 'blue', options);
      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(element);
      expect(capturedAnimation[1]).toBe('removeClass');
      expect(capturedAnimation[2].foo).toEqual(options.foo);

      expect(element).toHaveClass('blue');
      applyAnimationClasses(element, capturedAnimation[2]);
      expect(element).not.toHaveClass('blue');
    }));

    it('setClass() should issue a setClass animation with the correct DOM operation', inject(function($animate, $rootScope) {
      parent.append(element);
      element.addClass('green');

      options.foo = 'bar';
      $animate.setClass(element, 'yellow', 'green', options);
      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(element);
      expect(capturedAnimation[1]).toBe('setClass');
      expect(capturedAnimation[2].foo).toEqual(options.foo);

      expect(element).not.toHaveClass('yellow');
      expect(element).toHaveClass('green');
      applyAnimationClasses(element, capturedAnimation[2]);
      expect(element).toHaveClass('yellow');
      expect(element).not.toHaveClass('green');
    }));

    they('$prop() should operate using a native DOM element',
      ['enter', 'move', 'leave', 'addClass', 'removeClass', 'setClass', 'animate'], function(event) {

      inject(function($animate, $rootScope, $document) {
        var element = $document[0].createElement('div');
        element.setAttribute('id', 'crazy-man');
        if (event !== 'enter' && event !== 'move') {
          parent.append(element);
        }

        switch (event) {
          case 'enter':
          case 'move':
            $animate[event](element, parent, parent2, options);
            break;

          case 'addClass':
            $animate.addClass(element, 'klass', options);
            break;

          case 'removeClass':
            element.className = 'klass';
            $animate.removeClass(element, 'klass', options);
            break;

          case 'setClass':
            element.className = 'two';
            $animate.setClass(element, 'one', 'two', options);
            break;

          case 'leave':
            $animate.leave(element, options);
            break;

          case 'animate':
            var toStyles = { color: 'red' };
            $animate.animate(element, {}, toStyles, 'klass', options);
            break;
        }

        $rootScope.$digest();
        expect(capturedAnimation[0].attr('id')).toEqual(element.getAttribute('id'));
      });
    });

    describe('addClass / removeClass', function() {
      it('should not perform an animation if there are no valid CSS classes to add',
        inject(function($animate, $rootScope) {

        parent.append(element);

        $animate.removeClass(element, 'something-to-remove');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        element.addClass('something-to-add');

        $animate.addClass(element, 'something-to-add');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));
    });

    describe('animate()', function() {
      they('should not perform an animation if $prop is provided as a `to` style',
        { '{}': {},
          'null': null,
          'false': false,
          '""': '',
          '[]': [] }, function(toStyle) {

        inject(function($animate, $rootScope) {
          parent.append(element);
          $animate.animate(element, null, toStyle);
          $rootScope.$digest();
          expect(capturedAnimation).toBeFalsy();
        });
      });

      it('should not perform an animation if only from styles are provided',
        inject(function($animate, $rootScope) {

        var fromStyle = { color: 'pink' };
        parent.append(element);
        $animate.animate(element, fromStyle);
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('should perform an animation if only from styles are provided as well as any valid classes',
        inject(function($animate, $rootScope) {

        parent.append(element);

        var fromStyle = { color: 'red' };
        var options = { removeClass: 'goop' };
        $animate.animate(element, fromStyle, null, null, options);
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        fromStyle = { color: 'blue' };
        options = { addClass: 'goop' };
        $animate.animate(element, fromStyle, null, null, options);
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
      }));
    });

    describe('parent animations', function() {
      they('should not cancel a pre-digest parent class-based animation if a child $prop animation is set to run',
        ['structural', 'class-based'], function(animationType) {

        inject(function($rootScope, $animate) {
          parent.append(element);
          var child = jqLite('<div></div>');

          if (animationType === 'structural') {
            $animate.enter(child, element);
          } else {
            element.append(child);
            $animate.addClass(child, 'test');
          }

          $animate.addClass(parent, 'abc');
          expect(capturedAnimationHistory.length).toBe(0);
          $rootScope.$digest();
          expect(capturedAnimationHistory.length).toBe(2);
        });
      });

      they('should not cancel a post-digest parent class-based animation if a child $prop animation is set to run',
        ['structural', 'class-based'], function(animationType) {

        inject(function($rootScope, $animate) {
          parent.append(element);
          var child = jqLite('<div></div>');

          $animate.addClass(parent, 'abc');
          $rootScope.$digest();

          if (animationType === 'structural') {
            $animate.enter(child, element);
          } else {
            element.append(child);
            $animate.addClass(child, 'test');
          }

          expect(capturedAnimationHistory.length).toBe(1);

          $rootScope.$digest();

          expect(capturedAnimationHistory.length).toBe(2);
        });
      });

      they('should not cancel a post-digest $prop child animation if a class-based parent animation is set to run',
        ['structural', 'class-based'], function(animationType) {

        inject(function($rootScope, $animate) {
          parent.append(element);

          var child = jqLite('<div></div>');
          if (animationType === 'structural') {
            $animate.enter(child, element);
          } else {
            element.append(child);
            $animate.addClass(child, 'test');
          }

          $rootScope.$digest();

          $animate.addClass(parent, 'abc');

          expect(capturedAnimationHistory.length).toBe(1);
          $rootScope.$digest();

          expect(capturedAnimationHistory.length).toBe(2);
        });
      });
    });

    it('should NOT clobber all data on an element when animation is finished',
      inject(function($animate, $rootScope) {

      element.data('foo', 'bar');

      $animate.removeClass(element, 'ng-hide');
      $rootScope.$digest();
      $animate.addClass(element, 'ng-hide');
      $rootScope.$digest();

      expect(element.data('foo')).toEqual('bar');
    }));

    describe('child animations', function() {
      it('should skip animations if the element is not attached to the $rootElement',
        inject(function($compile, $rootScope, $animate) {

        $animate.enabled(true);

        var elm1 = $compile('<div class="animated"></div>')($rootScope);

        expect(capturedAnimation).toBeFalsy();
        $animate.addClass(elm1, 'klass2');
        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('should skip animations if the element is attached to the $rootElement, but not apart of the body',
        inject(function($compile, $rootScope, $animate, $rootElement) {

        $animate.enabled(true);

        var elm1 = $compile('<div class="animated"></div>')($rootScope);

        var newParent = $compile('<div></div>')($rootScope);
        newParent.append($rootElement);
        $rootElement.append(elm1);

        expect(capturedAnimation).toBeFalsy();
        $animate.addClass(elm1, 'klass2');
        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('should skip the animation if the element is removed from the DOM before the post digest kicks in',
        inject(function($animate, $rootScope) {

        $animate.enter(element, parent);
        expect(capturedAnimation).toBeFalsy();

        element.remove();
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('should be blocked when there is an ongoing structural parent animation occurring',
        inject(function($rootScope, $rootElement, $animate) {

        parent.append(element);

        expect(capturedAnimation).toBeFalsy();
        $animate.move(parent, parent2);
        $rootScope.$digest();

        // yes the animation is going on
        expect(capturedAnimation[0]).toBe(parent);
        capturedAnimation = null;

        $animate.addClass(element, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('should disable all child animations for atleast one turn when a structural animation is issued',
        inject(function($animate, $rootScope, $compile, $document, $rootElement, $$AnimateRunner) {

        element = $compile(
          '<div><div class="if-animation" ng-if="items.length">' +
          '  <div class="repeat-animation" ng-repeat="item in items">' +
          '    {{ item }}' +
          '  </div>' +
          '</div></div>'
        )($rootScope);

        jqLite($document[0].body).append($rootElement);
        $rootElement.append(element);

        var runner = new $$AnimateRunner();
        overriddenAnimationRunner = runner;

        $rootScope.items = [1];
        $rootScope.$digest();

        expect(capturedAnimation[0]).toHaveClass('if-animation');
        expect(capturedAnimationHistory.length).toBe(1);
        expect(element[0].querySelectorAll('.repeat-animation').length).toBe(1);

        $rootScope.items = [1, 2];
        $rootScope.$digest();

        expect(capturedAnimation[0]).toHaveClass('if-animation');
        expect(capturedAnimationHistory.length).toBe(1);
        expect(element[0].querySelectorAll('.repeat-animation').length).toBe(2);

        runner.end();
        $animate.flush();

        $rootScope.items = [1, 2, 3];
        $rootScope.$digest();

        expect(capturedAnimation[0]).toHaveClass('repeat-animation');
        expect(capturedAnimationHistory.length).toBe(2);
        expect(element[0].querySelectorAll('.repeat-animation').length).toBe(3);
      }));

      it('should not be blocked when there is an ongoing class-based parent animation occurring',
        inject(function($rootScope, $rootElement, $animate) {

        parent.append(element);

        expect(capturedAnimation).toBeFalsy();
        $animate.addClass(parent, 'rogers');
        $rootScope.$digest();

        // yes the animation is going on
        expect(capturedAnimation[0]).toBe(parent);
        capturedAnimation = null;

        $animate.addClass(element, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation[0]).toBe(element);
      }));

      describe('when a parent structural animation is triggered:', function() {

        it('should skip all pre-digest queued child animations',
          inject(function($rootScope, $rootElement, $animate) {

          parent.append(element);

          $animate.addClass(element, 'rumlow');
          $animate.move(parent, null, parent2);

          expect(capturedAnimation).toBeFalsy();
          expect(capturedAnimationHistory.length).toBe(0);
          $rootScope.$digest();

          expect(capturedAnimation[0]).toBe(parent);
          expect(capturedAnimationHistory.length).toBe(1);
        }));

        it('should end all ongoing post-digest child animations',
          inject(function($rootScope, $rootElement, $animate) {

          parent.append(element);

          $animate.addClass(element, 'rumlow');
          var isCancelled = false;
          overriddenAnimationRunner = extend(defaultFakeAnimationRunner, {
            end: function() {
              isCancelled = true;
            }
          });

          $rootScope.$digest();
          expect(capturedAnimation[0]).toBe(element);
          expect(isCancelled).toBe(false);

          // restore the default
          overriddenAnimationRunner = defaultFakeAnimationRunner;
          $animate.move(parent, null, parent2);
          $rootScope.$digest();
          expect(capturedAnimation[0]).toBe(parent);

          expect(isCancelled).toBe(true);
        }));

        it('should ignore children that have animation data-attributes but no animation data',
          inject(function($rootScope, $rootElement, $animate) {

          parent.append(element);

          $animate.addClass(element, 'rumlow');

          $rootScope.$digest();
          expect(capturedAnimation[0]).toBe(element);

          // If an element is cloned during an animation, the clone has the data-attributes indicating
          // an animation
          var clone = element.clone();
          parent.append(clone);

          $animate.move(parent, null, parent2);
          $rootScope.$digest();
          expect(capturedAnimation[0]).toBe(parent);
        }));
      });

      it('should not end any child animations if a parent class-based animation is issued',
        inject(function($rootScope, $rootElement, $animate) {

        parent.append(element);

        var element2 = jqLite('<div>element2</div>');
        $animate.enter(element2, parent);

        var isCancelled = false;
        overriddenAnimationRunner = extend(defaultFakeAnimationRunner, {
          end: function() {
            isCancelled = true;
          }
        });

        $rootScope.$digest();
        expect(capturedAnimation[0]).toBe(element2);
        expect(isCancelled).toBe(false);

        // restore the default
        overriddenAnimationRunner = defaultFakeAnimationRunner;
        $animate.addClass(parent, 'peter');
        $rootScope.$digest();
        expect(capturedAnimation[0]).toBe(parent);

        expect(isCancelled).toBe(false);
      }));

      it('should allow follow-up class-based animations to run in parallel on the same element',
        inject(function($rootScope, $animate) {

        parent.append(element);

        var runner1done = false;
        var runner1 = $animate.addClass(element, 'red');
        runner1.done(function() {
          runner1done = true;
        });

        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
        expect(runner1done).toBeFalsy();

        capturedAnimation = null;

        // make sure it's a different runner
        overriddenAnimationRunner = extend(defaultFakeAnimationRunner, {
          end: function() {
            // this code will still end the animation, just not at any deeper level
          }
        });

        var runner2done = false;
        var runner2 = $animate.addClass(element, 'blue');
        runner2.done(function() {
          runner2done = true;
        });

        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
        expect(runner2done).toBeFalsy();

        expect(runner1done).toBeFalsy();

        runner2.end();

        expect(runner2done).toBeTruthy();
        expect(runner1done).toBeFalsy();
      }));

      it('should remove the animation block on child animations once the parent animation is complete',
        inject(function($rootScope, $rootElement, $animate, $$AnimateRunner) {

        var runner = new $$AnimateRunner();
        overriddenAnimationRunner = runner;
        parent.append(element);

        $animate.enter(parent, null, parent2);
        $rootScope.$digest();
        expect(capturedAnimationHistory.length).toBe(1);

        $animate.addClass(element, 'tony');
        $rootScope.$digest();
        expect(capturedAnimationHistory.length).toBe(1);

        runner.end();
        $animate.flush();

        $animate.addClass(element, 'stark');
        $rootScope.$digest();
        expect(capturedAnimationHistory.length).toBe(2);
      }));
    });

    describe('cancellations', function() {
      it('should cancel the previous animation if a follow-up structural animation takes over',
        inject(function($animate, $rootScope) {

        var enterComplete = false;
        overriddenAnimationRunner = extend(defaultFakeAnimationRunner, {
          end: function() {
            enterComplete = true;
          }
        });

        parent.append(element);
        $animate.move(element, parent2);

        $rootScope.$digest();
        expect(enterComplete).toBe(false);

        $animate.leave(element);
        $rootScope.$digest();
        expect(enterComplete).toBe(true);
      }));

      it('should cancel the previous structural animation if a follow-up structural animation takes over before the postDigest',
        inject(function($animate) {

        var enterDone = jasmine.createSpy('enter animation done');
        $animate.enter(element, parent).done(enterDone);
        expect(enterDone).not.toHaveBeenCalled();

        $animate.leave(element);
        $animate.flush();
        expect(enterDone).toHaveBeenCalled();
      }));

      it('should cancel the previously running addClass animation if a follow-up removeClass animation is using the same class value',
        inject(function($animate, $rootScope) {

        parent.append(element);
        var runner = $animate.addClass(element, 'active-class');
        $rootScope.$digest();

        var doneHandler = jasmine.createSpy('addClass done');
        runner.done(doneHandler);

        expect(doneHandler).not.toHaveBeenCalled();

        $animate.removeClass(element, 'active-class');
        $rootScope.$digest();

        // true = rejected
        expect(doneHandler).toHaveBeenCalledWith(true);
      }));

      it('should cancel the previously running removeClass animation if a follow-up addClass animation is using the same class value',
        inject(function($animate, $rootScope) {

        element.addClass('active-class');
        parent.append(element);
        var runner = $animate.removeClass(element, 'active-class');
        $rootScope.$digest();

        var doneHandler = jasmine.createSpy('addClass done');
        runner.done(doneHandler);

        expect(doneHandler).not.toHaveBeenCalled();

        $animate.addClass(element, 'active-class');
        $rootScope.$digest();

        // true = rejected
        expect(doneHandler).toHaveBeenCalledWith(true);
      }));

      it('should merge a follow-up animation that does not add classes into the previous animation (pre-digest)',
        inject(function($animate, $rootScope) {

        $animate.enter(element, parent);
        $animate.animate(element, {height: 0}, {height: '100px'});

        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();
        expect(capturedAnimation[1]).toBe('enter'); // make sure the enter animation is present

        // fake the style setting (because $$animation is mocked)
        applyAnimationStyles(element, capturedAnimation[2]);
        expect(element.css('height')).toContain('100px');
      }));

      it('should immediately skip the class-based animation if there is an active structural animation',
        inject(function($animate, $rootScope) {

        $animate.enter(element, parent);
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();

        capturedAnimation = null;
        $animate.addClass(element, 'red');
        expect(element).toHaveClass('red');
      }));

      it('should join the class-based animation into the structural animation if the structural animation is pre-digest',
        inject(function($animate, $rootScope) {

        $animate.enter(element, parent);
        expect(capturedAnimation).toBeFalsy();

        $animate.addClass(element, 'red');
        expect(element).not.toHaveClass('red');

        expect(capturedAnimation).toBeFalsy();
        $rootScope.$digest();

        expect(capturedAnimation[1]).toBe('enter');
        expect(capturedAnimation[2].addClass).toBe('red');
      }));

      it('should issue a new runner instance if a previous structural animation was cancelled',
        inject(function($animate, $rootScope) {

        parent.append(element);

        var runner1 = $animate.move(element, parent2);
        $rootScope.$digest();

        var runner2 = $animate.leave(element);
        $rootScope.$digest();

        expect(runner1).not.toBe(runner2);
      }));

      it('should properly cancel out animations when the same class is added/removed within the same digest',
        inject(function($animate, $rootScope) {

        parent.append(element);
        $animate.addClass(element, 'red');
        $animate.removeClass(element, 'red');
        $rootScope.$digest();

        expect(capturedAnimation).toBeFalsy();

        $animate.addClass(element, 'blue');
        $rootScope.$digest();

        expect(capturedAnimation[2].addClass).toBe('blue');
      }));

      it('should NOT cancel a previously joined addClass+structural animation if a follow-up ' +
        'removeClass animation is using the same class value (pre-digest)',
        inject(function($animate, $rootScope) {

        var runner = $animate.enter(element, parent);
        $animate.addClass(element, 'active-class');

        var doneHandler = jasmine.createSpy('enter done');
        runner.done(doneHandler);

        expect(doneHandler).not.toHaveBeenCalled();

        $animate.removeClass(element, 'active-class');
        $rootScope.$digest();

        expect(capturedAnimation[1]).toBe('enter');
        expect(capturedAnimation[2].addClass).toBe(null);
        expect(capturedAnimation[2].removeClass).toBe(null);

        expect(doneHandler).not.toHaveBeenCalled();
      }));

    });

    describe('should merge', function() {
      it('multiple class-based animations together into one before the digest passes', inject(function($animate, $rootScope) {
        parent.append(element);
        element.addClass('green');

        $animate.addClass(element, 'red');
        $animate.addClass(element, 'blue');
        $animate.removeClass(element, 'green');

        $rootScope.$digest();

        expect(capturedAnimation[0]).toBe(element);
        expect(capturedAnimation[1]).toBe('setClass');

        options = capturedAnimation[2];
        expect(options.addClass).toEqual('red blue');
        expect(options.removeClass).toEqual('green');

        expect(element).not.toHaveClass('red');
        expect(element).not.toHaveClass('blue');
        expect(element).toHaveClass('green');

        applyAnimationClasses(element, capturedAnimation[2]);

        expect(element).toHaveClass('red');
        expect(element).toHaveClass('blue');
        expect(element).not.toHaveClass('green');
      }));

      it('multiple class-based animations together into a single structural event before the digest passes', inject(function($animate, $rootScope) {
        element.addClass('green');

        expect(element.parent().length).toBe(0);
        $animate.enter(element, parent);
        expect(element.parent().length).toBe(1);

        $animate.addClass(element, 'red');
        $animate.removeClass(element, 'green');

        $rootScope.$digest();

        expect(capturedAnimation[0]).toBe(element);
        expect(capturedAnimation[1]).toBe('enter');

        options = capturedAnimation[2];
        expect(options.addClass).toEqual('red');
        expect(options.removeClass).toEqual('green');

        expect(element).not.toHaveClass('red');
        expect(element).toHaveClass('green');

        applyAnimationClasses(element, capturedAnimation[2]);

        expect(element).toHaveClass('red');
        expect(element).not.toHaveClass('green');
      }));

      it('should automatically cancel out class-based animations if the element already contains or doesn\'t contain the applied classes',
        inject(function($animate, $rootScope) {

        parent.append(element);
        element.addClass('one three');

        $animate.addClass(element, 'one');
        $animate.addClass(element, 'two');
        $animate.removeClass(element, 'three');
        $animate.removeClass(element, 'four');

        $rootScope.$digest();

        options = capturedAnimation[2];
        expect(options.addClass).toEqual('two');
        expect(options.removeClass).toEqual('three');
      }));

      it('and skip the animation entirely if no class-based animations remain and if there is no structural animation applied',
        inject(function($animate, $rootScope) {

        parent.append(element);
        element.addClass('one three');

        $animate.addClass(element, 'one');
        $animate.removeClass(element, 'four');

        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();
      }));

      it('but not skip the animation if it is a structural animation and if there are no classes to be animated',
        inject(function($animate, $rootScope) {

        element.addClass('one three');

        $animate.addClass(element, 'one');
        $animate.removeClass(element, 'four');
        $animate.enter(element, parent);

        $rootScope.$digest();

        expect(capturedAnimation[1]).toBe('enter');
      }));

      it('class-based animations, however it should also cancel former structural animations in the process',
        inject(function($animate, $rootScope) {

        element.addClass('green lime');

        $animate.enter(element, parent);
        $animate.addClass(element, 'red');
        $animate.removeClass(element, 'green');

        $animate.leave(element);
        $animate.addClass(element, 'pink');
        $animate.removeClass(element, 'lime');

        expect(element).toHaveClass('red');
        expect(element).not.toHaveClass('green');
        expect(element).not.toHaveClass('pink');
        expect(element).toHaveClass('lime');

        $rootScope.$digest();

        expect(capturedAnimation[0]).toBe(element);
        expect(capturedAnimation[1]).toBe('leave');

        // $$hashKey causes comparison issues
        expect(element.parent()[0]).toEqual(parent[0]);

        options = capturedAnimation[2];
        expect(options.addClass).toEqual('pink');
        expect(options.removeClass).toEqual('lime');
      }));

      it('should retain the instance to the very first runner object when multiple element-level animations are issued',
        inject(function($animate, $rootScope) {

        element.addClass('green');

        var r1 = $animate.enter(element, parent);
        var r2 = $animate.addClass(element, 'red');
        var r3 = $animate.removeClass(element, 'green');

        expect(r1).toBe(r2);
        expect(r2).toBe(r3);
      }));

      it('should not skip or miss the animations when animations are executed sequential',
        inject(function($animate, $rootScope, $rootElement) {

        element = jqLite('<div></div>');

        $rootElement.append(element);

        $animate.addClass(element, 'rclass');
        $animate.removeClass(element, 'rclass');
        $animate.addClass(element, 'rclass');
        $animate.removeClass(element, 'rclass');

        $rootScope.$digest();
        expect(element).not.toHaveClass('rclass');
      }));
    });
  });

  they('should allow an animation to run on the $prop element', ['$rootElement', 'body'], function(name) {
    var capturedAnimation;

    module(function($provide) {
      $provide.factory('$rootElement', function($document) {
        return jqLite($document[0].querySelector('html'));
      });
      $provide.factory('$$animation', function($$AnimateRunner) {
        return function(element, method, options) {
          capturedAnimation = arguments;
          return new $$AnimateRunner();
        };
      });
    });
    inject(function($animate, $rootScope, $document, $rootElement) {
      $animate.enabled(true);

      var body = jqLite($document[0].body);
      var targetElement = name === 'body' ? body : $rootElement;

      $animate.addClass(targetElement, 'red');
      $rootScope.$digest();

      expect(capturedAnimation[0]).toBe(targetElement);
      expect(capturedAnimation[1]).toBe('addClass');
    });
  });

  describe('[ng-animate-children]', function() {
    var parent, element, child, capturedAnimation, captureLog;
    beforeEach(module(function($provide) {
      capturedAnimation = null;
      captureLog = [];
      $provide.factory('$$animation', function($$AnimateRunner) {
        return function(element, method, options) {
          options.domOperation();
          captureLog.push(capturedAnimation = arguments);
          return new $$AnimateRunner();
        };
      });
      return function($rootElement, $document, $animate) {
        jqLite($document[0].body).append($rootElement);
        parent  = jqLite('<div class="parent"></div>');
        element = jqLite('<div class="element"></div>');
        child   = jqLite('<div class="child"></div>');
        $animate.enabled(true);
      };
    }));

    it('should allow child animations to run when the attribute is used',
      inject(function($animate, $rootScope, $rootElement, $compile) {

      $animate.enter(parent, $rootElement);
      $animate.enter(element, parent);
      $animate.enter(child, element);
      $rootScope.$digest();
      expect(captureLog.length).toBe(1);

      captureLog = [];

      parent.attr('ng-animate-children', '');
      $compile(parent)($rootScope);
      $rootScope.$digest();

      $animate.enter(parent, $rootElement);
      $rootScope.$digest();
      expect(captureLog.length).toBe(1);

      $animate.enter(element, parent);
      $animate.enter(child, element);
      $rootScope.$digest();
      expect(captureLog.length).toBe(3);
    }));

    it('should fully disallow all parallel child animations from running if `off` is used',
      inject(function($animate, $rootScope, $rootElement, $compile) {

      $rootElement.append(parent);
      parent.append(element);
      element.append(child);

      parent.attr('ng-animate-children', 'off');
      element.attr('ng-animate-children', 'on');

      $compile(parent)($rootScope);
      $compile(element)($rootScope);
      $rootScope.$digest();

      $animate.leave(parent);
      $animate.leave(element);
      $animate.leave(child);
      $rootScope.$digest();

      expect(captureLog.length).toBe(1);

      dealoc(element);
      dealoc(child);
    }));

    it('should watch to see if the ng-animate-children attribute changes',
      inject(function($animate, $rootScope, $rootElement, $compile) {

      $rootElement.append(parent);
      $rootScope.val = 'on';
      parent.attr('ng-animate-children', '{{ val }}');
      $compile(parent)($rootScope);
      $rootScope.$digest();

      $animate.enter(parent, $rootElement);
      $animate.enter(element, parent);
      $animate.enter(child, element);
      $rootScope.$digest();
      expect(captureLog.length).toBe(3);

      captureLog = [];

      $rootScope.val = 'off';
      $rootScope.$digest();

      $animate.leave(parent);
      $animate.leave(element);
      $animate.leave(child);
      $rootScope.$digest();

      expect(captureLog.length).toBe(1);

      dealoc(element);
      dealoc(child);
    }));

    it('should respect the value if the directive is on an element with ngIf',
      inject(function($rootScope, $rootElement, $compile) {

      parent.attr('ng-animate-children', 'true');
      parent.attr('ng-if', 'true');
      element.attr('ng-if', 'true');

      $rootElement.append(parent);
      parent.append(element);

      $compile(parent)($rootScope);
      $rootScope.$digest();

      expect(captureLog.length).toBe(2);
    }));
  });

  describe('.pin()', function() {
    var capturedAnimation;

    beforeEach(module(function($provide) {
      capturedAnimation = null;
      $provide.factory('$$animation', function($$AnimateRunner) {
        return function() {
          capturedAnimation = arguments;
          return new $$AnimateRunner();
        };
      });

      return function($animate) {
        $animate.enabled(true);
      };
    }));

    it('should throw if the arguments are not elements',
      inject(function($animate, $rootElement) {

      var element = jqLite('<div></div>');

      expect(function() {
        $animate.pin(element);
      }).toThrowMinErr('ng', 'areq', 'Argument \'parentElement\' is not an element');

      expect(function() {
        $animate.pin(null, $rootElement);
      }).toThrowMinErr('ng', 'areq', 'Argument \'element\' is not an element');

      dealoc(element);
    }));


    they('should animate an element inside a pinned element that is the $prop element',
      ['same', 'parent', 'grandparent'],
      function(elementRelation) {
        inject(function($animate, $document, $rootElement, $rootScope) {

        var pinElement, animateElement;

        var innerParent = jqLite('<div></div>');
        jqLite($document[0].body).append(innerParent);
        innerParent.append($rootElement);

        switch (elementRelation) {
          case 'same':
            pinElement = jqLite('<div id="animate"></div>');
            break;
          case 'parent':
            pinElement = jqLite('<div><div id="animate"></div></div>');
            break;
          case 'grandparent':
            pinElement = jqLite('<div><div><div id="animate"></div></div></div>');
            break;
        }

        jqLite($document[0].body).append(pinElement);
        animateElement = jqLite($document[0].getElementById('animate'));

        $animate.addClass(animateElement, 'red');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        // Pin the element to the app root to enable animations
        $animate.pin(pinElement, $rootElement);

        $animate.addClass(animateElement, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();

        dealoc(pinElement);
      });
    });

    they('should not animate an element when the pinned ($prop) element, is pinned to an element that is not a child of the $rootElement',
      ['same', 'parent', 'grandparent'],
      function(elementRelation) {
        inject(function($animate, $document, $rootElement, $rootScope) {

        var pinElement, animateElement, pinTargetElement = jqLite('<div></div>');

        var innerParent = jqLite('<div></div>');
        jqLite($document[0].body).append(innerParent);
        innerParent.append($rootElement);

        switch (elementRelation) {
          case 'same':
            pinElement = jqLite('<div id="animate"></div>');
            break;
          case 'parent':
            pinElement = jqLite('<div><div id="animate"></div></div>');
            break;
          case 'grandparent':
            pinElement = jqLite('<div><div><div id="animate"></div></div></div>');
            break;
        }

        // Append both the pin element and the pinTargetElement outside the app root
        jqLite($document[0].body).append(pinElement);
        jqLite($document[0].body).append(pinTargetElement);

        animateElement = jqLite($document[0].getElementById('animate'));

        $animate.addClass(animateElement, 'red');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        $animate.pin(pinElement, pinTargetElement);

        $animate.addClass(animateElement, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        dealoc(pinElement);
      });
    });

    they('should adhere to the disabled state of the hosted parent when the $prop element is pinned',
      ['same', 'parent', 'grandparent'],
      function(elementRelation) {
        inject(function($animate, $document, $rootElement, $rootScope) {

        var pinElement, animateElement, pinHostElement = jqLite('<div></div>');

        var innerParent = jqLite('<div></div>');
        jqLite($document[0].body).append(innerParent);
        innerParent.append($rootElement);

        switch (elementRelation) {
          case 'same':
            pinElement = jqLite('<div id="animate"></div>');
            break;
          case 'parent':
            pinElement = jqLite('<div><div id="animate"></div></div>');
            break;
          case 'grandparent':
            pinElement = jqLite('<div><div><div id="animate"></div></div></div>');
            break;
        }

        $rootElement.append(pinHostElement);
        jqLite($document[0].body).append(pinElement);
        animateElement = jqLite($document[0].getElementById('animate'));

        $animate.pin(pinElement, pinHostElement);
        $animate.enabled(pinHostElement, false);

        $animate.addClass(animateElement, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeFalsy();

        $animate.enabled(pinHostElement, true);

        $animate.addClass(animateElement, 'red');
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();

        dealoc(pinElement);
      });
    });
  });

  describe('callbacks', function() {
    var captureLog = [];
    var capturedAnimation = [];
    var runner;
    var body;
    beforeEach(module(function($provide) {
      runner = null;
      capturedAnimation = null;
      $provide.factory('$$animation', function($$AnimateRunner) {
        return function() {
          captureLog.push(capturedAnimation = arguments);
          runner = new $$AnimateRunner();
          return runner;
        };
      });

      return function($document, $rootElement, $animate) {
        if ($document !== $rootElement) {
          jqLite($document[0].body).append($rootElement);
        }
        $animate.enabled(true);
      };
    }));

    it('should trigger a callback for an enter animation',
      inject(function($animate, $rootScope, $rootElement, $document) {

      var callbackTriggered = false;
      $animate.on('enter', jqLite($document[0].body), function() {
        callbackTriggered = true;
      });

      element = jqLite('<div></div>');
      $animate.enter(element, $rootElement);
      $rootScope.$digest();

      $animate.flush();

      expect(callbackTriggered).toBe(true);
    }));

    it('should fire the callback with the signature of (element, phase, data)',
      inject(function($animate, $rootScope, $rootElement, $document) {

      var capturedElement;
      var capturedPhase;
      var capturedData;
      $animate.on('enter', jqLite($document[0].body),
        function(element, phase, data) {

        capturedElement = element;
        capturedPhase = phase;
        capturedData = data;
      });

      element = jqLite('<div></div>');
      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(capturedElement).toBe(element);
      expect(isString(capturedPhase)).toBe(true);
      expect(isObject(capturedData)).toBe(true);
    }));

    it('should not fire a callback if the element is outside of the given container',
      inject(function($animate, $rootScope, $rootElement) {

      var callbackTriggered = false;
      var innerContainer = jqLite('<div></div>');
      $rootElement.append(innerContainer);

      $animate.on('enter', innerContainer,
        function(element, phase, data) {

        callbackTriggered = true;
      });

      element = jqLite('<div></div>');
      $animate.enter(element, $rootElement);
      $rootScope.$digest();

      expect(callbackTriggered).toBe(false);
    }));

    it('should fire a callback if the element is the given container',
      inject(function($animate, $rootScope, $rootElement) {

      element = jqLite('<div></div>');

      var callbackTriggered = false;
      $animate.on('enter', element,
        function(element, phase, data) {

        callbackTriggered = true;
      });

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(callbackTriggered).toBe(true);
    }));

    it('should remove all the event-based event listeners when $animate.off(event) is called',
      inject(function($animate, $rootScope, $rootElement, $document) {

      element = jqLite('<div></div>');

      var count = 0;
      $animate.on('enter', element, counter);
      $animate.on('enter', jqLite($document[0].body), counter);

      function counter(element, phase) {
        count++;
      }

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(count).toBe(2);

      $animate.off('enter');

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(count).toBe(2);
    }));

    it('should remove the container-based event listeners when $animate.off(event, container) is called',
      inject(function($animate, $rootScope, $rootElement, $document) {

      element = jqLite('<div></div>');

      var count = 0;
      $animate.on('enter', element, counter);
      $animate.on('enter', jqLite($document[0].body), counter);

      function counter(element, phase) {
        if (phase === 'start') {
          count++;
        }
      }

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(count).toBe(2);

      $animate.off('enter', jqLite($document[0].body));

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(count).toBe(3);
    }));

    it('should remove the callback-based event listener when $animate.off(event, container, callback) is called',
      inject(function($animate, $rootScope, $rootElement) {

      element = jqLite('<div></div>');

      var count = 0;
      $animate.on('enter', element, counter1);
      $animate.on('enter', element, counter2);

      function counter1(element, phase) {
        if (phase === 'start') {
          count++;
        }
      }

      function counter2(element, phase) {
        if (phase === 'start') {
          count++;
        }
      }

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(count).toBe(2);

      $animate.off('enter', element, counter2);

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(count).toBe(3);
    }));

    it('should remove all event listeners for an element when $animate.off(element) is called',
      inject(function($animate, $rootScope, $rootElement, $document, $$rAF) {

      element = jqLite('<div></div>');
      var otherElement = jqLite('<div></div>');
      $rootElement.append(otherElement);

      var count = 0;
      var runner;
      $animate.on('enter', element, counter);
      $animate.on('leave', element, counter);
      $animate.on('addClass', element, counter);
      $animate.on('addClass', otherElement, counter);

      function counter(element, phase) {
        count++;
      }

      runner = $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();
      runner.end();

      runner = $animate.addClass(element, 'blue');
      $rootScope.$digest();
      $animate.flush();

      runner.end();
      $$rAF.flush();

      expect(count).toBe(4);

      $animate.off(element);

      runner = $animate.enter(element, $rootElement);
      $animate.flush();
      expect(capturedAnimation[1]).toBe('enter');
      runner.end();

      runner = $animate.addClass(element, 'red');
      $animate.flush();
      expect(capturedAnimation[1]).toBe('addClass');
      runner.end();

      runner = $animate.leave(element);
      $animate.flush();
      expect(capturedAnimation[1]).toBe('leave');
      runner.end();

      // Try to flush all remaining callbacks
      expect(function() {
        $$rAF.flush();
      }).toThrowError('No rAF callbacks present');

      expect(count).toBe(4);

      // Check that other elements' event listeners are not affected
      $animate.addClass(otherElement, 'green');
      $animate.flush();
      expect(count).toBe(5);
    }));

    it('should not get affected by custom, enumerable properties on `Object.prototype`',
      inject(function($animate) {
        // eslint-disable-next-line no-extend-native
        Object.prototype.foo = 'ENUMARABLE_AND_NOT_AN_ARRAY';

        element = jqLite('<div></div>');
        expect(function() { $animate.off(element); }).not.toThrow();

        delete Object.prototype.foo;
      })
    );

    it('should fire a `start` callback when the animation starts with the matching element',
      inject(function($animate, $rootScope, $rootElement, $document) {

      element = jqLite('<div></div>');

      var capturedState;
      var capturedElement;
      $animate.on('enter', jqLite($document[0].body), function(element, phase) {
        capturedState = phase;
        capturedElement = element;
      });

      $animate.enter(element, $rootElement);
      $rootScope.$digest();
      $animate.flush();

      expect(capturedState).toBe('start');
      expect(capturedElement).toBe(element);
    }));

    it('should fire a `close` callback when the animation ends with the matching element',
      inject(function($animate, $rootScope, $rootElement, $document) {

      element = jqLite('<div></div>');

      var capturedState;
      var capturedElement;
      $animate.on('enter', jqLite($document[0].body), function(element, phase) {
        capturedState = phase;
        capturedElement = element;
      });

      var runner = $animate.enter(element, $rootElement);
      $rootScope.$digest();
      runner.end();
      $animate.flush();

      expect(capturedState).toBe('close');
      expect(capturedElement).toBe(element);
    }));


    they('should remove all event listeners when the element is removed via $prop',
      ['leave()', 'remove()'], function(method) {
      inject(function($animate, $rootScope, $rootElement, $$rAF) {

        element = jqLite('<div></div>');

        var count = 0;
        var enterSpy = jasmine.createSpy();
        var addClassSpy = jasmine.createSpy();
        var runner;

        $animate.on('enter', element, enterSpy);
        $animate.on('addClass', element[0], addClassSpy);

        function counter(element, phase) {
          if (phase === 'start') {
            count++;
          }
        }

        runner = $animate.enter(element, $rootElement);
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();

        $animate.flush();
        expect(enterSpy.calls.count()).toBe(1);
        expect(enterSpy.calls.mostRecent().args[1]).toBe('start');

        runner.end(); // Otherwise the class animation won't run because enter is still in progress
        $$rAF.flush();
        expect(enterSpy.calls.count()).toBe(2);
        expect(enterSpy.calls.mostRecent().args[1]).toBe('close');

        enterSpy.calls.reset();
        capturedAnimation = null;

        runner = $animate.addClass(element, 'blue');
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();

        $animate.flush();
        expect(addClassSpy.calls.count()).toBe(1);
        expect(addClassSpy.calls.mostRecent().args[1]).toBe('start');

        runner.end();
        $$rAF.flush();
        expect(addClassSpy.calls.count()).toBe(2);
        expect(addClassSpy.calls.mostRecent().args[1]).toBe('close');

        addClassSpy.calls.reset();
        capturedAnimation = null;

        if (method === 'leave()') {
          runner = $animate.leave(element);
          $animate.flush();
          runner.end();
        } else if (method === 'remove()') {
          element.remove();
        }

        runner = $animate.enter(element, $rootElement);
        $rootScope.$digest();

        $animate.flush();
        expect(enterSpy.calls.count()).toBe(0);

        runner.end(); // Otherwise the class animation won't run because enter is still in progress
        expect(function() {
          $$rAF.flush();
        }).toThrowError('No rAF callbacks present'); // Try to flush any callbacks
        expect(enterSpy.calls.count()).toBe(0);

        capturedAnimation = null;

        $animate.addClass(element, 'red');
        $rootScope.$digest();
        expect(capturedAnimation).toBeTruthy();

        $animate.flush();
        expect(addClassSpy.calls.count()).toBe(0);

        runner.end();
        expect(function() {
          $$rAF.flush();
        }).toThrowError('No rAF callbacks present'); // Try to flush any callbacks
        expect(addClassSpy.calls.count()).toBe(0);
        expect(enterSpy.calls.count()).toBe(0);
      });
    });

    it('should always detect registered callbacks after one postDigest has fired',
      inject(function($animate, $rootScope, $rootElement) {

      element = jqLite('<div></div>');

      var spy = jasmine.createSpy();
      registerCallback();

      var runner = $animate.enter(element, $rootElement);
      registerCallback();

      $rootScope.$digest();
      registerCallback();

      expect(spy).not.toHaveBeenCalled();
      $animate.flush();

      // this is not 3 since the 3rd callback
      // was added after the first callback
      // was fired
      expect(spy).toHaveBeenCalledTimes(2);

      spy.calls.reset();
      runner.end();

      $animate.flush();

      // now we expect all three callbacks
      // to fire when the animation ends since
      // the callback detection happens again
      expect(spy).toHaveBeenCalledTimes(3);

      function registerCallback() {
        $animate.on('enter', element, spy);
      }
    }));

    it('should use RAF if there are detected callbacks within the hierarchy of the element being animated',
      inject(function($animate, $rootScope, $rootElement, $$rAF) {

      var runner;

      element = jqLite('<div></div>');
      runner = $animate.enter(element, $rootElement);
      $rootScope.$digest();
      runner.end();

      assertRAFsUsed(false);

      var spy = jasmine.createSpy();
      $animate.on('leave', element, spy);

      runner = $animate.leave(element, $rootElement);
      $rootScope.$digest();
      runner.end();

      assertRAFsUsed(true);

      function assertRAFsUsed(bool) {
        expect($$rAF.queue.length)[bool ? 'toBeGreaterThan' : 'toBe'](0);
      }
    }));

    describe('for leave', function() {

      it('should remove the element even if another animation is called afterwards',
        inject(function($animate, $rootScope, $rootElement) {

        var outerContainer = jqLite('<div></div>');
        element = jqLite('<div></div>');
        outerContainer.append(element);
        $rootElement.append(outerContainer);

        var runner = $animate.leave(element, $rootElement);
        $animate.removeClass(element,'rclass');
        $rootScope.$digest();
        runner.end();
        $animate.flush();

        var isElementRemoved = !outerContainer[0].contains(element[0]);
        expect(isElementRemoved).toBe(true);
      }));

      they('should trigger callbacks when the listener is on the $prop element', ['same', 'parent'],
        function(elementRelation) {
          inject(function($animate, $rootScope, $$rAF, $rootElement, $document) {
            var listenerElement, callbackSpy = jasmine.createSpy();

            element = jqLite('<div></div>');
            listenerElement = elementRelation === 'same' ? element : jqLite($document[0].body);
            $animate.on('leave', listenerElement, callbackSpy);
            $rootElement.append(element);
            var runner = $animate.leave(element, $rootElement);
            $rootScope.$digest();

            $$rAF.flush();

            expect(callbackSpy.calls.count()).toBe(1);
            expect(callbackSpy.calls.mostRecent().args[1]).toBe('start');
            callbackSpy.calls.reset();

            runner.end();
            $$rAF.flush();

            expect(callbackSpy.calls.count()).toBe(1);
            expect(callbackSpy.calls.mostRecent().args[1]).toBe('close');
          });
        }
      );

      it('should trigger callbacks for a leave animation',
        inject(function($animate, $rootScope, $$rAF, $rootElement, $document) {

        var callbackSpy = jasmine.createSpy();
        $animate.on('leave', jqLite($document[0].body), callbackSpy);

        element = jqLite('<div></div>');
        $rootElement.append(element);
        $animate.leave(element, $rootElement);
        $rootScope.$digest();

        $$rAF.flush();

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.count()).toBe(1);
      }));

      it('should trigger a callback for an leave animation (same element)',
        inject(function($animate, $rootScope, $$rAF, $rootElement, $document) {

        var callbackSpy = jasmine.createSpy();

        element = jqLite('<div></div>');
        $animate.on('leave', element, callbackSpy);
        $rootElement.append(element);
        var runner = $animate.leave(element, $rootElement);
        $rootScope.$digest();

        $$rAF.flush();

        expect(callbackSpy.calls.count()).toBe(1);
        expect(callbackSpy.calls.mostRecent().args[1]).toBe('start');
        callbackSpy.calls.reset();

        runner.end();
        $$rAF.flush();

        expect(callbackSpy.calls.count()).toBe(1);
        expect(callbackSpy.calls.mostRecent().args[1]).toBe('close');
      }));

      it('should not fire a callback if the element is outside of the given container',
        inject(function($animate, $rootScope, $$rAF, $rootElement) {

        var callbackTriggered = false;
        var innerContainer = jqLite('<div></div>');
        $rootElement.append(innerContainer);

        $animate.on('leave', innerContainer,
          function(element, phase, data) {
          callbackTriggered = true;
        });

        element = jqLite('<div></div>');
        $rootElement.append(element);
        $animate.leave(element, $rootElement);
        $rootScope.$digest();

        expect(callbackTriggered).toBe(false);
      }));

      it('should fire a `start` callback when the animation starts',
        inject(function($animate, $rootScope, $$rAF, $rootElement, $document) {

        element = jqLite('<div></div>');

        var capturedState;
        var capturedElement;
        $animate.on('leave', jqLite($document[0].body), function(element, phase) {
          capturedState = phase;
          capturedElement = element;
        });

        $rootElement.append(element);
        $animate.leave(element, $rootElement);
        $rootScope.$digest();
        $$rAF.flush();

        expect(capturedState).toBe('start');
        expect(capturedElement).toBe(element);
      }));

      it('should fire a `close` callback when the animation ends',
        inject(function($animate, $rootScope, $$rAF, $rootElement, $document) {

        element = jqLite('<div></div>');

        var capturedState;
        var capturedElement;
        $animate.on('leave', jqLite($document[0].body), function(element, phase) {
          capturedState = phase;
          capturedElement = element;
        });

        $rootElement.append(element);
        var runner = $animate.leave(element, $rootElement);
        $rootScope.$digest();
        runner.end();
        $$rAF.flush();

        expect(capturedState).toBe('close');
        expect(capturedElement).toBe(element);
      }));

      it('should remove all event listeners after all callbacks for the "leave:close" phase have been called',
        inject(function($animate, $rootScope, $rootElement, $$rAF) {

        var leaveSpy = jasmine.createSpy();
        var addClassSpy = jasmine.createSpy();

        element = jqLite('<div></div>');
        $animate.on('leave', element, leaveSpy);
        $animate.on('addClass', element, addClassSpy);
        $rootElement.append(element);
        var runner = $animate.leave(element, $rootElement);
        $animate.flush();

        runner.end();
        $$rAF.flush();

        expect(leaveSpy.calls.mostRecent().args[1]).toBe('close');

        $animate.addClass(element, 'blue');

        $animate.flush();
        runner.end();
        expect(function() {
          $$rAF.flush();
        }).toThrowError('No rAF callbacks present');

        expect(addClassSpy.calls.count()).toBe(0);
      }));

    });

    they('should trigger a callback for a $prop animation if the listener is on the document',
      ['enter', 'leave'], function($event) {
        module(function($provide) {
          $provide.factory('$rootElement', function($document) {
            // Since we listen on document, $document must be the $rootElement for animations to work
            return $document;
          });
        });

        inject(function($animate, $rootScope, $document) {

          var callbackTriggered = false;

          $animate.on($event, $document[0], function() {
            callbackTriggered = true;
          });

          var container = jqLite('<div></div>');
          jqLite($document[0].body).append(container);
          element = jqLite('<div></div>');

          if ($event === 'leave') {
            container.append(element);
          }

          $animate[$event](element, container);
          $rootScope.$digest();

          $animate.flush();

          expect(callbackTriggered).toBe(true);
        });
    });

    describe('when animations are skipped, disabled, or invalid', function() {

      var overriddenAnimationRunner;
      var capturedAnimation;
      var capturedAnimationHistory;
      var defaultFakeAnimationRunner;
      var parent;
      var parent2;

      beforeEach(module(function($provide) {
        overriddenAnimationRunner = null;
        capturedAnimation = null;
        capturedAnimationHistory = [];

        $provide.value('$$animation', function() {
          capturedAnimationHistory.push(capturedAnimation = arguments);
          return overriddenAnimationRunner || defaultFakeAnimationRunner;
        });

        return function($rootElement, $q, $animate, $$AnimateRunner, $document) {
          defaultFakeAnimationRunner = new $$AnimateRunner();
          $animate.enabled(true);

          element = jqLite('<div class="element">element</div>');
          parent = jqLite('<div class="parent1">parent</div>');
          parent2 = jqLite('<div class="parent2">parent</div>');

          $rootElement.append(parent);
          $rootElement.append(parent2);
          jqLite($document[0].body).append($rootElement);
        };
      }));


      it('should trigger all callbacks if a follow-up structural animation takes over a running animation',
        inject(function($animate, $rootScope) {

        parent.append(element);
        var moveSpy = jasmine.createSpy();
        var leaveSpy = jasmine.createSpy();

        $animate.on('move', parent2, moveSpy);
        $animate.on('leave', parent2, leaveSpy);

        $animate.move(element, parent2);

        $rootScope.$digest();
        $animate.flush();

        expect(moveSpy.calls.count()).toBe(1);
        expect(moveSpy.calls.mostRecent().args[1]).toBe('start');

        $animate.leave(element);
        $rootScope.$digest();
        $animate.flush();

        expect(moveSpy.calls.count()).toBe(2);
        expect(moveSpy.calls.mostRecent().args[1]).toBe('close');

        expect(leaveSpy.calls.count()).toBe(2);
        expect(leaveSpy.calls.argsFor(0)[1]).toBe('start');
        expect(leaveSpy.calls.argsFor(1)[1]).toBe('close');
      }));


      it('should not trigger callbacks for the previous structural animation if a follow-up structural animation takes over before the postDigest',
        inject(function($animate, $rootScope) {

        var enterDone = jasmine.createSpy('enter animation done');

        var enterSpy = jasmine.createSpy();
        var leaveSpy = jasmine.createSpy();

        $animate.on('enter', parent, enterSpy);
        $animate.on('leave', parent, leaveSpy);

        $animate.enter(element, parent).done(enterDone);
        expect(enterDone).not.toHaveBeenCalled();

        var runner = $animate.leave(element);
        $animate.flush();
        expect(enterDone).toHaveBeenCalled();

        expect(enterSpy).not.toHaveBeenCalled();
        expect(leaveSpy.calls.count()).toBe(1);
        expect(leaveSpy.calls.mostRecent().args[1]).toBe('start');

        leaveSpy.calls.reset();
        runner.end();
        $animate.flush();

        expect(enterSpy).not.toHaveBeenCalled();
        expect(leaveSpy.calls.count()).toBe(1);
        expect(leaveSpy.calls.mostRecent().args[1]).toBe('close');
      }));


      it('should not trigger the callback if animations are disabled on the element',
        inject(function($animate, $rootScope, $rootElement, $document) {

        var callbackTriggered = false;
        var spy = jasmine.createSpy('enter');
        $animate.on('enter', jqLite($document[0].body), spy);

        element = jqLite('<div></div>');
        $animate.enabled(element, false);
        var runner = $animate.enter(element, $rootElement);
        $rootScope.$digest();

        $animate.flush(); // Flushes the animation frames for the callbacks

        expect(spy).not.toHaveBeenCalled();
      }));


      it('should not trigger the callbacks if the animation is skipped because there are no class-based animations and no structural animation',
        inject(function($animate, $rootScope) {

        parent.append(element);
        var classSpy = jasmine.createSpy('classChange');
        $animate.on('addClass', element, classSpy);
        $animate.on('removeClass', element, classSpy);
        element.addClass('one three');

        $animate.addClass(element, 'one');
        $animate.removeClass(element, 'four');

        $rootScope.$digest();
        $animate.flush();
        expect(classSpy).not.toHaveBeenCalled();
      }));


      describe('because the document is hidden', function() {
        var hidden = true;

        beforeEach(function() {
          module(function($provide) {
            $provide.value('$$isDocumentHidden', function() {
              return hidden;
            });
          });
        });

        it('should trigger callbacks for an enter animation',
          inject(function($animate, $rootScope, $rootElement, $document) {

          var spy = jasmine.createSpy();
          $animate.on('enter', jqLite($document[0].body), spy);

          element = jqLite('<div></div>');
          var runner = $animate.enter(element, $rootElement);
          $rootScope.$digest();

          $animate.flush(); // Flushes the animation frames for the callbacks

          expect(spy.calls.count()).toBe(2);
          expect(spy.calls.argsFor(0)[1]).toBe('start');
          expect(spy.calls.argsFor(1)[1]).toBe('close');
        }));
      });


    });

  });
});
