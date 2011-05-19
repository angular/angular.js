/**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an inject function that can be used for dependency injection.
 * (See {@link guide/di dependency injection})
 *
 * The inject function can be used for retrieving service instances or for calling any function
 * which has the $inject property so that the services can be automatically provided. Angular
 * creates an injection function automatically for the root scope and it is available as
 * {@link angular.scope.$service $service}.
 *
 * @param {Object=} [providerScope={}] provider's `this`
 * @param {Object.<string, function()>=} [providers=angular.service] Map of provider (factory)
 *     function.
 * @param {Object.<string, function()>=} [cache={}] Place where instances are saved for reuse. Can
 *     also be used to override services speciafied by `providers` (useful in tests).
 * @returns
 *   {function()} Injector function: `function(value, scope, args...)`:
 *
 *     * `value` - `{string|array|function}`
 *     * `scope(optional=rootScope)` -  optional function "`this`" when `value` is type `function`.
 *     * `args(optional)` - optional set of arguments to pass to function after injection arguments.
 *        (also known as curry arguments or currying).
 *
 *   #Return value of `function(value, scope, args...)`
 *   The injector function return value depended on the type of `value` argument:
 *
 *     * `string`: return an instance for the injection key.
 *     * `array` of keys: returns an array of instances for those keys. (see `string` above.)
 *     * `function`: look at `$inject` property of function to determine instances to inject
 *       and then call the function with instances and `scope`. Any additional arguments
 *       (`args`) are appended to the function arguments.
 *     * `none`: initialize eager providers.
 *
 */
function createInjector(providerScope, providers, cache) {
  providers = providers || angularService;
  cache = cache || {};
  providerScope = providerScope || {};
  return function inject(value, scope, args){
    var returnValue, provider;
    if (isString(value)) {
      if (!(value in cache)) {
        provider = providers[value];
        if (!provider) throw "Unknown provider for '"+value+"'.";
        cache[value] = inject(provider, providerScope);
      }
      returnValue = cache[value];
    } else if (isArray(value)) {
      returnValue = [];
      forEach(value, function(name) {
        returnValue.push(inject(name));
      });
    } else if (isFunction(value)) {
      returnValue = inject(injectionArgs(value));
      returnValue = value.apply(scope, concat(returnValue, arguments, 2));
    } else if (isObject(value)) {
      forEach(providers, function(provider, name){
        if (provider.$eager)
          inject(name);

        if (provider.$creation)
          throw new Error("Failed to register service '" + name +
              "': $creation property is unsupported. Use $eager:true or see release notes.");
      });
    } else {
      returnValue = inject(providerScope);
    }
    return returnValue;
  };
}

function injectService(services, fn) {
  return extend(fn, {$inject:services});
}

function injectUpdateView(fn) {
  return injectService(['$updateView'], fn);
}

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $eager:eager});
}


/**
 * @returns the $inject property of function. If not found the
 * the $inject is computed by looking at the toString of function and
 * extracting all arguments which start with $ or end with _ as the
 * injection names.
 */
var FN_ARGS = /^function\s*[^\(]*\(([^\)]*)\)/;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(((\$?).+?)(_?))\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function injectionArgs(fn) {
  assertArgFn(fn);
  if (!fn.$inject) {
    var args = fn.$inject = [];
    var fnText = fn.toString().replace(STRIP_COMMENTS, '');
    var argDecl = fnText.match(FN_ARGS);
    forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
      arg.replace(FN_ARG, function(all, name, injectName, $, _){
        assertArg(args, name, 'after non-injectable arg');
        if ($ || _)
          args.push(injectName);
        else
          args = null; // once we reach an argument which is not injectable then ignore
      });
    });
  }
  return fn.$inject;
}
