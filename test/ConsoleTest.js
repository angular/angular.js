ConsoleTest = TestCase('ConsoleTest');

ConsoleTest.prototype.testConsoleWrite = function(){
  var consoleNode = $("<div></div>")[0];
  nglr.consoleNode = consoleNode;
  nglr.consoleLog("error", ["Hello", "world"]);
  assertEquals($(consoleNode)[0].nodeName, 'DIV');
  assertEquals($(consoleNode).text(), 'Hello world');
  assertEquals($('div', consoleNode)[0].className, 'error');
  nglr.consoleLog("error",["Bye"]);
  assertEquals($(consoleNode).text(), 'Hello worldBye');
  nglr.consoleNode = null;
};