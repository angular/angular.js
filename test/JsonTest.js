JsonTest = TestCase("JsonTest");

JsonTest.prototype.testPrimitives = function () {
  assertEquals("null", nglr.toJson(0/0));
  assertEquals("null", nglr.toJson(null));
  assertEquals("true", nglr.toJson(true));
  assertEquals("false", nglr.toJson(false));
  assertEquals("123.45", nglr.toJson(123.45));
  assertEquals('"abc"', nglr.toJson("abc"));
  assertEquals('"a \\t \\n \\r b \\\\"', nglr.toJson("a \t \n \r b \\"));
};

JsonTest.prototype.testEscaping = function () {
  assertEquals("\"7\\\\\\\"7\"", nglr.toJson("7\\\"7"));
};

JsonTest.prototype.testObjects = function () {
  assertEquals('{"a":1,"b":2}', nglr.toJson({a:1,b:2}));
  assertEquals('{"a":{"b":2}}', nglr.toJson({a:{b:2}}));
  assertEquals('{"a":{"b":{"c":0}}}', nglr.toJson({a:{b:{c:0}}}));
  assertEquals('{"a":{"b":null}}', nglr.toJson({a:{b:0/0}}));
};

JsonTest.prototype.testObjectPretty = function () {
  assertEquals('{\n  "a":1,\n  "b":2}', nglr.toJson({a:1,b:2}, true));
  assertEquals('{\n  "a":{\n    "b":2}}', nglr.toJson({a:{b:2}}, true));
};

JsonTest.prototype.testArray = function () {
  assertEquals('[]', nglr.toJson([]));
  assertEquals('[1,"b"]', nglr.toJson([1,"b"]));
};

JsonTest.prototype.testIgnoreFunctions = function () {
  assertEquals('[null,1]', nglr.toJson([function(){},1]));
  assertEquals('{}', nglr.toJson({a:function(){}}));
};

JsonTest.prototype.testParseNull = function () {
  assertNull(nglr.fromJson("null"));
};

JsonTest.prototype.testParseBoolean = function () {
  assertTrue(nglr.fromJson("true"));
  assertFalse(nglr.fromJson("false"));
};

JsonTest.prototype.test$$isIgnored = function () {
  assertEquals("{}", nglr.toJson({$$:0}));
};

JsonTest.prototype.testArrayWithEmptyItems = function () {
  var a = [];
  a[1] = "X";
  assertEquals('[null,"X"]', nglr.toJson(a));
};

JsonTest.prototype.testItShouldEscapeUnicode = function () {
  assertEquals(1, "\u00a0".length);
  assertEquals(8, nglr.toJson("\u00a0").length);
  assertEquals(1, nglr.fromJson(nglr.toJson("\u00a0")).length);
};

JsonTest.prototype.testItShouldUTCDates = function() {
  var date = angular.String.toDate("2009-10-09T01:02:03Z");
  assertEquals('"2009-10-09T01:02:03Z"', nglr.toJson(date));  
  assertEquals(date.getTime(), 
      nglr.fromJson('"2009-10-09T01:02:03Z"').getTime());  
};
