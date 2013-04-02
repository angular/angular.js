/**
 * @ngdoc object
 * @name ng.$animationProvider
 * @description
 *
 * The $AnimationProvider provider allows developers to register and access custom JavaScript animations directly inside
 * of a module.
 *
 */
$AnimationProvider.$inject = ['$provide'];
function $AnimationProvider($provide) {
  var suffix = 'Animation';

  /**
   * @ngdoc function
   * @name ng.$animation#register
   * @methodOf ng.$animationProvider
   *
   * @description
   * Registers a new injectable animation factory function. The factory function produces the animation object which
   * has these two properties:
   *
   *   * `setup`: `function(Element):*` A function which receives the starting state of the element. The purpose
   *   of this function is to get the element ready for animation. Optionally the function returns an memento which
   *   is passed to the `start` function.
   *   * `start`: `function(Element, doneFunction, *)` The element to animate, the `doneFunction` to be called on
   *   element animation completion, and an optional memento from the `setup` function.
   *
   * @param {string} name The name of the animation.
   * @param {function} factory The factory function that will be executed to return the animation object.
   * 
   */
  this.register = function(name, factory) {
    $provide.factory(camelCase(name) + suffix, factory);
  };

  this.$get = ['$injector', function($injector) {
    /**
     * @ngdoc function
     * @name ng.$animation
     * @function
     *
     * @description
     * The $animation service is used to retrieve any defined animation functions. When executed, the $animation service
     * will return a object that contains the setup and start functions that were defined for the animation.
     *
     * @param {String} name Name of the animation function to retrieve. Animation functions are registered and stored
     *        inside of the AngularJS DI so a call to $animate('custom') is the same as injecting `customAnimation`
     *        via dependency injection.
     * @return {Object} the animation object which contains the `setup` and `start` functions that perform the animation.
     */
    return function $animation(name) {
      if (name) {
        try {
          return $injector.get(camelCase(name) + suffix);
        } catch (e) {
          //TODO(misko): this is a hack! we should have a better way to test if the injector has a given key.
          // The issue is that the animations are optional, and if not present they should be silently ignored.
          // The proper way to fix this is to add API onto the injector so that we can ask to see if a given
          // animation is supported.
        }
      }
    }
  }];
};
