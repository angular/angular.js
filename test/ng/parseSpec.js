'use strict';

// This file has many tests which read nicely if constant conditions
// are used.
/* eslint-disable no-constant-condition */

describe('parser', function() {

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
      var tokens = lex('a.bc[22]+1.3|f:\'a\\\'c\':"d\\"e"');
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
      expect(tokens[i].value).toEqual('a\'c');

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

    it('should use callback functions to know when an identifier is valid', function() {
      function getText(t) { return t.text; }
      var isIdentifierStart = jasmine.createSpy('start');
      var isIdentifierContinue = jasmine.createSpy('continue');
      isIdentifierStart.and.returnValue(true);
      var lex = new Lexer({csp: false, isIdentifierStart: isIdentifierStart, isIdentifierContinue: isIdentifierContinue});

      isIdentifierContinue.and.returnValue(true);
      var tokens = lex.lex('πΣε').map(getText);
      expect(tokens).toEqual(['πΣε']);

      isIdentifierContinue.and.returnValue(false);
      tokens = lex.lex('πΣε').map(getText);
      expect(tokens).toEqual(['π', 'Σ', 'ε']);
    });

    it('should send the unicode characters and code points', function() {
      function getText(t) { return t.text; }
      var isIdentifierStart = jasmine.createSpy('start');
      var isIdentifierContinue = jasmine.createSpy('continue');
      isIdentifierStart.and.returnValue(true);
      isIdentifierContinue.and.returnValue(true);
      var lex = new Lexer({csp: false, isIdentifierStart: isIdentifierStart, isIdentifierContinue: isIdentifierContinue});
      var tokens = lex.lex('\uD801\uDC37\uD852\uDF62\uDBFF\uDFFF');
      expect(isIdentifierStart).toHaveBeenCalledTimes(1);
      expect(isIdentifierStart.calls.argsFor(0)).toEqual(['\uD801\uDC37', 0x10437]);
      expect(isIdentifierContinue).toHaveBeenCalledTimes(2);
      expect(isIdentifierContinue.calls.argsFor(0)).toEqual(['\uD852\uDF62', 0x24B62]);
      expect(isIdentifierContinue.calls.argsFor(1)).toEqual(['\uDBFF\uDFFF', 0x10FFFF]);
    });

    it('should tokenize undefined', function() {
      var tokens = lex('undefined');
      var i = 0;
      expect(tokens[i].index).toEqual(0);
      expect(tokens[i].text).toEqual('undefined');
    });

    it('should tokenize quoted string', function() {
      var str = '[\'\\\'\', "\\""]';
      var tokens = lex(str);

      expect(tokens[1].index).toEqual(1);
      expect(tokens[1].value).toEqual('\'');

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
      var tokens = lex('a \t \n \r b');
      expect(tokens[0].text).toEqual('a');
      expect(tokens[1].text).toEqual('b');
    });

    it('should tokenize relation and equality', function() {
      var tokens = lex('! == != < > <= >= === !==');
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
      var tokens = lex('&& || ? :');
      expect(tokens[0].text).toEqual('&&');
      expect(tokens[1].text).toEqual('||');
      expect(tokens[2].text).toEqual('?');
      expect(tokens[3].text).toEqual(':');
    });

    it('should tokenize statements', function() {
      var tokens = lex('a;b;');
      expect(tokens[0].text).toEqual('a');
      expect(tokens[1].text).toEqual(';');
      expect(tokens[2].text).toEqual('b');
      expect(tokens[3].text).toEqual(';');
    });

    it('should tokenize function invocation', function() {
      var tokens = lex('a()');
      expect(tokens.map(function(t) { return t.text;})).toEqual(['a', '(', ')']);
    });

    it('should tokenize method invocation', function() {
      var tokens = lex('a.b.c (d) - e.f()');
      expect(tokens.map(function(t) { return t.text;})).
          toEqual(['a', '.', 'b', '.', 'c',  '(', 'd', ')', '-', 'e', '.', 'f', '(', ')']);
    });

    it('should tokenize number', function() {
      var tokens = lex('0.5');
      expect(tokens[0].value).toEqual(0.5);
    });

    it('should tokenize negative number', inject(function($rootScope) {
      var value = $rootScope.$eval('-0.5');
      expect(value).toEqual(-0.5);

      value = $rootScope.$eval('{a:-0.5}');
      expect(value).toEqual({a:-0.5});
    }));

    it('should tokenize number with exponent', inject(function($rootScope) {
      var tokens = lex('0.5E-10');
      expect(tokens[0].value).toEqual(0.5E-10);
      expect($rootScope.$eval('0.5E-10')).toEqual(0.5E-10);

      tokens = lex('0.5E+10');
      expect(tokens[0].value).toEqual(0.5E+10);
    }));

    it('should throws exception for invalid exponent', function() {
      expect(function() {
        lex('0.5E-');
      }).toThrowMinErr('$parse', 'lexerr', 'Lexer Error: Invalid exponent at column 4 in expression [0.5E-].');

      expect(function() {
        lex('0.5E-A');
      }).toThrowMinErr('$parse', 'lexerr', 'Lexer Error: Invalid exponent at column 4 in expression [0.5E-A].');
    });

    it('should tokenize number starting with a dot', function() {
      var tokens = lex('.5');
      expect(tokens[0].value).toEqual(0.5);
    });

    it('should throw error on invalid unicode', function() {
      expect(function() {
        lex('\'\\u1\'\'bla\'');
      }).toThrowMinErr('$parse', 'lexerr', 'Lexer Error: Invalid unicode escape [\\u1\'\'b] at column 2 in expression [\'\\u1\'\'bla\'].');
    });
  });

  describe('ast', function() {
    var createAst;

    beforeEach(function() {
      /* global AST: false */
      createAst = function() {
        var lexer = new Lexer({csp: false});
        var ast = new AST(lexer, {csp: false, literals: {'true': true, 'false': false, 'undefined': undefined, 'null': null}});
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


    it('should understand the `$locals` expression', function() {
      expect(createAst('$locals')).toEqual(
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'LocalsExpression' }
            }
          ]
        }
      );
    });


    it('should not confuse `this`, `$locals`, `undefined`, `true`, `false`, `null` when used as identifiers', function() {
      forEach(['this', '$locals', 'undefined', 'true', 'false', 'null'], function(identifier) {
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
          'Syntax Error: Token \')\' is not a valid identifier at column 5 of the expression [foo.)');
    });


    it('should throw when all tokens are not consumed', function() {
      expect(function() { createAst('foo bar'); }).toThrowMinErr('$parse', 'syntax',
          'Syntax Error: Token \'bar\' is an unexpected token at column 5 of the expression [foo bar] starting at [bar]');
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


    it('should associate binary operators with the same precedence left-to-right', function() {
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


    it('should give higher precedence to member calls than to unary expressions', function() {
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
                    computed: false,
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
                    computed: false,
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
                    computed: false,
                    value: { type: 'Identifier', name: 'bar' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 'man' },
                    computed: false,
                    value: { type: 'Literal', value: 'shell' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 42 },
                    computed: false,
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
                    computed: false,
                    value: { type: 'Identifier', name: 'bar' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 'man' },
                    computed: false,
                    value: { type: 'Literal', value: 'shell' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Literal', value: 42 },
                    computed: false,
                    value: { type: 'Literal', value: 23 }
                  }
                ]
              }
            }
          ]
        }
      );
    });


    it('should understand ES6 object initializer', function() {
      // Shorthand properties definitions.
      expect(createAst('{x, y, z}')).toEqual(
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
                    key: { type: 'Identifier', name: 'x' },
                    computed: false,
                    value: { type: 'Identifier', name: 'x' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'y' },
                    computed: false,
                    value: { type: 'Identifier', name: 'y' }
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: { type: 'Identifier', name: 'z' },
                    computed: false,
                    value: { type: 'Identifier', name: 'z' }
                  }
                ]
              }
            }
          ]
        }
      );
      expect(function() { createAst('{"foo"}'); }).toThrow();

      // Computed properties
      expect(createAst('{[x]: x}')).toEqual(
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
                    key: { type: 'Identifier', name: 'x' },
                    computed: true,
                    value: { type: 'Identifier', name: 'x' }
                  }
                ]
              }
            }
          ]
        }
      );
      expect(createAst('{[x + 1]: x}')).toEqual(
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
                    key: {
                      type: 'BinaryExpression',
                      operator: '+',
                      left: { type: 'Identifier', name: 'x' },
                      right: { type: 'Literal', value: 1 }
                    },
                    computed: true,
                    value: { type: 'Identifier', name: 'x' }
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
                    computed: false,
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
    beforeEach(module(function($parseProvider) {
      $parseProvider.addLiteral('Infinity', Infinity);
      csp().noUnsafeEval = cspEnabled;
    }));

    it('should allow extending literals with csp ' + cspEnabled, inject(function($rootScope) {
      expect($rootScope.$eval('Infinity')).toEqual(Infinity);
      expect($rootScope.$eval('-Infinity')).toEqual(-Infinity);
      expect(function() {$rootScope.$eval('Infinity = 1');}).toThrow();
      expect($rootScope.$eval('Infinity')).toEqual(Infinity);
    }));
  });

  forEach([true, false], function(cspEnabled) {
    describe('csp: ' + cspEnabled, function() {

      beforeEach(module(function() {
        expect(csp().noUnsafeEval === true ||
               csp().noUnsafeEval === false).toEqual(true);
        csp().noUnsafeEval = cspEnabled;
      }, provideLog));

      beforeEach(inject(function($rootScope) {
        scope = $rootScope;
      }));

      it('should parse expressions', function() {
        expect(scope.$eval('-1')).toEqual(-1);
        expect(scope.$eval('1 + 2.5')).toEqual(3.5);
        expect(scope.$eval('1 + -2.5')).toEqual(-1.5);
        expect(scope.$eval('1+2*3/4')).toEqual(1 + 2 * 3 / 4);
        expect(scope.$eval('0--1+1.5')).toEqual(0 - -1 + 1.5);
        expect(scope.$eval('-0--1++2*-3/-4')).toEqual(-0 - -1 + +2 * -3 / -4);
        expect(scope.$eval('1/2*3')).toEqual(1 / 2 * 3);
      });

      it('should parse unary', function() {
        expect(scope.$eval('+1')).toEqual(+1);
        expect(scope.$eval('-1')).toEqual(-1);
        expect(scope.$eval('+\'1\'')).toEqual(+'1');
        expect(scope.$eval('-\'1\'')).toEqual(-'1');
        expect(scope.$eval('+undefined')).toEqual(0);

        // Note: don't change toEqual to toBe as toBe collapses 0 & -0.
        expect(scope.$eval('-undefined')).toEqual(-0);
        expect(scope.$eval('+null')).toEqual(+null);
        expect(scope.$eval('-null')).toEqual(-null);
        expect(scope.$eval('+false')).toEqual(+false);
        expect(scope.$eval('-false')).toEqual(-false);
        expect(scope.$eval('+true')).toEqual(+true);
        expect(scope.$eval('-true')).toEqual(-true);
      });

      it('should parse comparison', function() {
        /* eslint-disable eqeqeq, no-self-compare */
        expect(scope.$eval('false')).toBeFalsy();
        expect(scope.$eval('!true')).toBeFalsy();
        expect(scope.$eval('1==1')).toBeTruthy();
        expect(scope.$eval('1==true')).toBeTruthy();
        expect(scope.$eval('1!=true')).toBeFalsy();
        expect(scope.$eval('1===1')).toBeTruthy();
        expect(scope.$eval('1===\'1\'')).toBeFalsy();
        expect(scope.$eval('1===true')).toBeFalsy();
        expect(scope.$eval('\'true\'===true')).toBeFalsy();
        expect(scope.$eval('1!==2')).toBeTruthy();
        expect(scope.$eval('1!==\'1\'')).toBeTruthy();
        expect(scope.$eval('1!=2')).toBeTruthy();
        expect(scope.$eval('1<2')).toBeTruthy();
        expect(scope.$eval('1<=1')).toBeTruthy();
        expect(scope.$eval('1>2')).toEqual(1 > 2);
        expect(scope.$eval('2>=1')).toEqual(2 >= 1);
        expect(scope.$eval('true==2<3')).toEqual(true == 2 < 3);
        expect(scope.$eval('true===2<3')).toEqual(true === 2 < 3);

        expect(scope.$eval('true===3===3')).toEqual(true === 3 === 3);
        expect(scope.$eval('3===3===true')).toEqual(3 === 3 === true);
        expect(scope.$eval('3 >= 3 > 2')).toEqual(3 >= 3 > 2);
        /* eslint-enable */
      });

      it('should parse logical', function() {
        expect(scope.$eval('0&&2')).toEqual(0 && 2);
        expect(scope.$eval('0||2')).toEqual(0 || 2);
        expect(scope.$eval('0||1&&2')).toEqual(0 || 1 && 2);
        expect(scope.$eval('true&&a')).toEqual(true && undefined);
        expect(scope.$eval('true&&a()')).toEqual(true && undefined);
        expect(scope.$eval('true&&a()()')).toEqual(true && undefined);
        expect(scope.$eval('true&&a.b')).toEqual(true && undefined);
        expect(scope.$eval('true&&a.b.c')).toEqual(true && undefined);
        expect(scope.$eval('false||a')).toEqual(false || undefined);
        expect(scope.$eval('false||a()')).toEqual(false || undefined);
        expect(scope.$eval('false||a()()')).toEqual(false || undefined);
        expect(scope.$eval('false||a.b')).toEqual(false || undefined);
        expect(scope.$eval('false||a.b.c')).toEqual(false || undefined);
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
        expect(scope.$eval('\'a\' + \'b c\'')).toEqual('ab c');
      });

      it('should parse filters', function() {
        $filterProvider.register('substring', valueFn(function(input, start, end) {
          return input.substring(start, end);
        }));

        expect(function() {
          scope.$eval('1|nonexistent');
        }).toThrowMinErr('$injector', 'unpr', 'Unknown provider: nonexistentFilterProvider <- nonexistentFilter');

        scope.offset =  3;
        expect(scope.$eval('\'abcd\'|substring:1:offset')).toEqual('bc');
        expect(scope.$eval('\'abcd\'|substring:1:3|uppercase')).toEqual('BC');
      });

      it('should access scope', function() {
        scope.a =  123;
        scope.b = {c: 456};
        expect(scope.$eval('a', scope)).toEqual(123);
        expect(scope.$eval('b.c', scope)).toEqual(456);
        expect(scope.$eval('x.y.z', scope)).not.toBeDefined();
      });

      it('should handle white-spaces around dots in paths', function() {
        scope.a = {b: 4};
        expect(scope.$eval('a . b', scope)).toEqual(4);
        expect(scope.$eval('a. b', scope)).toEqual(4);
        expect(scope.$eval('a .b', scope)).toEqual(4);
        expect(scope.$eval('a    . \nb', scope)).toEqual(4);
      });

      it('should handle white-spaces around dots in method invocations', function() {
        scope.a = {b: function() { return this.c; }, c: 4};
        expect(scope.$eval('a . b ()', scope)).toEqual(4);
        expect(scope.$eval('a. b ()', scope)).toEqual(4);
        expect(scope.$eval('a .b ()', scope)).toEqual(4);
        expect(scope.$eval('a  \n  . \nb   \n ()', scope)).toEqual(4);
      });

      it('should throw syntax error exception for identifiers ending with a dot', function() {
        scope.a = {b: 4};

        expect(function() {
          scope.$eval('a.', scope);
        }).toThrowMinErr('$parse', 'ueoe',
          'Unexpected end of expression: a.');

        expect(function() {
          scope.$eval('a .', scope);
        }).toThrowMinErr('$parse', 'ueoe',
          'Unexpected end of expression: a .');
      });

      it('should resolve deeply nested paths (important for CSP mode)', function() {
        scope.a = {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: {l: {m: {n: 'nooo!'}}}}}}}}}}}}};
        expect(scope.$eval('a.b.c.d.e.f.g.h.i.j.k.l.m.n', scope)).toBe('nooo!');
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
        expect(scope.$eval('a + b')).toBeUndefined();
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
          return 'custom toString';
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
        expect(scope.$eval('(1+2)*3')).toEqual((1 + 2) * 3);
      });

      it('should evaluate assignments', function() {
        expect(scope.$eval('a=12')).toEqual(12);
        expect(scope.a).toEqual(12);

        expect(scope.$eval('x.y.z=123;')).toEqual(123);
        expect(scope.x.y.z).toEqual(123);

        expect(scope.$eval('a=123; b=234')).toEqual(234);
        expect(scope.a).toEqual(123);
        expect(scope.b).toEqual(234);
      });

      it('should throw with invalid left-val in assignments', function() {
        expect(function() { scope.$eval('1 = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('{} = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('[] = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('true = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('(a=b) = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('(1<2) = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('(1+2) = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('!v = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('this = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('+v = 1'); }).toThrowMinErr('$parse', 'lval');
        expect(function() { scope.$eval('(1?v1:v2) = 1'); }).toThrowMinErr('$parse', 'lval');
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
        expect(scope.$eval('const()')).toEqual(123);
      });

      it('should evaluate function call with arguments', function() {
        scope.add =  function(a, b) {
          return a + b;
        };
        expect(scope.$eval('add(1,2)')).toEqual(3);
      });

      it('should allow filter chains as arguments', function() {
        scope.concat = function(a, b) {
          return a + b;
        };
        scope.begin = 1;
        scope.limit = 2;
        expect(scope.$eval('concat(\'abcd\'|limitTo:limit:begin,\'abcd\'|limitTo:2:1|uppercase)')).toEqual('bcBC');
      });

      it('should evaluate function call from a return value', function() {
        scope.getter = function() { return function() { return 33; }; };
        expect(scope.$eval('getter()()')).toBe(33);
      });

      // Support: IE 9 only
      // There is no "strict mode" in IE9
      if (msie !== 9) {
        it('should set no context to functions returned by other functions', function() {
          scope.getter = function() { return function() { expect(this).toBeUndefined(); }; };
          scope.$eval('getter()()');
        });
      }

      it('should evaluate multiplication and division', function() {
        scope.taxRate =  8;
        scope.subTotal =  100;
        expect(scope.$eval('taxRate / 100 * subTotal')).toEqual(8);
        expect(scope.$eval('subTotal * taxRate / 100')).toEqual(8);
      });

      it('should evaluate array', function() {
        expect(scope.$eval('[]').length).toEqual(0);
        expect(scope.$eval('[1, 2]').length).toEqual(2);
        expect(scope.$eval('[1, 2]')[0]).toEqual(1);
        expect(scope.$eval('[1, 2]')[1]).toEqual(2);
        expect(scope.$eval('[1, 2,]')[1]).toEqual(2);
        expect(scope.$eval('[1, 2,]').length).toEqual(2);
      });

      it('should evaluate array access', function() {
        expect(scope.$eval('[1][0]')).toEqual(1);
        expect(scope.$eval('[[1]][0][0]')).toEqual(1);
        expect(scope.$eval('[].length')).toEqual(0);
        expect(scope.$eval('[1, 2].length')).toEqual(2);
      });

      it('should evaluate object', function() {
        expect(scope.$eval('{}')).toEqual({});
        expect(scope.$eval('{a:\'b\'}')).toEqual({a:'b'});
        expect(scope.$eval('{\'a\':\'b\'}')).toEqual({a:'b'});
        expect(scope.$eval('{"a":\'b\'}')).toEqual({a:'b'});
        expect(scope.$eval('{a:\'b\',}')).toEqual({a:'b'});
        expect(scope.$eval('{\'a\':\'b\',}')).toEqual({a:'b'});
        expect(scope.$eval('{"a":\'b\',}')).toEqual({a:'b'});
        expect(scope.$eval('{\'0\':1}')).toEqual({0:1});
        expect(scope.$eval('{0:1}')).toEqual({0:1});
        expect(scope.$eval('{1:1}')).toEqual({1:1});
        expect(scope.$eval('{null:1}')).toEqual({null:1});
        expect(scope.$eval('{\'null\':1}')).toEqual({null:1});
        expect(scope.$eval('{false:1}')).toEqual({false:1});
        expect(scope.$eval('{\'false\':1}')).toEqual({false:1});
        expect(scope.$eval('{\'\':1,}')).toEqual({'':1});

        // ES6 object initializers.
        expect(scope.$eval('{x, y}', {x: 'foo', y: 'bar'})).toEqual({x: 'foo', y: 'bar'});
        expect(scope.$eval('{[x]: x}', {x: 'foo'})).toEqual({foo: 'foo'});
        expect(scope.$eval('{[x + "z"]: x}', {x: 'foo'})).toEqual({fooz: 'foo'});
        expect(scope.$eval('{x, 1: x, [x = x + 1]: x, 3: x + 1, [x = x + 2]: x, 5: x + 1}', {x: 1}))
            .toEqual({x: 1, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5});
      });

      it('should throw syntax error exception for non constant/identifier JSON keys', function() {
        expect(function() { scope.$eval('{[:0}'); }).toThrowMinErr('$parse', 'syntax',
          'Syntax Error: Token \':\' not a primary expression at column 3 of the expression [{[:0}] starting at [:0}]');
        expect(function() { scope.$eval('{{:0}'); }).toThrowMinErr('$parse', 'syntax',
          'Syntax Error: Token \'{\' invalid key at column 2 of the expression [{{:0}] starting at [{:0}]');
        expect(function() { scope.$eval('{?:0}'); }).toThrowMinErr('$parse', 'syntax',
          'Syntax Error: Token \'?\' invalid key at column 2 of the expression [{?:0}] starting at [?:0}]');
        expect(function() { scope.$eval('{):0}'); }).toThrowMinErr('$parse', 'syntax',
          'Syntax Error: Token \')\' invalid key at column 2 of the expression [{):0}] starting at [):0}]');
      });

      it('should evaluate object access', function() {
        expect(scope.$eval('{false:\'WC\', true:\'CC\'}[false]')).toEqual('WC');
      });

      it('should evaluate JSON', function() {
        expect(scope.$eval('[{}]')).toEqual([{}]);
        expect(scope.$eval('[{a:[]}, {b:1}]')).toEqual([{a:[]}, {b:1}]);
      });

      it('should evaluate multiple statements', function() {
        expect(scope.$eval('a=1;b=3;a+b')).toEqual(4);
        expect(scope.$eval(';;1;;')).toEqual(1);
      });

      it('should evaluate object methods in correct context (this)', function() {
        function C() {
          this.a = 123;
        }
        C.prototype.getA = function() {
          return this.a;
        };

        scope.obj = new C();
        expect(scope.$eval('obj.getA()')).toEqual(123);
        expect(scope.$eval('obj[\'getA\']()')).toEqual(123);
      });

      it('should evaluate methods in correct context (this) in argument', function() {
        function C() {
          this.a = 123;
        }
        C.prototype.sum = function(value) {
          return this.a + value;
        };
        C.prototype.getA = function() {
          return this.a;
        };

        scope.obj = new C();
        expect(scope.$eval('obj.sum(obj.getA())')).toEqual(246);
        expect(scope.$eval('obj[\'sum\'](obj.getA())')).toEqual(246);
      });

      it('should evaluate objects on scope context', function() {
        scope.a =  'abc';
        expect(scope.$eval('{a:a}').a).toEqual('abc');
      });

      it('should evaluate field access on function call result', function() {
        scope.a =  function() {
          return {name:'misko'};
        };
        expect(scope.$eval('a().name')).toEqual('misko');
      });

      it('should evaluate field access after array access', function() {
        scope.items =  [{}, {name:'misko'}];
        expect(scope.$eval('items[1].name')).toEqual('misko');
      });

      it('should evaluate array assignment', function() {
        scope.items =  [];

        expect(scope.$eval('items[1] = "abc"')).toEqual('abc');
        expect(scope.$eval('items[1]')).toEqual('abc');
        expect(scope.$eval('books[1] = "moby"')).toEqual('moby');
        expect(scope.$eval('books[1]')).toEqual('moby');
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
        expect(scope.$eval('!false || true')).toEqual(!false || true);
        // eslint-disable-next-line eqeqeq
        expect(scope.$eval('!11 == 10')).toEqual(!11 == 10);
        expect(scope.$eval('12/6/2')).toEqual(12 / 6 / 2);
      });

      it('should evaluate exclamation mark', function() {
        expect(scope.$eval('suffix = "!"')).toEqual('!');
      });

      it('should evaluate minus', function() {
        expect(scope.$eval('{a:\'-\'}')).toEqual({a: '-'});
      });

      it('should evaluate undefined', function() {
        expect(scope.$eval('undefined')).not.toBeDefined();
        expect(scope.$eval('a=undefined')).not.toBeDefined();
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
          throw new Error('IT SHOULD NOT HAVE RUN');
        };
        expect(scope.$eval('false && run()')).toBe(false);
        expect(scope.$eval('false && true && run()')).toBe(false);
      });

      it('should short-circuit OR operator', function() {
        scope.run = function() {
          throw new Error('IT SHOULD NOT HAVE RUN');
        };
        expect(scope.$eval('true || run()')).toBe(true);
        expect(scope.$eval('true || false || run()')).toBe(true);
      });

      it('should throw TypeError on using a \'broken\' object as a key to access a property', function() {
        scope.object = {};
        forEach([
          { toString: 2 },
          { toString: null },
          { toString: function() { return {}; } }
        ], function(brokenObject) {
          scope.brokenObject = brokenObject;
          expect(function() {
            scope.$eval('object[brokenObject]');
          }).toThrow();
        });
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
        scope.a = 'a';
        scope.b = {c: 'bc'};
        expect(scope.$eval('a + \n b.c + \r "\td" + \t \r\n\r "\r\n\n"')).toEqual('abc\td\r\n\n');
      });


      // https://github.com/angular/angular.js/issues/10968
      it('should evaluate arrays literals initializers left-to-right', inject(function($parse) {
        var s = {c:function() {return {b: 1}; }};
        expect($parse('e=1;[a=c(),d=a.b+1]')(s)).toEqual([{b: 1}, 2]);
      }));

      it('should evaluate function arguments left-to-right', inject(function($parse) {
        var s = {c:function() {return {b: 1}; }, i: function(x, y) { return [x, y];}};
        expect($parse('e=1;i(a=c(),d=a.b+1)')(s)).toEqual([{b: 1}, 2]);
      }));

      it('should evaluate object properties expressions left-to-right', inject(function($parse) {
        var s = {c:function() {return {b: 1}; }};
        expect($parse('e=1;{x: a=c(), y: d=a.b+1}')(s)).toEqual({x: {b: 1}, y: 2});
      }));


      it('should call the function from the received instance and not from a new one', function() {
        var n = 0;
        scope.fn = function() {
          var c = n++;
          return { c: c, anotherFn: function() { return this.c === c; } };
        };
        expect(scope.$eval('fn().anotherFn()')).toBe(true);
      });


      it('should call the function once when it is part of the context', function() {
        var count = 0;
        scope.fn = function() {
          count++;
          return { anotherFn: function() { return 'lucas'; } };
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

        it('should return the assigned value', inject(function($parse) {
          var fn = $parse('a');
          var scope = {};
          expect(fn.assign(scope, 123)).toBe(123);
          var someObject = {};
          expect(fn.assign(scope, someObject)).toBe(someObject);
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
          expect(fn()).toEqual(undefined);
        }));

        it('should invoke a stateless filter once when the parsed expression has an interceptor',
           inject(function($parse, $rootScope) {
          var countFilter = jasmine.createSpy();
          var interceptor = jasmine.createSpy();
          countFilter.and.returnValue(1);
          $filterProvider.register('count', valueFn(countFilter));
          $rootScope.foo = function() { return 1; };
          $rootScope.$watch($parse(':: foo() | count', interceptor));
          $rootScope.$digest();
          expect(countFilter.calls.count()).toBe(1);
        }));

        describe('literal expressions', function() {
          it('should mark an empty expressions as literal', inject(function($parse) {
            expect($parse('').literal).toBe(true);
            expect($parse('   ').literal).toBe(true);
            expect($parse('::').literal).toBe(true);
            expect($parse('::    ').literal).toBe(true);
          }));

          [true, false].forEach(function(isDeep) {
            describe(isDeep ? 'deepWatch' : 'watch', function() {
              it('should only become stable when all the properties of an object have defined values', inject(function($parse, $rootScope, log) {
                var fn = $parse('::{foo: foo, bar: bar}');
                $rootScope.$watch(fn, function(value) { log(value); }, isDeep);

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
                $rootScope.$watch(fn, function(value) { log(value); }, isDeep);

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
                $rootScope.$watch(fn, function(value) { log(value); }, isDeep);
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
        });
      });


      describe('watched $parse expressions', function() {

        it('should respect short-circuiting AND if it could have side effects', function() {
          var bCalled = 0;
          scope.b = function() { bCalled++; };

          scope.$watch('a && b()');
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

          scope.$watch('a || b()');
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

          scope.$watch('a ? b() : 1');
          scope.$digest();
          expect(bCalled).toBe(false);

          scope.a = true;
          scope.$digest();
          expect(bCalled).toBe(true);
        });

        describe('filters', function() {

          it('should not be invoked unless the input/arguments change', function() {
            var filterCalled = false;
            $filterProvider.register('foo', valueFn(function(input) {
              filterCalled = true;
              return input;
            }));

            scope.$watch('a | foo:b:1');
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

          it('should always be invoked if they are marked as having $stateful', function() {
            var filterCalled = false;
            $filterProvider.register('foo', valueFn(extend(function(input) {
              filterCalled = true;
              return input;
            }, {$stateful: true})));

            scope.$watch('a | foo:b:1');
            scope.a = 0;
            scope.$digest();
            expect(filterCalled).toBe(true);

            filterCalled = false;
            scope.$digest();
            expect(filterCalled).toBe(true);
          });

          it('should be treated as constant when input are constant', inject(function($parse) {
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

          describe('with non-primitive input', function() {

            describe('that does NOT support valueOf()', function() {

              it('should always be reevaluated', inject(function($parse) {
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

              it('should always be reevaluated in literals', inject(function($parse) {
                $filterProvider.register('foo', valueFn(function(input) {
                  return input.b > 0;
                }));

                scope.$watch('[(a | foo)]', function() {});

                // Would be great if filter-output was checked for changes and this didn't throw...
                expect(function() { scope.$apply('a = {b: 1}'); }).toThrowMinErr('$rootScope', 'infdig');
              }));

              it('should always be reevaluated when passed literals', inject(function($parse) {
                scope.$watch('[a] | filter', function() {});

                scope.$apply('a = 1');

                // Would be great if filter-output was checked for changes and this didn't throw...
                expect(function() { scope.$apply('a = {}'); }).toThrowMinErr('$rootScope', 'infdig');
              }));
            });

            describe('that does support valueOf()', function() {

              it('should not be reevaluated',
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

              it('should not be reevaluated in literals', inject(function($parse) {
                var filterCalls = 0;
                $filterProvider.register('foo', valueFn(function(input) {
                  filterCalls++;
                  return input;
                }));

                scope.date = new Date(1234567890123);

                var watcherCalls = 0;
                scope.$watch('[(date | foo)]', function(input) {
                  watcherCalls++;
                });

                scope.$digest();
                expect(filterCalls).toBe(1);
                expect(watcherCalls).toBe(1);

                scope.$digest();
                expect(filterCalls).toBe(1);
                expect(watcherCalls).toBe(1);
              }));

              it('should be reevaluated when valueOf() changes', inject(function($parse) {
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

              it('should be reevaluated in literals when valueOf() changes', inject(function($parse) {
                var filterCalls = 0;
                $filterProvider.register('foo', valueFn(function(input) {
                  filterCalls++;
                  return input;
                }));

                scope.date = new Date(1234567890123);

                var watcherCalls = 0;
                scope.$watch('[(date | foo)]', function(input) {
                  watcherCalls++;
                });

                scope.$digest();
                expect(filterCalls).toBe(1);
                expect(watcherCalls).toBe(1);

                scope.date.setTime(1234567890);

                scope.$digest();
                expect(filterCalls).toBe(2);
                expect(watcherCalls).toBe(2);
              }));

              it('should not be reevaluated when the instance changes but valueOf() does not', inject(function($parse) {
                var filterCalls = 0;
                $filterProvider.register('foo', valueFn(function(input) {
                  filterCalls++;
                  return input;
                }));

                scope.date = new Date(1234567890123);

                var watcherCalls = 0;
                scope.$watch($parse('[(date | foo)]'), function(input) {
                  watcherCalls++;
                });

                scope.$digest();
                expect(watcherCalls).toBe(1);
                expect(filterCalls).toBe(1);

                scope.date = new Date(1234567890123);
                scope.$digest();
                expect(watcherCalls).toBe(1);
                expect(filterCalls).toBe(1);
              }));
            });

            it('should not be reevaluated when input is simplified via unary operators', inject(function($parse) {
              var filterCalls = 0;
              $filterProvider.register('foo', valueFn(function(input) {
                filterCalls++;
                return input;
              }));

              scope.obj = {};

              var watcherCalls = 0;
              scope.$watch('!obj | foo:!obj', function(input) {
                watcherCalls++;
              });

              scope.$digest();
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);

              scope.$digest();
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);
            }));

            it('should not be reevaluated when input is simplified via non-plus/concat binary operators', inject(function($parse) {
              var filterCalls = 0;
              $filterProvider.register('foo', valueFn(function(input) {
                filterCalls++;
                return input;
              }));

              scope.obj = {};

              var watcherCalls = 0;
              scope.$watch('1 - obj | foo:(1 * obj)', function(input) {
                watcherCalls++;
              });

              scope.$digest();
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);

              scope.$digest();
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);
            }));

            it('should be reevaluated when input is simplified via plus/concat', inject(function($parse) {
              var filterCalls = 0;
              $filterProvider.register('foo', valueFn(function(input) {
                filterCalls++;
                return input;
              }));

              scope.obj = {};

              var watcherCalls = 0;
              scope.$watch('1 + obj | foo', function(input) {
                watcherCalls++;
              });

              scope.$digest();
              expect(filterCalls).toBe(2);
              expect(watcherCalls).toBe(1);

              scope.$digest();
              expect(filterCalls).toBe(3);
              expect(watcherCalls).toBe(1);
            }));

            it('should reevaluate computed member expressions', inject(function($parse) {
              var toStringCalls = 0;

              scope.obj = {};
              scope.key = {
                toString: function() {
                  toStringCalls++;
                  return 'foo';
                }
              };

              var watcherCalls = 0;
              scope.$watch('obj[key]', function(input) {
                watcherCalls++;
              });

              scope.$digest();
              expect(toStringCalls).toBe(2);
              expect(watcherCalls).toBe(1);

              scope.$digest();
              expect(toStringCalls).toBe(3);
              expect(watcherCalls).toBe(1);
            }));

            it('should be reevaluated with input created with null prototype', inject(function($parse) {
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
          });

          describe('with primitive input', function() {

            it('should not be reevaluated when passed literals', inject(function($parse) {
              var filterCalls = 0;
              $filterProvider.register('foo', valueFn(function(input) {
                filterCalls++;
                return input;
              }));

              var watcherCalls = 0;
              scope.$watch('[a] | foo', function(input) {
                watcherCalls++;
              });

              scope.$apply('a = 1');
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);

              scope.$apply('a = 2');
              expect(filterCalls).toBe(2);
              expect(watcherCalls).toBe(2);
            }));

            it('should not be reevaluated in literals', inject(function($parse) {
              var filterCalls = 0;
              $filterProvider.register('foo', valueFn(function(input) {
                filterCalls++;
                return input;
              }));

              scope.prim = 1234567890123;

              var watcherCalls = 0;
              scope.$watch('[(prim | foo)]', function(input) {
                watcherCalls++;
              });

              scope.$digest();
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);

              scope.$digest();
              expect(filterCalls).toBe(1);
              expect(watcherCalls).toBe(1);
            }));
          });
        });

        describe('interceptorFns', function() {

          it('should always be invoked if they are flagged as having $stateful',
              inject(function($parse) {
            var called = false;
            function interceptor() {
              called = true;
            }
            interceptor.$stateful = true;

            scope.$watch($parse('a', interceptor));
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

          it('should not be invoked unless the input changes', inject(function($parse) {
            var called = false;
            function interceptor(v) {
              called = true;
              return v;
            }
            scope.$watch($parse('a', interceptor));
            scope.$watch($parse('a + b', interceptor));
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

          it('should always be invoked if inputs are non-primitive', inject(function($parse) {
            var called = false;
            function interceptor(v) {
              called = true;
              return v.sub;
            }

            scope.$watch($parse('[o]', interceptor));
            scope.o = {sub: 1};

            called = false;
            scope.$digest();
            expect(called).toBe(true);

            called = false;
            scope.$digest();
            expect(called).toBe(true);
          }));

          it('should not be invoked unless the input.valueOf() changes even if the instance changes', inject(function($parse) {
            var called = false;
            function interceptor(v) {
              called = true;
              return v;
            }
            scope.$watch($parse('a', interceptor));
            scope.a = new Date();
            scope.$digest();
            expect(called).toBe(true);

            called = false;
            scope.a = new Date(scope.a.valueOf());
            scope.$digest();
            expect(called).toBe(false);
          }));

          it('should be invoked if input.valueOf() changes even if the instance does not', inject(function($parse) {
            var called = false;
            function interceptor(v) {
              called = true;
              return v;
            }
            scope.$watch($parse('a', interceptor));
            scope.a = new Date();
            scope.$digest();
            expect(called).toBe(true);

            called = false;
            scope.a.setTime(scope.a.getTime() + 1);
            scope.$digest();
            expect(called).toBe(true);
          }));

          it('should be invoked when the expression is `undefined`', inject(function($parse) {
            var called = false;
            function interceptor(v) {
              called = true;
              return v;
            }
            scope.$watch($parse(undefined, interceptor));
            scope.$digest();
            expect(called).toBe(true);
          }));

          it('should not affect when a one-time binding becomes stable', inject(function($parse) {
            scope.$watch($parse('::x'));
            scope.$watch($parse('::x', identity));
            scope.$watch($parse('::x', function() { return 1; }));  //interceptor that returns non-undefined

            scope.$digest();
            expect(scope.$$watchersCount).toBe(3);

            scope.x = 1;
            scope.$digest();
            expect(scope.$$watchersCount).toBe(0);
          }));

          it('should not affect when a one-time literal binding becomes stable', inject(function($parse) {
            scope.$watch($parse('::[x]'));
            scope.$watch($parse('::[x]', identity));
            scope.$watch($parse('::[x]', function() { return 1; }));  //interceptor that returns non-literal

            scope.$digest();
            expect(scope.$$watchersCount).toBe(3);

            scope.x = 1;
            scope.$digest();
            expect(scope.$$watchersCount).toBe(0);
          }));
        });

        describe('literals', function() {

          it('should support watching', inject(function($parse) {
            var lastVal = NaN;
            var callCount = 0;
            var listener = function(val) { callCount++; lastVal = val; };

            scope.$watch('{val: val}', listener);

            scope.$apply('val = 1');
            expect(callCount).toBe(1);
            expect(lastVal).toEqual({val: 1});

            scope.$apply('val = []');
            expect(callCount).toBe(2);
            expect(lastVal).toEqual({val: []});

            scope.$apply('val = []');
            expect(callCount).toBe(3);
            expect(lastVal).toEqual({val: []});

            scope.$apply('val = {}');
            expect(callCount).toBe(4);
            expect(lastVal).toEqual({val: {}});
          }));

          it('should only watch the direct inputs', inject(function($parse) {
            var lastVal = NaN;
            var callCount = 0;
            var listener = function(val) { callCount++; lastVal = val; };

            scope.$watch('{val: val}', listener);

            scope.$apply('val = 1');
            expect(callCount).toBe(1);
            expect(lastVal).toEqual({val: 1});

            scope.$apply('val = [2]');
            expect(callCount).toBe(2);
            expect(lastVal).toEqual({val: [2]});

            scope.$apply('val.push(3)');
            expect(callCount).toBe(2);

            scope.$apply('val.length = 0');
            expect(callCount).toBe(2);
          }));

          it('should only watch the direct inputs when nested', inject(function($parse) {
            var lastVal = NaN;
            var callCount = 0;
            var listener = function(val) { callCount++; lastVal = val; };

            scope.$watch('[{val: [val]}]', listener);

            scope.$apply('val = 1');
            expect(callCount).toBe(1);
            expect(lastVal).toEqual([{val: [1]}]);

            scope.$apply('val = [2]');
            expect(callCount).toBe(2);
            expect(lastVal).toEqual([{val: [[2]]}]);

            scope.$apply('val.push(3)');
            expect(callCount).toBe(2);

            scope.$apply('val.length = 0');
            expect(callCount).toBe(2);
          }));

          describe('with non-primative input', function() {

            describe('that does NOT support valueOf()', function() {
              it('should not be reevaluated', inject(function($parse) {
                var obj = scope.obj = {};

                var parsed = $parse('[obj]');
                var watcherCalls = 0;
                scope.$watch(parsed, function(input) {
                  expect(input[0]).toBe(obj);
                  watcherCalls++;
                });

                scope.$digest();
                expect(watcherCalls).toBe(1);

                scope.$digest();
                expect(watcherCalls).toBe(1);
              }));
            });

            describe('that does support valueOf()', function() {
              it('should not be reevaluated', inject(function($parse) {
                var date = scope.date = new Date();

                var parsed = $parse('[date]');
                var watcherCalls = 0;
                scope.$watch(parsed, function(input) {
                  expect(input[0]).toBe(date);
                  watcherCalls++;
                });

                scope.$digest();
                expect(watcherCalls).toBe(1);

                scope.$digest();
                expect(watcherCalls).toBe(1);
              }));

              it('should be reevaluated even when valueOf() changes', inject(function($parse) {
                var date = scope.date = new Date();

                var parsed = $parse('[date]');
                var watcherCalls = 0;
                scope.$watch(parsed, function(input) {
                  expect(input[0]).toBe(date);
                  watcherCalls++;
                });

                scope.$digest();
                expect(watcherCalls).toBe(1);

                date.setYear(1901);

                scope.$digest();
                expect(watcherCalls).toBe(2);
              }));

              it('should not be reevaluated when the instance changes but valueOf() does not', inject(function($parse) {
                scope.date = new Date(1234567890123);

                var parsed = $parse('[date]');
                var watcherCalls = 0;
                scope.$watch(parsed, function(input) {
                  watcherCalls++;
                });

                scope.$digest();
                expect(watcherCalls).toBe(1);

                scope.date = new Date(1234567890123);
                scope.$digest();
                expect(watcherCalls).toBe(1);
              }));

              it('should be reevaluated when the instance does not change but valueOf() does', inject(function($parse) {

                scope.date = new Date(1234567890123);

                var parsed = $parse('[date]');
                var watcherCalls = 0;
                scope.$watch(parsed, function(input) {
                  watcherCalls++;
                });

                scope.$digest();
                expect(watcherCalls).toBe(1);

                scope.date.setTime(scope.date.getTime() + 1);
                scope.$digest();
                expect(watcherCalls).toBe(2);
              }));
            });
          });
        });

        it('should continue with the evaluation of the expression without invoking computed parts',
            inject(function($parse) {
          var value = 'foo';
          var spy = jasmine.createSpy();

          spy.and.callFake(function() { return value; });
          scope.foo = spy;
          scope.$watch('foo() | uppercase');
          scope.$digest();
          expect(spy).toHaveBeenCalledTimes(2);
          scope.$digest();
          expect(spy).toHaveBeenCalledTimes(3);
          value = 'bar';
          scope.$digest();
          expect(spy).toHaveBeenCalledTimes(5);
        }));

        it('should invoke all statements in multi-statement expressions', inject(function($parse) {
          var lastVal = NaN;
          var listener = function(val) { lastVal = val; };

          scope.setBarToOne = false;
          scope.bar = 0;
          scope.two = 2;
          scope.foo = function() { if (scope.setBarToOne) scope.bar = 1; };
          scope.$watch('foo(); bar + two', listener);

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

          scope.$watch('curObj.value = input', noop);

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

        it('should watch ES6 object computed property changes', function() {
          var count = 0;
          var values = [];

          scope.$watch('{[a]: true}', function(val) {
            count++;
            values.push(val);
          }, true);

          scope.$digest();
          expect(count).toBe(1);
          expect(values[0]).toEqual({'undefined': true});

          scope.$digest();
          expect(count).toBe(1);
          expect(values[0]).toEqual({'undefined': true});

          scope.a = true;
          scope.$digest();
          expect(count).toBe(2);
          expect(values[1]).toEqual({'true': true});

          scope.a = 'abc';
          scope.$digest();
          expect(count).toBe(3);
          expect(values[2]).toEqual({'abc': true});

          scope.a = undefined;
          scope.$digest();
          expect(count).toBe(4);
          expect(values[3]).toEqual({'undefined': true});
        });
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

          $parse('a = 1')(s, l);
          expect(s.a).toBe(1);
          expect(l.a).toBeUndefined();

          l.a = 2;
          $parse('a = 0')(s, l);
          expect(s.a).toBe(1);
          expect(l.a).toBe(0);

          $parse('toString = 1')(s, l);
          expect(isFunction(s.toString)).toBe(true);
          expect(l.toString).toBe(1);
        }));

        it('should overwrite undefined / null scope properties when assigning', inject(function($parse) {
          var scope;

          scope = {};
          $parse('a.b = 1')(scope);
          $parse('c["d"] = 2')(scope);
          expect(scope).toEqual({a: {b: 1}, c: {d: 2}});

          scope = {a: {}};
          $parse('a.b.c = 1')(scope);
          $parse('a.c["d"] = 2')(scope);
          expect(scope).toEqual({a: {b: {c: 1}, c: {d: 2}}});

          scope = {a: undefined, c: undefined};
          $parse('a.b = 1')(scope);
          $parse('c["d"] = 2')(scope);
          expect(scope).toEqual({a: {b: 1}, c: {d: 2}});

          scope = {a: {b: undefined, c: undefined}};
          $parse('a.b.c = 1')(scope);
          $parse('a.c["d"] = 2')(scope);
          expect(scope).toEqual({a: {b: {c: 1}, c: {d: 2}}});

          scope = {a: null, c: null};
          $parse('a.b = 1')(scope);
          $parse('c["d"] = 2')(scope);
          expect(scope).toEqual({a: {b: 1}, c: {d: 2}});

          scope = {a: {b: null, c: null}};
          $parse('a.b.c = 1')(scope);
          $parse('a.c["d"] = 2')(scope);
          expect(scope).toEqual({a: {b: {c: 1}, c: {d: 2}}});
        }));

        they('should not overwrite $prop scope properties when assigning', [0, false, '', NaN],
          function(falsyValue) {
            inject(function($parse) {
              var scope;

              scope = {a: falsyValue, c: falsyValue};
              tryParseAndIgnoreException('a.b = 1');
              tryParseAndIgnoreException('c["d"] = 2');
              expect(scope).toEqual({a: falsyValue, c: falsyValue});

              scope = {a: {b: falsyValue, c: falsyValue}};
              tryParseAndIgnoreException('a.b.c = 1');
              tryParseAndIgnoreException('a.c["d"] = 2');
              expect(scope).toEqual({a: {b: falsyValue, c: falsyValue}});

              // Helpers
              //
              // Normally assigning property on a primitive should throw exception in strict mode
              // and silently fail in non-strict mode, IE seems to always have the non-strict-mode behavior,
              // so if we try to use 'expect(function() {$parse('a.b=1')({a:false});).toThrow()' for testing
              // the test will fail in case of IE because it will not throw exception, and if we just use
              // '$parse('a.b=1')({a:false})' the test will fail because it will throw exception in case of Chrome
              // so we use tryParseAndIgnoreException helper to catch the exception silently for all cases.
              //
              function tryParseAndIgnoreException(expression) {
                try {
                    $parse(expression)(scope);
                } catch (error) {/* ignore exception */}
              }
            });
          });
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
          expect($parse('{[standard]: 4/3, wide: 16/9}').constant).toBe(false);
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
          expect($rootScope.$eval('a.null.undefined.b', {a:{null:{undefined:{b: 1}}}})).toBe(1);
        }));

        it('should not allow overriding null/undefined keywords', inject(function($rootScope) {
          expect($rootScope.$eval('null.a', {null: {a: 42}})).toBeUndefined();
        }));

        it('should allow accessing null/undefined properties on `this`', inject(function($rootScope) {
          $rootScope.null = {a: 42};
          expect($rootScope.$eval('this.null.a')).toBe(42);
        }));

        it('should allow accessing $locals', inject(function($rootScope) {
          $rootScope.foo = 'foo';
          $rootScope.bar = 'bar';
          $rootScope.$locals = 'foo';
          var locals = {foo: 42};
          expect($rootScope.$eval('$locals')).toBeUndefined();
          expect($rootScope.$eval('$locals.foo')).toBeUndefined();
          expect($rootScope.$eval('this.$locals')).toBe('foo');
          expect(function() {
            $rootScope.$eval('$locals = {}');
          }).toThrow();
          expect(function() {
            $rootScope.$eval('$locals.bar = 23');
          }).toThrow();
          expect($rootScope.$eval('$locals', locals)).toBe(locals);
          expect($rootScope.$eval('$locals.foo', locals)).toBe(42);
          expect($rootScope.$eval('this.$locals', locals)).toBe('foo');
          expect(function() {
            $rootScope.$eval('$locals = {}', locals);
          }).toThrow();
          expect($rootScope.$eval('$locals.bar = 23', locals)).toEqual(23);
          expect(locals.bar).toBe(23);
        }));
      });
    });
  });

  forEach([true, false], function(cspEnabled) {
    describe('custom identifiers (csp: ' + cspEnabled + ')', function() {
      var isIdentifierStartRe = /[#a-z]/;
      var isIdentifierContinueRe = /[-a-z]/;
      var isIdentifierStartFn;
      var isIdentifierContinueFn;
      var scope;

      beforeEach(module(function($parseProvider) {
        isIdentifierStartFn = jasmine.
          createSpy('isIdentifierStart').
          and.callFake(function(ch, cp) { return isIdentifierStartRe.test(ch); });
        isIdentifierContinueFn = jasmine.
          createSpy('isIdentifierContinue').
          and.callFake(function(ch, cp) { return isIdentifierContinueRe.test(ch); });

        $parseProvider.setIdentifierFns(isIdentifierStartFn, isIdentifierContinueFn);
        csp().noUnsafeEval = cspEnabled;
      }));

      beforeEach(inject(function($rootScope) {
        scope = $rootScope;
      }));


      it('should allow specifying a custom `isIdentifierStart/Continue` functions', function() {
        scope.x = {};

        scope['#foo'] = 'foo';
        scope.x['#foo'] = 'foo';
        expect(scope.$eval('#foo')).toBe('foo');
        expect(scope.$eval('x.#foo')).toBe('foo');

        scope['bar--'] = 42;
        scope.x['bar--'] = 42;
        expect(scope.$eval('bar--')).toBe(42);
        expect(scope.$eval('x.bar--')).toBe(42);
        expect(scope['bar--']).toBe(42);
        expect(scope.x['bar--']).toBe(42);

        scope['#-'] = 'baz';
        scope.x['#-'] = 'baz';
        expect(scope.$eval('#-')).toBe('baz');
        expect(scope.$eval('x.#-')).toBe('baz');

        expect(function() { scope.$eval('##'); }).toThrow();
        expect(function() { scope.$eval('x.##'); }).toThrow();

        expect(function() { scope.$eval('--'); }).toThrow();
        expect(function() { scope.$eval('x.--'); }).toThrow();
      });


      it('should pass the character and codepoint to the custom functions', function() {
        scope.$eval('#-');
        expect(isIdentifierStartFn).toHaveBeenCalledOnceWith('#', '#'.charCodeAt(0));
        expect(isIdentifierContinueFn).toHaveBeenCalledOnceWith('-', '-'.charCodeAt(0));

        isIdentifierStartFn.calls.reset();
        isIdentifierContinueFn.calls.reset();

        scope.$eval('#.foo.#-.bar-');
        expect(isIdentifierStartFn).toHaveBeenCalledTimes(7);
        expect(isIdentifierStartFn.calls.allArgs()).toEqual([
          ['#', '#'.charCodeAt(0)],
          ['.', '.'.charCodeAt(0)],
          ['f', 'f'.charCodeAt(0)],
          ['.', '.'.charCodeAt(0)],
          ['#', '#'.charCodeAt(0)],
          ['.', '.'.charCodeAt(0)],
          ['b', 'b'.charCodeAt(0)]
        ]);
        expect(isIdentifierContinueFn).toHaveBeenCalledTimes(9);
        expect(isIdentifierContinueFn.calls.allArgs()).toEqual([
          ['.', '.'.charCodeAt(0)],
          ['o', 'o'.charCodeAt(0)],
          ['o', 'o'.charCodeAt(0)],
          ['.', '.'.charCodeAt(0)],
          ['-', '-'.charCodeAt(0)],
          ['.', '.'.charCodeAt(0)],
          ['a', 'a'.charCodeAt(0)],
          ['r', 'r'.charCodeAt(0)],
          ['-', '-'.charCodeAt(0)]
        ]);
      });
    });
  });
});
