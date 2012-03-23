'use strict';

describe('Filter: limitTo', function() {
  var items;
  var limitTo;

  beforeEach(inject(function($filter) {
    items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    limitTo = $filter('limitTo');
  }));


  it('should return the first X items when X is positive', function() {
    expect(limitTo(items, 3)).toEqual(['a', 'b', 'c']);
    expect(limitTo(items, '3')).toEqual(['a', 'b', 'c']);
  });


  it('should return the last X items when X is negative', function() {
    expect(limitTo(items, -3)).toEqual(['f', 'g', 'h']);
    expect(limitTo(items, '-3')).toEqual(['f', 'g', 'h']);
  });


  it('should return an empty array when X cannot be parsed', function() {
    expect(limitTo(items, 'bogus')).toEqual([]);
    expect(limitTo(items, 'null')).toEqual([]);
    expect(limitTo(items, 'undefined')).toEqual([]);
    expect(limitTo(items, null)).toEqual([]);
    expect(limitTo(items, undefined)).toEqual([]);
  });


  it('should return an empty array when input is not Array type', function() {
    expect(limitTo('bogus', 1)).toEqual('bogus');
    expect(limitTo(null, 1)).toEqual(null);
    expect(limitTo(undefined, 1)).toEqual(undefined);
    expect(limitTo(null, 1)).toEqual(null);
    expect(limitTo(undefined, 1)).toEqual(undefined);
    expect(limitTo({}, 1)).toEqual({});
  });


  it('should return a copy of input array if X is exceeds array length', function () {
    expect(limitTo(items, 19)).toEqual(items);
    expect(limitTo(items, '9')).toEqual(items);
    expect(limitTo(items, -9)).toEqual(items);
    expect(limitTo(items, '-9')).toEqual(items);

    expect(limitTo(items, 9)).not.toBe(items);
  });
});
