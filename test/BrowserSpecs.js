describe('browser', function(){

  var browser, fakeWindow, xhr, logs, scripts, setTimeoutQueue;

  function fakeSetTimeout(fn) {
    setTimeoutQueue.push(fn);
  }

  fakeSetTimeout.flush = function() {
    forEach(setTimeoutQueue, function(fn) {
      fn();
    });
  };


  beforeEach(function(){
    setTimeoutQueue = [];
    scripts = [];
    xhr = null;
    fakeWindow = {
      location: {href:"http://server"},
      setTimeout: fakeSetTimeout
    }

    var fakeBody = {append: function(node){scripts.push(node)}};

    var fakeXhr = function(){
      xhr = this;
      this.open = noop;
      this.setRequestHeader = noop;
      this.send = noop;
    }

    logs = {log:[], warn:[], info:[], error:[]};

    var fakeLog = {log: function() { logs.log.push(slice.call(arguments)); },
                   warn: function() { logs.warn.push(slice.call(arguments)); },
                   info: function() { logs.info.push(slice.call(arguments)); },
                   error: function() { logs.error.push(slice.call(arguments)); }};

    browser = new Browser(fakeWindow, jqLite(window.document), fakeBody, fakeXhr,
                          fakeLog);
  });

  it('should contain cookie cruncher', function() {
    expect(browser.cookies).toBeDefined();
  });

  describe('outstading requests', function(){
    it('should process callbacks immedietly with no outstanding requests', function(){
      var callback = jasmine.createSpy('callback');
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).wasCalled();
    });

    it('should queue callbacks with outstanding requests', function(){
      var callback = jasmine.createSpy('callback');
      browser.xhr('GET', '/url', noop);
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).not.wasCalled();

      xhr.readyState = 4;
      xhr.onreadystatechange();
      expect(callback).wasCalled();
    });
  });

  describe('xhr', function(){
    describe('JSON', function(){
      it('should add script tag for request', function() {
        var log = "";
        browser.xhr('JSON', 'http://example.org/path?cb=JSON_CALLBACK', function(code, data){
          log += code + ':' + data + ';';
        });
        expect(scripts.length).toEqual(1);
        var url = scripts[0].src.split('?cb=');
        expect(url[0]).toEqual('http://example.org/path');
        expect(typeof fakeWindow[url[1]]).toEqual($function);
        fakeWindow[url[1]]('data');
        expect(log).toEqual('200:data;');
        expect(typeof fakeWindow[url[1]]).toEqual('undefined');
      });
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
      expect(callback).not.wasCalled();

      fakeSetTimeout.flush();
      expect(callback).wasCalled();
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
        browser.cookies('cookieName', 'cookieValue');
        expect(document.cookie).toMatch(/cookieName=cookieValue;? ?/);
        expect(browser.cookies()).toEqual({'cookieName':'cookieValue'});
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
        document.cookie = "foo=bar";
        expect(browser.cookies().foo).toEqual('bar');
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
    it('should call all fns on poll', function(){
      var log = '';
      browser.addPollFn(function(){log+='a';});
      browser.addPollFn(function(){log+='b';});
      expect(log).toEqual('');
      browser.poll();
      expect(log).toEqual('ab');
      browser.poll();
      expect(log).toEqual('abab');
    });

    it('should startPoller', function(){
      var log = '';
      var setTimeoutSpy = jasmine.createSpy('setTimeout');
      browser.addPollFn(function(){log+='.';});
      browser.startPoller(50, setTimeoutSpy);
      expect(log).toEqual('.');
      expect(setTimeoutSpy.mostRecentCall.args[1]).toEqual(50);
      setTimeoutSpy.mostRecentCall.args[0]();
      expect(log).toEqual('..');
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

      fakeWindow = {location: {href:"http://server"}};

      browser = new Browser(fakeWindow, {}, {});

      var events = [];

      browser.onHashChange(function() {
        events.push('x');
      });

      fakeWindow.location.href = "http://server/#newHash";
      expect(events).toEqual([]);
      browser.poll();
      expect(events).toEqual(['x']);
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
                    detachEvent: angular.noop
                   };
      fakeWindow.onhashchange = true;

      browser = new Browser(fakeWindow, {}, {});

      var events = [],
          event = {type: "hashchange"}

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
  });
});
