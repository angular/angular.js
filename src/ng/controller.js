'use strict';

/**
 * @ngdoc provider
 * @name $controllerProvider
 * @description
 * The {@link ng.$controller $controller service} is used by Angular to create new
 * controllers.
 *
 * This provider allows controller registration via the
 * {@link ng.$controllerProvider#register register} method.
 */
function $ControllerProvider() {
  var controllers = {},
      CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;


  /**
   * @ngdoc method
   * @name $controllerProvider#register
   * @param {string|Object} name Controller name, or an object map of controllers where the keys are
   *    the names and the values are the constructors.
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
   *    annotations in the array notation).
   */
  this.register = function(name, constructor) {
    assertNotHasOwnProperty(name, 'controller');
    if (isObject(name)) {
      extend(controllers, name);
    } else {
      controllers[name] = constructor;
    }
  };


  this.$get = ['$injector', '$window', function($injector, $window) {

    /**
     * @ngdoc service
     * @name $controller
     * @requires $injector
     *
     * @param {Function|string} constructor If called with a function then it's considered to be the
     *    controller constructor function. Otherwise it's considered to be a string which is used
     *    to retrieve the controller constructor using the following steps:
     *
     *    * check if a controller with given name is registered via `$controllerProvider`
     *    * check if evaluating the string on the current scope returns a constructor
     *    * check `window[constructor]` on the global `window` object
     *
     * @param {Object} locals Injection locals for Controller.
     * @return {Object} Instance of given controller.
     *
     * @description
     * `$controller` service is responsible for instantiating controllers.
     *
     * It's just a simple call to {@link auto.$injector $injector}, but extracted into
     * a service, so that one can override this service with [BC version](https://gist.github.com/1649788).
     */
    return function(expression, locals) {
      var instance, match, constructor, identifier;

      if(isString(expression)) {
        match = expression.match(CNTRL_REG),
        constructor = match[1],
        identifier = match[3];
        expression = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : getter(locals.$scope, constructor, true) || getter($window, constructor, true);

        assertArgFn(expression, constructor, true);
      }

      instance = $injector.instantiate(expression, locals);

      if (identifier) {
        if (!(locals && typeof locals.$scope == 'object')) {
          throw minErr('$controller')('noscp',
              "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.",
              constructor || expression.name, identifier);
        }

        locals.$scope[identifier] = instance;
      }

      return instance;
    };
  }];
}
