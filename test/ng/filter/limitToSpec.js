'use strict';

describe('Filter: limitTo', function() {
  var items;
  var str
  var limitTo;

  beforeEach(inject(function($filter) {
    items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    str = "tuvwxyz";
    limitTo = $filter('limitTo');
  }));


  it('should return the first X items when X is positive', function() {
    expect(limitTo(items, 3)).toEqual(['a', 'b', 'c']);
    expect(limitTo(items, '3')).toEqual(['a', 'b', 'c']);
    expect(limitTo(str, 3)).toEqual("tuv");
    expect(limitTo(str, '3')).toEqual("tuv");
  });


  it('should return the last X items when X is negative', function() {
    expect(limitTo(items, -3)).toEqual(['f', 'g', 'h']);
    expect(limitTo(items, '-3')).toEqual(['f', 'g', 'h']);
    expect(limitTo(str, -3)).toEqual("xyz");
    expect(limitTo(str, '-3')).toEqual("xyz");
  });


  it('should return an empty array when X cannot be parsed', function() {
    expect(limitTo(items, 'bogus')).toEqual([]);
    expect(limitTo(items, 'null')).toEqual([]);
    expect(limitTo(items, 'undefined')).toEqual([]);
    expect(limitTo(items, null)).toEqual([]);
    expect(limitTo(items, undefined)).toEqual([]);
  });

  it('should return an empty string when X cannot be parsed', function() {
    expect(limitTo(str, 'bogus')).toEqual("");
    expect(limitTo(str, 'null')).toEqual("");
    expect(limitTo(str, 'undefined')).toEqual("");
    expect(limitTo(str, null)).toEqual("");
    expect(limitTo(str, undefined)).toEqual("");
  });


  it('should return input if not String or Array', function() {
    expect(limitTo(1,1)).toEqual(1);
    expect(limitTo(null, 1)).toEqual(null);
    expect(limitTo(undefined, 1)).toEqual(undefined);
    expect(limitTo({}, 1)).toEqual({});
  });


  it('should return a copy of input array if X is exceeds array length', function () {
    expect(limitTo(items, 9)).toEqual(items);
    expect(limitTo(items, '9')).toEqual(items);
    expect(limitTo(items, -9)).toEqual(items);
    expect(limitTo(items, '-9')).toEqual(items);

    expect(limitTo(items, 9)).not.toBe(items);
  });

  it('should return the entire string if X exceeds input length', function() {
    expect(limitTo(str, 9)).toEqual(str);
    expect(limitTo(str, '9')).toEqual(str);
    expect(limitTo(str, -9)).toEqual(str);
    expect(limitTo(str, '-9')).toEqual(str);
  })

  it('should return entire input array when limited by Infinity', function() {
    expect(limitTo(items, Infinity)).toEqual(items);
    expect(limitTo(items, 'Infinity')).toEqual(items);
    expect(limitTo(items, -Infinity)).toEqual(items);
    expect(limitTo(items, '-Infinity')).toEqual(items);
  });

  it('should return the entire string when limited by Infinity', function() {
    expect(limitTo(str, Infinity)).toEqual(str);
    expect(limitTo(str, 'Infinity')).toEqual(str);
    expect(limitTo(str, -Infinity)).toEqual(str);
    expect(limitTo(str, '-Infinity')).toEqual(str);
  });
});
