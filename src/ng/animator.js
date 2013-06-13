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
 * | {@link ngRoute.directive:ngView#animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#animations ngIf}                 | enter and leave                                    |
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
 * //!annotate="animation" ngAnimate|This *expands* to `{ enter: 'animation-enter', leave: 'animation-leave', ...}`</strong>
 * <ANY ng-directive ng-animate=" 'animation' "></ANY>
 *
 * <!-- keep in mind that ng-animate can take expressions -->
 * //!annotate="computeCurrentAnimation\(\)" Scope Function|This will be called each time the scope changes...
 * <ANY ng-directive ng-animate=" computeCurrentAnimation() "></ANY>
 *
 * <!--
 *  By providing more than one animation value (separated by spaces) for each event,
 *  multiple animations can be run in parallel.
 * -->
 * <ANY ng-directive ng-animate="{ enter: 'one two', leave: 'three four'}"></ANY>
 * </pre>
 *
 * The `event1` and `event2` attributes refer to the animation events specific to the directive that has been assigned.
 *
 * Keep in mind that if an animation is running, no child element of such animation can also be animated.
 *
 * <h2>CSS-defined Animations</h2>
 * By default, ngAnimate attaches two CSS classes per animation event to the DOM element to achieve the animation.
 * It is up to you, the developer, to ensure that the animations take place using cross-browser CSS3 transitions as
 * well as CSS animations.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with ngAnimate:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animate-enter CSS class is the event name that you
 *  have provided within the ngAnimate attribute.
 * &#42;/
 * .animate-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  -moz-transition: 1s linear all; /&#42; Firefox &#42;/
 *  -o-transition: 1s linear all; /&#42; Opera &#42;/
 *  transition: 1s linear all; /&#42; IE10+ and Future Browsers &#42;/
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
 * .animate-enter.animate-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div ng-directive ng-animate="{enter: 'animate-enter'}"></div>
 * </pre>
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with ngAnimate:
 *
 * <pre>
 * <style type="text/css">
 * .animate-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   -moz-animation: enter_sequence 1s linear; /&#42; Firefox &#42;/
 *   -o-animation: enter_sequence 1s linear; /&#42; Opera &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * &#64-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64-moz-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64-o-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div ng-directive ng-animate="{enter: 'animate-enter'}"></div>
 * </pre>
 *
 * ngAnimate will first examine any CSS animation code and then fallback to using CSS transitions.
 *
 * Upon DOM mutation, the event class is added first, then the browser is allowed to reflow the content and then,
 * the active class is added to trigger the animation. The ngAnimate directive will automatically extract the duration
 * of the animation to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at it's final state. This final state is when the DOM element
 * has no CSS transition/animation classes surrounding it.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations to browsers that do not
 * yet support them, then you can make use of JavaScript animations defined inside of your AngularJS module.
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
 * animations, ngAnimate will also add in the same CSS classes that CSS-enabled animations do (even if you're not using
 * CSS animations) to animated the element, but it will not attempt to find any CSS3 transition or animation duration/delay values.
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
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.enter = function(element, parent, after, done) {
          performAnimation(extractClassName('enter'), insert, noop, element, parent, after, done);
        }

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
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.leave = function(element, parent, done) {
          performAnimation(extractClassName('leave'), noop, remove, element, parent, null, done);
        }

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
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.move = function(element, parent, after, done) {
          performAnimation(extractClassName('move'), move, noop, element, parent, after, done);
        }

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
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.show = function(element, done) {
          performAnimation(extractClassName('show'), show, noop, element, null, null, done);
        }

        /**
         * @ngdoc function
         * @name ng.animator#hide
         * @methodOf ng.$animator
         *
         * @description
         * Starts the hide animation first and sets the CSS `display` property to `none` upon completion.
         *
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.hide = function(element, done) {
          performAnimation(extractClassName('hide'), noop, hide, element, null, null, done);
        }

        /**
         * @ngdoc function
         * @name ng.animator#animate
         * @methodOf ng.$animator
         *
         * @description
         * Triggers a custom animation event to be executed on the given element
         *
         * @param {string} event the name of the custom event
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.animate = function(event, element, done) {
          performAnimation(extractClassName(event), noop, noop, element, null, null, done);
        }

        /**
         * @ngdoc function
         * @name ng.animator#addClass
         * @methodOf ng.$animator
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animator will suffix the className value with {@type -add} in order to provide
         * the animator the setup and active CSS classes in order to trigger the animation.
         *
         * For example, upon execution of:
         *
         * <pre>
         * animator.addClass(element, 'super');
         * </pre>
         *
         * The generated CSS class values present on element will look like:
         * <pre>
         * .super-add
         * .super-add-active
         * </pre>
         *
         * And upon completion, the generated animation CSS classes will be removed from the element, but the className
         * value will be attached to the element. In this case, based on the previous example, the resulting CSS class for the element
         * will look like so:
         *
         * <pre>
         * .super
         * </pre>
         *
         * Once this is complete, then the done callback, if provided, will be fired.
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then attached to the element
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.addClass = function(element, className, done) {
          performAnimation(suffixClasses(className,'-add'), noop, noop, element, null, null, function() {
            className = isString(className) ? className : className.join(' ');
            element.addClass(className);
            (done || noop)();
          });
        }

        /**
         * @ngdoc function
         * @name ng.animator#removeClass
         * @methodOf ng.$animator
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animator will suffix the className value with {@type -remove} in
         * order to provide the animator the setup and active CSS classes in order to trigger the animation.
         *
         * For example, upon the execution of:
         *
         * <pre>
         * animator.removeClass(element, 'super');
         * </pre>
         *
         * The generated CSS class values present on element will look like:
         *
         * <pre>
         * .super-remove
         * .super-remove-active
         * </pre>
         *
         * And upon completion, the generated animation CSS classes will be removed from the element as well as the
         * className value that was provided (in this case {@type super} will be removed). Once that is complete, then, if provided,
         * the done callback will be fired.
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        animator.removeClass = function(element, className, done) {
          performAnimation(suffixClasses(className,'-remove'), noop, noop, element, null, null, function() {
            className = isString(className) ? className : className.join(' ');
            element.removeClass(className);
            (done || noop)();
          });
        }

        return animator;

        function suffixClasses(classes, suffix) {
          var className = '';
          classes = isArray(classes) ? classes : classes.split(/\s+/);
          forEach(classes, function(klass, i) {
            if(klass && klass.length > 0) {
              className += (i > 0 ? ' ' : '') + klass + suffix;
            }
          });
          return className;
        }

        function extractClassName(type) {
          var ngAnimateValue = scope.$eval(attrs.ngAnimate);
          return ngAnimateValue
              ? isObject(ngAnimateValue) ? ngAnimateValue[type] : ngAnimateValue + '-' + type
              : '';
        }

        function performAnimation(classes, beforeFn, afterFn, element, parent, after, onComplete) {
          onComplete = onComplete || noop;
          if (classes == null || classes.length == 0) {
            beforeFn(element, parent, after);
            afterFn(element, parent, after);
            onComplete();
          } else {
            classes = isArray(classes) ? classes : classes.split(/\s+/);
            var animations = [],
                className = '',
                activeClassName = '';
            forEach(classes, function(klass, i) {
              var space = i > 0 ? ' ' : '';
              activeClassName += space + klass + '-active';
              className += space + klass;

              var polyfill = $animation(klass);
              if(polyfill) {
                animations.push({
                  setup : polyfill.setup || noop,
                  cancel : polyfill.cancel || noop,
                  start : polyfill.start
                });
              }
            });

            if (!parent) {
              parent = after ? after.parent() : element.parent();
            }
            var disabledAnimation = { running : true };
            if ((!$sniffer.transitions && animations.length == 0) ||
                (parent.inheritedData(NG_ANIMATE_CONTROLLER) || disabledAnimation).running) {
              beforeFn(element, parent, after);
              afterFn(element, parent, after);
              done();
              return;
            }

            var animationData = element.data(NG_ANIMATE_CONTROLLER) || {};
            if(animationData.running) {
              forEach(animations, function(animation) {
                animation.cancel(element);
              });
              animationData.done();
            }

            element.data(NG_ANIMATE_CONTROLLER, {running:true, done:done});
            element.addClass(className);
            beforeFn(element, parent, after);
            if (element.length == 0) return done();

            forEach(animations, function(animation) {
              animation.memo = animation.setup(element);
            });

            // $window.setTimeout(beginAnimation, 0); this was causing the element not to animate
            // keep at 1 for animation dom rerender
            var cssAnimationsPerformed = false,
                jsAnimationsPerformed = false;
            $window.setTimeout(beginAnimation, 1);
          }

          function parseMaxTime(str) {
            var total = 0, values = isString(str) ? str.split(/\s*,\s*/) : [];
            forEach(values, function(value) {
              total = Math.max(parseFloat(value) || 0, total);
            });
            return total;
          }

          function beginAnimation() {
            if(done.run) return;

            element.addClass(activeClassName);
            var duration = 0;

            if (isFunction($window.getComputedStyle)) {
              //one day all browsers will have these properties
              var w3cAnimationProp = 'animation';
              var w3cTransitionProp = 'transition';

              //but some still use vendor-prefixed styles
              var vendorAnimationProp = $sniffer.vendorPrefix + 'Animation';
              var vendorTransitionProp = $sniffer.vendorPrefix + 'Transition';

              var durationKey = 'Duration',
                  delayKey = 'Delay',
                  animationIterationCountKey = 'IterationCount';

              //we want all the styles defined before and after
              var ELEMENT_NODE = 1;
              forEach(element, function(element) {
                if (element.nodeType == ELEMENT_NODE) {
                  var elementStyles = $window.getComputedStyle(element) || {};

                  var transitionDelay     = Math.max(parseMaxTime(elementStyles[w3cTransitionProp     + delayKey]),
                                                     parseMaxTime(elementStyles[vendorTransitionProp  + delayKey]));

                  var animationDelay      = Math.max(parseMaxTime(elementStyles[w3cAnimationProp      + delayKey]),
                                                     parseMaxTime(elementStyles[vendorAnimationProp   + delayKey]));

                  var transitionDuration  = Math.max(parseMaxTime(elementStyles[w3cTransitionProp     + durationKey]),
                                                     parseMaxTime(elementStyles[vendorTransitionProp  + durationKey]));

                  var animationDuration   = Math.max(parseMaxTime(elementStyles[w3cAnimationProp      + durationKey]),
                                                     parseMaxTime(elementStyles[vendorAnimationProp   + durationKey]));

                  if(animationDuration > 0) {
                    animationDuration *= Math.max(parseInt(elementStyles[w3cAnimationProp    + animationIterationCountKey]) || 0,
                                                 parseInt(elementStyles[vendorAnimationProp + animationIterationCountKey]) || 0,
                                                 1);
                  }

                  duration = Math.max(animationDelay  + animationDuration,
                                      transitionDelay + transitionDuration,
                                      duration);
                }
              });
            }
            else {
              done();
              return;
            }

            cssAnimationsPerformed = duration == 0;
            jsAnimationsPerformed = animations.length == 0;

            if (animations.length > 0) {
              forEach(animations, function(animation, index) {
                animation.start(element, function() {
                  progress(index);
                }, animation.memo);
              });

              //in the event that there are no CSS animations, but there
              //are JS animations, then it's pointless to have an
              //additional setTimeout operation since duration == 0
              if(cssAnimationsPerformed) return;
            }

            $window.setTimeout(function() {
              progress(-1); 
            }, duration * 1000);
          }

          function progress(index) {
            if(index == -1) {
              cssAnimationsPerformed = true;
            }
            if(index >= 0) {
              jsAnimationsPerformed = true;
              animations[index].done = true;
              for(var i=0;i<animations.length;i++) {
                if(!animations[index].done) {
                  jsAnimationsPerformed = false;
                  break;
                }
              }
            }
            if(cssAnimationsPerformed && jsAnimationsPerformed) {
              done();
            }
          };

          function done() {
            if(!done.run) {
              done.run = true;
              afterFn(element, parent, after);
              element.removeClass(className);
              element.removeClass(activeClassName);
              element.removeData(NG_ANIMATE_CONTROLLER);
              onComplete();
            }
          }
        };
      }

      function show(element) {
        element.css('display', '');
      }

      function hide(element) {
        element.css('display', 'none');
      }

      function insert(element, parent, after) {
        var afterNode = after && after[after.length - 1];
        var parentNode = parent && parent[0] || afterNode && afterNode.parentNode;
        var afterNextSibling = afterNode && afterNode.nextSibling;
        forEach(element, function(node) {
          if (afterNextSibling) {
            parentNode.insertBefore(node, afterNextSibling);
          } else {
            parentNode.appendChild(node);
          }
        });
      }

      function remove(element) {
        element.remove();
      }

      function move(element, parent, after) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        insert(element, parent, after);
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
