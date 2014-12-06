'use strict';

var $parseMinErr = minErr('$parse');

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are generally considered safe because these expressions only have direct
// access to `$scope` and locals. However, one can obtain the ability to execute arbitrary JS code by
// obtaining a reference to native JS functions such as the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor('alert("evil JS code")')
//
// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
// against the expression language, but not to prevent exploits that were enabled by exposing
// sensitive JavaScript or browser APIs on Scope. Exposing such objects on a Scope is never a good
// practice and therefore we are not even trying to protect against interaction with an object
// explicitly exposed in this way.
//
// In general, it is not possible to access a Window object from an angular expression unless a
// window or some DOM object that has a reference to window is published onto a Scope.
// Similarly we prevent invocations of function known to be dangerous, as well as assignments to
// native objects.
//
// See https://docs.angularjs.org/guide/security


function ensureSafeMemberName(name, fullExpression) {
  if (name === "__defineGetter__" || name === "__defineSetter__"
      || name === "__lookupGetter__" || name === "__lookupSetter__"
      || name === "__proto__") {
    throw $parseMinErr('isecfld',
        'Attempting to access a disallowed field in Angular expressions! '
        + 'Expression: {0}', fullExpression);
  }
  return name;
}

function ensureSafeObject(obj, fullExpression) {
  // nifty check if obj is Function that is fast and works across iframes and other contexts
  if (obj) {
    if (obj.constructor === obj) {
      throw $parseMinErr('isecfn',
          'Referencing Function in Angular expressions is disallowed! Expression: {0}',
          fullExpression);
    } else if (// isWindow(obj)
        obj.window === obj) {
      throw $parseMinErr('isecwindow',
          'Referencing the Window in Angular expressions is disallowed! Expression: {0}',
          fullExpression);
    } else if (// isElement(obj)
        obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
      throw $parseMinErr('isecdom',
          'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}',
          fullExpression);
    } else if (// block Object so that we can't get hold of dangerous Object.* methods
        obj === Object) {
      throw $parseMinErr('isecobj',
          'Referencing Object in Angular expressions is disallowed! Expression: {0}',
          fullExpression);
    }
  }
  return obj;
}

var CALL = Function.prototype.call;
var APPLY = Function.prototype.apply;
var BIND = Function.prototype.bind;

function ensureSafeFunction(obj, fullExpression) {
  if (obj) {
    if (obj.constructor === obj) {
      throw $parseMinErr('isecfn',
        'Referencing Function in Angular expressions is disallowed! Expression: {0}',
        fullExpression);
    } else if (obj === CALL || obj === APPLY || obj === BIND) {
      throw $parseMinErr('isecff',
        'Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}',
        fullExpression);
    }
  }
}

//Keyword constants
var CONSTANTS = createMap();
forEach({
  'null': function() { return null; },
  'true': function() { return true; },
  'false': function() { return false; },
  'undefined': function() {}
}, function(constantGetter, name) {
  constantGetter.constant = constantGetter.literal = constantGetter.sharedGetter = true;
  CONSTANTS[name] = constantGetter;
});

//Not quite a constant, but can be lex/parsed the same
CONSTANTS['this'] = function(self) { return self; };
CONSTANTS['this'].sharedGetter = true;


//Operators - will be wrapped by binaryFn/unaryFn/assignment/filter
var OPERATORS = extend(createMap(), {
    '+':function(self, locals, a, b) {
      a=a(self, locals); b=b(self, locals);
      if (isDefined(a)) {
        if (isDefined(b)) {
          return a + b;
        }
        return a;
      }
      return isDefined(b) ? b : undefined;},
    '-':function(self, locals, a, b) {
          a=a(self, locals); b=b(self, locals);
          return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
        },
    '*':function(self, locals, a, b) {return a(self, locals) * b(self, locals);},
    '/':function(self, locals, a, b) {return a(self, locals) / b(self, locals);},
    '%':function(self, locals, a, b) {return a(self, locals) % b(self, locals);},
    '===':function(self, locals, a, b) {return a(self, locals) === b(self, locals);},
    '!==':function(self, locals, a, b) {return a(self, locals) !== b(self, locals);},
    '==':function(self, locals, a, b) {return a(self, locals) == b(self, locals);},
    '!=':function(self, locals, a, b) {return a(self, locals) != b(self, locals);},
    '<':function(self, locals, a, b) {return a(self, locals) < b(self, locals);},
    '>':function(self, locals, a, b) {return a(self, locals) > b(self, locals);},
    '<=':function(self, locals, a, b) {return a(self, locals) <= b(self, locals);},
    '>=':function(self, locals, a, b) {return a(self, locals) >= b(self, locals);},
    '&&':function(self, locals, a, b) {return a(self, locals) && b(self, locals);},
    '||':function(self, locals, a, b) {return a(self, locals) || b(self, locals);},
    '!':function(self, locals, a) {return !a(self, locals);},

    //Tokenized as operators but parsed as assignment/filters
    '=':true,
    '|':true
});
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};


/////////////////////////////////////////


/**
 * @constructor
 */
var Lexer = function(options) {
  this.options = options;
};

Lexer.prototype = {
  constructor: Lexer,

  lex: function(text) {
    this.text = text;
    this.index = 0;
    this.tokens = [];

    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch === '"' || ch === "'") {
        this.readString(ch);
      } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
        this.readNumber();
      } else if (this.isIdent(ch)) {
        this.readIdent();
      } else if (this.is(ch, '(){}[].,;:?')) {
        this.tokens.push({index: this.index, text: ch});
        this.index++;
      } else if (this.isWhitespace(ch)) {
        this.index++;
      } else {
        var ch2 = ch + this.peek();
        var ch3 = ch2 + this.peek(2);
        var op1 = OPERATORS[ch];
        var op2 = OPERATORS[ch2];
        var op3 = OPERATORS[ch3];
        if (op1 || op2 || op3) {
          var token = op3 ? ch3 : (op2 ? ch2 : ch);
          this.tokens.push({index: this.index, text: token, operator: true});
          this.index += token.length;
        } else {
          this.throwError('Unexpected next character ', this.index, this.index + 1);
        }
      }
    }
    return this.tokens;
  },

  is: function(ch, chars) {
    return chars.indexOf(ch) !== -1;
  },

  peek: function(i) {
    var num = i || 1;
    return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
  },

  isNumber: function(ch) {
    return ('0' <= ch && ch <= '9') && typeof ch === "string";
  },

  isWhitespace: function(ch) {
    // IE treats non-breaking space as \u00A0
    return (ch === ' ' || ch === '\r' || ch === '\t' ||
            ch === '\n' || ch === '\v' || ch === '\u00A0');
  },

  isIdent: function(ch) {
    return ('a' <= ch && ch <= 'z' ||
            'A' <= ch && ch <= 'Z' ||
            '_' === ch || ch === '$');
  },

  isExpOperator: function(ch) {
    return (ch === '-' || ch === '+' || this.isNumber(ch));
  },

  throwError: function(error, start, end) {
    end = end || this.index;
    var colStr = (isDefined(start)
            ? 's ' + start +  '-' + this.index + ' [' + this.text.substring(start, end) + ']'
            : ' ' + end);
    throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
        error, colStr, this.text);
  },

  readNumber: function() {
    var number = '';
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = lowercase(this.text.charAt(this.index));
      if (ch == '.' || this.isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = this.peek();
        if (ch == 'e' && this.isExpOperator(peekCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            peekCh && this.isNumber(peekCh) &&
            number.charAt(number.length - 1) == 'e') {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            (!peekCh || !this.isNumber(peekCh)) &&
            number.charAt(number.length - 1) == 'e') {
          this.throwError('Invalid exponent');
        } else {
          break;
        }
      }
      this.index++;
    }
    this.tokens.push({
      index: start,
      text: number,
      constant: true,
      value: Number(number)
    });
  },

  readIdent: function() {
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (!(this.isIdent(ch) || this.isNumber(ch))) {
        break;
      }
      this.index++;
    }
    this.tokens.push({
      index: start,
      text: this.text.slice(start, this.index),
      identifier: true
    });
  },

  readString: function(quote) {
    var start = this.index;
    this.index++;
    var string = '';
    var rawString = quote;
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      rawString += ch;
      if (escape) {
        if (ch === 'u') {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          if (!hex.match(/[\da-f]{4}/i))
            this.throwError('Invalid unicode escape [\\u' + hex + ']');
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          string = string + (rep || ch);
        }
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quote) {
        this.index++;
        this.tokens.push({
          index: start,
          text: rawString,
          constant: true,
          value: string
        });
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    this.throwError('Unterminated quote', start);
  }
};


function isConstant(exp) {
  return exp.constant;
}

/**
 * @constructor
 */
var Parser = function(lexer, $filter, options) {
  this.lexer = lexer;
  this.$filter = $filter;
  this.options = options;
};

Parser.ZERO = extend(function() {
  return 0;
}, {
  sharedGetter: true,
  constant: true
});

Parser.prototype = {
  constructor: Parser,

  parse: function(text) {
    this.text = text;
    this.tokens = this.lexer.lex(text);

    var value = this.statements();

    if (this.tokens.length !== 0) {
      this.throwError('is an unexpected token', this.tokens[0]);
    }

    value.literal = !!value.literal;
    value.constant = !!value.constant;

    return value;
  },

  primary: function() {
    var primary;
    if (this.expect('(')) {
      primary = this.filterChain();
      this.consume(')');
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else if (this.peek().identifier && this.peek().text in CONSTANTS) {
      primary = CONSTANTS[this.consume().text];
    } else if (this.peek().identifier) {
      primary = this.identifier();
    } else if (this.peek().constant) {
      primary = this.constant();
    } else {
      this.throwError('not a primary expression', this.peek());
    }

    var next, context;
    while ((next = this.expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = this.functionCall(primary, context);
        context = null;
      } else if (next.text === '[') {
        context = primary;
        primary = this.objectIndex(primary);
      } else if (next.text === '.') {
        context = primary;
        primary = this.fieldAccess(primary);
      } else {
        this.throwError('IMPOSSIBLE');
      }
    }
    return primary;
  },

  throwError: function(msg, token) {
    throw $parseMinErr('syntax',
        'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
          token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
  },

  peekToken: function() {
    if (this.tokens.length === 0)
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    return this.tokens[0];
  },

  peek: function(e1, e2, e3, e4) {
    return this.peekAhead(0, e1, e2, e3, e4);
  },
  peekAhead: function(i, e1, e2, e3, e4) {
    if (this.tokens.length > i) {
      var token = this.tokens[i];
      var t = token.text;
      if (t === e1 || t === e2 || t === e3 || t === e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },

  expect: function(e1, e2, e3, e4) {
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      return token;
    }
    return false;
  },

  consume: function(e1) {
    if (this.tokens.length === 0) {
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    }

    var token = this.expect(e1);
    if (!token) {
      this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
    }
    return token;
  },

  unaryFn: function(op, right) {
    var fn = OPERATORS[op];
    return extend(function $parseUnaryFn(self, locals) {
      return fn(self, locals, right);
    }, {
      constant:right.constant,
      inputs: [right]
    });
  },

  binaryFn: function(left, op, right, isBranching) {
    var fn = OPERATORS[op];
    return extend(function $parseBinaryFn(self, locals) {
      return fn(self, locals, left, right);
    }, {
      constant: left.constant && right.constant,
      inputs: !isBranching && [left, right]
    });
  },

  identifier: function() {
    var id = this.consume().text;

    //Continue reading each `.identifier` unless it is a method invocation
    while (this.peek('.') && this.peekAhead(1).identifier && !this.peekAhead(2, '(')) {
      id += this.consume().text + this.consume().text;
    }

    return getterFn(id, this.options, this.text);
  },

  constant: function() {
    var value = this.consume().value;

    return extend(function $parseConstant() {
      return value;
    }, {
      constant: true,
      literal: true
    });
  },

  statements: function() {
    var statements = [];
    while (true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        statements.push(this.filterChain());
      if (!this.expect(';')) {
        // optimize for the common case where there is only one statement.
        // TODO(size): maybe we should not support multiple statements?
        return (statements.length === 1)
            ? statements[0]
            : function $parseStatements(self, locals) {
                var value;
                for (var i = 0, ii = statements.length; i < ii; i++) {
                  value = statements[i](self, locals);
                }
                return value;
              };
      }
    }
  },

  filterChain: function() {
    var left = this.expression();
    var token;
    while ((token = this.expect('|'))) {
      left = this.filter(left);
    }
    return left;
  },

  filter: function(inputFn) {
    var fn = this.$filter(this.consume().text);
    var argsFn;
    var args;

    if (this.peek(':')) {
      argsFn = [];
      args = []; // we can safely reuse the array
      while (this.expect(':')) {
        argsFn.push(this.expression());
      }
    }

    var inputs = [inputFn].concat(argsFn || []);

    return extend(function $parseFilter(self, locals) {
      var input = inputFn(self, locals);
      if (args) {
        args[0] = input;

        var i = argsFn.length;
        while (i--) {
          args[i + 1] = argsFn[i](self, locals);
        }

        return fn.apply(undefined, args);
      }

      return fn(input);
    }, {
      constant: !fn.$stateful && inputs.every(isConstant),
      inputs: !fn.$stateful && inputs
    });
  },

  expression: function() {
    return this.assignment();
  },

  assignment: function() {
    var left = this.ternary();
    var right;
    var token;
    if ((token = this.expect('='))) {
      if (!left.assign) {
        this.throwError('implies assignment but [' +
            this.text.substring(0, token.index) + '] can not be assigned to', token);
      }
      right = this.ternary();
      return extend(function $parseAssignment(scope, locals) {
        return left.assign(scope, right(scope, locals), locals);
      }, {
        inputs: [left, right]
      });
    }
    return left;
  },

  ternary: function() {
    var left = this.logicalOR();
    var middle;
    var token;
    if ((token = this.expect('?'))) {
      middle = this.assignment();
      if (this.consume(':')) {
        var right = this.assignment();

        return extend(function $parseTernary(self, locals) {
          return left(self, locals) ? middle(self, locals) : right(self, locals);
        }, {
          constant: left.constant && middle.constant && right.constant
        });
      }
    }

    return left;
  },

  logicalOR: function() {
    var left = this.logicalAND();
    var token;
    while ((token = this.expect('||'))) {
      left = this.binaryFn(left, token.text, this.logicalAND(), true);
    }
    return left;
  },

  logicalAND: function() {
    var left = this.equality();
    var token;
    while ((token = this.expect('&&'))) {
      left = this.binaryFn(left, token.text, this.equality(), true);
    }
    return left;
  },

  equality: function() {
    var left = this.relational();
    var token;
    while ((token = this.expect('==','!=','===','!=='))) {
      left = this.binaryFn(left, token.text, this.relational());
    }
    return left;
  },

  relational: function() {
    var left = this.additive();
    var token;
    while ((token = this.expect('<', '>', '<=', '>='))) {
      left = this.binaryFn(left, token.text, this.additive());
    }
    return left;
  },

  additive: function() {
    var left = this.multiplicative();
    var token;
    while ((token = this.expect('+','-'))) {
      left = this.binaryFn(left, token.text, this.multiplicative());
    }
    return left;
  },

  multiplicative: function() {
    var left = this.unary();
    var token;
    while ((token = this.expect('*','/','%'))) {
      left = this.binaryFn(left, token.text, this.unary());
    }
    return left;
  },

  unary: function() {
    var token;
    if (this.expect('+')) {
      return this.primary();
    } else if ((token = this.expect('-'))) {
      return this.binaryFn(Parser.ZERO, token.text, this.unary());
    } else if ((token = this.expect('!'))) {
      return this.unaryFn(token.text, this.unary());
    } else {
      return this.primary();
    }
  },

  fieldAccess: function(object) {
    var getter = this.identifier();

    return extend(function $parseFieldAccess(scope, locals, self) {
      var o = self || object(scope, locals);
      return (o == null) ? undefined : getter(o);
    }, {
      assign: function(scope, value, locals) {
        var o = object(scope, locals);
        if (!o) object.assign(scope, o = {});
        return getter.assign(o, value);
      }
    });
  },

  objectIndex: function(obj) {
    var expression = this.text;

    var indexFn = this.expression();
    this.consume(']');

    return extend(function $parseObjectIndex(self, locals) {
      var o = obj(self, locals),
          i = indexFn(self, locals),
          v;

      ensureSafeMemberName(i, expression);
      if (!o) return undefined;
      v = ensureSafeObject(o[i], expression);
      return v;
    }, {
      assign: function(self, value, locals) {
        var key = ensureSafeMemberName(indexFn(self, locals), expression);
        // prevent overwriting of Function.constructor which would break ensureSafeObject check
        var o = ensureSafeObject(obj(self, locals), expression);
        if (!o) obj.assign(self, o = {});
        return o[key] = value;
      }
    });
  },

  functionCall: function(fnGetter, contextGetter) {
    var argsFn = [];
    if (this.peekToken().text !== ')') {
      do {
        argsFn.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(')');

    var expressionText = this.text;
    // we can safely reuse the array across invocations
    var args = argsFn.length ? [] : null;

    return function $parseFunctionCall(scope, locals) {
      var context = contextGetter ? contextGetter(scope, locals) : isDefined(contextGetter) ? undefined : scope;
      var fn = fnGetter(scope, locals, context) || noop;

      if (args) {
        var i = argsFn.length;
        while (i--) {
          args[i] = ensureSafeObject(argsFn[i](scope, locals), expressionText);
        }
      }

      ensureSafeObject(context, expressionText);
      ensureSafeFunction(fn, expressionText);

      // IE doesn't have apply for some native functions
      var v = fn.apply
            ? fn.apply(context, args)
            : fn(args[0], args[1], args[2], args[3], args[4]);

      return ensureSafeObject(v, expressionText);
      };
  },

  // This is used with json array declaration
  arrayDeclaration: function() {
    var elementFns = [];
    if (this.peekToken().text !== ']') {
      do {
        if (this.peek(']')) {
          // Support trailing commas per ES5.1.
          break;
        }
        elementFns.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(']');

    return extend(function $parseArrayLiteral(self, locals) {
      var array = [];
      for (var i = 0, ii = elementFns.length; i < ii; i++) {
        array.push(elementFns[i](self, locals));
      }
      return array;
    }, {
      literal: true,
      constant: elementFns.every(isConstant),
      inputs: elementFns
    });
  },

  object: function() {
    var keys = [], valueFns = [];
    if (this.peekToken().text !== '}') {
      do {
        if (this.peek('}')) {
          // Support trailing commas per ES5.1.
          break;
        }
        var token = this.consume();
        if (token.constant) {
          keys.push(token.value);
        } else if (token.identifier) {
          keys.push(token.text);
        } else {
          this.throwError("invalid key", token);
        }
        this.consume(':');
        valueFns.push(this.expression());
      } while (this.expect(','));
    }
    this.consume('}');

    return extend(function $parseObjectLiteral(self, locals) {
      var object = {};
      for (var i = 0, ii = valueFns.length; i < ii; i++) {
        object[keys[i]] = valueFns[i](self, locals);
      }
      return object;
    }, {
      literal: true,
      constant: valueFns.every(isConstant),
      inputs: valueFns
    });
  }
};


//////////////////////////////////////////////////
// Parser helper functions
//////////////////////////////////////////////////

function setter(obj, path, setValue, fullExp) {
  ensureSafeObject(obj, fullExp);

  var element = path.split('.'), key;
  for (var i = 0; element.length > 1; i++) {
    key = ensureSafeMemberName(element.shift(), fullExp);
    var propertyObj = ensureSafeObject(obj[key], fullExp);
    if (!propertyObj) {
      propertyObj = {};
      obj[key] = propertyObj;
    }
    obj = propertyObj;
  }
  key = ensureSafeMemberName(element.shift(), fullExp);
  ensureSafeObject(obj[key], fullExp);
  obj[key] = setValue;
  return setValue;
}

var getterFnCacheDefault = createMap();
var getterFnCacheExpensive = createMap();

function isPossiblyDangerousMemberName(name) {
  return name == 'constructor';
}

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, expensiveChecks) {
  ensureSafeMemberName(key0, fullExp);
  ensureSafeMemberName(key1, fullExp);
  ensureSafeMemberName(key2, fullExp);
  ensureSafeMemberName(key3, fullExp);
  ensureSafeMemberName(key4, fullExp);
  var eso = function(o) {
    return ensureSafeObject(o, fullExp);
  };
  var eso0 = (expensiveChecks || isPossiblyDangerousMemberName(key0)) ? eso : identity;
  var eso1 = (expensiveChecks || isPossiblyDangerousMemberName(key1)) ? eso : identity;
  var eso2 = (expensiveChecks || isPossiblyDangerousMemberName(key2)) ? eso : identity;
  var eso3 = (expensiveChecks || isPossiblyDangerousMemberName(key3)) ? eso : identity;
  var eso4 = (expensiveChecks || isPossiblyDangerousMemberName(key4)) ? eso : identity;

  return function cspSafeGetter(scope, locals) {
    var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;

    if (pathVal == null) return pathVal;
    pathVal = eso0(pathVal[key0]);

    if (!key1) return pathVal;
    if (pathVal == null) return undefined;
    pathVal = eso1(pathVal[key1]);

    if (!key2) return pathVal;
    if (pathVal == null) return undefined;
    pathVal = eso2(pathVal[key2]);

    if (!key3) return pathVal;
    if (pathVal == null) return undefined;
    pathVal = eso3(pathVal[key3]);

    if (!key4) return pathVal;
    if (pathVal == null) return undefined;
    pathVal = eso4(pathVal[key4]);

    return pathVal;
  };
}

function getterFnWithEnsureSafeObject(fn, fullExpression) {
  return function(s, l) {
    return fn(s, l, ensureSafeObject, fullExpression);
  };
}

function getterFn(path, options, fullExp) {
  var expensiveChecks = options.expensiveChecks;
  var getterFnCache = (expensiveChecks ? getterFnCacheExpensive : getterFnCacheDefault);
  var fn = getterFnCache[path];
  if (fn) return fn;


  var pathKeys = path.split('.'),
      pathKeysLength = pathKeys.length;

  // http://jsperf.com/angularjs-parse-getter/6
  if (options.csp) {
    if (pathKeysLength < 6) {
      fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, expensiveChecks);
    } else {
      fn = function cspSafeGetter(scope, locals) {
        var i = 0, val;
        do {
          val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++],
                                pathKeys[i++], fullExp, expensiveChecks)(scope, locals);

          locals = undefined; // clear after first iteration
          scope = val;
        } while (i < pathKeysLength);
        return val;
      };
    }
  } else {
    var code = '';
    if (expensiveChecks) {
      code += 's = eso(s, fe);\nl = eso(l, fe);\n';
    }
    var needsEnsureSafeObject = expensiveChecks;
    forEach(pathKeys, function(key, index) {
      ensureSafeMemberName(key, fullExp);
      var lookupJs = (index
                      // we simply dereference 's' on any .dot notation
                      ? 's'
                      // but if we are first then we check locals first, and if so read it first
                      : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + '.' + key;
      if (expensiveChecks || isPossiblyDangerousMemberName(key)) {
        lookupJs = 'eso(' + lookupJs + ', fe)';
        needsEnsureSafeObject = true;
      }
      code += 'if(s == null) return undefined;\n' +
              's=' + lookupJs + ';\n';
    });
    code += 'return s;';

    /* jshint -W054 */
    var evaledFnGetter = new Function('s', 'l', 'eso', 'fe', code); // s=scope, l=locals, eso=ensureSafeObject
    /* jshint +W054 */
    evaledFnGetter.toString = valueFn(code);
    if (needsEnsureSafeObject) {
      evaledFnGetter = getterFnWithEnsureSafeObject(evaledFnGetter, fullExp);
    }
    fn = evaledFnGetter;
  }

  fn.sharedGetter = true;
  fn.assign = function(self, value) {
    return setter(self, path, value, path);
  };
  getterFnCache[path] = fn;
  return fn;
}

var objectValueOf = Object.prototype.valueOf;

function getValueOf(value) {
  return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
}

///////////////////////////////////

/**
 * @ngdoc service
 * @name $parse
 * @kind function
 *
 * @description
 *
 * Converts Angular {@link guide/expression expression} into a function.
 *
 * ```js
 *   var getter = $parse('user.name');
 *   var setter = getter.assign;
 *   var context = {user:{name:'angular'}};
 *   var locals = {user:{name:'local'}};
 *
 *   expect(getter(context)).toEqual('angular');
 *   setter(context, 'newValue');
 *   expect(context.user.name).toEqual('newValue');
 *   expect(getter(context, locals)).toEqual('local');
 * ```
 *
 *
 * @param {string} expression String expression to compile.
 * @returns {function(context, locals)} a function which represents the compiled expression:
 *
 *    * `context` – `{object}` – an object against which any expressions embedded in the strings
 *      are evaluated against (typically a scope object).
 *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
 *      `context`.
 *
 *    The returned function also has the following properties:
 *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
 *        literal.
 *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
 *        constant literals.
 *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
 *        set to a function to change its value on the given context.
 *
 */


/**
 * @ngdoc provider
 * @name $parseProvider
 *
 * @description
 * `$parseProvider` can be used for configuring the default behavior of the {@link ng.$parse $parse}
 *  service.
 */
function $ParseProvider() {
  var cacheDefault = createMap();
  var cacheExpensive = createMap();



  this.$get = ['$filter', '$sniffer', function($filter, $sniffer) {
    var $parseOptions = {
          csp: $sniffer.csp,
          expensiveChecks: false
        },
        $parseOptionsExpensive = {
          csp: $sniffer.csp,
          expensiveChecks: true
        };

    function wrapSharedExpression(exp) {
      var wrapped = exp;

      if (exp.sharedGetter) {
        wrapped = function $parseWrapper(self, locals) {
          return exp(self, locals);
        };
        wrapped.literal = exp.literal;
        wrapped.constant = exp.constant;
        wrapped.assign = exp.assign;
      }

      return wrapped;
    }

    return function $parse(exp, interceptorFn, expensiveChecks) {
      var parsedExpression, oneTime, cacheKey;

      switch (typeof exp) {
        case 'string':
          cacheKey = exp = exp.trim();

          var cache = (expensiveChecks ? cacheExpensive : cacheDefault);
          parsedExpression = cache[cacheKey];

          if (!parsedExpression) {
            if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
              oneTime = true;
              exp = exp.substring(2);
            }

            var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions;
            var lexer = new Lexer(parseOptions);
            var parser = new Parser(lexer, $filter, parseOptions);
            parsedExpression = parser.parse(exp);

            if (parsedExpression.constant) {
              parsedExpression.$$watchDelegate = constantWatchDelegate;
            } else if (oneTime) {
              //oneTime is not part of the exp passed to the Parser so we may have to
              //wrap the parsedExpression before adding a $$watchDelegate
              parsedExpression = wrapSharedExpression(parsedExpression);
              parsedExpression.$$watchDelegate = parsedExpression.literal ?
                oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
            } else if (parsedExpression.inputs) {
              parsedExpression.$$watchDelegate = inputsWatchDelegate;
            }

            cache[cacheKey] = parsedExpression;
          }
          return addInterceptor(parsedExpression, interceptorFn);

        case 'function':
          return addInterceptor(exp, interceptorFn);

        default:
          return addInterceptor(noop, interceptorFn);
      }
    };

    function collectExpressionInputs(inputs, list) {
      for (var i = 0, ii = inputs.length; i < ii; i++) {
        var input = inputs[i];
        if (!input.constant) {
          if (input.inputs) {
            collectExpressionInputs(input.inputs, list);
          } else if (list.indexOf(input) === -1) { // TODO(perf) can we do better?
            list.push(input);
          }
        }
      }

      return list;
    }

    function expressionInputDirtyCheck(newValue, oldValueOfValue) {

      if (newValue == null || oldValueOfValue == null) { // null/undefined
        return newValue === oldValueOfValue;
      }

      if (typeof newValue === 'object') {

        // attempt to convert the value to a primitive type
        // TODO(docs): add a note to docs that by implementing valueOf even objects and arrays can
        //             be cheaply dirty-checked
        newValue = getValueOf(newValue);

        if (typeof newValue === 'object') {
          // objects/arrays are not supported - deep-watching them would be too expensive
          return false;
        }

        // fall-through to the primitive equality check
      }

      //Primitive or NaN
      return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
    }

    function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var inputExpressions = parsedExpression.$$inputs ||
                    (parsedExpression.$$inputs = collectExpressionInputs(parsedExpression.inputs, []));

      var lastResult;

      if (inputExpressions.length === 1) {
        var oldInputValue = expressionInputDirtyCheck; // init to something unique so that equals check fails
        inputExpressions = inputExpressions[0];
        return scope.$watch(function expressionInputWatch(scope) {
          var newInputValue = inputExpressions(scope);
          if (!expressionInputDirtyCheck(newInputValue, oldInputValue)) {
            lastResult = parsedExpression(scope);
            oldInputValue = newInputValue && getValueOf(newInputValue);
          }
          return lastResult;
        }, listener, objectEquality);
      }

      var oldInputValueOfValues = [];
      for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
        oldInputValueOfValues[i] = expressionInputDirtyCheck; // init to something unique so that equals check fails
      }

      return scope.$watch(function expressionInputsWatch(scope) {
        var changed = false;

        for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
          var newInputValue = inputExpressions[i](scope);
          if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
            oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
          }
        }

        if (changed) {
          lastResult = parsedExpression(scope);
        }

        return lastResult;
      }, listener, objectEquality);
    }

    function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var unwatch, lastValue;
      return unwatch = scope.$watch(function oneTimeWatch(scope) {
        return parsedExpression(scope);
      }, function oneTimeListener(value, old, scope) {
        lastValue = value;
        if (isFunction(listener)) {
          listener.apply(this, arguments);
        }
        if (isDefined(value)) {
          scope.$$postDigest(function() {
            if (isDefined(lastValue)) {
              unwatch();
            }
          });
        }
      }, objectEquality);
    }

    function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var unwatch, lastValue;
      return unwatch = scope.$watch(function oneTimeWatch(scope) {
        return parsedExpression(scope);
      }, function oneTimeListener(value, old, scope) {
        lastValue = value;
        if (isFunction(listener)) {
          listener.call(this, value, old, scope);
        }
        if (isAllDefined(value)) {
          scope.$$postDigest(function() {
            if (isAllDefined(lastValue)) unwatch();
          });
        }
      }, objectEquality);

      function isAllDefined(value) {
        var allDefined = true;
        forEach(value, function(val) {
          if (!isDefined(val)) allDefined = false;
        });
        return allDefined;
      }
    }

    function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var unwatch;
      return unwatch = scope.$watch(function constantWatch(scope) {
        return parsedExpression(scope);
      }, function constantListener(value, old, scope) {
        if (isFunction(listener)) {
          listener.apply(this, arguments);
        }
        unwatch();
      }, objectEquality);
    }

    function addInterceptor(parsedExpression, interceptorFn) {
      if (!interceptorFn) return parsedExpression;
      var watchDelegate = parsedExpression.$$watchDelegate;

      var regularWatch =
          watchDelegate !== oneTimeLiteralWatchDelegate &&
          watchDelegate !== oneTimeWatchDelegate;

      var fn = regularWatch ? function regularInterceptedExpression(scope, locals) {
        var value = parsedExpression(scope, locals);
        return interceptorFn(value, scope, locals);
      } : function oneTimeInterceptedExpression(scope, locals) {
        var value = parsedExpression(scope, locals);
        var result = interceptorFn(value, scope, locals);
        // we only return the interceptor's result if the
        // initial value is defined (for bind-once)
        return isDefined(value) ? result : value;
      };

      // Propagate $$watchDelegates other then inputsWatchDelegate
      if (parsedExpression.$$watchDelegate &&
          parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
        fn.$$watchDelegate = parsedExpression.$$watchDelegate;
      } else if (!interceptorFn.$stateful) {
        // If there is an interceptor, but no watchDelegate then treat the interceptor like
        // we treat filters - it is assumed to be a pure function unless flagged with $stateful
        fn.$$watchDelegate = inputsWatchDelegate;
        fn.inputs = [parsedExpression];
      }

      return fn;
    }
  }];
}
