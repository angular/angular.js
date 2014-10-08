'use strict';

var $animateMinErr = minErr('$animate');

/**
 * @ngdoc provider
 * @name $animateProvider
 *
 * @description
 * Default implementation of $animate that doesn't perform any animations, instead just
 * synchronously performs DOM
 * updates and calls done() callbacks.
 *
 * In order to enable animations the ngAnimate module has to be loaded.
 *
 * To see the functional implementation check out src/ngAnimate/animate.js
 */
var $AnimateProvider = ['$provide', function($provide) {


  this.$$selectors = {};


  /**
   * @ngdoc method
   * @name $animateProvider#register
   *
   * @description
   * Registers a new injectable animation factory function. The factory function produces the
   * animation object which contains callback functions for each event that is expected to be
   * animated.
   *
   *   * `eventFn`: `function(Element, doneFunction)` The element to animate, the `doneFunction`
   *   must be called once the element animation is complete. If a function is returned then the
   *   animation service will use this function to cancel the animation whenever a cancel event is
   *   triggered.
   *
   *
   * ```js
   *   return {
     *     eventFn : function(element, done) {
     *       //code to run the animation
     *       //once complete, then run done()
     *       return function cancellationFunction() {
     *         //code to cancel the animation
     *       }
     *     }
     *   }
   * ```
   *
   * @param {string} name The name of the animation.
   * @param {Function} factory The factory function that will be executed to return the animation
   *                           object.
   */
  this.register = function(name, factory) {
    var key = name + '-animation';
    if (name && name.charAt(0) != '.') throw $animateMinErr('notcsel',
        "Expecting class selector starting with '.' got '{0}'.", name);
    this.$$selectors[name.substr(1)] = key;
    $provide.factory(key, factory);
  };

  /**
   * @ngdoc method
   * @name $animateProvider#classNameFilter
   *
   * @description
   * Sets and/or returns the CSS class regular expression that is checked when performing
   * an animation. Upon bootstrap the classNameFilter value is not set at all and will
   * therefore enable $animate to attempt to perform an animation on any element.
   * When setting the classNameFilter value, animations will only be performed on elements
   * that successfully match the filter expression. This in turn can boost performance
   * for low-powered devices as well as applications containing a lot of structural operations.
   * @param {RegExp=} expression The className expression which will be checked against all animations
   * @return {RegExp} The current CSS className expression value. If null then there is no expression value
   */
  this.classNameFilter = function(expression) {
    if(arguments.length === 1) {
      this.$$classNameFilter = (expression instanceof RegExp) ? expression : null;
    }
    return this.$$classNameFilter;
  };

  this.$get = ['$$q', '$$asyncCallback', '$rootScope', function($$q, $$asyncCallback, $rootScope) {

    var currentDefer;

    function runAnimationPostDigest(fn) {
      var cancelFn, defer = $$q.defer();
      defer.promise.$$cancelFn = function ngAnimateMaybeCancel() {
        cancelFn && cancelFn();
      };

      $rootScope.$$postDigest(function ngAnimatePostDigest() {
        cancelFn = fn(function ngAnimateNotifyComplete() {
          defer.resolve();
        });
      });

      return defer.promise;
    }

    function resolveElementClasses(element, cache) {
      var toAdd = [], toRemove = [];

      var hasClasses = createMap();
      forEach((element.attr('class') || '').split(/\s+/), function(className) {
        hasClasses[className] = true;
      });

      forEach(cache.classes, function(status, className) {
        var hasClass = hasClasses[className];

        // If the most recent class manipulation (via $animate) was to remove the class, and the
        // element currently has the class, the class is scheduled for removal. Otherwise, if
        // the most recent class manipulation (via $animate) was to add the class, and the
        // element does not currently have the class, the class is scheduled to be added.
        if (status === false && hasClass) {
          toRemove.push(className);
        } else if (status === true && !hasClass) {
          toAdd.push(className);
        }
      });

      return (toAdd.length + toRemove.length) > 0 && [toAdd.length && toAdd, toRemove.length && toRemove];
    }

    function cachedClassManipulation(cache, classes, op) {
      for (var i=0, ii = classes.length; i < ii; ++i) {
        var className = classes[i];
        cache[className] = op;
      }
    }

    function asyncPromise() {
      // only serve one instance of a promise in order to save CPU cycles
      if (!currentDefer) {
        currentDefer = $$q.defer();
        $$asyncCallback(function() {
          currentDefer.resolve();
          currentDefer = null;
        });
      }
      return currentDefer.promise;
    }

    /**
     *
     * @ngdoc service
     * @name $animate
     * @description The $animate service provides rudimentary DOM manipulation functions to
     * insert, remove and move elements within the DOM, as well as adding and removing classes.
     * This service is the core service used by the ngAnimate $animator service which provides
     * high-level animation hooks for CSS and JavaScript.
     *
     * $animate is available in the AngularJS core, however, the ngAnimate module must be included
     * to enable full out animation support. Otherwise, $animate will only perform simple DOM
     * manipulation operations.
     *
     * To learn more about enabling animation support, click here to visit the {@link ngAnimate
     * ngAnimate module page} as well as the {@link ngAnimate.$animate ngAnimate $animate service
     * page}.
     */
    return {

      /**
       *
       * @ngdoc method
       * @name $animate#enter
       * @kind function
       * @description Inserts the element into the DOM either after the `after` element or
       * as the first child within the `parent` element. When the function is called a promise
       * is returned that will be resolved at a later time.
       * @param {DOMElement} element the element which will be inserted into the DOM
       * @param {DOMElement} parent the parent element which will append the element as
       *   a child (if the after element is not present)
       * @param {DOMElement} after the sibling element which will append the element
       *   after itself
       * @return {Promise} the animation callback promise
       */
      enter : function(element, parent, after) {
        after ? after.after(element)
              : parent.prepend(element);
        return asyncPromise();
      },

      /**
       *
       * @ngdoc method
       * @name $animate#leave
       * @kind function
       * @description Removes the element from the DOM. When the function is called a promise
       * is returned that will be resolved at a later time.
       * @param {DOMElement} element the element which will be removed from the DOM
       * @return {Promise} the animation callback promise
       */
      leave : function(element) {
        element.remove();
        return asyncPromise();
      },

      /**
       *
       * @ngdoc method
       * @name $animate#move
       * @kind function
       * @description Moves the position of the provided element within the DOM to be placed
       * either after the `after` element or inside of the `parent` element. When the function
       * is called a promise is returned that will be resolved at a later time.
       *
       * @param {DOMElement} element the element which will be moved around within the
       *   DOM
       * @param {DOMElement} parent the parent element where the element will be
       *   inserted into (if the after element is not present)
       * @param {DOMElement} after the sibling element where the element will be
       *   positioned next to
       * @return {Promise} the animation callback promise
       */
      move : function(element, parent, after) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        return this.enter(element, parent, after);
      },

      /**
       *
       * @ngdoc method
       * @name $animate#addClass
       * @kind function
       * @description Adds the provided className CSS class value to the provided element.
       * When the function is called a promise is returned that will be resolved at a later time.
       * @param {DOMElement} element the element which will have the className value
       *   added to it
       * @param {string} className the CSS class which will be added to the element
       * @return {Promise} the animation callback promise
       */
      addClass : function(element, className) {
        return this.setClass(element, className, []);
      },

      $$addClassImmediately : function addClassImmediately(element, className) {
        element = jqLite(element);
        className = !isString(className)
                        ? (isArray(className) ? className.join(' ') : '')
                        : className;
        forEach(element, function (element) {
          jqLiteAddClass(element, className);
        });
      },

      /**
       *
       * @ngdoc method
       * @name $animate#removeClass
       * @kind function
       * @description Removes the provided className CSS class value from the provided element.
       * When the function is called a promise is returned that will be resolved at a later time.
       * @param {DOMElement} element the element which will have the className value
       *   removed from it
       * @param {string} className the CSS class which will be removed from the element
       * @return {Promise} the animation callback promise
       */
      removeClass : function(element, className) {
        return this.setClass(element, [], className);
      },

      $$removeClassImmediately : function removeClassImmediately(element, className) {
        element = jqLite(element);
        className = !isString(className)
                        ? (isArray(className) ? className.join(' ') : '')
                        : className;
        forEach(element, function (element) {
          jqLiteRemoveClass(element, className);
        });
        return asyncPromise();
      },

      /**
       *
       * @ngdoc method
       * @name $animate#setClass
       * @kind function
       * @description Adds and/or removes the given CSS classes to and from the element.
       * When the function is called a promise is returned that will be resolved at a later time.
       * @param {DOMElement} element the element which will have its CSS classes changed
       *   removed from it
       * @param {string} add the CSS classes which will be added to the element
       * @param {string} remove the CSS class which will be removed from the element
       * @return {Promise} the animation callback promise
       */
      setClass : function(element, add, remove, runSynchronously) {
        var self = this;
        var STORAGE_KEY = '$$animateClasses';
        var createdCache = false;
        element = jqLite(element);

        if (runSynchronously) {
          // TODO(@caitp/@matsko): Remove undocumented `runSynchronously` parameter, and always
          // perform DOM manipulation asynchronously or in postDigest.
          self.$$addClassImmediately(element, add);
          self.$$removeClassImmediately(element, remove);
          return asyncPromise();
        }

        var cache = element.data(STORAGE_KEY);
        if (!cache) {
          cache = {
            classes: {}
          };
          createdCache = true;
        }

        var classes = cache.classes;

        add = isArray(add) ? add : add.split(' ');
        remove = isArray(remove) ? remove : remove.split(' ');
        cachedClassManipulation(classes, add, true);
        cachedClassManipulation(classes, remove, false);

        if (createdCache) {
          cache.promise = runAnimationPostDigest(function(done) {
            var cache = element.data(STORAGE_KEY);
            element.removeData(STORAGE_KEY);

            var classes = cache && resolveElementClasses(element, cache);

            if (classes) {
              if (classes[0]) self.$$addClassImmediately(element, classes[0]);
              if (classes[1]) self.$$removeClassImmediately(element, classes[1]);
            }

            done();
          });
          element.data(STORAGE_KEY, cache);
        }

        return cache.promise;
      },

      enabled : noop,
      cancel : noop
    };
  }];
}];
