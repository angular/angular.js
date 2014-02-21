'use strict';

describe('Filter: slice', function() {
  var items;
  var str
  var slice;

  beforeEach(inject(function($filter) {
    items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    str = "stuvwxyz";
    slice = $filter('slice');
  }));

  it('should return all items after index X when X is positive', function() {
    expect(slice(items, 4)).toEqual(['e', 'f', 'g', 'h']);
    expect(slice(items, '4')).toEqual(['e', 'f', 'g', 'h']);

    expect(slice(str, 4)).toEqual("wxyz");
    expect(slice(str, '4')).toEqual("wxyz");
  });

  it('should return the last X items when X is negative', function() {
    expect(slice(items, -3)).toEqual(['f', 'g', 'h']);
    expect(slice(items, '-3')).toEqual(['f', 'g', 'h']);

    expect(slice(str, -3)).toEqual("xyz");
    expect(slice(str, '-3')).toEqual("xyz");
  });

  it('should return an extracted array between index X and X', function () {
    expect(slice(items, 3, 6)).toEqual(['d', 'e', 'f']);
    expect(slice(items, '3', '6')).toEqual(['d', 'e', 'f']);

    expect(slice(str, 3, 6)).toEqual("vwx");
    expect(slice(str, '3', '6')).toEqual("vwx");
  });

  it('should return a string or array the same as slice()', function () {
    expect(slice(items, -2, -4)).toEqual([]);
    expect(slice(items, -4, -2)).toEqual(['e', 'f']);
    expect(slice(items, 2, -2)).toEqual(['c', 'd', 'e', 'f']);
    expect(slice(items, 2, -8)).toEqual([]);
    
    expect(slice(str, -2, -4)).toEqual("");
    expect(slice(str, -4, -2)).toEqual("wx");
    expect(slice(str, 2, -2)).toEqual("uvwx");
    expect(slice(str, -2, -8)).toEqual("");
  });

  it('should return the source array when X cannot be parsed', function() {
    expect(slice(items, 'bogus')).toEqual(items);
    expect(slice(items, 'null')).toEqual(items);
    expect(slice(items, 'undefined')).toEqual(items);
    expect(slice(items, null)).toEqual(items);
    expect(slice(items, undefined)).toEqual(items);
  });

  it('should return the source string when X cannot be parsed', function() {
    expect(slice(str, 'bogus')).toEqual(str);
    expect(slice(str, 'null')).toEqual(str);
    expect(slice(str, 'undefined')).toEqual(str);
    expect(slice(str, null)).toEqual(str);
    expect(slice(str, undefined)).toEqual(str);
  });

  it('should return input if not String or Array', function() {
    expect(slice(1,1)).toEqual(1);
    expect(slice(null, 1)).toEqual(null);
    expect(slice(undefined, 1)).toEqual(undefined);
    expect(slice({}, 1)).toEqual({});
  });

  it('should return an empty array or string if X is positive and exceeds input length', function () {
    expect(slice(items, 9)).toEqual([]);
    expect(slice(items, '9')).toEqual([]);

    expect(slice(str, 9)).toEqual("");
    expect(slice(str, '9')).toEqual("");

    expect(slice(items, 9)).not.toBe(items);
    expect(slice(str, 9)).not.toBe(str);
  });

  it('should return the source array or string if X is negative and exceeds input length', function() {
    expect(slice(items, -9)).toEqual(items);
    expect(slice(items, '-9')).toEqual(items);

    expect(slice(str, -9)).toEqual(str);
    expect(slice(str, '-9')).toEqual(str);
  });

});
