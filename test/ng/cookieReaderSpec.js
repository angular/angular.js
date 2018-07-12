'use strict';

describe('$$cookieReader', function() {
  var $$cookieReader, document;


  describe('with access to `document.cookie`', function() {

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

      inject(function(_$$cookieReader_) {
        $$cookieReader = _$$cookieReader_;
      });
    });

    afterEach(function() {
      deleteAllCookies();
      expect(document.cookie).toEqual('');
    });


    describe('get via $$cookieReader()[cookieName]', function() {

      it('should return undefined for nonexistent cookie', function() {
        expect($$cookieReader().nonexistent).not.toBeDefined();
      });


      it('should return a value for an existing cookie', function() {
        document.cookie = 'foo=bar=baz;path=/';
        expect($$cookieReader().foo).toEqual('bar=baz');
      });


      it('should return the the first value provided for a cookie', function() {
        // For a cookie that has different values that differ by path, the
        // value for the most specific path appears first.  $$cookieReader()
        // should provide that value for the cookie.
        document.cookie = 'foo="first"; foo="second"';
        expect($$cookieReader()['foo']).toBe('"first"');
      });


      it('should decode cookie values that were encoded by puts', function() {
        document.cookie = 'cookie2%3Dbar%3Bbaz=val%3Due;path=/';
        expect($$cookieReader()['cookie2=bar;baz']).toEqual('val=ue');
      });


      it('should preserve leading & trailing spaces in names and values', function() {
        document.cookie = '%20cookie%20name%20=%20cookie%20value%20';
        expect($$cookieReader()[' cookie name ']).toEqual(' cookie value ');
        expect($$cookieReader()['cookie name']).not.toBeDefined();
      });


      it('should decode special characters in cookie values', function() {
        document.cookie = 'cookie_name=cookie_value_%E2%82%AC';
        expect($$cookieReader()['cookie_name']).toEqual('cookie_value_€');
      });


      it('should not decode cookie values that do not appear to be encoded', function() {
        // see #9211 - sometimes cookies contain a value that causes decodeURIComponent to throw
        document.cookie = 'cookie_name=cookie_value_%XX';
        expect($$cookieReader()['cookie_name']).toEqual('cookie_value_%XX');
      });

    });


    describe('getAll via $$cookieReader()', function() {

      it('should return cookies as hash', function() {
        document.cookie = 'foo1=bar1;path=/';
        document.cookie = 'foo2=bar2;path=/';
        expect($$cookieReader()).toEqual({'foo1':'bar1', 'foo2':'bar2'});
      });


      it('should return empty hash if no cookies exist', function() {
        expect($$cookieReader()).toEqual({});
      });

    });


    it('should initialize cookie cache with existing cookies', function() {
      document.cookie = 'existingCookie=existingValue;path=/';
      expect($$cookieReader()).toEqual({'existingCookie':'existingValue'});
    });

  });


  describe('without access to `document.cookie`', function() {
    var cookieSpy;

    beforeEach(module(function($provide) {
      cookieSpy = jasmine.createSpy('cookie').and.throwError('Can\'t touch this!');
      document = Object.create({}, {'cookie': {get: cookieSpy}});

      $provide.value('$document', [document]);
    }));

    beforeEach(inject(function(_$$cookieReader_) {
      $$cookieReader = _$$cookieReader_;
    }));


    it('should return an empty object', function() {
      expect($$cookieReader()).toEqual({});
      expect(cookieSpy).toHaveBeenCalled();
    });

  });

});
