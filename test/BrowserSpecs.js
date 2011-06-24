describe('browser', function(){

  var browser, fakeWindow, xhr, logs, scripts, removedScripts, setTimeoutQueue;

  function fakeSetTimeout(fn) {
    setTimeoutQueue.push(fn);
    return Math.random();
  }

  fakeSetTimeout.flush = function() {
    var currentTimeoutQueue = setTimeoutQueue;
    setTimeoutQueue = [];
    forEach(currentTimeoutQueue, function(fn) {
      fn();
    });
  };


  beforeEach(function(){
    setTimeoutQueue = [];
    scripts = [];
    removedScripts = [];
    xhr = null;
    fakeWindow = {
      location: {href:"http://server"},
      setTimeout: fakeSetTimeout
    };

    var fakeBody = [{appendChild: function(node){scripts.push(node);},
                     removeChild: function(node){removedScripts.push(node);}}];

    var FakeXhr = function(){
      xhr = this;
      this.open = function(method, url, async){
        xhr.method = method;
        xhr.url = url;
        xhr.async = async;
        xhr.headers = {};
      };
      this.setRequestHeader = function(key, value){
        xhr.headers[key] = value;
      };
      this.send = function(post){
        xhr.post = post;
      };
    };

    logs = {log:[], warn:[], info:[], error:[]};

    var fakeLog = {log: function() { logs.log.push(slice.call(arguments)); },
                   warn: function() { logs.warn.push(slice.call(arguments)); },
                   info: function() { logs.info.push(slice.call(arguments)); },
                   error: function() { logs.error.push(slice.call(arguments)); }};

    browser = new Browser(fakeWindow, jqLite(window.document), fakeBody, FakeXhr,
                          fakeLog);
  });

  it('should contain cookie cruncher', function() {
    expect(browser.cookies).toBeDefined();
  });

  describe('outstading requests', function(){
    it('should process callbacks immedietly with no outstanding requests', function(){
      var callback = jasmine.createSpy('callback');
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should queue callbacks with outstanding requests', function(){
      var callback = jasmine.createSpy('callback');
      browser.xhr('GET', '/url', null, noop);
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).not.toHaveBeenCalled();

      xhr.readyState = 4;
      xhr.onreadystatechange();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('xhr', function(){
    describe('JSON', function(){
      it('should add script tag for request', function() {
        var callback = jasmine.createSpy('callback');
        var log = "";
        browser.xhr('JSON', 'http://example.org/path?cb=JSON_CALLBACK', null, function(code, data){
          log += code + ':' + data + ';';
        });
        browser.notifyWhenNoOutstandingRequests(callback);
        expect(callback).not.toHaveBeenCalled();
        expect(scripts.length).toEqual(1);
        var script = scripts[0];
        var url = script.src.split('?cb=');
        expect(url[0]).toEqual('http://example.org/path');
        expect(typeof fakeWindow[url[1]]).toEqual($function);
        fakeWindow[url[1]]('data');
        expect(callback).toHaveBeenCalled();
        expect(log).toEqual('200:data;');
        expect(scripts).toEqual(removedScripts);
        expect(fakeWindow[url[1]]).toBeUndefined();
      });
    });

    it('should normalize IE\'s 1223 status code into 204', function() {
      var callback = jasmine.createSpy('XHR');

      browser.xhr('GET', 'URL', 'POST', callback);

      xhr.status = 1223;
      xhr.readyState = 4;
      xhr.onreadystatechange();

      expect(callback).toHaveBeenCalled();
      expect(callback.argsForCall[0][0]).toEqual(204);
    });

    it('should set only the requested headers', function() {
      var code, response, headers = {};
      browser.xhr('POST', 'URL', null, function(c,r){
        code = c;
        response = r;
      }, {'X-header1': 'value1', 'X-header2': 'value2'});

      expect(xhr.method).toEqual('POST');
      expect(xhr.url).toEqual('URL');
      expect(xhr.post).toEqual('');
      expect(xhr.headers).toEqual({
        "X-header1":"value1",
        "X-header2":"value2"
      });

      xhr.status = 202;
      xhr.responseText = 'RESPONSE';
      xhr.readyState = 4;
      xhr.onreadystatechange();

      expect(code).toEqual(202);
      expect(response).toEqual('RESPONSE');
    });
  });

  describe('defer', function() {
    it('should execute fn asynchroniously via setTimeout', function() {
      var counter = 0;
      browser.defer(function() {counter++;});
      expect(counter).toBe(0);

      fakeSetTimeout.flush();
      expect(counter).toBe(1);
    });


    it('should update outstandingRequests counter', function() {
      var callback = jasmine.createSpy('callback');
      browser.defer(callback);
      expect(callback).not.toHaveBeenCalled();

      fakeSetTimeout.flush();
      expect(callback).toHaveBeenCalled();
    });
  });


  describe('cookies', function() {

    function deleteAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }

    beforeEach(function() {
      deleteAllCookies();
      expect(document.cookie).toEqual('');
    });


    afterEach(function() {
      deleteAllCookies();
      expect(document.cookie).toEqual('');
    });


    describe('remove all via (null)', function() {

      it('should do nothing when no cookies are set', function() {
        browser.cookies(null);
        expect(document.cookie).toEqual('');
        expect(browser.cookies()).toEqual({});
      });

    });

    describe('remove via cookies(cookieName, undefined)', function() {

      it('should remove a cookie when it is present', function() {
        document.cookie = 'foo=bar';

        browser.cookies('foo', undefined);

        expect(document.cookie).toEqual('');
        expect(browser.cookies()).toEqual({});
      });


      it('should do nothing when an nonexisting cookie is being removed', function() {
        browser.cookies('doesntexist', undefined);
        expect(document.cookie).toEqual('');
        expect(browser.cookies()).toEqual({});
      });
    });


    describe('put via cookies(cookieName, string)', function() {

      it('should create and store a cookie', function() {
        browser.cookies('cookieName', 'cookie=Value');
        expect(document.cookie).toMatch(/cookieName=cookie%3DValue;? ?/);
        expect(browser.cookies()).toEqual({'cookieName':'cookie=Value'});
      });


      it('should overwrite an existing unsynced cookie', function() {
        document.cookie = "cookie=new";

        var oldVal = browser.cookies('cookie', 'newer');

        expect(document.cookie).toEqual('cookie=newer');
        expect(browser.cookies()).toEqual({'cookie':'newer'});
        expect(oldVal).not.toBeDefined();
      });

      it('should escape both name and value', function() {
        browser.cookies('cookie1=', 'val;ue');
        browser.cookies('cookie2=bar;baz', 'val=ue');

        var rawCookies = document.cookie.split("; "); //order is not guaranteed, so we need to parse
        expect(rawCookies.length).toEqual(2);
        expect(rawCookies).toContain('cookie1%3D=val%3Bue');
        expect(rawCookies).toContain('cookie2%3Dbar%3Bbaz=val%3Due');
      });

      it('should log warnings when 4kb per cookie storage limit is reached', function() {
        var i, longVal = '', cookieStr;

        for(i=0; i<4092; i++) {
          longVal += '+';
        }

        cookieStr = document.cookie;
        browser.cookies('x', longVal); //total size 4094-4096, so it should go through
        expect(document.cookie).not.toEqual(cookieStr);
        expect(browser.cookies()['x']).toEqual(longVal);
        expect(logs.warn).toEqual([]);

        browser.cookies('x', longVal + 'xxx'); //total size 4097-4099, a warning should be logged
        expect(logs.warn).toEqual(
          [[ "Cookie 'x' possibly not set or overflowed because it was too large (4097 > 4096 " +
             "bytes)!" ]]);

        //force browser to dropped a cookie and make sure that the cache is not out of sync
        browser.cookies('x', 'shortVal');
        expect(browser.cookies().x).toEqual('shortVal'); //needed to prime the cache
        cookieStr = document.cookie;
        browser.cookies('x', longVal + longVal + longVal); //should be too long for all browsers

        if (document.cookie !== cookieStr) {
          fail("browser didn't drop long cookie when it was expected. make the cookie in this " +
              "test longer");
        }

        expect(browser.cookies().x).toEqual('shortVal');
      });

      it('should log warnings when 20 cookies per domain storage limit is reached', function() {
        var i, str, cookieStr;

        for (i=0; i<20; i++) {
          str = '' + i;
          browser.cookies(str, str);
        }

        i=0;
        for (str in browser.cookies()) {
          i++;
        }
        expect(i).toEqual(20);
        expect(logs.warn).toEqual([]);
        cookieStr = document.cookie;

        browser.cookies('one', 'more');
        expect(logs.warn).toEqual([]);

        //if browser dropped a cookie (very likely), make sure that the cache is not out of sync
        if (document.cookie === cookieStr) {
          expect(size(browser.cookies())).toEqual(20);
        } else {
          expect(size(browser.cookies())).toEqual(21);
        }
      });
    });


    describe('get via cookies()[cookieName]', function() {

      it('should return undefined for nonexistent cookie', function() {
        expect(browser.cookies().nonexistent).not.toBeDefined();
      });


      it ('should return a value for an existing cookie', function() {
        document.cookie = "foo=bar=baz";
        expect(browser.cookies().foo).toEqual('bar=baz');
      });


      it ('should unescape cookie values that were escaped by puts', function() {
        document.cookie = "cookie2%3Dbar%3Bbaz=val%3Due";
        expect(browser.cookies()['cookie2=bar;baz']).toEqual('val=ue');
      });


      it('should preserve leading & trailing spaces in names and values', function() {
        browser.cookies(' cookie name ', ' cookie value ');
        expect(browser.cookies()[' cookie name ']).toEqual(' cookie value ');
        expect(browser.cookies()['cookie name']).not.toBeDefined();
      });
    });


    describe('getAll via cookies()', function() {

      it('should return cookies as hash', function() {
        document.cookie = "foo1=bar1";
        document.cookie = "foo2=bar2";
        expect(browser.cookies()).toEqual({'foo1':'bar1', 'foo2':'bar2'});
      });


      it('should return empty hash if no cookies exist', function() {
        expect(browser.cookies()).toEqual({});
      });
    });


    it('should pick up external changes made to browser cookies', function() {
      browser.cookies('oatmealCookie', 'drool');
      expect(browser.cookies()).toEqual({'oatmealCookie':'drool'});

      document.cookie = 'oatmealCookie=changed';
      expect(browser.cookies().oatmealCookie).toEqual('changed');
    });


    it('should initialize cookie cache with existing cookies', function() {
      document.cookie = "existingCookie=existingValue";
      expect(browser.cookies()).toEqual({'existingCookie':'existingValue'});
    });

  });

  describe('poller', function(){

    it('should call functions in pollFns in regular intervals', function(){
      var log = '';
      browser.addPollFn(function(){log+='a';});
      browser.addPollFn(function(){log+='b';});
      expect(log).toEqual('');
      fakeSetTimeout.flush();
      expect(log).toEqual('ab');
      fakeSetTimeout.flush();
      expect(log).toEqual('abab');
    });

    it('should startPoller', function(){
      expect(setTimeoutQueue.length).toEqual(0);

      browser.addPollFn(function(){});
      expect(setTimeoutQueue.length).toEqual(1);

      //should remain 1 as it is the check fn
      browser.addPollFn(function(){});
      expect(setTimeoutQueue.length).toEqual(1);
    });

    it('should return fn that was passed into addPollFn', function() {
      var fn = function() { return 1; };
      var returnedFn = browser.addPollFn(fn);
      expect(returnedFn).toBe(fn);
    });
  });


  describe('url api', function() {
    it('should use $browser poller to detect url changes when onhashchange event is unsupported',
        function() {

      fakeWindow = {
        location: {href:"http://server"},
        document: {},
        setTimeout: fakeSetTimeout
      };

      browser = new Browser(fakeWindow, {}, {});
      browser.startPoller = function() {};

      var events = [];

      browser.onHashChange(function() {
        events.push('x');
      });

      fakeWindow.location.href = "http://server/#newHash";
      expect(events).toEqual([]);
      fakeSetTimeout.flush();
      expect(events).toEqual(['x']);

      //don't do anything if url hasn't changed
      events = [];
      fakeSetTimeout.flush();
      expect(events).toEqual([]);
    });


    it('should use onhashchange events to detect url changes when supported by browser',
        function() {

      var onHashChngListener;

      fakeWindow = {location: {href:"http://server"},
                    addEventListener: function(type, listener) {
                      expect(type).toEqual('hashchange');
                      onHashChngListener = listener;
                    },
                    attachEvent: function(type, listener) {
                      expect(type).toEqual('onhashchange');
                      onHashChngListener = listener;
                    },
                    removeEventListener: angular.noop,
                    detachEvent: angular.noop,
                    document: {}
                   };
      fakeWindow.onhashchange = true;

      browser = new Browser(fakeWindow, {}, {});

      var events = [],
          event = {type: "hashchange"};

      browser.onHashChange(function(e) {
        events.push(e);
      });

      expect(events).toEqual([]);
      onHashChngListener(event);

      expect(events.length).toBe(1);
      expect(events[0].originalEvent || events[0]).toBe(event); // please jQuery and jqLite

      // clean up the jqLite cache so that the global afterEach doesn't complain
      if (!jQuery) {
        jqLite(fakeWindow).dealoc();
      }
    });

    // asynchronous test
    it('should fire onHashChange when location.hash change', function() {
      var callback = jasmine.createSpy('onHashChange');
      browser = new Browser(window, {}, {});
      browser.onHashChange(callback);

      window.location.hash = 'new-hash';
      browser.addPollFn(function() {});

      waitsFor(function() {
        return callback.callCount;
      }, 'onHashChange callback to be called', 1000);

      runs(function() {
        if (!jQuery) jqLite(window).dealoc();
        window.location.hash = '';
      });
    });
  });

  describe('addJs', function() {

    it('should append a script tag to body', function() {
      browser.addJs('http://localhost/bar.js');
      expect(scripts.length).toBe(1);
      expect(scripts[0].src).toBe('http://localhost/bar.js');
      expect(scripts[0].id).toBe('');
    });


    it('should append a script with an id to body', function() {
      browser.addJs('http://localhost/bar.js', 'foo-id');
      expect(scripts.length).toBe(1);
      expect(scripts[0].src).toBe('http://localhost/bar.js');
      expect(scripts[0].id).toBe('foo-id');
    });


    it('should return the appended script element', function() {
      var script = browser.addJs('http://localhost/bar.js');
      expect(script).toBe(scripts[0]);
    });
  });
});
