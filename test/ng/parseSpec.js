'use strict';

describe('parser', function() {

  beforeEach(function() {
    /* global getterFnCache: true */
    // clear cache
    getterFnCache = createMap();
  });


  describe('lexer', function() {
    var lex;

    beforeEach(function() {
      /* global Lexer: false */
      lex = function() {
        var lexer = new Lexer({csp: false});
        return lexer.lex.apply(lexer, arguments);
      };
    });

    it('should tokenize a string', function() {
      var tokens = lex("a.bc[22]+1.3|f:'a\\\'c':\"d\\\"e\"");
      var i = 0;
      expect(tokens[i].index).toEqual(0);
      expect(tokens[i].text).toEqual('a.bc');

      i++;
      expect(tokens[i].index).toEqual(4);
      expect(tokens[i].text).toEqual('[');

      i++;
      expect(tokens[i].index).toEqual(5);
      expect(tokens[i].text).toEqual(22);

      i++;
      expect(tokens[i].index).toEqual(7);
      expect(tokens[i].text).toEqual(']');

      i++;
      expect(tokens[i].index).toEqual(8);
      expect(tokens[i].text).toEqual('+');

      i++;
      expect(tokens[i].index).toEqual(9);
      expect(tokens[i].text).toEqual(1.3);

      i++;
      expect(tokens[i].index).toEqual(12);
      expect(tokens[i].text).toEqual('|');

      i++;
      expect(tokens[i].index).toEqual(13);
      expect(tokens[i].text).toEqual('f');

      i++;
      expect(tokens[i].index).toEqual(14);
      expect(tokens[i].text).toEqual(':');

      i++;
      expect(tokens[i].index).toEqual(15);
      expect(tokens[i].string).toEqual("a'c");

      i++;
      expect(tokens[i].index).toEqual(21);
      expect(tokens[i].text).toEqual(':');

      i++;
      expect(tokens[i].index).toEqual(22);
      expect(tokens[i].string).toEqual('d"e');
    });

    it('should tokenize identifiers with spaces after dots', function() {
      var tokens = lex('foo. bar');
      expect(tokens[0].text).toEqual('foo');
      expect(tokens[1].text).toEqual('.');
      expect(tokens[2].text).toEqual('bar');
    });

    it('should tokenize undefined', function() {
      var tokens = lex("undefined");
      var i = 0;
      expect(tokens[i].index).toEqual(0);
      expect(tokens[i].text).toEqual('undefined');
      expect(undefined).toEqual(tokens[i].fn());
    });

    it('should tokenize quoted string', function() {
      var str = "['\\'', \"\\\"\"]";
      var tokens = lex(str);

      expect(tokens[1].index).toEqual(1);
      expect(tokens[1].string).toEqual("'");

      expect(tokens[3].index).toEqual(7);
      expect(tokens[3].string).toEqual('"');
    });

    it('should tokenize escaped quoted string', function() {
      var str = '"\\"\\n\\f\\r\\t\\v\\u00A0"';
      var tokens = lex(str);

      expect(tokens[0].string).toEqual('"\n\f\r\t\v\u00A0');
    });

    it('should tokenize unicode', function() {
      var tokens = lex('"\\u00A0"');
      expect(tokens.length).toEqual(1);
      expect(tokens[0].string).toEqual('\u00a0');
    });

    it('should ignore whitespace', function() {
      var tokens = lex("a \t \n \r b");
      expect(tokens[0].text).toEqual('a');
      expect(tokens[1].text).toEqual('b');
    });

    it('should tokenize relation and equality', function() {
      var tokens = lex("! == != < > <= >= === !==");
      expect(tokens[0].text).toEqual('!');
      expect(tokens[1].text).toEqual('==');
      expect(tokens[2].text).toEqual('!=');
      expect(tokens[3].text).toEqual('<');
      expect(tokens[4].text).toEqual('>');
      expect(tokens[5].text).toEqual('<=');
      expect(tokens[6].text).toEqual('>=');
      expect(tokens[7].text).toEqual('===');
      expect(tokens[8].text).toEqual('!==');
    });

    it('should tokenize logical and ternary', function() {
      var tokens = lex("&& || ? :");
      expect(tokens[0].text).toEqual('&&');
      expect(tokens[1].text).toEqual('||');
      expect(tokens[2].text).toEqual('?');
      expect(tokens[3].text).toEqual(':');
    });

    it('should tokenize statements', function() {
      var tokens = lex("a;b;");
      expect(tokens[0].text).toEqual('a');
      expect(tokens[1].text).toEqual(';');
      expect(tokens[2].text).toEqual('b');
      expect(tokens[3].text).toEqual(';');
    });

    it('should tokenize function invocation', function() {
      var tokens = lex("a()");
      expect(tokens.map(function(t) { return t.text;})).toEqual(['a', '(', ')']);
    });

    it('should tokenize method invocation', function() {
      var tokens = lex("a.b.c (d) - e.f()");
      expect(tokens.map(function(t) { return t.text;})).
          toEqual(['a.b', '.', 'c',  '(', 'd', ')', '-', 'e', '.', 'f', '(', ')']);
    });

    it('should tokenize number', function() {
      var tokens = lex("0.5");
      expect(tokens[0].text).toEqual(0.5);
    });

    it('should tokenize negative number', inject(function($rootScope) {
      var value = $rootScope.$eval("-0.5");
      expect(value).toEqual(-0.5);

      value = $rootScope.$eval("{a:-0.5}");
      expect(value).toEqual({a:-0.5});
    }));

    it('should tokenize number with exponent', inject(function($rootScope) {
      var tokens = lex("0.5E-10");
      expect(tokens[0].text).toEqual(0.5E-10);
      expect($rootScope.$eval("0.5E-10")).toEqual(0.5E-10);

      tokens = lex("0.5E+10");
      expect(tokens[0].text).toEqual(0.5E+10);
    }));

    it('should throws exception for invalid exponent', function() {
      expect(function() {
        lex("0.5E-");
      }).toThrowMinErr('$parse', 'lexerr', 'Lexer Error: Invalid exponent at column 4 in expression [0.5E-].');

      expect(function() {
        lex("0.5E-A");
      }).toThrowMinErr('$parse', 'lexerr', 'Lexer Error: Invalid exponent at column 4 in expression [0.5E-A].');
    });

    it('should tokenize number starting with a dot', function() {
      var tokens = lex(".5");
      expect(tokens[0].text).toEqual(0.5);
    });

    it('should throw error on invalid unicode', function() {
      expect(function() {
        lex("'\\u1''bla'");
      }).toThrowMinErr("$parse", "lexerr", "Lexer Error: Invalid unicode escape [\\u1''b] at column 2 in expression ['\\u1''bla'].");
    });
  });

  var $filterProvider, scope;

  beforeEach(module(['$filterProvider', function(filterProvider) {
    $filterProvider = filterProvider;
  }]));


  forEach([true, false], function(cspEnabled) {
    describe('csp: ' + cspEnabled, function() {

      beforeEach(module(function($provide) {
        $provide.decorator('$sniffer', function($delegate) {
          $delegate.csp = cspEnabled;
          return $delegate;
        });
      }, provideLog));

      beforeEach(inject(function($rootScope) {
        scope = $rootScope;
      }));

      it('should parse expressions', function() {
        /*jshint -W006, -W007 */
        expect(scope.$eval("-1")).toEqual(-1);
        expect(scope.$eval("1 + 2.5")).toEqual(3.5);
        expect(scope.$eval("1 + -2.5")).toEqual(-1.5);
        expect(scope.$eval("1+2*3/4")).toEqual(1+2*3/4);
        expect(scope.$eval("0--1+1.5")).toEqual(0- -1 + 1.5);
        expect(scope.$eval("-0--1++2*-3/-4")).toEqual(-0- -1+ +2*-3/-4);
        expect(scope.$eval("1/2*3")).toEqual(1/2*3);
      });

      it('should parse comparison', function() {
        /* jshint -W041 */
        expect(scope.$eval("false")).toBeFalsy();
        expect(scope.$eval("!true")).toBeFalsy();
        expect(scope.$eval("1==1")).toBeTruthy();
        expect(scope.$eval("1==true")).toBeTruthy();
        expect(scope.$eval("1===1")).toBeTruthy();
        expect(scope.$eval("1==='1'")).toBeFalsy();
        expect(scope.$eval("1===true")).toBeFalsy();
        expect(scope.$eval("'true'===true")).toBeFalsy();
        expect(scope.$eval("1!==2")).toBeTruthy();
        expect(scope.$eval("1!=='1'")).toBeTruthy();
        expect(scope.$eval("1!=2")).toBeTruthy();
        expect(scope.$eval("1<2")).toBeTruthy();
        expect(scope.$eval("1<=1")).toBeTruthy();
        expect(scope.$eval("1>2")).toEqual(1>2);
        expect(scope.$eval("2>=1")).toEqual(2>=1);
        expect(scope.$eval("true==2<3")).toEqual(true == 2<3);
        expect(scope.$eval("true===2<3")).toEqual(true === 2<3);
      });

      it('should parse logical', function() {
        expect(scope.$eval("0&&2")).toEqual(0&&2);
        expect(scope.$eval("0||2")).toEqual(0||2);
        expect(scope.$eval("0||1&&2")).toEqual(0||1&&2);
      });

      it('should parse ternary', function() {
        var returnTrue = scope.returnTrue = function() { return true; };
        var returnFalse = scope.returnFalse = function() { return false; };
        var returnString = scope.returnString = function() { return 'asd'; };
        var returnInt = scope.returnInt = function() { return 123; };
        var identity = scope.identity = function(x) { return x; };

        // Simple.
        expect(scope.$eval('0?0:2')).toEqual(0?0:2);
        expect(scope.$eval('1?0:2')).toEqual(1?0:2);

        // Nested on the left.
        expect(scope.$eval('0?0?0:0:2')).toEqual(0?0?0:0:2);
        expect(scope.$eval('1?0?0:0:2')).toEqual(1?0?0:0:2);
        expect(scope.$eval('0?1?0:0:2')).toEqual(0?1?0:0:2);
        expect(scope.$eval('0?0?1:0:2')).toEqual(0?0?1:0:2);
        expect(scope.$eval('0?0?0:2:3')).toEqual(0?0?0:2:3);
        expect(scope.$eval('1?1?0:0:2')).toEqual(1?1?0:0:2);
        expect(scope.$eval('1?1?1:0:2')).toEqual(1?1?1:0:2);
        expect(scope.$eval('1?1?1:2:3')).toEqual(1?1?1:2:3);
        expect(scope.$eval('1?1?1:2:3')).toEqual(1?1?1:2:3);

        // Nested on the right.
        expect(scope.$eval('0?0:0?0:2')).toEqual(0?0:0?0:2);
        expect(scope.$eval('1?0:0?0:2')).toEqual(1?0:0?0:2);
        expect(scope.$eval('0?1:0?0:2')).toEqual(0?1:0?0:2);
        expect(scope.$eval('0?0:1?0:2')).toEqual(0?0:1?0:2);
        expect(scope.$eval('0?0:0?2:3')).toEqual(0?0:0?2:3);
        expect(scope.$eval('1?1:0?0:2')).toEqual(1?1:0?0:2);
        expect(scope.$eval('1?1:1?0:2')).toEqual(1?1:1?0:2);
        expect(scope.$eval('1?1:1?2:3')).toEqual(1?1:1?2:3);
        expect(scope.$eval('1?1:1?2:3')).toEqual(1?1:1?2:3);

        // Precedence with respect to logical operators.
        expect(scope.$eval('0&&1?0:1')).toEqual(0&&1?0:1);
        expect(scope.$eval('1||0?0:0')).toEqual(1||0?0:0);

        expect(scope.$eval('0?0&&1:2')).toEqual(0?0&&1:2);
        expect(scope.$eval('0?1&&1:2')).toEqual(0?1&&1:2);
        expect(scope.$eval('0?0||0:1')).toEqual(0?0||0:1);
        expect(scope.$eval('0?0||1:2')).toEqual(0?0||1:2);

        expect(scope.$eval('1?0&&1:2')).toEqual(1?0&&1:2);
        expect(scope.$eval('1?1&&1:2')).toEqual(1?1&&1:2);
        expect(scope.$eval('1?0||0:1')).toEqual(1?0||0:1);
        expect(scope.$eval('1?0||1:2')).toEqual(1?0||1:2);

        expect(scope.$eval('0?1:0&&1')).toEqual(0?1:0&&1);
        expect(scope.$eval('0?2:1&&1')).toEqual(0?2:1&&1);
        expect(scope.$eval('0?1:0||0')).toEqual(0?1:0||0);
        expect(scope.$eval('0?2:0||1')).toEqual(0?2:0||1);

        expect(scope.$eval('1?1:0&&1')).toEqual(1?1:0&&1);
        expect(scope.$eval('1?2:1&&1')).toEqual(1?2:1&&1);
        expect(scope.$eval('1?1:0||0')).toEqual(1?1:0||0);
        expect(scope.$eval('1?2:0||1')).toEqual(1?2:0||1);

        // Function calls.
        expect(scope.$eval('returnTrue() ? returnString() : returnInt()')).toEqual(returnTrue() ? returnString() : returnInt());
        expect(scope.$eval('returnFalse() ? returnString() : returnInt()')).toEqual(returnFalse() ? returnString() : returnInt());
        expect(scope.$eval('returnTrue() ? returnString() : returnInt()')).toEqual(returnTrue() ? returnString() : returnInt());
        expect(scope.$eval('identity(returnFalse() ? returnString() : returnInt())')).toEqual(identity(returnFalse() ? returnString() : returnInt()));
      });

      it('should parse string', function() {
        expect(scope.$eval("'a' + 'b c'")).toEqual("ab c");
      });

      it('should parse filters', function() {
        $filterProvider.register('substring', valueFn(function(input, start, end) {
          return input.substring(start, end);
        }));

        expect(function() {
          scope.$eval("1|nonexistent");
        }).toThrowMinErr('$injector', 'unpr', 'Unknown provider: nonexistentFilterProvider <- nonexistentFilter');

        scope.offset =  3;
        expect(scope.$eval("'abcd'|substring:1:offset")).toEqual("bc");
        expect(scope.$eval("'abcd'|substring:1:3|uppercase")).toEqual("BC");
      });

      it('should access scope', function() {
        scope.a =  123;
        scope.b = {c: 456};
        expect(scope.$eval("a", scope)).toEqual(123);
        expect(scope.$eval("b.c", scope)).toEqual(456);
        expect(scope.$eval("x.y.z", scope)).not.toBeDefined();
      });

      it('should handle white-spaces around dots in paths', function() {
        scope.a = {b: 4};
        expect(scope.$eval("a . b", scope)).toEqual(4);
        expect(scope.$eval("a. b", scope)).toEqual(4);
        expect(scope.$eval("a .b", scope)).toEqual(4);
        expect(scope.$eval("a    . \nb", scope)).toEqual(4);
      });

      it('should throw syntax error exception for identifiers ending with a dot', function() {
        scope.a = {b: 4};

        expect(function() {
          scope.$eval("a.", scope);
        }).toThrowMinErr('$parse', 'syntax',
          "Token 'null' is an unexpected token at column 2 of the expression [a.] starting at [.].");

        expect(function() {
          scope.$eval("a .", scope);
        }).toThrowMinErr('$parse', 'syntax',
          "Token 'null' is an unexpected token at column 3 of the expression [a .] starting at [.].");
      });

      it('should resolve deeply nested paths (important for CSP mode)', function() {
        scope.a = {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: {l: {m: {n: 'nooo!'}}}}}}}}}}}}};
        expect(scope.$eval("a.b.c.d.e.f.g.h.i.j.k.l.m.n", scope)).toBe('nooo!');
      });

      forEach([2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 42, 99], function(pathLength) {
        it('should resolve nested paths of length ' + pathLength, function() {
          // Create a nested object {x2: {x3: {x4: ... {x[n]: 42} ... }}}.
          var obj = 42, locals = {};
          for (var i = pathLength; i >= 2; i--) {
            var newObj = {};
            newObj['x' + i] = obj;
            obj = newObj;
          }
          // Assign to x1 and build path 'x1.x2.x3. ... .x[n]' to access the final value.
          scope.x1 = obj;
          var path = 'x1';
          for (i = 2; i <= pathLength; i++) {
            path += '.x' + i;
          }
          expect(scope.$eval(path)).toBe(42);
          locals['x' + pathLength] = 'not 42';
          expect(scope.$eval(path, locals)).toBe(42);
        });
      });

      it('should be forgiving', function() {
        scope.a = {b: 23};
        expect(scope.$eval('b')).toBeUndefined();
        expect(scope.$eval('a.x')).toBeUndefined();
        expect(scope.$eval('a.b.c.d')).toBeUndefined();
      });

      it('should support property names that collide with native object properties', function() {
        // regression
        scope.watch = 1;
        scope.toString = function toString() {
          return "custom toString";
        };

        expect(scope.$eval('watch', scope)).toBe(1);
        expect(scope.$eval('toString()', scope)).toBe('custom toString');
      });

      it('should not break if hasOwnProperty is referenced in an expression', function() {
        scope.obj = { value: 1};
        // By evaluating an expression that calls hasOwnProperty, the getterFnCache
        // will store a property called hasOwnProperty.  This is effectively:
        // getterFnCache['hasOwnProperty'] = null
        scope.$eval('obj.hasOwnProperty("value")');
        // If we rely on this property then evaluating any expression will fail
        // because it is not able to find out if obj.value is there in the cache
        expect(scope.$eval('obj.value')).toBe(1);
      });

      it('should not break if the expression is "hasOwnProperty"', function() {
        scope.fooExp = 'barVal';
        // By evaluating hasOwnProperty, the $parse cache will store a getter for
        // the scope's own hasOwnProperty function, which will mess up future cache look ups.
        // i.e. cache['hasOwnProperty'] = function(scope) { return scope.hasOwnProperty; }
        scope.$eval('hasOwnProperty');
        expect(scope.$eval('fooExp')).toBe('barVal');
      });

      it('should evaluate grouped expressions', function() {
        expect(scope.$eval("(1+2)*3")).toEqual((1+2)*3);
      });

      it('should evaluate assignments', function() {
        expect(scope.$eval("a=12")).toEqual(12);
        expect(scope.a).toEqual(12);

        expect(scope.$eval("x.y.z=123;")).toEqual(123);
        expect(scope.x.y.z).toEqual(123);

        expect(scope.$eval("a=123; b=234")).toEqual(234);
        expect(scope.a).toEqual(123);
        expect(scope.b).toEqual(234);
      });

        it('should evaluate assignments in ternary operator', function() {
          scope.$eval('a = 1 ? 2 : 3');
          expect(scope.a).toBe(2);

          scope.$eval('0 ? a = 2 : a = 3');
          expect(scope.a).toBe(3);

          scope.$eval('1 ? a = 2 : a = 3');
          expect(scope.a).toBe(2);
        });

      it('should evaluate function call without arguments', function() {
        scope['const'] =  function(a, b) {return 123;};
        expect(scope.$eval("const()")).toEqual(123);
      });

      it('should evaluate function call with arguments', function() {
        scope.add =  function(a, b) {
          return a+b;
        };
        expect(scope.$eval("add(1,2)")).toEqual(3);
      });

      it('should evaluate function call from a return value', function() {
        scope.val = 33;
        scope.getter = function() { return function() { return this.val; }; };
        expect(scope.$eval("getter()()")).toBe(33);
      });

      it('should evaluate multiplication and division', function() {
        scope.taxRate =  8;
        scope.subTotal =  100;
        expect(scope.$eval("taxRate / 100 * subTotal")).toEqual(8);
        expect(scope.$eval("subTotal * taxRate / 100")).toEqual(8);
      });

      it('should evaluate array', function() {
        expect(scope.$eval("[]").length).toEqual(0);
        expect(scope.$eval("[1, 2]").length).toEqual(2);
        expect(scope.$eval("[1, 2]")[0]).toEqual(1);
        expect(scope.$eval("[1, 2]")[1]).toEqual(2);
        expect(scope.$eval("[1, 2,]")[1]).toEqual(2);
        expect(scope.$eval("[1, 2,]").length).toEqual(2);
      });

      it('should evaluate array access', function() {
        expect(scope.$eval("[1][0]")).toEqual(1);
        expect(scope.$eval("[[1]][0][0]")).toEqual(1);
        expect(scope.$eval("[].length")).toEqual(0);
        expect(scope.$eval("[1, 2].length")).toEqual(2);
      });

      it('should evaluate object', function() {
        expect(toJson(scope.$eval("{}"))).toEqual("{}");
        expect(toJson(scope.$eval("{a:'b'}"))).toEqual('{"a":"b"}');
        expect(toJson(scope.$eval("{'a':'b'}"))).toEqual('{"a":"b"}');
        expect(toJson(scope.$eval("{\"a\":'b'}"))).toEqual('{"a":"b"}');
        expect(toJson(scope.$eval("{a:'b',}"))).toEqual('{"a":"b"}');
        expect(toJson(scope.$eval("{'a':'b',}"))).toEqual('{"a":"b"}');
        expect(toJson(scope.$eval("{\"a\":'b',}"))).toEqual('{"a":"b"}');
      });

      it('should evaluate object access', function() {
        expect(scope.$eval("{false:'WC', true:'CC'}[false]")).toEqual("WC");
      });

      it('should evaluate JSON', function() {
        expect(toJson(scope.$eval("[{}]"))).toEqual("[{}]");
        expect(toJson(scope.$eval("[{a:[]}, {b:1}]"))).toEqual('[{"a":[]},{"b":1}]');
      });

      it('should evaluate multiple statements', function() {
        expect(scope.$eval("a=1;b=3;a+b")).toEqual(4);
        expect(scope.$eval(";;1;;")).toEqual(1);
      });

      it('should evaluate object methods in correct context (this)', function() {
        var C = function() {
          this.a = 123;
        };
        C.prototype.getA = function() {
          return this.a;
        };

        scope.obj = new C();
        expect(scope.$eval("obj.getA()")).toEqual(123);
        expect(scope.$eval("obj['getA']()")).toEqual(123);
      });

      it('should evaluate methods in correct context (this) in argument', function() {
        var C = function() {
          this.a = 123;
        };
        C.prototype.sum = function(value) {
          return this.a + value;
        };
        C.prototype.getA = function() {
          return this.a;
        };

        scope.obj = new C();
        expect(scope.$eval("obj.sum(obj.getA())")).toEqual(246);
        expect(scope.$eval("obj['sum'](obj.getA())")).toEqual(246);
      });

      it('should evaluate objects on scope context', function() {
        scope.a =  "abc";
        expect(scope.$eval("{a:a}").a).toEqual("abc");
      });

      it('should evaluate field access on function call result', function() {
        scope.a =  function() {
          return {name:'misko'};
        };
        expect(scope.$eval("a().name")).toEqual("misko");
      });

      it('should evaluate field access after array access', function() {
        scope.items =  [{}, {name:'misko'}];
        expect(scope.$eval('items[1].name')).toEqual("misko");
      });

      it('should evaluate array assignment', function() {
        scope.items =  [];

        expect(scope.$eval('items[1] = "abc"')).toEqual("abc");
        expect(scope.$eval('items[1]')).toEqual("abc");
    //    Dont know how to make this work....
    //    expect(scope.$eval('books[1] = "moby"')).toEqual("moby");
    //    expect(scope.$eval('books[1]')).toEqual("moby");
      });

      it('should evaluate grouped filters', function() {
        scope.name = 'MISKO';
        expect(scope.$eval('n = (name|lowercase)')).toEqual('misko');
        expect(scope.$eval('n')).toEqual('misko');
      });

      it('should evaluate remainder', function() {
        expect(scope.$eval('1%2')).toEqual(1);
      });

      it('should evaluate sum with undefined', function() {
        expect(scope.$eval('1+undefined')).toEqual(1);
        expect(scope.$eval('undefined+1')).toEqual(1);
      });

      it('should throw exception on non-closed bracket', function() {
        expect(function() {
          scope.$eval('[].count(');
        }).toThrowMinErr('$parse', 'ueoe', 'Unexpected end of expression: [].count(');
      });

      it('should evaluate double negation', function() {
        expect(scope.$eval('true')).toBeTruthy();
        expect(scope.$eval('!true')).toBeFalsy();
        expect(scope.$eval('!!true')).toBeTruthy();
        expect(scope.$eval('{true:"a", false:"b"}[!!true]')).toEqual('a');
      });

      it('should evaluate negation', function() {
        /* jshint -W018 */
        expect(scope.$eval("!false || true")).toEqual(!false || true);
        expect(scope.$eval("!11 == 10")).toEqual(!11 == 10);
        expect(scope.$eval("12/6/2")).toEqual(12/6/2);
      });

      it('should evaluate exclamation mark', function() {
        expect(scope.$eval('suffix = "!"')).toEqual('!');
      });

      it('should evaluate minus', function() {
        expect(scope.$eval("{a:'-'}")).toEqual({a: "-"});
      });

      it('should evaluate undefined', function() {
        expect(scope.$eval("undefined")).not.toBeDefined();
        expect(scope.$eval("a=undefined")).not.toBeDefined();
        expect(scope.a).not.toBeDefined();
      });

      it('should allow assignment after array dereference', function() {
        scope.obj = [{}];
        scope.$eval('obj[0].name=1');
        expect(scope.obj.name).toBeUndefined();
        expect(scope.obj[0].name).toEqual(1);
      });

      it('should short-circuit AND operator', function() {
        scope.run = function() {
          throw "IT SHOULD NOT HAVE RUN";
        };
        expect(scope.$eval('false && run()')).toBe(false);
      });

      it('should short-circuit OR operator', function() {
        scope.run = function() {
          throw "IT SHOULD NOT HAVE RUN";
        };
        expect(scope.$eval('true || run()')).toBe(true);
      });


      it('should support method calls on primitive types', function() {
        scope.empty = '';
        scope.zero = 0;
        scope.bool = false;

        expect(scope.$eval('empty.substr(0)')).toBe('');
        expect(scope.$eval('zero.toString()')).toBe('0');
        expect(scope.$eval('bool.toString()')).toBe('false');
      });

      it('should evaluate expressions with line terminators', function() {
        scope.a = "a";
        scope.b = {c: "bc"};
        expect(scope.$eval('a + \n b.c + \r "\td" + \t \r\n\r "\r\n\n"')).toEqual("abc\td\r\n\n");
      });

      describe('sandboxing', function() {
        describe('Function constructor', function() {
          it('should NOT allow access to Function constructor in getter', function() {

            expect(function() {
              scope.$eval('{}.toString.constructor("alert(1)")');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: {}.toString.constructor("alert(1)")');

          });

          it('should NOT allow access to Function constructor in setter', function() {

            expect(function() {
              scope.$eval('{}.toString.constructor.a = 1');
            }).toThrowMinErr(
                    '$parse', 'isecfn','Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: {}.toString.constructor.a = 1');

            expect(function() {
              scope.$eval('{}.toString["constructor"]["constructor"] = 1');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: {}.toString["constructor"]["constructor"] = 1');

            scope.key1 = "const";
            scope.key2 = "ructor";
            expect(function() {
              scope.$eval('{}.toString[key1 + key2].foo = 1');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: {}.toString[key1 + key2].foo = 1');

            expect(function() {
              scope.$eval('{}.toString["constructor"]["a"] = 1');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: {}.toString["constructor"]["a"] = 1');

            scope.a = [];
            expect(function() {
              scope.$eval('a.toString.constructor = 1', scope);
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: a.toString.constructor');
          });

          it('should disallow traversing the Function object in a setter: E02', function() {
            expect(function() {
              // This expression by itself isn't dangerous.  However, one can use this to
              // automatically call an object (e.g. a Function object) when it is automatically
              // toString'd/valueOf'd by setting the RHS to Function.prototype.call.
              scope.$eval('hasOwnProperty.constructor.prototype.valueOf = 1');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: hasOwnProperty.constructor.prototype.valueOf');
          });

          it('should disallow passing the Function object as a parameter: E03', function() {
            expect(function() {
              // This expression constructs a function but does not execute it.  It does lead the
              // way to execute it if one can get the toString/valueOf of it to call the function.
              scope.$eval('["a", "alert(1)"].sort(hasOwnProperty.constructor)');
            }).toThrow();
          });

          it('should prevent exploit E01', function() {
            // This is a tracking exploit.  The two individual tests, it('should … : E02') and
            // it('should … : E03') test for two parts to block this exploit.  This exploit works
            // as follows:
            //
            // • Array.sort takes a comparison function and passes it 2 parameters to compare.  If
            //   the result is non-primitive, sort then invokes valueOf() on the result.
            // • The Function object conveniently accepts two string arguments so we can use this
            //   to construct a function.  However, this doesn't do much unless we can execute it.
            // • We set the valueOf property on Function.prototype to Function.prototype.call.
            //   This causes the function that we constructed to be executed when sort calls
            //   .valueOf() on the result of the comparison.
            expect(function() {
              scope.$eval('' +
                'hasOwnProperty.constructor.prototype.valueOf=valueOf.call;' +
                '["a","alert(1)"].sort(hasOwnProperty.constructor)');
            }).toThrow();
          });

          it('should NOT allow access to Function constructor that has been aliased', function() {
            scope.foo = { "bar": Function };
            expect(function() {
              scope.$eval('foo["bar"]');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: foo["bar"]');

          });
        });

        describe('Function prototype functions', function() {
          it('should NOT allow invocation to Function.call', function() {
            scope.fn = Function.prototype.call;

            expect(function() {
              scope.$eval('$eval.call()');
            }).toThrowMinErr(
                    '$parse', 'isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! ' +
                    'Expression: $eval.call()');

            expect(function() {
              scope.$eval('fn()');
            }).toThrowMinErr(
              '$parse', 'isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! ' +
                'Expression: fn()');
          });

          it('should NOT allow invocation to Function.apply', function() {
            scope.apply = Function.prototype.apply;

            expect(function() {
              scope.$eval('$eval.apply()');
            }).toThrowMinErr(
              '$parse', 'isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! ' +
                'Expression: $eval.apply()');

            expect(function() {
              scope.$eval('apply()');
            }).toThrowMinErr(
              '$parse', 'isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! ' +
                'Expression: apply()');
          });

          it('should NOT allow invocation to Function.bind', function() {
            scope.bind = Function.prototype.bind;

            expect(function() {
              scope.$eval('$eval.bind()');
            }).toThrowMinErr(
              '$parse', 'isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! ' +
                'Expression: $eval.bind()');

            expect(function() {
              scope.$eval('bind()');
            }).toThrowMinErr(
              '$parse', 'isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! ' +
                'Expression: bind()');
          });
        });

        describe('Object constructor', function() {

          it('should NOT allow access to Object constructor that has been aliased', function() {
            scope.foo = { "bar": Object };

            expect(function() {
              scope.$eval('foo.bar.keys(foo)');
            }).toThrowMinErr(
                    '$parse', 'isecobj', 'Referencing Object in Angular expressions is disallowed! ' +
                    'Expression: foo.bar.keys(foo)');

            expect(function() {
              scope.$eval('foo["bar"]["keys"](foo)');
            }).toThrowMinErr(
                    '$parse', 'isecobj', 'Referencing Object in Angular expressions is disallowed! ' +
                    'Expression: foo["bar"]["keys"](foo)');
          });
        });

        describe('Window and $element/node', function() {
          it('should NOT allow access to the Window or DOM when indexing', inject(function($window, $document) {
            scope.wrap = {w: $window, d: $document};

            expect(function() {
              scope.$eval('wrap["w"]', scope);
            }).toThrowMinErr(
                    '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is ' +
                    'disallowed! Expression: wrap["w"]');
            expect(function() {
              scope.$eval('wrap["d"]', scope);
            }).toThrowMinErr(
                    '$parse', 'isecdom', 'Referencing DOM nodes in Angular expressions is ' +
                    'disallowed! Expression: wrap["d"]');
          }));

          it('should NOT allow access to the Window or DOM returned from a function', inject(function($window, $document) {
            scope.getWin = valueFn($window);
            scope.getDoc = valueFn($document);

            expect(function() {
              scope.$eval('getWin()', scope);
            }).toThrowMinErr(
                    '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is ' +
                    'disallowed! Expression: getWin()');
            expect(function() {
              scope.$eval('getDoc()', scope);
            }).toThrowMinErr(
                    '$parse', 'isecdom', 'Referencing DOM nodes in Angular expressions is ' +
                    'disallowed! Expression: getDoc()');
          }));

          it('should NOT allow calling functions on Window or DOM', inject(function($window, $document) {
            scope.a = {b: { win: $window, doc: $document }};
            expect(function() {
              scope.$eval('a.b.win.alert(1)', scope);
            }).toThrowMinErr(
                    '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is ' +
                    'disallowed! Expression: a.b.win.alert(1)');
            expect(function() {
              scope.$eval('a.b.doc.on("click")', scope);
            }).toThrowMinErr(
                    '$parse', 'isecdom', 'Referencing DOM nodes in Angular expressions is ' +
                    'disallowed! Expression: a.b.doc.on("click")');
          }));

          // Issue #4805
          it('should NOT throw isecdom when referencing a Backbone Collection', function() {
            // Backbone stuff is sort of hard to mock, if you have a better way of doing this,
            // please fix this.
            var fakeBackboneCollection = {
              children: [{}, {}, {}],
              find: function() {},
              on: function() {},
              off: function() {},
              bind: function() {}
            };
            scope.backbone = fakeBackboneCollection;
            expect(function() { scope.$eval('backbone'); }).not.toThrow();
          });

          it('should NOT throw isecdom when referencing an array with node properties', function() {
            var array = [1,2,3];
            array.on = array.attr = array.prop = array.bind = true;
            scope.array = array;
            expect(function() { scope.$eval('array'); }).not.toThrow();
          });
        });

        describe('Disallowed fields', function() {
          it('should NOT allow access or invocation of __defineGetter__', function() {
            expect(function() {
              scope.$eval('{}.__defineGetter__');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}.__defineGetter__("a", "".charAt)');
            }).toThrowMinErr('$parse', 'isecfld');

            expect(function() {
              scope.$eval('{}["__defineGetter__"]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}["__defineGetter__"]("a", "".charAt)');
            }).toThrowMinErr('$parse', 'isecfld');

            scope.a = "__define";
            scope.b = "Getter__";
            expect(function() {
              scope.$eval('{}[a + b]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}[a + b]("a", "".charAt)');
            }).toThrowMinErr('$parse', 'isecfld');
          });

          it('should NOT allow access or invocation of __defineSetter__', function() {
            expect(function() {
              scope.$eval('{}.__defineSetter__');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}.__defineSetter__("a", "".charAt)');
            }).toThrowMinErr('$parse', 'isecfld');

            expect(function() {
              scope.$eval('{}["__defineSetter__"]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}["__defineSetter__"]("a", "".charAt)');
            }).toThrowMinErr('$parse', 'isecfld');

            scope.a = "__define";
            scope.b = "Setter__";
            expect(function() {
              scope.$eval('{}[a + b]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}[a + b]("a", "".charAt)');
            }).toThrowMinErr('$parse', 'isecfld');
          });

          it('should NOT allow access or invocation of __lookupGetter__', function() {
            expect(function() {
              scope.$eval('{}.__lookupGetter__');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}.__lookupGetter__("a")');
            }).toThrowMinErr('$parse', 'isecfld');

            expect(function() {
              scope.$eval('{}["__lookupGetter__"]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}["__lookupGetter__"]("a")');
            }).toThrowMinErr('$parse', 'isecfld');

            scope.a = "__lookup";
            scope.b = "Getter__";
            expect(function() {
              scope.$eval('{}[a + b]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}[a + b]("a")');
            }).toThrowMinErr('$parse', 'isecfld');
          });

          it('should NOT allow access or invocation of __lookupSetter__', function() {
            expect(function() {
              scope.$eval('{}.__lookupSetter__');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}.__lookupSetter__("a")');
            }).toThrowMinErr('$parse', 'isecfld');

            expect(function() {
              scope.$eval('{}["__lookupSetter__"]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}["__lookupSetter__"]("a")');
            }).toThrowMinErr('$parse', 'isecfld');

            scope.a = "__lookup";
            scope.b = "Setter__";
            expect(function() {
              scope.$eval('{}[a + b]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}[a + b]("a")');
            }).toThrowMinErr('$parse', 'isecfld');
          });

          it('should NOT allow access to __proto__', function() {
            expect(function() {
              scope.$eval('{}.__proto__');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}.__proto__.foo = 1');
            }).toThrowMinErr('$parse', 'isecfld');

            expect(function() {
              scope.$eval('{}["__proto__"]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}["__proto__"].foo = 1');
            }).toThrowMinErr('$parse', 'isecfld');

            scope.a = "__pro";
            scope.b = "to__";
            expect(function() {
              scope.$eval('{}[a + b]');
            }).toThrowMinErr('$parse', 'isecfld');
            expect(function() {
              scope.$eval('{}[a + b].foo = 1');
            }).toThrowMinErr('$parse', 'isecfld');
          });
        });

        it('should prevent the exploit', function() {
          expect(function() {
            scope.$eval('' +
              ' "".sub.call.call(' +
                '({})["constructor"].getOwnPropertyDescriptor("".sub.__proto__, "constructor").value,' +
                'null,' +
                '"alert(1)"' +
              ')()' +
              '');
          }).toThrow();
        });
      });

      it('should call the function from the received instance and not from a new one', function() {
        var n = 0;
        scope.fn = function() {
          var c = n++;
          return { c: c, anotherFn: function() { return this.c == c; } };
        };
        expect(scope.$eval('fn().anotherFn()')).toBe(true);
      });


      it('should call the function once when it is part of the context', function() {
        var count = 0;
        scope.fn = function() {
          count++;
          return { anotherFn: function() { return "lucas"; } };
        };
        expect(scope.$eval('fn().anotherFn()')).toBe('lucas');
        expect(count).toBe(1);
      });


      it('should call the function once when it is not part of the context', function() {
        var count = 0;
        scope.fn = function() {
          count++;
          return function() { return 'lucas'; };
        };
        expect(scope.$eval('fn()()')).toBe('lucas');
        expect(count).toBe(1);
      });


      it('should call the function once when it is part of the context on assignments', function() {
        var count = 0;
        var element = {};
        scope.fn = function() {
          count++;
          return element;
        };
        expect(scope.$eval('fn().name = "lucas"')).toBe('lucas');
        expect(element.name).toBe('lucas');
        expect(count).toBe(1);
      });


      it('should call the function once when it is part of the context on array lookups', function() {
        var count = 0;
        var element = [];
        scope.fn = function() {
          count++;
          return element;
        };
        expect(scope.$eval('fn()[0] = "lucas"')).toBe('lucas');
        expect(element[0]).toBe('lucas');
        expect(count).toBe(1);
      });


      it('should call the function once when it is part of the context on array lookup function', function() {
        var count = 0;
        var element = [{anotherFn: function() { return 'lucas';} }];
        scope.fn = function() {
          count++;
          return element;
        };
        expect(scope.$eval('fn()[0].anotherFn()')).toBe('lucas');
        expect(count).toBe(1);
      });


      it('should call the function once when it is part of the context on property lookup function', function() {
        var count = 0;
        var element = {name: {anotherFn: function() { return 'lucas';} } };
        scope.fn = function() {
          count++;
          return element;
        };
        expect(scope.$eval('fn().name.anotherFn()')).toBe('lucas');
        expect(count).toBe(1);
      });


      it('should call the function once when it is part of a sub-expression', function() {
        var count = 0;
        scope.element = [{}];
        scope.fn = function() {
          count++;
          return 0;
        };
        expect(scope.$eval('element[fn()].name = "lucas"')).toBe('lucas');
        expect(scope.element[0].name).toBe('lucas');
        expect(count).toBe(1);
      });


      describe('assignable', function() {
        it('should expose assignment function', inject(function($parse) {
          var fn = $parse('a');
          expect(fn.assign).toBeTruthy();
          var scope = {};
          fn.assign(scope, 123);
          expect(scope).toEqual({a:123});
        }));

        it('should expose working assignment function for expressions ending with brackets', inject(function($parse) {
          var fn = $parse('a.b["c"]');
          expect(fn.assign).toBeTruthy();
          var scope = {};
          fn.assign(scope, 123);
          expect(scope.a.b.c).toEqual(123);
        }));

        it('should expose working assignment function for expressions with brackets in the middle', inject(function($parse) {
          var fn = $parse('a["b"].c');
          expect(fn.assign).toBeTruthy();
          var scope = {};
          fn.assign(scope, 123);
          expect(scope.a.b.c).toEqual(123);
        }));
      });

      describe('one-time binding', function() {
        it('should always use the cache', inject(function($parse) {
          expect($parse('foo')).toBe($parse('foo'));
          expect($parse('::foo')).toBe($parse('::foo'));
        }));

        it('should not affect calling the parseFn directly', inject(function($parse, $rootScope) {
          var fn = $parse('::foo');
          $rootScope.$watch(fn);

          $rootScope.foo = 'bar';
          expect($rootScope.$$watchers.length).toBe(1);
          expect(fn($rootScope)).toEqual('bar');

          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(0);
          expect(fn($rootScope)).toEqual('bar');

          $rootScope.foo = 'man';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(0);
          expect(fn($rootScope)).toEqual('man');

          $rootScope.foo = 'shell';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(0);
          expect(fn($rootScope)).toEqual('shell');
        }));

        it('should stay stable once the value defined', inject(function($parse, $rootScope, log) {
          var fn = $parse('::foo');
          $rootScope.$watch(fn, function(value, old) { if (value !== old) log(value); });

          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(1);

          $rootScope.foo = 'bar';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(0);
          expect(log).toEqual('bar');
          log.reset();

          $rootScope.foo = 'man';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(0);
          expect(log).toEqual('');
        }));

        it('should have a stable value if at the end of a $digest it has a defined value', inject(function($parse, $rootScope, log) {
          var fn = $parse('::foo');
          $rootScope.$watch(fn, function(value, old) { if (value !== old) log(value); });
          $rootScope.$watch('foo', function() { if ($rootScope.foo === 'bar') {$rootScope.foo = undefined; } });

          $rootScope.foo = 'bar';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(2);
          expect(log).toEqual('');

          $rootScope.foo = 'man';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(1);
          expect(log).toEqual('; man');

          $rootScope.foo = 'shell';
          $rootScope.$digest();
          expect($rootScope.$$watchers.length).toBe(1);
          expect(log).toEqual('; man');
        }));

        it('should not throw if the stable value is `null`', inject(function($parse, $rootScope) {
          var fn = $parse('::foo');
          $rootScope.$watch(fn);
          $rootScope.foo = null;
          $rootScope.$digest();
          $rootScope.foo = 'foo';
          $rootScope.$digest();
          expect(fn()).toEqual(null);
        }));

        describe('literal expressions', function() {
          it('should only become stable when all the properties of an object have defined values', inject(function($parse, $rootScope, log) {
            var fn = $parse('::{foo: foo, bar: bar}');
            $rootScope.$watch(fn, function(value) { log(value); }, true);

            expect(log.empty()).toEqual([]);
            expect($rootScope.$$watchers.length).toBe(1);

            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(1);
            expect(log.empty()).toEqual([{foo: undefined, bar: undefined}]);

            $rootScope.foo = 'foo';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(1);
            expect(log.empty()).toEqual([{foo: 'foo', bar: undefined}]);

            $rootScope.foo = 'foobar';
            $rootScope.bar = 'bar';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(0);
            expect(log.empty()).toEqual([{foo: 'foobar', bar: 'bar'}]);

            $rootScope.foo = 'baz';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(0);
            expect(log.empty()).toEqual([]);
          }));

          it('should only become stable when all the elements of an array have defined values', inject(function($parse, $rootScope, log) {
            var fn = $parse('::[foo,bar]');
            $rootScope.$watch(fn, function(value) { log(value); }, true);

            expect(log.empty()).toEqual([]);
            expect($rootScope.$$watchers.length).toBe(1);

            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(1);
            expect(log.empty()).toEqual([[undefined, undefined]]);

            $rootScope.foo = 'foo';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(1);
            expect(log.empty()).toEqual([['foo', undefined]]);

            $rootScope.foo = 'foobar';
            $rootScope.bar = 'bar';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(0);
            expect(log.empty()).toEqual([['foobar', 'bar']]);

            $rootScope.foo = 'baz';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(0);
            expect(log.empty()).toEqual([]);
          }));

          it('should only become stable when all the elements of an array have defined values at the end of a $digest', inject(function($parse, $rootScope, log) {
            var fn = $parse('::[foo]');
            $rootScope.$watch(fn, function(value) { log(value); }, true);
            $rootScope.$watch('foo', function() { if ($rootScope.foo === 'bar') {$rootScope.foo = undefined; } });

            $rootScope.foo = 'bar';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(2);
            expect(log.empty()).toEqual([['bar'], [undefined]]);

            $rootScope.foo = 'baz';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(1);
            expect(log.empty()).toEqual([['baz']]);

            $rootScope.bar = 'qux';
            $rootScope.$digest();
            expect($rootScope.$$watchers.length).toBe(1);
            expect(log).toEqual([]);
          }));

        });
      });


      describe('watched $parse expressions', function() {

        it('should respect short-circuiting AND if it could have side effects', function() {
          var bCalled = 0;
          scope.b = function() { bCalled++; };

          scope.$watch("a && b()");
          scope.$digest();
          scope.$digest();
          expect(bCalled).toBe(0);

          scope.a = true;
          scope.$digest();
          expect(bCalled).toBe(1);
          scope.$digest();
          expect(bCalled).toBe(2);
        });

        it('should respect short-circuiting OR if it could have side effects', function() {
          var bCalled = false;
          scope.b = function() { bCalled = true; };

          scope.$watch("a || b()");
          scope.$digest();
          expect(bCalled).toBe(true);

          bCalled = false;
          scope.a = true;
          scope.$digest();
          expect(bCalled).toBe(false);
        });

        it('should respect the branching ternary operator if it could have side effects', function() {
          var bCalled = false;
          scope.b = function() { bCalled = true; };

          scope.$watch("a ? b() : 1");
          scope.$digest();
          expect(bCalled).toBe(false);

          scope.a = true;
          scope.$digest();
          expect(bCalled).toBe(true);
        });

        it('should not invoke filters unless the input/arguments change', function() {
          var filterCalled = false;
          $filterProvider.register('foo', valueFn(function(input) {
            filterCalled = true;
            return input;
          }));

          scope.$watch("a | foo:b:1");
          scope.a = 0;
          scope.$digest();
          expect(filterCalled).toBe(true);

          filterCalled = false;
          scope.$digest();
          expect(filterCalled).toBe(false);

          scope.a++;
          scope.$digest();
          expect(filterCalled).toBe(true);
        });

        it('should invoke filters if they are marked as having $stateful', function() {
          var filterCalled = false;
          $filterProvider.register('foo', valueFn(extend(function(input) {
            filterCalled = true;
            return input;
          }, {$stateful: true})));

          scope.$watch("a | foo:b:1");
          scope.a = 0;
          scope.$digest();
          expect(filterCalled).toBe(true);

          filterCalled = false;
          scope.$digest();
          expect(filterCalled).toBe(true);
        });

        it('should not invoke interceptorFns unless the input changes', inject(function($parse) {
          var called = false;
          function interceptor(v) {
            called = true;
            return v;
          }
          scope.$watch($parse("a", interceptor));
          scope.a = scope.b = 0;
          scope.$digest();
          expect(called).toBe(true);

          called = false;
          scope.$digest();
          expect(called).toBe(false);

          scope.a++;
          scope.$digest();
          expect(called).toBe(true);
        }));

        it('should treat filters with constant input as constants', inject(function($parse) {
          var filterCalls = 0;
          $filterProvider.register('foo', valueFn(function(input) {
            filterCalls++;
            return input;
          }));

          var parsed = $parse('{x: 1} | foo:1');

          expect(parsed.constant).toBe(true);

          var watcherCalls = 0;
          scope.$watch(parsed, function(input) {
            expect(input).toEqual({x:1});
            watcherCalls++;
          });

          scope.$digest();
          expect(filterCalls).toBe(1);
          expect(watcherCalls).toBe(1);

          scope.$digest();
          expect(filterCalls).toBe(1);
          expect(watcherCalls).toBe(1);
        }));

        it("should always reevaluate filters with non-primitive input that doesn't support valueOf()",
            inject(function($parse) {
          var filterCalls = 0;
          $filterProvider.register('foo', valueFn(function(input) {
            filterCalls++;
            return input;
          }));

          var parsed = $parse('obj | foo');
          var obj = scope.obj = {};

          var watcherCalls = 0;
          scope.$watch(parsed, function(input) {
            expect(input).toBe(obj);
            watcherCalls++;
          });

          scope.$digest();
          expect(filterCalls).toBe(2);
          expect(watcherCalls).toBe(1);

          scope.$digest();
          expect(filterCalls).toBe(3);
          expect(watcherCalls).toBe(1);
        }));

        it("should always reevaluate filters with non-primitive input created with null prototype",
            inject(function($parse) {
          var filterCalls = 0;
          $filterProvider.register('foo', valueFn(function(input) {
            filterCalls++;
            return input;
          }));

          var parsed = $parse('obj | foo');
          var obj = scope.obj = Object.create(null);

          var watcherCalls = 0;
          scope.$watch(parsed, function(input) {
            expect(input).toBe(obj);
            watcherCalls++;
          });

          scope.$digest();
          expect(filterCalls).toBe(2);
          expect(watcherCalls).toBe(1);

          scope.$digest();
          expect(filterCalls).toBe(3);
          expect(watcherCalls).toBe(1);
        }));

        it("should not reevaluate filters with non-primitive input that does support valueOf()",
            inject(function($parse) {
          var filterCalls = 0;
          $filterProvider.register('foo', valueFn(function(input) {
            filterCalls++;
            return input;
          }));

          var parsed = $parse('date | foo');
          var date = scope.date = new Date();

          var watcherCalls = 0;
          scope.$watch(parsed, function(input) {
            expect(input).toBe(date);
            watcherCalls++;
          });

          scope.$digest();
          expect(filterCalls).toBe(1);
          expect(watcherCalls).toBe(1);

          scope.$digest();
          expect(filterCalls).toBe(1);
          expect(watcherCalls).toBe(1);
        }));

        it("should reevaluate filters with non-primitive input that does support valueOf() when" +
           "valueOf() value changes", inject(function($parse) {
          var filterCalls = 0;
          $filterProvider.register('foo', valueFn(function(input) {
            filterCalls++;
            return input;
          }));

          var parsed = $parse('date | foo');
          var date = scope.date = new Date();

          var watcherCalls = 0;
          scope.$watch(parsed, function(input) {
            expect(input).toBe(date);
            watcherCalls++;
          });

          scope.$digest();
          expect(filterCalls).toBe(1);
          expect(watcherCalls).toBe(1);

          date.setYear(1901);

          scope.$digest();
          expect(filterCalls).toBe(2);
          expect(watcherCalls).toBe(1);
        }));

        it('should invoke interceptorFns if they are flagged as having $stateful',
            inject(function($parse) {
          var called = false;
          function interceptor() {
            called = true;
          }
          interceptor.$stateful = true;

          scope.$watch($parse("a", interceptor));
          scope.a = 0;
          scope.$digest();
          expect(called).toBe(true);

          called = false;
          scope.$digest();
          expect(called).toBe(true);

          scope.a++;
          called = false;
          scope.$digest();
          expect(called).toBe(true);
        }));
      });

      describe('locals', function() {
        it('should expose local variables', inject(function($parse) {
          expect($parse('a')({a: 0}, {a: 1})).toEqual(1);
          expect($parse('add(a,b)')({b: 1, add: function(a, b) { return a + b; }}, {a: 2})).toEqual(3);
        }));

        it('should expose traverse locals', inject(function($parse) {
          expect($parse('a.b')({a: {b: 0}}, {a: {b:1}})).toEqual(1);
          expect($parse('a.b')({a: null}, {a: {b:1}})).toEqual(1);
          expect($parse('a.b')({a: {b: 0}}, {a: null})).toEqual(undefined);
          expect($parse('a.b.c')({a: null}, {a: {b: {c: 1}}})).toEqual(1);
        }));

        it('should not use locals to resolve object properties', inject(function($parse) {
          expect($parse('a[0].b')({a: [ {b: 'scope'} ]}, {b: 'locals'})).toBe('scope');
          expect($parse('a[0]["b"]')({a: [ {b: 'scope'} ]}, {b: 'locals'})).toBe('scope');
          expect($parse('a[0][0].b')({a: [[{b: 'scope'}]]}, {b: 'locals'})).toBe('scope');
          expect($parse('a[0].b.c')({a: [ {b: {c: 'scope'}}] }, {b: {c: 'locals'} })).toBe('scope');
        }));
      });

      describe('literal', function() {
        it('should mark scalar value expressions as literal', inject(function($parse) {
          expect($parse('0').literal).toBe(true);
          expect($parse('"hello"').literal).toBe(true);
          expect($parse('true').literal).toBe(true);
          expect($parse('false').literal).toBe(true);
          expect($parse('null').literal).toBe(true);
          expect($parse('undefined').literal).toBe(true);
        }));

        it('should mark array expressions as literal', inject(function($parse) {
          expect($parse('[]').literal).toBe(true);
          expect($parse('[1, 2, 3]').literal).toBe(true);
          expect($parse('[1, identifier]').literal).toBe(true);
        }));

        it('should mark object expressions as literal', inject(function($parse) {
          expect($parse('{}').literal).toBe(true);
          expect($parse('{x: 1}').literal).toBe(true);
          expect($parse('{foo: bar}').literal).toBe(true);
        }));

        it('should not mark function calls or operator expressions as literal', inject(function($parse) {
          expect($parse('1 + 1').literal).toBe(false);
          expect($parse('call()').literal).toBe(false);
          expect($parse('[].length').literal).toBe(false);
        }));
      });

      describe('constant', function() {
        it('should mark scalar value expressions as constant', inject(function($parse) {
          expect($parse('12.3').constant).toBe(true);
          expect($parse('"string"').constant).toBe(true);
          expect($parse('true').constant).toBe(true);
          expect($parse('false').constant).toBe(true);
          expect($parse('null').constant).toBe(true);
          expect($parse('undefined').constant).toBe(true);
        }));

        it('should mark arrays as constant if they only contain constant elements', inject(function($parse) {
          expect($parse('[]').constant).toBe(true);
          expect($parse('[1, 2, 3]').constant).toBe(true);
          expect($parse('["string", null]').constant).toBe(true);
          expect($parse('[[]]').constant).toBe(true);
          expect($parse('[1, [2, 3], {4: 5}]').constant).toBe(true);
        }));

        it('should not mark arrays as constant if they contain any non-constant elements', inject(function($parse) {
          expect($parse('[foo]').constant).toBe(false);
          expect($parse('[x + 1]').constant).toBe(false);
          expect($parse('[bar[0]]').constant).toBe(false);
        }));

        it('should mark complex expressions involving constant values as constant', inject(function($parse) {
          expect($parse('!true').constant).toBe(true);
          expect($parse('-42').constant).toBe(true);
          expect($parse('1 - 1').constant).toBe(true);
          expect($parse('"foo" + "bar"').constant).toBe(true);
          expect($parse('5 != null').constant).toBe(true);
          expect($parse('{standard: 4/3, wide: 16/9}').constant).toBe(true);
        }));

        it('should not mark any expression involving variables or function calls as constant', inject(function($parse) {
          expect($parse('true.toString()').constant).toBe(false);
          expect($parse('foo(1, 2, 3)').constant).toBe(false);
          expect($parse('"name" + id').constant).toBe(false);
        }));
      });

      describe('null/undefined in expressions', function() {
        // simpleGetterFn1
        it('should return null for `a` where `a` is null', inject(function($rootScope) {
          $rootScope.a = null;
          expect($rootScope.$eval('a')).toBe(null);
        }));

        it('should return undefined for `a` where `a` is undefined', inject(function($rootScope) {
          expect($rootScope.$eval('a')).toBeUndefined();
        }));

        // simpleGetterFn2
        it('should return undefined for properties of `null` constant', inject(function($rootScope) {
          expect($rootScope.$eval('null.a')).toBeUndefined();
        }));

        it('should return undefined for properties of `null` values', inject(function($rootScope) {
          $rootScope.a = null;
          expect($rootScope.$eval('a.b')).toBeUndefined();
        }));

        it('should return null for `a.b` where `b` is null', inject(function($rootScope) {
          $rootScope.a = { b: null };
          expect($rootScope.$eval('a.b')).toBe(null);
        }));

        // cspSafeGetter && pathKeys.length < 6 || pathKeys.length > 2
        it('should return null for `a.b.c.d.e` where `e` is null', inject(function($rootScope) {
          $rootScope.a = { b: { c: { d: { e: null } } } };
          expect($rootScope.$eval('a.b.c.d.e')).toBe(null);
        }));

        it('should return undefined for `a.b.c.d.e` where `d` is null', inject(function($rootScope) {
          $rootScope.a = { b: { c: { d: null } } };
          expect($rootScope.$eval('a.b.c.d.e')).toBeUndefined();
        }));

        // cspSafeGetter || pathKeys.length > 6
        it('should return null for `a.b.c.d.e.f.g` where `g` is null', inject(function($rootScope) {
          $rootScope.a = { b: { c: { d: { e: { f: { g: null } } } } } };
          expect($rootScope.$eval('a.b.c.d.e.f.g')).toBe(null);
        }));

        it('should return undefined for `a.b.c.d.e.f.g` where `f` is null', inject(function($rootScope) {
          $rootScope.a = { b: { c: { d: { e: { f: null } } } } };
          expect($rootScope.$eval('a.b.c.d.e.f.g')).toBeUndefined();
        }));


        it('should return undefined if the return value of a function invocation is undefined',
            inject(function($rootScope) {
          $rootScope.fn = function() {};
          expect($rootScope.$eval('fn()')).toBeUndefined();
        }));

        it('should ignore undefined values when doing addition/concatenation',
            inject(function($rootScope) {
          $rootScope.fn = function() {};
          expect($rootScope.$eval('foo + "bar" + fn()')).toBe('bar');
        }));
      });
    });
  });
});
