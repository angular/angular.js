LexerTest = TestCase('LexerTest');

LexerTest.prototype.testTokenizeAString = function(){
  var lexer = new Lexer("a.bc[22]+1.3|f:'a\\\'c':\"d\\\"e\"");
  var tokens = lexer.parse();
  var i = 0;
  assertEquals(tokens[i].index, 0);
  assertEquals(tokens[i].text, 'a.bc');

  i++;
  assertEquals(tokens[i].index, 4);
  assertEquals(tokens[i].text, '[');

  i++;
  assertEquals(tokens[i].index, 5);
  assertEquals(tokens[i].text, 22);

  i++;
  assertEquals(tokens[i].index, 7);
  assertEquals(tokens[i].text, ']');

  i++;
  assertEquals(tokens[i].index, 8);
  assertEquals(tokens[i].text, '+');

  i++;
  assertEquals(tokens[i].index, 9);
  assertEquals(tokens[i].text, 1.3);

  i++;
  assertEquals(tokens[i].index, 12);
  assertEquals(tokens[i].text, '|');

  i++;
  assertEquals(tokens[i].index, 13);
  assertEquals(tokens[i].text, 'f');

  i++;
  assertEquals(tokens[i].index, 14);
  assertEquals(tokens[i].text, ':');

  i++;
  assertEquals(tokens[i].index, 15);
  assertEquals(tokens[i].string, "a'c");

  i++;
  assertEquals(tokens[i].index, 21);
  assertEquals(tokens[i].text, ':');

  i++;
  assertEquals(tokens[i].index, 22);
  assertEquals(tokens[i].string, 'd"e');
};

LexerTest.prototype.testTokenizeUndefined = function(){
  var lexer = new Lexer("undefined");
  var tokens = lexer.parse();
  var i = 0;
  assertEquals(tokens[i].index, 0);
  assertEquals(tokens[i].text, 'undefined');
  assertEquals(undefined, tokens[i].fn());
};



LexerTest.prototype.testTokenizeRegExp = function(){
  var lexer = new Lexer("/r 1/");
  var tokens = lexer.parse();
  var i = 0;
  assertEquals(tokens[i].index, 0);
  assertEquals(tokens[i].text, 'r 1');
  assertEquals("r 1".match(tokens[i].fn())[0], 'r 1');
};

LexerTest.prototype.testQuotedString = function(){
  var str = "['\\'', \"\\\"\"]";
  var lexer = new Lexer(str);
  var tokens = lexer.parse();

  assertEquals(1, tokens[1].index);
  assertEquals("'", tokens[1].string);

  assertEquals(7, tokens[3].index);
  assertEquals('"', tokens[3].string);

};

LexerTest.prototype.testQuotedStringEscape = function(){
  var str = '"\\"\\n\\f\\r\\t\\v\\u00A0"';
  var lexer = new Lexer(str);
  var tokens = lexer.parse();

  assertEquals('"\n\f\r\t\v\u00A0', tokens[0].string);
};

LexerTest.prototype.testTokenizeUnicode = function(){
  var lexer = new Lexer('"\\u00A0"');
  var tokens = lexer.parse();
  assertEquals(1, tokens.length);
  assertEquals('\u00a0', tokens[0].string);
};

LexerTest.prototype.testTokenizeRegExpWithOptions = function(){
  var lexer = new Lexer("/r/g");
  var tokens = lexer.parse();
  var i = 0;
  assertEquals(tokens[i].index, 0);
  assertEquals(tokens[i].text, 'r');
  assertEquals(tokens[i].flags, 'g');
  assertEquals("rr".match(tokens[i].fn()).length, 2);
};

LexerTest.prototype.testTokenizeRegExpWithEscape = function(){
  var lexer = new Lexer("/\\/\\d/");
  var tokens = lexer.parse();
  var i = 0;
  assertEquals(tokens[i].index, 0);
  assertEquals(tokens[i].text, '\\/\\d');
  assertEquals("/1".match(tokens[i].fn())[0], '/1');
};

LexerTest.prototype.testIgnoreWhitespace = function(){
  var lexer = new Lexer("a \t \n \r b");
  var tokens = lexer.parse();
  assertEquals(tokens[0].text, 'a');
  assertEquals(tokens[1].text, 'b');
};

LexerTest.prototype.testRelation = function(){
  var lexer = new Lexer("! == != < > <= >=");
  var tokens = lexer.parse();
  assertEquals(tokens[0].text, '!');
  assertEquals(tokens[1].text, '==');
  assertEquals(tokens[2].text, '!=');
  assertEquals(tokens[3].text, '<');
  assertEquals(tokens[4].text, '>');
  assertEquals(tokens[5].text, '<=');
  assertEquals(tokens[6].text, '>=');
};

LexerTest.prototype.testStatements = function(){
  var lexer = new Lexer("a;b;");
  var tokens = lexer.parse();
  assertEquals(tokens[0].text, 'a');
  assertEquals(tokens[1].text, ';');
  assertEquals(tokens[2].text, 'b');
  assertEquals(tokens[3].text, ';');
};

ParserTest = TestCase('ParserTest');

ParserTest.prototype.testExpressions = function(){
  var scope = createScope();
  assertEquals(scope.$eval("-1"), -1);
  assertEquals(scope.$eval("1 + 2.5"), 3.5);
  assertEquals(scope.$eval("1 + -2.5"), -1.5);
  assertEquals(scope.$eval("1+2*3/4"), 1+2*3/4);
  assertEquals(scope.$eval("0--1+1.5"), 0- -1 + 1.5);
  assertEquals(scope.$eval("-0--1++2*-3/-4"), -0- -1+ +2*-3/-4);
  assertEquals(scope.$eval("1/2*3"), 1/2*3);
};

ParserTest.prototype.testComparison = function(){
  var scope = createScope();
  assertEquals(scope.$eval("false"), false);
  assertEquals(scope.$eval("!true"), false);
  assertEquals(scope.$eval("1==1"), true);
  assertEquals(scope.$eval("1!=2"), true);
  assertEquals(scope.$eval("1<2"), true);
  assertEquals(scope.$eval("1<=1"), true);
  assertEquals(scope.$eval("1>2"), 1>2);
  assertEquals(scope.$eval("2>=1"), 2>=1);

  assertEquals(true === 2<3, scope.$eval("true==2<3"));

};

ParserTest.prototype.testLogical = function(){
  var scope = createScope();
  assertEquals(scope.$eval("0&&2"), 0&&2);
  assertEquals(scope.$eval("0||2"), 0||2);
  assertEquals(scope.$eval("0||1&&2"), 0||1&&2);
};

ParserTest.prototype.testString = function(){
  var scope = createScope();
  assertEquals(scope.$eval("'a' + 'b c'"), "ab c");
};

ParserTest.prototype.testFilters = function(){
  angular.filter.substring = function(input, start, end) {
    return input.substring(start, end);
  };

  angular.filter.upper = {_case:function(input) {
    return input.toUpperCase();
  }};
  var scope = createScope();
  try {
    scope.$eval("1|nonExistant");
    fail();
  } catch (e) {
    assertEquals(e, "Function 'nonExistant' at column '3' in '1|nonExistant' is not defined.");
  }
  scope.$set('offset', 3);
  assertEquals(scope.$eval("'abcd'|upper._case"), "ABCD");
  assertEquals(scope.$eval("'abcd'|substring:1:offset"), "bc");
  assertEquals(scope.$eval("'abcd'|substring:1:3|upper._case"), "BC");
};

ParserTest.prototype.testScopeAccess = function(){
  var scope = createScope();
  scope.$set('a', 123);
  scope.$set('b.c', 456);
  assertEquals(scope.$eval("a", scope), 123);
  assertEquals(scope.$eval("b.c", scope), 456);
  assertEquals(scope.$eval("x.y.z", scope), undefined);
};

ParserTest.prototype.testGrouping = function(){
  var scope = createScope();
  assertEquals(scope.$eval("(1+2)*3"), (1+2)*3);
};

ParserTest.prototype.testAssignments = function(){
  var scope = createScope();
  assertEquals(scope.$eval("a=12"), 12);
  assertEquals(scope.$get("a"), 12);

  scope = createScope();
  assertEquals(scope.$eval("x.y.z=123;"), 123);
  assertEquals(scope.$get("x.y.z"), 123);

  assertEquals(234, scope.$eval("a=123; b=234"));
  assertEquals(123, scope.$get("a"));
  assertEquals(234, scope.$get("b"));
};

ParserTest.prototype.testFunctionCallsNoArgs = function(){
  var scope = createScope();
  scope.$set('const', function(a,b){return 123;});
  assertEquals(scope.$eval("const()"), 123);
};

ParserTest.prototype.testFunctionCalls = function(){
  var scope = createScope();
  scope.$set('add', function(a,b){
    return a+b;
  });
  assertEquals(3, scope.$eval("add(1,2)"));
};

ParserTest.prototype.testCalculationBug = function(){
  var scope = createScope();
  scope.$set('taxRate', 8);
  scope.$set('subTotal', 100);
  assertEquals(scope.$eval("taxRate / 100 * subTotal"), 8);
  assertEquals(scope.$eval("subTotal * taxRate / 100"), 8);
};

ParserTest.prototype.testArray = function(){
  var scope = createScope();
  assertEquals(scope.$eval("[]").length, 0);
  assertEquals(scope.$eval("[1, 2]").length, 2);
  assertEquals(scope.$eval("[1, 2]")[0], 1);
  assertEquals(scope.$eval("[1, 2]")[1], 2);
};

ParserTest.prototype.testArrayAccess = function(){
  var scope = createScope();
  assertEquals(scope.$eval("[1][0]"), 1);
  assertEquals(scope.$eval("[[1]][0][0]"), 1);
  assertEquals(scope.$eval("[].length"), 0);
  assertEquals(scope.$eval("[1, 2].length"), 2);
};

ParserTest.prototype.testObject = function(){
  var scope = createScope();
  assertEquals(toJson(scope.$eval("{}")), "{}");
  assertEquals(toJson(scope.$eval("{a:'b'}")), '{"a":"b"}');
  assertEquals(toJson(scope.$eval("{'a':'b'}")), '{"a":"b"}');
  assertEquals(toJson(scope.$eval("{\"a\":'b'}")), '{"a":"b"}');
};

ParserTest.prototype.testObjectAccess = function(){
  var scope = createScope();
  assertEquals("WC", scope.$eval("{false:'WC', true:'CC'}[false]"));
};

ParserTest.prototype.testJSON = function(){
  var scope = createScope();
  assertEquals(toJson(scope.$eval("[{}]")), "[{}]");
  assertEquals(toJson(scope.$eval("[{a:[]}, {b:1}]")), '[{"a":[]},{"b":1}]');
};

ParserTest.prototype.testMultippleStatements = function(){
  var scope = createScope();
  assertEquals(scope.$eval("a=1;b=3;a+b"), 4);
  assertEquals(scope.$eval(";;1;;"), 1);
};

ParserTest.prototype.testParseThrow = function(){
  expectAsserts(1);
  var scope = createScope();
  scope.$set('e', 'abc');
  try {
    scope.$eval("throw e");
  } catch(e) {
    assertEquals(e, 'abc');
  }
};

ParserTest.prototype.testMethodsGetDispatchedWithCorrectThis = function(){
  var scope = createScope();
  var C = function (){
    this.a=123;
  };
  C.prototype.getA = function(){
    return this.a;
  };

  scope.$set("obj", new C());
  assertEquals(123, scope.$eval("obj.getA()"));
};
ParserTest.prototype.testMethodsArgumentsGetCorrectThis = function(){
  var scope = createScope();
  var C = function (){
    this.a=123;
  };
  C.prototype.sum = function(value){
    return this.a + value;
  };
  C.prototype.getA = function(){
    return this.a;
  };

  scope.$set("obj", new C());
  assertEquals(246, scope.$eval("obj.sum(obj.getA())"));
};

ParserTest.prototype.testObjectPointsToScopeValue = function(){
  var scope = createScope();
  scope.$set('a', "abc");
  assertEquals("abc", scope.$eval("{a:a}").a);
};

ParserTest.prototype.testFieldAccess = function(){
  var scope = createScope();
  var fn = function(){
      return {name:'misko'};
    };
  scope.$set('a', fn);
  assertEquals("misko", scope.$eval("a().name"));
};

ParserTest.prototype.testArrayIndexBug = function () {
  var scope = createScope();
  scope.$set('items', [{}, {name:'misko'}]);

  assertEquals("misko", scope.$eval('items[1].name'));
};

ParserTest.prototype.testArrayAssignment = function () {
  var scope = createScope();
  scope.$set('items', []);

  assertEquals("abc", scope.$eval('items[1] = "abc"'));
  assertEquals("abc", scope.$eval('items[1]'));
//  Dont know how to make this work....
//  assertEquals("moby", scope.$eval('books[1] = "moby"'));
//  assertEquals("moby", scope.$eval('books[1]'));
};

ParserTest.prototype.testFiltersCanBeGrouped = function () {
  var scope = createScope({name:'MISKO'});
  assertEquals('misko', scope.$eval('n = (name|lowercase)'));
  assertEquals('misko', scope.$eval('n'));
};

ParserTest.prototype.testFiltersCanBeGrouped = function () {
  var scope = createScope({name:'MISKO'});
  assertEquals('misko', scope.$eval('n = (name|lowercase)'));
  assertEquals('misko', scope.$eval('n'));
};

ParserTest.prototype.testRemainder = function () {
  var scope = createScope();
  assertEquals(1, scope.$eval('1%2'));
};

ParserTest.prototype.testSumOfUndefinedIsNotUndefined = function () {
  var scope = createScope();
  assertEquals(1, scope.$eval('1+undefined'));
  assertEquals(1, scope.$eval('undefined+1'));
};

ParserTest.prototype.testMissingThrowsError = function() {
  var scope = createScope();
  try {
    scope.$eval('[].count(');
    fail();
  } catch (e) {
    assertEquals('Unexpected end of expression: [].count(', e);
  }
};

ParserTest.prototype.testItShouldCreateClosureFunctionWithNoArguments = function () {
  var scope = createScope();
  var fn = scope.$eval("{:value}");
  scope.$set("value", 1);
  assertEquals(1, fn());
  scope.$set("value", 2);
  assertEquals(2, fn());
  fn = scope.$eval("{():value}");
  assertEquals(2, fn());
};

ParserTest.prototype.testItShouldCreateClosureFunctionWithArguments = function () {
  var scope = createScope();
  scope.$set("value", 1);
  var fn = scope.$eval("{(a):value+a}");
  assertEquals(11, fn(10));
  scope.$set("value", 2);
  assertEquals(12, fn(10));
  fn = scope.$eval("{(a,b):value+a+b}");
  assertEquals(112, fn(10, 100));
};

ParserTest.prototype.testItShouldHaveDefaultArugument = function(){
  var scope = createScope();
  var fn = scope.$eval("{:$*2}");
  assertEquals(4, fn(2));
};

ParserTest.prototype.testDoubleNegationBug = function (){
  var scope = createScope();
  assertEquals(true, scope.$eval('true'));
  assertEquals(false, scope.$eval('!true'));
  assertEquals(true, scope.$eval('!!true'));
  assertEquals('a', scope.$eval('{true:"a", false:"b"}[!!true]'));
};

ParserTest.prototype.testNegationBug = function () {
  var scope = createScope();
  assertEquals(!false || true, scope.$eval("!false || true"));
  assertEquals(!11 == 10, scope.$eval("!11 == 10"));
  assertEquals(12/6/2, scope.$eval("12/6/2"));
};

ParserTest.prototype.testBugStringConfusesParser = function() {
  var scope = createScope();
  assertEquals('!', scope.$eval('suffix = "!"'));
};

ParserTest.prototype.testParsingBug = function () {
  var scope = createScope();
  assertEquals({a: "-"}, scope.$eval("{a:'-'}"));
};

ParserTest.prototype.testUndefined = function () {
  var scope = createScope();
  assertEquals(undefined, scope.$eval("undefined"));
  assertEquals(undefined, scope.$eval("a=undefined"));
  assertEquals(undefined, scope.$get("a"));
};
