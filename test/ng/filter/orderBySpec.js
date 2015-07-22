'use strict';

describe('Filter: orderBy', function() {
  var orderBy, orderByFilter;
  beforeEach(inject(function($filter) {
    orderBy = orderByFilter = $filter('orderBy');
  }));


  describe('(Arrays)', function() {
    it('should return sorted array if predicate is not provided', function() {
      expect(orderBy([2, 1, 3])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [])).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [''])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '+')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], ['+'])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '-')).toEqual([3, 2, 1]);
      expect(orderBy([2, 1, 3], ['-'])).toEqual([3, 2, 1]);
    });


    it('should reverse collection if `reverseOrder` param is truthy', function() {
      expect(orderBy([{a:15}, {a:2}], 'a', true)).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "T")).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "reverse")).toEqualData([{a:15}, {a:2}]);
    });


    it('should sort inherited from array', function() {
      function BaseCollection() {}
      BaseCollection.prototype = Array.prototype;
      var child = new BaseCollection();
      child.push({a:2});
      child.push({a:15});

      expect(Array.isArray(child)).toBe(false);
      expect(child instanceof Array).toBe(true);

      expect(orderBy(child, 'a', true)).toEqualData([{a:15}, {a:2}]);
    });


    it('should sort array by predicate', function() {
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['a', 'b'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['b', 'a'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['+b', '-a'])).toEqualData([{a:15, b:1}, {a:2, b:1}]);
    });


    it('should sort array by date predicate', function() {
      // same dates
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 }]);

      // one different date
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 }]);
    });

    it('should compare timestamps when sorting dates', function() {
      expect(orderBy([
        new Date('01/01/2015'),
        new Date('01/01/2014')
      ])).toEqualData([
        new Date('01/01/2014'),
        new Date('01/01/2015')
      ]);
    });


    it('should use function', function() {
      expect(
        orderBy(
          [{a:15, b:1},{a:2, b:1}],
          function(value) { return value.a; })).
      toEqual([{a:2, b:1},{a:15, b:1}]);
    });


    it('should support string predicates with names containing non-identifier characters', function() {
      /*jshint -W008 */
      expect(orderBy([{"Tip %": .25}, {"Tip %": .15}, {"Tip %": .40}], '"Tip %"'))
        .toEqualData([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}]);
      expect(orderBy([{"원": 76000}, {"원": 31000}, {"원": 156000}], '"원"'))
        .toEqualData([{"원": 31000}, {"원": 76000}, {"원": 156000}]);
    });


    it('should throw if quoted string predicate is quoted incorrectly', function() {
      /*jshint -W008 */
      expect(function() {
        return orderBy([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}], '"Tip %\'');
      }).toThrow();
    });


    it('should not reverse array of objects with no predicate and reverse is not `true`', function() {
      var array = [
        { id: 2 },
        { id: 1 },
        { id: 4 },
        { id: 3 }
      ];
      expect(orderBy(array)).toEqualData(array);
    });

    it('should reverse array of objects with no predicate and reverse is `true`', function() {
      var array = [
        { id: 2 },
        { id: 1 },
        { id: 4 },
        { id: 3 }
      ];
      var reversedArray = [
        { id: 3 },
        { id: 4 },
        { id: 1 },
        { id: 2 }
      ];
      expect(orderBy(array, '', true)).toEqualData(reversedArray);
    });


    it('should reverse array of objects with predicate of "-"', function() {
      var array = [
        { id: 2 },
        { id: 1 },
        { id: 4 },
        { id: 3 }
      ];
      var reversedArray = [
        { id: 3 },
        { id: 4 },
        { id: 1 },
        { id: 2 }
      ];
      expect(orderBy(array, '-')).toEqualData(reversedArray);
    });


    it('should not reverse array of objects with null prototype and no predicate', function() {
      var array = [2,1,4,3].map(function(id) {
        var obj = Object.create(null);
        obj.id = id;
        return obj;
      });
      expect(orderBy(array)).toEqualData(array);
    });


    it('should sort nulls as Array.prototype.sort', function() {
      var array = [
        { id: 2 },
        null,
        { id: 3 },
        null
      ];
      expect(orderBy(array)).toEqualData([
        { id: 2 },
        { id: 3 },
        null,
        null
      ]);
    });


    it('should sort array of arrays as Array.prototype.sort', function() {
      expect(orderBy([['one'], ['two'], ['three']])).toEqualData([['one'], ['three'], ['two']]);
    });


    it('should sort mixed array of objects and values in a stable way', function() {
      expect(orderBy([{foo: 2}, {foo: {}}, {foo: 3}, {foo: 4}], 'foo')).toEqualData([{foo: 2}, {foo: 3}, {foo: 4}, {foo: {}}]);
    });


    it('should perform a stable sort', function() {
      expect(orderBy([
          {foo: 2, bar: 1}, {foo: 1, bar: 2}, {foo: 2, bar: 3},
          {foo: 2, bar: 4}, {foo: 1, bar: 5}, {foo: 2, bar: 6},
          {foo: 2, bar: 7}, {foo: 1, bar: 8}, {foo: 2, bar: 9},
          {foo: 1, bar: 10}, {foo: 2, bar: 11}, {foo: 1, bar: 12}
        ], 'foo'))
          .toEqualData([
          {foo: 1, bar: 2}, {foo: 1, bar: 5}, {foo: 1, bar: 8},
          {foo: 1, bar: 10}, {foo: 1, bar: 12}, {foo: 2, bar: 1},
          {foo: 2, bar: 3}, {foo: 2, bar: 4}, {foo: 2, bar: 6},
          {foo: 2, bar: 7}, {foo: 2, bar: 9}, {foo: 2, bar: 11}
          ]);

      expect(orderBy([
          {foo: 2, bar: 1}, {foo: 1, bar: 2}, {foo: 2, bar: 3},
          {foo: 2, bar: 4}, {foo: 1, bar: 5}, {foo: 2, bar: 6},
          {foo: 2, bar: 7}, {foo: 1, bar: 8}, {foo: 2, bar: 9},
          {foo: 1, bar: 10}, {foo: 2, bar: 11}, {foo: 1, bar: 12}
        ], 'foo', true))
          .toEqualData([
          {foo: 2, bar: 11}, {foo: 2, bar: 9}, {foo: 2, bar: 7},
          {foo: 2, bar: 6}, {foo: 2, bar: 4}, {foo: 2, bar: 3},
          {foo: 2, bar: 1}, {foo: 1, bar: 12}, {foo: 1, bar: 10},
          {foo: 1, bar: 8}, {foo: 1, bar: 5}, {foo: 1, bar: 2}
          ]);
    });
  });


  describe('(Array-Like Objects)', function() {
    function arrayLike(args) {
      var result = {};
      var i;
      for (i = 0; i < args.length; ++i) {
        result[i] = args[i];
      }
      result.length = i;
      return result;
    }


    beforeEach(inject(function($filter) {
      orderBy = function(collection) {
        var args = Array.prototype.slice.call(arguments, 0);
        args[0] = arrayLike(args[0]);
        return orderByFilter.apply(null, args);
      };
    }));


    it('should return sorted array if predicate is not provided', function() {
      expect(orderBy([2, 1, 3])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [])).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [''])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '+')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], ['+'])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '-')).toEqual([3, 2, 1]);
      expect(orderBy([2, 1, 3], ['-'])).toEqual([3, 2, 1]);
    });


    it('shouldSortArrayInReverse', function() {
      expect(orderBy([{a:15}, {a:2}], 'a', true)).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "T")).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "reverse")).toEqualData([{a:15}, {a:2}]);
    });


    it('should sort array by predicate', function() {
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['a', 'b'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['b', 'a'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['+b', '-a'])).toEqualData([{a:15, b:1}, {a:2, b:1}]);
    });


    it('should sort array by date predicate', function() {
      // same dates
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 }]);

      // one different date
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 }]);
    });


    it('should use function', function() {
      expect(
        orderBy(
          [{a:15, b:1},{a:2, b:1}],
          function(value) { return value.a; })).
      toEqual([{a:2, b:1},{a:15, b:1}]);
    });


    it('should support string predicates with names containing non-identifier characters', function() {
      /*jshint -W008 */
      expect(orderBy([{"Tip %": .25}, {"Tip %": .15}, {"Tip %": .40}], '"Tip %"'))
        .toEqualData([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}]);
      expect(orderBy([{"원": 76000}, {"원": 31000}, {"원": 156000}], '"원"'))
        .toEqualData([{"원": 31000}, {"원": 76000}, {"원": 156000}]);
    });


    it('should throw if quoted string predicate is quoted incorrectly', function() {
      /*jshint -W008 */
      expect(function() {
        return orderBy([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}], '"Tip %\'');
      }).toThrow();
    });


    it('should not reverse array of objects with no predicate', function() {
      var array = [
        { id: 2 },
        { id: 1 },
        { id: 4 },
        { id: 3 }
      ];
      expect(orderBy(array)).toEqualData(array);
    });


    it('should not reverse array of objects with null prototype and no predicate', function() {
      var array = [2,1,4,3].map(function(id) {
        var obj = Object.create(null);
        obj.id = id;
        return obj;
      });
      expect(orderBy(array)).toEqualData(array);
    });


    it('should sort nulls as Array.prototype.sort', function() {
      var array = [
      { id: 2 },
      null,
      { id: 3 },
      null
      ];
      expect(orderBy(array)).toEqualData([
        { id: 2 },
        { id: 3 },
        null,
        null
      ]);
    });
  });
});
