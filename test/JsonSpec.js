describe('json', function(){
  it('should serialize primitives', function() {
    expect(toJson(0/0)).toEqual('null');
    expect(toJson(null)).toEqual('null');
    expect(toJson(true)).toEqual('true');
    expect(toJson(false)).toEqual('false');
    expect(toJson(123.45)).toEqual("123.45");
    expect(toJson("abc")).toEqual('"abc"');
    expect(toJson("a \t \n \r b \\")).toEqual('"a \\t \\n \\r b \\\\"');
  });

  it('should serialize strings with escaped characters', function() {
    expect(toJson("7\\\"7")).toEqual("\"7\\\\\\\"7\"");
  });

  it('should serialize objects', function() {
    expect(toJson({a:1,b:2})).toEqual('{"a":1,"b":2}');
    expect(toJson({a:{b:2}})).toEqual('{"a":{"b":2}}');
    expect(toJson({a:{b:{c:0}}})).toEqual('{"a":{"b":{"c":0}}}');
    expect(toJson({a:{b:0/0}})).toEqual('{"a":{"b":null}}');
  });

  it('should format objects pretty', function() {
    expect(toJson({a:1,b:2}, true)).toEqual('{\n  "a":1,\n  "b":2}');
    expect(toJson({a:{b:2}}, true)).toEqual('{\n  "a":{\n    "b":2}}');
  });

  it('should serialize array', function() {
    expect(toJson([])).toEqual('[]');
    expect(toJson([1,"b"])).toEqual('[1,"b"]');
  });

  it('should serialize RegExp', function() {
    expect(toJson(/foo/)).toEqual('"/foo/"');
    expect(toJson([1,new RegExp("foo")])).toEqual('[1,"/foo/"]');
  });

  it('should ignore functions', function() {
    expect(toJson([function(){},1])).toEqual('[null,1]');
    expect(toJson({a:function(){}})).toEqual('{}');
  });

  it('should parse null', function() {
    expect(fromJson("null")).toBeNull();
  });

  it('should parse boolean', function() {
    expect(fromJson("true")).toBeTruthy();
    expect(fromJson("false")).toBeFalsy();
  });

  it('should serialize array with empty items', function() {
    var a = [];
    a[1] = "X";
    expect(toJson(a)).toEqual('[null,"X"]');
  });

  it('should escape unicode', function() {
    expect("\u00a0".length).toEqual(1);
    expect(toJson("\u00a0").length).toEqual(8);
    expect(fromJson(toJson("\u00a0")).length).toEqual(1);
  });

  it('should serialize UTC dates', function() {
    var date = angular.String.toDate("2009-10-09T01:02:03.027Z");
    expect(toJson(date)).toEqual('"2009-10-09T01:02:03.027Z"');
    expect(fromJson('"2009-10-09T01:02:03.027Z"').getTime()).toEqual(date.getTime());
  });

  it('should prevent recursion', function() {
    var obj = {a:'b'};
    obj.recursion = obj;
    expect(angular.toJson(obj)).toEqual('{"a":"b","recursion":RECURSION}');
  });

  it('should serialize $ properties', function() {
    var obj = {$a: 'a'};
    expect(angular.toJson(obj)).toEqual('{"$a":"a"}');
  });

  it('should serialize inherited properties', function() {
    var obj = inherit({p:'p'});
    obj.a = 'a';
    expect(angular.toJson(obj)).toEqual('{"a":"a","p":"p"}');
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

  it('should parse floats', function() {
    expect(fromJson("{value:2.55, name:'misko'}")).toEqual({value:2.55, name:'misko'});
  });

  it('should parse negative / possitve numbers', function() {
    expect(fromJson("{neg:-2.55, pos:+.3, a:[-2, +.1, -.2, +.3]}")).toEqual({neg:-2.55, pos:+.3, a:[-2, +.1, -.2, +.3]});
  });

  it('should parse exponents', function() {
    expect(fromJson("{exp:1.2E10}")).toEqual({exp:1.2E10});
    expect(fromJson("{exp:1.2E-10}")).toEqual({exp:1.2E-10});
    expect(fromJson("{exp:1.2e+10}")).toEqual({exp:1.2E10});
    expect(fromJson("{exp:1.2e-10}")).toEqual({exp:1.2E-10});
  });

  describe('security', function(){
    it('should not allow naked expressions', function(){
      expect(function(){fromJson('1+2');}).
        toThrow(new Error("Parse Error: Token '+' is extra token not part of expression at column 2 of expression [1+2] starting at [+2]."));
    });

    it('should not allow naked expressions group', function(){
      expect(function(){fromJson('(1+2)');}).
        toThrow(new Error("Parse Error: Token '(' is not valid json at column 1 of expression [(1+2)] starting at [(1+2)]."));
    });

    it('should not allow expressions in objects', function(){
      expect(function(){fromJson('{a:abc()}');}).
        toThrow(new Error("Parse Error: Token 'abc' is not valid json at column 4 of expression [{a:abc()}] starting at [abc()}]."));
    });

    it('should not allow expressions in arrays', function(){
      expect(function(){fromJson('[1+2]');}).
        toThrow(new Error("Parse Error: Token '+' is not valid json at column 3 of expression [[1+2]] starting at [+2]]."));
    });

    it('should not allow vars', function(){
      expect(function(){fromJson('[1, x]');}).
        toThrow(new Error("Parse Error: Token 'x' is not valid json at column 5 of expression [[1, x]] starting at [x]]."));
    });

    it('should not allow dereference', function(){
      expect(function(){fromJson('["".constructor]');}).
        toThrow(new Error("Parse Error: Token '.' is not valid json at column 4 of expression [[\"\".constructor]] starting at [.constructor]]."));
    });

    it('should not allow expressions ofter valid json', function(){
      expect(function(){fromJson('[].constructor');}).
        toThrow(new Error("Parse Error: Token '.' is not valid json at column 3 of expression [[].constructor] starting at [.constructor]."));
    });
    
    it('should not allow object dereference', function(){
      expect(function(){fromJson('{a:1, b: $location, c:1}');}).toThrow();
      expect(function(){fromJson("{a:1, b:[1]['__parent__']['location'], c:1}");}).toThrow();
    });
    
    it('should not allow assignments', function(){
      expect(function(){fromJson("{a:1, b:[1]=1, c:1}");}).toThrow();
      expect(function(){fromJson("{a:1, b:=1, c:1}");}).toThrow();
      expect(function(){fromJson("{a:1, b:x=1, c:1}");}).toThrow();
    });
    
  });

});
