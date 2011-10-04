angularFiles = {
  'angularSrc': [
    'src/Angular.js',
    'src/JSON.js',
    'src/Compiler.js',
    'src/Scope.js',
    'src/Injector.js',
    'src/parser.js',
    'src/Resource.js',
    'src/Browser.js',
    'src/sanitizer.js',
    'src/jqLite.js',
    'src/apis.js',
    'src/filters.js',
    'src/formatters.js',
    'src/validators.js',
    'src/service/cookieStore.js',
    'src/service/cookies.js',
    'src/service/defer.js',
    'src/service/document.js',
    'src/service/exceptionHandler.js',
    'src/service/hover.js',
    'src/service/invalidWidgets.js',
    'src/service/location.js',
    'src/service/log.js',
    'src/service/resource.js',
    'src/service/route.js',
    'src/service/routeParams.js',
    'src/service/sniffer.js',
    'src/service/window.js',
    'src/service/xhr.bulk.js',
    'src/service/xhr.cache.js',
    'src/service/xhr.error.js',
    'src/service/xhr.js',
    'src/service/locale.js',
    'src/directives.js',
    'src/markups.js',
    'src/widgets.js',
    'src/AngularPublic.js',
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
    'lib/jstd-jasmine/jasmine/jasmine.js',
    'lib/jstd-jasmine/jasmine-jstd-adapter/JasmineAdapter.js',
    'lib/jquery/jquery.js',
    'test/jquery_remove.js',
    '@angularSrc',
    'example/personalLog/*.js',
    'test/testabilityPatch.js',
    'src/scenario/Scenario.js',
    'src/scenario/output/*.js',
    'src/jstd-scenario-adapter/*.js',
    'src/scenario/*.js',
    'src/angular-mocks.js',
    'test/mocks.js',
    'test/scenario/*.js',
    'test/scenario/output/*.js',
    'test/jstd-scenario-adapter/*.js',
    'test/*.js',
    'test/service/*.js',
    'example/personalLog/test/*.js'
  ],

  'jstdExclude': [
    'test/jquery_alias.js',
    'src/angular-bootstrap.js',
    'src/scenario/angular-bootstrap.js',
    'src/AngularPublic.js'
  ],

  'jstdScenario': [
    'build/angular-scenario.js',
    'build/jstd-scenario-adapter-config.js',
    'build/jstd-scenario-adapter.js',
    'build/docs/docs-scenario.js'
  ],

  'jstdPerf': [
   'lib/jstd-jasmine/jasmine/jasmine.js',
   'lib/jstd-jasmine/jasmine-jstd-adapter/JasmineAdapter.js',
   'angularSrc',
   'src/angular-mocks.js',
   'perf/data/*.js',
   'perf/testUtils.js',
   'perf/*.js'
  ],

  'jstdPerfExclude': [
    'src/angular-bootstrap.js',
    'src/scenario/angular-bootstrap.js',
    'src/AngularPublic.js'
  ],

  'jstdJquery': [
    'lib/jstd-jasmine/jasmine/jasmine.js',
    'lib/jstd-jasmine/jasmine-jstd-adapter/JasmineAdapter.js',
    'lib/jquery/jquery.js',
    'test/jquery_alias.js',
    '@angularSrc',
    'example/personalLog/*.js',
    'test/testabilityPatch.js',
    'src/scenario/Scenario.js',
    'src/scenario/output/*.js',
    'src/jstd-scenario-adapter/*.js',
    'src/scenario/*.js',
    'src/angular-mocks.js',
    'test/mocks.js',
    'test/scenario/*.js',
    'test/scenario/output/*.js',
    'test/jstd-scenario-adapter/*.js',
    'test/*.js',
    'test/service/*.js',
    'example/personalLog/test/*.js'
  ],

  'jstdJqueryExclude': [
    'src/angular-bootstrap.js',
    'src/AngularPublic.js',
    'src/scenario/angular-bootstrap.js',
    'test/jquery_remove.js'
  ]
}
