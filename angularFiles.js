angularFiles = {
  'angularSrc': [
    'src/Angular.js',
    'src/loader.js',
    'src/AngularPublic.js',
    'src/jqLite.js',
    'src/apis.js',

    'src/auto/injector.js',

    'src/ng/anchorScroll.js',
    'src/ng/animation.js',
    'src/ng/animator.js',
    'src/ng/browser.js',
    'src/ng/cacheFactory.js',
    'src/ng/compile.js',
    'src/ng/controller.js',
    'src/ng/document.js',
    'src/ng/exceptionHandler.js',
    'src/ng/interpolate.js',
    'src/ng/location.js',
    'src/ng/log.js',
    'src/ng/parse.js',
    'src/ng/q.js',
    'src/ng/route.js',
    'src/ng/routeParams.js',
    'src/ng/rootScope.js',
    'src/ng/sniffer.js',
    'src/ng/window.js',
    'src/ng/http.js',
    'src/ng/httpBackend.js',
    'src/ng/locale.js',
    'src/ng/timeout.js',

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
    'src/ng/directive/ngInclude.js',
    'src/ng/directive/ngInit.js',
    'src/ng/directive/ngNonBindable.js',
    'src/ng/directive/ngPluralize.js',
    'src/ng/directive/ngRepeat.js',
    'src/ng/directive/ngShowHide.js',
    'src/ng/directive/ngStyle.js',
    'src/ng/directive/ngSwitch.js',
    'src/ng/directive/ngTransclude.js',
    'src/ng/directive/ngView.js',
    'src/ng/directive/script.js',
    'src/ng/directive/select.js',
    'src/ng/directive/style.js'
  ],

  'angularSrcModules': [
    'src/ngCookies/cookies.js',
    'src/ngResource/resource.js',
    'src/ngSanitize/sanitize.js',
    'src/ngSanitize/directive/ngBindHtml.js',
    'src/ngSanitize/filter/linky.js',
    'src/ngMock/angular-mocks.js',
    'src/ngMobile/mobile.js',
    'src/ngMobile/directive/ngClick.js',
    'src/bootstrap/bootstrap.js'
  ],

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
    'test/testabilityPatch.js',
    'test/matchers.js',
    'test/ngScenario/*.js',
    'test/ngScenario/output/*.js',
    'test/ngScenario/jstd-scenario-adapter/*.js',
    'test/*.js',
    'test/auto/*.js',
    'test/bootstrap/*.js',
    'test/ng/*.js',
    'test/ng/directive/*.js',
    'test/ng/filter/*.js',
    'test/ngCookies/*.js',
    'test/ngResource/*.js',
    'test/ngSanitize/*.js',
    'test/ngSanitize/directive/*.js',
    'test/ngSanitize/filter/*.js',
    'test/ngMock/*.js',
    'test/ngMobile/directive/*.js'
  ],

  'jstd': [
    'lib/jasmine/jasmine.js',
    'lib/jasmine-jstd-adapter/JasmineAdapter.js',
    'lib/jquery/jquery.js',
    'test/jquery_remove.js',
    '@angularSrc',
    'src/publishExternalApis.js',
    '@angularSrcModules',
    '@angularScenario',
    'src/ngScenario/jstd-scenario-adapter/Adapter.js',
    '@angularTest',
    'example/personalLog/*.js',
    'example/personalLog/test/*.js'
  ],

  'jstdExclude': [
    'test/jquery_alias.js',
    'src/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js'
  ],

  'jstdScenario': [
    'build/angular-scenario.js',
    'build/jstd-scenario-adapter-config.js',
    'build/jstd-scenario-adapter.js',
    'build/docs/docs-scenario.js'
  ],

  "jstdModules": [
    'lib/jasmine/jasmine.js',
    'lib/jasmine-jstd-adapter/JasmineAdapter.js',
    'build/angular.js',
    'build/angular-scenario.js',
    'src/ngMock/angular-mocks.js',
    'src/ngCookies/cookies.js',
    'src/ngResource/resource.js',
    'src/ngMobile/mobile.js',
    'src/ngMobile/directive/ngClick.js',
    'src/ngSanitize/sanitize.js',
    'src/ngSanitize/directive/ngBindHtml.js',
    'src/ngSanitize/filter/linky.js',
    'test/matchers.js',
    'test/ngMock/*.js',
    'test/ngCookies/*.js',
    'test/ngResource/*.js',
    'test/ngSanitize/*.js',
    'test/ngSanitize/directive/*.js',
    'test/ngSanitize/filter/*.js',
    'test/ngMobile/directive/*.js'
  ],

  'jstdPerf': [
   'lib/jasmine/jasmine.js',
   'lib/jasmine-jstd-adapter/JasmineAdapter.js',
   '@angularSrc',
   '@angularSrcModules',
   'src/ngMock/angular-mocks.js',
   'perf/data/*.js',
   'perf/testUtils.js',
   'perf/*.js'
  ],

  'jstdPerfExclude': [
    'src/ng/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js'
  ],

  'jstdJquery': [
    'lib/jasmine/jasmine.js',
    'lib/jasmine-jstd-adapter/JasmineAdapter.js',
    'lib/jquery/jquery.js',
    'test/jquery_alias.js',
    '@angularSrc',
    'src/publishExternalApis.js',
    '@angularSrcModules',
    '@angularScenario',
    'src/ngScenario/jstd-scenario-adapter/Adapter.js',
    '@angularTest',
    'example/personalLog/*.js',

    'example/personalLog/test/*.js'
  ],

  'jstdJqueryExclude': [
    'src/angular-bootstrap.js',
    'src/ngScenario/angular-bootstrap.js',
    'test/jquery_remove.js'
  ]
};

if (exports) {
  exports.files = angularFiles
  exports.mergeFiles = function mergeFiles() {
    var files = [];

    [].splice.call(arguments, 0).forEach(function(file) {
      if (file.match(/karma/)) {
        files.push(file);
      } else {
        angularFiles[file].forEach(function(f) {
          // replace @ref
          var match = f.match(/^\@(.*)/);
          if (match) {
            var deps = angularFiles[match[1]];
            files = files.concat(deps);
          } else {
            if (!/jstd|jasmine/.test(f)) { //TODO(i): remove once we don't have jstd/jasmine in repo
              files.push(f);
            }
          }
        });
      }
    });

    return files;
  }
}
