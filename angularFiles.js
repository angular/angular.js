angularFiles = {
  'angularSrc': [
    'src/minErr.js',
    'src/Angular.js',
    'src/loader.js',
    'src/AngularPublic.js',
    'src/jqLite.js',
    'src/apis.js',

    'src/auto/injector.js',

    'src/ng/anchorScroll.js',
    'src/ng/animate.js',
    'src/ng/asyncCallback.js',
    'src/ng/browser.js',
    'src/ng/cacheFactory.js',
    'src/ng/compile.js',
    'src/ng/controller.js',
    'src/ng/document.js',
    'src/ng/exceptionHandler.js',
    'src/ng/http.js',
    'src/ng/httpBackend.js',
    'src/ng/interpolate.js',
    'src/ng/interval.js',
    'src/ng/locale.js',
    'src/ng/location.js',
    'src/ng/log.js',
    'src/ng/parse.js',
    'src/ng/q.js',
    'src/ng/raf.js',
    'src/ng/rootScope.js',
    'src/ng/sanitizeUri.js',
    'src/ng/sce.js',
    'src/ng/sniffer.js',
    'src/ng/timeout.js',
    'src/ng/urlUtils.js',
    'src/ng/window.js',

    'src/ng/filter.js',
    'src/ng/filter/filter.js',
    'src/ng/filter/filters.js',
    'src/ng/filter/limitTo.js',
    'src/ng/filter/orderBy.js',

    'src/ng/directive/directives.js',
    'src/ng/directive/a.js',
    'src/ng/directive/booleanAttrs.js',
    'src/ng/directive/form.js',
    'src/ng/directive/input.js',
    'src/ng/directive/ngBind.js',
    'src/ng/directive/ngClass.js',
    'src/ng/directive/ngCloak.js',
    'src/ng/directive/ngController.js',
    'src/ng/directive/ngCsp.js',
    'src/ng/directive/ngEventDirs.js',
    'src/ng/directive/ngIf.js',
    'src/ng/directive/ngInclude.js',
    'src/ng/directive/ngInit.js',
    'src/ng/directive/ngNonBindable.js',
    'src/ng/directive/ngPluralize.js',
    'src/ng/directive/ngRepeat.js',
    'src/ng/directive/ngShowHide.js',
    'src/ng/directive/ngStyle.js',
    'src/ng/directive/ngSwitch.js',
    'src/ng/directive/ngTransclude.js',
    'src/ng/directive/script.js',
    'src/ng/directive/select.js',
    'src/ng/directive/style.js'
  ],

  'angularLoader': [
    'src/minErr.js',
    'src/loader.js'
  ],

  'angularModules': {
    'ngAnimate': [
      'src/ngAnimate/animate.js'
    ],
    'ngCookies': [
      'src/ngCookies/cookies.js'
    ],
    'ngResource': [
      'src/ngResource/resource.js'
    ],
    'ngRoute': [
      'src/ngRoute/route.js',
      'src/ngRoute/routeParams.js',
      'src/ngRoute/directive/ngView.js'
    ],
    'ngSanitize': [
      'src/ngSanitize/sanitize.js',
      'src/ngSanitize/filter/linky.js'
    ],
    'ngMock': [
      'src/ngMock/angular-mocks.js'
    ],
    'ngTouch': [
      'src/ngTouch/touch.js',
      'src/ngTouch/swipe.js',
      'src/ngTouch/directive/ngClick.js',
      'src/ngTouch/directive/ngSwipe.js'
    ],
  },

  'angularScenario': [
    'src/ngScenario/Scenario.js',
    'src/ngScenario/browserTrigger.js',
    'src/ngScenario/Application.js',
    'src/ngScenario/Describe.js',
    'src/ngScenario/Future.js',
    'src/ngScenario/ObjectModel.js',
    'src/ngScenario/Runner.js',
    'src/ngScenario/SpecRunner.js',
    'src/ngScenario/dsl.js',
    'src/ngScenario/matchers.js',
    'src/ngScenario/output/Html.js',
    'src/ngScenario/output/Json.js',
    'src/ngScenario/output/Xml.js',
    'src/ngScenario/output/Object.js'
  ],

  'angularTest': [
    'test/helpers/*.js',
    'test/ngScenario/*.js',
    'test/ngScenario/output/*.js',
    'test/*.js',
    'test/auto/*.js',
    'test/ng/**/*.js',
    'test/ngAnimate/*.js',
    'test/ngCookies/*.js',
    'test/ngResource/*.js',
    'test/ngRoute/**/*.js',
    'test/ngSanitize/**/*.js',
    'test/ngMock/*.js',
    'test/ngTouch/**/*.js'
  ],

  'karma': [
    'bower_components/jquery/jquery.js',
    'test/jquery_remove.js',
    '@angularSrc',
    'src/publishExternalApis.js',
    '@angularSrcModules',
    '@angularScenario',
    '@angularTest',
  ],

  'karmaExclude': [
    'test/jquery_alias.js',
    'src/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js'
  ],

  'karmaScenario': [
    'build/angular-scenario.js',
    'build/docs/docs-scenario.js'
  ],

  "karmaModules": [
    'build/angular.js',
    '@angularSrcModules',
    'src/ngScenario/browserTrigger.js',
    'test/helpers/*.js',
    'test/ngMock/*.js',
    'test/ngCookies/*.js',
    'test/ngRoute/**/*.js',
    'test/ngResource/*.js',
    'test/ngSanitize/**/*.js',
    'test/ngTouch/**/*.js'
  ],

  'karmaJquery': [
    'bower_components/jquery/jquery.js',
    'test/jquery_alias.js',
    '@angularSrc',
    'src/publishExternalApis.js',
    '@angularSrcModules',
    '@angularScenario',
    '@angularTest',
  ],

  'karmaJqueryExclude': [
    'src/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js',
    'test/jquery_remove.js'
  ]
};

angularFiles['angularSrcModules'] = [].concat(
  angularFiles['angularModules']['ngAnimate'],
  angularFiles['angularModules']['ngCookies'],
  angularFiles['angularModules']['ngResource'],
  angularFiles['angularModules']['ngRoute'],
  angularFiles['angularModules']['ngSanitize'],
  angularFiles['angularModules']['ngMock'],
  angularFiles['angularModules']['ngTouch']
);

if (exports) {
  exports.files = angularFiles;
  exports.mergeFilesFor = function() {
    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
      angularFiles[filegroup].forEach(function(file) {
        // replace @ref
        var match = file.match(/^\@(.*)/);
        if (match) {
          files = files.concat(angularFiles[match[1]]);
        } else {
          files.push(file);
        }
      });
    });

    return files;
  };
}
