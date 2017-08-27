'use strict';

describe('$$cookieWriter', function() {
  var $$cookieWriter, document;

  function deleteAllCookies() {
    var cookies = document.cookie.split(';');
    var path = window.location.pathname;

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      var parts = path.split('/');
      while (parts.length) {
        document.cookie = name + '=;path=' + (parts.join('/') || '/') + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
        parts.pop();
      }
    }
  }

  beforeEach(function() {
    document = window.document;
    deleteAllCookies();
    expect(document.cookie).toEqual('');

    module('ngCookies');
    inject(function(_$$cookieWriter_) {
      $$cookieWriter = _$$cookieWriter_;
    });
  });


  afterEach(function() {
    deleteAllCookies();
    expect(document.cookie).toEqual('');
  });


  describe('remove via $$cookieWriter(cookieName, undefined)', function() {

    it('should remove a cookie when it is present', function() {
      document.cookie = 'foo=bar;path=/';

      $$cookieWriter('foo', undefined);

      expect(document.cookie).toEqual('');
    });


    it('should do nothing when an nonexisting cookie is being removed', function() {
      $$cookieWriter('doesntexist', undefined);
      expect(document.cookie).toEqual('');
    });
  });


  describe('put via $$cookieWriter(cookieName, string)', function() {

    it('should create and store a cookie', function() {
      $$cookieWriter('cookieName', 'cookie=Value');
      expect(document.cookie).toMatch(/cookieName=cookie%3DValue;? ?/);
    });


    it('should overwrite an existing unsynced cookie', function() {
      document.cookie = 'cookie=new;path=/';

      var oldVal = $$cookieWriter('cookie', 'newer');

      expect(document.cookie).toEqual('cookie=newer');
      expect(oldVal).not.toBeDefined();
    });

    it('should encode both name and value', function() {
      $$cookieWriter('cookie1=', 'val;ue');
      $$cookieWriter('cookie2=bar;baz', 'val=ue');

      var rawCookies = document.cookie.split('; '); //order is not guaranteed, so we need to parse
      expect(rawCookies.length).toEqual(2);
      expect(rawCookies).toContain('cookie1%3D=val%3Bue');
      expect(rawCookies).toContain('cookie2%3Dbar%3Bbaz=val%3Due');
    });

    it('should log warnings when 4kb per cookie storage limit is reached', inject(function($log) {
      var i, longVal = '', cookieStr;

      for (i = 0; i < 4083; i++) {
        longVal += 'x';
      }

      cookieStr = document.cookie;
      $$cookieWriter('x', longVal); //total size 4093-4096, so it should go through
      expect(document.cookie).not.toEqual(cookieStr);
      expect(document.cookie).toEqual('x=' + longVal);
      expect($log.warn.logs).toEqual([]);

      $$cookieWriter('x', longVal + 'xxxx'); //total size 4097-4099, a warning should be logged
      expect($log.warn.logs).toEqual(
        [['Cookie \'x\' possibly not set or overflowed because it was too large (4097 > 4096 ' +
           'bytes)!']]);

      //force browser to dropped a cookie and make sure that the cache is not out of sync
      $$cookieWriter('x', 'shortVal');
      expect(document.cookie).toEqual('x=shortVal'); //needed to prime the cache
      cookieStr = document.cookie;
      $$cookieWriter('x', longVal + longVal + longVal); //should be too long for all browsers

      if (document.cookie !== cookieStr) {
        this.fail(new Error('browser didn\'t drop long cookie when it was expected. make the ' +
            'cookie in this test longer'));
      }

      expect(document.cookie).toEqual('x=shortVal');
      $log.reset();
    }));
  });

  describe('put via $$cookieWriter(cookieName, string), if no <base href> ', function() {
    beforeEach(inject(function($browser) {
      $browser.$$baseHref = undefined;
    }));

    it('should default path in cookie to "" (empty string)', function() {
      $$cookieWriter('cookie', 'bender');
      // This only fails in Safari and IE when cookiePath returns undefined
      // Where it now succeeds since baseHref return '' instead of undefined
      expect(document.cookie).toEqual('cookie=bender');
    });
  });
});

describe('cookie options', function() {
  var fakeDocument, $$cookieWriter;

  function getLastCookieAssignment(key) {
    return fakeDocument[0].cookie
              .split(';')
              .reduce(function(prev, value) {
                var pair = value.split('=', 2);
                if (pair[0] === key) {
                  if (isUndefined(prev)) {
                    return isUndefined(pair[1]) ? true : pair[1];
                  } else {
                    throw new Error('duplicate key in cookie string');
                  }
                } else {
                  return prev;
                }
              }, undefined);
  }

  beforeEach(function() {
    fakeDocument = [{cookie: ''}];
    module('ngCookies', {$document: fakeDocument});
    inject(function($browser) {
      $browser.$$baseHref = '/a/b';
    });
    inject(function(_$$cookieWriter_) {
      $$cookieWriter = _$$cookieWriter_;
    });
  });

  it('should use baseHref as default path', function() {
    $$cookieWriter('name', 'value');
    expect(getLastCookieAssignment('path')).toBe('/a/b');
  });

  it('should accept path option', function() {
    $$cookieWriter('name', 'value', {path: '/c/d'});
    expect(getLastCookieAssignment('path')).toBe('/c/d');
  });

  it('should accept domain option', function() {
    $$cookieWriter('name', 'value', {domain: '.example.com'});
    expect(getLastCookieAssignment('domain')).toBe('.example.com');
  });

  it('should accept secure option', function() {
    $$cookieWriter('name', 'value', {secure: true});
    expect(getLastCookieAssignment('secure')).toBe(true);
  });

  it('should accept expires option on set', function() {
    $$cookieWriter('name', 'value', {expires: 'Fri, 19 Dec 2014 00:00:00 GMT'});
    expect(getLastCookieAssignment('expires')).toMatch(/^Fri, 19 Dec 2014 00:00:00 (UTC|GMT)$/);
  });

  it('should always use epoch time as expire time on remove', function() {
    $$cookieWriter('name', undefined, {expires: 'Fri, 19 Dec 2014 00:00:00 GMT'});
    expect(getLastCookieAssignment('expires')).toMatch(/^Thu, 0?1 Jan 1970 00:00:00 (UTC|GMT)$/);
  });

  it('should accept date object as expires option', function() {
    $$cookieWriter('name', 'value', {expires: new Date(Date.UTC(1981, 11, 27))});
    expect(getLastCookieAssignment('expires')).toMatch(/^Sun, 27 Dec 1981 00:00:00 (UTC|GMT)$/);
  });

});
