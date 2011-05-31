describe('$xhr', function() {
  var scope, $browser, $browserXhr, $log, $xhr, log;

  beforeEach(function(){
    scope = angular.scope({}, angular.service, { '$log': $log = {
        error: dump
    } });
    $browser = scope.$service('$browser');
    $browserXhr = $browser.xhr;
    $xhr = scope.$service('$xhr');
    log = '';
  });


  afterEach(function(){
    dealoc(scope);
  });


  function callback(code, response) {
    log = log + '{code=' + code + '; response=' + toJson(response) + '}';
  }


  it('should forward the request to $browser and decode JSON', function(){
    $browserXhr.expectGET('/reqGET').respond('first');
    $browserXhr.expectGET('/reqGETjson').respond('["second"]');
    $browserXhr.expectPOST('/reqPOST', {post:'data'}).respond('third');

    $xhr('GET', '/reqGET', null, callback);
    $xhr('GET', '/reqGETjson', null, callback);
    $xhr('POST', '/reqPOST', {post:'data'}, callback);

    $browserXhr.flush();

    expect(log).toEqual(
        '{code=200; response="third"}' +
        '{code=200; response=["second"]}' +
        '{code=200; response="first"}');
  });

  it('should allow all 2xx requests', function(){
    $browserXhr.expectGET('/req1').respond(200, '1');
    $xhr('GET', '/req1', null, callback);
    $browserXhr.flush();

    $browserXhr.expectGET('/req2').respond(299, '2');
    $xhr('GET', '/req2', null, callback);
    $browserXhr.flush();

    expect(log).toEqual(
        '{code=200; response="1"}' +
        '{code=299; response="2"}');
  });


  it('should handle exceptions in callback', function(){
    $log.error = jasmine.createSpy('$log.error');
    $browserXhr.expectGET('/reqGET').respond('first');
    $xhr('GET', '/reqGET', null, function(){ throw "MyException"; });
    $browserXhr.flush();

    expect($log.error).toHaveBeenCalledWith("MyException");
  });


  it('should automatically deserialize json objects', function() {
    var response;

    $browserXhr.expectGET('/foo').respond('{"foo":"bar","baz":23}');
    $xhr('GET', '/foo', function(code, resp) {
      response = resp;
    });
    $browserXhr.flush();

    expect(response).toEqual({foo:'bar', baz:23});
  });


  it('should automatically deserialize json arrays', function() {
    var response;

    $browserXhr.expectGET('/foo').respond('[1, "abc", {"foo":"bar"}]');
    $xhr('GET', '/foo', function(code, resp) {
      response = resp;
    });
    $browserXhr.flush();

    expect(response).toEqual([1, 'abc', {foo:'bar'}]);
  });


  it('should automatically deserialize json with security prefix', function() {
    var response;

    $browserXhr.expectGET('/foo').respond(')]}\',\n[1, "abc", {"foo":"bar"}]');
    $xhr('GET', '/foo', function(code, resp) {
      response = resp;
    });
    $browserXhr.flush();

    expect(response).toEqual([1, 'abc', {foo:'bar'}]);
  });

  describe('xsrf', function(){
    it('should copy the XSRF cookie into a XSRF Header', function(){
      var code, response;
      $browserXhr
        .expectPOST('URL', 'DATA', {'X-XSRF-TOKEN': 'secret'})
        .respond(234, 'OK');
      $browser.cookies('XSRF-TOKEN', 'secret');
      $xhr('POST', 'URL', 'DATA', function(c, r){
        code = c;
        response = r;
      });
      $browserXhr.flush();
      expect(code).toEqual(234);
      expect(response).toEqual('OK');
    });
  });
});
