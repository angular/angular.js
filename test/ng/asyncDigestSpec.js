'use strict';

describe('$digest', function() {
  var element, $compile, scope, $exceptionHandler, $compileProvider;
  var run = 100;

  beforeEach(module(function($rootScopeProvider, $schedulerProvider)
  {
    $rootScopeProvider.asyncDigest(true);
    $schedulerProvider.run(run);
  }));

  beforeEach(module(function(_$compileProvider_) {
    $compileProvider = _$compileProvider_;
  }));


  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  beforeEach(inject(function(_$compile_, $rootScope, _$exceptionHandler_) {
    $compile = _$compile_;
    $exceptionHandler = _$exceptionHandler_;
    scope = $rootScope.$new();
  }));


  afterEach(function() {
    if ($exceptionHandler.errors.length) {
      dump(jasmine.getEnv().currentSpec.getFullName());
      dump('$exceptionHandler has errors');
      dump($exceptionHandler.errors);
      expect($exceptionHandler.errors).toBe([]);
    }
    dealoc(element);
  });


  it('Big data model should be digested in chunks', inject(function($browser) {
    var count = 50, maxTime = run * 5, runCount = 0, start, end, items, finished, promise;

    scope.items = [];

    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item.name}};</li>' +
      '</ul>')(scope);

    while(runCount < 4)
    {
      finished = false;
      runCount = 0;

      items = new Array(count);

      for(var i = 0; i < count; ++i)
      {
        items[i] = { name: i };
      }

      scope.items = items;

      start = new Date().getTime();
      promise = scope.$digest();
      end = new Date().getTime();
      ++runCount;

      expect(end - start).toBeLessThan(maxTime);

      promise["finally"](function () { finished = true; }).
        then(
          function ()
          {
            expect(element.find('li').length).toEqual(items.length);
          });

      var q = scope.$digestQ();

      while(!finished)
      {
        start = new Date().getTime();
        q.run();
        end = new Date().getTime();

        expect(end - start).toBeLessThan(maxTime);

        ++runCount;
      }

      count *= 2;
    }
  }));

});
