'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngAnimate
 *
 * @description
 * The `ngAnimate` directive provides developers with an easy way to attach animations to pre-existing ng directives as well as custom directives.
 * Common angular directives such as <strong>ngShow</strong>, <strong>ngHide</strong>, <strong>ngRepeat</strong>, <strong>ngInclude</strong>, <strong>ngSwitch</strong>, and <strong>ngView</strong> all support various animation hooks that can be made
 * use of via the ngAnimate directive. This means that you must plug in the ng-animate directive onto the same element as the other directive is on
 * (like ngRepeat, ngInclude, etc...).
 *
 * Here is a full breakdown of which angularjs (ng) directives provide what callback events:
 *
 * * ngRepeat — enter, leave and move
 * * ngView — enter and leave
 * * ngInclude — enter and leave
 * * ngSwitch — enter and leave
 * * ngShow & ngHide - show and hide respectively
 * You can find out more information about animations upon visiting each directive page.
 * 
 * Assigning animations to directives happens within the ng-animate attribute and follows mapping pattern. Below is an example of how
 * to attach animations to an element.
 *
 *         <!-- you can also use data-ng-animate or x-ng-animate as well -->
 *         <ANY ng-directive ng-animate="event1: animationFn; event2: animationFn2"></ANY>
 *
 * @param {mapping expression} ngAnimate determines which animations will animate on which animation events.
 *     then the element is shown or hidden respectively.
 *
 */
var ngAnimateDirective = ['$animation', function($animation) {
  return {
    name : 'ngAnimate',
    priority : 9000, //this needs to always be higher than ngRepeat
    controller: Animator,
    require: 'ngAnimate',
    link: function(scope, element, attrs, animationCntl) {
      var ngAnimateAttr = attrs.ngAnimate;

      //SAVED: http://rubular.com/r/0DCBzCtVml
      var matches = ngAnimateAttr.split(/(?:([-\w]+)\ *:\ *([-\w]+)(?:;|$))+/g);
      if(!matches || matches.length <= 1) {
        throw Error("Expected ngAnimate in form of 'animation: definition; ...;' but got '" + ngAnimateAttr + "'.");
      }
      for(var i=1; i < matches.length; i++) {
        var name  = matches[i++];
        var value = matches[i++];
        if(name && value) {
          var animator;
          try {
            animator = $animation(value);
          }
          catch(e) {};
          animationCntl.set(name, value, animator);
        }
      }
    }
  };
}];

/**
 * @ngdoc object
 * @name ng.Animator
 *
 * @description
 * `Animator` is a class used behind the scenes with the ngAnimate directive to parse and assign the animation functions which
 * will then be triggered to kick off the animations within a parent directive (ngRepeat, ngView, a custom directive, etc...).
 *
 * To make use of the Animator class you must first instantiate it.
 *
 */

/**
 * @ngdoc function
 * @name ng.Animator#new Animator
 * @methodOf ng.Animator
 *
 * @description
 * Create an instance of the Animator class.
 *
 * @param {object} $animation The injected $animation service.
 * 
 */
var Animator = function($animation, $window, $sniffer) {
  var animators = {};

  /**
   * @ngdoc function
   * @name ng.Animator#instance.set
   * @methodOf ng.Animator
   *
   * @description
   * Assigns the animation function for the given animation event.
   *
   * @param {string} name The name of the animation event that can be called within a directive.
   * @param {function} animator The animation function that will be executed once an animation is called via animate().
   * 
   */
  this.set = function(event, animatorName, animatorPolyfill) {
    var animator = animatorPolyfill || {};
    if(isFunction(animator)) {
      animator = {
        setup : noop,
        start : animatorPolyfill
      };
    }
    animator.name = animatorName;
    animators[event] = animator;
  },

  /**
   * @ngdoc function
   * @name ng.Animator#instance.animate
   * @methodOf ng.Animator
   *
   * @description
   * Calls (executes) the function which runs the animation for the given animation name.
   * This function will throw an error if an animator matching the name param is not found.
   *
   * @param {string} name The name of the animation event that will be called.
   * @param {element} node The element itself that the animation will run the animation on.
   *    This element given varies depending on which animation is called.
   * @param {element=} parent The parent element of the animation. This also varies depending on
   *    which animation functions require the parent element to be passed into the animation.
   * @param {element=} after The element adjacent (just before) the animation element. This also varies depending on
   *    which animation functions require the parent element to be passed into the animation.
   * 
   */
  this.animate = function(event, node, parent, after) {
    var animator = animators[event];

    if(event == 'enter') { //TODO misko injection
      parent.append(node);
    }
    else if(event == 'move') { //TODO misko injection
      after ? after.after(node) : parent.append(node);
    }

    //no ng-animate attribute set, therefore no classes
    if(!isObject(animator)) {
      if(event == 'leave') { //TODO misko injection
        node.remove();
      }
      else if(event == 'show') { //TODO misko injection
        node.css('display','block');
      }
      else if(event == 'hide') { //TODO misko injection
        node.css('display','none');
      }

      return;
    }

    //animator is always defined, but the start method marks the polyfill
    var hasPolyfill = isFunction(animator.start);

    //TODO use a pure camelCase => hypenated-string function
    //this will be in the form of ng-animate-ANIMATION-
    var cssNamePrefix = 'ng-animate-' + snake_case(animator.name).replace(/_/g,'-') + '-';
    //keep these global so that they can removed inside done()
    var setupClass = cssNamePrefix + 'setup';
    var startClass = cssNamePrefix + 'start';

    var setupMemo;
    node.addClass(setupClass);
    if(hasPolyfill) {
      setupMemo = animator.setup(node);
    }

    // $window.setTimeout(process, 0); this was causing the element not to animat
    //keep at 1 for animation dom rerender
    $window.setTimeout(process, 1);

    function process() {
      node.addClass(startClass);
      if(hasPolyfill) {
        animator.start(node, done, setupMemo);
      }
      else if(isFunction($window.getComputedStyle)) {
        //ie < 9 doesn't support this (it also doesn't have transitions) [http://caniuse.com/getcomputedstyle]
        var duration = 0;
        var elm = node[0];
        var vendorTransitionProp = $sniffer.vendorPrefix.toLowerCase() + 'Transition';
        var w3cTransitionProp = 'transition'; //one day all browsers will have this

        var durationKey = 'Duration';
        var globalStyles = $window.getComputedStyle(elm); //we want all the styles defined before and after
        var localStyles = elm.style;
        duration = parseFloat(localStyles[w3cTransitionProp     + durationKey]) ||
                   parseFloat(localStyles[vendorTransitionProp  + durationKey]) ||
                   parseFloat(globalStyles[w3cTransitionProp    + durationKey]) ||
                   parseFloat(globalStyles[vendorTransitionProp + durationKey]);
        if(duration > 0) {
          $window.setTimeout(done, duration * 1000);
        }
      }
    }

    function done() {
      node.removeClass(setupClass);
      node.removeClass(startClass);
      if(event == 'leave') { //TODO misko injection
        node.remove();
      }
    }
  };
};
Animator.$inject = ['$animation','$window','$sniffer'];

var $defaultAnimatorFactory = ['$animation','$window','$sniffer', function($animation, $window, $sniffer) {
  var ctl = new Animator($animation, $window, $sniffer);

  ctl.set = undefined; // prevent anyone from changing it.
  return ctl;
}];
