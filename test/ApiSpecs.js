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


  describe('HashQueueMap', function() {
    it('should do basic crud with collections', function() {
      var map = new HashQueueMap();
      map.push('key', 'a');
      map.push('key', 'b');
      expect(map[hashKey('key')]).toEqual(['a', 'b']);
      expect(map.shift('key')).toEqual('a');
      expect(map.shift('key')).toEqual('b');
      expect(map.shift('key')).toEqual(undefined);
      expect(map[hashKey('key')]).toEqual(undefined);
    });

    it('should support primitive and object keys', function() {
      var obj1 = {},
          obj2 = {};

      var map = new HashQueueMap();
      map.push(obj1, 'a1');
      map.push(obj1, 'a2');
      map.push(obj2, 'b');
      map.push(1, 'c');
      map.push(undefined, 'd');
      map.push(null, 'e');

      expect(map[hashKey(obj1)]).toEqual(['a1', 'a2']);
      expect(map[hashKey(obj2)]).toEqual(['b']);
      expect(map[hashKey(1)]).toEqual(['c']);
      expect(map[hashKey(undefined)]).toEqual(['d']);
      expect(map[hashKey(null)]).toEqual(['e']);
    });
  });
});

