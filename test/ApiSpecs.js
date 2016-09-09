'use strict';

describe('api', function() {

  describe('HashMap', function() {
    it('should do basic crud', function() {
      var map = new HashMap();
      var keys = [{}, {}, {}];
      var values = [{}, {}, {}];

      map.put(keys[0], values[1]);
      map.put(keys[0], values[0]);
      expect(map.get(keys[0])).toBe(values[0]);
      expect(map.get(keys[1])).toBeUndefined();

      map.put(keys[1], values[1]);
      map.put(keys[2], values[2]);
      expect(map.remove(keys[0])).toBe(values[0]);
      expect(map.remove(keys[0])).toBeUndefined();

      expect(map.get(keys[1])).toBe(values[1]);
      expect(map.get(keys[2])).toBe(values[2]);
    });

    it('should init from an array', function() {
      var map = new HashMap(['a', 'b']);
      expect(map.get('a')).toBe(0);
      expect(map.get('b')).toBe(1);
      expect(map.get('c')).toBeUndefined();
    });

    it('should init from an object', function() {
      var map = new HashMap({one: 'a', two: 'b'});
      expect(map.get('a')).toBe('one');
      expect(map.get('b')).toBe('two');
      expect(map.get('c')).toBeUndefined();
    });
  });
});

