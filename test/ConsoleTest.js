ConsoleTest = TestCase('ConsoleTest');

ConsoleTest.prototype.XtestConsoleWrite = function(){
  var consoleNode = jqLite("<div></div>")[0];
  consoleLog("error", ["Hello", "world"]);
  assertEquals(jqLite(consoleNode)[0].nodeName, 'DIV');
  assertEquals(jqLite(consoleNode).text(), 'Hello world');
  assertEquals(jqLite(consoleNode.childNodes[0])[0].className, 'error');
  consoleLog("error",["Bye"]);
  assertEquals(jqLite(consoleNode).text(), 'Hello worldBye');
  consoleNode = null;
};
