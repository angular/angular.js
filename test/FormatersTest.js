TestCase("formaterTest", {
  testNoop: function(){
    assertEquals("abc", angular.formater.noop("abc"));
    assertEquals("xyz", angular.formater.noop("abc", "xyz"));
  }
});
