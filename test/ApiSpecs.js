'use strict';

describe('api', function() {

  describe('NgMapShim', function() {
    it('should do basic crud', function() {
      var map = new NgMapShim();
      var keys = [{}, {}, {}];
      var values = [{}, {}, {}];

      map.set(keys[0], values[1]);
      map.set(keys[0], values[0]);
      expect(map.get(keys[0])).toBe(values[0]);
      expect(map.get(keys[1])).toBeUndefined();

      map.set(keys[1], values[1]);
      map.set(keys[2], values[2]);
      expect(map.delete(keys[0])).toBe(true);
      expect(map.delete(keys[0])).toBe(false);

      expect(map.get(keys[0])).toBeUndefined();
      expect(map.get(keys[1])).toBe(values[1]);
      expect(map.get(keys[2])).toBe(values[2]);
    });

    it('should be able to deal with `NaN` keys', function() {
      var map = new NgMapShim();

      map.set('NaN', 'foo');
      map.set(NaN, 'bar');
      map.set(NaN, 'baz');

      expect(map.get('NaN')).toBe('foo');
      expect(map.get(NaN)).toBe('baz');

      expect(map.delete(NaN)).toBe(true);
      expect(map.get(NaN)).toBeUndefined();
      expect(map.get('NaN')).toBe('foo');

      expect(map.delete(NaN)).toBe(false);
    });
  });
});

