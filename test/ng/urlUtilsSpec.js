'use strict';

describe('$$urlUtils', function() {
  describe('parse', function() {
    it('should normalize a relative url', inject(function($$urlUtils) {
      expect($$urlUtils.resolve("foo")).toMatch(/^https?:\/\/[^/]+\/foo$/);
    }));

    it('should parse relative URL into component pieces', inject(function($$urlUtils) {
      var parsed = $$urlUtils.resolve("foo", true);
      expect(parsed.href).toMatch(/https?:\/\//);
      expect(parsed.protocol).toMatch(/^https?:/);
      expect(parsed.host).not.toBe("");
      expect(parsed.hostname).not.toBe("");
      expect(parsed.pathname).not.toBe("");
    }));
  });

  describe('isSameOrigin', function() {
    it('should support various combinations of urls - both string and parsed', inject(function($$urlUtils, $document) {
      function expectIsSameOrigin(url, expectedValue) {
        expect($$urlUtils.isSameOrigin(url)).toBe(expectedValue);
        expect($$urlUtils.isSameOrigin($$urlUtils.resolve(url, true))).toBe(expectedValue);
      }
      expectIsSameOrigin('path', true);
      var origin = $$urlUtils.resolve($document[0].location.href, true);
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
