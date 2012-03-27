'use strict';

describe('json', function() {

  describe('fromJson', function() {

    it('should delegate to native parser', function() {
      var spy = spyOn(JSON, 'parse').andCallThrough();

      expect(fromJson('{}')).toEqual({});
      expect(spy).toHaveBeenCalled();
    });
  });


  it('should serialize primitives', function() {
    expect(toJson(0/0)).toEqual('null');
    expect(toJson(null)).toEqual('null');
    expect(toJson(true)).toEqual('true');
    expect(toJson(false)).toEqual('false');
    expect(toJson(123.45)).toEqual('123.45');
    expect(toJson('abc')).toEqual('"abc"');
    expect(toJson('a \t \n \r b \\')).toEqual('"a \\t \\n \\r b \\\\"');
  });

  it('should not serialize $$properties', function() {
    expect(toJson({$$some:'value', 'this':1, '$parent':1}, false)).toEqual('{}');
  });

  it('should not serialize this or $parent', function() {
    expect(toJson({'this':'value', $parent:'abc'}, false)).toEqual('{}');
  });

  it('should serialize strings with escaped characters', function() {
    expect(toJson("7\\\"7")).toEqual("\"7\\\\\\\"7\"");
  });

  it('should serialize objects', function() {
    expect(toJson({a: 1, b: 2})).toEqual('{"a":1,"b":2}');
    expect(toJson({a: {b: 2}})).toEqual('{"a":{"b":2}}');
    expect(toJson({a: {b: {c: 0}}})).toEqual('{"a":{"b":{"c":0}}}');
    expect(toJson({a: {b: 0/0}})).toEqual('{"a":{"b":null}}');
  });

  it('should format objects pretty', function() {
    expect(toJson({a: 1, b: 2}, true)).toEqual('{\n  "a":1,\n  "b":2}');
    expect(toJson({a: {b: 2}}, true)).toEqual('{\n  "a":{\n    "b":2}}');
  });

  it('should serialize array', function() {
    expect(toJson([])).toEqual('[]');
    expect(toJson([1, 'b'])).toEqual('[1,"b"]');
  });

  it('should serialize RegExp', function() {
    expect(toJson(/foo/)).toEqual('"/foo/"');
    expect(toJson([1, new RegExp('foo')])).toEqual('[1,"/foo/"]');
  });

  it('should ignore functions', function() {
    expect(toJson([function() {},1])).toEqual('[null,1]');
    expect(toJson({a:function() {}})).toEqual('{}');
  });

  it('should serialize array with empty items', function() {
    var a = [];
    a[1] = 'X';
    expect(toJson(a)).toEqual('[null,"X"]');
  });

  it('should escape unicode', function() {
    expect('\u00a0'.length).toEqual(1);
    expect(toJson('\u00a0').length).toEqual(8);
    expect(fromJson(toJson('\u00a0')).length).toEqual(1);
  });

  it('should serialize UTC dates', function() {
    var date = new angular.mock.TzDate(-1, '2009-10-09T01:02:03.027Z');
    expect(toJson(date)).toEqual('"2009-10-09T01:02:03.027Z"');
  });

  it('should prevent recursion', function() {
    var obj = {a: 'b'};
    obj.recursion = obj;
    expect(angular.toJson(obj)).toEqual('{"a":"b","recursion":RECURSION}');
  });

  it('should serialize $ properties', function() {
    var obj = {$a: 'a'};
    expect(angular.toJson(obj)).toEqual('{"$a":"a"}');
  });

  it('should NOT serialize inherited properties', function() {
    // This is what native Browser does
    var obj = inherit({p:'p'});
    obj.a = 'a';
    expect(angular.toJson(obj)).toEqual('{"a":"a"}');
  });

  it('should serialize same objects multiple times', function() {
    var obj = {a:'b'};
    expect(angular.toJson({A:obj, B:obj})).toEqual('{"A":{"a":"b"},"B":{"a":"b"}}');
  });

  it('should not serialize undefined values', function() {
    expect(angular.toJson({A:undefined})).toEqual('{}');
  });

  it('should not serialize $window object', function() {
    expect(toJson(window)).toEqual('WINDOW');
  });

  it('should not serialize $document object', function() {
    expect(toJson(document)).toEqual('DOCUMENT');
  });


  describe('string', function() {
    it('should quote', function() {
      expect(quoteUnicode('a')).toBe('"a"');
      expect(quoteUnicode('\\')).toBe('"\\\\"');
      expect(quoteUnicode("'a'")).toBe('"\'a\'"');
      expect(quoteUnicode('"a"')).toBe('"\\"a\\""');
      expect(quoteUnicode('\n\f\r\t')).toBe('"\\n\\f\\r\\t"');
    });

    it('should quote slashes', function() {
      expect(quoteUnicode("7\\\"7")).toBe('"7\\\\\\\"7"');
    });

    it('should quote unicode', function() {
      expect(quoteUnicode('abc\u00A0def')).toBe('"abc\\u00a0def"');
    });

  });

});
