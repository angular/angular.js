TestCase("formatterTest", {
  testNoop: function(){
    assertEquals("abc", angular.formatter.noop.format("abc"));
    assertEquals("xyz", angular.formatter.noop.parse("xyz"));
    assertEquals(null, angular.formatter.noop.parse(null));
  },
  
  testList: function() {
    assertEquals('a, b', angular.formatter.list.format(['a', 'b']));
    assertEquals('', angular.formatter.list.format([]));
    assertEquals(['abc', 'c'], angular.formatter.list.parse("  , abc , c ,,"));
    assertEquals([], angular.formatter.list.parse(""));
    assertEquals([], angular.formatter.list.parse(null));
  },
  
  testBoolean: function() {
    assertEquals('true', angular.formatter.boolean.format(true));
    assertEquals('false', angular.formatter.boolean.format(false));
    assertEquals(true, angular.formatter.boolean.parse("true"));
    assertEquals(false, angular.formatter.boolean.parse(""));
    assertEquals(false, angular.formatter.boolean.parse("false"));
    assertEquals(null, angular.formatter.boolean.parse(null));
  },
  
  testNumber: function() {
    assertEquals('1', angular.formatter.number.format(1));
    assertEquals(1, angular.formatter.number.format('1'));
  },
  
  testTrim: function() {
    assertEquals('', angular.formatter.trim.format(null));
    assertEquals('', angular.formatter.trim.format(""));
    assertEquals('a', angular.formatter.trim.format(" a "));
    assertEquals('a', angular.formatter.trim.parse(' a '));
  }
  
});
