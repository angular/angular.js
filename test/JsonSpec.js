describe('json', function(){
  it('should parse Primitives', function() {
    assertEquals("null", toJson(0/0));
    assertEquals("null", toJson(null));
    assertEquals("true", toJson(true));
    assertEquals("false", toJson(false));
    assertEquals("123.45", toJson(123.45));
    assertEquals('"abc"', toJson("abc"));
    assertEquals('"a \\t \\n \\r b \\\\"', toJson("a \t \n \r b \\"));
  });

  it('should parse Escaping', function() {
    assertEquals("\"7\\\\\\\"7\"", toJson("7\\\"7"));
  });

  it('should parse Objects', function() {
    assertEquals('{"a":1,"b":2}', toJson({a:1,b:2}));
    assertEquals('{"a":{"b":2}}', toJson({a:{b:2}}));
    assertEquals('{"a":{"b":{"c":0}}}', toJson({a:{b:{c:0}}}));
    assertEquals('{"a":{"b":null}}', toJson({a:{b:0/0}}));
  });

  it('should parse ObjectPretty', function() {
    assertEquals('{\n  "a":1,\n  "b":2}', toJson({a:1,b:2}, true));
    assertEquals('{\n  "a":{\n    "b":2}}', toJson({a:{b:2}}, true));
  });

  it('should parse Array', function() {
    assertEquals('[]', toJson([]));
    assertEquals('[1,"b"]', toJson([1,"b"]));
  });

  it('should parse RegExp', function() {
    assertEquals('"/foo/"', toJson(/foo/));
    assertEquals('[1,"/foo/"]', toJson([1,new RegExp("foo")]));
  });

  it('should parse IgnoreFunctions', function() {
    assertEquals('[null,1]', toJson([function(){},1]));
    assertEquals('{}', toJson({a:function(){}}));
  });

  it('should parse ParseNull', function() {
    assertNull(fromJson("null"));
  });

  it('should parse ParseBoolean', function() {
    assertTrue(fromJson("true"));
    assertFalse(fromJson("false"));
  });

  it('should parse $$isIgnored', function() {
    assertEquals("{}", toJson({$$:0}));
  });

  it('should parse ArrayWithEmptyItems', function() {
    var a = [];
    a[1] = "X";
    assertEquals('[null,"X"]', toJson(a));
  });

  it('should parse ItShouldEscapeUnicode', function() {
    assertEquals(1, "\u00a0".length);
    assertEquals(8, toJson("\u00a0").length);
    assertEquals(1, fromJson(toJson("\u00a0")).length);
  });

  it('should parse ItShouldUTCDates', function() {
    var date = angular.String.toDate("2009-10-09T01:02:03Z");
    assertEquals('"2009-10-09T01:02:03Z"', toJson(date));
    assertEquals(date.getTime(),
        fromJson('"2009-10-09T01:02:03Z"').getTime());
  });

  it('should parse ItShouldPreventRecursion', function() {
    var obj = {a:'b'};
    obj.recursion = obj;
    assertEquals('{"a":"b","recursion":RECURSION}', angular.toJson(obj));
  });

  it('should parse ItShouldIgnore$Properties', function() {
    var scope = createScope();
    scope.a = 'a';
    scope['$b'] = '$b';
    scope.c = 'c';
    expect(angular.toJson(scope)).toEqual('{"a":"a","c":"c","this":RECURSION}');
  });

  it('should parse ItShouldSerializeInheritedProperties', function() {
    var scope = createScope({p:'p'});
    scope.a = 'a';
    expect(angular.toJson(scope)).toEqual('{"a":"a","p":"p","this":RECURSION}');
  });

  it('should parse ItShouldSerializeSameObjectsMultipleTimes', function() {
    var obj = {a:'b'};
    assertEquals('{"A":{"a":"b"},"B":{"a":"b"}}', angular.toJson({A:obj, B:obj}));
  });

  it('should parse ItShouldNotSerializeUndefinedValues', function() {
    assertEquals('{}', angular.toJson({A:undefined}));
  });

  it('should parse ItShouldParseFloats', function() {
    expect(fromJson("{value:2.55, name:'misko'}")).toEqual({value:2.55, name:'misko'});
  });

  it('should parse negative / possitve numbers', function() {
    expect(fromJson("{neg:-2.55, pos:+.3, a:[-2, +.1, -.2, +.3]}")).toEqual({neg:-2.55, pos:+.3, a:[-2, +.1, -.2, +.3]});
  });

  describe('security', function(){
    it('should not allow naked expressions', function(){
      expect(function(){fromJson('1+2');}).toThrow("Did not understand '+2' while evaluating '1+2'.");
    });

    it('should not allow naked expressions group', function(){
      expect(function(){fromJson('(1+2)');}).toThrow("Expression at column='0' of expression '(1+2)' starting at '(1+2)' is not valid json.");
    });

    it('should not allow expressions in objects', function(){
      expect(function(){fromJson('{a:abc()}');}).toThrow("Expression at column='3' of expression '{a:abc()}' starting at 'abc()}' is not valid json.");
    });

    it('should not allow expressions in arrays', function(){
      expect(function(){fromJson('[1+2]');}).toThrow("Expression at column='2' of expression '[1+2]' starting at '+2]' is not valid json.");
    });

    it('should not allow vars', function(){
      expect(function(){fromJson('[1, x]');}).toThrow("Expression at column='4' of expression '[1, x]' starting at 'x]' is not valid json.");
    });

    it('should not allow dereference', function(){
      expect(function(){fromJson('["".constructor]');}).toThrow("Expression at column='3' of expression '[\"\".constructor]' starting at '.constructor]' is not valid json.");
    });

    it('should not allow expressions ofter valid json', function(){
      expect(function(){fromJson('[].constructor');}).toThrow("Expression at column='2' of expression '[].constructor' starting at '.constructor' is not valid json.");
    });
  });

});

