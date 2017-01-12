'use strict';

describe('urlUtils', function() {
  describe('urlResolve', function() {
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
      //IE counts / as empty, necessary to use / so that pathname is not context.html
      var parsed = urlResolve('/');
      expect(parsed.pathname).toBe('/');
    });
  });

  describe('isSameOrigin', function() {
    it('should support various combinations of urls - both string and parsed', inject(function($document) {
      function expectIsSameOrigin(url, expectedValue) {
        expect(urlIsSameOrigin(url)).toBe(expectedValue);
        expect(urlIsSameOrigin(urlResolve(url))).toBe(expectedValue);
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
    }));
  });
});
