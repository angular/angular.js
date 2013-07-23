'use strict';

describe('$urlUtils', function() {
  describe('parse', function() {
    it('should normalize a relative url', inject(function($urlUtils) {
      expect($urlUtils.resolve("foo")).toMatch(/^https?:\/\/[^/]+\/foo$/);
    }));

    it('should parse relative URL into component pieces', inject(function($urlUtils) {
      var parsed = $urlUtils.resolve("foo", true);
      expect(parsed.href).toMatch(/https?:\/\//);
      expect(parsed.protocol).toMatch(/^https?:/);
      expect(parsed.host).not.toBe("");
    }));

    it('should parse relative URL into component pieces and modify the protocol', inject(function($urlUtils) {
      var parsed = $urlUtils.resolve("foo", function(urlUtils) {
        urlUtils.protocol = urlUtils.protocol === 'https:' ? 'wss:' : 'ws:';
      });
      expect(parsed.href).toMatch(/wss?:\/\//);
      expect(parsed.protocol).toMatch(/^wss?:/);
    }));
  });

  describe('isSameOrigin', function() {
    it('should support various combinations of urls', inject(function($urlUtils, $document) {
      expect($urlUtils.isSameOrigin('path')).toBe(true);
      var origin = $urlUtils.resolve($document[0].location.href, true);
      expect($urlUtils.isSameOrigin('//' + origin.host + '/path')).toBe(true);
      // Different domain.
      expect($urlUtils.isSameOrigin('http://example.com/path')).toBe(false);
      // Auto fill protocol.
      expect($urlUtils.isSameOrigin('//example.com/path')).toBe(false);
      // Should not match when the ports are different.
      // This assumes that the test is *not* running on port 22 (very unlikely).
      expect($urlUtils.isSameOrigin('//' + origin.hostname + ':22/path')).toBe(false);
    }));
  });
});
