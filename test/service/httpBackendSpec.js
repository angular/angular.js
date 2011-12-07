describe('$httpBackend', function() {

  var $backend, $browser, callbacks,
      xhr, fakeBody, callback;

  // TODO(vojta): should be replaced by $defer mock
  function fakeTimeout(fn, delay) {
    fakeTimeout.fns.push(fn);
    fakeTimeout.delays.push(delay);
  }

  fakeTimeout.fns = [];
  fakeTimeout.delays = [];
  fakeTimeout.flush = function() {
    var len = fakeTimeout.fns.length;
    fakeTimeout.delays = [];
    while (len--) fakeTimeout.fns.shift()();
  };


  beforeEach(inject(function($injector) {
    callbacks = {};
    $browser = $injector.get('$browser');
    fakeBody = {removeChild: jasmine.createSpy('body.removeChild')};
    $backend = createHttpBackend($browser, MockXhr, fakeTimeout, callbacks, fakeBody);
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


  it('should set only the requested headers', function() {
    $backend('POST', 'URL', null, noop, {'X-header1': 'value1', 'X-header2': 'value2'});
    xhr = MockXhr.$$lastInstance;

    expect(xhr.$$headers).toEqual({
      'X-header1': 'value1',
      'X-header2': 'value2'
    });
  });


  it('should return raw xhr object', function() {
    expect($backend('GET', '/url', null, noop)).toBe(MockXhr.$$lastInstance);
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


  it('should be async even if xhr.send() is sync', function() {
    // IE6, IE7 is sync when serving from cache
    function SyncXhr() {
      xhr = this;
      this.open = this.setRequestHeader = noop;
      this.send = function() {
        this.status = 200;
        this.responseText = 'response';
        this.readyState = 4;
      };
    }

    callback.andCallFake(function(status, response) {
      expect(status).toBe(200);
      expect(response).toBe('response');
    });

    $backend = createHttpBackend($browser, SyncXhr, fakeTimeout);
    $backend('GET', '/url', null, callback);
    expect(callback).not.toHaveBeenCalled();

    fakeTimeout.flush();
    expect(callback).toHaveBeenCalledOnce();

    (xhr.onreadystatechange || noop)();
    expect(callback).toHaveBeenCalledOnce();
  });


  describe('JSONP', function() {

    it('should add script tag for JSONP request', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('some-data');
      });

      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
      expect($browser.$$scripts.length).toBe(1);

      var script = $browser.$$scripts.shift(),
          url = script.url.split('?cb=');

      expect(url[0]).toBe('http://example.org/path');
      callbacks[url[1]]('some-data');
      script.done();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should clean up the callback and remove the script', function() {
      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
      expect($browser.$$scripts.length).toBe(1);

      var script = $browser.$$scripts.shift(),
          callbackId = script.url.split('?cb=')[1];

      callbacks[callbackId]('some-data');
      script.done();

      expect(callbacks[callbackId]).toBeUndefined();
      expect(fakeBody.removeChild).toHaveBeenCalledOnce();
      expect(fakeBody.removeChild).toHaveBeenCalledWith(script);
    });


    it('should call callback with status -2 when script fails to load', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(-2);
        expect(response).toBeUndefined();
      });

      $backend('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
      expect($browser.$$scripts.length).toBe(1);

      $browser.$$scripts.shift().done();
      expect(callback).toHaveBeenCalledOnce();
    });


    // TODO(vojta): test whether it fires "async-start"
    // TODO(vojta): test whether it fires "async-end" on both success and error
  });

  describe('file protocol', function() {

    function respond(status, content) {
      xhr = MockXhr.$$lastInstance;
      xhr.status = status;
      xhr.responseText = content;
      xhr.readyState = 4;
      xhr.onreadystatechange();
    }


    it('should convert 0 to 200 if content', function() {
      $backend = createHttpBackend($browser, MockXhr, null, null, null, 'http');

      $backend('GET', 'file:///whatever/index.html', null, callback);
      respond(0, 'SOME CONTENT');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(200);
    });


    it('should convert 0 to 200 if content - relative url', function() {
      $backend = createHttpBackend($browser, MockXhr, null, null, null, 'file');

      $backend('GET', '/whatever/index.html', null, callback);
      respond(0, 'SOME CONTENT');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(200);
    });


    it('should convert 0 to 404 if no content', function() {
      $backend = createHttpBackend($browser, MockXhr, null, null, null, 'http');

      $backend('GET', 'file:///whatever/index.html', null, callback);
      respond(0, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(404);
    });


    it('should convert 0 to 200 if content - relative url', function() {
      $backend = createHttpBackend($browser, MockXhr, null, null, null, 'file');

      $backend('GET', '/whatever/index.html', null, callback);
      respond(0, '');

      expect(callback).toHaveBeenCalled();
      expect(callback.mostRecentCall.args[0]).toBe(404);
    });
  });
});

