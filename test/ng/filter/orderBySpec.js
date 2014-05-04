'use strict';

describe('Filter: orderBy', function() {
  var orderBy;
  beforeEach(inject(function($filter) {
    orderBy = $filter('orderBy');
  }));

  it('should return same array if predicate is falsy', function() {
    var array = [1, 2, 3];
    expect(orderBy(array)).toBe(array);
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
});
