ConsoleTest = TestCase('ConsoleTest');

ConsoleTest.prototype.testConsoleWrite = function(){
  consoleNode = $("<div></div>")[0];
  consoleLog("error", ["Hello", "world"]);
  assertEquals($(consoleNode)[0].nodeName, 'DIV');
  assertEquals($(consoleNode).text(), 'Hello world');
  assertEquals($('div', consoleNode)[0].className, 'error');
  consoleLog("error",["Bye"]);
  assertEquals($(consoleNode).text(), 'Hello worldBye');
  consoleNode = null;
};