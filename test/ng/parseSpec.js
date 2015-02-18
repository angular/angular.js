'use strict';

describe('parser', function() {

  beforeEach(function() {
    /* global getterFnCacheDefault: true */
    /* global getterFnCacheExpensive: true */
    // clear caches
    getterFnCacheDefault = createMap();
    getterFnCacheExpensive = createMap();
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

    it('should only match number chars with isNumber', function() {
      expect(Lexer.prototype.isNumber('0')).toBe(true);
      expect(Lexer.prototype.isNumber('')).toBeFalsy();
      expect(Lexer.prototype.isNumber(' ')).toBeFalsy();
      expect(Lexer.prototype.isNumber(0)).toBeFalsy();
      expect(Lexer.prototype.isNumber(false)).toBeFalsy();
      expect(Lexer.prototype.isNumber(true)).toBeFalsy();
      expect(Lexer.prototype.isNumber(undefined)).toBeFalsy();
      expect(Lexer.prototype.isNumber(null)).toBeFalsy();
    });

    it('should tokenize a string', function() {
      var tokens = lex("a.bc[22]+1.3|f:'a\\\'c':\"d\\\"e\"");
      var i = 0;
      expect(tokens[i].index).toEqual(0);
      expect(tokens[i].text).toEqual('a');

      i++;
      expect(tokens[i].index).toEqual(1);
      expect(tokens[i].text).toEqual('.');

      i++;
      expect(tokens[i].index).toEqual(2);
      expect(tokens[i].text).toEqual('bc');

      i++;
      expect(tokens[i].index).toEqual(4);
      expect(tokens[i].text).toEqual('[');

      i++;
      expect(tokens[i].index).toEqual(5);
      expect(tokens[i].text).toEqual('22');
      expect(tokens[i].value).toEqual(22);
      expect(tokens[i].constant).toEqual(true);

      i++;
      expect(tokens[i].index).toEqual(7);
      expect(tokens[i].text).toEqual(']');

      i++;
      expect(tokens[i].index).toEqual(8);
      expect(tokens[i].text).toEqual('+');

      i++;
      expect(tokens[i].index).toEqual(9);
      expect(tokens[i].text).toEqual('1.3');
      expect(tokens[i].value).toEqual(1.3);
      expect(tokens[i].constant).toEqual(true);

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
      expect(tokens[i].value).toEqual("a'c");

      i++;
      expect(tokens[i].index).toEqual(21);
      expect(tokens[i].text).toEqual(':');

      i++;
      expect(tokens[i].index).toEqual(22);
      expect(tokens[i].value).toEqual('d"e');
    });

    it('should tokenize identifiers with spaces around dots the same as without spaces', function() {
      function getText(t) { return t.text; }
      var spaces = lex('foo. bar . baz').map(getText);
      var noSpaces = lex('foo.bar.baz').map(getText);

      expect(spaces).toEqual(noSpaces);
    });

    it('should tokenize undefined', function() {
      var tokens = lex("undefined");
      var i = 0;
      expect(tokens[i].index).toEqual(0);
      expect(tokens[i].text).toEqual('undefined');
    });

    it('should tokenize quoted string', function() {
      var str = "['\\'', \"\\\"\"]";
      var tokens = lex(str);

      expect(tokens[1].index).toEqual(1);
      expect(tokens[1].value).toEqual("'");

      expect(tokens[3].index).toEqual(7);
      expect(tokens[3].value).toEqual('"');
    });

    it('should tokenize escaped quoted string', function() {
      var str = '"\\"\\n\\f\\r\\t\\v\\u00A0"';
      var tokens = lex(str);

      expect(tokens[0].value).toEqual('"\n\f\r\t\v\u00A0');
    });

    it('should tokenize unicode', function() {
      var tokens = lex('"\\u00A0"');
      expect(tokens.length).toEqual(1);
      expect(tokens[0].value).toEqual('\u00a0');
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
          toEqual(['a', '.', 'b', '.', 'c',  '(', 'd', ')', '-', 'e', '.', 'f', '(', ')']);
    });

    it('should tokenize number', function() {
      var tokens = lex("0.5");
      expect(tokens[0].value).toEqual(0.5);
    });

    it('should tokenize negative number', inject(function($rootScope) {
      var value = $rootScope.$eval("-0.5");
      expect(value).toEqual(-0.5);

      value = $rootScope.$eval("{a:-0.5}");
      expect(value).toEqual({a:-0.5});
    }));

    it('should tokenize number with exponent', inject(function($rootScope) {
      var tokens = lex("0.5E-10");
      expect(tokens[0].value).toEqual(0.5E-10);
      expect($rootScope.$eval("0.5E-10")).toEqual(0.5E-10);

      tokens = lex("0.5E+10");
      expect(tokens[0].value).toEqual(0.5E+10);
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
      expect(tokens[0].value).toEqual(0.5);
    });

    it('should throw error on invalid unicode', function() {
      expect(function() {
        lex("'\\u1''bla'");
      }).toThrowMinErr("$parse", "lexerr", "Lexer Error: Invalid unicode escape [\\u1''b] at column 2 in expression ['\\u1''bla'].");
    });
  });

  describe('ast', function() {
    var createAst;

    beforeEach(function() {
      /* global AST: false */
      createAst = function() {
        var lexer = new Lexer({csp: false});
        var ast = new AST(lexer, {csp: false});
        return ast.ast.apply(ast, arguments);
      };
    });

    it('should handle an empty list of tokens', function() {
      expect(createAst('')).toEqual({type: 'Program', body: []});
    });


    it('should understand identifiers', function() {
      expect(createAst('foo')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Identifier', name: 'foo' }
            }
          ]
        }
      );
    });


    it('should understand non-computed member expressions', function() {
      expect(createAst('foo.bar')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'foo'},
                property: {type: 'Identifier', name: 'bar'},
                computed: false
              }
            }
          ]
        }
      );
    });


    it('should associate non-computed member expressions left-to-right', function() {
      expect(createAst('foo.bar.baz')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'foo'},
                  property: { type: 'Identifier', name: 'bar' },
                  computed: false
                },
                property: {type: 'Identifier', name: 'baz'},
                computed: false
              }
            }
          ]
        }
      );
    });


    it('should understand computed member expressions', function() {
      expect(createAst('foo[bar]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'foo'},
                property: {type: 'Identifier', name: 'bar'},
                computed: true
              }
            }
          ]
        }
      );
    });


    it('should associate computed member expressions left-to-right', function() {
      expect(createAst('foo[bar][baz]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'foo' },
                    property: { type: 'Identifier', name: 'bar' },
                  computed: true
                },
                property: { type: 'Identifier', name: 'baz' },
                computed: true
              }
            }
          ]
        }
      );
    });


    it('should understand call expressions', function() {
      expect(createAst('foo()')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'foo'},
                arguments: []
              }
            }
          ]
        }
      );
    });


    it('should parse call expression arguments', function() {
      expect(createAst('foo(bar, baz)')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'foo'},
                arguments: [
                  { type: 'Identifier', name: 'bar' },
                  { type: 'Identifier', name: 'baz' }
                ]
              }
            }
          ]
        }
      );
    });


    it('should parse call expression left-to-right', function() {
      expect(createAst('foo(bar, baz)(man, shell)')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'CallExpression',
                  callee: { type: 'Identifier', name: 'foo' },
                  arguments: [
                    { type: 'Identifier', name: 'bar' },
                    { type: 'Identifier', name: 'baz' }
                  ]
                },
                arguments: [
                  { type: 'Identifier', name: 'man' },
                  { type: 'Identifier', name: 'shell' }
                ]
              }
            }
          ]
        }
      );
    });


    it('should keep the context when having superfluous parenthesis', function() {
      expect(createAst('(foo)(bar, baz)')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'foo'},
                arguments: [
                  { type: 'Identifier', name: 'bar' },
                  { type: 'Identifier', name: 'baz' }
                ]
              }
            }
          ]
        }
      );
    });


    it('should treat member expressions and call expression with the same precedence', function() {
      expect(createAst('foo.bar[baz]()')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'foo' },
                    property: { type: 'Identifier', name: 'bar' },
                    computed: false
                  },
                  property: { type: 'Identifier', name: 'baz' },
                  computed: true
                },
                arguments: []
              }
            }
          ]
        }
      );
      expect(createAst('foo[bar]().baz')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'foo' },
                    property: { type: 'Identifier', name: 'bar' },
                    computed: true
                  },
                  arguments: []
                },
                property: { type: 'Identifier', name: 'baz' },
                computed: false
              }
            }
          ]
        }
      );
      expect(createAst('foo().bar[baz]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'foo' },
                    arguments: [] },
                  property: { type: 'Identifier', name: 'bar' },
                  computed: false
                },
                property: { type: 'Identifier', name: 'baz' },
                computed: true
              }
            }
          ]
        }
      );
    });


    it('should understand literals', function() {
      // In a strict sense, `undefined` is not a literal but an identifier
      forEach({'123': 123, '"123"': '123', 'true': true, 'false': false, 'null': null, 'undefined': undefined}, function(value, expression) {
        expect(createAst(expression)).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: { type: 'Literal', value: value }
              }
            ]
          }
        );
      });
    });


    it('should understand the `this` expression', function() {
      expect(createAst('this')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'ThisExpression' }
            }
          ]
        }
      );
    });


    it('should not confuse `this`, `undefined`, `true`, `false`, `null` when used as identfiers', function() {
      forEach(['this', 'undefined', 'true', 'false', 'null'], function(identifier) {
        expect(createAst('foo.' + identifier)).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'foo' },
                  property: { type: 'Identifier', name: identifier },
                  computed: false
                }
              }
            ]
          }
        );
      });
    });


    it('should throw when trying to use non-identifiers as identifiers', function() {
      expect(function() { createAst('foo.)'); }).toThrowMinErr('$parse', 'syntax',
          "Syntax Error: Token ')' is not a valid identifier at column 5 of the expression [foo.)");
    });


    it('should throw when all tokens are not consumed', function() {
      expect(function() { createAst('foo bar'); }).toThrowMinErr('$parse', 'syntax',
          "Syntax Error: Token 'bar' is an unexpected token at column 5 of the expression [foo bar] starting at [bar]");
    });


    it('should understand the unary operators `-`, `+` and `!`', function() {
      forEach(['-', '+', '!'], function(operator) {
        expect(createAst(operator + 'foo')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: operator,
                  prefix: true,
                  argument: { type: 'Identifier', name: 'foo' }
                }
              }
            ]
          }
        );
      });
    });


    it('should handle all unary operators with the same precedence', function() {
      forEach([['+', '-', '!'], ['-', '!', '+'], ['!', '+', '-']], function(operators) {
        expect(createAst(operators.join('') + 'foo')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: operators[0],
                  prefix: true,
                  argument: {
                    type: 'UnaryExpression',
                    operator: operators[1],
                    prefix: true,
                    argument: {
                      type: 'UnaryExpression',
                      operator: operators[2],
                      prefix: true,
                      argument: { type: 'Identifier', name: 'foo' }
                    }
                  }
                }
              }
            ]
          }
        );
      });
    });


    it('should be able to understand binary operators', function() {
      forEach(['*', '/', '%', '+', '-', '<', '>', '<=', '>=', '==','!=','===','!=='], function(operator) {
        expect(createAst('foo' + operator + 'bar')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  operator: operator,
                  left: { type: 'Identifier', name: 'foo' },
                  right: { type: 'Identifier', name: 'bar' }
                }
              }
            ]
          }
        );
      });
    });


    it('should associate binary operators with the same precendence left-to-right', function() {
      var operatorsByPrecedence = [['*', '/', '%'], ['+', '-'], ['<', '>', '<=', '>='], ['==','!=','===','!==']];
      forEach(operatorsByPrecedence, function(operators) {
        forEach(operators, function(op1) {
          forEach(operators, function(op2) {
            expect(createAst('foo' + op1 + 'bar' + op2 + 'baz')).toEqual(
              {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      operator: op2,
                      left: {
                        type: 'BinaryExpression',
                        operator: op1,
                        left: { type: 'Identifier', name: 'foo' },
                        right: { type: 'Identifier', name: 'bar' }
                      },
                      right: { type: 'Identifier', name: 'baz' }
                    }
                  }
                ]
              }
            );
          });
        });
      });
    });


    it('should give higher prcedence to member calls than to unary expressions', function() {
      forEach(['!', '+', '-'], function(operator) {
        expect(createAst(operator + 'foo()')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: operator,
                  prefix: true,
                  argument: {
                    type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'foo' },
                    arguments: []
                  }
                }
              }
            ]
          }
        );
        expect(createAst(operator + 'foo.bar')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: operator,
                  prefix: true,
                  argument: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'foo' },
                    property: { type: 'Identifier', name: 'bar' },
                    computed: false
                  }
                }
              }
            ]
          }
        );
        expect(createAst(operator + 'foo[bar]')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: operator,
                  prefix: true,
                  argument: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'foo' },
                    property: { type: 'Identifier', name: 'bar' },
                    computed: true
                  }
                }
              }
            ]
          }
        );
      });
    });


    it('should give higher precedence to unary operators over multiplicative operators', function() {
      forEach(['!', '+', '-'], function(op1) {
        forEach(['*', '/', '%'], function(op2) {
          expect(createAst(op1 + 'foo' + op2 + op1 + 'bar')).toEqual(
            {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    operator: op2,
                    left: {
                      type: 'UnaryExpression',
                      operator: op1,
                      prefix: true,
                      argument: { type: 'Identifier', name: 'foo' }
                    },
                    right: {
                      type: 'UnaryExpression',
                      operator: op1,
                      prefix: true,
                      argument: { type: 'Identifier', name: 'bar' }
                    }
                  }
                }
              ]
            }
          );
        });
      });
    });


    it('should give binary operators their right precedence', function() {
      var operatorsByPrecedence = [['*', '/', '%'], ['+', '-'], ['<', '>', '<=', '>='], ['==','!=','===','!==']];
      for (var i = 0; i < operatorsByPrecedence.length - 1; ++i) {
        forEach(operatorsByPrecedence[i], function(op1) {
          forEach(operatorsByPrecedence[i + 1], function(op2) {
            expect(createAst('foo' + op1 + 'bar' + op2 + 'baz' + op1 + 'man')).toEqual(
              {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      operator: op2,
                      left: {
                        type: 'BinaryExpression',
                        operator: op1,
                        left: { type: 'Identifier', name: 'foo' },
                        right: { type: 'Identifier', name: 'bar' }
                      },
                      right: {
                        type: 'BinaryExpression',
                        operator: op1,
                        left: { type: 'Identifier', name: 'baz' },
                        right: { type: 'Identifier', name: 'man' }
                      }
                    }
                  }
                ]
              }
            );
          });
        });
      }
    });



    it('should understand logical operators', function() {
      forEach(['||', '&&'], function(operator) {
        expect(createAst('foo' + operator + 'bar')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'LogicalExpression',
                  operator: operator,
                  left: { type: 'Identifier', name: 'foo' },
                  right: { type: 'Identifier', name: 'bar' }
                }
              }
            ]
          }
        );
      });
    });


    it('should associate logical operators left-to-right', function() {
      forEach(['||', '&&'], function(op) {
        expect(createAst('foo' + op + 'bar' + op + 'baz')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'LogicalExpression',
                  operator: op,
                  left: {
                    type: 'LogicalExpression',
                    operator: op,
                    left: { type: 'Identifier', name: 'foo' },
                    right: { type: 'Identifier', name: 'bar' }
                  },
                  right: { type: 'Identifier', name: 'baz' }
                }
              }
            ]
          }
        );
      });
    });



    it('should understand ternary operators', function() {
      expect(createAst('foo?bar:baz')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: { type: 'Identifier', name: 'foo' },
                alternate: { type: 'Identifier', name: 'bar' },
                consequent: { type: 'Identifier', name: 'baz' }
              }
            }
          ]
        }
      );
    });


    it('should associate the conditional operator right-to-left', function() {
      expect(createAst('foo0?foo1:foo2?bar0?bar1:bar2:man0?man1:man2')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: { type: 'Identifier', name: 'foo0' },
                alternate: { type: 'Identifier', name: 'foo1' },
                consequent: {
                  type: 'ConditionalExpression',
                  test: { type: 'Identifier', name: 'foo2' },
                  alternate: {
                    type: 'ConditionalExpression',
                    test: { type: 'Identifier', name: 'bar0' },
                    alternate: { type: 'Identifier', name: 'bar1' },
                    consequent: { type: 'Identifier', name: 'bar2' }
                  },
                  consequent: {
                    type: 'ConditionalExpression',
                    test: { type: 'Identifier', name: 'man0' },
                    alternate: { type: 'Identifier', name: 'man1' },
                    consequent: { type: 'Identifier', name: 'man2' }
                  }
                }
              }
            }
          ]
        }
      );
    });


    it('should understand assignment operator', function() {
      // Currently, only `=` is supported
      expect(createAst('foo=bar')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: { type: 'Identifier', name: 'foo' },
                right: { type: 'Identifier', name: 'bar' },
                operator: '='
              }
            }
          ]
        }
      );
    });


    it('should associate assignments right-to-left', function() {
      // Currently, only `=` is supported
      expect(createAst('foo=bar=man')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: { type: 'Identifier', name: 'foo' },
                right: {
                  type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: 'bar' },
                  right: { type: 'Identifier', name: 'man' },
                  operator: '='
                },
                operator: '='
              }
            }
          ]
        }
      );
    });


    it('should give higher precedence to equality than to the logical `and` operator', function() {
      forEach(['==','!=','===','!=='], function(operator) {
        expect(createAst('foo' + operator + 'bar && man' + operator + 'shell')).toEqual(
          {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'LogicalExpression',
                  operator: '&&',
                  left: {
                    type: 'BinaryExpression',
                    operator: operator,
                    left: { type: 'Identifier', name: 'foo' },
                    right: { type: 'Identifier', name: 'bar' }
                  },
                  right: {
                    type: 'BinaryExpression',
                    operator: operator,
                    left: { type: 'Identifier', name: 'man' },
                    right: { type: 'Identifier', name: 'shell' }
                  }
                }
              }
            ]
          }
        );
      });
    });


    it('should give higher precedence to logical `and` than to logical `or`', function() {
      expect(createAst('foo&&bar||man&&shell')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'LogicalExpression',
                operator: '||',
                left: {
                  type: 'LogicalExpression',
                  operator: '&&',
                  left: { type: 'Identifier', name: 'foo' },
                  right: { type: 'Identifier', name: 'bar' }
                },
                right: {
                  type: 'LogicalExpression',
                  operator: '&&',
                  left: { type: 'Identifier', name: 'man' },
                  right: { type: 'Identifier', name: 'shell' }
                }
              }
            }
          ]
        }
      );
    });



    it('should give higher precedence to the logical `or` than to the conditional operator', function() {
      expect(createAst('foo||bar?man:shell')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'LogicalExpression',
                  operator: '||',
                  left: { type: 'Identifier', name: 'foo' },
                  right: { type: 'Identifier', name: 'bar' }
                },
                alternate: { type: 'Identifier', name: 'man' },
                consequent: { type: 'Identifier', name: 'shell' }
              }
            }
          ]
        }
      );
    });


    it('should give higher precedence to the conditional operator than to assignment operators', function() {
      expect(createAst('foo=bar?man:shell')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: { type: 'Identifier', name: 'foo' },
                right: {
                  type: 'ConditionalExpression',
                  test: { type: 'Identifier', name: 'bar' },
                  alternate: { type: 'Identifier', name: 'man' },
                  consequent: { type: 'Identifier', name: 'shell' }
                },
                operator: '='
              }
            }
          ]
        }
      );
    });


    it('should understand array literals', function() {
      expect(createAst('[]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          ]
        }
      );
      expect(createAst('[foo]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  { type: 'Identifier', name: 'foo' }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('[foo,]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  { type: 'Identifier', name: 'foo' }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('[foo,bar,man,shell]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  { type: 'Identifier', name: 'foo' },
                  { type: 'Identifier', name: 'bar' },
                  { type: 'Identifier', name: 'man' },
                  { type: 'Identifier', name: 'shell' }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('[foo,bar,man,shell,]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  { type: 'Identifier', name: 'foo' },
                  { type: 'Identifier', name: 'bar' },
                  { type: 'Identifier', name: 'man' },
                  { type: 'Identifier', name: 'shell' }
                ]
              }
            }
          ]
        }
      );
    });


    it('should understand objects', function() {
      expect(createAst('{}')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          ]
        }
      );
      expect(createAst('{foo: bar}')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'foo' },
                    value: { type: 'Identifier', name: 'bar' }
                  }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('{foo: bar,}')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'foo' },
                    value: { type: 'Identifier', name: 'bar' }
                  }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('{foo: bar, "man": "shell", 42: 23}')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'foo' },
                    value: { type: 'Identifier', name: 'bar' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 'man' },
                    value: { type: 'Literal', value: 'shell' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 42 },
                    value: { type: 'Literal', value: 23 }
                  }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('{foo: bar, "man": "shell", 42: 23,}')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'foo' },
                    value: { type: 'Identifier', name: 'bar' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 'man' },
                    value: { type: 'Literal', value: 'shell' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 42 },
                    value: { type: 'Literal', value: 23 }
                  }
                ]
              }
            }
          ]
        }
      );
    });


    it('should understand multiple expressions', function() {
      expect(createAst('foo = bar; man = shell')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: { type: 'Identifier', name: 'foo' },
                right: { type: 'Identifier', name: 'bar' },
                operator: '='
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: { type: 'Identifier', name: 'man' },
                right: { type: 'Identifier', name: 'shell' },
                operator: '='
              }
            }
          ]
        }
      );
    });


    // This is non-standard syntax
    it('should understand filters', function() {
      expect(createAst('foo | bar')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'bar'},
                arguments: [
                  { type: 'Identifier', name: 'foo' }
                ],
                filter: true
              }
            }
          ]
        }
      );
    });


    it('should understand filters with extra parameters', function() {
      expect(createAst('foo | bar:baz')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'bar'},
                arguments: [
                  { type: 'Identifier', name: 'foo' },
                  { type: 'Identifier', name: 'baz' }
                ],
                filter: true
              }
            }
          ]
        }
      );
    });


    it('should associate filters right-to-left', function() {
      expect(createAst('foo | bar:man | shell')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'shell' },
                arguments: [
                  {
                    type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'bar' },
                    arguments: [
                      { type: 'Identifier', name: 'foo' },
                      { type: 'Identifier', name: 'man' }
                    ],
                    filter: true
                  }
                ],
                filter: true
              }
            }
          ]
        }
      );
    });

    it('should give higher precedence to assignments over filters', function() {
      expect(createAst('foo=bar | man')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'man' },
                arguments: [
                  {
                    type: 'AssignmentExpression',
                    left: { type: 'Identifier', name: 'foo' },
                    right: { type: 'Identifier', name: 'bar' },
                    operator: '='
                  }
                ],
                filter: true
              }
            }
          ]
        }
      );
    });

    it('should accept expression as filters parameters', function() {
      expect(createAst('foo | bar:baz=man')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'bar' },
                arguments: [
                  { type: 'Identifier', name: 'foo' },
                  {
                    type: 'AssignmentExpression',
                    left: { type: 'Identifier', name: 'baz' },
                    right: { type: 'Identifier', name: 'man' },
                    operator: '='
                  }
                ],
                filter: true
              }
            }
          ]
        }
      );
    });

    it('should accept expression as computer members', function() {
      expect(createAst('foo[a = 1]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'foo' },
                property: {
                  type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: 'a' },
                  right: { type: 'Literal', value: 1 },
                  operator: '='
                },
                computed: true
              }
            }
          ]
        }
      );
    });

    it('should accept expression in function arguments', function() {
      expect(createAst('foo(a = 1)')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'foo' },
                arguments: [
                  {
                    type: 'AssignmentExpression',
                    left: { type: 'Identifier', name: 'a' },
                    right: { type: 'Literal', value: 1 },
                    operator: '='
                  }
                ]
              }
            }
          ]
        }
      );
    });

    it('should accept expression as part of ternary operators', function() {
      expect(createAst('foo || bar ? man = 1 : shell = 1')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'LogicalExpression',
                  operator: '||',
                  left: { type: 'Identifier', name: 'foo' },
                  right: { type: 'Identifier', name: 'bar' }
                },
                alternate: {
                  type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: 'man' },
                  right: { type: 'Literal', value: 1 },
                  operator: '='
                },
                consequent: {
                  type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: 'shell' },
                  right: { type: 'Literal', value: 1 },
                  operator: '='
                }
              }
            }
          ]
        }
      );
    });

    it('should accept expression as part of array literals', function() {
      expect(createAst('[foo = 1]')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'AssignmentExpression',
                    left: { type: 'Identifier', name: 'foo' },
                    right: { type: 'Literal', value: 1 },
                    operator: '='
                  }
                ]
              }
            }
          ]
        }
      );
    });

    it('should accept expression as part of object literals', function() {
      expect(createAst('{foo: bar = 1}')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'foo' },
                    value: {
                      type: 'AssignmentExpression',
                      left: { type: 'Identifier', name: 'bar' },
                      right: { type: 'Literal', value: 1 },
                      operator: '='
                    }
                  }
                ]
              }
            }
          ]
        }
      );
    });

    it('should be possible to use parenthesis to indicate precedence', function() {
      expect(createAst('(foo + bar).man')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: { type: 'Identifier', name: 'foo' },
                  right: { type: 'Identifier', name: 'bar' }
                },
                property: { type: 'Identifier', name: 'man' },
                computed: false
              }
            }
          ]
        }
      );
    });

    it('should skip empty expressions', function() {
      expect(createAst('foo;;;;bar')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Identifier', name: 'foo' }
            },
            {
              type: 'ExpressionStatement',
              expression: { type: 'Identifier', name: 'bar' }
            }
          ]
        }
      );
      expect(createAst(';foo')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Identifier', name: 'foo' }
            }
          ]
        }
      );
      expect(createAst('foo;')).toEqual({
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Identifier', name: 'foo' }
          }
        ]
      });
      expect(createAst(';;;;')).toEqual({type: 'Program', body: []});
      expect(createAst('')).toEqual({type: 'Program', body: []});
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
        expect(scope.$eval("1+2*3/4")).toEqual(1 + 2 * 3 / 4);
        expect(scope.$eval("0--1+1.5")).toEqual(0 - -1 + 1.5);
        expect(scope.$eval("-0--1++2*-3/-4")).toEqual(-0 - -1 + +2 * -3 / -4);
        expect(scope.$eval("1/2*3")).toEqual(1 / 2 * 3);
      });

      it('should parse unary', function() {
        expect(scope.$eval("+1")).toEqual(+1);
        expect(scope.$eval("-1")).toEqual(-1);
        expect(scope.$eval("+'1'")).toEqual(+'1');
        expect(scope.$eval("-'1'")).toEqual(-'1');
        expect(scope.$eval("+undefined")).toEqual(0);
        expect(scope.$eval("-undefined")).toEqual(0);
        expect(scope.$eval("+null")).toEqual(+null);
        expect(scope.$eval("-null")).toEqual(-null);
        expect(scope.$eval("+false")).toEqual(+false);
        expect(scope.$eval("-false")).toEqual(-false);
        expect(scope.$eval("+true")).toEqual(+true);
        expect(scope.$eval("-true")).toEqual(-true);
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
        expect(scope.$eval("1>2")).toEqual(1 > 2);
        expect(scope.$eval("2>=1")).toEqual(2 >= 1);
        expect(scope.$eval("true==2<3")).toEqual(true == 2 < 3);
        expect(scope.$eval("true===2<3")).toEqual(true === 2 < 3);

        expect(scope.$eval("true===3===3")).toEqual(true === 3 === 3);
        expect(scope.$eval("3===3===true")).toEqual(3 === 3 === true);
        expect(scope.$eval("3 >= 3 > 2")).toEqual(3 >= 3 > 2);
      });

      it('should parse logical', function() {
        expect(scope.$eval("0&&2")).toEqual(0 && 2);
        expect(scope.$eval("0||2")).toEqual(0 || 2);
        expect(scope.$eval("0||1&&2")).toEqual(0 || 1 && 2);
      });

      it('should parse ternary', function() {
        var returnTrue = scope.returnTrue = function() { return true; };
        var returnFalse = scope.returnFalse = function() { return false; };
        var returnString = scope.returnString = function() { return 'asd'; };
        var returnInt = scope.returnInt = function() { return 123; };
        var identity = scope.identity = function(x) { return x; };

        // Simple.
        expect(scope.$eval('0?0:2')).toEqual(0 ? 0 : 2);
        expect(scope.$eval('1?0:2')).toEqual(1 ? 0 : 2);

        // Nested on the left.
        expect(scope.$eval('0?0?0:0:2')).toEqual(0 ? 0 ? 0 : 0 : 2);
        expect(scope.$eval('1?0?0:0:2')).toEqual(1 ? 0 ? 0 : 0 : 2);
        expect(scope.$eval('0?1?0:0:2')).toEqual(0 ? 1 ? 0 : 0 : 2);
        expect(scope.$eval('0?0?1:0:2')).toEqual(0 ? 0 ? 1 : 0 : 2);
        expect(scope.$eval('0?0?0:2:3')).toEqual(0 ? 0 ? 0 : 2 : 3);
        expect(scope.$eval('1?1?0:0:2')).toEqual(1 ? 1 ? 0 : 0 : 2);
        expect(scope.$eval('1?1?1:0:2')).toEqual(1 ? 1 ? 1 : 0 : 2);
        expect(scope.$eval('1?1?1:2:3')).toEqual(1 ? 1 ? 1 : 2 : 3);
        expect(scope.$eval('1?1?1:2:3')).toEqual(1 ? 1 ? 1 : 2 : 3);

        // Nested on the right.
        expect(scope.$eval('0?0:0?0:2')).toEqual(0 ? 0 : 0 ? 0 : 2);
        expect(scope.$eval('1?0:0?0:2')).toEqual(1 ? 0 : 0 ? 0 : 2);
        expect(scope.$eval('0?1:0?0:2')).toEqual(0 ? 1 : 0 ? 0 : 2);
        expect(scope.$eval('0?0:1?0:2')).toEqual(0 ? 0 : 1 ? 0 : 2);
        expect(scope.$eval('0?0:0?2:3')).toEqual(0 ? 0 : 0 ? 2 : 3);
        expect(scope.$eval('1?1:0?0:2')).toEqual(1 ? 1 : 0 ? 0 : 2);
        expect(scope.$eval('1?1:1?0:2')).toEqual(1 ? 1 : 1 ? 0 : 2);
        expect(scope.$eval('1?1:1?2:3')).toEqual(1 ? 1 : 1 ? 2 : 3);
        expect(scope.$eval('1?1:1?2:3')).toEqual(1 ? 1 : 1 ? 2 : 3);

        // Precedence with respect to logical operators.
        expect(scope.$eval('0&&1?0:1')).toEqual(0 && 1 ? 0 : 1);
        expect(scope.$eval('1||0?0:0')).toEqual(1 || 0 ? 0 : 0);

        expect(scope.$eval('0?0&&1:2')).toEqual(0 ? 0 && 1 : 2);
        expect(scope.$eval('0?1&&1:2')).toEqual(0 ? 1 && 1 : 2);
        expect(scope.$eval('0?0||0:1')).toEqual(0 ? 0 || 0 : 1);
        expect(scope.$eval('0?0||1:2')).toEqual(0 ? 0 || 1 : 2);

        expect(scope.$eval('1?0&&1:2')).toEqual(1 ? 0 && 1 : 2);
        expect(scope.$eval('1?1&&1:2')).toEqual(1 ? 1 && 1 : 2);
        expect(scope.$eval('1?0||0:1')).toEqual(1 ? 0 || 0 : 1);
        expect(scope.$eval('1?0||1:2')).toEqual(1 ? 0 || 1 : 2);

        expect(scope.$eval('0?1:0&&1')).toEqual(0 ? 1 : 0 && 1);
        expect(scope.$eval('0?2:1&&1')).toEqual(0 ? 2 : 1 && 1);
        expect(scope.$eval('0?1:0||0')).toEqual(0 ? 1 : 0 || 0);
        expect(scope.$eval('0?2:0||1')).toEqual(0 ? 2 : 0 || 1);

        expect(scope.$eval('1?1:0&&1')).toEqual(1 ? 1 : 0 && 1);
        expect(scope.$eval('1?2:1&&1')).toEqual(1 ? 2 : 1 && 1);
        expect(scope.$eval('1?1:0||0')).toEqual(1 ? 1 : 0 || 0);
        expect(scope.$eval('1?2:0||1')).toEqual(1 ? 2 : 0 || 1);

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

      it('should handle white-spaces around dots in method invocations', function() {
        scope.a = {b: function() { return this.c; }, c: 4};
        expect(scope.$eval("a . b ()", scope)).toEqual(4);
        expect(scope.$eval("a. b ()", scope)).toEqual(4);
        expect(scope.$eval("a .b ()", scope)).toEqual(4);
        expect(scope.$eval("a  \n  . \nb   \n ()", scope)).toEqual(4);
      });

      it('should throw syntax error exception for identifiers ending with a dot', function() {
        scope.a = {b: 4};

        expect(function() {
          scope.$eval("a.", scope);
        }).toThrowMinErr('$parse', 'ueoe',
          "Unexpected end of expression: a.");

        expect(function() {
          scope.$eval("a .", scope);
        }).toThrowMinErr('$parse', 'ueoe',
          "Unexpected end of expression: a .");
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
        scope.a = undefined;
        expect(scope.$eval('a - b')).toBe(0);
        expect(scope.$eval('a + b')).toBe(undefined);
        scope.a = 0;
        expect(scope.$eval('a - b')).toBe(0);
        expect(scope.$eval('a + b')).toBe(0);
        scope.a = undefined;
        scope.b = 0;
        expect(scope.$eval('a - b')).toBe(0);
        expect(scope.$eval('a + b')).toBe(0);
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
        expect(scope.$eval("(1+2)*3")).toEqual((1 + 2) * 3);
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
          return a + b;
        };
        expect(scope.$eval("add(1,2)")).toEqual(3);
      });

      it('should evaluate function call from a return value', function() {
        scope.getter = function() { return function() { return 33; }; };
        expect(scope.$eval("getter()()")).toBe(33);
      });

      // There is no "strict mode" in IE9
      if (!msie || msie > 9) {
        it('should set no context to functions returned by other functions', function() {
          scope.getter = function() { return function() { expect(this).toBeUndefined(); }; };
          scope.$eval("getter()()");
        });
      }

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
        expect(scope.$eval("{}")).toEqual({});
        expect(scope.$eval("{a:'b'}")).toEqual({a:"b"});
        expect(scope.$eval("{'a':'b'}")).toEqual({a:"b"});
        expect(scope.$eval("{\"a\":'b'}")).toEqual({a:"b"});
        expect(scope.$eval("{a:'b',}")).toEqual({a:"b"});
        expect(scope.$eval("{'a':'b',}")).toEqual({a:"b"});
        expect(scope.$eval("{\"a\":'b',}")).toEqual({a:"b"});
        expect(scope.$eval("{'0':1}")).toEqual({0:1});
        expect(scope.$eval("{0:1}")).toEqual({0:1});
        expect(scope.$eval("{1:1}")).toEqual({1:1});
        expect(scope.$eval("{null:1}")).toEqual({null:1});
        expect(scope.$eval("{'null':1}")).toEqual({null:1});
        expect(scope.$eval("{false:1}")).toEqual({false:1});
        expect(scope.$eval("{'false':1}")).toEqual({false:1});
        expect(scope.$eval("{'':1,}")).toEqual({"":1});
      });

      it('should throw syntax error exception for non constant/identifier JSON keys', function() {
        expect(function() { scope.$eval("{[:0}"); }).toThrowMinErr("$parse", "syntax",
          "Syntax Error: Token '[' invalid key at column 2 of the expression [{[:0}] starting at [[:0}]");
        expect(function() { scope.$eval("{{:0}"); }).toThrowMinErr("$parse", "syntax",
          "Syntax Error: Token '{' invalid key at column 2 of the expression [{{:0}] starting at [{:0}]");
        expect(function() { scope.$eval("{?:0}"); }).toThrowMinErr("$parse", "syntax",
          "Syntax Error: Token '?' invalid key at column 2 of the expression [{?:0}] starting at [?:0}]");
        expect(function() { scope.$eval("{):0}"); }).toThrowMinErr("$parse", "syntax",
          "Syntax Error: Token ')' invalid key at column 2 of the expression [{):0}] starting at [):0}]");
      });

      it('should evaluate object access', function() {
        expect(scope.$eval("{false:'WC', true:'CC'}[false]")).toEqual("WC");
      });

      it('should evaluate JSON', function() {
        expect(scope.$eval("[{}]")).toEqual([{}]);
        expect(scope.$eval("[{a:[]}, {b:1}]")).toEqual([{a:[]}, {b:1}]);
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
        expect(scope.$eval("12/6/2")).toEqual(12 / 6 / 2);
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
        expect(scope.$eval('false && true && run()')).toBe(false);
      });

      it('should short-circuit OR operator', function() {
        scope.run = function() {
          throw "IT SHOULD NOT HAVE RUN";
        };
        expect(scope.$eval('true || run()')).toBe(true);
        expect(scope.$eval('true || false || run()')).toBe(true);
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


      // https://github.com/angular/angular.js/issues/10968
      it('should evaluate arrays literals initializers left-to-right', inject(function($parse) {
        var s = {c:function() {return {b: 1}; }};
        expect($parse("e=1;[a=c(),d=a.b+1]")(s)).toEqual([{b: 1}, 2]);
      }));

      it('should evaluate function arguments left-to-right', inject(function($parse) {
        var s = {c:function() {return {b: 1}; }, i: function(x, y) { return [x, y];}};
        expect($parse("e=1;i(a=c(),d=a.b+1)")(s)).toEqual([{b: 1}, 2]);
      }));

      it('should evaluate object properties expressions left-to-right', inject(function($parse) {
        var s = {c:function() {return {b: 1}; }};
        expect($parse("e=1;{x: a=c(), y: d=a.b+1}")(s)).toEqual({x: {b: 1}, y: 2});
      }));


      describe('sandboxing', function() {
        describe('Function constructor', function() {
          it('should not tranverse the Function constructor in the getter', function() {
            expect(function() {
              scope.$eval('{}.toString.constructor');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: {}.toString.constructor');

          });

          it('should not allow access to the Function prototype in the getter', function() {
            expect(function() {
              scope.$eval('toString.constructor.prototype');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: toString.constructor.prototype');

          });

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

          it('should NOT allow access to Function constructor that has been aliased in getters', function() {
            scope.foo = { "bar": Function };
            expect(function() {
              scope.$eval('foo["bar"]');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: foo["bar"]');
          });

          it('should NOT allow access to Function constructor that has been aliased in setters', function() {
            scope.foo = { "bar": Function };
            expect(function() {
              scope.$eval('foo["bar"] = 1');
            }).toThrowMinErr(
                    '$parse', 'isecfn', 'Referencing Function in Angular expressions is disallowed! ' +
                    'Expression: foo["bar"] = 1');
          });

          describe('expensiveChecks', function() {
            it('should block access to window object even when aliased in getters', inject(function($parse, $window) {
              scope.foo = {w: $window};
              // This isn't blocked for performance.
              expect(scope.$eval($parse('foo.w'))).toBe($window);
              // Event handlers use the more expensive path for better protection since they expose
              // the $event object on the scope.
              expect(function() {
                scope.$eval($parse('foo.w', null, true));
              }).toThrowMinErr(
                      '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is disallowed! ' +
                      'Expression: foo.w');
            }));

            it('should block access to window object even when aliased in setters', inject(function($parse, $window) {
              scope.foo = {w: $window};
              // This is blocked as it points to `window`.
              expect(function() {
                expect(scope.$eval($parse('foo.w = 1'))).toBe($window);
              }).toThrowMinErr(
                      '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is disallowed! ' +
                      'Expression: foo.w = 1');
              // Event handlers use the more expensive path for better protection since they expose
              // the $event object on the scope.
              expect(function() {
                scope.$eval($parse('foo.w = 1', null, true));
              }).toThrowMinErr(
                      '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is disallowed! ' +
                      'Expression: foo.w = 1');
            }));
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

          it('should NOT allow access to Object constructor that has been aliased in getters', function() {
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

          it('should NOT allow access to Object constructor that has been aliased in setters', function() {
            scope.foo = { "bar": Object };

            expect(function() {
              scope.$eval('foo.bar.keys(foo).bar = 1');
            }).toThrowMinErr(
                    '$parse', 'isecobj', 'Referencing Object in Angular expressions is disallowed! ' +
                    'Expression: foo.bar.keys(foo).bar = 1');

            expect(function() {
              scope.$eval('foo["bar"]["keys"](foo).bar = 1');
            }).toThrowMinErr(
                    '$parse', 'isecobj', 'Referencing Object in Angular expressions is disallowed! ' +
                    'Expression: foo["bar"]["keys"](foo).bar = 1');
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
            expect(function() {
              scope.$eval('wrap["w"] = 1', scope);
            }).toThrowMinErr(
                    '$parse', 'isecwindow', 'Referencing the Window in Angular expressions is ' +
                    'disallowed! Expression: wrap["w"] = 1');
            expect(function() {
              scope.$eval('wrap["d"] = 1', scope);
            }).toThrowMinErr(
                    '$parse', 'isecdom', 'Referencing DOM nodes in Angular expressions is ' +
                    'disallowed! Expression: wrap["d"] = 1');
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
              scope.$eval('__proto__');
            }).toThrowMinErr('$parse', 'isecfld');
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

        it('should create objects when finding a null', inject(function($parse) {
          var fn = $parse('foo.bar');
          var scope = {foo: null};
          fn.assign(scope, 123);
          expect(scope.foo.bar).toEqual(123);
        }));

        it('should create objects when finding a null', inject(function($parse) {
          var fn = $parse('foo["bar"]');
          var scope = {foo: null};
          fn.assign(scope, 123);
          expect(scope.foo.bar).toEqual(123);
        }));

        it('should create objects when finding a null', inject(function($parse) {
          var fn = $parse('foo.bar.baz');
          var scope = {foo: null};
          fn.assign(scope, 123);
          expect(scope.foo.bar.baz).toEqual(123);
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
          it('should mark an empty expressions as literal', inject(function($parse) {
            expect($parse('').literal).toBe(true);
            expect($parse('   ').literal).toBe(true);
            expect($parse('::').literal).toBe(true);
            expect($parse('::    ').literal).toBe(true);
          }));

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
          scope.$watch($parse("a + b", interceptor));
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
            expect(input instanceof Date).toBe(true);
            return input;
          }));

          var parsed = $parse('date | foo:a');
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
            expect(input instanceof Date).toBe(true);
            return input;
          }));

          var parsed = $parse('date | foo:a');
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

        it('should continue with the evaluation of the expression without invoking computed parts',
            inject(function($parse) {
          var value = 'foo';
          var spy = jasmine.createSpy();

          spy.andCallFake(function() { return value; });
          scope.foo = spy;
          scope.$watch("foo() | uppercase");
          scope.$digest();
          expect(spy.calls.length).toEqual(2);
          scope.$digest();
          expect(spy.calls.length).toEqual(3);
          value = 'bar';
          scope.$digest();
          expect(spy.calls.length).toEqual(5);
        }));

        it('should invoke all statements in multi-statement expressions', inject(function($parse) {
          var lastVal = NaN;
          var listener = function(val) { lastVal = val; };

          scope.setBarToOne = false;
          scope.bar = 0;
          scope.two = 2;
          scope.foo = function() { if (scope.setBarToOne) scope.bar = 1; };
          scope.$watch("foo(); bar + two", listener);

          scope.$digest();
          expect(lastVal).toBe(2);

          scope.bar = 2;
          scope.$digest();
          expect(lastVal).toBe(4);

          scope.setBarToOne = true;
          scope.$digest();
          expect(lastVal).toBe(3);
        }));

        it('should watch the left side of assignments', inject(function($parse) {
          var lastVal = NaN;
          var listener = function(val) { lastVal = val; };

          var objA = {};
          var objB = {};

          scope.$watch("curObj.value = input", noop);

          scope.curObj = objA;
          scope.input = 1;
          scope.$digest();
          expect(objA.value).toBe(scope.input);

          scope.curObj = objB;
          scope.$digest();
          expect(objB.value).toBe(scope.input);

          scope.input = 2;
          scope.$digest();
          expect(objB.value).toBe(scope.input);
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
          expect($parse('a[0].b')({a: [{b: 'scope'}]}, {b: 'locals'})).toBe('scope');
          expect($parse('a[0]["b"]')({a: [{b: 'scope'}]}, {b: 'locals'})).toBe('scope');
          expect($parse('a[0][0].b')({a: [[{b: 'scope'}]]}, {b: 'locals'})).toBe('scope');
          expect($parse('a[0].b.c')({a: [{b: {c: 'scope'}}] }, {b: {c: 'locals'} })).toBe('scope');
        }));

        it('should assign directly to locals when the local property exists', inject(function($parse) {
          var s = {}, l = {};

          $parse("a = 1")(s, l);
          expect(s.a).toBe(1);
          expect(l.a).toBeUndefined();

          l.a = 2;
          $parse("a = 0")(s, l);
          expect(s.a).toBe(1);
          expect(l.a).toBe(0);

          $parse("toString = 1")(s, l);
          expect(isFunction(s.toString)).toBe(true);
          expect(l.toString).toBe(1);
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
        it('should mark an empty expressions as constant', inject(function($parse) {
          expect($parse('').constant).toBe(true);
          expect($parse('   ').constant).toBe(true);
          expect($parse('::').constant).toBe(true);
          expect($parse('::    ').constant).toBe(true);
        }));

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

        it('should treat properties named null/undefined as normal properties', inject(function($rootScope) {
          expect($rootScope.$eval("a.null.undefined.b", {a:{null:{undefined:{b: 1}}}})).toBe(1);
        }));

        it('should not allow overriding null/undefined keywords', inject(function($rootScope) {
          expect($rootScope.$eval('null.a', {null: {a: 42}})).toBeUndefined();
        }));

        it('should allow accessing null/undefined properties on `this`', inject(function($rootScope) {
          $rootScope.null = {a: 42};
          expect($rootScope.$eval('this.null.a')).toBe(42);
        }));
      });
    });
  });
});
