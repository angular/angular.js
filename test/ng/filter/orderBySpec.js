'use strict';

describe('Filter: orderBy', function() {
  var orderBy, orderByFilter;
  beforeEach(inject(function($filter) {
    orderBy = orderByFilter = $filter('orderBy');
  }));


  describe('(Arrays)', function() {
    it('should throw an exception if no array-like object is provided', function() {
      expect(function() { orderBy({}); }).
        toThrowMinErr('orderBy', 'notarray', 'Expected array but received: {}');
    });


    it('should not throw an exception if a null or undefined value is provided', function() {
      expect(orderBy(null)).toEqual(null);
      expect(orderBy(undefined)).toEqual(undefined);
    });


    it('should not throw an exception if an array-like object is provided', function() {
      expect(orderBy('cba')).toEqual(['a', 'b', 'c']);
    });


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
      /* eslint-disable no-floating-decimal */
      expect(orderBy([{'Tip %': .25}, {'Tip %': .15}, {'Tip %': .40}], '"Tip %"'))
        .toEqualData([{'Tip %': .15}, {'Tip %': .25}, {'Tip %': .40}]);
      expect(orderBy([{'원': 76000}, {'원': 31000}, {'원': 156000}], '"원"'))
        .toEqualData([{'원': 31000}, {'원': 76000}, {'원': 156000}]);
      /* eslint-enable */
    });


    it('should throw if quoted string predicate is quoted incorrectly', function() {
      /* eslint-disable no-floating-decimal */
      expect(function() {
        return orderBy([{'Tip %': .15}, {'Tip %': .25}, {'Tip %': .40}], '"Tip %\'');
      }).toThrow();
      /* eslint-enable */
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


    describe('(reversing order)', function() {
      it('should not reverse collection if `reverse` param is falsy',
        function() {
          var items = [{a: 2}, {a: 15}];
          var expr = 'a';
          var sorted = [{a: 2}, {a: 15}];

          expect(orderBy(items, expr, false)).toEqual(sorted);
          expect(orderBy(items, expr, 0)).toEqual(sorted);
          expect(orderBy(items, expr, '')).toEqual(sorted);
          expect(orderBy(items, expr, NaN)).toEqual(sorted);
          expect(orderBy(items, expr, null)).toEqual(sorted);
          expect(orderBy(items, expr, undefined)).toEqual(sorted);
        }
      );


      it('should reverse collection if `reverse` param is truthy',
        function() {
          var items = [{a: 2}, {a: 15}];
          var expr = 'a';
          var sorted = [{a: 15}, {a: 2}];

          expect(orderBy(items, expr, true)).toEqual(sorted);
          expect(orderBy(items, expr, 1)).toEqual(sorted);
          expect(orderBy(items, expr, 'reverse')).toEqual(sorted);
          expect(orderBy(items, expr, {})).toEqual(sorted);
          expect(orderBy(items, expr, [])).toEqual(sorted);
          expect(orderBy(items, expr, noop)).toEqual(sorted);
        }
      );


      it('should reverse collection if `reverse` param is `true`, even without an `expression`',
        function() {
          var originalItems = [{id: 2}, {id: 1}, {id: 4}, {id: 3}];
          var reversedItems = [{id: 3}, {id: 4}, {id: 1}, {id: 2}];
          expect(orderBy(originalItems, null, true)).toEqual(reversedItems);
        }
      );
    });


    describe('(built-in comparator)', function() {
      it('should compare numbers numerically', function() {
        var items = [100, 3, 20];
        var expr = null;
        var sorted = [3, 20, 100];

        expect(orderBy(items, expr)).toEqual(sorted);
      });


      it('should compare strings alphabetically', function() {
        var items = ['100', '3', '20', '_b', 'a'];
        var expr = null;
        var sorted = ['100', '20', '3', '_b', 'a'];

        expect(orderBy(items, expr)).toEqual(sorted);
      });


      it('should compare strings case-insensitively', function() {
        var items = ['c', 'B', 'a'];
        var expr = null;
        var sorted = ['a', 'B', 'c'];

        expect(orderBy(items, expr)).toEqual(sorted);
      });


      it('should compare objects based on `index`', function() {
        var items = [{c: 3}, {b: 2}, {a: 1}];
        var expr = null;
        var sorted = [{c: 3}, {b: 2}, {a: 1}];

        expect(orderBy(items, expr)).toEqual(sorted);
      });


      it('should compare values of different type alphabetically by type', function() {
        var items = [undefined, '1', {}, 999, noop, false];
        var expr = null;
        var sorted = [false, noop, 999, {}, '1', undefined];

        expect(orderBy(items, expr)).toEqual(sorted);
      });
    });

    describe('(custom comparator)', function() {
      it('should support a custom comparator', function() {
        var items = [4, 42, 2];
        var expr = null;
        var reverse = null;
        var sorted = [42, 2, 4];

        var comparator = function(o1, o2) {
          var v1 = o1.value;
          var v2 = o2.value;

          // 42 always comes first
          if (v1 === v2) return 0;
          if (v1 === 42) return -1;
          if (v2 === 42) return 1;

          // Default comparison for other values
          return (v1 < v2) ? -1 : 1;
        };

        expect(orderBy(items, expr, reverse, comparator)).toEqual(sorted);
      });


      it('should support `reverseOrder` with a custom comparator', function() {
        var items = [4, 42, 2];
        var expr = null;
        var reverse = true;
        var sorted = [4, 2, 42];

        var comparator = function(o1, o2) {
          var v1 = o1.value;
          var v2 = o2.value;

          // 42 always comes first
          if (v1 === v2) return 0;
          if (v1 === 42) return -1;
          if (v2 === 42) return 1;

          // Default comparison for other values
          return (v1 < v2) ? -1 : 1;
        };

        expect(orderBy(items, expr, reverse, comparator)).toEqual(sorted);
      });


      it('should pass `{value, type, index}` objects to comparators', function() {
        var items = [false, noop, 999, {}, '', undefined];
        var expr = null;
        var reverse = null;
        var comparator = jasmine.createSpy('comparator').and.returnValue(-1);

        orderBy(items, expr, reverse, comparator);
        var allArgsFlat = Array.prototype.concat.apply([], comparator.calls.allArgs());

        expect(allArgsFlat).toContain({index: 0, type: 'boolean',   value: false    });
        expect(allArgsFlat).toContain({index: 1, type: 'function',  value: noop     });
        expect(allArgsFlat).toContain({index: 2, type: 'number',    value: 999      });
        expect(allArgsFlat).toContain({index: 3, type: 'object',    value: {}       });
        expect(allArgsFlat).toContain({index: 4, type: 'string',    value: ''       });
        expect(allArgsFlat).toContain({index: 5, type: 'undefined', value: undefined});
      });


      it('should treat a value of `null` as `"null"`', function() {
        var items = [null, null];
        var expr = null;
        var reverse = null;
        var comparator = jasmine.createSpy('comparator').and.returnValue(-1);

        orderBy(items, expr, reverse, comparator);
        var arg = comparator.calls.argsFor(0)[0];

        expect(arg).toEqual(jasmine.objectContaining({
          type: 'string',
          value: 'null'
        }));
      });


      it('should not convert strings to lower-case', function() {
        var items = ['c', 'B', 'a'];
        var expr = null;
        var reverse = null;
        var sorted = ['B', 'a', 'c'];

        var comparator = function(o1, o2) {
          return (o1.value < o2.value) ? -1 : 1;
        };

        expect(orderBy(items, expr, reverse, comparator)).toEqual(sorted);
      });


      it('should use `index` as `value` if no other predicate can distinguish between two items',
        function() {
          var items = ['foo', 'bar'];
          var expr = null;
          var reverse = null;
          var comparator = jasmine.createSpy('comparator').and.returnValue(0);

          orderBy(items, expr, reverse, comparator);

          expect(comparator).toHaveBeenCalledTimes(2);
          var lastArgs = comparator.calls.mostRecent().args;

          expect(lastArgs).toContain(jasmine.objectContaining({value: 0, type: 'number'}));
          expect(lastArgs).toContain(jasmine.objectContaining({value: 1, type: 'number'}));
        }
      );


      it('should support multiple predicates and per-predicate sorting direction', function() {
        var items = [
          {owner: 'ownerA', type: 'typeA'},
          {owner: 'ownerB', type: 'typeB'},
          {owner: 'ownerC', type: 'typeB'},
          {owner: 'ownerD', type: 'typeB'}
        ];
        var expr = ['type', '-owner'];
        var reverse = null;
        var sorted = [
          {owner: 'ownerA', type: 'typeA'},
          {owner: 'ownerC', type: 'typeB'},
          {owner: 'ownerB', type: 'typeB'},
          {owner: 'ownerD', type: 'typeB'}
        ];

        var comparator = function(o1, o2) {
          var v1 = o1.value;
          var v2 = o2.value;
          var isNerd1 = v1.toLowerCase().indexOf('nerd') !== -1;
          var isNerd2 = v2.toLowerCase().indexOf('nerd') !== -1;

          // Shamelessly promote "nerds"
          if (isNerd1 || isNerd2) {
            return (isNerd1 && isNerd2) ? 0 : (isNerd1) ? -1 : 1;
          }

          // No "nerd"; alphabetical order
          return (v1 === v2) ? 0 : (v1 < v2) ? -1 : 1;
        };

        expect(orderBy(items, expr, reverse, comparator)).toEqual(sorted);
      });
    });

    describe('(object as `value`)', function() {
      it('should use the return value of `valueOf()` (if primitive)', function() {
        var o1 = {k: 1, valueOf: function() { return 2; }};
        var o2 = {k: 2, valueOf: function() { return 1; }};

        var items = [o1, o2];
        var expr = null;
        var sorted = [o2, o1];

        expect(orderBy(items, expr)).toEqual(sorted);
      });


      it('should use the return value of `toString()` (if primitive)', function() {
        var o1 = {k: 1, toString: function() { return 2; }};
        var o2 = {k: 2, toString: function() { return 1; }};

        var items = [o1, o2];
        var expr = null;
        var sorted = [o2, o1];

        expect(orderBy(items, expr)).toEqual(sorted);
      });


      it('should ignore the `toString()` inherited from `Object`', function() {
        /* globals toString: true */

        // The global `toString` variable (in 'src/Angular.js')
        // has already captured `Object.prototype.toString`
        var originalToString = toString;
        toString = jasmine.createSpy('toString').and.callFake(originalToString);

        var o1 = Object.create({toString: toString});
        var o2 = Object.create({toString: toString});

        var items = [o1, o2];
        var expr = null;

        orderBy(items, expr);

        expect(o1.toString).not.toHaveBeenCalled();
        expect(o2.toString).not.toHaveBeenCalled();

        toString = originalToString;
      });


      it('should use the return value of `valueOf()` for subsequent steps (if non-primitive)',
        function() {
          var o1 = {k: 1, valueOf: function() { return o3; }};
          var o2 = {k: 2, valueOf: function() { return o4; }};
          var o3 = {k: 3, toString: function() { return 4; }};
          var o4 = {k: 4, toString: function() { return 3; }};

          var items = [o1, o2];
          var expr = null;
          var sorted = [o2, o1];

          expect(orderBy(items, expr)).toEqual(sorted);
        }
      );


      it('should use the return value of `toString()` for subsequent steps (if non-primitive)',
        function() {
          var o1 = {k: 1, toString: function() { return o3; }};
          var o2 = {k: 2, toString: function() { return o4; }};
          var o3 = {k: 3};
          var o4 = {k: 4};

          var items = [o1, o2];
          var expr = null;
          var reverse = null;
          var comparator = jasmine.createSpy('comparator').and.returnValue(-1);

          orderBy(items, expr, reverse, comparator);
          var args = comparator.calls.argsFor(0);

          expect(args).toContain(jasmine.objectContaining({value: o3, type: 'object'}));
          expect(args).toContain(jasmine.objectContaining({value: o4, type: 'object'}));
        }
      );


      it('should use the object itself as `value` if no conversion took place', function() {
        var o1 = {k: 1};
        var o2 = {k: 2};

        var items = [o1, o2];
        var expr = null;
        var reverse = null;
        var comparator = jasmine.createSpy('comparator').and.returnValue(-1);

        orderBy(items, expr, reverse, comparator);
        var args = comparator.calls.argsFor(0);

        expect(args).toContain(jasmine.objectContaining({value: o1, type: 'object'}));
        expect(args).toContain(jasmine.objectContaining({value: o2, type: 'object'}));
      });
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
      expect(orderBy([{a:15}, {a:2}], 'a', 'T')).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', 'reverse')).toEqualData([{a:15}, {a:2}]);
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
      /* eslint-disable no-floating-decimal */
      expect(orderBy([{'Tip %': .25}, {'Tip %': .15}, {'Tip %': .40}], '"Tip %"'))
        .toEqualData([{'Tip %': .15}, {'Tip %': .25}, {'Tip %': .40}]);
      expect(orderBy([{'원': 76000}, {'원': 31000}, {'원': 156000}], '"원"'))
        .toEqualData([{'원': 31000}, {'원': 76000}, {'원': 156000}]);
      /* eslint-enable */
    });


    it('should throw if quoted string predicate is quoted incorrectly', function() {
      /* eslint-disable no-floating-decimal */
      expect(function() {
        return orderBy([{'Tip %': .15}, {'Tip %': .25}, {'Tip %': .40}], '"Tip %\'');
      }).toThrow();
      /* eslint-enable */
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
