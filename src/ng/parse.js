'use strict';

var $parseMinErr = minErr('$parse');

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are generally considered safe because these expressions only have direct access to $scope and
// locals. However, one can obtain the ability to execute arbitrary JS code by obtaining a reference to native JS
// functions such as the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor(alert("evil JS code"))
//
// We want to prevent this type of access. For the sake of performance, during the lexing phase we disallow any "dotted"
// access to any member named "constructor".
//
// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor while evaluating
// the expression, which is a stronger but more expensive test. Since reflective calls are expensive anyway, this is not
// such a big deal compared to static dereferencing.
//
// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits against the
// expression language, but not to prevent exploits that were enabled by exposing sensitive JavaScript or browser apis
// on Scope. Exposing such objects on a Scope is never a good practice and therefore we are not even trying to protect
// against interaction with an object explicitly exposed in this way.
//
// A developer could foil the name check by aliasing the Function constructor under a different name on the scope.
//
// In general, it is not possible to access a Window object from an angular expression unless a window or some DOM
// object that has a reference to window is published onto a Scope.

function ensureSafeMemberName(name, fullExpression) {
  if (name === "constructor") {
    throw $parseMinErr('isecfld',
        'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
  }
  return name;
};

function ensureSafeObject(obj, fullExpression) {
  // nifty check if obj is Function that is fast and works across iframes and other contexts
  if (obj && obj.constructor === obj) {
    throw $parseMinErr('isecfn',
        'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
  // 
  } else if (// isWindow(obj)
      obj && obj.document && obj.location && obj.alert && obj.setInterval) {
    throw $parseMinErr('isecwindow',
        'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
  } else if (// isElement(obj)
      obj && (obj.nodeName || (obj.on && obj.find))) {
    throw $parseMinErr('isecdom',
        'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
  } else {
    return obj;
  }
}

var OPERATORS = {
    'null':function(){return null;},
    'true':function(){return true;},
    'false':function(){return false;},
    undefined:noop,
    '+':function(self, locals, a,b){
      a=a(self, locals); b=b(self, locals);
      if (isDefined(a)) {
        if (isDefined(b)) {
          return a + b;
        }
        return a;
      }
      return isDefined(b)?b:undefined;},
    '-':function(self, locals, a,b){a=a(self, locals); b=b(self, locals); return (isDefined(a)?a:0)-(isDefined(b)?b:0);},
    '*':function(self, locals, a,b){return a(self, locals)*b(self, locals);},
    '/':function(self, locals, a,b){return a(self, locals)/b(self, locals);},
    '%':function(self, locals, a,b){return a(self, locals)%b(self, locals);},
    '^':function(self, locals, a,b){return a(self, locals)^b(self, locals);},
    '=':noop,
    '===':function(self, locals, a, b){return a(self, locals)===b(self, locals);},
    '!==':function(self, locals, a, b){return a(self, locals)!==b(self, locals);},
    '==':function(self, locals, a,b){return a(self, locals)==b(self, locals);},
    '!=':function(self, locals, a,b){return a(self, locals)!=b(self, locals);},
    '<':function(self, locals, a,b){return a(self, locals)<b(self, locals);},
    '>':function(self, locals, a,b){return a(self, locals)>b(self, locals);},
    '<=':function(self, locals, a,b){return a(self, locals)<=b(self, locals);},
    '>=':function(self, locals, a,b){return a(self, locals)>=b(self, locals);},
    '&&':function(self, locals, a,b){return a(self, locals)&&b(self, locals);},
    '||':function(self, locals, a,b){return a(self, locals)||b(self, locals);},
    '&':function(self, locals, a,b){return a(self, locals)&b(self, locals);},
//    '|':function(self, locals, a,b){return a|b;},
    '|':function(self, locals, a,b){return b(self, locals)(self, locals, a(self, locals));},
    '!':function(self, locals, a){return !a(self, locals);}
};
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

var UNICODE = (function () {
  var letterRanges = {
    1: [
      170, 11, 5, 562, 2, 152, 6, 461, 380, 42, 17, 161, 73, 32, 10, 4, 277, 19, 98, 11, 17, 144,
      95, 19, 109, 52, 18, 25, 52, 109, 128, 33, 95, 128, 199, 6, 3, 24, 2, 22, 9, 58, 319, 34, 45,
      110, 348, 104, 1303, 5, 206, 509, 1202, 2, 2, 97, 179, 14, 131, 5, 14, 15, 2, 2, 38, 3105,
      192, 31436, 212, 171, 55, 15, 2, 20571, 33
    ],
    2: [
      886, 760, 119, 9, 262, 381, 30, 77, 20, 31, 35, 3, 3, 122, 46, 47, 35, 42, 61, 5, 5, 181, 8,
      128, 128, 210, 79, 6, 35, 8, 42, 393, 2889, 35452, 353, 810, 20619, 3
    ],
    3: [
      904, 616, 266, 741, 147, 29, 208, 47, 26, 102, 128, 128, 403, 461, 1664, 128, 1247, 885, 48,
      4115, 152, 30566, 573, 155, 21759
    ],
    4: [
      890, 1596, 163, 313, 770, 25, 219, 210, 496, 16, 48, 40, 16, 80, 1020, 1499, 5, 738, 346, 18,
      2991, 1041, 30475
    ],
    5: [736, 144, 1861, 128, 256, 128, 523, 2736, 1824, 137, 44, 3820, 7, 31361, 20570, 37, 824],
    6: [2565, 384, 501, 726, 3784, 48, 142, 35100, 22224, 8, 8],
    7: [
      2425, 49, 128, 128, 128, 662, 128, 89, 951, 104, 1801, 388, 1137, 16, 48, 3498, 8, 8, 8, 8, 8,
      8, 8, 31267, 21253
    ],
    8: [2437, 384, 256, 128, 128, 571, 4112, 35572], 9: [2693, 814, 8814, 30454],
    10: [2392, 722, 128, 5216, 55829], 11: 8495, 12: [710, 2280, 62018],
    13: [4213, 1675, 96, 2176, 34434, 21704], 15: 4808, 16: [3370, 1622, 7792, 29728], 17: 5743,
    18: [3461, 2459, 32], 20: 910, 22: [2048, 403, 128, 128, 128],
    23: [192, 2898, 128, 128, 3310, 4992, 31372, 292, 304, 11600], 24: [3482, 9222], 25: 42623,
    26: [65, 32, 5664, 59552, 32], 27: 1488, 28: 43274, 29: [6400, 36960], 30: [1810, 4670, 563],
    31: [216, 7815], 32: 42560, 33: [1994, 2758], 35: 43968, 36: [3913, 3255, 90],
    38: [1329, 2927, 3712, 3552], 39: 1377, 41: [4704, 1568, 2272, 4005, 30971], 42: 1569,
    43: [4096, 208], 44: 6528, 46: 42192, 47: [6917, 4347, 48, 32084], 48: [3585, 40063], 49: 55243,
    50: 43138, 52: [6016, 37056], 53: [6688, 1376], 54: [2308, 9260, 53346], 57: 4824, 62: 64048,
    64: 64848, 67: 4888, 70: 6320, 75: 5792, 80: 42656, 83: 931, 85: 5024, 86: 12353, 88: 6176,
    89: [1869, 63513], 90: 12449, 94: 12593, 99: 1649, 103: 42786, 106: 64112, 108: 64326,
    133: 11360, 135: 65142, 139: 1015, 156: 1162, 192: 7424, 269: 42240, 278: 7680, 302: 63744,
    329: 4352, 363: 64467, 458: 248, 620: 5121, 1165: 40960, 6582: 13312, 11172: 44032,
    20940: 19968
  };
  var combiningMarkRanges = {
    1: [
      1471, 8, 169, 161, 555, 128, 27, 101, 21, 36, 71, 128, 70, 85, 229, 155, 115, 12, 91, 128,
      132, 2, 2, 141, 201, 720, 1150, 204, 470, 622, 5, 1007, 34190, 403, 4, 5, 568, 56, 53, 17,
      20573
    ],
    2: [
      1473, 3, 291, 635, 101, 27, 101, 41, 114, 101, 15, 12, 243, 13, 32, 83, 13, 32, 96, 32, 112,
      201, 93, 38, 72, 1996, 32, 598, 5841, 30179, 116, 400, 460, 107, 7, 302
    ],
    3: [
      2085, 348, 74, 54, 74, 54, 70, 4, 54, 74, 123, 59, 69, 128, 128, 792, 4, 1712, 32, 217, 885,
      336, 301, 3826, 32195
    ],
    4: [1770, 300, 234, 714, 128, 128, 128, 780, 27, 41, 39142],
    5: [1155, 934, 296, 237, 384, 3673, 233, 36131], 6: [1759, 1776, 229, 20, 8546],
    7: [1750, 744, 384, 256, 128, 128, 246, 563, 60857], 8: [2750, 794, 111, 329, 39318, 701],
    9: [2027, 48, 4944], 10: [6741, 332], 11: [1552, 406], 12: [4226, 2206, 16, 1973],
    13: [8400, 34935], 14: [43443, 118], 16: 65024, 17: [2366, 4210, 388, 36224], 18: 43232,
    20: [1611, 2342, 186, 3065], 21: 7380, 27: 1840, 29: 6752, 30: 6070, 32: 11744, 36: 3993,
    39: 7616, 45: 1425, 112: 768
  };
  var digitRanges = {
    10: [
      48, 1584, 144, 208, 422, 128, 128, 128, 128, 128, 128, 128, 128, 234, 128, 80, 288, 80, 1872,
      48, 310, 314, 16, 192, 96, 144, 16, 35280, 688, 48, 208, 128, 416, 21280
    ],
    11: 6608
  };
  var connectorPunctuationRanges = {1: [95, 8181, 57067], 2: [8255, 56820], 3: 65101};
  function rangesToObject(ranges) {
    var obj = {};
    for (var length in ranges) {
      if (!ranges.hasOwnProperty(length)) continue;
      var codes = ranges[length];
      if (typeof codes == 'number') codes = [codes];
      var start = 0,
          end;
      for (var i = 0; i < codes.length; i++) {
        start += codes[i];
        end = start + Number(length);
        for (var code = start; code < end; code++) {
          obj[String.fromCharCode(code)] = true;
        }
      }
    }
    return obj;
  }
  var letterMap = rangesToObject(letterRanges);
  var combiningMarkMap = rangesToObject(combiningMarkRanges);
  var digitMap = rangesToObject(digitRanges);
  var connectorPunctuationMap = rangesToObject(connectorPunctuationRanges);
  return {
    isLetter: function (ch) {
      return letterMap.hasOwnProperty(ch);
    },
    isCombiningMark: function (ch) {
      return combiningMarkMap.hasOwnProperty(ch);
    },
    isDigit: function (ch) {
      return digitMap.hasOwnProperty(ch);
    },
    isConnectorPunctuation: function (ch) {
      return connectorPunctuationMap.hasOwnProperty(ch);
    }
  };
})();

function lex(text, csp){
  var tokens = [],
      token,
      index = 0,
      json = [],
      ch,
      lastCh = ':'; // can start regexp

  while (index < text.length) {
    ch = text.charAt(index);
    if (is('"\'')) {
      readString(ch);
    } else if (isNumber(ch) || is('.') && isNumber(peek())) {
      readNumber();
    } else if (isIdent(ch)) {
      readIdent();
      // identifiers can only be if the preceding char was a { or ,
      if (was('{,') && json[0]=='{' &&
         (token=tokens[tokens.length-1])) {
        token.json = token.text.indexOf('.') == -1;
      }
    } else if (is('(){}[].,;:?')) {
      tokens.push({
        index:index,
        text:ch,
        json:(was(':[,') && is('{[')) || is('}]:,')
      });
      if (is('{[')) json.unshift(ch);
      if (is('}]')) json.shift();
      index++;
    } else if (isWhitespace(ch)) {
      index++;
      continue;
    } else {
      var ch2 = ch + peek(),
          ch3 = ch2 + peek(2),
          fn = OPERATORS[ch],
          fn2 = OPERATORS[ch2],
          fn3 = OPERATORS[ch3];
      if (fn3) {
        tokens.push({index:index, text:ch3, fn:fn3});
        index += 3;
      } else if (fn2) {
        tokens.push({index:index, text:ch2, fn:fn2});
        index += 2;
      } else if (fn) {
        tokens.push({index:index, text:ch, fn:fn, json: was('[,:') && is('+-')});
        index += 1;
      } else {
        throwError("Unexpected next character ", index, index+1);
      }
    }
    lastCh = ch;
  }
  return tokens;

  function is(chars) {
    return chars.indexOf(ch) != -1;
  }

  function was(chars) {
    return chars.indexOf(lastCh) != -1;
  }

  function peek(i) {
    var num = i || 1;
    return index + num < text.length ? text.charAt(index + num) : false;
  }
  function isNumber(ch) {
    return '0' <= ch && ch <= '9';
  }
  function isWhitespace(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v' || ch == '\u00A0'; // IE treats non-breaking space as \u00A0
  }
  function isIdent(ch) {
    return UNICODE.isLetter(ch) || ch == '$' || ch == '_';
  }
  function isIdentPart(ch) {
    return isIdent(ch) || UNICODE.isCombiningMark(ch) || UNICODE.isDigit(ch) ||
           UNICODE.isConnectorPunctuation(ch) || ch == '\u200C' ||
           ch == '\u200D';
  }
  function isExpOperator(ch) {
    return ch == '-' || ch == '+' || isNumber(ch);
  }

  function throwError(error, start, end) {
    end = end || index;
    var colStr = (isDefined(start) ?
        "s " + start +  "-" + index + " [" + text.substring(start, end) + "]"
        : " " + end);
    throw $parseMinErr('lexerr', "Lexer Error: {0} at column{1} in expression [{2}].",
        error, colStr, text);
  }

  function readNumber() {
    var number = "";
    var start = index;
    while (index < text.length) {
      var ch = lowercase(text.charAt(index));
      if (ch == '.' || isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = peek();
        if (ch == 'e' && isExpOperator(peekCh)) {
          number += ch;
        } else if (isExpOperator(ch) &&
            peekCh && isNumber(peekCh) &&
            number.charAt(number.length - 1) == 'e') {
          number += ch;
        } else if (isExpOperator(ch) &&
            (!peekCh || !isNumber(peekCh)) &&
            number.charAt(number.length - 1) == 'e') {
          throwError('Invalid exponent');
        } else {
          break;
        }
      }
      index++;
    }
    number = 1 * number;
    tokens.push({index:start, text:number, json:true,
      fn:function() {return number;}});
  }
  function readIdent() {
    var ident = "",
        start = index,
        lastDot, peekIndex, methodName, ch;

    while (index < text.length) {
      ch = text.charAt(index);
      if (ch == '.' || isIdentPart(ch) || isNumber(ch)) {
        if (ch == '.') lastDot = index;
        ident += ch;
      } else {
        break;
      }
      index++;
    }

    //check if this is not a method invocation and if it is back out to last dot
    if (lastDot) {
      peekIndex = index;
      while(peekIndex < text.length) {
        ch = text.charAt(peekIndex);
        if (ch == '(') {
          methodName = ident.substr(lastDot - start + 1);
          ident = ident.substr(0, lastDot - start);
          index = peekIndex;
          break;
        }
        if(isWhitespace(ch)) {
          peekIndex++;
        } else {
          break;
        }
      }
    }


    var token = {
      index:start,
      text:ident
    };

    if (OPERATORS.hasOwnProperty(ident)) {
      token.fn = token.json = OPERATORS[ident];
    } else {
      var getter = getterFn(ident, csp, text);
      token.fn = extend(function(self, locals) {
        return (getter(self, locals));
      }, {
        assign: function(self, value) {
          return setter(self, ident, value, text);
        }
      });
    }

    tokens.push(token);

    if (methodName) {
      tokens.push({
        index:lastDot,
        text: '.',
        json: false
      });
      tokens.push({
        index: lastDot + 1,
        text: methodName,
        json: false
      });
    }
  }

  function readString(quote) {
    var start = index;
    index++;
    var string = "";
    var rawString = quote;
    var escape = false;
    while (index < text.length) {
      var ch = text.charAt(index);
      rawString += ch;
      if (escape) {
        if (ch == 'u') {
          var hex = text.substring(index + 1, index + 5);
          if (!hex.match(/[\da-f]{4}/i))
            throwError( "Invalid unicode escape [\\u" + hex + "]");
          index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch == '\\') {
        escape = true;
      } else if (ch == quote) {
        index++;
        tokens.push({
          index:start,
          text:rawString,
          string:string,
          json:true,
          fn:function() { return string; }
        });
        return;
      } else {
        string += ch;
      }
      index++;
    }
    throwError("Unterminated quote", start);
  }
}

/////////////////////////////////////////

function parser(text, json, $filter, csp){
  var ZERO = valueFn(0),
      value,
      tokens = lex(text, csp),
      assignment = _assignment,
      functionCall = _functionCall,
      fieldAccess = _fieldAccess,
      objectIndex = _objectIndex,
      filterChain = _filterChain;

  if(json){
    // The extra level of aliasing is here, just in case the lexer misses something, so that
    // we prevent any accidental execution in JSON.
    assignment = logicalOR;
    functionCall =
      fieldAccess =
      objectIndex =
      filterChain =
        function() { throwError("is not valid json", {text:text, index:0}); };
    value = primary();
  } else {
    value = statements();
  }
  if (tokens.length !== 0) {
    throwError("is an unexpected token", tokens[0]);
  }
  value.literal = !!value.literal;
  value.constant = !!value.constant;
  return value;

  ///////////////////////////////////
  function throwError(msg, token) {
    throw $parseMinErr('syntax',
        "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",
        token.text, msg, (token.index + 1), text, text.substring(token.index));
  }

  function peekToken() {
    if (tokens.length === 0)
      throw $parseMinErr('ueoe', "Unexpected end of expression: {0}", text);
    return tokens[0];
  }

  function peek(e1, e2, e3, e4) {
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  }

  function expect(e1, e2, e3, e4){
    var token = peek(e1, e2, e3, e4);
    if (token) {
      if (json && !token.json) {
        throwError("is not valid json", token);
      }
      tokens.shift();
      return token;
    }
    return false;
  }

  function consume(e1){
    if (!expect(e1)) {
      throwError("is unexpected, expecting [" + e1 + "]", peek());
    }
  }

  function unaryFn(fn, right) {
    return extend(function(self, locals) {
      return fn(self, locals, right);
    }, {
      constant:right.constant
    });
  }

  function ternaryFn(left, middle, right){
    return extend(function(self, locals){
      return left(self, locals) ? middle(self, locals) : right(self, locals);
    }, {
      constant: left.constant && middle.constant && right.constant
    });
  }

  function binaryFn(left, fn, right) {
    return extend(function(self, locals) {
      return fn(self, locals, left, right);
    }, {
      constant:left.constant && right.constant
    });
  }

  function statements() {
    var statements = [];
    while(true) {
      if (tokens.length > 0 && !peek('}', ')', ';', ']'))
        statements.push(filterChain());
      if (!expect(';')) {
        // optimize for the common case where there is only one statement.
        // TODO(size): maybe we should not support multiple statements?
        return statements.length == 1
          ? statements[0]
          : function(self, locals){
            var value;
            for ( var i = 0; i < statements.length; i++) {
              var statement = statements[i];
              if (statement)
                value = statement(self, locals);
            }
            return value;
          };
      }
    }
  }

  function _filterChain() {
    var left = expression();
    var token;
    while(true) {
      if ((token = expect('|'))) {
        left = binaryFn(left, token.fn, filter());
      } else {
        return left;
      }
    }
  }

  function filter() {
    var token = expect();
    var fn = $filter(token.text);
    var argsFn = [];
    while(true) {
      if ((token = expect(':'))) {
        argsFn.push(expression());
      } else {
        var fnInvoke = function(self, locals, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self, locals));
          }
          return fn.apply(self, args);
        };
        return function() {
          return fnInvoke;
        };
      }
    }
  }

  function expression() {
    return assignment();
  }

  function _assignment() {
    var left = ternary();
    var right;
    var token;
    if ((token = expect('='))) {
      if (!left.assign) {
        throwError("implies assignment but [" +
          text.substring(0, token.index) + "] can not be assigned to", token);
      }
      right = ternary();
      return function(scope, locals){
        return left.assign(scope, right(scope, locals), locals);
      };
    } else {
      return left;
    }
  }

  function ternary() {
    var left = logicalOR();
    var middle;
    var token;
    if((token = expect('?'))){
      middle = ternary();
      if((token = expect(':'))){
        return ternaryFn(left, middle, ternary());
      }
      else {
        throwError('expected :', token);
      }
    }
    else {
      return left;
    }
  }

  function logicalOR() {
    var left = logicalAND();
    var token;
    while(true) {
      if ((token = expect('||'))) {
        left = binaryFn(left, token.fn, logicalAND());
      } else {
        return left;
      }
    }
  }

  function logicalAND() {
    var left = equality();
    var token;
    if ((token = expect('&&'))) {
      left = binaryFn(left, token.fn, logicalAND());
    }
    return left;
  }

  function equality() {
    var left = relational();
    var token;
    if ((token = expect('==','!=','===','!=='))) {
      left = binaryFn(left, token.fn, equality());
    }
    return left;
  }

  function relational() {
    var left = additive();
    var token;
    if ((token = expect('<', '>', '<=', '>='))) {
      left = binaryFn(left, token.fn, relational());
    }
    return left;
  }

  function additive() {
    var left = multiplicative();
    var token;
    while ((token = expect('+','-'))) {
      left = binaryFn(left, token.fn, multiplicative());
    }
    return left;
  }

  function multiplicative() {
    var left = unary();
    var token;
    while ((token = expect('*','/','%'))) {
      left = binaryFn(left, token.fn, unary());
    }
    return left;
  }

  function unary() {
    var token;
    if (expect('+')) {
      return primary();
    } else if ((token = expect('-'))) {
      return binaryFn(ZERO, token.fn, unary());
    } else if ((token = expect('!'))) {
      return unaryFn(token.fn, unary());
    } else {
      return primary();
    }
  }


  function primary() {
    var primary;
    if (expect('(')) {
      primary = filterChain();
      consume(')');
    } else if (expect('[')) {
      primary = arrayDeclaration();
    } else if (expect('{')) {
      primary = object();
    } else {
      var token = expect();
      primary = token.fn;
      if (!primary) {
        throwError("not a primary expression", token);
      }
      if (token.json) {
        primary.constant = primary.literal = true;
      }
    }

    var next, context;
    while ((next = expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = functionCall(primary, context);
        context = null;
      } else if (next.text === '[') {
        context = primary;
        primary = objectIndex(primary);
      } else if (next.text === '.') {
        context = primary;
        primary = fieldAccess(primary);
      } else {
        throwError("IMPOSSIBLE");
      }
    }
    return primary;
  }

  function _fieldAccess(object) {
    var field = expect().text;
    var getter = getterFn(field, csp, text);
    return extend(
        function(scope, locals, self) {
          return getter(self || object(scope, locals), locals);
        },
        {
          assign:function(scope, value, locals) {
            return setter(object(scope, locals), field, value, text);
          }
        }
    );
  }

  function _objectIndex(obj) {
    var indexFn = expression();
    consume(']');
    return extend(
      function(self, locals){
        var o = obj(self, locals),
            i = indexFn(self, locals),
            v, p;

        if (!o) return undefined;
        v = ensureSafeObject(o[i], text);
        if (v && v.then) {
          p = v;
          if (!('$$v' in v)) {
            p.$$v = undefined;
            p.then(function(val) { p.$$v = val; });
          }
          v = v.$$v;
        }
        return v;
      }, {
        assign:function(self, value, locals){
          var key = indexFn(self, locals);
          // prevent overwriting of Function.constructor which would break ensureSafeObject check
          return ensureSafeObject(obj(self, locals), text)[key] = value;
        }
      });
  }

  function _functionCall(fn, contextGetter) {
    var argsFn = [];
    if (peekToken().text != ')') {
      do {
        argsFn.push(expression());
      } while (expect(','));
    }
    consume(')');
    return function(scope, locals){
      var args = [],
          context = contextGetter ? contextGetter(scope, locals) : scope;

      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](scope, locals));
      }
      var fnPtr = fn(scope, locals, context) || noop;

      ensureSafeObject(fnPtr, text);

      // IE stupidity!
      var v = fnPtr.apply
          ? fnPtr.apply(context, args)
          : fnPtr(args[0], args[1], args[2], args[3], args[4]);

      // Check for promise
      if (v && v.then) {
        var p = v;
        if (!('$$v' in v)) {
          p.$$v = undefined;
          p.then(function(val) { p.$$v = val; });
        }
        v = v.$$v;
      }

      return ensureSafeObject(v, text);
    };
  }

  // This is used with json array declaration
  function arrayDeclaration () {
    var elementFns = [];
    var allConstant = true;
    if (peekToken().text != ']') {
      do {
        var elementFn = expression();
        elementFns.push(elementFn);
        if (!elementFn.constant) {
          allConstant = false;
        }
      } while (expect(','));
    }
    consume(']');
    return extend(function(self, locals){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self, locals));
      }
      return array;
    }, {
      literal:true,
      constant:allConstant
    });
  }

  function object () {
    var keyValues = [];
    var allConstant = true;
    if (peekToken().text != '}') {
      do {
        var token = expect(),
        key = token.string || token.text;
        consume(":");
        var value = expression();
        keyValues.push({key:key, value:value});
        if (!value.constant) {
          allConstant = false;
        }
      } while (expect(','));
    }
    consume('}');
    return extend(function(self, locals){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        object[keyValue.key] = keyValue.value(self, locals);
      }
      return object;
    }, {
      literal:true,
      constant:allConstant
    });
  }
}

//////////////////////////////////////////////////
// Parser helper functions
//////////////////////////////////////////////////

function setter(obj, path, setValue, fullExp) {
  var element = path.split('.'), key;
  for (var i = 0; element.length > 1; i++) {
    key = ensureSafeMemberName(element.shift(), fullExp);
    var propertyObj = obj[key];
    if (!propertyObj) {
      propertyObj = {};
      obj[key] = propertyObj;
    }
    obj = propertyObj;
    if (obj.then) {
      if (!("$$v" in obj)) {
        (function(promise) {
          promise.then(function(val) { promise.$$v = val; }); }
        )(obj);
      }
      if (obj.$$v === undefined) {
        obj.$$v = {};
      }
      obj = obj.$$v;
    }
  }
  key = ensureSafeMemberName(element.shift(), fullExp);
  obj[key] = setValue;
  return setValue;
}

var getterFnCache = {};

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
  ensureSafeMemberName(key0, fullExp);
  ensureSafeMemberName(key1, fullExp);
  ensureSafeMemberName(key2, fullExp);
  ensureSafeMemberName(key3, fullExp);
  ensureSafeMemberName(key4, fullExp);
  return function(scope, locals) {
    var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope,
        promise;

    if (pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key0];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key1 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key1];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key2 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key2];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key3 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key3];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    if (!key4 || pathVal === null || pathVal === undefined) return pathVal;

    pathVal = pathVal[key4];
    if (pathVal && pathVal.then) {
      if (!("$$v" in pathVal)) {
        promise = pathVal;
        promise.$$v = undefined;
        promise.then(function(val) { promise.$$v = val; });
      }
      pathVal = pathVal.$$v;
    }
    return pathVal;
  };
}

function getterFn(path, csp, fullExp) {
  if (getterFnCache.hasOwnProperty(path)) {
    return getterFnCache[path];
  }

  var pathKeys = path.split('.'),
      pathKeysLength = pathKeys.length,
      fn;

  if (csp) {
    fn = (pathKeysLength < 6)
        ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp)
        : function(scope, locals) {
          var i = 0, val;
          do {
            val = cspSafeGetterFn(
                    pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp
                  )(scope, locals);

            locals = undefined; // clear after first iteration
            scope = val;
          } while (i < pathKeysLength);
          return val;
        }
  } else {
    var code = 'var l, fn, p;\n';
    forEach(pathKeys, function(key, index) {
      ensureSafeMemberName(key, fullExp);
      code += 'if(s === null || s === undefined) return s;\n' +
              'l=s;\n' +
              's='+ (index
                      // we simply dereference 's' on any .dot notation
                      ? 's'
                      // but if we are first then we check locals first, and if so read it first
                      : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' +
              'if (s && s.then) {\n' +
                ' if (!("$$v" in s)) {\n' +
                  ' p=s;\n' +
                  ' p.$$v = undefined;\n' +
                  ' p.then(function(v) {p.$$v=v;});\n' +
                  '}\n' +
                ' s=s.$$v\n' +
              '}\n';
    });
    code += 'return s;';
    fn = Function('s', 'k', code); // s=scope, k=locals
    fn.toString = function() { return code; };
  }

  return getterFnCache[path] = fn;
}

///////////////////////////////////

/**
 * @ngdoc function
 * @name ng.$parse
 * @function
 *
 * @description
 *
 * Converts Angular {@link guide/expression expression} into a function.
 *
 * <pre>
 *   var getter = $parse('user.name');
 *   var setter = getter.assign;
 *   var context = {user:{name:'angular'}};
 *   var locals = {user:{name:'local'}};
 *
 *   expect(getter(context)).toEqual('angular');
 *   setter(context, 'newValue');
 *   expect(context.user.name).toEqual('newValue');
 *   expect(getter(context, locals)).toEqual('local');
 * </pre>
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
function $ParseProvider() {
  var cache = {};
  this.$get = ['$filter', '$sniffer', function($filter, $sniffer) {
    return function(exp) {
      switch(typeof exp) {
        case 'string':
          return cache.hasOwnProperty(exp)
            ? cache[exp]
            : cache[exp] =  parser(exp, false, $filter, $sniffer.csp);
        case 'function':
          return exp;
        default:
          return noop;
      }
    };
  }];
}
