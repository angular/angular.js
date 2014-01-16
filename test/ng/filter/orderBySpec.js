'use strict';

describe('Filter: orderBy', function() {
  var orderBy;
  beforeEach(inject(function($filter) {
    orderBy = $filter('orderBy');
  }));

  it('should return sorted array if predicate is falsy', function() {
    expect(orderBy([2, 1, 3])).toEqual([1, 2, 3]);
  });

  it('shouldSortArrayInReverse', function() {
    expect(orderBy([{a:15}, {a:2}], 'a', true)).toEqualData([{a:15}, {a:2}]);
    expect(orderBy([{a:15}, {a:2}], 'a', "T")).toEqualData([{a:15}, {a:2}]);
    expect(orderBy([{a:15}, {a:2}], 'a', "reverse")).toEqualData([{a:15}, {a:2}]);
  });

  it('should sort array by predicate', function() {
    expect(orderBy([2, 1, 3], '+')).toEqualData([1, 2, 3]);
    expect(orderBy([2, 1, 3], '-')).toEqualData([3, 2, 1]);

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

});
