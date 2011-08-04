'use strict';

function MockWindow() {
  var events = {};
  var timeouts = this.timeouts = [];

  this.setTimeout = function(fn) {
    return timeouts.push(fn) - 1;
  };

  this.clearTimeout = function(id) {
    timeouts[id] = noop;
  };

  this.setTimeout.flush = function() {
    var length = timeouts.length;
    while (length-- > 0) timeouts.shift()();
  };

  this.addEventListener = function(name, listener) {
    if (isUndefined(events[name])) events[name] = [];
    events[name].push(listener);
  };

  this.attachEvent = function(name, listener) {
    this.addEventListener(name.substr(2), listener);
  };

  this.removeEventListener = noop;
  this.detachEvent = noop;

  this.fire = function(name) {
    forEach(events[name], function(fn) {
      fn({type: name}); // type to make jQuery happy
    });
  };

  this.location = {
    href: 'http://server',
    replace: noop
  };

  this.history = {
    replaceState: noop,
    pushState: noop
  };
}

describe('browser', function() {

  var browser, fakeWindow, xhr, logs, scripts, removedScripts, sniffer;

  beforeEach(function() {
    scripts = [];
    removedScripts = [];
    xhr = null;
    sniffer = {history: true, hashchange: true};
    fakeWindow = new MockWindow();

    var fakeBody = [{appendChild: function(node){scripts.push(node);},
                     removeChild: function(node){removedScripts.push(node);}}];

    var FakeXhr = function() {
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
                          fakeLog, sniffer);
  });

  it('should contain cookie cruncher', function() {
    expect(browser.cookies).toBeDefined();
  });

  describe('outstading requests', function() {
    it('should process callbacks immedietly with no outstanding requests', function() {
      var callback = jasmine.createSpy('callback');
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should queue callbacks with outstanding requests', function() {
      var callback = jasmine.createSpy('callback');
      browser.xhr('GET', '/url', null, noop);
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).not.toHaveBeenCalled();

      xhr.readyState = 4;
      xhr.onreadystatechange();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('xhr', function() {
    describe('JSONP', function() {
      var log;

      function callback(code, data) {
        log += code + ':' + data + ';';
      }

      beforeEach(function() {
        log = "";
      });


      // We don't have unit tests for IE because script.readyState is readOnly.
      // Instead we run e2e tests on all browsers - see e2e for $http.
      if (!msie) {

        it('should add script tag for JSONP request', function() {
          var notify = jasmine.createSpy('notify');
          browser.xhr('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
          browser.notifyWhenNoOutstandingRequests(notify);
          expect(notify).not.toHaveBeenCalled();
          expect(scripts.length).toEqual(1);
          var script = scripts[0];
          var url = script.src.split('?cb=');
          expect(url[0]).toEqual('http://example.org/path');
          expect(typeof fakeWindow[url[1]]).toEqual('function');
          fakeWindow[url[1]]('data');
          script.onload();

          expect(notify).toHaveBeenCalled();
          expect(log).toEqual('200:data;');
          expect(scripts).toEqual(removedScripts);
          expect(fakeWindow[url[1]]).toBeUndefined();
        });


        it('should call callback with status -2 when script fails to load', function() {
          browser.xhr('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
          var script = scripts[0];
          expect(typeof script.onload).toBe('function');
          expect(typeof script.onerror).toBe('function');
          script.onerror();

          expect(log).toEqual('-2:undefined;');
        });


        it('should update the outstandingRequests counter for successful requests', function() {
          var notify = jasmine.createSpy('notify');
          browser.xhr('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
          browser.notifyWhenNoOutstandingRequests(notify);
          expect(notify).not.toHaveBeenCalled();

          var script = scripts[0];
          var url = script.src.split('?cb=');
          fakeWindow[url[1]]('data');
          script.onload();

          expect(notify).toHaveBeenCalled();
        });


        it('should update the outstandingRequests counter for failed requests', function() {
          var notify = jasmine.createSpy('notify');
          browser.xhr('JSONP', 'http://example.org/path?cb=JSON_CALLBACK', null, callback);
          browser.notifyWhenNoOutstandingRequests(notify);
          expect(notify).not.toHaveBeenCalled();

          scripts[0].onerror();

          expect(notify).toHaveBeenCalled();
        });
      }
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

    it('should return raw xhr object', function() {
      expect(browser.xhr('GET', '/url', null, noop)).toBe(xhr);
    });

    it('should abort request on timeout', function() {
      var callback = jasmine.createSpy('done').andCallFake(function(status, response) {
        expect(status).toBe(-1);
      });

      browser.xhr('GET', '/url', null, callback, {}, 2000);
      xhr.abort = jasmine.createSpy('xhr.abort');

      fakeWindow.setTimeout.flush();
      expect(xhr.abort).toHaveBeenCalledOnce();

      xhr.status = 0;
      xhr.readyState = 4;
      xhr.onreadystatechange();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should be async even if xhr.send() is sync', function() {
      // IE6, IE7 is sync when serving from cache
      var xhr;
      function FakeXhr() {
        xhr = this;
        this.open = this.setRequestHeader = noop;
        this.send = function() {
          this.status = 200;
          this.responseText = 'response';
          this.readyState = 4;
        };
      }

      var callback = jasmine.createSpy('done').andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('response');
      });

      browser = new Browser(fakeWindow, jqLite(window.document), null, FakeXhr, null);
      browser.xhr('GET', '/url', null, callback);
      expect(callback).not.toHaveBeenCalled();

      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();

      (xhr.onreadystatechange || noop)();
      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('defer', function() {
    it('should execute fn asynchroniously via setTimeout', function() {
      var callback = jasmine.createSpy('deferred');

      browser.defer(callback);
      expect(callback).not.toHaveBeenCalled();

      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should update outstandingRequests counter', function() {
      var callback = jasmine.createSpy('deferred');

      browser.defer(callback);
      expect(callback).not.toHaveBeenCalled();

      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return unique deferId', function() {
      var deferId1 = browser.defer(noop),
          deferId2 = browser.defer(noop);

      expect(deferId1).toBeDefined();
      expect(deferId2).toBeDefined();
      expect(deferId1).not.toEqual(deferId2);
    });


    describe('cancel', function() {
      it('should allow tasks to be canceled with returned deferId', function() {
        var log = [],
            deferId1 = browser.defer(function() { log.push('cancel me'); }),
            deferId2 = browser.defer(function() { log.push('ok'); }),
            deferId3 = browser.defer(function() { log.push('cancel me, now!'); });

        expect(log).toEqual([]);
        expect(browser.defer.cancel(deferId1)).toBe(true);
        expect(browser.defer.cancel(deferId3)).toBe(true);
        fakeWindow.setTimeout.flush();
        expect(log).toEqual(['ok']);
        expect(browser.defer.cancel(deferId2)).toBe(false);
      });
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

        for(i=0; i<4091; i++) {
          longVal += '+';
        }

        cookieStr = document.cookie;
        browser.cookies('x', longVal); //total size 4093-4096, so it should go through
        expect(document.cookie).not.toEqual(cookieStr);
        expect(browser.cookies()['x']).toEqual(longVal);
        expect(logs.warn).toEqual([]);

        browser.cookies('x', longVal + 'xxxx'); //total size 4097-4099, a warning should be logged
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

  describe('poller', function() {

    it('should call functions in pollFns in regular intervals', function() {
      var log = '';
      browser.addPollFn(function() {log+='a';});
      browser.addPollFn(function() {log+='b';});
      expect(log).toEqual('');
      fakeWindow.setTimeout.flush();
      expect(log).toEqual('ab');
      fakeWindow.setTimeout.flush();
      expect(log).toEqual('abab');
    });

    it('should startPoller', function() {
      expect(fakeWindow.timeouts.length).toEqual(0);

      browser.addPollFn(function() {});
      expect(fakeWindow.timeouts.length).toEqual(1);

      //should remain 1 as it is the check fn
      browser.addPollFn(function() {});
      expect(fakeWindow.timeouts.length).toEqual(1);
    });

    it('should return fn that was passed into addPollFn', function() {
      var fn = function() { return 1; };
      var returnedFn = browser.addPollFn(fn);
      expect(returnedFn).toBe(fn);
    });
  });

  describe('url', function() {
    var pushState, replaceState, locationReplace;

    beforeEach(function() {
      pushState = spyOn(fakeWindow.history, 'pushState');
      replaceState = spyOn(fakeWindow.history, 'replaceState');
      locationReplace = spyOn(fakeWindow.location, 'replace');
    });

    it('should return current location.href', function() {
      fakeWindow.location.href = 'http://test.com';
      expect(browser.url()).toEqual('http://test.com');

      fakeWindow.location.href = 'https://another.com';
      expect(browser.url()).toEqual('https://another.com');
    });

    it('should use history.pushState when available', function() {
      sniffer.history = true;
      browser.url('http://new.org');

      expect(pushState).toHaveBeenCalledOnce();
      expect(pushState.argsForCall[0][2]).toEqual('http://new.org');

      expect(replaceState).not.toHaveBeenCalled();
      expect(locationReplace).not.toHaveBeenCalled();
      expect(fakeWindow.location.href).toEqual('http://server');
    });

    it('should use history.replaceState when available', function() {
      sniffer.history = true;
      browser.url('http://new.org', true);

      expect(replaceState).toHaveBeenCalledOnce();
      expect(replaceState.argsForCall[0][2]).toEqual('http://new.org');

      expect(pushState).not.toHaveBeenCalled();
      expect(locationReplace).not.toHaveBeenCalled();
      expect(fakeWindow.location.href).toEqual('http://server');
    });

    it('should set location.href when pushState not available', function() {
      sniffer.history = false;
      browser.url('http://new.org');

      expect(fakeWindow.location.href).toEqual('http://new.org');

      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(locationReplace).not.toHaveBeenCalled();
    });

    it('should use location.replace when history.replaceState not available', function() {
      sniffer.history = false;
      browser.url('http://new.org', true);

      expect(locationReplace).toHaveBeenCalledWith('http://new.org');

      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(fakeWindow.location.href).toEqual('http://server');
    });

    it('should return $browser to allow chaining', function() {
      expect(browser.url('http://any.com')).toBe(browser);
    });
  });

  describe('urlChange', function() {
    var callback;

    beforeEach(function() {
      callback = jasmine.createSpy('onUrlChange');
    });

    afterEach(function() {
      if (!jQuery) jqLite(fakeWindow).dealoc();
    });

    it('should return registered callback', function() {
      expect(browser.onUrlChange(callback)).toBe(callback);
    });

    it('should forward popstate event with new url when history supported', function() {
      sniffer.history = true;
      browser.onUrlChange(callback);
      fakeWindow.location.href = 'http://server/new';

      fakeWindow.fire('popstate');
      expect(callback).toHaveBeenCalledWith('http://server/new');

      fakeWindow.fire('hashchange');
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should forward only popstate event when both history and hashchange supported', function() {
      sniffer.history = true;
      sniffer.hashchange = true;
      browser.onUrlChange(callback);
      fakeWindow.location.href = 'http://server/new';

      fakeWindow.fire('popstate');
      expect(callback).toHaveBeenCalledWith('http://server/new');

      fakeWindow.fire('hashchange');
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should forward hashchange event with new url when only hashchange supported', function() {
      sniffer.history = false;
      sniffer.hashchange = true;
      browser.onUrlChange(callback);
      fakeWindow.location.href = 'http://server/new';

      fakeWindow.fire('hashchange');
      expect(callback).toHaveBeenCalledWith('http://server/new');

      fakeWindow.fire('popstate');
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should use polling when neither history nor hashchange supported', function() {
      sniffer.history = false;
      sniffer.hashchange = false;
      browser.onUrlChange(callback);

      fakeWindow.location.href = 'http://server.new';
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledWith('http://server.new');

      fakeWindow.fire('popstate');
      fakeWindow.fire('hashchange');
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should not fire urlChange if changed by browser.url method (polling)', function() {
      sniffer.history = false;
      sniffer.hashchange = false;
      browser.onUrlChange(callback);
      browser.url('http://new.com');

      fakeWindow.setTimeout.flush();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not fire urlChange if changed by browser.url method (hashchange)', function() {
      sniffer.history = false;
      sniffer.hashchange = true;
      browser.onUrlChange(callback);
      browser.url('http://new.com');

      fakeWindow.fire('hashchange');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('addJs', function() {
    it('should append a script tag to body', function() {
      browser.addJs('http://localhost/bar.js');
      expect(scripts.length).toBe(1);
      expect(scripts[0].src).toBe('http://localhost/bar.js');
      expect(scripts[0].id).toBe('');
    });

    it('should return the appended script element', function() {
      var script = browser.addJs('http://localhost/bar.js');
      expect(script).toBe(scripts[0]);
    });
  });

  describe('baseHref', function() {
    var jqDocHead;

    function setDocumentBaseHrefTo(href) {
      clearDocumentBaseHref();
      jqDocHead.append('<base href="' + href +'" />');
    }

    function clearDocumentBaseHref() {
      jqDocHead.find('base').remove();
    }

    beforeEach(function() {
      jqDocHead = jqLite(document).find('head');
    });

    afterEach(clearDocumentBaseHref);

    it('should return value from <base href>', function() {
      setDocumentBaseHrefTo('/base/path/');
      expect(browser.baseHref()).toEqual('/base/path/');
    });

    it('should return undefined if no <base href>', function() {
      expect(browser.baseHref()).toBeUndefined();
    });

    it('should remove domain from <base href>', function() {
      setDocumentBaseHrefTo('http://host.com/base/path/');
      expect(browser.baseHref()).toEqual('/base/path/');

      setDocumentBaseHrefTo('http://host.com/base/path/index.html');
      expect(browser.baseHref()).toEqual('/base/path/index.html');
    });
  });
});
