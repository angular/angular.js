describe('$defer', function() {
  var scope, $browser, $defer, $exceptionHandler;

  beforeEach(function(){
    scope = angular.scope({}, angular.service,
                          {'$exceptionHandler': jasmine.createSpy('$exceptionHandler')});
    $browser = scope.$service('$browser');
    $defer = scope.$service('$defer');
    $exceptionHandler = scope.$service('$exceptionHandler');
  });

  afterEach(function(){
    dealoc(scope);
  });


  it('should delegate functions to $browser.defer', function() {
    var counter = 0;
    $defer(function() { counter++; });

    expect(counter).toBe(0);

    $browser.defer.flush();
    expect(counter).toBe(1);

    $browser.defer.flush(); //does nothing
    expect(counter).toBe(1);

    expect($exceptionHandler).not.toHaveBeenCalled();
  });


  it('should delegate exception to the $exceptionHandler service', function() {
    $defer(function() {throw "Test Error";});
    expect($exceptionHandler).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect($exceptionHandler).toHaveBeenCalledWith("Test Error");
  });


  it('should call eval after each callback is executed', function() {
    var eval = this.spyOn(scope, '$eval').andCallThrough();

    $defer(function() {});
    expect(eval).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(eval).toHaveBeenCalled();

    eval.reset(); //reset the spy;

    $defer(function() {});
    $defer(function() {});
    $browser.defer.flush();
    expect(eval.callCount).toBe(2);
  });


  it('should call eval even if an exception is thrown in callback', function() {
    var eval = this.spyOn(scope, '$eval').andCallThrough();

    $defer(function() {throw "Test Error";});
    expect(eval).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(eval).toHaveBeenCalled();
  });

  it('should allow you to specify the delay time', function(){
    var defer = this.spyOn($browser, 'defer');
    $defer(noop, 123);
    expect(defer.callCount).toEqual(1);
    expect(defer.mostRecentCall.args[1]).toEqual(123);
  });
});
