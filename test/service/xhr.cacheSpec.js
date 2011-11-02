'use strict';

describe('$xhr.cache', function() {
  var log;

  beforeEach(inject(function($provide) {
    $provide.value('$xhr.error', jasmine.createSpy('$xhr.error'));
    $provide.factory('$xhrError', ['$xhr.error', identity]);
    $provide.factory('$xhrBulk', ['$xhr.bulk', identity]);
    $provide.factory('$xhrCache', ['$xhr.cache', identity]);
    log = '';
  }));


  function callback(code, response) {
    expect(code).toEqual(200);
    log = log + toJson(response) + ';';
  }


  it('should cache requests', inject(function($browser, $xhrCache) {
    $browser.xhr.expectGET('/url').respond('first');
    $xhrCache('GET', '/url', null, callback);
    $browser.xhr.flush();

    $browser.xhr.expectGET('/url').respond('ERROR');
    $xhrCache('GET', '/url', null, callback);
    $browser.defer.flush();
    expect(log).toEqual('"first";"first";');

    $xhrCache('GET', '/url', null, callback, false);
    $browser.defer.flush();
    expect(log).toEqual('"first";"first";"first";');
  }));


  it('should first return cache request, then return server request', inject(function($browser, $xhrCache) {
    $browser.xhr.expectGET('/url').respond('first');
    $xhrCache('GET', '/url', null, callback, true);
    $browser.xhr.flush();

    $browser.xhr.expectGET('/url').respond('ERROR');
    $xhrCache('GET', '/url', null, callback, true);
    $browser.defer.flush();
    expect(log).toEqual('"first";"first";');

    $browser.xhr.flush();
    expect(log).toEqual('"first";"first";"ERROR";');
  }));


  it('should serve requests from cache', inject(function($browser, $xhrCache) {
    $xhrCache.data.url = {value:'123'};
    $xhrCache('GET', 'url', null, callback);
    $browser.defer.flush();
    expect(log).toEqual('"123";');

    $xhrCache('GET', 'url', null, callback, false);
    $browser.defer.flush();
    expect(log).toEqual('"123";"123";');
  }));


  it('should keep track of in flight requests and request only once', inject(function($browser, $xhrCache, $xhrBulk) {
    $xhrBulk.urls['/bulk'] = {
      match:function(url){
        return url == '/url';
      }
    };
    $browser.xhr.expectPOST('/bulk', {
      requests:[{method:'GET',  url:'/url', data: null}]
    }).respond([
      {status:200, response:'123'}
    ]);
    $xhrCache('GET', '/url', null, callback);
    $xhrCache('GET', '/url', null, callback);
    $xhrCache.delegate.flush();
    $browser.xhr.flush();
    expect(log).toEqual('"123";"123";');
  }));


  it('should clear cache on non GET', inject(function($browser, $xhrCache) {
    $browser.xhr.expectPOST('abc', {}).respond({});
    $xhrCache.data.url = {value:123};
    $xhrCache('POST', 'abc', {});
    expect($xhrCache.data.url).toBeUndefined();
  }));


  it('should call callback asynchronously for both cache hit and cache miss', inject(function($browser, $xhrCache) {
    $browser.xhr.expectGET('/url').respond('+');
    $xhrCache('GET', '/url', null, callback);
    expect(log).toEqual(''); //callback hasn't executed

    $browser.xhr.flush();
    expect(log).toEqual('"+";'); //callback has executed

    $xhrCache('GET', '/url', null, callback);
    expect(log).toEqual('"+";'); //callback hasn't executed

    $browser.defer.flush();
    expect(log).toEqual('"+";"+";'); //callback has executed
  }));


  it('should call callback synchronously when sync flag is on', inject(function($browser, $xhrCache) {
    $browser.xhr.expectGET('/url').respond('+');
    $xhrCache('GET', '/url', null, callback, false, true);
    expect(log).toEqual(''); //callback hasn't executed

    $browser.xhr.flush();
    expect(log).toEqual('"+";'); //callback has executed

    $xhrCache('GET', '/url', null, callback, false, true);
    expect(log).toEqual('"+";"+";'); //callback has executed

    $browser.defer.flush();
    expect(log).toEqual('"+";"+";'); //callback was not called again any more
  }));


  it('should call eval after callbacks for both cache hit and cache miss execute',
      inject(function($browser, $xhrCache, $rootScope) {
    var flushSpy = this.spyOn($rootScope, '$digest').andCallThrough();

    $browser.xhr.expectGET('/url').respond('+');
    $xhrCache('GET', '/url', null, callback);
    expect(flushSpy).not.toHaveBeenCalled();

    $browser.xhr.flush();
    expect(flushSpy).toHaveBeenCalled();

    flushSpy.reset(); //reset the spy

    $xhrCache('GET', '/url', null, callback);
    expect(flushSpy).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(flushSpy).toHaveBeenCalled();
  }));

  it('should call the error callback on error if provided', inject(function($browser, $xhrCache) {
    var errorSpy = jasmine.createSpy('error'),
        successSpy = jasmine.createSpy('success');

    $browser.xhr.expectGET('/url').respond(500, 'error');

    $xhrCache('GET', '/url', null, successSpy, errorSpy, false, true);
    $browser.xhr.flush();
    expect(errorSpy).toHaveBeenCalledWith(500, 'error');
    expect(successSpy).not.toHaveBeenCalled();

    errorSpy.reset();
    $xhrCache('GET', '/url', successSpy, errorSpy, false, true);
    $browser.xhr.flush();
    expect(errorSpy).toHaveBeenCalledWith(500, 'error');
    expect(successSpy).not.toHaveBeenCalled();
  }));

  it('should call the $xhr.error on error if error callback not provided',
      inject(function($browser, $xhrCache, $xhrError) {
    var errorSpy = jasmine.createSpy('error'),
        successSpy = jasmine.createSpy('success');

    $browser.xhr.expectGET('/url').respond(500, 'error');
    $xhrCache('GET', '/url', null, successSpy, false, true);
    $browser.xhr.flush();

    expect(successSpy).not.toHaveBeenCalled();
    expect($xhrError).toHaveBeenCalledWith(
      {method: 'GET', url: '/url', data: null, success: successSpy},
      {status: 500, body: 'error'});
  }));
});
