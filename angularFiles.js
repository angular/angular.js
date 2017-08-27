'use strict';

var angularFiles = {
  'angularSrc': [
    'src/minErr.js',
    'src/Angular.js',
    'src/loader.js',
    'src/shallowCopy.js',
    'src/stringify.js',
    'src/AngularPublic.js',
    'src/jqLite.js',
    'src/apis.js',

    'src/auto/injector.js',

    'src/ng/anchorScroll.js',
    'src/ng/animate.js',
    'src/ng/animateRunner.js',
    'src/ng/animateCss.js',
    'src/ng/browser.js',
    'src/ng/cacheFactory.js',
    'src/ng/compile.js',
    'src/ng/controller.js',
    'src/ng/document.js',
    'src/ng/exceptionHandler.js',
    'src/ng/forceReflow.js',
    'src/ng/http.js',
    'src/ng/httpBackend.js',
    'src/ng/interpolate.js',
    'src/ng/interval.js',
    'src/ng/jsonpCallbacks.js',
    'src/ng/locale.js',
    'src/ng/location.js',
    'src/ng/log.js',
    'src/ng/parse.js',
    'src/ng/q.js',
    'src/ng/raf.js',
    'src/ng/rootScope.js',
    'src/ng/rootElement.js',
    'src/ng/sanitizeUri.js',
    'src/ng/sce.js',
    'src/ng/sniffer.js',
    'src/ng/templateRequest.js',
    'src/ng/testability.js',
    'src/ng/timeout.js',
    'src/ng/urlUtils.js',
    'src/ng/window.js',
    'src/ng/cookieReader.js',

    'src/ng/filter.js',
    'src/ng/filter/filter.js',
    'src/ng/filter/filters.js',
    'src/ng/filter/limitTo.js',
    'src/ng/filter/orderBy.js',

    'src/ng/directive/directives.js',
    'src/ng/directive/a.js',
    'src/ng/directive/attrs.js',
    'src/ng/directive/form.js',
    'src/ng/directive/input.js',
    'src/ng/directive/ngBind.js',
    'src/ng/directive/ngChange.js',
    'src/ng/directive/ngClass.js',
    'src/ng/directive/ngCloak.js',
    'src/ng/directive/ngController.js',
    'src/ng/directive/ngCsp.js',
    'src/ng/directive/ngEventDirs.js',
    'src/ng/directive/ngIf.js',
    'src/ng/directive/ngInclude.js',
    'src/ng/directive/ngInit.js',
    'src/ng/directive/ngList.js',
    'src/ng/directive/ngModel.js',
    'src/ng/directive/ngModelOptions.js',
    'src/ng/directive/ngNonBindable.js',
    'src/ng/directive/ngOptions.js',
    'src/ng/directive/ngPluralize.js',
    'src/ng/directive/ngRepeat.js',
    'src/ng/directive/ngShowHide.js',
    'src/ng/directive/ngStyle.js',
    'src/ng/directive/ngSwitch.js',
    'src/ng/directive/ngTransclude.js',
    'src/ng/directive/script.js',
    'src/ng/directive/select.js',
    'src/ng/directive/validators.js',
    'src/angular.bind.js',
    'src/publishExternalApis.js',
    'src/ngLocale/angular-locale_en-us.js'
  ],

  'angularLoader': [
    'src/stringify.js',
    'src/minErr.js',
    'src/loader.js'
  ],

  'angularModules': {
    'ngAnimate': [
      'src/ngAnimate/shared.js',
      'src/ngAnimate/rafScheduler.js',
      'src/ngAnimate/animateChildrenDirective.js',
      'src/ngAnimate/animateCss.js',
      'src/ngAnimate/animateCssDriver.js',
      'src/ngAnimate/animateJs.js',
      'src/ngAnimate/animateJsDriver.js',
      'src/ngAnimate/animateQueue.js',
      'src/ngAnimate/animation.js',
      'src/ngAnimate/ngAnimateSwap.js',
      'src/ngAnimate/module.js'
    ],
    'ngCookies': [
      'src/ngCookies/cookies.js',
      'src/ngCookies/cookieStore.js',
      'src/ngCookies/cookieWriter.js'
    ],
    'ngMessageFormat': [
      'src/ngMessageFormat/messageFormatCommon.js',
      'src/ngMessageFormat/messageFormatSelector.js',
      'src/ngMessageFormat/messageFormatInterpolationParts.js',
      'src/ngMessageFormat/messageFormatParser.js',
      'src/ngMessageFormat/messageFormatService.js'
    ],
    'ngMessages': [
      'src/ngMessages/messages.js'
    ],
    'ngParseExt': [
      'src/ngParseExt/ucd.js',
      'src/ngParseExt/module.js'
    ],
    'ngResource': [
      'src/ngResource/resource.js'
    ],
    'ngRoute': [
      'src/shallowCopy.js',
      'src/ngRoute/route.js',
      'src/ngRoute/routeParams.js',
      'src/ngRoute/directive/ngView.js'
    ],
    'ngSanitize': [
      'src/ngSanitize/sanitize.js',
      'src/ngSanitize/filter/linky.js'
    ],
    'ngMock': [
      'src/ngMock/angular-mocks.js',
      'src/ngMock/browserTrigger.js'
    ],
    'ngTouch': [
      'src/ngTouch/touch.js',
      'src/ngTouch/swipe.js',
      'src/ngTouch/directive/ngSwipe.js'
    ],
    'ngAria': [
      'src/ngAria/aria.js'
    ]
  },

  'angularScenario': [
    'src/ngScenario/Scenario.js',
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
    'test/ngMessageFormat/*.js',
    'test/ngMessages/*.js',
    'test/ngCookies/*.js',
    'test/ngResource/*.js',
    'test/ngRoute/**/*.js',
    'test/ngSanitize/**/*.js',
    'test/ngMock/*.js',
    'test/ngTouch/**/*.js',
    'test/ngAria/*.js'
  ],

  'karma': [
    'bower_components/jquery/dist/jquery.js',
    'test/jquery_remove.js',
    '@angularSrc',
    '@angularSrcModules',
    '@angularScenario',
    '@angularTest'
  ],

  'karmaExclude': [
    'test/jquery_alias.js',
    'src/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js',
    'src/angular.bind.js'
  ],

  'karmaScenario': [
    'build/angular-scenario.js',
    'build/docs/docs-scenario.js'
  ],

  'karmaModules': [
    'build/angular.js',
    '@angularSrcModules',
    'test/modules/no_bootstrap.js',
    'test/helpers/*.js',
    'test/ngAnimate/*.js',
    'test/ngMessageFormat/*.js',
    'test/ngMessages/*.js',
    'test/ngMock/*.js',
    'test/ngCookies/*.js',
    'test/ngRoute/**/*.js',
    'test/ngResource/*.js',
    'test/ngSanitize/**/*.js',
    'test/ngTouch/**/*.js',
    'test/ngAria/*.js'
  ],

  'karmaJquery': [
    'bower_components/jquery/dist/jquery.js',
    'test/jquery_alias.js',
    '@angularSrc',
    '@angularSrcModules',
    '@angularScenario',
    '@angularTest'
  ],

  'karmaJqueryExclude': [
    'src/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js',
    'test/jquery_remove.js',
    'src/angular.bind.js'
  ]
};

['2.1', '2.2'].forEach(function(jQueryVersion) {
  angularFiles['karmaJquery' + jQueryVersion] = []
    .concat(angularFiles.karmaJquery)
    .map(function(path) {
      if (path.startsWith('bower_components/jquery')) {
        return path.replace(/^bower_components\/jquery/, 'bower_components/jquery-' + jQueryVersion);
      }
      return path;
    });
});

angularFiles['angularSrcModules'] = [].concat(
  angularFiles['angularModules']['ngAnimate'],
  angularFiles['angularModules']['ngMessageFormat'],
  angularFiles['angularModules']['ngMessages'],
  angularFiles['angularModules']['ngCookies'],
  angularFiles['angularModules']['ngResource'],
  angularFiles['angularModules']['ngRoute'],
  angularFiles['angularModules']['ngSanitize'],
  angularFiles['angularModules']['ngMock'],
  angularFiles['angularModules']['ngTouch'],
  angularFiles['angularModules']['ngAria']
);

if (exports) {
  exports.files = angularFiles;
  exports.mergeFilesFor = function() {
    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
      angularFiles[filegroup].forEach(function(file) {
        // replace @ref
        var match = file.match(/^@(.*)/);
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
