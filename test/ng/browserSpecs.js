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
    replace: noop,
    pathname: window.location.pathname
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
        sniffer = { history: true, hashchange: true };
        fakeWindow = new MockWindow();
        fakeDocument = new MockDocument();

        var fakeBody = [{ appendChild: function(node) { scripts.push(node); },
            removeChild: function(node) { removedScripts.push(node); }
        }];

        logs = { log: [], warn: [], info: [], error: [] };

        var fakeLog = { log: function() { logs.log.push(slice.call(arguments)); },
            warn: function() { logs.warn.push(slice.call(arguments)); },
            info: function() { logs.info.push(slice.call(arguments)); },
            error: function() { logs.error.push(slice.call(arguments)); }
        };

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

        var lastCookieSet = null;
        function deleteAllCookies() {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var path = location.pathname;
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                //delete all possible paths
                while (path && path != '') {
                    document.cookie = name + "=;path=" + path + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    path = path.replace(/\/$|[^\/]*[^\/]$/, "");
                }
				document.cookie = name + "=;path=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
        function spyOnCookies() {
            lastCookieSet = null;
            var originalSetCookie = browser.cookies._setCookie;
            browser.cookies._setCookie = function(value) {
                lastCookieSet = value;
                originalSetCookie(value);
            }
        }

        beforeEach(function() {
            deleteAllCookies();
            spyOnCookies();
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
            it('should remove cookie with file path', function() {
                document.cookie = 'foo=bar;path=/karma';
                browser.cookies('foo', undefined);
                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
            it('should remove cookie with directory path', function() {
                document.cookie = 'foo=bar;path=/karma/';
                browser.cookies('foo', undefined);

                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
            it('should remove cookie with nested path', function() {
                document.cookie = 'foo=bar;path=/karma/tests';
                browser.cookies('foo', undefined);

                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
            it('should remove all named cookies with different paths', function() {
                document.cookie = 'foo=first;path=/';
                document.cookie = 'foo=second;path=/karma';
                browser.cookies('foo', undefined);
                
                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
        });
        describe('remove via cookies(cookieName, undefined,options)',function(){
            it('should work with null in options argument',function() {
                document.cookie = 'foo=bar;path=/';

                browser.cookies('foo', undefined,null);

                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
            it('should work with array in options argument',function() {
                document.cookie = 'foo=bar;path=/';

                browser.cookies('foo', undefined,[]);

                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
            it('should not delete path not requested',function() {
                document.cookie = 'foo=bar;path=/';

                browser.cookies('foo', undefined,{path:"/karma"});

                expect(document.cookie).toEqual('foo=bar');
                expect(browser.cookies()).toEqual({'foo':'bar'});
            })
            it('should delete requested path',function() {
                document.cookie = 'foo=bar;path=/karma';

                browser.cookies('foo', undefined,{path:"/karma"});

                expect(document.cookie).toEqual('');
                expect(browser.cookies()).toEqual({});
            })
            it('should delete only requested path',function() {
                document.cookie = 'foo=first;path=/';
                document.cookie = 'foo=second;path=/karma';

                browser.cookies('foo', undefined,{path:"/"});

                expect(document.cookie).toEqual('foo=second');
                expect(browser.cookies()).toEqual({'foo':'second'});
            })
        })

        describe('put via cookies(cookieName, string)', function() {

            it('should create and store a cookie', function() {
                browser.cookies('cookieName', 'cookie=Value');
                expect(document.cookie).toMatch(/cookieName=cookie%3DValue;? ?/);
                expect(browser.cookies()).toEqual({ 'cookieName': 'cookie=Value' });
                expect(lastCookieSet).toEqual("cookieName=cookie%3DValue;path=/")
            });


            it('should overwrite an existing unsynced cookie', function() {
                document.cookie = "cookie=new;path=/";

                var oldVal = browser.cookies('cookie', 'newer');

                expect(document.cookie).toEqual('cookie=newer');
                expect(browser.cookies()).toEqual({ 'cookie': 'newer' });
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

                for (i = 0; i < 4083; i++) {
                    longVal += '+';
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
                    fail("browser didn't drop long cookie when it was expected. make the cookie in this " +
              "test longer");
                }

                expect(browser.cookies().x).toEqual('shortVal');
            });
            it('should allow empty values', function() {
                browser.cookies('cookieName', '');
                expect(document.cookie).toMatch(/cookieName=?/)
                expect(browser.cookies().cookieName).toEqual('');
            })
        });

        describe('put via cookies(cookieName, string), if no <base href> ', function() {
            beforeEach(function() {
                fakeDocument.basePath = undefined;
            });

            it('should default path in cookie to "" (empty string)', function() {
                browser.cookies('cookie', 'bender');   
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=")
            });
        });
        describe('put via cookies(cookieName, string), with complex <base href> ', function() {
            beforeEach(function() {
                fakeDocument.basePath = "http://location/karma/";
            });

            it('should set path in cookie to uri path', function() {
                browser.cookies('cookie', 'bender');
                //TODO: change test to run in URI /inner/path, so that the cookies will be saved
                // and we can query them.                
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/karma/")
            });
        });
        describe('put via cookies(cookieName,string,options) with no options', function() {
            it('should not throw exception when passing null', function() {
                browser.cookies('cookie', 'bender', null);
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/");
            })
            it('should not throw exception when passing array', function() {
                browser.cookies('cookie', 'bender', []);
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/");
            })
        })
        describe('put via cookies(cookieName, string,options) with different path', function() {
            it('should set path in cookie to desired path', function() {
                browser.cookies('cookie', 'bender', { path: "/karma/tests" });
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/karma/tests")
            })
            it('shuld ignore path if path is not part of location', function() {
                browser.cookies('cookie', 'bender', { path: "/something" });
                expect(lastCookieSet).toEqual("cookie=bender;path=/")
                expect(document.cookie).toEqual('cookie=bender');
                expect(logs.warn).toEqual(
                    [["Cookie 'cookie' was not set with requested path '/something'" +
                      " since path is not a String or not partial to window.location, which is /karma/tests/context.html"]]);
            })
        })
        describe('put via cookies(cookieName, string,options) with expiration', function() {
            it('should set expiration if passed', function() {
                browser.cookies('cookie', 'bender', { expires: new Date(2050, 1, 1) });
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/;expires=" + new Date(2050, 1, 1).toUTCString())
            })
            it('should ignore if not a date object', function() {
                browser.cookies('cookie', 'bender', { expires: [] });
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/")
                expect(logs.warn).toEqual(
                    [["Cookie 'cookie' was not set with requested expiration ''" +
                          " since date is in the past or object is not a date"]]);
            })
            it('should ignore if date in the past', function() {
                browser.cookies('cookie', 'bender', { expires: new Date(1999, 1, 1) });
                expect(document.cookie).toEqual('cookie=bender');
                expect(lastCookieSet).toEqual("cookie=bender;path=/")
                expect(logs.warn).toEqual(
                    [["Cookie 'cookie' was not set with requested expiration '" + (new Date(1999, 1, 1)) +
                          "' since date is in the past or object is not a date"]]);
            })
        })
        describe('get via cookies()[cookieName]', function() {

            it('should return undefined for nonexistent cookie', function() {
                expect(browser.cookies().nonexistent).not.toBeDefined();
            });


            it('should return a value for an existing cookie', function() {
                document.cookie = "foo=bar=baz;path=/";
                expect(browser.cookies().foo).toEqual('bar=baz');
            });


            it('should unescape cookie values that were escaped by puts', function() {
                document.cookie = "cookie2%3Dbar%3Bbaz=val%3Due;path=/";
                expect(browser.cookies()['cookie2=bar;baz']).toEqual('val=ue');
            });


            it('should preserve leading & trailing spaces in names and values', function() {
                browser.cookies(' cookie name ', ' cookie value ');
                expect(browser.cookies()[' cookie name ']).toEqual(' cookie value ');
                expect(browser.cookies()['cookie name']).not.toBeDefined();
            });
            it('should read empty values', function() {
                document.cookie = "cookie=;path=/";
                expect(browser.cookies()['cookie']).toEqual('');
            })
        });


        describe('getAll via cookies()', function() {

            it('should return cookies as hash', function() {
                document.cookie = "foo1=bar1;path=/";
                document.cookie = "foo2=bar2;path=/";
                expect(browser.cookies()).toEqual({ 'foo1': 'bar1', 'foo2': 'bar2' });
            });


            it('should return empty hash if no cookies exist', function() {
                expect(browser.cookies()).toEqual({});
            });
        });


        it('should pick up external changes made to browser cookies', function() {
            browser.cookies('oatmealCookie', 'drool');
            expect(browser.cookies()).toEqual({ 'oatmealCookie': 'drool' });

            document.cookie = 'oatmealCookie=changed;path=/';
            expect(browser.cookies().oatmealCookie).toEqual('changed');
        });


        it('should initialize cookie cache with existing cookies', function() {
            document.cookie = "existingCookie=existingValue;path=/";
            expect(browser.cookies()).toEqual({ 'existingCookie': 'existingValue' });
        });

    });

    describe('poller', function() {

        it('should call functions in pollFns in regular intervals', function() {
            var log = '';
            browser.addPollFn(function() { log += 'a'; });
            browser.addPollFn(function() { log += 'b'; });
            expect(log).toEqual('');
            fakeWindow.setTimeout.flush();
            expect(log).toEqual('ab');
            fakeWindow.setTimeout.flush();
            expect(log).toEqual('abab');
        });

        it('should startPoller', function() {
            expect(fakeWindow.timeouts.length).toEqual(0);

            browser.addPollFn(function() { });
            expect(fakeWindow.timeouts.length).toEqual(1);

            //should remain 1 as it is the check fn
            browser.addPollFn(function() { });
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
    });
});
