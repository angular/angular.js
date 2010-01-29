TestCase("formatterTest", {
  testNoop: function(){
    assertEquals("abc", angular.formatter.noop.format("abc"));
    assertEquals("xyz", angular.formatter.noop.parse("xyz"));
    assertEquals(null, angular.formatter.noop.parse(null));
  },
  
  testList: function() {
    assertEquals('a, b', angular.formatter.list.format(['a', 'b']));
    assertEquals(['abc', 'c'], angular.formatter.list.parse("  , abc , c ,,"));
    assertEquals(null, angular.formatter.list.parse(null));
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
  }
  
});
