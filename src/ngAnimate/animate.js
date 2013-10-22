'use strict';
/* jshint maxlen: false */

/**
 * @ngdoc overview
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * `ngAnimate` is an optional module that provides CSS and JavaScript animation hooks.
 *
 * {@installModule animate}
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the $animation service. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngSwitch`, `ngShow`, `ngHide` and `ngView`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * <pre>
 * <style type="text/css">
 * .slide.ng-enter > div,
 * .slide.ng-leave > div {
 *   -webkit-transition:0.5s linear all;
 *   -moz-transition:0.5s linear all;
 *   -o-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * </pre>
 *
 * Keep in mind that if an animation is running, any child elements cannot be animated until the parent element's
 * animation has completed.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
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
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * .reveal-animation.ng-enter {
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
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * <pre>
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', []);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation
 *       //!annotate Cancel Animation|This function (if provided) will perform the cancellation of the animation when another is triggered
 *       return function(element, done) {
 *         //cancel the animation
 *       }
 *     }
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *     show: function(element, done) { },
 *     hide: function(element, done) { },
 *     addClass: function(element, className, done) { },
 *     removeClass: function(element, className, done) { },
 *   }
 * });
 * </pre>
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function
 * be executed. It should be also noted that only simple class selectors are allowed.
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc object
   * @name ngAnimate.$animateProvider
   * @description
   *
   * The `$AnimationProvider` allows developers to register and access custom JavaScript animations directly inside
   * of a module. When an animation is triggered, the $animate service will query the $animation function to find any
   * animations that match the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running:true};
    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$timeout', '$rootScope',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $timeout,   $rootScope) {

      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations
          if ($sniffer.transitions || $sniffer.animations) {
            classes.push('');
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      /**
       * @ngdoc object
       * @name ngAnimate.$animate
       * @requires $timeout, $sniffer, $rootElement
       * @function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move)
       * as well as during addClass and removeClass operations. When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enter
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Appends the element to the parent element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like   |
         * |----------------------------------------------------------------------------------------------|-----------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                          |
         * | 2. element is inserted into the parent element or beside the after element                   | class="my-animation"                          |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation"                          |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-enter"                 |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-enter"                 |
         * | 6. the .ng-enter-active class is added (this triggers the CSS transition/animation)          | class="my-animation ng-enter ng-enter-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-enter ng-enter-active" |
         * | 8. The animation ends and both CSS classes are removed from the element                      | class="my-animation"                          |
         * | 9. The done() callback is fired (if provided)                                                | class="my-animation"                          |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        enter : function(element, parent, after, done) {
          this.enabled(false, element);
          $delegate.enter(element, parent, after);
          $rootScope.$$postDigest(function() {
            performAnimation('enter', 'ng-enter', element, parent, after, function() {
              done && $timeout(done, 0, false);
            });
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#leave
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like  |
         * |----------------------------------------------------------------------------------------------|----------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                         |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation"                         |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-leave"                |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-leave"                |
         * | 5. the .ng-leave-active class is added (this triggers the CSS transition/animation)          | class="my-animation ng-leave ng-leave-active |
         * | 6. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-leave ng-leave-active |
         * | 7. The animation ends and both CSS classes are removed from the element                      | class="my-animation"                         |
         * | 8. The element is removed from the DOM                                                       | ...                                          |
         * | 9. The done() callback is fired (if provided)                                                | ...                                          |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        leave : function(element, done) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', element, null, null, function() {
              $delegate.leave(element, done);
            });
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#move
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parent container or
         * add the element directly after the after element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parent element or beside the after element                      | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation"                        |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-move"                |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-move"                |
         * | 6. the .ng-move-active class is added (this triggers the CSS transition/animation)           | class="my-animation ng-move ng-move-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-move ng-move-active" |
         * | 8. The animation ends and both CSS classes are removed from the element                      | class="my-animation"                        |
         * | 9. The done() callback is fired (if provided)                                                | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        move : function(element, parent, after, done) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $delegate.move(element, parent, after);
          $rootScope.$$postDigest(function() {
            performAnimation('move', 'ng-move', element, null, null, function() {
              done && $timeout(done, 0, false);
            });
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#addClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class=""                                    |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class=""                                    |
         * | 3. the .super-add class is added to the element                                                | class="super-add"                           |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="super-add"                           |
         * | 5. the .super-add-active class is added (this triggers the CSS transition/animation)           | class="super-add super-add-active"          |
         * | 6. $animate waits for X milliseconds for the animation to complete                             | class="super-add super-add-active"          |
         * | 7. The animation ends and both CSS classes are removed from the element                        | class=""                                    |
         * | 8. The super class is added to the element                                                     | class="super"                               |
         * | 9. The done() callback is fired (if provided)                                                  | class="super"                               |
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then attached to the element
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        addClass : function(element, className, done) {
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className, done);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#removeClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove CSS class).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|-------------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="super"                                   |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="super"                                   |
         * | 3. the .super-remove class is added to the element                                            | class="super super-remove"                      |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="super super-remove"                      |
         * | 5. the .super-remove-active class is added (this triggers the CSS transition/animation)       | class="super super-remove super-remove-active"  |
         * | 6. $animate waits for X milliseconds for the animation to complete                            | class="super super-remove super-remove-active"  |
         * | 7. The animation ends and both CSS all three classes are removed from the element             | class=""                                        |
         * | 8. The done() callback is fired (if provided)                                                 | class=""                                        |
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} done callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, done) {
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className, done);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enabled
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              }
              else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.structural = true;
                data.running = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.running = !value;
            break;

            default:
              value = !rootAnimateState.running;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The event variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parent and after are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(event, className, element, parent, after, onComplete) {
        var classes = (element.attr('class') || '') + ' ' + className;
        var animationLookup = (' ' + classes).replace(/\s+/g,'.'),
            animations = [];
        forEach(lookup(animationLookup), function(animation, index) {
          animations.push({
            start : animation[event]
          });
        });

        if (!parent) {
          parent = after ? after.parent() : element.parent();
        }
        var disabledAnimation = { running : true };

        //skip the animation if animations are disabled, a parent is already being animated
        //or the element is not currently attached to the document body.
        if ((parent.inheritedData(NG_ANIMATE_STATE) || disabledAnimation).running || animations.length === 0) {
          done();
          return;
        }

        var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};

        var isClassBased = event == 'addClass' || event == 'removeClass';
        if(ngAnimateState.running) {
          if(isClassBased && ngAnimateState.structural) {
            onComplete && onComplete();
            return;
          }

          //if an animation is currently running on the element then lets take the steps
          //to cancel that animation and fire any required callbacks
          $timeout.cancel(ngAnimateState.flagTimer);
          cancelAnimations(ngAnimateState.animations);
          (ngAnimateState.done || noop)();
        }

        element.data(NG_ANIMATE_STATE, {
          running:true,
          structural:!isClassBased,
          animations:animations,
          done:done
        });

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        forEach(animations, function(animation, index) {
          var fn = function() {
            progress(index);
          };

          if(animation.start) {
            animation.endFn = isClassBased ?
              animation.start(element, className, fn) :
              animation.start(element, fn);
          } else {
            fn();
          }
        });

        function progress(index) {
          animations[index].done = true;
          (animations[index].endFn || noop)();
          for(var i=0;i<animations.length;i++) {
            if(!animations[i].done) return;
          }
          done();
        }

        function done() {
          if(!done.hasBeenRun) {
            done.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(isClassBased) {
                cleanup(element);
              } else {
                data.flagTimer = $timeout(function() {
                  cleanup(element);
                }, 0, false);
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            (onComplete || noop)();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = element[0];
        if(node.nodeType != ELEMENT_NODE) {
          return;
        }

        angular.forEach(node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME), function(element) {
          element = angular.element(element);
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            cancelAnimations(data.animations);
            cleanup(element);
          }
        });
      }

      function cancelAnimations(animations) {
        var isCancelledFlag = true;
        forEach(animations, function(animation) {
          (animation.endFn || noop)(isCancelledFlag);
        });
      }

      function cleanup(element) {
        element.removeClass(NG_ANIMATE_CLASS_NAME);
        element.removeData(NG_ANIMATE_STATE);
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', function($window, $sniffer, $timeout) {
      var forEach = angular.forEach;

      // Detect proper transitionend/animationend event names.
      var transitionProp, transitionendEvent, animationProp, animationendEvent;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        transitionProp = 'WebkitTransition';
        transitionendEvent = 'webkitTransitionEnd transitionend';
      } else {
        transitionProp = 'transition';
        transitionendEvent = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        animationProp = 'WebkitAnimation';
        animationendEvent = 'webkitAnimationEnd animationend';
      } else {
        animationProp = 'animation';
        animationendEvent = 'animationend';
      }

      var durationKey = 'Duration',
          propertyKey = 'Property',
          delayKey = 'Delay',
          animationIterationCountKey = 'IterationCount';

      var NG_ANIMATE_PARENT_KEY = '$ngAnimateKey';
      var lookupCache = {};
      var parentCounter = 0;

      var animationReflowQueue = [], animationTimer, timeOut = false;
      function afterReflow(callback) {
        animationReflowQueue.push(callback);
        $timeout.cancel(animationTimer);
        animationTimer = $timeout(function() {
          angular.forEach(animationReflowQueue, function(fn) {
            fn();
          });
          animationReflowQueue = [];
          animationTimer = null;
          lookupCache = {};
        }, 10, false);
      }

      function getElementAnimationDetails(element, cacheKey, onlyCheckTransition) {
        var data = lookupCache[cacheKey];
        if(!data) {
          var transitionDuration = 0, transitionDelay = 0,
              animationDuration = 0, animationDelay = 0;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDuration = Math.max(parseMaxTime(elementStyles[transitionProp + durationKey]), transitionDuration);

              if(!onlyCheckTransition) {
                transitionDelay  = Math.max(parseMaxTime(elementStyles[transitionProp + delayKey]), transitionDelay);

                animationDelay   = Math.max(parseMaxTime(elementStyles[animationProp + delayKey]), animationDelay);

                var aDuration  = parseMaxTime(elementStyles[animationProp + durationKey]);

                if(aDuration > 0) {
                  aDuration *= parseInt(elementStyles[animationProp + animationIterationCountKey], 10) || 1;
                }

                animationDuration = Math.max(aDuration, animationDuration);
              }
            }
          });
          data = {
            transitionDelay : transitionDelay,
            animationDelay : animationDelay,
            transitionDuration : transitionDuration,
            animationDuration : animationDuration
          };
          lookupCache[cacheKey] = data;
        }
        return data;
      }

      function parseMaxTime(str) {
        var total = 0, values = angular.isString(str) ? str.split(/\s*,\s*/) : [];
        forEach(values, function(value) {
          total = Math.max(parseFloat(value) || 0, total);
        });
        return total;
      }

      function getCacheKey(element) {
        var parent = element.parent();
        var parentID = parent.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parent.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + element[0].className;
      }

      function animate(element, className, done) {

        var cacheKey = getCacheKey(element);
        if(getElementAnimationDetails(element, cacheKey, true).transitionDuration > 0) {

          done();
          return;
        }

        element.addClass(className);

        var timings = getElementAnimationDetails(element, cacheKey + ' ' + className);

        /* there is no point in performing a reflow if the animation
           timeout is empty (this would cause a flicker bug normally
           in the page. There is also no point in performing an animation
           that only has a delay and no duration */
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        if(maxDuration > 0) {
          var maxDelayTime = Math.max(timings.transitionDelay, timings.animationDelay) * 1000,
              startTime = Date.now(),
              node = element[0];

          //temporarily disable the transition so that the enter styles
          //don't animate twice (this is here to avoid a bug in Chrome/FF).
          if(timings.transitionDuration > 0) {
            node.style[transitionProp + propertyKey] = 'none';
          }

          var activeClassName = '';
          forEach(className.split(' '), function(klass, i) {
            activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
          });

          // This triggers a reflow which allows for the transition animation to kick in.
          var css3AnimationEvents = animationendEvent + ' ' + transitionendEvent;

          afterReflow(function() {
            if(timings.transitionDuration > 0) {
              node.style[transitionProp + propertyKey] = '';
            }
            element.addClass(activeClassName);
          });

          element.on(css3AnimationEvents, onAnimationProgress);

          // This will automatically be called by $animate so
          // there is no need to attach this internally to the
          // timeout done method.
          return function onEnd(cancelled) {
            element.off(css3AnimationEvents, onAnimationProgress);
            element.removeClass(className);
            element.removeClass(activeClassName);

            // Only when the animation is cancelled is the done()
            // function not called for this animation therefore
            // this must be also called.
            if(cancelled) {
              done();
            }
          };
        }
        else {
          element.removeClass(className);
          done();
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && ev.elapsedTime >= maxDuration) {
            done();
          }
        }

      }

      return {
        enter : function(element, done) {
          return animate(element, 'ng-enter', done);
        },
        leave : function(element, done) {
          return animate(element, 'ng-leave', done);
        },
        move : function(element, done) {
          return animate(element, 'ng-move', done);
        },
        addClass : function(element, className, done) {
          return animate(element, suffixClasses(className, '-add'), done);
        },
        removeClass : function(element, className, done) {
          return animate(element, suffixClasses(className, '-remove'), done);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);
