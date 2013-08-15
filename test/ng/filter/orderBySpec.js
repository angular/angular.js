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

  it('should return same object if object is not an array', function() {
    var array = { name: 'angular', company: 'google' };
    expect(orderBy(array)).toBe(array);
  });

  it('should sort normal array', function() {
    var array = [{a:15}, {a:2}, {a:3}],
        sorted = [{a:2}, {a:3}, {a:15}];
    expect(orderBy(array, 'a', false)).toEqualData(sorted);
    expect(orderBy(array, 'a', "F")).toEqualData(sorted);
    expect(orderBy(array, 'a', "0")).toEqualData(sorted);
    expect(orderBy(array, 'a', 0)).toEqualData(sorted);
  });

  it('should sort mixed array', function() {
    var array = [{a:15}, {a:2}, {a:'3'}],
        sorted = [{a:2}, {a:'3'}, {a:15}];
    expect(orderBy(array, 'a', false)).toEqualData(sorted);
    expect(orderBy(array, 'a', "F")).toEqualData(sorted);
    expect(orderBy(array, 'a', "0")).toEqualData(sorted);
    expect(orderBy(array, 'a', 0)).toEqualData(sorted);
  });

  it('should sort normal array in reverse', function() {
    var array = [{a:15}, {a:2}, {a:3}],
        sorted = [{a:15}, {a:3}, {a:2}];
    expect(orderBy(array, 'a', true)).toEqualData(sorted);
    expect(orderBy(array, 'a', "T")).toEqualData(sorted);
    expect(orderBy(array, 'a', 1)).toEqualData(sorted);
    expect(orderBy(array, 'a', "reverse")).toEqualData(sorted);
  });

  it('should sort mixed array in reverse', function() {
    var array = [{a:15}, {a:2}, {a:'3'}],
        sorted = [{a:15}, {a:'3'}, {a:2}];
    expect(orderBy(array, 'a', true)).toEqualData(sorted);
    expect(orderBy(array, 'a', "T")).toEqualData(sorted);
    expect(orderBy(array, 'a', "1")).toEqualData(sorted);
    expect(orderBy(array, 'a', 1)).toEqualData(sorted);
  });

  it('should sort array by predicate', function() {
    var array = [{a:7,b:5}, {a:2,b:7}, {a:2,b:1}, {a:2,b:4}, {a:3,b:1}];

    expect(orderBy(array, ['a', 'b'])).toEqualData(
      [{a:2,b:1}, {a:2,b:4}, {a:2,b:7}, {a:3,b:1}, {a:7,b:5}]
    );

    expect(orderBy(array, ['+a', 'b'])).toEqualData(
      [{a:2,b:1}, {a:2,b:4}, {a:2,b:7}, {a:3,b:1}, {a:7,b:5}]
    );
    expect(orderBy(array, ['+a', '+b'])).toEqualData(
      [{a:2,b:1}, {a:2,b:4}, {a:2,b:7}, {a:3,b:1}, {a:7,b:5}]
    );
    expect(orderBy(array, ['+a', '-b'])).toEqualData(
      [{a:2,b:7}, {a:2,b:4}, {a:2,b:1}, {a:3,b:1}, {a:7,b:5}]
    );

    expect(orderBy(array, ['-a', 'b'])).toEqualData(
      [{a:7,b:5}, {a:3,b:1}, {a:2,b:1}, {a:2,b:4}, {a:2,b:7}]
    );
    expect(orderBy(array, ['-a', '+b'])).toEqualData(
      [{a:7,b:5}, {a:3,b:1}, {a:2,b:1}, {a:2,b:4}, {a:2,b:7}]
    );
    expect(orderBy(array, ['-a', '-b'])).toEqualData(
      [{a:7,b:5}, {a:3,b:1}, {a:2,b:7}, {a:2,b:4}, {a:2,b:1}]
    );

    expect(orderBy(array, ['b', 'a'])).toEqualData(
      [{a:2,b:1}, {a:3,b:1}, {a:2,b:4}, {a:7,b:5}, {a:2,b:7}]
    );

    expect(orderBy(array, ['+b', 'a'])).toEqualData(
      [{a:2,b:1}, {a:3,b:1}, {a:2,b:4}, {a:7,b:5}, {a:2,b:7}]
    );
    expect(orderBy(array, ['+b', '+a'])).toEqualData(
      [{a:2,b:1}, {a:3,b:1}, {a:2,b:4}, {a:7,b:5}, {a:2,b:7}]
    );
    expect(orderBy(array, ['+b', '-a'])).toEqualData(
      [{a:3,b:1}, {a:2,b:1}, {a:2,b:4}, {a:7,b:5}, {a:2,b:7}]
    );

    expect(orderBy(array, ['-b', 'a'])).toEqualData(
      [{a:2,b:7}, {a:7,b:5}, {a:2,b:4}, {a:2,b:1}, {a:3,b:1}]
    );
    expect(orderBy(array, ['-b', '+a'])).toEqualData(
      [{a:2,b:7}, {a:7,b:5}, {a:2,b:4}, {a:2,b:1}, {a:3,b:1}]
    );
    expect(orderBy(array, ['-b', '-a'])).toEqualData(
      [{a:2,b:7}, {a:7,b:5}, {a:2,b:4}, {a:3,b:1}, {a:2,b:1}]
    );
  });

  it('should use function', function() {
    expect(orderBy(
      [{a:15, b:1},{a:2, b:1}],
       function(value) { return value.a; }
    )).toEqual([{a:2, b:1},{a:15, b:1}]);
  });

});
