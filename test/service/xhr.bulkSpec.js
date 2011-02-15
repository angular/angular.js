describe('$xhr.bulk', function() {
  var scope, $browser, $browserXhr, $log, $xhrBulk, $xhrError, log;

  beforeEach(function(){
    scope = angular.scope({}, angular.service, {
      '$xhr.error': $xhrError = jasmine.createSpy('$xhr.error'),
      '$log': $log = {}
    });
    $browser = scope.$service('$browser');
    $browserXhr = $browser.xhr;
    $xhrBulk = scope.$service('$xhr.bulk');
    log = '';
  });


  afterEach(function(){
    dealoc(scope);
  });


  function callback(code, response) {
    expect(code).toEqual(200);
    log = log + toJson(response) + ';';
  }


  it('should collect requests', function(){
    $xhrBulk.urls["/"] = {match:/.*/};
    $xhrBulk('GET', '/req1', null, callback);
    $xhrBulk('POST', '/req2', {post:'data'}, callback);

    $browserXhr.expectPOST('/', {
      requests:[{method:'GET',  url:'/req1', data: null},
                {method:'POST', url:'/req2', data:{post:'data'} }]
    }).respond([
      {status:200, response:'first'},
      {status:200, response:'second'}
    ]);
    $xhrBulk.flush(function(){ log += 'DONE';});
    $browserXhr.flush();
    expect(log).toEqual('"first";"second";DONE');
  });


  it('should handle non 200 status code by forwarding to error handler', function(){
    $xhrBulk.urls['/'] = {match:/.*/};
    $xhrBulk('GET', '/req1', null, callback);
    $xhrBulk('POST', '/req2', {post:'data'}, callback);

    $browserXhr.expectPOST('/', {
      requests:[{method:'GET',  url:'/req1', data: null},
                {method:'POST', url:'/req2', data:{post:'data'} }]
    }).respond([
      {status:404, response:'NotFound'},
      {status:200, response:'second'}
    ]);
    $xhrBulk.flush(function(){ log += 'DONE';});
    $browserXhr.flush();

    expect($xhrError).wasCalled();
    var cb = $xhrError.mostRecentCall.args[0].callback;
    expect(typeof cb).toEqual($function);
    expect($xhrError).wasCalledWith(
        {url:'/req1', method:'GET', data:null, callback:cb},
        {status:404, response:'NotFound'});

    expect(log).toEqual('"second";DONE');
  });
});
