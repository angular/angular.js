'use strict';

describe('$xhr.bulk', function() {
  var log;

  beforeEach(inject(function($provide) {
    $provide.value('$xhr.error', jasmine.createSpy('$xhr.error'));
    $provide.factory('$xhrError', ['$xhr.error', identity]);
    $provide.factory('$xhrBulk', ['$xhr.bulk', identity]);
    log = '';
  }));


  function callback(code, response) {
    expect(code).toEqual(200);
    log = log + toJson(response) + ';';
  }


  it('should collect requests', inject(function($browser, $xhrBulk) {
    $xhrBulk.urls["/"] = {match:/.*/};
    $xhrBulk('GET', '/req1', null, callback);
    $xhrBulk('POST', '/req2', {post:'data'}, callback);

    $browser.xhr.expectPOST('/', {
      requests:[{method:'GET',  url:'/req1', data: null},
                {method:'POST', url:'/req2', data:{post:'data'} }]
    }).respond([
      {status:200, response:'first'},
      {status:200, response:'second'}
    ]);
    $xhrBulk.flush(function() { log += 'DONE';});
    $browser.xhr.flush();
    expect(log).toEqual('"first";"second";DONE');
  }));


  it('should handle non 200 status code by forwarding to error handler',
      inject(function($browser, $xhrBulk, $xhrError) {
    $xhrBulk.urls['/'] = {match:/.*/};
    $xhrBulk('GET', '/req1', null, callback);
    $xhrBulk('POST', '/req2', {post:'data'}, callback);

    $browser.xhr.expectPOST('/', {
      requests:[{method:'GET',  url:'/req1', data: null},
                {method:'POST', url:'/req2', data:{post:'data'} }]
    }).respond([
      {status:404, response:'NotFound'},
      {status:200, response:'second'}
    ]);
    $xhrBulk.flush(function() { log += 'DONE';});
    $browser.xhr.flush();

    expect($xhrError).toHaveBeenCalled();
    var cb = $xhrError.mostRecentCall.args[0].success;
    expect(typeof cb).toEqual('function');
    expect($xhrError).toHaveBeenCalledWith(
        {url: '/req1', method: 'GET', data: null, success: cb},
        {status: 404, response: 'NotFound'});

    expect(log).toEqual('"second";DONE');
  }));

  it('should handle non 200 status code by calling error callback if provided',
      inject(function($browser, $xhrBulk, $xhrError) {
    var callback = jasmine.createSpy('error');

    $xhrBulk.urls['/'] = {match: /.*/};
    $xhrBulk('GET', '/req1', null, noop, callback);

    $browser.xhr.expectPOST('/', {
      requests:[{method: 'GET',  url: '/req1', data: null}]
    }).respond([{status: 404, response: 'NotFound'}]);

    $xhrBulk.flush();
    $browser.xhr.flush();

    expect($xhrError).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(404, 'NotFound');
  }));
});
