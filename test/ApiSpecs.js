'use strict';

describe('api', function(){

  describe('HashMap', function(){
    it('should do basic crud', function(){
      var map = new HashMap();
      var key = {};
      var value1 = {};
      var value2 = {};
      expect(map.put(key, value1)).toEqual(undefined);
      expect(map.put(key, value2)).toEqual(value1);
      expect(map.get(key)).toEqual(value2);
      expect(map.get({})).toEqual(undefined);
      expect(map.remove(key)).toEqual(value2);
      expect(map.get(key)).toEqual(undefined);
    });
  });


  describe('Object', function(){

    it('should return type of', function(){
      assertEquals("undefined", angular.Object.typeOf(undefined));
      assertEquals("null", angular.Object.typeOf(null));
      assertEquals("object", angular.Collection.typeOf({}));
      assertEquals("array", angular.Array.typeOf([]));
      assertEquals("string", angular.Object.typeOf(""));
      assertEquals("date", angular.Object.typeOf(new Date()));
      assertEquals("element", angular.Object.typeOf(document.body));
      assertEquals($function, angular.Object.typeOf(function(){}));
    });

    it('should extend object', function(){
      assertEquals({a:1, b:2}, angular.Object.extend({a:1}, {b:2}));
    });

  });


  it('should return size', function(){
    assertEquals(0, angular.Collection.size({}));
    assertEquals(1, angular.Collection.size({a:"b"}));
    assertEquals(0, angular.Object.size({}));
    assertEquals(1, angular.Array.size([0]));
  });

  describe('Array', function(){

    describe('sum', function(){

      it('should sum', function(){
        assertEquals(3, angular.Array.sum([{a:"1"}, {a:"2"}], 'a'));
      });

      it('should sum containing NaN', function(){
        assertEquals(1, angular.Array.sum([{a:1}, {a:Number.NaN}], 'a'));
        assertEquals(1, angular.Array.sum([{a:1}, {a:Number.NaN}], function($){return $.a;}));
      });

    });

    it('should find indexOf', function(){
      assertEquals(angular.Array.indexOf(['a'], 'a'), 0);
      assertEquals(angular.Array.indexOf(['a', 'b'], 'a'), 0);
      assertEquals(angular.Array.indexOf(['b', 'a'], 'a'), 1);
      assertEquals(angular.Array.indexOf(['b', 'b'],'x'), -1);
    });

    it('should remove item from array', function(){
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

    describe('filter', function(){

      it('should filter by string', function() {
        var items = ["MIsKO", {name:"shyam"}, ["adam"], 1234];
        assertEquals(4, angular.Array.filter(items, "").length);
        assertEquals(4, angular.Array.filter(items, undefined).length);

        assertEquals(1, angular.Array.filter(items, 'iSk').length);
        assertEquals("MIsKO", angular.Array.filter(items, 'isk')[0]);

        assertEquals(1, angular.Array.filter(items, 'yam').length);
        assertEquals(items[1], angular.Array.filter(items, 'yam')[0]);

        assertEquals(1, angular.Array.filter(items, 'da').length);
        assertEquals(items[2], angular.Array.filter(items, 'da')[0]);

        assertEquals(1, angular.Array.filter(items, '34').length);
        assertEquals(1234, angular.Array.filter(items, '34')[0]);

        assertEquals(0, angular.Array.filter(items, "I don't exist").length);
      });

      it('should not read $ properties', function() {
        assertEquals("", "".charAt(0)); // assumption
        var items = [{$name:"misko"}];
        assertEquals(0, angular.Array.filter(items, "misko").length);
      });

      it('should filter on specific property', function(){
        var items = [{ignore:"a", name:"a"}, {ignore:"a", name:"abc"}];
        assertEquals(2, angular.Array.filter(items, {}).length);

        assertEquals(2, angular.Array.filter(items, {name:'a'}).length);

        assertEquals(1, angular.Array.filter(items, {name:'b'}).length);
        assertEquals("abc", angular.Array.filter(items, {name:'b'})[0].name);
      });

      it('should take function as predicate', function(){
        var items = [{name:"a"}, {name:"abc", done:true}];
        assertEquals(1, angular.Array.filter(items, function(i){return i.done;}).length);
      });

      it('should take object as perdicate', function(){
        var items = [{first:"misko", last:"hevery"},
                     {first:"adam", last:"abrons"}];

        assertEquals(2, angular.Array.filter(items, {first:'', last:''}).length);
        assertEquals(1, angular.Array.filter(items, {first:'', last:'hevery'}).length);
        assertEquals(0, angular.Array.filter(items, {first:'adam', last:'hevery'}).length);
        assertEquals(1, angular.Array.filter(items, {first:'misko', last:'hevery'}).length);
        assertEquals(items[0], angular.Array.filter(items, {first:'misko', last:'hevery'})[0]);
      });

      it('should support negation operator', function(){
        var items = ["misko", "adam"];

        assertEquals(1, angular.Array.filter(items, '!isk').length);
        assertEquals(items[1], angular.Array.filter(items, '!isk')[0]);
      });
    });


    describe('limit', function() {
      var items;

      beforeEach(function() {
        items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      });


      it('should return the first X items when X is positive', function() {
        expect(angular.Array.limitTo(items, 3)).toEqual(['a', 'b', 'c']);
        expect(angular.Array.limitTo(items, '3')).toEqual(['a', 'b', 'c']);
      });


      it('should return the last X items when X is negative', function() {
        expect(angular.Array.limitTo(items, -3)).toEqual(['f', 'g', 'h']);
        expect(angular.Array.limitTo(items, '-3')).toEqual(['f', 'g', 'h']);
      });


      it('should return an empty array when X cannot be parsed', function() {
        expect(angular.Array.limitTo(items, 'bogus')).toEqual([]);
        expect(angular.Array.limitTo(items, 'null')).toEqual([]);
        expect(angular.Array.limitTo(items, 'undefined')).toEqual([]);
        expect(angular.Array.limitTo(items, null)).toEqual([]);
        expect(angular.Array.limitTo(items, undefined)).toEqual([]);
      });
    });


    it('add', function(){
      var add = angular.Array.add;
      assertJsonEquals([{}, "a"], add(add([]),"a"));
    });

    it('count', function(){
      var array = [{name:'a'},{name:'b'},{name:''}];
      var obj = {};

      assertEquals(3, angular.Array.count(array));
      assertEquals(2, angular.Array.count(array, 'name'));
      assertEquals(1, angular.Array.count(array, 'name=="a"'));
    });

    describe('orderBy', function(){
      var orderBy;
      beforeEach(function(){
        orderBy = angular.Array.orderBy;
      });

      it('should return same array if predicate is falsy', function(){
        var array = [1, 2, 3];
        expect(orderBy(array)).toBe(array);
      });

      it('shouldSortArrayInReverse', function(){
        assertJsonEquals([{a:15},{a:2}], angular.Array.orderBy([{a:15},{a:2}], 'a', true));
        assertJsonEquals([{a:15},{a:2}], angular.Array.orderBy([{a:15},{a:2}], 'a', "T"));
        assertJsonEquals([{a:15},{a:2}], angular.Array.orderBy([{a:15},{a:2}], 'a', "reverse"));
      });

      it('should sort array by predicate', function(){
        assertJsonEquals([{a:2, b:1},{a:15, b:1}],
            angular.Array.orderBy([{a:15, b:1},{a:2, b:1}], ['a', 'b']));
        assertJsonEquals([{a:2, b:1},{a:15, b:1}],
            angular.Array.orderBy([{a:15, b:1},{a:2, b:1}], ['b', 'a']));
        assertJsonEquals([{a:15, b:1},{a:2, b:1}],
            angular.Array.orderBy([{a:15, b:1},{a:2, b:1}], ['+b', '-a']));
      });

      it('should use function', function(){
        expect(
          orderBy(
            [{a:15, b:1},{a:2, b:1}],
            function(value){ return value.a; })).
        toEqual([{a:2, b:1},{a:15, b:1}]);
      });

    });

  });

  describe('string', function(){

    it('should quote', function(){
      assertEquals(angular.String.quote('a'), '"a"');
      assertEquals(angular.String.quote('\\'), '"\\\\"');
      assertEquals(angular.String.quote("'a'"), '"\'a\'"');
      assertEquals(angular.String.quote('"a"'), '"\\"a\\""');
      assertEquals(angular.String.quote('\n\f\r\t'), '"\\n\\f\\r\\t"');
    });

    it('should quote slashes', function(){
      assertEquals('"7\\\\\\\"7"', angular.String.quote("7\\\"7"));
    });

    it('should quote unicode', function(){
      assertEquals('"abc\\u00a0def"', angular.String.quoteUnicode('abc\u00A0def'));
    });

    it('should read/write to date', function(){
      var date = new Date("Sep 10 2003 13:02:03 GMT");
      assertEquals("date", angular.Object.typeOf(date));
      assertEquals("2003-09-10T13:02:03.000Z", angular.Date.toString(date));
      assertEquals(date.getTime(), angular.String.toDate(angular.Date.toString(date)).getTime());
    });

    it('should convert to date', function(){
      //full ISO8061
      expect(angular.String.toDate("2003-09-10T13:02:03.000Z")).
        toEqual(new Date("Sep 10 2003 13:02:03 GMT"));

      //no millis
      expect(angular.String.toDate("2003-09-10T13:02:03Z")).
        toEqual(new Date("Sep 10 2003 13:02:03 GMT"));

      //no seconds
      expect(angular.String.toDate("2003-09-10T13:02Z")).
        toEqual(new Date("Sep 10 2003 13:02:00 GMT"));

      //no minutes
      expect(angular.String.toDate("2003-09-10T13Z")).
        toEqual(new Date("Sep 10 2003 13:00:00 GMT"));

      //no time
      expect(angular.String.toDate("2003-09-10")).
        toEqual(new Date("Sep 10 2003 00:00:00 GMT"));
    });

    it('should parse date', function(){
      var date = angular.String.toDate("2003-09-10T13:02:03.000Z");
      assertEquals("date", angular.Object.typeOf(date));
      assertEquals("2003-09-10T13:02:03.000Z", angular.Date.toString(date));
      assertEquals("str", angular.String.toDate("str"));
    });

  });

});

