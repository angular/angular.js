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
    'uppercase': uppercase,
    'callbacks': {counter: 0}
  });

  angularModule.ng = ngModule;
}

ngModule.$inject = ['$provide', '$injector'];
function ngModule($provide, $injector) {
  // load the LOCALE if present
  $injector.invoke(null, angularModule.ngLocale || function(){
    $provide.service('$locale', $LocaleProvider);
  });

  forEach({
    $autoScroll: $AutoScrollProvider,
    $browser: $BrowserProvider,
    $cacheFactory: $CacheFactoryProvider,
    $cookies: $CookiesProvider,
    $cookieStore: $CookieStoreProvider,
    $defer: $DeferProvider,
    $document: $DocumentProvider,
    $exceptionHandler: $ExceptionHandlerProvider,
    $filter: $FilterProvider,
    $interpolate: $InterpolateProvider,
    $formFactory: $FormFactoryProvider,
    $http: $HttpProvider,
    $httpBackend: $HttpBackendProvider,
    $location: $LocationProvider,
    $log: $LogProvider,
    $parse: $ParseProvider,
    $resource: $ResourceProvider,
    $route: $RouteProvider,
    $routeParams: $RouteParamsProvider,
    $rootScope: $RootScopeProvider,
    $q: $QProvider,
    $sniffer: $SnifferProvider,
    $sanitize: $SanitizeProvider,
    $templateCache: $TemplateCacheProvider,
    $window: $WindowProvider
  }, function(service, name) { $provide.service(name, service); });
  
  $provide.service('$compile', $CompileProvider).
    directive({
      ngInit: ngInitDirective,
      ngBind: ngBindDirective,
      ngBindHtml: ngBindHtmlDirective,
      ngBindHtmlUnsafe: ngBindHtmlUnsafeDirective,
      ngBindTemplate: ngBindTemplateDirective,
      ngBindAttr: ngBindAttrDirective,
      ngClass: ngClassDirective,
      ngClassEven: ngClassEvenDirective,
      ngClassOdd: ngClassOddDirective,
      ngStyle: ngStyleDirective,
      ngShow: ngShowDirective,
      ngHide: ngHideDirective,
      ngController: ngControllerDirective,
      ngCloak: ngCloakDirective,
      ngRepeat: ngRepeatDirective,
      ngSwitch: ngSwitchDirective,
      ngInclude: ngIncludeDirective,
      a: htmlAnchorDirective,
      ngNonBindable: ngNonBindableDirective,
      ngView: ngViewDirective,
      ngPluralize: ngPluralizeDirective,
      input: inputDirective,
      textarea: inputDirective,
      form: ngFormDirective,
      ngForm: ngFormDirective,
      select: selectDirective,
      ngOptions: ngOptionsDirective,
      option: optionDirective,
      ngSubmit: ngSubmitDirective,
      script: scriptTemplateLoader
    }).
    directive(ngEventDirectives).
    directive(ngAttributeAliasDirectives);
}

