'use strict';

/**
 * @ngdoc object
 * @name ng.$controllerProvider
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
   * @ngdoc function
   * @name ng.$controllerProvider#register
   * @methodOf ng.$controllerProvider
   * @param {string} name Controller name
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
   *    annotations in the array notation.  Array notation for controllers will allow for another
   *    registered controller to be given by name as the constructor, and the injector will 
   *    instantiate the proper piece of code).
   */
  this.register = function(name, constructor) {
    if (isObject(name)) {
      extend(controllers, name)
    } else {
      controllers[name] = constructor;
    }
  };


  this.$get = ['$injector', '$window', function($injector, $window) {

    /**
     * @ngdoc function
     * @name ng.$controller
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
     * It's just a simple call to {@link AUTO.$injector $injector}, but extracted into
     * a service, so that one can override this service with {@link https://gist.github.com/1649788
     * BC version}.
     */
    return function(expression, locals) {
      var instance, match, constructor, identifier;

      function resolveControllerCode(expression, topControllerName) {

        function findRealController(controllerName) {
          var _controller = controllers[controllerName],
              _nextController = _controller[_controller.length -1];
          searchedControllers[controllerName] = true;

          if(searchedControllers[_nextController]) {
            throw minErr('$controller')('noscp', "Circular declaration found with controller '{0}' -> '{1}'", controllerName, _nextController);
          }
          if(isString(_controller[_controller.length - 1])) {
            _controller[_controller.length - 1] = findRealController(_nextController);
          }

          return _controller[_controller.length - 1];
        }

        var lastArg = expression.length - 1,
            expressionLastArg = expression[lastArg],
            searchedControllers = {};

        if(isString(expressionLastArg)) {
          searchedControllers[topControllerName] = true;
          expression[lastArg] = findRealController(expressionLastArg);
        }
        return expression;
      }

      if(isString(expression)) {
        match = expression.match(CNTRL_REG),
        constructor = match[1],
        identifier = match[3];
        expression = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : getter(locals.$scope, constructor, true) || getter($window, constructor, true);

        expression = resolveControllerCode(expression, constructor);

        assertArgFn(expression, constructor, true);
      }

      instance = $injector.instantiate(expression, locals);

      if (identifier) {
        if (!(locals && typeof locals.$scope == 'object')) {
          throw minErr('$controller')('noscp', "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", constructor || expression.name, identifier);
        }

        locals.$scope[identifier] = instance;
      }

      return instance;
    };
  }];
}
