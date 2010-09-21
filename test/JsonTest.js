JsonTest = TestCase("JsonTest");

JsonTest.prototype.testPrimitives = function () {
  assertEquals("null", toJson(0/0));
  assertEquals("null", toJson(null));
  assertEquals("true", toJson(true));
  assertEquals("false", toJson(false));
  assertEquals("123.45", toJson(123.45));
  assertEquals('"abc"', toJson("abc"));
  assertEquals('"a \\t \\n \\r b \\\\"', toJson("a \t \n \r b \\"));
};

JsonTest.prototype.testEscaping = function () {
  assertEquals("\"7\\\\\\\"7\"", toJson("7\\\"7"));
};

JsonTest.prototype.testObjects = function () {
  assertEquals('{"a":1,"b":2}', toJson({a:1,b:2}));
  assertEquals('{"a":{"b":2}}', toJson({a:{b:2}}));
  assertEquals('{"a":{"b":{"c":0}}}', toJson({a:{b:{c:0}}}));
  assertEquals('{"a":{"b":null}}', toJson({a:{b:0/0}}));
};

JsonTest.prototype.testObjectPretty = function () {
  assertEquals('{\n  "a":1,\n  "b":2}', toJson({a:1,b:2}, true));
  assertEquals('{\n  "a":{\n    "b":2}}', toJson({a:{b:2}}, true));
};

JsonTest.prototype.testArray = function () {
  assertEquals('[]', toJson([]));
  assertEquals('[1,"b"]', toJson([1,"b"]));
};

JsonTest.prototype.testIgnoreFunctions = function () {
  assertEquals('[null,1]', toJson([function(){},1]));
  assertEquals('{}', toJson({a:function(){}}));
};

JsonTest.prototype.testParseNull = function () {
  assertNull(fromJson("null"));
};

JsonTest.prototype.testParseBoolean = function () {
  assertTrue(fromJson("true"));
  assertFalse(fromJson("false"));
};

JsonTest.prototype.test$$isIgnored = function () {
  assertEquals("{}", toJson({$$:0}));
};

JsonTest.prototype.testArrayWithEmptyItems = function () {
  var a = [];
  a[1] = "X";
  assertEquals('[null,"X"]', toJson(a));
};

JsonTest.prototype.testItShouldEscapeUnicode = function () {
  assertEquals(1, "\u00a0".length);
  assertEquals(8, toJson("\u00a0").length);
  assertEquals(1, fromJson(toJson("\u00a0")).length);
};

JsonTest.prototype.testItShouldUTCDates = function() {
  var date = angular.String.toDate("2009-10-09T01:02:03Z");
  assertEquals('"2009-10-09T01:02:03Z"', toJson(date));
  assertEquals(date.getTime(),
      fromJson('"2009-10-09T01:02:03Z"').getTime());
};

JsonTest.prototype.testItShouldPreventRecursion = function () {
  var obj = {a:'b'};
  obj.recursion = obj;
  assertEquals('{"a":"b","recursion":RECURSION}', angular.toJson(obj));
};

JsonTest.prototype.testItShouldIgnore$Properties = function() {
  var scope = createScope();
  scope.a = 'a';
  scope['$b'] = '$b';
  scope.c = 'c';
  expect(angular.toJson(scope)).toEqual('{"a":"a","c":"c","this":RECURSION}');
};

JsonTest.prototype.testItShouldSerializeInheritedProperties = function() {
  var scope = createScope({p:'p'});
  scope.a = 'a';
  expect(angular.toJson(scope)).toEqual('{"a":"a","p":"p","this":RECURSION}');
};

JsonTest.prototype.testItShouldSerializeSameObjectsMultipleTimes = function () {
  var obj = {a:'b'};
  assertEquals('{"A":{"a":"b"},"B":{"a":"b"}}', angular.toJson({A:obj, B:obj}));
};

JsonTest.prototype.testItShouldNotSerializeUndefinedValues = function () {
  assertEquals('{}', angular.toJson({A:undefined}));
};

JsonTest.prototype.testItShouldParseFloats = function () {
  expect(fromJson("{value:2.55, name:'misko'}")).toEqual({value:2.55, name:'misko'});
};
