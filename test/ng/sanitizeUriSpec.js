/* jshint scripturl: true */
'use strict';

describe('sanitizeUri', function() {
  var sanitize, sanitizeUriProvider, testUrl;
  beforeEach(function() {
    module(function(_$$sanitizeUriProvider_) {
      sanitizeUriProvider = _$$sanitizeUriProvider_;
    });
    inject(function($$sanitizeUri) {
      sanitize = function(uri) {
        return $$sanitizeUri(uri);
      };
    });
  });

  function isEvilInCurrentBrowser(uri) {
    var a = document.createElement('a');
    a.setAttribute('href', uri);
    return a.href.substring(0, 4) !== 'http';
  }

  describe('URL-context sanitization', function() {

    it('should sanitize javascript: urls', function() {
      testUrl = "javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');
    });

    it('should sanitize javascript: urls with comments', function() {
      testUrl = "javascript:alert(1)//data:image/";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:alert(1)//data:image/');
    });

    it('should sanitize non-image data: urls', function() {
      testUrl = "data:application/javascript;charset=US-ASCII,alert('evil!');";
      expect(sanitize(testUrl)).toBe("unsafe:data:application/javascript;charset=US-ASCII,alert('evil!');");

      testUrl = "data:,foo";
      expect(sanitize(testUrl)).toBe("unsafe:data:,foo");
    });

    it('should sanitize obfuscated javascript: urls', function() {
      // case-sensitive
      testUrl = "JaVaScRiPt:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');

      // tab in protocol
      testUrl = "java\u0009script:doEvilStuff()";
      if (isEvilInCurrentBrowser(testUrl)) {
        expect(sanitize(testUrl)).toEqual('unsafe:javascript:doEvilStuff()');
      }

      // space before
      testUrl = " javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');

      // ws chars before
      testUrl = " \u000e javascript:doEvilStuff()";
      if (isEvilInCurrentBrowser(testUrl)) {
        expect(sanitize(testUrl)).toEqual('unsafe:javascript:doEvilStuff()');
      }

      // post-fixed with proper url
      testUrl = "javascript:doEvilStuff(); http://make.me/look/good";
      expect(sanitize(testUrl)).toBeOneOf(
        'unsafe:javascript:doEvilStuff(); http://make.me/look/good',
        'unsafe:javascript:doEvilStuff();%20http://make.me/look/good'
      );
    });

    it('should sanitize ng-src bindings as well', function() {
      testUrl = "javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');
    });


    it('should not sanitize valid urls', function() {
      testUrl = "foo/bar";
      expect(sanitize(testUrl)).toBe('foo/bar');

      testUrl = "/foo/bar";
      expect(sanitize(testUrl)).toBe('/foo/bar');

      testUrl = "../foo/bar";
      expect(sanitize(testUrl)).toBe('../foo/bar');

      testUrl = "#foo";
      expect(sanitize(testUrl)).toBe('#foo');

      testUrl = "http://foo.com/bar";
      expect(sanitize(testUrl)).toBe('http://foo.com/bar');

      testUrl = " http://foo.com/bar";
      expect(sanitize(testUrl)).toBe(' http://foo.com/bar');

      testUrl = "https://foo.com/bar";
      expect(sanitize(testUrl)).toBe('https://foo.com/bar');

      testUrl = "ftp://foo.com/bar";
      expect(sanitize(testUrl)).toBe('ftp://foo.com/bar');

      testUrl = "file:///foo/bar.html";
      expect(sanitize(testUrl)).toBe('file:///foo/bar.html');
    });

    it('should not sanitize blob urls', function() {
      testUrl = "blob:///foo/bar.html";
      expect(sanitize(testUrl)).toBe('blob:///foo/bar.html');
    });

    it('should not sanitize data: URIs for images', function() {
      // image data uri
      // ref: http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
      testUrl = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      expect(sanitize(testUrl)).toBe('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    });

    it('should allow reconfiguration of the src whitelist', function() {
      var returnVal;
      expect(sanitizeUriProvider.uriSanitizationWhitelist() instanceof RegExp).toBe(true);
      returnVal = sanitizeUriProvider.uriSanitizationWhitelist(/javascript:/);
      expect(returnVal).toBe(sanitizeUriProvider);

      testUrl = "javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('javascript:doEvilStuff()');

      testUrl = "http://recon/figured";
      expect(sanitize(testUrl)).toBe('unsafe:http://recon/figured');
    });

  });


  describe('a[href] sanitization', function() {

    it('should sanitize javascript: urls', inject(function() {
      testUrl = "javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');
    }));


    it('should sanitize data: urls', inject(function() {
      testUrl = "data:evilPayload";
      expect(sanitize(testUrl)).toBe('unsafe:data:evilPayload');
    }));


    it('should sanitize obfuscated javascript: urls', inject(function() {
      // case-sensitive
      testUrl = "JaVaScRiPt:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');

      // tab in protocol
      testUrl = "java\u0009script:doEvilStuff()";
      if (isEvilInCurrentBrowser(testUrl)) {
        expect(sanitize(testUrl)).toEqual('unsafe:javascript:doEvilStuff()');
      }

      // space before
      testUrl = " javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');

      // ws chars before
      testUrl = " \u000e javascript:doEvilStuff()";
      if (isEvilInCurrentBrowser(testUrl)) {
        expect(sanitize(testUrl)).toEqual('unsafe:javascript:doEvilStuff()');
      }

      // post-fixed with proper url
      testUrl = "javascript:doEvilStuff(); http://make.me/look/good";
      expect(sanitize(testUrl)).toBeOneOf(
        'unsafe:javascript:doEvilStuff(); http://make.me/look/good',
        'unsafe:javascript:doEvilStuff();%20http://make.me/look/good'
      );
    }));


    it('should sanitize ngHref bindings as well', inject(function() {
      testUrl = "javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('unsafe:javascript:doEvilStuff()');
    }));


    it('should not sanitize valid urls', inject(function() {
      testUrl = "foo/bar";
      expect(sanitize(testUrl)).toBe('foo/bar');

      testUrl = "/foo/bar";
      expect(sanitize(testUrl)).toBe('/foo/bar');

      testUrl = "../foo/bar";
      expect(sanitize(testUrl)).toBe('../foo/bar');

      testUrl = "#foo";
      expect(sanitize(testUrl)).toBe('#foo');

      testUrl = "http://foo/bar";
      expect(sanitize(testUrl)).toBe('http://foo/bar');

      testUrl = " http://foo/bar";
      expect(sanitize(testUrl)).toBe(' http://foo/bar');

      testUrl = "https://foo/bar";
      expect(sanitize(testUrl)).toBe('https://foo/bar');

      testUrl = "ftp://foo/bar";
      expect(sanitize(testUrl)).toBe('ftp://foo/bar');

      testUrl = "mailto:foo@bar.com";
      expect(sanitize(testUrl)).toBe('mailto:foo@bar.com');

      testUrl = "file:///foo/bar.html";
      expect(sanitize(testUrl)).toBe('file:///foo/bar.html');
    }));

    it('should allow reconfiguration of the href whitelist', function() {
      var returnVal;
      expect(sanitizeUriProvider.uriSanitizationWhitelist() instanceof RegExp).toBe(true);
      returnVal = sanitizeUriProvider.uriSanitizationWhitelist(/javascript:/);
      expect(returnVal).toBe(sanitizeUriProvider);

      testUrl = "javascript:doEvilStuff()";
      expect(sanitize(testUrl)).toBe('javascript:doEvilStuff()');

      testUrl = "http://recon/figured";
      expect(sanitize(testUrl)).toBe('unsafe:http://recon/figured');
    });

  });

});
