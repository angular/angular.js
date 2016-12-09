'use strict';

describe('api', function() {
  describe('hashKey()', function() {
    it('should use an existing `$$hashKey`', function() {
      var obj = {$$hashKey: 'foo'};
      expect(hashKey(obj)).toBe('foo');
    });

    it('should support a function as `$$hashKey` (and call it)', function() {
      var obj = {$$hashKey: valueFn('foo')};
      expect(hashKey(obj)).toBe('foo');
    });

    it('should create a new `$$hashKey` if none exists (and return it)', function() {
      var obj = {};
      expect(hashKey(obj)).toBe(obj.$$hashKey);
      expect(obj.$$hashKey).toBeDefined();
    });

    it('should create appropriate `$$hashKey`s for primitive values', function() {
      expect(hashKey(undefined)).toBe(hashKey(undefined));
      expect(hashKey(null)).toBe(hashKey(null));
      expect(hashKey(null)).not.toBe(hashKey(undefined));
      expect(hashKey(true)).toBe(hashKey(true));
      expect(hashKey(false)).toBe(hashKey(false));
      expect(hashKey(false)).not.toBe(hashKey(true));
      expect(hashKey(42)).toBe(hashKey(42));
      expect(hashKey(1337)).toBe(hashKey(1337));
      expect(hashKey(1337)).not.toBe(hashKey(42));
      expect(hashKey('foo')).toBe(hashKey('foo'));
      expect(hashKey('foo')).not.toBe(hashKey('bar'));
    });

    it('should create appropriate `$$hashKey`s for non-primitive values', function() {
      var fn = function() {};
      var arr = [];
      var obj = {};
      var date = new Date();

      expect(hashKey(fn)).toBe(hashKey(fn));
      expect(hashKey(fn)).not.toBe(hashKey(function() {}));
      expect(hashKey(arr)).toBe(hashKey(arr));
      expect(hashKey(arr)).not.toBe(hashKey([]));
      expect(hashKey(obj)).toBe(hashKey(obj));
      expect(hashKey(obj)).not.toBe(hashKey({}));
      expect(hashKey(date)).toBe(hashKey(date));
      expect(hashKey(date)).not.toBe(hashKey(new Date()));
    });

    it('should support a custom `nextUidFn`', function() {
      var nextUidFn = jasmine.createSpy('nextUidFn').and.returnValues('foo', 'bar', 'baz', 'qux');

      var fn = function() {};
      var arr = [];
      var obj = {};
      var date = new Date();

      hashKey(fn, nextUidFn);
      hashKey(arr, nextUidFn);
      hashKey(obj, nextUidFn);
      hashKey(date, nextUidFn);

      expect(fn.$$hashKey).toBe('function:foo');
      expect(arr.$$hashKey).toBe('object:bar');
      expect(obj.$$hashKey).toBe('object:baz');
      expect(date.$$hashKey).toBe('object:qux');
    });
  });

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

