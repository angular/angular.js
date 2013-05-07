'use strict';

describe('api', function() {

  describe('HashMap', function() {
    it('should do basic crud', function() {
      var map = new HashMap();
      var key = {};
      var value1 = {};
      var value2 = {};
      map.put(key, value1);
      map.put(key, value2);
      expect(map.get(key)).toBe(value2);
      expect(map.get({})).toBe(undefined);
      expect(map.remove(key)).toBe(value2);
      expect(map.get(key)).toBe(undefined);
    });

    it('should init from an array', function() {
      var map = new HashMap(['a','b']);
      expect(map.get('a')).toBe(0);
      expect(map.get('b')).toBe(1);
      expect(map.get('c')).toBe(undefined);
    });
  });
});

