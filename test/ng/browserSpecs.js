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

function MockDocument() {
  var self = this;

  this[0] = window.document
  this.basePath = '/';

  this.find = function(name) {
    if (name == 'base') {
      return {
        attr: function(name){
          if (name == 'href') {
            return self.basePath;
          } else {
            throw new Error(name);
          }
        }
      }
    } else {
      throw new Error(name);
    }
  }
}

describe('browser', function() {

  var browser, fakeWindow, fakeDocument, logs, scripts, removedScripts, sniffer;

  beforeEach(function() {
    scripts = [];
    removedScripts = [];
    sniffer = {history: true, hashchange: true};
    fakeWindow = new MockWindow();
    fakeDocument = new MockDocument();

    var fakeBody = [{appendChild: function(node){scripts.push(node);},
                     removeChild: function(node){removedScripts.push(node);}}];

    logs = {log:[], warn:[], info:[], error:[]};

    var fakeLog = {log: function() { logs.log.push(slice.call(arguments)); },
                   warn: function() { logs.warn.push(slice.call(arguments)); },
                   info: function() { logs.info.push(slice.call(arguments)); },
                   error: function() { logs.error.push(slice.call(arguments)); }};

    browser = new Browser(fakeWindow, fakeDocument, fakeLog, sniffer);
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
      var path = location.pathname;

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        var parts = path.split('/');
        while (parts.length) {
          document.cookie = name + "=;path=" + (parts.join('/') || '/') + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
          parts.pop();
        }
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
        document.cookie = 'foo=bar;path=/';

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
        document.cookie = "cookie=new;path=/";

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

        for(i=0; i<4083; i++) {
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
          this.fail(new Error("browser didn't drop long cookie when it was expected. make the " +
              "cookie in this test longer"));
        }

        expect(browser.cookies().x).toEqual('shortVal');
      });
    });

    describe('put via cookies(cookieName, string), if no <base href> ', function () {
      beforeEach(function () {
        fakeDocument.basePath = undefined;
      });

      it('should default path in cookie to "" (empty string)', function () {
        browser.cookies('cookie', 'bender');
        // This only fails in Safari and IE when cookiePath returns undefined
        // Where it now succeeds since baseHref return '' instead of undefined
        expect(document.cookie).toEqual('cookie=bender');
      });
    });

    describe('get via cookies()[cookieName]', function() {

      it('should return undefined for nonexistent cookie', function() {
        expect(browser.cookies().nonexistent).not.toBeDefined();
      });


      it ('should return a value for an existing cookie', function() {
        document.cookie = "foo=bar=baz;path=/";
        expect(browser.cookies().foo).toEqual('bar=baz');
      });

      it('should return the the first value provided for a cookie', function() {
        // For a cookie that has different values that differ by path, the
        // value for the most specific path appears first.  browser.cookies()
        // should provide that value for the cookie.
        document.cookie = 'foo="first"; foo="second"';
        expect(browser.cookies()['foo']).toBe('"first"');
      });

      it ('should unescape cookie values that were escaped by puts', function() {
        document.cookie = "cookie2%3Dbar%3Bbaz=val%3Due;path=/";
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
        document.cookie = "foo1=bar1;path=/";
        document.cookie = "foo2=bar2;path=/";
        expect(browser.cookies()).toEqual({'foo1':'bar1', 'foo2':'bar2'});
      });


      it('should return empty hash if no cookies exist', function() {
        expect(browser.cookies()).toEqual({});
      });
    });


    it('should pick up external changes made to browser cookies', function() {
      browser.cookies('oatmealCookie', 'drool');
      expect(browser.cookies()).toEqual({'oatmealCookie':'drool'});

      document.cookie = 'oatmealCookie=changed;path=/';
      expect(browser.cookies().oatmealCookie).toEqual('changed');
    });


    it('should initialize cookie cache with existing cookies', function() {
      document.cookie = "existingCookie=existingValue;path=/";
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


    it('should decode single quotes to work around FF bug 407273', function() {
      fakeWindow.location.href = "http://ff-bug/?single%27quote";
      expect(browser.url()).toBe("http://ff-bug/?single'quote");
    });

    it('should not set URL when the URL is already set', function() {
      var current = fakeWindow.location.href;
      sniffer.history = false;
      fakeWindow.location.href = 'dontchange';
      browser.url(current);
      expect(fakeWindow.location.href).toBe('dontchange');
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

      callback.reset();

      fakeWindow.fire('popstate');
      fakeWindow.fire('hashchange');
      expect(callback).not.toHaveBeenCalled();
    });

    describe('after an initial location change by browser.url method when neither history nor hashchange supported', function() {
      beforeEach(function() {
        sniffer.history = false;
        sniffer.hashchange = false;
        browser.url("http://server.current");
      });

      it('should fire callback with the correct URL on location change outside of angular', function() {
        browser.onUrlChange(callback);

        fakeWindow.location.href = 'http://server.new';
        fakeWindow.setTimeout.flush();
        expect(callback).toHaveBeenCalledWith('http://server.new');

        fakeWindow.fire('popstate');
        fakeWindow.fire('hashchange');
        expect(callback).toHaveBeenCalledOnce();
      });

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


  describe('baseHref', function() {
    var jqDocHead;

    beforeEach(function() {
      jqDocHead = jqLite(document).find('head');
    });

    it('should return value from <base href>', function() {
      fakeDocument.basePath = '/base/path/';
      expect(browser.baseHref()).toEqual('/base/path/');
    });

    it('should return \'\' (empty string) if no <base href>', function() {
      fakeDocument.basePath = undefined;
      expect(browser.baseHref()).toEqual('');
    });

    it('should remove domain from <base href>', function() {
      fakeDocument.basePath = 'http://host.com/base/path/';
      expect(browser.baseHref()).toEqual('/base/path/');

      fakeDocument.basePath = 'http://host.com/base/path/index.html';
      expect(browser.baseHref()).toEqual('/base/path/index.html');
    });

    it('should remove domain from <base href> beginning with \'//\'', function() {
      fakeDocument.basePath = '//google.com/base/path/';
      expect(browser.baseHref()).toEqual('/base/path/');
    });
  });
});
