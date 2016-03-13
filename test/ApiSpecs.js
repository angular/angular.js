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
      expect(map.get({})).toBeUndefined();
      expect(map.remove(key)).toBe(value2);
      expect(map.get(key)).toBeUndefined();
    });

    it('should init from an array', function() {
      var map = new HashMap(['a','b']);
      expect(map.get('a')).toBe(0);
      expect(map.get('b')).toBe(1);
      expect(map.get('c')).toBeUndefined();
    });

    it('should maintain hashKey for object keys', function() {
      var map = new HashMap();
      var key = {};
      map.get(key);
      expect(key.$$hashKey).toBeDefined();
    });

    it('should maintain hashKey for function keys', function() {
      var map = new HashMap();
      var key = function() {};
      map.get(key);
      expect(key.$$hashKey).toBeDefined();
    });

    it('should share hashKey between HashMap by default', function() {
      var map1 = new HashMap(), map2 = new HashMap();
      var key1 = {}, key2 = {};
      map1.get(key1);
      map2.get(key2);
      expect(key1.$$hashKey).not.toEqual(key2.$$hashKey);
    });

    it('should maintain hashKey per HashMap if flag is passed', function() {
      var map1 = new HashMap([], true), map2 = new HashMap([], true);
      var key1 = {}, key2 = {};
      map1.get(key1);
      map2.get(key2);
      expect(key1.$$hashKey).toEqual(key2.$$hashKey);
    });
  });
});

