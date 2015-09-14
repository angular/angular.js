/* global createHttpBackend: false, createMockXhr: false, MockXhr: false */
'use strict';

describe('$httpBackend', function() {

  var $backend, $browser, callbacks,
      xhr, fakeDocument, callback;


  beforeEach(inject(function($injector) {
    callbacks = {counter: 0};
    $browser = $injector.get('$browser');
    fakeDocument = {
      $$scripts: [],
      createElement: jasmine.createSpy('createElement').andCallFake(function() {
        // Return a proper script element...
        return document.createElement(arguments[0]);
      }),
      body: {
        appendChild: jasmine.createSpy('body.appendChild').andCallFake(function(script) {
          fakeDocument.$$scripts.push(script);
        }),
        removeChild: jasmine.createSpy('body.removeChild').andCallFake(function(script) {
          var index = fakeDocument.$$scripts.indexOf(script);
          if (index != -1) {
            fakeDocument.$$scripts.splice(index, 1);
          }
        })
      }
    };
    $backend = createHttpBackend($browser, createMockXhr, $browser.defer, callbacks, fakeDocument);
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
    $backend('GET', '/some-url', undefined, noop);
    xhr = MockXhr.$$lastInstance;

    expect(xhr.$$data).toBe(null);
  });

  it('should pass the correct falsy value to send if falsy body is set (excluding undefined, NaN)',
    function() {
      var values = [false, 0, "", null];
      angular.forEach(values, function(value) {
        $backend('GET', '/some-url', value, noop);
        xhr = MockXhr.$$lastInstance;

        expect(xhr.$$data).toBe(value);
      });
    }
  );

  it('should pass NaN to send if NaN body is set', function() {
    $backend('GET', '/some-url', NaN, noop);
    xhr = MockXhr.$$lastInstance;

    expect(isNaN(xhr.$$data)).toEqual(true);
  });

  it('should call completion function with xhr.statusText if present', function() {
    callback.andCallFake(function(status, response, headers, statusText) {
      expect(statusText).toBe('OK');
    });

    $backend('GET', '/some-url', null, callback);
    xhr = MockXhr.$$lastInstance;
    xhr.statusText = 'OK';
    xhr.onload();
    expect(callback).toHaveBeenCalledOnce();
  });

  it('should call completion function with empty string if not present', function() {
    callback.andCallFake(function(status, response, headers, statusText) {
      expect(statusText).toBe('');
    });

    $backend('GET', '/some-url', null, callback);
    xhr = MockXhr.$$lastInstance;
    xhr.onload();
    expect(callback).toHaveBeenCalledOnce();
  });


  it('should normalize IE\'s 1223 status code into 204', function() {
    callback.andCallFake(function(status) {
      expect(status).toBe(204);
    });

    $backend('GET', 'URL', null, callback);
    xhr = MockXhr.$$lastInstance;

    xhr.status = 1223;
    xhr.onload();

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

    $browser.defer.flush();
    expect(xhr.abort).toHaveBeenCalledOnce();

    xhr.status = 0;
    xhr.onabort();
    expect(callback).toHaveBeenCalledOnce();
  });

  it('should abort request on timeout', function() {
    callback.andCallFake(function(status, response) {
      expect(status).toBe(-1);
    });

    $backend('GET', '/url', null, callback, {}, 2000);
    xhr = MockXhr.$$lastInstance;
    spyOn(xhr, 'abort');

    expect($browser.deferredFns[0].time).toBe(2000);

    $browser.defer.flush();
    expect(xhr.abort).toHaveBeenCalledOnce();

    xhr.status = 0;
    xhr.onabort();
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
    xhr.onabort();
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
    xhr.onload();
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

    expect($browser.deferredFns[0].time).toBe(2000);

    xhr.status = 200;
    xhr.onload();
    expect(callback).toHaveBeenCalledOnce();

    expect($browser.deferredFns.length).toBe(0);
    expect(xhr.abort).not.toHaveBeenCalled();
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
      xhrInstance.onload();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should read responseText if response was not defined', function() {
      //  old browsers like IE9, don't support responseType, so they always respond with responseText

      $backend('GET', '/whatever', null, callback, {}, null, null, 'blob');

      var xhrInstance = MockXhr.$$lastInstance;
      var responseText = '{"some": "object"}';
      expect(xhrInstance.responseType).toBe('blob');

      callback.andCallFake(function(status, response) {
        expect(response).toBe(responseText);
      });

      xhrInstance.responseText = responseText;
      xhrInstance.onload();

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
      browserTrigger(script, "load");

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should clean up the callback and remove the script', function() {
      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
      expect(fakeDocument.$$scripts.length).toBe(1);


      var script = fakeDocument.$$scripts.shift(),
          callbackId = script.src.match(SCRIPT_URL)[2];

      callbacks[callbackId]('some-data');
      browserTrigger(script, "load");

      expect(callbacks[callbackId]).toBe(angular.noop);
      expect(fakeDocument.body.removeChild).toHaveBeenCalledOnceWith(script);
    });


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
      expect($browser.deferredFns[0].time).toBe(2000);

      var script = fakeDocument.$$scripts.shift(),
        callbackId = script.src.match(SCRIPT_URL)[2];

      $browser.defer.flush();
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
      xhr.onload();
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
        hash: "#/C:/",
        host: "",
        hostname: "",
        href: "file:///C:/base#!/C:/foo",
        pathname: "/C:/foo",
        port: "",
        protocol: "file:",
        search: "",
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


    it('should return original backend status code if different from 0', function() {
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

