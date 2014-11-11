'use strict';

/* global getHash:true, stripHash:true */

var historyEntriesLength;
var sniffer = {};

function MockWindow(options) {
  if (typeof options !== 'object') {
    options = {};
  }
  var events = {};
  var timeouts = this.timeouts = [];
  var locationHref = 'http://server/';
  var mockWindow = this;
  var msie = options.msie;
  var ieState;

  historyEntriesLength = 1;

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
    if (angular.isUndefined(events[name])) events[name] = [];
    events[name].push(listener);
  };

  this.removeEventListener = noop;

  this.fire = function(name) {
    forEach(events[name], function(fn) {
      fn({type: name}); // type to make jQuery happy
    });
  };

  this.location = {
    get href() {
      return locationHref;
    },
    set href(value) {
      locationHref = value;
      mockWindow.history.state = null;
      historyEntriesLength++;
    },
    get hash() {
      return getHash(locationHref);
    },
    set hash(value) {
      locationHref = stripHash(locationHref) + '#' + value;
    },
    replace: function(url) {
      locationHref = url;
      mockWindow.history.state = null;
    }
  };

  this.history = {
    pushState: function() {
      this.replaceState.apply(this, arguments);
      historyEntriesLength++;
    },
    replaceState: function(state, title, url) {
      locationHref = url;
      mockWindow.history.state = copy(state);
    }
  };
  // IE 10-11 deserialize history.state on each read making subsequent reads
  // different object.
  if (!msie) {
    this.history.state = null;
  } else {
    ieState = null;
    Object.defineProperty(this.history, 'state', {
      get: function() {
        return copy(ieState);
      },
      set: function(value) {
        ieState = value;
      },
      configurable: true,
      enumerable: true
    });
  }
}

function MockDocument() {
  var self = this;

  this[0] = window.document;
  this.basePath = '/';

  this.find = function(name) {
    if (name == 'base') {
      return {
        attr: function(name) {
          if (name == 'href') {
            return self.basePath;
          } else {
            throw new Error(name);
          }
        }
      };
    } else {
      throw new Error(name);
    }
  };
}

describe('browser', function() {
  /* global Browser: false */
  var browser, fakeWindow, fakeDocument, fakeLog, logs, scripts, removedScripts;

  beforeEach(function() {
    scripts = [];
    removedScripts = [];
    sniffer = {history: true};
    fakeWindow = new MockWindow();
    fakeDocument = new MockDocument();

    logs = {log:[], warn:[], info:[], error:[]};

    var fakeLog = {log: function() { logs.log.push(slice.call(arguments)); },
                   warn: function() { logs.warn.push(slice.call(arguments)); },
                   info: function() { logs.info.push(slice.call(arguments)); },
                   error: function() { logs.error.push(slice.call(arguments)); }};

    browser = new Browser(fakeWindow, fakeDocument, fakeLog, sniffer);
  });

  describe('MockBrowser', function() {
    describe('historyEntriesLength', function() {
      it('should increment historyEntriesLength when setting location.href', function() {
        expect(historyEntriesLength).toBe(1);
        fakeWindow.location.href = '/foo';
        expect(historyEntriesLength).toBe(2);
      });

      it('should not increment historyEntriesLength when using location.replace', function() {
        expect(historyEntriesLength).toBe(1);
        fakeWindow.location.replace('/foo');
        expect(historyEntriesLength).toBe(1);
      });

      it('should increment historyEntriesLength when using history.pushState', function() {
        expect(historyEntriesLength).toBe(1);
        fakeWindow.history.pushState({a: 2}, 'foo', '/bar');
        expect(historyEntriesLength).toBe(2);
      });

      it('should not increment historyEntriesLength when using history.replaceState', function() {
        expect(historyEntriesLength).toBe(1);
        fakeWindow.history.replaceState({a: 2}, 'foo', '/bar');
        expect(historyEntriesLength).toBe(1);
      });
    });

    describe('in IE', runTests({msie: true}));
    describe('not in IE', runTests({msie: false}));

    function runTests(options) {
      return function() {
        it('should return the same state object on every read', function() {
          var msie = options.msie;

          fakeWindow = new MockWindow({msie: msie});
          fakeWindow.location.state = {prop: 'val'};
          browser = new Browser(fakeWindow, fakeDocument, fakeLog, sniffer);

          browser.url(fakeWindow.location.href, false, {prop: 'val'});
          if (msie) {
            expect(fakeWindow.history.state).not.toBe(fakeWindow.history.state);
            expect(fakeWindow.history.state).toEqual(fakeWindow.history.state);
          } else {
            expect(fakeWindow.history.state).toBe(fakeWindow.history.state);
          }
        });
      };
    }
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

      it('should encode both name and value', function() {
        browser.cookies('cookie1=', 'val;ue');
        browser.cookies('cookie2=bar;baz', 'val=ue');

        var rawCookies = document.cookie.split("; "); //order is not guaranteed, so we need to parse
        expect(rawCookies.length).toEqual(2);
        expect(rawCookies).toContain('cookie1%3D=val%3Bue');
        expect(rawCookies).toContain('cookie2%3Dbar%3Bbaz=val%3Due');
      });

      it('should log warnings when 4kb per cookie storage limit is reached', function() {
        var i, longVal = '', cookieStr;

        for (i = 0; i < 4083; i++) {
          longVal += 'x';
        }

        cookieStr = document.cookie;
        browser.cookies('x', longVal); //total size 4093-4096, so it should go through
        expect(document.cookie).not.toEqual(cookieStr);
        expect(browser.cookies()['x']).toEqual(longVal);
        expect(logs.warn).toEqual([]);

        browser.cookies('x', longVal + 'xxxx'); //total size 4097-4099, a warning should be logged
        expect(logs.warn).toEqual(
          [["Cookie 'x' possibly not set or overflowed because it was too large (4097 > 4096 " +
             "bytes)!"]]);

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

    describe('put via cookies(cookieName, string), if no <base href> ', function() {
      beforeEach(function() {
        fakeDocument.basePath = undefined;
      });

      it('should default path in cookie to "" (empty string)', function() {
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

      it ('should decode cookie values that were encoded by puts', function() {
        document.cookie = "cookie2%3Dbar%3Bbaz=val%3Due;path=/";
        expect(browser.cookies()['cookie2=bar;baz']).toEqual('val=ue');
      });


      it('should preserve leading & trailing spaces in names and values', function() {
        browser.cookies(' cookie name ', ' cookie value ');
        expect(browser.cookies()[' cookie name ']).toEqual(' cookie value ');
        expect(browser.cookies()['cookie name']).not.toBeDefined();
      });

      it('should decode special characters in cookie values', function() {
        document.cookie = 'cookie_name=cookie_value_%E2%82%AC';
        expect(browser.cookies()['cookie_name']).toEqual('cookie_value_€');
      });

      it('should not decode cookie values that do not appear to be encoded', function() {
        // see #9211 - sometimes cookies contain a value that causes decodeURIComponent to throw
        document.cookie = 'cookie_name=cookie_value_%XX';
        expect(browser.cookies()['cookie_name']).toEqual('cookie_value_%XX');
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
      expect(fakeWindow.location.href).toEqual('http://server/');
    });

    it('should use history.replaceState when available', function() {
      sniffer.history = true;
      browser.url('http://new.org', true);

      expect(replaceState).toHaveBeenCalledOnce();
      expect(replaceState.argsForCall[0][2]).toEqual('http://new.org');

      expect(pushState).not.toHaveBeenCalled();
      expect(locationReplace).not.toHaveBeenCalled();
      expect(fakeWindow.location.href).toEqual('http://server/');
    });

    it('should set location.href when pushState not available', function() {
      sniffer.history = false;
      browser.url('http://new.org');

      expect(fakeWindow.location.href).toEqual('http://new.org');

      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(locationReplace).not.toHaveBeenCalled();
    });

    it('should set location.href and not use pushState when the url only changed in the hash fragment to please IE10/11', function() {
      sniffer.history = true;
      browser.url('http://server/#123');

      expect(fakeWindow.location.href).toEqual('http://server/#123');

      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(locationReplace).not.toHaveBeenCalled();
    });

    it("should retain the # character when the only change is clearing the hash fragment, to prevent page reload", function() {
      sniffer.history = true;

      browser.url('http://server/#123');
      expect(fakeWindow.location.href).toEqual('http://server/#123');

      browser.url('http://server/');
      expect(fakeWindow.location.href).toEqual('http://server/#');

    });

    it('should use location.replace when history.replaceState not available', function() {
      sniffer.history = false;
      browser.url('http://new.org', true);

      expect(locationReplace).toHaveBeenCalledWith('http://new.org');

      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(fakeWindow.location.href).toEqual('http://server/');
    });


    it('should use location.replace and not use replaceState when the url only changed in the hash fragment to please IE10/11', function() {
      sniffer.history = true;
      browser.url('http://server/#123', true);

      expect(locationReplace).toHaveBeenCalledWith('http://server/#123');

      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(fakeWindow.location.href).toEqual('http://server/');
    });


    it('should return $browser to allow chaining', function() {
      expect(browser.url('http://any.com')).toBe(browser);
    });

    it('should return $browser to allow chaining even if the previous and current URLs and states match', function() {
      expect(browser.url('http://any.com').url('http://any.com')).toBe(browser);
      var state = { any: 'foo' };
      expect(browser.url('http://any.com', false, state).url('http://any.com', false, state)).toBe(browser);
      expect(browser.url('http://any.com', true, state).url('http://any.com', true, state)).toBe(browser);
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

    it('should not read out location.href if a reload was triggered but still allow to change the url', function() {
      sniffer.history = false;
      browser.url('http://server/someOtherUrlThatCausesReload');
      expect(fakeWindow.location.href).toBe('http://server/someOtherUrlThatCausesReload');

      fakeWindow.location.href = 'http://someNewUrl';
      expect(browser.url()).toBe('http://server/someOtherUrlThatCausesReload');

      browser.url('http://server/someOtherUrl');
      expect(browser.url()).toBe('http://server/someOtherUrl');
      expect(fakeWindow.location.href).toBe('http://server/someOtherUrl');
    });

    it('assumes that changes to location.hash occur in sync', function() {
      // This is an asynchronous integration test that changes the
      // hash in all possible ways and checks
      // - whether the change to the hash can be read out in sync
      // - whether the change to the hash can be read out in the hashchange event
      var realWin = window,
          $realWin = jqLite(realWin),
          hashInHashChangeEvent = [];

      runs(function() {
        $realWin.on('hashchange', hashListener);

        realWin.location.hash = '1';
        realWin.location.href += '2';
        realWin.location.replace(realWin.location.href + '3');
        realWin.location.assign(realWin.location.href + '4');

        expect(realWin.location.hash).toBe('#1234');
      });
      waitsFor(function() {
        return hashInHashChangeEvent.length > 3;
      });
      runs(function() {
        $realWin.off('hashchange', hashListener);

        forEach(hashInHashChangeEvent, function(hash) {
          expect(hash).toBe('#1234');
        });
      });

      function hashListener() {
        hashInHashChangeEvent.push(realWin.location.hash);
      }
    });

  });

  describe('url (when state passed)', function() {
    var currentHref, pushState, replaceState, locationReplace;

    beforeEach(function() {
    });

    describe('in IE', runTests({msie: true}));
    describe('not in IE', runTests({msie: false}));

    function runTests(options) {
      return function() {
        beforeEach(function() {
          sniffer = {history: true};

          fakeWindow = new MockWindow({msie: options.msie});
          currentHref = fakeWindow.location.href;
          pushState = spyOn(fakeWindow.history, 'pushState').andCallThrough();
          replaceState = spyOn(fakeWindow.history, 'replaceState').andCallThrough();
          locationReplace = spyOn(fakeWindow.location, 'replace').andCallThrough();

          browser = new Browser(fakeWindow, fakeDocument, fakeLog, sniffer);
          browser.onUrlChange(function() {});
        });

        it('should change state', function() {
          browser.url(currentHref, false, {prop: 'val1'});
          expect(fakeWindow.history.state).toEqual({prop: 'val1'});
          browser.url(currentHref + '/something', false, {prop: 'val2'});
          expect(fakeWindow.history.state).toEqual({prop: 'val2'});
        });

        it('should allow to set falsy states (except `undefined`)', function() {
          fakeWindow.history.state = {prop: 'val1'};
          fakeWindow.fire('popstate');

          browser.url(currentHref, false, null);
          expect(fakeWindow.history.state).toBe(null);

          browser.url(currentHref, false, false);
          expect(fakeWindow.history.state).toBe(false);

          browser.url(currentHref, false, '');
          expect(fakeWindow.history.state).toBe('');

          browser.url(currentHref, false, 0);
          expect(fakeWindow.history.state).toBe(0);
        });

        it('should treat `undefined` state as `null`', function() {
          fakeWindow.history.state = {prop: 'val1'};
          fakeWindow.fire('popstate');

          browser.url(currentHref, false, undefined);
          expect(fakeWindow.history.state).toBe(null);
        });

        it('should do pushState with the same URL and a different state', function() {
          browser.url(currentHref, false, {prop: 'val1'});
          expect(fakeWindow.history.state).toEqual({prop: 'val1'});

          browser.url(currentHref, false, null);
          expect(fakeWindow.history.state).toBe(null);

          browser.url(currentHref, false, {prop: 'val2'});
          browser.url(currentHref, false, {prop: 'val3'});
          expect(fakeWindow.history.state).toEqual({prop: 'val3'});
        });

        it('should do pushState with the same URL and deep equal but referentially different state', function() {
          fakeWindow.history.state = {prop: 'val'};
          fakeWindow.fire('popstate');
          expect(historyEntriesLength).toBe(1);

          browser.url(currentHref, false, {prop: 'val'});
          expect(fakeWindow.history.state).toEqual({prop: 'val'});
          expect(historyEntriesLength).toBe(2);
        });

        it('should not do pushState with the same URL and state from $browser.state()', function() {
          browser.url(currentHref, false, {prop: 'val'});

          pushState.reset();
          replaceState.reset();
          locationReplace.reset();

          browser.url(currentHref, false, browser.state());
          expect(pushState).not.toHaveBeenCalled();
          expect(replaceState).not.toHaveBeenCalled();
          expect(locationReplace).not.toHaveBeenCalled();
        });
      };
    }
  });

  describe('state', function() {
    var currentHref;

    beforeEach(function() {
      sniffer = {history: true};
      currentHref = fakeWindow.location.href;
    });

    describe('in IE', runTests({msie: true}));
    describe('not in IE', runTests({msie: false}));

    function runTests(options) {
      return function() {
        beforeEach(function() {
          fakeWindow = new MockWindow({msie: options.msie});
          browser = new Browser(fakeWindow, fakeDocument, fakeLog, sniffer);
        });

        it('should return history.state', function() {
          browser.url(currentHref, false, {prop: 'val'});
          expect(browser.state()).toEqual({prop: 'val'});
          browser.url(currentHref, false, 2);
          expect(browser.state()).toEqual(2);
          browser.url(currentHref, false, null);
          expect(browser.state()).toEqual(null);
        });

        it('should return null if history.state is undefined', function() {
          browser.url(currentHref, false, undefined);
          expect(browser.state()).toBe(null);
        });

        it('should return the same state object in subsequent invocations in IE', function() {
          browser.url(currentHref, false, {prop: 'val'});
          expect(browser.state()).toBe(browser.state());
        });
      };
    }
  });

  describe('urlChange', function() {
    var callback;

    beforeEach(function() {
      callback = jasmine.createSpy('onUrlChange');
    });

    afterEach(function() {
      if (!jQuery) jqLiteDealoc(fakeWindow);
    });

    it('should return registered callback', function() {
      expect(browser.onUrlChange(callback)).toBe(callback);
    });

    it('should forward popstate event with new url when history supported', function() {
      sniffer.history = true;
      browser.onUrlChange(callback);
      fakeWindow.location.href = 'http://server/new';

      fakeWindow.fire('popstate');
      expect(callback).toHaveBeenCalledWith('http://server/new', null);

      fakeWindow.fire('hashchange');
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should forward only popstate event when history supported', function() {
      sniffer.history = true;
      browser.onUrlChange(callback);
      fakeWindow.location.href = 'http://server/new';

      fakeWindow.fire('popstate');
      expect(callback).toHaveBeenCalledWith('http://server/new', null);

      fakeWindow.fire('hashchange');
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should forward hashchange event with new url when history not supported', function() {
      sniffer.history = false;
      browser.onUrlChange(callback);
      fakeWindow.location.href = 'http://server/new';

      fakeWindow.fire('hashchange');
      expect(callback).toHaveBeenCalledWith('http://server/new', null);

      fakeWindow.fire('popstate');
      fakeWindow.setTimeout.flush();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should not fire urlChange if changed by browser.url method', function() {
      sniffer.history = false;
      browser.onUrlChange(callback);
      browser.url('http://new.com');

      fakeWindow.fire('hashchange');
      expect(callback).not.toHaveBeenCalled();
    });

    describe('state handling', function() {
      var currentHref;

      beforeEach(function() {
        sniffer = {history: true};
        currentHref = fakeWindow.location.href;
      });

      describe('in IE', runTests({msie: true}));
      describe('not in IE', runTests({msie: false}));

      function runTests(options) {
        return function() {
          beforeEach(function() {
            fakeWindow = new MockWindow({msie: options.msie});
            browser = new Browser(fakeWindow, fakeDocument, fakeLog, sniffer);
          });

          it('should fire onUrlChange listeners only once if both popstate and hashchange triggered', function() {
            fakeWindow.history.state = {prop: 'val'};
            browser.onUrlChange(callback);

            fakeWindow.fire('hashchange');
            fakeWindow.fire('popstate');
            expect(callback).toHaveBeenCalledOnce();
          });
        };
      }
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

  describe('integration tests with $location', function() {

    function setup(options) {
      module(function($provide, $locationProvider) {
        spyOn(fakeWindow.history, 'pushState').andCallFake(function(stateObj, title, newUrl) {
          fakeWindow.location.href = newUrl;
        });
        spyOn(fakeWindow.location, 'replace').andCallFake(function(newUrl) {
          fakeWindow.location.href = newUrl;
        });
        $provide.value('$browser', browser);
        browser.pollFns = [];

        sniffer.history = options.history;
        $provide.value('$sniffer', sniffer);

        $locationProvider.html5Mode(options.html5Mode);
      });
    }

    describe('update $location when it was changed outside of Angular in sync ' +
       'before $digest was called', function() {

      it('should work with no history support, no html5Mode', function() {
        setup({
          history: false,
          html5Mode: false
        });
        inject(function($rootScope, $location) {
          $rootScope.$apply(function() {
            $location.path('/initialPath');
          });
          expect(fakeWindow.location.href).toBe('http://server/#/initialPath');

          fakeWindow.location.href = 'http://server/#/someTestHash';

          $rootScope.$digest();

          expect($location.path()).toBe('/someTestHash');
        });
      });

      it('should work with history support, no html5Mode', function() {
        setup({
          history: true,
          html5Mode: false
        });
        inject(function($rootScope, $location) {
          $rootScope.$apply(function() {
            $location.path('/initialPath');
          });
          expect(fakeWindow.location.href).toBe('http://server/#/initialPath');

          fakeWindow.location.href = 'http://server/#/someTestHash';

          $rootScope.$digest();

          expect($location.path()).toBe('/someTestHash');
        });
      });

      it('should work with no history support, with html5Mode', function() {
        setup({
          history: false,
          html5Mode: true
        });
        inject(function($rootScope, $location) {
          $rootScope.$apply(function() {
            $location.path('/initialPath');
          });
          expect(fakeWindow.location.href).toBe('http://server/#/initialPath');

          fakeWindow.location.href = 'http://server/#/someTestHash';

          $rootScope.$digest();

          expect($location.path()).toBe('/someTestHash');
        });
      });

      it('should work with history support, with html5Mode', function() {
        setup({
          history: true,
          html5Mode: true
        });
        inject(function($rootScope, $location) {
          $rootScope.$apply(function() {
            $location.path('/initialPath');
          });
          expect(fakeWindow.location.href).toBe('http://server/initialPath');

          fakeWindow.location.href = 'http://server/someTestHash';

          $rootScope.$digest();

          expect($location.path()).toBe('/someTestHash');
        });
      });

    });

    it('should not reload the page on every $digest when the page will be reloaded due to url rewrite on load', function() {
      setup({
        history: false,
        html5Mode: true
      });
      fakeWindow.location.href = 'http://server/some/deep/path';
      var changeUrlCount = 0;
      var _url = browser.url;
      browser.url = function(newUrl, replace, state) {
        if (newUrl) {
          changeUrlCount++;
        }
        return _url.call(this, newUrl, replace);
      };
      spyOn(browser, 'url').andCallThrough();
      inject(function($rootScope, $location) {
        $rootScope.$digest();
        $rootScope.$digest();
        $rootScope.$digest();
        $rootScope.$digest();

        // from $location for rewriting the initial url into a hash url
        expect(browser.url).toHaveBeenCalledWith('http://server/#/some/deep/path', true);
        expect(changeUrlCount).toBe(1);
      });

    });
  });

  describe('integration test with $rootScope', function() {

    beforeEach(module(function($provide, $locationProvider) {
      $provide.value('$browser', browser);
      browser.pollFns = [];
    }));

    it('should not interfere with legacy browser url replace behavior', function() {
      inject(function($rootScope) {
        var current = fakeWindow.location.href;
        var newUrl = 'notyet';
        sniffer.history = false;
        expect(historyEntriesLength).toBe(1);
        browser.url(newUrl, true);
        expect(browser.url()).toBe(newUrl);
        expect(historyEntriesLength).toBe(1);
        $rootScope.$digest();
        expect(browser.url()).toBe(newUrl);
        expect(historyEntriesLength).toBe(1);
      });
    });

  });

});
