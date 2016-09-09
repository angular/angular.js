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

