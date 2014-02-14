'use strict';
/* jshint maxlen: false */

/**
 * @ngdoc overview
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 * {@installModule animate}
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
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
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
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
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
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
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * &#64-webkit-keyframes enter_sequence {
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
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * <pre>
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * </pre>
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * <pre>
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * </pre>
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * <pre>
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', ['ngAnimate']);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       };
 *     },
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   };
 * });
 * </pre>
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
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
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .factory('$$animateReflow', ['$window', '$timeout', '$document',
                       function($window,   $timeout,   $document) {
    var bod = $document[0].body;
    var requestAnimationFrame = $window.requestAnimationFrame       ||
                                $window.webkitRequestAnimationFrame ||
                                function(fn) {
                                  return $timeout(fn, 10, false);
                                };

    var cancelAnimationFrame = $window.cancelAnimationFrame       ||
                               $window.webkitCancelAnimationFrame ||
                               function(timer) {
                                 return $timeout.cancel(timer);
                               };
    return function(fn) {
      var id = requestAnimationFrame(function() {
        var a = bod.offsetWidth + 1;
        fn();
      });
      return function() {
        cancelAnimationFrame(id);
      };
    };
  }])

  .factory('$$asyncQueueBuffer', ['$timeout', function($timeout) {
    var timer, queue = [];
    return function(fn) {
      $timeout.cancel(timer);
      queue.push(fn);
      timer = $timeout(function() {
        for(var i = 0; i < queue.length; i++) {
          queue[i]();
        }
        queue = [];
      }, 0, false);
    };
  }])

  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    function extractElementNode(element) {
      for(var i = 0; i < element.length; i++) {
        var elm = element[i];
        if(elm.nodeType == ELEMENT_NODE) {
          return elm;
        }
      }
    }

    function stripCommentsFromElement(element) {
      return angular.element(extractElementNode(element));
    }

    function isMatchingElement(elm1, elm2) {
      return extractElementNode(elm1) == extractElementNode(elm2);
    }

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$$asyncQueueBuffer', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $$asyncQueueBuffer,    $rootScope,   $document) {

      var globalAnimationCounter = 0;
      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, wait again
      // for another digest until enabling animations. The reason why we digest twice
      // is because all structural animations (enter, leave and move) all perform a
      // post digest operation before animating. If we only wait for a single digest
      // to pass then the structural animation would render its animation on page load.
      // (which is what we're trying to avoid when the application first boots up.)
      $rootScope.$$postDigest(function() {
        $rootScope.$$postDigest(function() {
          rootAnimateState.running = false;
        });
      });

      var classNameFilter = $animateProvider.classNameFilter();
      var isAnimatableClassName = !classNameFilter
              ? function() { return true; }
              : function(className) {
                return classNameFilter.test(className);
              };

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
       * @function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
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
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          this.enabled(false, element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
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
         * Below is a breakdown of each step that occurs during leave animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('leave', 'ng-leave', element, null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#move
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
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
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          element = stripCommentsFromElement(element);
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
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
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          element = stripCommentsFromElement(element);
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

          /**
           *
           * @ngdoc function
           * @name ng.$animate#setClass
           * @methodOf ng.$animate
           * @function
           * @description Adds and/or removes the given CSS classes to and from the element.
           * Once complete, the done() callback will be fired (if provided).
           * @param {jQuery/jqLite element} element the element which will it's CSS classes changed
           *   removed from it
           * @param {string} add the CSS classes which will be added to the element
           * @param {string} remove the CSS class which will be removed from the element
           * @param {function=} done the callback function (if provided) that will be fired after the
           *   CSS classes have been set on the element
           */
        setClass : function(element, add, remove, doneCallback) {
          element = stripCommentsFromElement(element);
          performAnimation('setClass', [add, remove], element, null, null, function() {
            $delegate.setClass(element, add, remove);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enabled
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @param {jQuery/jqLite element=} element If provided then the element will be used to represent the enable/disable operation
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
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {

        var classNameAdd, classNameRemove, setClassOperation = animationEvent == 'setClass';
        if(setClassOperation) {
          classNameAdd = className[0];
          classNameRemove = className[1];
          className = classNameAdd + ' ' + classNameRemove;
        }

        var currentClassName, classes, node = element[0];
        if(node) {
          currentClassName = node.className;
          classes = currentClassName + ' ' + className;
        }

        //transcluded directives may sometimes fire an animation using only comment nodes
        //best to catch this early on to prevent any animation operations from occurring
        if(!node || !isAnimatableClassName(classes)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        var elementEvents = angular.element._data(node);
        elementEvents = elementEvents && elementEvents.events;

        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var matches         = lookup(animationLookup);
        var isClassBased    = animationEvent == 'addClass' ||
                              animationEvent == 'removeClass' ||
                              setClassOperation;
        var ngAnimateState  = element.data(NG_ANIMATE_STATE) || {};

        var runningAnimations     = ngAnimateState.active || {};
        var totalActiveAnimations = ngAnimateState.totalActive || 0;
        var lastAnimation         = ngAnimateState.last;

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case a NO animation is not found.
        if (animationsDisabled(element, parentElement) || matches.length === 0) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        var animations = [];

        //only add animations if the currently running animation is not structural
        //or if there is no animation running at all
        var allowAnimations = isClassBased ?
          !ngAnimateState.disabled && (!lastAnimation || lastAnimation.classBased) :
          true;

        if(allowAnimations) {
          forEach(matches, function(animation) {
            //add the animation to the queue to if it is allowed to be cancelled
            if(!animation.allowCancel || animation.allowCancel(element, animationEvent, className)) {
              var beforeFn, afterFn = animation[animationEvent];

              //Special case for a leave animation since there is no point in performing an
              //animation on a element node that has already been removed from the DOM
              if(animationEvent == 'leave') {
                beforeFn = afterFn;
                afterFn = null; //this must be falsy so that the animation is skipped for leave
              } else {
                beforeFn = animation['before' + animationEvent.charAt(0).toUpperCase() + animationEvent.substr(1)];
              }
              animations.push({
                before : beforeFn,
                after : afterFn
              });
            }
          });
        }

        //this would mean that an animation was not allowed so let the existing
        //animation do it's thing and close this one early
        if(animations.length === 0) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        var skipAnimation = false;
        if(totalActiveAnimations > 0) {
          var animationsToCancel = [];
          if(!isClassBased) {
            if(animationEvent == 'leave' && runningAnimations['ng-leave']) {
              skipAnimation = true;
            } else {
              //cancel all animations when a structural animation takes place
              for(var klass in runningAnimations) {
                animationsToCancel.push(runningAnimations[klass]);
                cleanup(element, klass);
              }
              runningAnimations = {};
              totalActiveAnimations = 0;
            }
          } else if(lastAnimation.event == 'setClass') {
            animationsToCancel.push(lastAnimation);
            cleanup(element, className);
          }
          else if(runningAnimations[className]) {
            var current = runningAnimations[className];
            if(current.event == animationEvent) {
              skipAnimation = true;
            } else {
              animationsToCancel.push(current);
              cleanup(element, className);
            }
          }

          if(animationsToCancel.length > 0) {
            angular.forEach(animationsToCancel, function(operation) {
              (operation.done || noop)(true);
              cancelAnimations(operation.animations);
            });
          }
        }

        if(isClassBased && !setClassOperation && !skipAnimation) {
          skipAnimation = (animationEvent == 'addClass') == element.hasClass(className); //opposite of XOR
        }

        if(skipAnimation) {
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        var localAnimationCount = globalAnimationCounter++;
        lastAnimation = {
          classBased : isClassBased,
          event : animationEvent,
          animations : animations,
          done:onBeforeAnimationsComplete
        };

        totalActiveAnimations++;
        runningAnimations[className] = lastAnimation;

        element.data(NG_ANIMATE_STATE, {
          last : lastAnimation,
          active : runningAnimations,
          index : localAnimationCount,
          totalActive : totalActiveAnimations
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        invokeRegisteredAnimationFns(animations, 'before', onBeforeAnimationsComplete);

        function onBeforeAnimationsComplete(cancelled) {
          var data = element.data(NG_ANIMATE_STATE);
          cancelled = cancelled ||
                      !data || !data.active[className] ||
                      (isClassBased && data.active[className].event != animationEvent);

          fireDOMOperation();
          if(cancelled === true) {
            closeAnimation();
            return;
          }

          //set the done function to the final done function
          //so that the DOM event won't be executed twice by accident
          //if the after animation is cancelled as well
          var currentAnimation = data.active[className];
          currentAnimation.done = closeAnimation;
          invokeRegisteredAnimationFns(animations, 'after', closeAnimation);
        }

        function invokeRegisteredAnimationFns(animations, phase, allAnimationFnsComplete) {
          phase == 'after' ?
            fireAfterCallbackAsync() :
            fireBeforeCallbackAsync();

          var endFnName = phase + 'End';
          forEach(animations, function(animation, index) {
            var animationPhaseCompleted = function() {
              progress(index, phase);
            };

            //there are no before functions for enter + move since the DOM
            //operations happen before the performAnimation method fires
            if(phase == 'before' && (animationEvent == 'enter' || animationEvent == 'move')) {
              animationPhaseCompleted();
              return;
            }

            if(animation[phase]) {
              if(setClassOperation) {
                animation[endFnName] = animation[phase](element, classNameAdd, classNameRemove, animationPhaseCompleted);
              } else {
                animation[endFnName] = isClassBased ?
                  animation[phase](element, className, animationPhaseCompleted) :
                  animation[phase](element, animationPhaseCompleted);
              }
            } else {
              animationPhaseCompleted();
            }
          });

          function progress(index, phase) {
            var phaseCompletionFlag = phase + 'Complete';
            var currentAnimation = animations[index];
            currentAnimation[phaseCompletionFlag] = true;
            (currentAnimation[endFnName] || noop)();

            for(var i=0;i<animations.length;i++) {
              if(!animations[i][phaseCompletionFlag]) return;
            }

            allAnimationFnsComplete();
          }
        }

        function fireDOMCallback(animationPhase) {
          var eventName = '$animate:' + animationPhase;
          if(elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
            $$asyncQueueBuffer(function() {
              element.triggerHandler(eventName, {
                event : animationEvent,
                className : className
              });
            });
          }
        }

        function fireBeforeCallbackAsync() {
          fireDOMCallback('before');
        }

        function fireAfterCallbackAsync() {
          fireDOMCallback('after');
        }

        function fireDoneCallbackAsync() {
          fireDOMCallback('close');
          if(doneCallback) {
            $$asyncQueueBuffer(function() {
              doneCallback();
            });
          }
        }

        //it is less complicated to use a flag than managing and cancelling
        //timeouts containing multiple callbacks.
        function fireDOMOperation() {
          if(!fireDOMOperation.hasBeenRun) {
            fireDOMOperation.hasBeenRun = true;
            domOperation();
          }
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(isClassBased) {
                cleanup(element, className);
              } else {
                $$asyncQueueBuffer(function() {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  if(localAnimationCount == data.index) {
                    cleanup(element, className, animationEvent);
                  }
                });
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = extractElementNode(element);
        forEach(node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME), function(element) {
          element = angular.element(element);
          var data = element.data(NG_ANIMATE_STATE);
          if(data && data.active) {
            angular.forEach(data.active, function(operation) {
              (operation.done || noop)(true);
              cancelAnimations(operation.animations);
            });
          }
        });
      }

      function cancelAnimations(animations) {
        var isCancelledFlag = true;
        forEach(animations, function(animation) {
          if(!animation.beforeComplete) {
            (animation.beforeEnd || noop)(isCancelledFlag);
          }
          if(!animation.afterComplete) {
            (animation.afterEnd || noop)(isCancelledFlag);
          }
        });
      }

      function cleanup(element, className) {
        if(isMatchingElement(element, $rootElement)) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else if(className) {
          var data = element.data(NG_ANIMATE_STATE) || {};

          var removeAnimations = className === true;
          if(!removeAnimations) {
            if(data.active && data.active[className]) {
              data.totalActive--;
              delete data.active[className];
            }
          }

          if(removeAnimations || !data.totalActive) {
            element.removeClass(NG_ANIMATE_CLASS_NAME);
            element.removeData(NG_ANIMATE_STATE);
          }
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) return true;

        if(isMatchingElement(element, $rootElement)) {
          return rootAnimateState.disabled || rootAnimateState.running;
        }

        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if(parentElement.length === 0) break;

          var isRoot = isMatchingElement(parentElement, $rootElement);
          var state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE);
          var result = state && (!!state.disabled || state.running || state.totalActive > 0);
          if(isRoot || result) {
            return result;
          }

          if(isRoot) return true;
        }
        while(parentElement = parentElement.parent());

        return true;
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                           function($window,   $sniffer,   $timeout,   $$animateReflow) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var NG_ANIMATE_BLOCK_CLASS_NAME = 'ng-animate-block-transitions';
      var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
      var CLOSING_TIME_BUFFER = 1.5;
      var ONE_SECOND = 1000;

      var lookupCache = {};
      var parentCounter = 0;
      var animationReflowQueue = [];
      var cancelAnimationReflow;
      function afterReflow(element, callback) {
        if(cancelAnimationReflow) {
          cancelAnimationReflow();
        }
        animationReflowQueue.push(callback);
        cancelAnimationReflow = $$animateReflow(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });

          animationReflowQueue = [];
          cancelAnimationReflow = null;
          lookupCache = {};
        });
      }

      var closingTimer = null;
      var closingTimestamp = 0;
      var animationElementQueue = [];
      function animationCloseHandler(element, totalTime) {
        var futureTimestamp = Date.now() + (totalTime * 1000);
        if(futureTimestamp <= closingTimestamp) {
          return;
        }

        $timeout.cancel(closingTimer);

        var node = extractElementNode(element);
        element = angular.element(node);
        animationElementQueue.push(element);

        closingTimestamp = futureTimestamp;
        closingTimer = $timeout(function() {
          closeAllAnimations(animationElementQueue);
          animationElementQueue = [];
        }, totalTime, false);
      }

      function closeAllAnimations(elements) {
        forEach(elements, function(element) {
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(elementData) {
            (elementData.closeAnimationFn || noop)();
          }
        });
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + extractElementNode(element).className;
      }

      function animateSetup(animationEvent, element, className, calculationDecorator) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        var stagger = {};
        if(itemIndex > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        /* the animation itself may need to add/remove special CSS classes
         * before calculating the anmation styles */
        calculationDecorator = calculationDecorator ||
                               function(fn) { return fn(); };

        element.addClass(className);

        var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};

        var timings = calculationDecorator(function() {
          return getElementAnimationDetails(element, eventCacheKey);
        });

        var transitionDuration = timings.transitionDuration;
        var animationDuration = timings.animationDuration;
        if(transitionDuration === 0 && animationDuration === 0) {
          element.removeClass(className);
          return false;
        }

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          running : formerData.running || 0,
          itemIndex : itemIndex,
          stagger : stagger,
          timings : timings,
          closeAnimationFn : angular.noop
        });

        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var isCurrentlyAnimating = formerData.running > 0 || animationEvent == 'setClass';
        if(transitionDuration > 0) {
          blockTransitions(element, className, isCurrentlyAnimating);
        }
        if(animationDuration > 0) {
          blockKeyframeAnimations(element);
        }

        return true;
      }

      function isStructuralAnimation(className) {
        return className == 'ng-enter' || className == 'ng-move' || className == 'ng-leave';
      }

      function blockTransitions(element, className, isAnimating) {
        if(isStructuralAnimation(className) || !isAnimating) {
          extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
        } else {
          element.addClass(NG_ANIMATE_BLOCK_CLASS_NAME);
        }
      }

      function blockKeyframeAnimations(element) {
        extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
      }

      function unblockTransitions(element, className) {
        var prop = TRANSITION_PROP + PROPERTY_KEY;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
        element.removeClass(NG_ANIMATE_BLOCK_CLASS_NAME);
      }

      function unblockKeyframeAnimations(element) {
        var prop = ANIMATION_PROP;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
      }

      function animateRun(animationEvent, element, className, activeAnimationComplete) {
        var node = extractElementNode(element);
        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(node.className.indexOf(className) == -1 || !elementData) {
          activeAnimationComplete();
          return;
        }

        var activeClassName = '';
        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        var stagger = elementData.stagger;
        var timings = elementData.timings;
        var itemIndex = elementData.itemIndex;
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
        var maxDelayTime = maxDelay * ONE_SECOND;

        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;

        var style = '', appliedStyles = [];
        if(timings.transitionDuration > 0) {
          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
            appliedStyles.push(CSS_PREFIX + 'transition-property');
            appliedStyles.push(CSS_PREFIX + 'transition-duration');
          }
        }

        if(itemIndex > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'transition-delay');
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'animation-delay');
          }
        }

        if(appliedStyles.length > 0) {
          //the element being animated may sometimes contain comment nodes in
          //the jqLite object, so we're safe to use a single variable to house
          //the styles since there is always only one element being animated
          var oldStyle = node.getAttribute('style') || '';
          node.setAttribute('style', oldStyle + ' ' + style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);
        elementData.closeAnimationFn = function() {
          onEnd();
          activeAnimationComplete();
        };

        var staggerTime       = itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);
        var animationTime     = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
        var totalTime         = (staggerTime + animationTime) * ONE_SECOND;

        elementData.running++;
        animationCloseHandler(element, totalTime);
        return onEnd;

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          var node = extractElementNode(element);
          for (var i in appliedStyles) {
            node.style.removeProperty(appliedStyles[i]);
          }
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();

          /* Firefox (or possibly just Gecko) likes to not round values up
           * when a ms measurement is used for the animation */
          var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(animationEvent, element, className, calculationDecorator) {
        if(animateSetup(animationEvent, element, className, calculationDecorator)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(animationEvent, element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(animationEvent, element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(animationEvent, element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(animationEvent, element, className);
        if(!preReflowCancellation) {
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(element, function() {
          unblockTransitions(element, className);
          unblockKeyframeAnimations(element);
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(animationEvent, element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(data) {
          if(data.running) {
            data.running--;
          }
          if(!data.running || data.running === 0) {
            element.removeData(NG_ANIMATE_CSS_DATA_KEY);
          }
        }
      }

      return {
        enter : function(element, animationCompleted) {
          return animate('enter', element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate('leave', element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate('move', element, 'ng-move', animationCompleted);
        },

        beforeSetClass : function(element, add, remove, animationCompleted) {
          var className = suffixClasses(remove, '-remove') + ' ' +
                          suffixClasses(add, '-add');
          var cancellationMethod = animateBefore('setClass', element, className, function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(remove);
            element.addClass(add);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), function(fn) {

            /* when a CSS class is added to an element then the transition style that
             * is applied is the transition defined on the element when the CSS class
             * is added at the time of the animation. This is how CSS3 functions
             * outside of ngAnimate. */
            element.addClass(className);
            var timings = fn();
            element.removeClass(className);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        setClass : function(element, add, remove, animationCompleted) {
          remove = suffixClasses(remove, '-remove');
          add = suffixClasses(add, '-add');
          var className = remove + ' ' + add;
          return animateAfter('setClass', element, className, animationCompleted);
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(className);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted);
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
