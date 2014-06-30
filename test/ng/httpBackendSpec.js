/* global createHttpBackend: false, createMockXhr: false, MockXhr: false */
'use strict';

describe('$httpBackend', function() {

  var $backend, $browser, callbacks,
      xhr, fakeDocument, callback,
      fakeTimeoutId = 0;

  // TODO(vojta): should be replaced by $defer mock
  function fakeTimeout(fn, delay) {
    fakeTimeout.fns.push(fn);
    fakeTimeout.delays.push(delay);
    fakeTimeout.ids.push(++fakeTimeoutId);
    return fakeTimeoutId;
  }

  fakeTimeout.fns = [];
  fakeTimeout.delays = [];
  fakeTimeout.ids = [];
  fakeTimeout.flush = function() {
    var len = fakeTimeout.fns.length;
    fakeTimeout.delays = [];
    fakeTimeout.ids = [];
    while (len--) fakeTimeout.fns.shift()();
  };
  fakeTimeout.cancel = function(id) {
    var i = indexOf(fakeTimeout.ids, id);
    if (i >= 0) {
      fakeTimeout.fns.splice(i, 1);
      fakeTimeout.delays.splice(i, 1);
      fakeTimeout.ids.splice(i, 1);
      return true;
    }
    return false;
  };


  beforeEach(inject(function($injector) {
    callbacks = {counter: 0};
    $browser = $injector.get('$browser');
    fakeDocument = {
      $$scripts: [],
      createElement: jasmine.createSpy('createElement').andCallFake(function() {
        // msie8 depends on modifying readyState for testing. This property is readonly,
        // so it requires a fake object. For other browsers, we do need to make use of
        // event listener registration/deregistration, so these stubs are needed.
        if (msie <= 8) {
          return {
            attachEvent: noop,
            detachEvent: noop,
            addEventListener: noop,
            removeEventListener: noop
          };
        }
        // Return a proper script element...
        return document.createElement(arguments[0]);
      }),
      body: {
        appendChild: jasmine.createSpy('body.appendChild').andCallFake(function(script) {
          fakeDocument.$$scripts.push(script);
        }),
        removeChild: jasmine.createSpy('body.removeChild').andCallFake(function(script) {
          var index = indexOf(fakeDocument.$$scripts, script);
          if (index != -1) {
            fakeDocument.$$scripts.splice(index, 1);
          }
        })
      }
    };
    $backend = createHttpBackend($browser, createMockXhr, fakeTimeout, callbacks, fakeDocument);
    callback = jasmine.createSpy('done');
  }));


  it('should do basics - open async xhr and send data', function() {
    $backend('GET', '/some-url', 'some-data', noop);
    xhr = MockXhr.$$lastInstance;

    expect(xhr.$$method).toBe('GET');
    expect(xhr.$$url).toBe('/some-url');
    expect(xhr.$$data).toBe('some-data');
    expect(xhr.$$async).toBe(true);
  });

  it('should pass null to send if no body is set', function() {
    $backend('GET', '/some-url', null, noop);
    xhr = MockXhr.$$lastInstance;

    expect(xhr.$$data).toBe(null);
  });

  it('should call completion function with xhr.statusText if present', function() {
    callback.andCallFake(function(status, response, headers, statusText) {
      expect(statusText).toBe('OK');
    });

    $backend('GET', '/some-url', null, callback);
    xhr = MockXhr.$$lastInstance;
    xhr.statusText = 'OK';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();
  });

  it('should not touch xhr.statusText when request is aborted on IE9 or lower', function() {
    callback.andCallFake(function(status, response, headers, statusText) {
      expect(statusText).toBe((!msie || msie >= 10) ? 'OK' : '');
    });

    $backend('GET', '/url', null, callback, {}, 2000);
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    fakeTimeout.flush();
    expect(xhr.abort).toHaveBeenCalledOnce();

    xhr.status = 0;
    xhr.readyState = 4;
    xhr.statusText = 'OK';
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();
  });

  it('should call completion function with empty string if not present', function() {
    callback.andCallFake(function(status, response, headers, statusText) {
      expect(statusText).toBe('');
    });

    $backend('GET', '/some-url', null, callback);
    xhr = MockXhr.$$lastInstance;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();
  });


  it('should normalize IE\'s 1223 status code into 204', function() {
    callback.andCallFake(function(status) {
      expect(status).toBe(204);
    });

    $backend('GET', 'URL', null, callback);
    xhr = MockXhr.$$lastInstance;

    xhr.status = 1223;
    xhr.readyState = 4;
    xhr.onreadystatechange();

    expect(callback).toHaveBeenCalledOnce();
  });

  // onreadystatechange might by called multiple times
  // with readyState === 4 on mobile webkit caused by
  // xhrs that are resolved while the app is in the background (see #5426).
  it('should not process onreadystatechange callback with readyState == 4 more than once', function() {
    $backend('GET', 'URL', null, callback);
    xhr = MockXhr.$$lastInstance;

    xhr.status = 200;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    xhr.onreadystatechange();

    expect(callback).toHaveBeenCalledOnce();
  });

  it('should set only the requested headers', function() {
    $backend('POST', 'URL', null, noop, {'X-header1': 'value1', 'X-header2': 'value2'});
    xhr = MockXhr.$$lastInstance;

    expect(xhr.$$reqHeaders).toEqual({
      'X-header1': 'value1',
      'X-header2': 'value2'
    });
  });

  it('should set requested headers even if they have falsy values', function() {
    $backend('POST', 'URL', null, noop, {
      'X-header1': 0,
      'X-header2': '',
      'X-header3': false,
      'X-header4': undefined
    });

    xhr = MockXhr.$$lastInstance;

    expect(xhr.$$reqHeaders).toEqual({
      'X-header1': 0,
      'X-header2': '',
      'X-header3': false
    });
  });

  it('should not try to read response data when request is aborted', function() {
    callback.andCallFake(function(status, response, headers) {
      expect(status).toBe(-1);
      expect(response).toBe(null);
      expect(headers).toBe(null);
    });
    $backend('GET', '/url', null, callback, {}, 2000);
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    fakeTimeout.flush();
    expect(xhr.abort).toHaveBeenCalledOnce();

    xhr.status = 0;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();
  });

  it('should abort request on timeout', function() {
    callback.andCallFake(function(status, response) {
      expect(status).toBe(-1);
    });

    $backend('GET', '/url', null, callback, {}, 2000);
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    expect(fakeTimeout.delays[0]).toBe(2000);

    fakeTimeout.flush();
    expect(xhr.abort).toHaveBeenCalledOnce();

    xhr.status = 0;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();
  });


  it('should abort request on timeout promise resolution', inject(function($timeout) {
    callback.andCallFake(function(status, response) {
      expect(status).toBe(-1);
    });

    $backend('GET', '/url', null, callback, {}, $timeout(noop, 2000));
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    $timeout.flush();
    expect(xhr.abort).toHaveBeenCalledOnce();

    xhr.status = 0;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();
  }));


  it('should not abort resolved request on timeout promise resolution', inject(function($timeout) {
    callback.andCallFake(function(status, response) {
      expect(status).toBe(200);
    });

    $backend('GET', '/url', null, callback, {}, $timeout(noop, 2000));
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    xhr.status = 200;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();

    $timeout.flush();
    expect(xhr.abort).not.toHaveBeenCalled();
  }));


  it('should cancel timeout on completion', function() {
    callback.andCallFake(function(status, response) {
      expect(status).toBe(200);
    });

    $backend('GET', '/url', null, callback, {}, 2000);
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    expect(fakeTimeout.delays[0]).toBe(2000);

    xhr.status = 200;
    xhr.readyState = 4;
    xhr.onreadystatechange();
    expect(callback).toHaveBeenCalledOnce();

    expect(fakeTimeout.delays.length).toBe(0);
    expect(xhr.abort).not.toHaveBeenCalled();
  });


  it('should register onreadystatechange callback before sending', function() {
    // send() in IE6, IE7 is sync when serving from cache
    function SyncXhr() {
      xhr = this;
      this.open = this.setRequestHeader = noop;

      this.send = function() {
        this.status = 200;
        this.responseText = 'response';
        this.readyState = 4;
        this.onreadystatechange();
      };

      this.getAllResponseHeaders = valueFn('');
    }

    callback.andCallFake(function(status, response) {
      expect(status).toBe(200);
      expect(response).toBe('response');
    });

    $backend = createHttpBackend($browser, function() { return new SyncXhr(); });
    $backend('GET', '/url', null, callback);
    expect(callback).toHaveBeenCalledOnce();
  });


  it('should set withCredentials', function() {
    $backend('GET', '/some.url', null, callback, {}, null, true);
    expect(MockXhr.$$lastInstance.withCredentials).toBe(true);
  });


  describe('responseType', function() {

    it('should set responseType and return xhr.response', function() {
      $backend('GET', '/whatever', null, callback, {}, null, null, 'blob');

      var xhrInstance = MockXhr.$$lastInstance;
      expect(xhrInstance.responseType).toBe('blob');

      callback.andCallFake(function(status, response) {
        expect(response).toBe(xhrInstance.response);
      });

      xhrInstance.response = {some: 'object'};
      xhrInstance.readyState = 4;
      xhrInstance.onreadystatechange();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should read responseText if response was not defined', function() {
      //  old browsers like IE8, don't support responseType, so they always respond with responseText

      $backend('GET', '/whatever', null, callback, {}, null, null, 'blob');

      var xhrInstance = MockXhr.$$lastInstance;
      var responseText = '{"some": "object"}';
      expect(xhrInstance.responseType).toBe('blob');

      callback.andCallFake(function(status, response) {
        expect(response).toBe(responseText);
      });

      xhrInstance.responseText = responseText;
      xhrInstance.readyState = 4;
      xhrInstance.onreadystatechange();

      expect(callback).toHaveBeenCalledOnce();
    });
  });


  describe('JSONP', function() {

    var SCRIPT_URL = /([^\?]*)\?cb=angular\.callbacks\.(.*)/;


    it('should add script tag for JSONP request', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('some-data');
      });

      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
      expect(fakeDocument.$$scripts.length).toBe(1);

      var script = fakeDocument.$$scripts.shift(),
          url = script.src.match(SCRIPT_URL);

      expect(url[1]).toBe('http://example.org/path');
      callbacks[url[2]]('some-data');

      if (script.onreadystatechange) {
        script.readyState = 'complete';
        script.onreadystatechange();
      } else {
        browserTrigger(script, "load");
      }

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should clean up the callback and remove the script', function() {
      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
      expect(fakeDocument.$$scripts.length).toBe(1);


      var script = fakeDocument.$$scripts.shift(),
          callbackId = script.src.match(SCRIPT_URL)[2];

      callbacks[callbackId]('some-data');
      if (script.onreadystatechange) {
        script.readyState = 'complete';
        script.onreadystatechange();
      } else {
        browserTrigger(script, "load");
      }

      expect(callbacks[callbackId]).toBe(angular.noop);
      expect(fakeDocument.body.removeChild).toHaveBeenCalledOnceWith(script);
    });


    if (msie <= 8) {

      it('should attach onreadystatechange handler to the script object', function() {
        $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, noop);

        expect(fakeDocument.$$scripts[0].onreadystatechange).toEqual(jasmine.any(Function));

        var script = fakeDocument.$$scripts[0];

        script.readyState = 'complete';
        script.onreadystatechange();

        expect(script.onreadystatechange).toBe(null);
      });


    }


    it('should set url to current location if not specified or empty string', function() {
      $backend('JSONP', undefined, null, callback);
      expect(fakeDocument.$$scripts[0].src).toBe($browser.url());
      fakeDocument.$$scripts.shift();

      $backend('JSONP', '', null, callback);
      expect(fakeDocument.$$scripts[0].src).toBe($browser.url());
    });


    it('should abort request on timeout and replace callback with noop', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(-1);
      });

      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback, null, 2000);
      expect(fakeDocument.$$scripts.length).toBe(1);
      expect(fakeTimeout.delays[0]).toBe(2000);

      var script = fakeDocument.$$scripts.shift(),
        callbackId = script.src.match(SCRIPT_URL)[2];

      fakeTimeout.flush();
      expect(fakeDocument.$$scripts.length).toBe(0);
      expect(callback).toHaveBeenCalledOnce();

      expect(callbacks[callbackId]).toBe(angular.noop);
    });


    // TODO(vojta): test whether it fires "async-start"
    // TODO(vojta): test whether it fires "async-end" on both success and error
  });

  describe('protocols that return 0 status code', function() {

    function respond(status, content) {
      xhr = MockXhr.$$lastInstance;
      xhr.status = status;
      xhr.responseText = content;
      xhr.readyState = 4;
      xhr.onreadystatechange();
    }


    it('should convert 0 to 200 if content and file protocol', function() {
      $backend = createHttpBackend($browser, createMockXhr);

      $backend('GET', 'file:///whatever/index.html', null, callback);
      respond(0, 'SOME CONTENT');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(200);
    });

    it('should convert 0 to 200 if content for protocols other than file', function() {
      $backend = createHttpBackend($browser, createMockXhr);

      $backend('GET', 'someProtocol:///whatever/index.html', null, callback);
      respond(0, 'SOME CONTENT');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(200);
    });

    it('should convert 0 to 404 if no content and file protocol', function() {
      $backend = createHttpBackend($browser, createMockXhr);

      $backend('GET', 'file:///whatever/index.html', null, callback);
      respond(0, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(404);
    });

    it('should not convert 0 to 404 if no content for protocols other than file', function() {
      $backend = createHttpBackend($browser, createMockXhr);

      $backend('GET', 'someProtocol:///whatever/index.html', null, callback);
      respond(0, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(0);
    });

    it('should convert 0 to 404 if no content - relative url', function() {
      /* global urlParsingNode: true */
      var originalUrlParsingNode = urlParsingNode;

      //temporarily overriding the DOM element to pretend that the test runs origin with file:// protocol
      urlParsingNode = {
        hash : "#/C:/",
        host : "",
        hostname : "",
        href : "file:///C:/base#!/C:/foo",
        pathname : "/C:/foo",
        port : "",
        protocol : "file:",
        search : "",
        setAttribute: angular.noop
      };

      try {

        $backend = createHttpBackend($browser, createMockXhr);

        $backend('GET', '/whatever/index.html', null, callback);
        respond(0, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.mostRecentCall.args[0]).toBe(404);

      } finally {
        urlParsingNode = originalUrlParsingNode;
      }
    });


    it('should return original backend status code if different from 0', function () {
      $backend = createHttpBackend($browser, createMockXhr);

      // request to http://
      $backend('POST', 'http://rest_api/create_whatever', null, callback);
      respond(201, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(201);


      // request to file://
      $backend('POST', 'file://rest_api/create_whatever', null, callback);
      respond(201, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(201);

      // request to file:// with HTTP status >= 300
      $backend('POST', 'file://rest_api/create_whatever', null, callback);
      respond(503, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(503);
    });
  });
});

