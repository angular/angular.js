'use strict';

describe('Filter: range', function() {
  var range;
  beforeEach(inject(function($filter) {
    range = $filter('range');
  }));

  it('should return an array of 0..4 when end is 5', function() {
    expect(range(5)).toBe([0, 1, 2, 3, 4]);
  });

  it('should return an array of 1..5 when start is 1 and end is 6', function() {
    expect(range(1, 6)).toBe([1, 2, 3, 4, 5]);
  });

  it('should return an array of 5..0 when start is 5 and end is -1', function() {
    expect(range(5, -1)).toBe([5, 4, 3, 2, 1, 0]);
  });

  it('should return an array of 5..1 when start is 1 and end is 6', function() {
    expect(range(1, 6)).toBe([1, 2, 3, 4, 5]);
  });

  it('should return an empty array for no arguments', function() {
     expect(range()).toBe([]);
  });

  it('should return an empty array for an argument of 0', function() {
     expect(range(0)).toBe([]);
  });

  it('should return an empty array when start and end are the same number', function() {
     expect(range(5, 5)).toBe([]);
  });

  it('should return an empty array when start and end are the same number', function() {
     expect(range(5, 5)).toBe([]);
  });

  it('should return an array with one element (0) when end is 1', function() {
     expect(range(1)).toBe([0]);
  });

  it('should return [-1] when end is -1', function() {
     expect(range(-1)).toBe([0]);
  });

  it('should work correctly for negative numbers too', function() {
     expect(range(-4)).toBe([-4, -3, -2, 1]);
  });
});
