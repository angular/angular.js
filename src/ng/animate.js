'use strict';

/**
 * @ngdoc object
 * @name ng.$animateProvider
 *
 * @description
 * Default implementation of $animate that doesn't perform any animations, instead just synchronously performs DOM
 * updates and calls done() callbacks.
 *
 * In order to enable animations the ngAnimate module has to be loaded.
 *
 * To see the functional implementation check out src/ngAnimate/animate.js
 */
var $AnimateProvider = ['$provide', function($provide) {

  this.$$selectors = [];


  /**
   * @ngdoc function
   * @name ng.$animateProvider#register
   * @methodOf ng.$animateProvider
   *
   * @description
   * Registers a new injectable animation factory function. The factory function produces the animation object which
   * contains callback functions for each event that is expected to be animated.
   *
   *   * `eventFn`: `function(Element, doneFunction)` The element to animate, the `doneFunction` must be called once the
   *   element animation is complete. If a function is returned then the animation service will use this function to
   *   cancel the animation whenever a cancel event is triggered.
   *
   *
   *<pre>
   *   return {
     *     eventFn : function(element, done) {
     *       //code to run the animation
     *       //once complete, then run done()
     *       return function cancellationFunction() {
     *         //code to cancel the animation
     *       }
     *     }
     *   }
   *</pre>
   *
   * @param {string} name The name of the animation.
   * @param {function} factory The factory function that will be executed to return the animation object.
   */
  this.register = function(name, factory) {
    var classes = name.substr(1).split('.');
    name += '-animation';
    this.$$selectors.push({
      selectors : classes,
      name : name
    });
    $provide.factory(name, factory);
  };

  this.$get = ['$timeout', function($timeout) {
    return {
      enter : function(element, parent, after, done) {
        var afterNode = after && after[after.length - 1];
        var parentNode = parent && parent[0] || afterNode && afterNode.parentNode;
        // IE does not like undefined so we have to pass null.
        var afterNextSibling = (afterNode && afterNode.nextSibling) || null;
        forEach(element, function(node) {
          parentNode.insertBefore(node, afterNextSibling);
        });
        $timeout(done || noop, 0, false);
      },

      leave : function(element, done) {
        element.remove();
        $timeout(done || noop, 0, false);
      },

      move : function(element, parent, after, done) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        this.enter(element, parent, after, done);
      },

      addClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        element.addClass(className);
        $timeout(done || noop, 0, false);
      },

      removeClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        element.removeClass(className);
        $timeout(done || noop, 0, false);
      },

      enabled : noop
    };
  }];
}];
