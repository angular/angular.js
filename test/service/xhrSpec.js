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


  describe('http headers', function() {

    describe('default headers', function() {

      it('should set default headers for GET request', function(){
        var callback = jasmine.createSpy('callback');

        $browserXhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*',
                                          'X-Requested-With': 'XMLHttpRequest'}).
                    respond(234, 'OK');

        $xhr('GET', 'URL', callback);
        $browserXhr.flush();
        expect(callback).toHaveBeenCalled();
      });


      it('should set default headers for POST request', function(){
        var callback = jasmine.createSpy('callback');

        $browserXhr.expectPOST('URL', 'xx', {'Accept': 'application/json, text/plain, */*',
                                             'X-Requested-With': 'XMLHttpRequest',
                                             'Content-Type': 'application/x-www-form-urlencoded'}).
                    respond(200, 'OK');

        $xhr('POST', 'URL', 'xx', callback);
        $browserXhr.flush();
        expect(callback).toHaveBeenCalled();
      });


      it('should set default headers for custom HTTP method', function(){
        var callback = jasmine.createSpy('callback');

        $browserXhr.expect('FOO', 'URL', '', {'Accept': 'application/json, text/plain, */*',
                                              'X-Requested-With': 'XMLHttpRequest'}).
                    respond(200, 'OK');

        $xhr('FOO', 'URL', callback);
        $browserXhr.flush();
        expect(callback).toHaveBeenCalled();
      });


      describe('custom headers', function() {

        it('should allow appending a new header to the common defaults', function() {
          var callback = jasmine.createSpy('callback');

          $browserXhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'Custom-Header': 'value'}).
                      respond(200, 'OK');

          $xhr.defaults.headers.common['Custom-Header'] = 'value';
          $xhr('GET', 'URL', callback);
          $browserXhr.flush();
          expect(callback).toHaveBeenCalled();
          callback.reset();

          $browserXhr.expectPOST('URL', 'xx', {'Accept': 'application/json, text/plain, */*',
                                               'X-Requested-With': 'XMLHttpRequest',
                                               'Content-Type': 'application/x-www-form-urlencoded',
                                               'Custom-Header': 'value'}).
                      respond(200, 'OK');

         $xhr('POST', 'URL', 'xx', callback);
         $browserXhr.flush();
         expect(callback).toHaveBeenCalled();
        });


        it('should allow appending a new header to a method specific defaults', function() {
          var callback = jasmine.createSpy('callback');

          $browserXhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'Content-Type': 'application/json'}).
                      respond(200, 'OK');

          $xhr.defaults.headers.get['Content-Type'] = 'application/json';
          $xhr('GET', 'URL', callback);
          $browserXhr.flush();
          expect(callback).toHaveBeenCalled();
          callback.reset();

          $browserXhr.expectPOST('URL', 'x', {'Accept': 'application/json, text/plain, */*',
                                              'X-Requested-With': 'XMLHttpRequest',
                                              'Content-Type': 'application/x-www-form-urlencoded'}).
                      respond(200, 'OK');

         $xhr('POST', 'URL', 'x', callback);
         $browserXhr.flush();
         expect(callback).toHaveBeenCalled();
        });


        it('should support overwriting and deleting default headers', function() {
          var callback = jasmine.createSpy('callback');

          $browserXhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*'}).
                      respond(200, 'OK');

          //delete a default header
          delete $xhr.defaults.headers.common['X-Requested-With'];
          $xhr('GET', 'URL', callback);
          $browserXhr.flush();
          expect(callback).toHaveBeenCalled();
          callback.reset();

          $browserXhr.expectPOST('URL', 'xx', {'Accept': 'application/json, text/plain, */*',
                                               'Content-Type': 'application/json'}).
                      respond(200, 'OK');

         //overwrite a default header
         $xhr.defaults.headers.post['Content-Type'] = 'application/json';
         $xhr('POST', 'URL', 'xx', callback);
         $browserXhr.flush();
         expect(callback).toHaveBeenCalled();
        });
      });
    });
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
