'use strict';

describe('toDebugString', function() {
  it('should convert its argument to a string', function() {
    expect(toDebugString('string')).toEqual('string');
    expect(toDebugString(123)).toEqual('123');
    expect(toDebugString({a:{b:'c'}})).toEqual('{"a":{"b":"c"}}');
    expect(toDebugString(function fn() { var a = 10; })).toEqual('function fn()');
    expect(toDebugString()).toEqual('undefined');
    var a = { };
    a.a = a;
    expect(toDebugString(a)).toEqual('{"a":"..."}');
    expect(toDebugString([a,a])).toEqual('[{"a":"..."},"..."]');
  });

  it('should convert its argument that are objects to string based on maxDepth', function() {
    var a = {b: {c: {d: 1}}};
    expect(toDebugString(a, 1)).toEqual('{"b":"..."}');
    expect(toDebugString(a, 2)).toEqual('{"b":{"c":"..."}}');
    expect(toDebugString(a, 3)).toEqual('{"b":{"c":{"d":1}}}');
  });

  they('should convert its argument that object to string  and ignore max depth when maxDepth = $prop',
    [NaN, null, undefined, true, false, -1, 0], function(maxDepth) {
      var a = {b: {c: {d: 1}}};
      expect(toDebugString(a, maxDepth)).toEqual('{"b":{"c":{"d":1}}}');
    }
  );
});

describe('serializeObject', function() {
  it('should convert its argument to a string', function() {
    expect(serializeObject({a:{b:'c'}})).toEqual('{"a":{"b":"c"}}');

    var a = { };
    a.a = a;
    expect(serializeObject(a)).toEqual('{"a":"..."}');
    expect(serializeObject([a,a])).toEqual('[{"a":"..."},"..."]');
  });

  it('should convert its argument that are objects to string based on maxDepth', function() {
    var a = {b: {c: {d: 1}}};
    expect(serializeObject(a, 1)).toEqual('{"b":"..."}');
    expect(serializeObject(a, 2)).toEqual('{"b":{"c":"..."}}');
    expect(serializeObject(a, 3)).toEqual('{"b":{"c":{"d":1}}}');
  });

  they('should convert its argument that object to string  and ignore max depth when maxDepth = $prop',
    [NaN, null, undefined, true, false, -1, 0], function(maxDepth) {
      var a = {b: {c: {d: 1}}};
      expect(serializeObject(a, maxDepth)).toEqual('{"b":{"c":{"d":1}}}');
    }
  );
});
