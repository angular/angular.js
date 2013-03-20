'use strict';

// NOTE: this is a pseudo directive.

/**
 * @ngdoc directive
 * @name ng.directive:ngAnimate
 *
 * @description
 * The `ngAnimate` directive works as an attribute that is attached alongside pre-existing ng directives (as well as custom directives) to
 * tie in animations into the functionality of the directive. Animations with ngAnimate work by expanding the window between DOM events
 * within directives. This allows for complex animations to take place while allowing common directives to work the way that you expect them to.
 * The ngAnimate directive has been wired together with the ngRepeat, ngInclude, ngSwitch, ngShow, ngHide and ngView directives. Custom directives
 * can be used via the {@link ng.$animator $animator service}.
 *
 * Below is a more detailed breakdown of the supported callback events provided by pre-exisitng ng directives:
 *
 * * {@link ng.directive:ngRepeat#animations ngRepeat} — enter, leave and move
 * * {@link ng.directive:ngView#animations ngView} — enter and leave
 * * {@link ng.directive:ngInclude#animations ngInclude} — enter and leave
 * * {@link ng.directive:ngSwitch#animations ngSwitch} — enter and leave
 * * {@link ng.directive:ngShow#animations ngShow & ngHide} - show and hide respectively
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of a directive that makes use of the ngAnimate attribute:
 *
 * <pre>
 * <!-- you can also use data-ng-animate, ng:animate or x-ng-animate as well -->
 * <ANY ng-directive ng-animate="event1: animation-name; event2: animation-name-2"></ANY>
 * </pre>
 *
 * The `event1` and `event2` attributes refer to the animation events specific to the directive that has been assigned.
 *
 * <h2>CSS-defined Animations</h2>
 * By default, ngAnimate attaches two CSS3 classes per animation event to the DOM element that will make use the animations. This is up to you,
 * the developer, to ensure that the animations take place using cross-browser CSS3 transitions. All that is required is the following CSS code:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animation-name prefix is the event name that you 
 *  have provided within the ngAnimate attribute.
 * &#42;/
 * .animation-name-setup {
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
 * .animation-name-setup.animation-name-start {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div ng-directive ng-animate="enter: animation-name;"></div>
 * </pre>
 *
 * Upon animation, the setup class is added first and then, when the animation takes off, the start class is added.
 * The ngAnimate directive will automatically extract the duration of the animation to figure out when it ends. Once
 * the animation is over then both CSS classes will be removed from the DOM. If a browser does not support CSS transitions
 * then the animation will start and end immediately resulting in a DOM element that is at it's final state. This final
 * state is when the DOM element has no CSS animation classes surrounding it.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 animations or if you wish to offer animations to browsers that do not
 * yet support them, then you can make use of JavaScript animations defined inside ngModule.
 *
 * <pre>
 * var ngModule = angular.module('YourApp', []);
 * ngModule.animation('animation-name', ['$inject',function($inject) {
 *   return {
 *     setup : function(element) {
 *       //prepare the element for animation
 *       element.css({
 *         'opacity':0
 *       });
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
 * }])
 * </pre>
 *
 * As you can see, the JavaScript code follows a similar template to the CSS3 animations. Once defined, the animation can be used
 * in the same way with the ngAnimate attribute. Keep in mind that, when using JavaScript-enabled animations, ngAnimate will also
 * add in the same CSS classes that CSS-enabled animations do (even if you're using JavaScript animations) to the animated element,
 * but it will not attempt to find any CSS3 transition duration value. It will instead close off the animation once the provided
 * done function is executed. So it's important that you make sure your animations remember to fire off the done function once the
 * animations are complete.
 * @param {mapping expression} ngAnimate determines which animations will animate on which animation events.
 * 
 */

/**
 * @ngdoc function
 * @name ng.$animator
 *
 * @description
 * The $animator service provides the animation functionality that is triggered via the ngAnimate attribute. The service itself is
 * used behind the scenes and isn't a common API for standard angularjs code. There are, however, various methods that are available
 * for the $animator object which can be utilized in custom animations. 
 *
 * @param {object} attr the attributes object which contains the ngAnimate key / value pair.
 * @return {object} the animator object which contains the enter, leave, move, show, hide and animate methods.
 */
var $AnimatorProvider = function() {
  this.$get = ['$animation', '$window', '$sniffer', function($animation, $window, $sniffer) {
    return function(attrs) {
      var ngAnimateAttr = attrs.ngAnimate;
      var animation = {};
      var classes = {};
      var defaultCustomClass;

      if (ngAnimateAttr) {
        //SAVED: http://rubular.com/r/0DCBzCtVml
        var matches = ngAnimateAttr.split(/(?:([-\w]+)\ *:\ *([-\w]+)(?:;|$))+/g);
        if(!matches) {
          throw Error("Expected ngAnimate in form of 'animation: definition; ...;' but got '" + ngAnimateAttr + "'.");
        }
        if (matches.length == 1) {
          defaultCustomClass  = matches[0];
          classes.enter = matches[0] + '-enter';
          classes.leave = matches[0] + '-leave';
          classes.move  = matches[0] + '-move';
          classes.show  = matches[0] + '-show';
          classes.hide  = matches[0] + '-hide';
        } else {
          for(var i=1; i < matches.length; i++) {
            var name  = matches[i++];
            var value = matches[i++];
            if(name && value) {
              classes[name] = value;
            }
          }
        }
      }

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
      animation.enter = animateAction(classes.enter, $animation(classes.enter), insert, noop);

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
      animation.leave = animateAction(classes.leave, $animation(classes.leave), noop, remove);

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
      animation.move = animateAction(classes.move, $animation(classes.move), move, noop);

      /**
       * @ngdoc function
       * @name ng.animator#show
       * @methodOf ng.$animator
       * @function
       *
       * @description
       * Reveals the element by setting the CSS property `display` to `block` and then runs the show animation directly after.
       *
       * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
      */
      animation.show = animateAction(classes.show, $animation(classes.show), show, noop);

      /**
       * @ngdoc function
       * @name ng.animator#hidee
       * @methodOf ng.$animator
       *
       * @description
       * Starts the hide animation first and sets the CSS `display` property to `none` upon completion.
       *
       * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
      */
      animation.hide = animateAction(classes.hide, $animation(classes.hide), noop, hide);

      /**
       * @ngdoc function
       * @name ng.animator#animate
       * @methodOf ng.$animator
       * @function
       *
       * @description
       * Fires the custom animate function (based off of the event name) on the given element. This function is designed for custom
       * animations and therefore no default DOM manipulation will occur behind the scenes. Upon executing this function, the animation
       * based off of the event parameter will be run. 
       *
       * @param {string} event the animation event that you wish to execute
       * @param {jQuery/jqLite element} element the element that will be the focus of the animation
       * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the animation
       * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the animation
      */
      animation.animate = function(event, element, parent, after) {
        animateAction(classes[event] || defaultCustomClass, $animation(classes[event]), noop, noop)(element, parent, after);
      }
      return animation;
    }

    function show(element) {
      element.css('display', 'block');
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
      remove(element);
      insert(element, parent, after);
    }

    function animateAction(className, animationPolyfill, beforeFn, afterFn) {
      if (!className) {
        return function(element, parent, after) {
          beforeFn(element, parent, after);
          afterFn(element, parent, after);
        }
      } else {
        var setupClass = className + '-setup';
        var startClass = className + '-start';
        console.log(startClass);

        return function(element, parent, after) {
          if (element.length == 0) return done();

          element.addClass(setupClass);
          beforeFn(element, parent, after);

          var memento;
          if (animationPolyfill && animationPolyfill.setup) {
            memento = animationPolyfill.setup(element);
          }

          // $window.setTimeout(beginAnimation, 0); this was causing the element not to animate
          // keep at 1 for animation dom rerender
          $window.setTimeout(beginAnimation, 1);

          function beginAnimation() {
            element.addClass(startClass);
            if (animationPolyfill && animationPolyfill.start) {
              animationPolyfill.start(element, done, memento);
            } else if (isFunction($window.getComputedStyle)) {
              var vendorTransitionProp = $sniffer.vendorPrefix.toLowerCase() + 'Transition';
              var w3cTransitionProp = 'transition'; //one day all browsers will have this

              var durationKey = 'Duration';
              var duration = 0;
              //we want all the styles defined before and after
              forEach(element, function(element) {
                var globalStyles = $window.getComputedStyle(element) || {};
                var localStyles = element.style || {};
                duration = Math.max(
                    parseFloat(localStyles[w3cTransitionProp     + durationKey]) ||
                    parseFloat(localStyles[vendorTransitionProp  + durationKey]) ||
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
          }
        }
      }
    }
  }];
};
