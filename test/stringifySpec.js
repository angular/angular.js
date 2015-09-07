'use strict';

describe('toDebugString', function() {
  it('should convert its argument to a string', function() {
    expect(toDebugString('string')).toEqual('string');
    expect(toDebugString(123)).toEqual('123');
    expect(toDebugString({a:{b:'c'}})).toEqual('{"a":{"b":"c"}}');
    expect(toDebugString(function fn() { var a = 10; })).toEqual('function fn()');
    expect(toDebugString()).toEqual('undefined');

    // circular references
    var a = {};
    a.a = a;
    expect(toDebugString(a)).toEqual('{"a":{"a":"..."}}');
    expect(toDebugString([a,a])).toEqual('[{"a":{"a":"..."}},{"a":{"a":"..."}}]');
  });
});
