/**
 * @ngdoc object
 * @name ng.$animationProvider
 * @description
 *
 * Animations are core-level hooks for scope-level changes in AngularJS with respect to any directives that they're attached to.
 * So by hooking into the animations for a directive such as ngRepeat, you can control the enter (when a value is added into the list),
 * leave (when a value is removed from the list) and move (when a value is reordered within the list) events directly with your own animation
 * code. Animations are defined via the $animationProvider.register function and can be accessed $animator factory service. 
 *
 * <pre>
 * ...
 * </pre>
 *
 * For more information about how angular filters work, and how to create your own filters, see
 * {@link guide/dev_guide.templates.filters Understanding Angular Filters} in the angular Developer
 * Guide.
 */
/**
 * @ngdoc method
 * @name ng.$animationProvider#register
 * @methodOf ng.$animationProvider
 * @description
 * Register animation factory function.
 *
 * @param {String} name Name of the animation.
 * @param {function} fn The animation factory function which is injectable.
 */


/**
 * @ngdoc function
 * @name ng.$animation
 * @function
 * @description
 * The $animation service is used to register custom animations directly into a module.
 *
 * @param {String} name Name of the animation function to retrieve. Animation functions are registered and stored inside of the AngularJS DI so
 * a call to $animate('custom') is the same as injecting `customAnimation` via dependency injection.
 * @return {Function} the animation function
 */
$AnimationProvider.$inject = ['$provide'];
function $AnimationProvider($provide) {
  var suffix = 'Animation';

  /**
   * @ngdoc function
   * @name ng.$animation#register
   * @methodOf ng.$animation
   *
   * @description
   * Registers a new animation function into the current module.
   *
   * @param {string} name The name of the animation.
   * @param {function} factory The factory function that will be executed to return the animation function
   * 
   */
  this.register = function(name, factory) {
    $provide.factory(camelCase(name) + suffix, factory);
  };

  this.$get = ['$injector', function($injector) {
    return function $animation(name) {
      return $injector.get(camelCase(name) + suffix);
    }
  }];
};
