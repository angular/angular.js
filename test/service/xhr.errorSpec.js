'use strict';

describe('$xhr.error', function() {
  var log;

  beforeEach(inject(function($provide) {
    $provide.value('$xhr.error', jasmine.createSpy('$xhr.error'));
    $provide.factory('$xhrError', ['$xhr.error', identity]);
    log = '';
  }));


  function callback(code, response) {
    expect(code).toEqual(200);
    log = log + toJson(response) + ';';
  }


  it('should handle non 200 status codes by forwarding to error handler', inject(function($browser, $xhr, $xhrError) {
    $browser.xhr.expectPOST('/req', 'MyData').respond(500, 'MyError');
    $xhr('POST', '/req', 'MyData', callback);
    $browser.xhr.flush();
    var cb = $xhrError.mostRecentCall.args[0].success;
    expect(typeof cb).toEqual('function');
    expect($xhrError).toHaveBeenCalledWith(
        {url: '/req', method: 'POST', data: 'MyData', success: cb},
        {status: 500, body: 'MyError'});
  }));
});
