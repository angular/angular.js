describe('$xhr.error', function() {
  var scope, $browser, $browserXhr, $xhr, $xhrError, log;

  beforeEach(function(){
    scope = angular.scope({}, angular.service, {
      '$xhr.error': $xhrError = jasmine.createSpy('$xhr.error')
    });
    $browser = scope.$service('$browser');
    $browserXhr = $browser.xhr;
    $xhr = scope.$service('$xhr');
    log = '';
  });


  afterEach(function(){
    dealoc(scope);
  });


  function callback(code, response) {
    expect(code).toEqual(200);
    log = log + toJson(response) + ';';
  }


  it('should handle non 200 status codes by forwarding to error handler', function(){
    $browserXhr.expectPOST('/req', 'MyData').respond(500, 'MyError');
    $xhr('POST', '/req', 'MyData', callback);
    $browserXhr.flush();
    var cb = $xhrError.mostRecentCall.args[0].callback;
    expect(typeof cb).toEqual($function);
    expect($xhrError).wasCalledWith(
        {url:'/req', method:'POST', data:'MyData', callback:cb},
        {status:500, body:'MyError'});
  });
});
