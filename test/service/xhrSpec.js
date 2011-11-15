'use strict';

describe('$xhr', function() {

  var log;

  beforeEach(inject(function($provide) {
    log = '';
    $provide.value('$xhr.error', jasmine.createSpy('xhr.error'));
    $provide.factory('$xhrError', ['$xhr.error', identity]);
  }));


  function callback(code, response) {
    log = log + '{code=' + code + '; response=' + toJson(response) + '}';
  }


  it('should forward the request to $browser and decode JSON', inject(function($browser, $xhr) {
    $browser.xhr.expectGET('/reqGET').respond('first');
    $browser.xhr.expectGET('/reqGETjson').respond('["second"]');
    $browser.xhr.expectPOST('/reqPOST', {post:'data'}).respond('third');

    $xhr('GET', '/reqGET', null, callback);
    $xhr('GET', '/reqGETjson', null, callback);
    $xhr('POST', '/reqPOST', {post:'data'}, callback);

    $browser.xhr.flush();

    expect(log).toEqual(
        '{code=200; response="third"}' +
        '{code=200; response=["second"]}' +
        '{code=200; response="first"}');
  }));

  it('should allow all 2xx requests', inject(function($browser, $xhr) {
    $browser.xhr.expectGET('/req1').respond(200, '1');
    $xhr('GET', '/req1', null, callback);
    $browser.xhr.flush();

    $browser.xhr.expectGET('/req2').respond(299, '2');
    $xhr('GET', '/req2', null, callback);
    $browser.xhr.flush();

    expect(log).toEqual(
        '{code=200; response="1"}' +
        '{code=299; response="2"}');
  }));


  it('should handle exceptions in callback', inject(function($browser, $xhr, $log) {
    $browser.xhr.expectGET('/reqGET').respond('first');
    $xhr('GET', '/reqGET', null, function() { throw "MyException"; });
    $browser.xhr.flush();

    expect($log.error.logs.shift()).toContain('MyException');
  }));


  it('should automatically deserialize json objects', inject(function($browser, $xhr) {
    var response;

    $browser.xhr.expectGET('/foo').respond('{"foo":"bar","baz":23}');
    $xhr('GET', '/foo', function(code, resp) {
      response = resp;
    });
    $browser.xhr.flush();

    expect(response).toEqual({foo:'bar', baz:23});
  }));


  it('should automatically deserialize json arrays', inject(function($browser, $xhr) {
    var response;

    $browser.xhr.expectGET('/foo').respond('[1, "abc", {"foo":"bar"}]');
    $xhr('GET', '/foo', function(code, resp) {
      response = resp;
    });
    $browser.xhr.flush();

    expect(response).toEqual([1, 'abc', {foo:'bar'}]);
  }));


  it('should automatically deserialize json with security prefix', inject(function($browser, $xhr) {
    var response;

    $browser.xhr.expectGET('/foo').respond(')]}\',\n[1, "abc", {"foo":"bar"}]');
    $xhr('GET', '/foo', function(code, resp) {
      response = resp;
    });
    $browser.xhr.flush();

    expect(response).toEqual([1, 'abc', {foo:'bar'}]);
  }));

  it('should call $xhr.error on error if no error callback provided', inject(function($browser, $xhr, $xhrError) {
    var successSpy = jasmine.createSpy('success');

    $browser.xhr.expectGET('/url').respond(500, 'error');
    $xhr('GET', '/url', null, successSpy);
    $browser.xhr.flush();

    expect(successSpy).not.toHaveBeenCalled();
    expect($xhrError).toHaveBeenCalledWith(
      {method: 'GET', url: '/url', data: null, success: successSpy},
      {status: 500, body: 'error'}
    );
  }));

  it('should call the error callback on error if provided', inject(function($browser, $xhr) {
    var errorSpy = jasmine.createSpy('error'),
        successSpy = jasmine.createSpy('success');

    $browser.xhr.expectGET('/url').respond(500, 'error');
    $xhr('GET', '/url', null, successSpy, errorSpy);
    $browser.xhr.flush();

    expect(errorSpy).toHaveBeenCalledWith(500, 'error');
    expect(successSpy).not.toHaveBeenCalled();

    errorSpy.reset();
    $xhr('GET', '/url', successSpy, errorSpy);
    $browser.xhr.flush();

    expect(errorSpy).toHaveBeenCalledWith(500, 'error');
    expect(successSpy).not.toHaveBeenCalled();
  }));

  describe('http headers', function() {

    describe('default headers', function() {

      it('should set default headers for GET request', inject(function($browser, $xhr) {
        var callback = jasmine.createSpy('callback');

        $browser.xhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*',
                                          'X-Requested-With': 'XMLHttpRequest'}).
                    respond(234, 'OK');

        $xhr('GET', 'URL', callback);
        $browser.xhr.flush();
        expect(callback).toHaveBeenCalled();
      }));


      it('should set default headers for POST request', inject(function($browser, $xhr) {
        var callback = jasmine.createSpy('callback');

        $browser.xhr.expectPOST('URL', 'xx', {'Accept': 'application/json, text/plain, */*',
                                             'X-Requested-With': 'XMLHttpRequest',
                                             'Content-Type': 'application/x-www-form-urlencoded'}).
                    respond(200, 'OK');

        $xhr('POST', 'URL', 'xx', callback);
        $browser.xhr.flush();
        expect(callback).toHaveBeenCalled();
      }));


      it('should set default headers for custom HTTP method', inject(function($browser, $xhr) {
        var callback = jasmine.createSpy('callback');

        $browser.xhr.expect('FOO', 'URL', '', {'Accept': 'application/json, text/plain, */*',
                                              'X-Requested-With': 'XMLHttpRequest'}).
                    respond(200, 'OK');

        $xhr('FOO', 'URL', callback);
        $browser.xhr.flush();
        expect(callback).toHaveBeenCalled();
      }));


      describe('custom headers', function() {

        it('should allow appending a new header to the common defaults', inject(function($browser, $xhr) {
          var callback = jasmine.createSpy('callback');

          $browser.xhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'Custom-Header': 'value'}).
                      respond(200, 'OK');

          $xhr.defaults.headers.common['Custom-Header'] = 'value';
          $xhr('GET', 'URL', callback);
          $browser.xhr.flush();
          expect(callback).toHaveBeenCalled();
          callback.reset();

          $browser.xhr.expectPOST('URL', 'xx', {'Accept': 'application/json, text/plain, */*',
                                               'X-Requested-With': 'XMLHttpRequest',
                                               'Content-Type': 'application/x-www-form-urlencoded',
                                               'Custom-Header': 'value'}).
                      respond(200, 'OK');

         $xhr('POST', 'URL', 'xx', callback);
         $browser.xhr.flush();
         expect(callback).toHaveBeenCalled();
        }));


        it('should allow appending a new header to a method specific defaults', inject(function($browser, $xhr) {
          var callback = jasmine.createSpy('callback');

          $browser.xhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'Content-Type': 'application/json'}).
                      respond(200, 'OK');

          $xhr.defaults.headers.get['Content-Type'] = 'application/json';
          $xhr('GET', 'URL', callback);
          $browser.xhr.flush();
          expect(callback).toHaveBeenCalled();
          callback.reset();

          $browser.xhr.expectPOST('URL', 'x', {'Accept': 'application/json, text/plain, */*',
                                              'X-Requested-With': 'XMLHttpRequest',
                                              'Content-Type': 'application/x-www-form-urlencoded'}).
                      respond(200, 'OK');

         $xhr('POST', 'URL', 'x', callback);
         $browser.xhr.flush();
         expect(callback).toHaveBeenCalled();
        }));


        it('should support overwriting and deleting default headers', inject(function($browser, $xhr) {
          var callback = jasmine.createSpy('callback');

          $browser.xhr.expectGET('URL', '', {'Accept': 'application/json, text/plain, */*'}).
                      respond(200, 'OK');

          //delete a default header
          delete $xhr.defaults.headers.common['X-Requested-With'];
          $xhr('GET', 'URL', callback);
          $browser.xhr.flush();
          expect(callback).toHaveBeenCalled();
          callback.reset();

          $browser.xhr.expectPOST('URL', 'xx', {'Accept': 'application/json, text/plain, */*',
                                               'Content-Type': 'application/json'}).
                      respond(200, 'OK');

         //overwrite a default header
         $xhr.defaults.headers.post['Content-Type'] = 'application/json';
         $xhr('POST', 'URL', 'xx', callback);
         $browser.xhr.flush();
         expect(callback).toHaveBeenCalled();
        }));
      });
    });
  });

  describe('xsrf', function() {
    it('should copy the XSRF cookie into a XSRF Header', inject(function($browser, $xhr) {
      var code, response;
      $browser.xhr
        .expectPOST('URL', 'DATA', {'X-XSRF-TOKEN': 'secret'})
        .respond(234, 'OK');
      $browser.cookies('XSRF-TOKEN', 'secret');
      $xhr('POST', 'URL', 'DATA', function(c, r){
        code = c;
        response = r;
      });
      $browser.xhr.flush();
      expect(code).toEqual(234);
      expect(response).toEqual('OK');
    }));
  });
});
