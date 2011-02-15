describe('$xhr', function() {
  var scope, $browser, $browserXhr, $log, $xhr, log;

  beforeEach(function(){
    scope = angular.scope({}, angular.service, { '$log': $log = {} });
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


  it('should forward the request to $browser and decode JSON', function(){
    $browserXhr.expectGET('/reqGET').respond('first');
    $browserXhr.expectGET('/reqGETjson').respond('["second"]');
    $browserXhr.expectPOST('/reqPOST', {post:'data'}).respond('third');

    $xhr('GET', '/reqGET', null, callback);
    $xhr('GET', '/reqGETjson', null, callback);
    $xhr('POST', '/reqPOST', {post:'data'}, callback);

    $browserXhr.flush();

    expect(log).toEqual('"third";["second"];"first";');
  });


  it('should handle exceptions in callback', function(){
    $log.error = jasmine.createSpy('$log.error');
    $browserXhr.expectGET('/reqGET').respond('first');
    $xhr('GET', '/reqGET', null, function(){ throw "MyException"; });
    $browserXhr.flush();

    expect($log.error).wasCalledWith("MyException");
  });
});
