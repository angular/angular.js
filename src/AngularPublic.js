'use strict';

/**
 * @ngdoc property
 * @name angular.version
 * @description
 * An object that contains information about the current AngularJS version. This object has the
 * following properties:
 *
 * - `full` – `{string}` – Full version string, such as "0.9.18".
 * - `major` – `{number}` – Major version number, such as "0".
 * - `minor` – `{number}` – Minor version number, such as "9".
 * - `dot` – `{number}` – Dot version number, such as "18".
 * - `codeName` – `{string}` – Code name of the release, such as "jiggling-armfat".
 */
var version = {
  full: '"NG_VERSION_FULL"',    // all of these placeholder strings will be replaced by rake's
  major: "NG_VERSION_MAJOR",    // compile task
  minor: "NG_VERSION_MINOR",
  dot: "NG_VERSION_DOT",
  codeName: '"NG_VERSION_CODENAME"'
};


function publishExternalAPI(angular){
  extend(angular, {
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    'injector': function(){ return createInjector(arguments, angularModule); },
    'noop':noop,
    'bind':bind,
    'toJson': toJson,
    'fromJson': fromJson,
    'identity':identity,
    'isUndefined': isUndefined,
    'isDefined': isDefined,
    'isString': isString,
    'isFunction': isFunction,
    'isObject': isObject,
    'isNumber': isNumber,
    'isElement': isElement,
    'isArray': isArray,
    'version': version,
    'isDate': isDate,
    'lowercase': lowercase,
    'uppercase': uppercase
  });

  angularModule.ng = ngModule;
}

ngModule.$inject = ['$provide', '$injector'];
function ngModule($provide, $injector) {
// TODO(misko): temporary services to get the compiler working;
  $provide.value('$textMarkup', angularTextMarkup);
  $provide.value('$attrMarkup', angularAttrMarkup);
  $provide.value('$directive', angularDirective);
  $provide.value('$widget', angularWidget);

  // load the LOCALE if present
  $injector.invoke(null, angularModule.ngLocale || function(){
    $provide.service('$locale', $LocaleProvider);
  });

  $provide.service('$autoScroll', $AutoScrollProvider);
  $provide.service('$browser', $BrowserProvider);
  $provide.service('$compile', $CompileProvider);
  $provide.service('$cookies', $CookiesProvider);
  $provide.service('$cookieStore', $CookieStoreProvider);
  $provide.service('$defer', $DeferProvider);
  $provide.service('$document', $DocumentProvider);
  $provide.service('$exceptionHandler', $ExceptionHandlerProvider);
  $provide.service('$filter', $FilterProvider);
  $provide.service('$formFactory', $FormFactoryProvider);
  $provide.service('$location', $LocationProvider);
  $provide.service('$log', $LogProvider);
  $provide.service('$parse', $ParseProvider);
  $provide.service('$resource', $ResourceProvider);
  $provide.service('$route', $RouteProvider);
  $provide.service('$routeParams', $RouteParamsProvider);
  $provide.service('$rootScope', $RootScopeProvider);
  $provide.service('$sniffer', $SnifferProvider);
  $provide.service('$window', $WindowProvider);
  $provide.service('$xhr.bulk', $XhrBulkProvider);
  $provide.service('$xhr.cache', $XhrCacheProvider);
  $provide.service('$xhr.error', $XhrErrorProvider);
  $provide.service('$xhr', $XhrProvider);
}

