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
  });


  describe('Object', function() {
    it('should return type of', function() {
      assertEquals("undefined", angular.Object.typeOf(undefined));
      assertEquals("null", angular.Object.typeOf(null));
      assertEquals("object", angular.Collection.typeOf({}));
      assertEquals("array", angular.Array.typeOf([]));
      assertEquals("string", angular.Object.typeOf(""));
      assertEquals("date", angular.Object.typeOf(new Date()));
      assertEquals("element", angular.Object.typeOf(document.body));
      assertEquals('function', angular.Object.typeOf(function() {}));
    });

    it('should extend object', function() {
      assertEquals({a:1, b:2}, angular.Object.extend({a:1}, {b:2}));
    });
  });


  it('should return size', function() {
    assertEquals(0, angular.Collection.size({}));
    assertEquals(1, angular.Collection.size({a:"b"}));
    assertEquals(0, angular.Object.size({}));
    assertEquals(1, angular.Array.size([0]));
  });


  describe('Array', function() {

    describe('sum', function() {
      it('should sum', function() {
        assertEquals(3, angular.Array.sum([{a:"1"}, {a:"2"}], 'a'));
      });

      it('should sum containing NaN', function() {
        assertEquals(1, angular.Array.sum([{a:1}, {a:Number.NaN}], 'a'));
        assertEquals(1, angular.Array.sum([{a:1}, {a:Number.NaN}], function($) {return $.a;}));
      });
    });


    it('should find indexOf', function() {
      assertEquals(angular.Array.indexOf(['a'], 'a'), 0);
      assertEquals(angular.Array.indexOf(['a', 'b'], 'a'), 0);
      assertEquals(angular.Array.indexOf(['b', 'a'], 'a'), 1);
      assertEquals(angular.Array.indexOf(['b', 'b'],'x'), -1);
    });

    it('should remove item from array', function() {
      var items = ['a', 'b', 'c'];
      assertEquals(angular.Array.remove(items, 'q'), 'q');
      assertEquals(items.length, 3);

      assertEquals(angular.Array.remove(items, 'b'), 'b');
      assertEquals(items.length, 2);

      assertEquals(angular.Array.remove(items, 'a'), 'a');
      assertEquals(items.length, 1);

      assertEquals(angular.Array.remove(items, 'c'), 'c');
      assertEquals(items.length, 0);

      assertEquals(angular.Array.remove(items, 'q'), 'q');
      assertEquals(items.length, 0);
    });



    it('add', function() {
      var add = angular.Array.add;
      assertJsonEquals([{}, "a"], add(add([]),"a"));
    });

    it('count', function() {
      var array = [{name:'a'},{name:'b'},{name:''}];
      var obj = {};

      assertEquals(3, angular.Array.count(array));
      assertEquals(2, angular.Array.count(array, 'name'));
      assertEquals(1, angular.Array.count(array, 'name=="a"'));
    });



  });

});

