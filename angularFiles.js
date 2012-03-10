angularFiles = {
  'angularSrc': [
    'src/Angular.js',
    'src/loader.js',
    'src/AngularPublic.js',
    'src/JSON.js',
    'src/Injector.js',
    'src/Resource.js',
    'src/jqLite.js',
    'src/apis.js',
    'src/service/anchorScroll.js',
    'src/service/browser.js',
    'src/service/cacheFactory.js',
    'src/service/compiler.js',
    'src/service/controller.js',
    'src/service/cookieStore.js',
    'src/service/cookies.js',
    'src/service/defer.js',
    'src/service/document.js',
    'src/service/exceptionHandler.js',
    'src/service/filter.js',
    'src/service/filter/filter.js',
    'src/service/filter/filters.js',
    'src/service/filter/limitTo.js',
    'src/service/filter/orderBy.js',
    'src/service/interpolate.js',
    'src/service/location.js',
    'src/service/log.js',
    'src/service/resource.js',
    'src/service/parse.js',
    'src/service/q.js',
    'src/service/route.js',
    'src/service/routeParams.js',
    'src/service/scope.js',
    'src/service/sanitize.js',
    'src/service/sniffer.js',
    'src/service/window.js',
    'src/service/http.js',
    'src/service/httpBackend.js',
    'src/service/locale.js',
    'src/directive/directives.js',
    'src/directive/a.js',
    'src/directive/booleanAttrDirs.js',
    'src/directive/form.js',
    'src/directive/input.js',
    'src/directive/ngBind.js',
    'src/directive/ngClass.js',
    'src/directive/ngCloak.js',
    'src/directive/ngController.js',
    'src/directive/ngEventDirs.js',
    'src/directive/ngInclude.js',
    'src/directive/ngInit.js',
    'src/directive/ngNonBindable.js',
    'src/directive/ngPluralize.js',
    'src/directive/ngRepeat.js',
    'src/directive/ngShowHide.js',
    'src/directive/ngStyle.js',
    'src/directive/ngSwitch.js',
    'src/directive/ngTransclude.js',
    'src/directive/ngView.js',
    'src/directive/script.js',
    'src/directive/select.js',
    'src/directive/style.js'
  ],

  'angularScenario': [
    'src/scenario/Scenario.js',
    'src/scenario/Application.js',
    'src/scenario/Describe.js',
    'src/scenario/Future.js',
    'src/scenario/ObjectModel.js',
    'src/scenario/Describe.js',
    'src/scenario/Runner.js',
    'src/scenario/SpecRunner.js',
    'src/scenario/dsl.js',
    'src/scenario/matchers.js',
    'src/scenario/output/Html.js',
    'src/scenario/output/Json.js',
    'src/scenario/output/Xml.js',
    'src/scenario/output/Object.js'
  ],

  'jstd': [
    'lib/jasmine/jasmine.js',
    'lib/jasmine-jstd-adapter/JasmineAdapter.js',
    'lib/jquery/jquery.js',
    'test/jquery_remove.js',
    '@angularSrc',
    'example/personalLog/*.js',
    'test/testabilityPatch.js',
    'test/matchers.js',
    'src/scenario/Scenario.js',
    'src/scenario/output/*.js',
    'src/jstd-scenario-adapter/*.js',
    'src/scenario/*.js',
    'src/angular-mocks.js',
    'test/scenario/*.js',
    'test/scenario/output/*.js',
    'test/jstd-scenario-adapter/*.js',
    'test/*.js',
    'test/service/*.js',
    'test/service/filter/*.js',
    'test/directive/*.js',
    'example/personalLog/test/*.js'
  ],

  'jstdExclude': [
    'test/jquery_alias.js',
    'src/angular-bootstrap.js',
    'src/scenario/angular-bootstrap.js'
  ],

  'jstdScenario': [
    'build/angular-scenario.js',
    'build/jstd-scenario-adapter-config.js',
    'build/jstd-scenario-adapter.js',
    'build/docs/docs-scenario.js'
  ],

  'jstdMocks': [
    'lib/jasmine/jasmine.js',
    'lib/jasmine-jstd-adapter/JasmineAdapter.js',
    'build/angular.js',
    'src/angular-mocks.js',
    'test/matchers.js',
    'test/angular-mocksSpec.js'
  ],

  'jstdPerf': [
   'lib/jasmine/jasmine.js',
   'lib/jasmine-jstd-adapter/JasmineAdapter.js',
   'angularSrc',
   'src/angular-mocks.js',
   'perf/data/*.js',
   'perf/testUtils.js',
   'perf/*.js'
  ],

  'jstdPerfExclude': [
    'src/angular-bootstrap.js',
    'src/scenario/angular-bootstrap.js'
  ],

  'jstdJquery': [
    'lib/jasmine/jasmine.js',
    'lib/jasmine-jstd-adapter/JasmineAdapter.js',
    'lib/jquery/jquery.js',
    'test/jquery_alias.js',
    '@angularSrc',
    'example/personalLog/*.js',
    'test/testabilityPatch.js',
    'test/matchers.js',
    'src/scenario/Scenario.js',
    'src/scenario/output/*.js',
    'src/jstd-scenario-adapter/*.js',
    'src/scenario/*.js',
    'src/angular-mocks.js',
    'test/scenario/*.js',
    'test/scenario/output/*.js',
    'test/jstd-scenario-adapter/*.js',
    'test/*.js',
    'test/service/*.js',
    'test/directive/*.js',
    'example/personalLog/test/*.js'
  ],

  'jstdJqueryExclude': [
    'src/angular-bootstrap.js',
    'src/scenario/angular-bootstrap.js',
    'test/jquery_remove.js'
  ]
};

// Execute only in slim-jim
if (typeof JASMINE_ADAPTER !== 'undefined') {
  // SlimJim config
  files = [JASMINE, JASMINE_ADAPTER];
  angularFiles.jstd.forEach(function(pattern) {
    // replace angular source
    if (pattern === '@angularSrc') files = files.concat(angularFiles.angularSrc);
    // ignore jstd and jasmine files
    else if (!/jstd|jasmine/.test(pattern)) files.push(pattern);
  });

  exclude = angularFiles.jstdExclude;

  autoWatch = true;
  autoWatchInterval = 1;
  logLevel = LOG_INFO;
  logColors = true;
}
