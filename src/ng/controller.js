'use strict';

var $controllerMinErr = minErr('$controller');


var CNTRL_REG = /^(\S+)(\s+as\s+([\w$]+))?$/;
function identifierForController(controller, ident) {
  if (ident && isString(ident)) return ident;
  if (isString(controller)) {
    var match = CNTRL_REG.exec(controller);
    if (match) return match[3];
  }
}


/**
 * @ngdoc provider
 * @name $controllerProvider
 * @this
 *
 * @description
 * The {@link ng.$controller $controller service} is used by AngularJS to create new
 * controllers.
 *
 * This provider allows controller registration via the
 * {@link ng.$controllerProvider#register register} method.
 */
function $ControllerProvider() {
  var controllers = {};

  /**
   * @ngdoc method
   * @name $controllerProvider#has
   * @param {string} name Controller name to check.
   */
  this.has = function(name) {
    return controllers.hasOwnProperty(name);
  };

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

  this.$get = ['$injector', function($injector) {

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
     *
     *    The string can use the `controller as property` syntax, where the controller instance is published
     *    as the specified property on the `scope`; the `scope` must be injected into `locals` param for this
     *    to work correctly.
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
    return function $controller(expression, locals, later, ident) {
      // PRIVATE API:
      //   param `later` --- indicates that the controller's constructor is invoked at a later time.
      //                     If true, $controller will allocate the object with the correct
      //                     prototype chain, but will not invoke the controller until a returned
      //                     callback is invoked.
      //   param `ident` --- An optional label which overrides the label parsed from the controller
      //                     expression, if any.
      var instance, match, constructor, identifier;
      later = later === true;
      if (ident && isString(ident)) {
        identifier = ident;
      }

      if (isString(expression)) {
        match = expression.match(CNTRL_REG);
        if (!match) {
          throw $controllerMinErr('ctrlfmt',
            'Badly formed controller string \'{0}\'. ' +
            'Must match `__name__ as __id__` or `__name__`.', expression);
        }
        constructor = match[1];
        identifier = identifier || match[3];
        expression = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : getter(locals.$scope, constructor, true);

        if (!expression) {
          throw $controllerMinErr('ctrlreg',
            'The controller with the name \'{0}\' is not registered.', constructor);
        }

        assertArgFn(expression, constructor, true);
      }

      if (later) {
        // Instantiate controller later:
        // This machinery is used to create an instance of the object before calling the
        // controller's constructor itself.
        //
        // This allows properties to be added to the controller before the constructor is
        // invoked. Primarily, this is used for isolate scope bindings in $compile.
        //
        // This feature is not intended for use by applications, and is thus not documented
        // publicly.
        // Object creation: http://jsperf.com/create-constructor/2
        var controllerPrototype = (isArray(expression) ?
          expression[expression.length - 1] : expression).prototype;
        instance = Object.create(controllerPrototype || null);

        if (identifier) {
          addIdentifier(locals, identifier, instance, constructor || expression.name);
        }

        return extend(function $controllerInit() {
          var result = $injector.invoke(expression, instance, locals, constructor);
          if (result !== instance && (isObject(result) || isFunction(result))) {
            instance = result;
            if (identifier) {
              // If result changed, re-assign controllerAs value to scope.
              addIdentifier(locals, identifier, instance, constructor || expression.name);
            }
          }
          return instance;
        }, {
          instance: instance,
          identifier: identifier
        });
      }

      instance = $injector.instantiate(expression, locals, constructor);

      if (identifier) {
        addIdentifier(locals, identifier, instance, constructor || expression.name);
      }

      return instance;
    };

    function addIdentifier(locals, identifier, instance, name) {
      if (!(locals && isObject(locals.$scope))) {
        throw minErr('$controller')('noscp',
          'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.',
          name, identifier);
      }

      locals.$scope[identifier] = instance;
    }
  }];
}
