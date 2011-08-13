'use strict';

describe('$xhr.cache', function() {
  var scope, $browser, $browserXhr, $xhrErr, cache, log;

  beforeEach(function() {
    scope = angular.scope(angularService, {'$xhr.error': $xhrErr = jasmine.createSpy('$xhr.error')});
    $browser = scope.$service('$browser');
    $browserXhr = $browser.xhr;
    cache = scope.$service('$xhr.cache');
    log = '';
  });


  afterEach(function(){
    dealoc(scope);
  });


  function callback(code, response) {
    expect(code).toEqual(200);
    log = log + toJson(response) + ';';
  }


  it('should cache requests', function(){
    $browserXhr.expectGET('/url').respond('first');
    cache('GET', '/url', null, callback);
    $browserXhr.flush();

    $browserXhr.expectGET('/url').respond('ERROR');
    cache('GET', '/url', null, callback);
    $browser.defer.flush();
    expect(log).toEqual('"first";"first";');

    cache('GET', '/url', null, callback, false);
    $browser.defer.flush();
    expect(log).toEqual('"first";"first";"first";');
  });


  it('should first return cache request, then return server request', function(){
    $browserXhr.expectGET('/url').respond('first');
    cache('GET', '/url', null, callback, true);
    $browserXhr.flush();

    $browserXhr.expectGET('/url').respond('ERROR');
    cache('GET', '/url', null, callback, true);
    $browser.defer.flush();
    expect(log).toEqual('"first";"first";');

    $browserXhr.flush();
    expect(log).toEqual('"first";"first";"ERROR";');
  });


  it('should serve requests from cache', function(){
    cache.data.url = {value:'123'};
    cache('GET', 'url', null, callback);
    $browser.defer.flush();
    expect(log).toEqual('"123";');

    cache('GET', 'url', null, callback, false);
    $browser.defer.flush();
    expect(log).toEqual('"123";"123";');
  });


  it('should keep track of in flight requests and request only once', function(){
    scope.$service('$xhr.bulk').urls['/bulk'] = {
      match:function(url){
        return url == '/url';
      }
    };
    $browserXhr.expectPOST('/bulk', {
      requests:[{method:'GET',  url:'/url', data: null}]
    }).respond([
      {status:200, response:'123'}
    ]);
    cache('GET', '/url', null, callback);
    cache('GET', '/url', null, callback);
    cache.delegate.flush();
    $browserXhr.flush();
    expect(log).toEqual('"123";"123";');
  });


  it('should clear cache on non GET', function(){
    $browserXhr.expectPOST('abc', {}).respond({});
    cache.data.url = {value:123};
    cache('POST', 'abc', {});
    expect(cache.data.url).toBeUndefined();
  });


  it('should call callback asynchronously for both cache hit and cache miss', function() {
    $browserXhr.expectGET('/url').respond('+');
    cache('GET', '/url', null, callback);
    expect(log).toEqual(''); //callback hasn't executed

    $browserXhr.flush();
    expect(log).toEqual('"+";'); //callback has executed

    cache('GET', '/url', null, callback);
    expect(log).toEqual('"+";'); //callback hasn't executed

    $browser.defer.flush();
    expect(log).toEqual('"+";"+";'); //callback has executed
  });


  it('should call callback synchronously when sync flag is on', function() {
    $browserXhr.expectGET('/url').respond('+');
    cache('GET', '/url', null, callback, false, true);
    expect(log).toEqual(''); //callback hasn't executed

    $browserXhr.flush();
    expect(log).toEqual('"+";'); //callback has executed

    cache('GET', '/url', null, callback, false, true);
    expect(log).toEqual('"+";"+";'); //callback has executed

    $browser.defer.flush();
    expect(log).toEqual('"+";"+";'); //callback was not called again any more
  });


  it('should call eval after callbacks for both cache hit and cache miss execute', function() {
    var flushSpy = this.spyOn(scope, '$digest').andCallThrough();

    $browserXhr.expectGET('/url').respond('+');
    cache('GET', '/url', null, callback);
    expect(flushSpy).not.toHaveBeenCalled();

    $browserXhr.flush();
    expect(flushSpy).toHaveBeenCalled();

    flushSpy.reset(); //reset the spy

    cache('GET', '/url', null, callback);
    expect(flushSpy).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('should call the error callback on error if provided', function() {
    var errorSpy = jasmine.createSpy('error'),
        successSpy = jasmine.createSpy('success');

    $browserXhr.expectGET('/url').respond(500, 'error');

    cache('GET', '/url', null, successSpy, errorSpy, false, true);
    $browserXhr.flush();
    expect(errorSpy).toHaveBeenCalledWith(500, 'error');
    expect(successSpy).not.toHaveBeenCalled();

    errorSpy.reset();
    cache('GET', '/url', successSpy, errorSpy, false, true);
    $browserXhr.flush();
    expect(errorSpy).toHaveBeenCalledWith(500, 'error');
    expect(successSpy).not.toHaveBeenCalled();
  });

  it('should call the $xhr.error on error if error callback not provided', function() {
    var errorSpy = jasmine.createSpy('error'),
        successSpy = jasmine.createSpy('success');

    $browserXhr.expectGET('/url').respond(500, 'error');
    cache('GET', '/url', null, successSpy, false, true);
    $browserXhr.flush();

    expect(successSpy).not.toHaveBeenCalled();
    expect($xhrErr).toHaveBeenCalledWith(
      {method: 'GET', url: '/url', data: null, success: successSpy},
      {status: 500, body: 'error'});
  });
});
