'use strict';

describe('urlUtils', function() {
  describe('urlResolve', function() {
    it('should returned already parsed URLs unchanged', function() {
      var urlObj = urlResolve('/foo?bar=baz#qux');
      expect(urlResolve(urlObj)).toBe(urlObj);
      expect(urlResolve(true)).toBe(true);
      expect(urlResolve(null)).toBeNull();
      expect(urlResolve(undefined)).toBeUndefined();
    });


    it('should normalize a relative url', function() {
      expect(urlResolve('foo').href).toMatch(/^https?:\/\/[^/]+\/foo$/);
    });


    it('should parse relative URL into component pieces', function() {
      var parsed = urlResolve('foo');
      expect(parsed.href).toMatch(/https?:\/\//);
      expect(parsed.protocol).toMatch(/^https?/);
      expect(parsed.host).not.toBe('');
      expect(parsed.hostname).not.toBe('');
      expect(parsed.pathname).not.toBe('');
    });


    it('should return pathname as / if empty path provided', function() {
      // IE (all versions) counts / as empty, necessary to use / so that pathname is not context.html
      var parsed = urlResolve('/');
      expect(parsed.pathname).toBe('/');
    });

    it('should return an IPv6 hostname wrapped in brackets', function() {
      // Support: IE 9-11 only, Edge 16-17 only (fixed in 18 Preview)
      // IE/Edge don't wrap IPv6 addresses' hostnames in square brackets
      // when parsed out of an anchor element.
      var parsed = urlResolve('http://[::1]/');
      expect(parsed.hostname).toBe('[::1]');
    });

    it('should not put the domain in brackets for the hostname field', function() {
      var parsed = urlResolve('https://google.com/');
      expect(parsed.hostname).toBe('google.com');
    });
  });


  describe('urlIsSameOrigin and urlIsSameOriginAsBaseUrl', function() {
    it('should support various combinations of urls - both string and parsed',
      inject(function($document) {
        function expectIsSameOrigin(url, expectedValue) {
          expect(urlIsSameOrigin(url)).toBe(expectedValue);
          expect(urlIsSameOrigin(urlResolve(url))).toBe(expectedValue);

          // urlIsSameOriginAsBaseUrl() should behave the same as urlIsSameOrigin() by default.
          // Behavior when there is a non-default base URL or when the base URL changes dynamically
          // is tested in the end-to-end tests in e2e/tests/base-tag.spec.js.
          expect(urlIsSameOriginAsBaseUrl(url)).toBe(expectedValue);
          expect(urlIsSameOriginAsBaseUrl(urlResolve(url))).toBe(expectedValue);
        }

        expectIsSameOrigin('path', true);

        var origin = urlResolve($document[0].location.href);
        expectIsSameOrigin('//' + origin.host + '/path', true);

        // Different domain.
        expectIsSameOrigin('http://example.com/path', false);

        // Auto fill protocol.
        expectIsSameOrigin('//example.com/path', false);

        // Should not match when the ports are different.
        // This assumes that the test is *not* running on port 22 (very unlikely).
        expectIsSameOrigin('//' + origin.hostname + ':22/path', false);
      })
    );
  });


  describe('urlIsAllowedOriginFactory', function() {
    var origin = urlResolve(window.location.href);
    var urlIsAllowedOrigin;

    beforeEach(function() {
      urlIsAllowedOrigin = urlIsAllowedOriginFactory([
        'https://foo.com/',
        origin.protocol + '://bar.com:1337/'
      ]);
    });


    it('should implicitly allow the current origin', function() {
      expect(urlIsAllowedOrigin('path')).toBe(true);
    });


    it('should check against the list of trusted origins', function() {
      expect(urlIsAllowedOrigin('https://foo.com/path')).toBe(true);
      expect(urlIsAllowedOrigin(origin.protocol + '://bar.com:1337/path')).toBe(true);
      expect(urlIsAllowedOrigin('https://baz.com:1337/path')).toBe(false);
      expect(urlIsAllowedOrigin('https://qux.com/path')).toBe(false);
    });


    it('should support both strings and parsed URL objects', function() {
      expect(urlIsAllowedOrigin('path')).toBe(true);
      expect(urlIsAllowedOrigin(urlResolve('path'))).toBe(true);
      expect(urlIsAllowedOrigin('https://foo.com/path')).toBe(true);
      expect(urlIsAllowedOrigin(urlResolve('https://foo.com/path'))).toBe(true);
    });


    it('should return true only if the origins (protocol, hostname, post) match', function() {
      var differentProtocol = (origin.protocol !== 'http') ? 'http' : 'https';
      var differentPort = (parseInt(origin.port, 10) || 0) + 1;
      var url;


      // Relative path
      url = 'path';
      expect(urlIsAllowedOrigin(url)).toBe(true);


      // Same origin
      url = origin.protocol + '://' + origin.host + '/path';
      expect(urlIsAllowedOrigin(url)).toBe(true);

      // Same origin - implicit protocol
      url = '//' + origin.host + '/path';
      expect(urlIsAllowedOrigin(url)).toBe(true);

      // Same origin - different protocol
      url = differentProtocol + '://' + origin.host + '/path';
      expect(urlIsAllowedOrigin(url)).toBe(false);

      // Same origin - different port
      url = origin.protocol + '://' + origin.hostname + ':' + differentPort + '/path';
      expect(urlIsAllowedOrigin(url)).toBe(false);


      // Allowed origin
      url = origin.protocol + '://bar.com:1337/path';
      expect(urlIsAllowedOrigin(url)).toBe(true);

      // Allowed origin - implicit protocol
      url = '//bar.com:1337/path';
      expect(urlIsAllowedOrigin(url)).toBe(true);

      // Allowed origin - different protocol
      url = differentProtocol + '://bar.com:1337/path';
      expect(urlIsAllowedOrigin(url)).toBe(false);

      // Allowed origin - different port
      url = origin.protocol + '://bar.com:1338/path';
      expect(urlIsAllowedOrigin(url)).toBe(false);
    });
  });
});
