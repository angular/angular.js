'use strict';

// NOTE: this is a pseudo directive.

/**
 * @ngdoc directive
 * @name ng.directive:ngAnimate
 *
 * @description
 * The `ngAnimate` directive works as an attribute that is attached alongside pre-existing directives.
 * It effects how the directive will perform DOM manipulation. This allows for complex animations to take place
 * without burdening the directive which uses the animation with animation details. The built in directives
 * `ngRepeat`, `ngInclude`, `ngSwitch`, `ngShow`, `ngHide` and `ngView` already accept `ngAnimate` directive.
 * Custom directives can take advantage of animation through {@link ng.$animator $animator service}.
 *
 * Below is a more detailed breakdown of the supported callback events provided by pre-exisitng ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |========================================================== |====================================================|
 * | {@link ng.directive:ngRepeat#animations ngRepeat}         | enter, leave and move                              |
 * | {@link ng.directive:ngView#animations ngView}             | enter and leave                                    |
 * | {@link ng.directive:ngInclude#animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngShow#animations ngShow & ngHide}    | show and hide                                      |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of a directive that makes use of the ngAnimate attribute:
 *
 * <pre>
 * <!-- you can also use data-ng-animate, ng:animate or x-ng-animate as well -->
 * <ANY ng-directive ng-animate="{event1: 'animation-name', event2: 'animation-name-2'}"></ANY>
 *
 * <!-- you can also use a short hand -->
 * <ANY ng-directive ng-animate=" 'animation' "></ANY>
 * <!-- which expands to -->
 * <ANY ng-directive ng-animate="{ enter: 'animation-enter', leave: 'animation-leave', ...}"></ANY>
 *
 * <!-- keep in mind that ng-animate can take expressions -->
 * <ANY ng-directive ng-animate=" computeCurrentAnimation() "></ANY>
 * </pre>
 *
 * The `event1` and `event2` attributes refer to the animation events specific to the directive that has been assigned.
 *
 * Keep in mind that if an animation is running, no child element of such animation can also be animated.
 *
 * <h2>CSS-defined Animations</h2>
 * By default, ngAnimate attaches two CSS3 classes per animation event to the DOM element to achieve the animation.
 * It is up to you, the developer, to ensure that the animations take place using cross-browser CSS3 transitions.
 * All that is required is the following CSS code:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animate-enter prefix is the event name that you
 *  have provided within the ngAnimate attribute.
 * &#42;/
 * .animate-enter-setup {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  -moz-transition: 1s linear all; /&#42; Firefox &#42;/
 *  -ms-transition: 1s linear all; /&#42; IE10 &#42;/
 *  -o-transition: 1s linear all; /&#42; Opera &#42;/
 *  transition: 1s linear all; /&#42; Future Browsers &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .animate-enter-setup.animate-enter-start {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div ng-directive ng-animate="{enter: 'animate-enter'}"></div>
 * </pre>
 *
 * Upon DOM mutation, the setup class is added first, then the browser is allowed to reflow the content and then,
 * the start class is added to trigger the animation. The ngAnimate directive will automatically extract the duration
 * of the animation to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions then the animation will start and end
 * immediately resulting in a DOM element that is at it's final state. This final state is when the DOM element
 * has no CSS animation classes surrounding it.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 animations or if you wish to offer animations to browsers that do not
 * yet support them, then you can make use of JavaScript animations defined inside ngModule.
 *
 * <pre>
 * var ngModule = angular.module('YourApp', []);
 * ngModule.animation('animate-enter', function() {
 *   return {
 *     setup : function(element) {
 *       //prepare the element for animation
 *       element.css({ 'opacity': 0 });
 *       var memo = "..."; //this value is passed to the start function
 *       return memo;
 *     },
 *     start : function(element, done, memo) {
 *       //start the animation
 *       element.animate({
 *         'opacity' : 1
 *       }, function() {
 *         //call when the animation is complete
 *         done()
 *       });
 *     }
 *   }
 * });
 * </pre>
 *
 * As you can see, the JavaScript code follows a similar template to the CSS3 animations. Once defined, the animation
 * can be used in the same way with the ngAnimate attribute. Keep in mind that, when using JavaScript-enabled
 * animations, ngAnimate will also add in the same CSS classes that CSS-enabled animations do (even if you're using
 * JavaScript animations) to animated the element, but it will not attempt to find any CSS3 transition duration value.
 * It will instead close off the animation once the provided done function is executed. So it's important that you
 * make sure your animations remember to fire off the done function once the animations are complete.
 *
 * @param {expression} ngAnimate Used to configure the DOM manipulation animations.
 *
 */

var $AnimatorProvider = function() {
  var NG_ANIMATE_CONTROLLER = '$ngAnimateController';
  var rootAnimateController = {running:true};

  this.$get = ['$animation', '$window', '$sniffer', '$rootElement', '$rootScope',
      function($animation, $window, $sniffer, $rootElement, $rootScope) {
    $rootElement.data(NG_ANIMATE_CONTROLLER, rootAnimateController);

    /**
     * @ngdoc function
     * @name ng.$animator
     * @function
     *
     * @description
     * The $animator.create service provides the DOM manipulation API which is decorated with animations.
     *
     * @param {Scope} scope the scope for the ng-animate.
     * @param {Attributes} attr the attributes object which contains the ngAnimate key / value pair. (The attributes are
     *        passed into the linking function of the directive using the `$animator`.)
     * @return {object} the animator object which contains the enter, leave, move, show, hide and animate methods.
     */
     var AnimatorService = function(scope, attrs) {
        var ngAnimateAttr = attrs.ngAnimate;
        var ngAnimateValue = ngAnimateAttr && scope.$eval(ngAnimateAttr);
        var animator = {};
  
        /**
         * @ngdoc function
         * @name ng.animator#enter
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Injects the element object into the DOM (inside of the parent element) and then runs the enter animation.
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the enter animation
        */
        animator.enter = animateActionFactory('enter', insert, noop);
  
        /**
         * @ngdoc function
         * @name ng.animator#leave
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM.
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the leave animation
        */
        animator.leave = animateActionFactory('leave', noop, remove);
  
        /**
         * @ngdoc function
         * @name ng.animator#move
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animator will either append it into the parent container or
         * add the element directly after the after element if present. Then the move animation will be run.
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the move animation
        */
        animator.move = animateActionFactory('move', move, noop);
  
        /**
         * @ngdoc function
         * @name ng.animator#show
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Reveals the element by setting the CSS property `display` to `block` and then starts the show animation directly after.
         *
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
        */
        animator.show = animateActionFactory('show', show, noop);
  
        /**
         * @ngdoc function
         * @name ng.animator#hide
         * @methodOf ng.$animator
         *
         * @description
         * Starts the hide animation first and sets the CSS `display` property to `none` upon completion.
         *
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
        */
        animator.hide = animateActionFactory('hide', noop, hide);
        return animator;
  
        function animateActionFactory(type, beforeFn, afterFn) {
          var className = ngAnimateAttr
              ? isObject(ngAnimateValue) ? ngAnimateValue[type] : ngAnimateValue + '-' + type
              : '';
          var animationPolyfill = $animation(className);
  
          var polyfillSetup = animationPolyfill && animationPolyfill.setup;
          var polyfillStart = animationPolyfill && animationPolyfill.start;
  
          if (!className) {
            return function(element, parent, after) {
              beforeFn(element, parent, after);
              afterFn(element, parent, after);
            }
          } else {
            var setupClass = className + '-setup';
            var startClass = className + '-start';
  
            return function(element, parent, after) {
              if (!parent) {
                parent = after ? after.parent() : element.parent();
              }
              if ((!$sniffer.supportsTransitions && !polyfillSetup && !polyfillStart) ||
                  (parent.inheritedData(NG_ANIMATE_CONTROLLER) || noop).running) {
                beforeFn(element, parent, after);
                afterFn(element, parent, after);
                return;
              }

              element.data(NG_ANIMATE_CONTROLLER, {running:true});
              element.addClass(setupClass);
              beforeFn(element, parent, after);
              if (element.length == 0) return done();
  
              var memento = (polyfillSetup || noop)(element);
  
              // $window.setTimeout(beginAnimation, 0); this was causing the element not to animate
              // keep at 1 for animation dom rerender
              $window.setTimeout(beginAnimation, 1);
  
              function beginAnimation() {
                element.addClass(startClass);
                if (polyfillStart) {
                  polyfillStart(element, done, memento);
                } else if (isFunction($window.getComputedStyle)) {
                  var vendorTransitionProp = $sniffer.vendorPrefix + 'Transition';
                  var w3cTransitionProp = 'transition'; //one day all browsers will have this
  
                  var durationKey = 'Duration';
                  var duration = 0;
                  //we want all the styles defined before and after
                  forEach(element, function(element) {
                    var globalStyles = $window.getComputedStyle(element) || {};
                    duration = Math.max(
                        parseFloat(globalStyles[w3cTransitionProp    + durationKey]) ||
                        parseFloat(globalStyles[vendorTransitionProp + durationKey]) ||
                        0,
                        duration);
                  });
                  $window.setTimeout(done, duration * 1000);
                } else {
                  done();
                }
              }
  
              function done() {
                afterFn(element, parent, after);
                element.removeClass(setupClass);
                element.removeClass(startClass);
                element.removeData(NG_ANIMATE_CONTROLLER);
              }
            }
          }
        }
  
        function show(element) {
          element.css('display', '');
        }
  
        function hide(element) {
          element.css('display', 'none');
        }
  
        function insert(element, parent, after) {
          if (after) {
            after.after(element);
          } else {
            parent.append(element);
          }
        }
  
        function remove(element) {
          element.remove();
        }
  
        function move(element, parent, after) {
          // Do not remove element before insert. Removing will cause data associated with the
          // element to be dropped. Insert will implicitly do the remove.
          insert(element, parent, after);
        }
      };

    /**
     * @ngdoc function
     * @name ng.animator#enabled
     * @methodOf ng.$animator
     * @function
     *
     * @param {Boolean=} If provided then set the animation on or off.
     * @return {Boolean} Current animation state.
     *
     * @description
     * Globally enables/disables animations.
     *
    */
    AnimatorService.enabled = function(value) {
      if (arguments.length) {
        rootAnimateController.running = !value;
      }
      return !rootAnimateController.running;
    };

    return AnimatorService;
  }];
};
