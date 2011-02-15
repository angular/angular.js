describe('$updateView', function() {
  var scope, browser, evalCount, $updateView;

  beforeEach(function(){
    browser = new MockBrowser();
    // Pretend that you are real Browser so that we see the delays
    browser.isMock = false;
    browser.defer = jasmine.createSpy('defer');

    scope = angular.scope(null, null, {$browser:browser});
    $updateView = scope.$service('$updateView');
    scope.$onEval(function(){ evalCount++; });
    evalCount = 0;
  });


  afterEach(function(){
    dealoc(scope);
  });


  it('should eval root scope after a delay', function(){
    $updateView();
    expect(evalCount).toEqual(0);
    expect(browser.defer).toHaveBeenCalled();
    expect(browser.defer.mostRecentCall.args[1]).toEqual(25);
    browser.defer.mostRecentCall.args[0]();
    expect(evalCount).toEqual(1);
  });


  it('should allow changing of delay time', function(){
    var oldValue = angular.service('$updateView').delay;
    angular.service('$updateView').delay = 50;
    $updateView();
    expect(evalCount).toEqual(0);
    expect(browser.defer).toHaveBeenCalled();
    expect(browser.defer.mostRecentCall.args[1]).toEqual(50);
    angular.service('$updateView').delay = oldValue;
  });


  it('should ignore multiple requests for update', function(){
    $updateView();
    $updateView();
    expect(evalCount).toEqual(0);
    expect(browser.defer).toHaveBeenCalled();
    expect(browser.defer.callCount).toEqual(1);
    browser.defer.mostRecentCall.args[0]();
    expect(evalCount).toEqual(1);
  });


  it('should update immediatelly in test/mock mode', function(){
    scope = angular.scope();
    scope.$onEval(function(){ evalCount++; });
    expect(evalCount).toEqual(0);
    scope.$service('$updateView')();
    expect(evalCount).toEqual(1);
  });
});
