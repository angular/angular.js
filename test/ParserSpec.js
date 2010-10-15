describe('parser', function(){
  describe('lexer', function(){
    it('should TokenizeAString', function(){
      var tokens = lex("a.bc[22]+1.3|f:'a\\\'c':\"d\\\"e\"");
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
    });

    it('should TokenizeUndefined', function(){
      var tokens = lex("undefined");
      var i = 0;
      assertEquals(tokens[i].index, 0);
      assertEquals(tokens[i].text, 'undefined');
      assertEquals(undefined, tokens[i].fn());
    });



    it('should TokenizeRegExp', function(){
      var tokens = lex("/r 1/");
      var i = 0;
      assertEquals(tokens[i].index, 0);
      assertEquals(tokens[i].text, 'r 1');
      assertEquals("r 1".match(tokens[i].fn())[0], 'r 1');
    });

    it('should QuotedString', function(){
      var str = "['\\'', \"\\\"\"]";
      var tokens = lex(str);

      assertEquals(1, tokens[1].index);
      assertEquals("'", tokens[1].string);

      assertEquals(7, tokens[3].index);
      assertEquals('"', tokens[3].string);
    });

    it('should QuotedStringEscape', function(){
      var str = '"\\"\\n\\f\\r\\t\\v\\u00A0"';
      var tokens = lex(str);

      assertEquals('"\n\f\r\t\v\u00A0', tokens[0].string);
    });

    it('should TokenizeUnicode', function(){
      var tokens = lex('"\\u00A0"');
      assertEquals(1, tokens.length);
      assertEquals('\u00a0', tokens[0].string);
    });

    it('should TokenizeRegExpWithOptions', function(){
      var tokens = lex("/r/g");
      var i = 0;
      assertEquals(tokens[i].index, 0);
      assertEquals(tokens[i].text, 'r');
      assertEquals(tokens[i].flags, 'g');
      assertEquals("rr".match(tokens[i].fn()).length, 2);
    });

    it('should TokenizeRegExpWithEscape', function(){
      var tokens = lex("/\\/\\d/");
      var i = 0;
      assertEquals(tokens[i].index, 0);
      assertEquals(tokens[i].text, '\\/\\d');
      assertEquals("/1".match(tokens[i].fn())[0], '/1');
    });

    it('should IgnoreWhitespace', function(){
      var tokens = lex("a \t \n \r b");
      assertEquals(tokens[0].text, 'a');
      assertEquals(tokens[1].text, 'b');
    });

    it('should Relation', function(){
      var tokens = lex("! == != < > <= >=");
      assertEquals(tokens[0].text, '!');
      assertEquals(tokens[1].text, '==');
      assertEquals(tokens[2].text, '!=');
      assertEquals(tokens[3].text, '<');
      assertEquals(tokens[4].text, '>');
      assertEquals(tokens[5].text, '<=');
      assertEquals(tokens[6].text, '>=');
    });

    it('should Statements', function(){
      var tokens = lex("a;b;");
      assertEquals(tokens[0].text, 'a');
      assertEquals(tokens[1].text, ';');
      assertEquals(tokens[2].text, 'b');
      assertEquals(tokens[3].text, ';');
    });

    it('should Number', function(){
      var tokens = lex("0.5");
      expect(tokens[0].text).toEqual(0.5);
    });

    it('should NegativeNumber', function(){
      var value = createScope().$eval("-0.5");
      expect(value).toEqual(-0.5);

      value = createScope().$eval("{a:-0.5}");
      expect(value).toEqual({a:-0.5});
    });

    it('should NumberExponent', function(){
      var tokens = lex("0.5E-10");
      expect(tokens[0].text).toEqual(0.5E-10);
      expect(createScope().$eval("0.5E-10")).toEqual(0.5E-10);

      tokens = lex("0.5E+10");
      expect(tokens[0].text).toEqual(0.5E+10);
    });

    it('should NumberExponentInvalid', function(){
      assertThrows('Lexer found invalid exponential value "0.5E-"', function(){
        lex("0.5E-");
      });
      assertThrows('Lexer found invalid exponential value "0.5E-A"', function(){
        lex("0.5E-A");
      });
    });

    it('should NumberStartingWithDot', function(){
      var tokens = lex(".5");
      expect(tokens[0].text).toEqual(0.5);
    });

    it('should throw error on invalid unicode', function(){
      assertThrows("Lexer Error: Invalid unicode escape [\\u1''b] starting at column '0' in expression ''\\u1''bla''.", function(){
        lex("'\\u1''bla'");
      });
    });

  });

  it('should parse Expressions', function(){
    var scope = createScope();
    assertEquals(scope.$eval("-1"), -1);
    assertEquals(scope.$eval("1 + 2.5"), 3.5);
    assertEquals(scope.$eval("1 + -2.5"), -1.5);
    assertEquals(scope.$eval("1+2*3/4"), 1+2*3/4);
    assertEquals(scope.$eval("0--1+1.5"), 0- -1 + 1.5);
    assertEquals(scope.$eval("-0--1++2*-3/-4"), -0- -1+ +2*-3/-4);
    assertEquals(scope.$eval("1/2*3"), 1/2*3);
  });

  it('should parse Comparison', function(){
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

  });

  it('should parse Logical', function(){
    var scope = createScope();
    assertEquals(scope.$eval("0&&2"), 0&&2);
    assertEquals(scope.$eval("0||2"), 0||2);
    assertEquals(scope.$eval("0||1&&2"), 0||1&&2);
  });

  it('should parse String', function(){
    var scope = createScope();
    assertEquals(scope.$eval("'a' + 'b c'"), "ab c");
  });

  it('should parse Filters', function(){
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
  });

  it('should parse ScopeAccess', function(){
    var scope = createScope();
    scope.$set('a', 123);
    scope.$set('b.c', 456);
    assertEquals(scope.$eval("a", scope), 123);
    assertEquals(scope.$eval("b.c", scope), 456);
    assertEquals(scope.$eval("x.y.z", scope), undefined);
  });

  it('should parse Grouping', function(){
    var scope = createScope();
    assertEquals(scope.$eval("(1+2)*3"), (1+2)*3);
  });

  it('should parse Assignments', function(){
    var scope = createScope();
    assertEquals(scope.$eval("a=12"), 12);
    assertEquals(scope.$get("a"), 12);

    scope = createScope();
    assertEquals(scope.$eval("x.y.z=123;"), 123);
    assertEquals(scope.$get("x.y.z"), 123);

    assertEquals(234, scope.$eval("a=123; b=234"));
    assertEquals(123, scope.$get("a"));
    assertEquals(234, scope.$get("b"));
  });

  it('should parse FunctionCallsNoArgs', function(){
    var scope = createScope();
    scope.$set('const', function(a,b){return 123;});
    assertEquals(scope.$eval("const()"), 123);
  });

  it('should parse FunctionCalls', function(){
    var scope = createScope();
    scope.$set('add', function(a,b){
      return a+b;
    });
    assertEquals(3, scope.$eval("add(1,2)"));
  });

  it('should parse CalculationBug', function(){
    var scope = createScope();
    scope.$set('taxRate', 8);
    scope.$set('subTotal', 100);
    assertEquals(scope.$eval("taxRate / 100 * subTotal"), 8);
    assertEquals(scope.$eval("subTotal * taxRate / 100"), 8);
  });

  it('should parse Array', function(){
    var scope = createScope();
    assertEquals(scope.$eval("[]").length, 0);
    assertEquals(scope.$eval("[1, 2]").length, 2);
    assertEquals(scope.$eval("[1, 2]")[0], 1);
    assertEquals(scope.$eval("[1, 2]")[1], 2);
  });

  it('should parse ArrayAccess', function(){
    var scope = createScope();
    assertEquals(scope.$eval("[1][0]"), 1);
    assertEquals(scope.$eval("[[1]][0][0]"), 1);
    assertEquals(scope.$eval("[].length"), 0);
    assertEquals(scope.$eval("[1, 2].length"), 2);
  });

  it('should parse Object', function(){
    var scope = createScope();
    assertEquals(toJson(scope.$eval("{}")), "{}");
    assertEquals(toJson(scope.$eval("{a:'b'}")), '{"a":"b"}');
    assertEquals(toJson(scope.$eval("{'a':'b'}")), '{"a":"b"}');
    assertEquals(toJson(scope.$eval("{\"a\":'b'}")), '{"a":"b"}');
  });

  it('should parse ObjectAccess', function(){
    var scope = createScope();
    assertEquals("WC", scope.$eval("{false:'WC', true:'CC'}[false]"));
  });

  it('should parse JSON', function(){
    var scope = createScope();
    assertEquals(toJson(scope.$eval("[{}]")), "[{}]");
    assertEquals(toJson(scope.$eval("[{a:[]}, {b:1}]")), '[{"a":[]},{"b":1}]');
  });

  it('should parse MultippleStatements', function(){
    var scope = createScope();
    assertEquals(scope.$eval("a=1;b=3;a+b"), 4);
    assertEquals(scope.$eval(";;1;;"), 1);
  });

  it('should parse ParseThrow', function(){
    expectAsserts(1);
    var scope = createScope();
    scope.$set('e', 'abc');
    try {
      scope.$eval("throw e");
    } catch(e) {
      assertEquals(e, 'abc');
    }
  });

  it('should parse MethodsGetDispatchedWithCorrectThis', function(){
    var scope = createScope();
    var C = function (){
      this.a=123;
    };
    C.prototype.getA = function(){
      return this.a;
    };

    scope.$set("obj", new C());
    assertEquals(123, scope.$eval("obj.getA()"));
  });
  it('should parse MethodsArgumentsGetCorrectThis', function(){
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
  });

  it('should parse ObjectPointsToScopeValue', function(){
    var scope = createScope();
    scope.$set('a', "abc");
    assertEquals("abc", scope.$eval("{a:a}").a);
  });

  it('should parse FieldAccess', function(){
    var scope = createScope();
    var fn = function(){
        return {name:'misko'};
      };
    scope.$set('a', fn);
    assertEquals("misko", scope.$eval("a().name"));
  });

  it('should parse ArrayIndexBug', function () {
    var scope = createScope();
    scope.$set('items', [{}, {name:'misko'}]);

    assertEquals("misko", scope.$eval('items[1].name'));
  });

  it('should parse ArrayAssignment', function () {
    var scope = createScope();
    scope.$set('items', []);

    assertEquals("abc", scope.$eval('items[1] = "abc"'));
    assertEquals("abc", scope.$eval('items[1]'));
//    Dont know how to make this work....
//    assertEquals("moby", scope.$eval('books[1] = "moby"'));
//    assertEquals("moby", scope.$eval('books[1]'));
  });

  it('should parse FiltersCanBeGrouped', function () {
    var scope = createScope({name:'MISKO'});
    assertEquals('misko', scope.$eval('n = (name|lowercase)'));
    assertEquals('misko', scope.$eval('n'));
  });

  it('should parse Remainder', function () {
    var scope = createScope();
    assertEquals(1, scope.$eval('1%2'));
  });

  it('should parse SumOfUndefinedIsNotUndefined', function () {
    var scope = createScope();
    assertEquals(1, scope.$eval('1+undefined'));
    assertEquals(1, scope.$eval('undefined+1'));
  });

  it('should parse MissingThrowsError', function(){
    var scope = createScope();
    try {
      scope.$eval('[].count(');
      fail();
    } catch (e) {
      assertEquals('Unexpected end of expression: [].count(', e);
    }
  });

  it('should parse DoubleNegationBug', function (){
    var scope = createScope();
    assertEquals(true, scope.$eval('true'));
    assertEquals(false, scope.$eval('!true'));
    assertEquals(true, scope.$eval('!!true'));
    assertEquals('a', scope.$eval('{true:"a", false:"b"}[!!true]'));
  });

  it('should parse NegationBug', function () {
    var scope = createScope();
    assertEquals(!false || true, scope.$eval("!false || true"));
    assertEquals(!11 == 10, scope.$eval("!11 == 10"));
    assertEquals(12/6/2, scope.$eval("12/6/2"));
  });

  it('should parse BugStringConfusesParser', function(){
    var scope = createScope();
    assertEquals('!', scope.$eval('suffix = "!"'));
  });

  it('should parse ParsingBug', function () {
    var scope = createScope();
    assertEquals({a: "-"}, scope.$eval("{a:'-'}"));
  });

  it('should parse Undefined', function () {
    var scope = createScope();
    assertEquals(undefined, scope.$eval("undefined"));
    assertEquals(undefined, scope.$eval("a=undefined"));
    assertEquals(undefined, scope.$get("a"));
  });
});


