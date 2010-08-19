OPERATORS = {
    'null':function(self){return _null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    $undefined:noop,
    '+':function(self, a,b){return (isDefined(a)?a:0)+(isDefined(b)?b:0);},
    '-':function(self, a,b){return (isDefined(a)?a:0)-(isDefined(b)?b:0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':function(self, a,b){return setter(self, a, b);},
    '==':function(self, a,b){return a==b;},
    '!=':function(self, a,b){return a!=b;},
    '<':function(self, a,b){return a<b;},
    '>':function(self, a,b){return a>b;},
    '<=':function(self, a,b){return a<=b;},
    '>=':function(self, a,b){return a>=b;},
    '&&':function(self, a,b){return a&&b;},
    '||':function(self, a,b){return a||b;},
    '&':function(self, a,b){return a&b;},
//    '|':function(self, a,b){return a|b;},
    '|':function(self, a,b){return b(self, a);},
    '!':function(self, a){return !a;}
};
ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

function lex(text, parseStrings){
  var dateParseLength = parseStrings ? 20 : -1,
      tokens = [],
      index = 0,
      canStartRegExp = true;

  while (index < text.length) {
    var ch = text.charAt(index);
    if (ch == '"' || ch == "'") {
      readString(ch);
      canStartRegExp = true;
    } else if (ch == '(' || ch == '[') {
      tokens.push({index:index, text:ch});
      index++;
    } else if (ch == '{' ) {
      var peekCh = peek();
      if (peekCh == ':' || peekCh == '(') {
        tokens.push({index:index, text:ch + peekCh});
        index++;
      } else {
        tokens.push({index:index, text:ch});
      }
      index++;
      canStartRegExp = true;
    } else if (ch == ')' || ch == ']' || ch == '}' ) {
      tokens.push({index:index, text:ch});
      index++;
      canStartRegExp = false;
    } else if ( ch == ':' || ch == '.' || ch == ',' || ch == ';') {
      tokens.push({index:index, text:ch});
      index++;
      canStartRegExp = true;
    } else if ( canStartRegExp && ch == '/' ) {
      readRegexp();
      canStartRegExp = false;
    } else if ( isNumber(ch) ) {
      readNumber();
      canStartRegExp = false;
    } else if (isIdent(ch)) {
      readIdent();
      canStartRegExp = false;
    } else if (isWhitespace(ch)) {
      index++;
    } else {
      var ch2 = ch + peek(),
          fn = OPERATORS[ch],
          fn2 = OPERATORS[ch2];
      if (fn2) {
        tokens.push({index:index, text:ch2, fn:fn2});
        index += 2;
      } else if (fn) {
        tokens.push({index:index, text:ch, fn:fn});
        index += 1;
      } else {
        throw "Lexer Error: Unexpected next character [" +
            text.substring(index) +
            "] in expression '" + text +
            "' at column '" + (index+1) + "'.";
      }
      canStartRegExp = true;
    }
  }
  return tokens;

  function peek() {
    return index + 1 < text.length ? text.charAt(index + 1) : false;
  }
  function isNumber(ch) {
    return '0' <= ch && ch <= '9';
  }
  function isWhitespace(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v';
  }
  function isIdent(ch) {
    return 'a' <= ch && ch <= 'z' ||
           'A' <= ch && ch <= 'Z' ||
           '_' == ch || ch == '$';
  }
  function readNumber() {
    var number = "";
    var start = index;
    while (index < text.length) {
      var ch = text.charAt(index);
      if (ch == '.' || isNumber(ch)) {
        number += ch;
      } else {
        break;
      }
      index++;
    }
    number = 1 * number;
    tokens.push({index:start, text:number,
      fn:function(){return number;}});
  }
  function readIdent() {
    var ident = "";
    var start = index;
    while (index < text.length) {
      var ch = text.charAt(index);
      if (ch == '.' || isIdent(ch) || isNumber(ch)) {
        ident += ch;
      } else {
        break;
      }
      index++;
    }
    var fn = OPERATORS[ident];
    if (!fn) {
      fn = getterFn(ident);
      fn.isAssignable = ident;
    }
    tokens.push({index:start, text:ident, fn:fn});
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
        tokens.push({index:start, text:rawString, string:string,
          fn:function(){
            return (string.length == dateParseLength) ?
              angular['String']['toDate'](string) : string;
          }});
        return;
      } else {
        string += ch;
      }
      index++;
    }
    throw "Lexer Error: Unterminated quote [" +
        text.substring(start) + "] starting at column '" +
        (start+1) + "' in expression '" + text + "'.";
  }
  function readRegexp(quote) {
    var start = index;
    index++;
    var regexp = "";
    var escape = false;
    while (index < text.length) {
      var ch = text.charAt(index);
      if (escape) {
        regexp += ch;
        escape = false;
      } else if (ch === '\\') {
        regexp += ch;
        escape = true;
      } else if (ch === '/') {
        index++;
        var flags = "";
        if (isIdent(text.charAt(index))) {
          readIdent();
          flags = tokens.pop().text;
        }
        var compiledRegexp = new RegExp(regexp, flags);
        tokens.push({index:start, text:regexp, flags:flags,
          fn:function(){return compiledRegexp;}});
        return;
      } else {
        regexp += ch;
      }
      index++;
    }
    throw "Lexer Error: Unterminated RegExp [" +
        text.substring(start) + "] starting at column '" +
        (start+1) + "' in expression '" + text + "'.";
  }
}

/////////////////////////////////////////

function Parser(text, parseStrings){
  this.text = text;
  this.tokens = lex(text, parseStrings);
  this.index = 0;
}

Parser.ZERO = function(){
  return 0;
};

Parser.prototype = {
  error: function(msg, token) {
    throw "Token '" + token.text +
      "' is " + msg + " at column='" +
      (token.index + 1) + "' of expression '" +
      this.text + "' starting at '" + this.text.substring(token.index) + "'.";
  },

  peekToken: function() {
    if (this.tokens.length === 0)
      throw "Unexpected end of expression: " + this.text;
    return this.tokens[0];
  },

  peek: function(e1, e2, e3, e4) {
    var tokens = this.tokens;
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },

  expect: function(e1, e2, e3, e4){
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      this.currentToken = token;
      return token;
    }
    return false;
  },

  consume: function(e1){
    if (!this.expect(e1)) {
      var token = this.peek();
      throw "Expecting '" + e1 + "' at column '" +
          (token.index+1) + "' in '" +
          this.text + "' got '" +
          this.text.substring(token.index) + "'.";
    }
  },

  _unary: function(fn, right) {
    return function(self) {
      return fn(self, right(self));
    };
  },

  _binary: function(left, fn, right) {
    return function(self) {
      return fn(self, left(self), right(self));
    };
  },

  hasTokens: function () {
    return this.tokens.length > 0;
  },

  assertAllConsumed: function(){
    if (this.tokens.length !== 0) {
      throw "Did not understand '" + this.text.substring(this.tokens[0].index) +
          "' while evaluating '" + this.text + "'.";
    }
  },

  statements: function(){
    var statements = [];
    while(true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        statements.push(this.filterChain());
      if (!this.expect(';')) {
        return function (self){
          var value;
          for ( var i = 0; i < statements.length; i++) {
            var statement = statements[i];
            if (statement)
              value = statement(self);
          }
          return value;
        };
      }
    }
  },

  filterChain: function(){
    var left = this.expression();
    var token;
    while(true) {
      if ((token = this.expect('|'))) {
        left = this._binary(left, token.fn, this.filter());
      } else {
        return left;
      }
    }
  },

  filter: function(){
    return this._pipeFunction(angularFilter);
  },

  validator: function(){
    return this._pipeFunction(angularValidator);
  },

  _pipeFunction: function(fnScope){
    var fn = this.functionIdent(fnScope);
    var argsFn = [];
    var token;
    while(true) {
      if ((token = this.expect(':'))) {
        argsFn.push(this.expression());
      } else {
        var fnInvoke = function(self, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self));
          }
          return fn.apply(self, args);
        };
        return function(){
          return fnInvoke;
        };
      }
    }
  },

  expression: function(){
    return this.throwStmt();
  },

  throwStmt: function(){
    if (this.expect('throw')) {
      var throwExp = this.assignment();
      return function (self) {
        throw throwExp(self);
      };
    } else {
     return this.assignment();
    }
  },

  assignment: function(){
    var left = this.logicalOR();
    var token;
    if (token = this.expect('=')) {
      if (!left.isAssignable) {
        throw "Left hand side '" +
            this.text.substring(0, token.index) + "' of assignment '" +
            this.text.substring(token.index) + "' is not assignable.";
      }
      var ident = function(){return left.isAssignable;};
      return this._binary(ident, token.fn, this.logicalOR());
    } else {
     return left;
    }
  },

  logicalOR: function(){
    var left = this.logicalAND();
    var token;
    while(true) {
      if ((token = this.expect('||'))) {
        left = this._binary(left, token.fn, this.logicalAND());
      } else {
        return left;
      }
    }
  },

  logicalAND: function(){
    var left = this.equality();
    var token;
    if ((token = this.expect('&&'))) {
      left = this._binary(left, token.fn, this.logicalAND());
    }
    return left;
  },

  equality: function(){
    var left = this.relational();
    var token;
    if ((token = this.expect('==','!='))) {
      left = this._binary(left, token.fn, this.equality());
    }
    return left;
  },

  relational: function(){
    var left = this.additive();
    var token;
    if (token = this.expect('<', '>', '<=', '>=')) {
      left = this._binary(left, token.fn, this.relational());
    }
    return left;
  },

  additive: function(){
    var left = this.multiplicative();
    var token;
    while(token = this.expect('+','-')) {
      left = this._binary(left, token.fn, this.multiplicative());
    }
    return left;
  },

  multiplicative: function(){
    var left = this.unary();
    var token;
    while(token = this.expect('*','/','%')) {
        left = this._binary(left, token.fn, this.unary());
    }
    return left;
  },

  unary: function(){
    var token;
    if (this.expect('+')) {
      return this.primary();
    } else if (token = this.expect('-')) {
      return this._binary(Parser.ZERO, token.fn, this.unary());
    } else if (token = this.expect('!')) {
      return this._unary(token.fn, this.unary());
    } else {
     return this.primary();
    }
  },

  functionIdent: function(fnScope) {
    var token = this.expect();
    var element = token.text.split('.');
    var instance = fnScope;
    var key;
    for ( var i = 0; i < element.length; i++) {
      key = element[i];
      if (instance)
        instance = instance[key];
    }
    if (typeof instance != $function) {
      throw "Function '" + token.text + "' at column '" +
      (token.index+1)  + "' in '" + this.text + "' is not defined.";
    }
    return instance;
  },

  primary: function() {
    var primary;
    if (this.expect('(')) {
      var expression = this.filterChain();
      this.consume(')');
      primary = expression;
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else {
      var token = this.expect();
      primary = token.fn;
      if (!primary) {
        this.error("not a primary expression", token);
      }
    }
    var next;
    while (next = this.expect('(', '[', '.')) {
      if (next.text === '(') {
        primary = this.functionCall(primary);
      } else if (next.text === '[') {
        primary = this.objectIndex(primary);
      } else if (next.text === '.') {
        primary = this.fieldAccess(primary);
      } else {
        throw "IMPOSSIBLE";
      }
    }
    return primary;
  },

  fieldAccess: function(object) {
    var field = this.expect().text;
    var getter = getterFn(field);
    var fn = function (self){
      return getter(object(self));
    };
    fn.isAssignable = field;
    return fn;
  },

  objectIndex: function(obj) {
    var indexFn = this.expression();
    this.consume(']');
    if (this.expect('=')) {
      var rhs = this.expression();
      return function (self){
        return obj(self)[indexFn(self)] = rhs(self);
      };
    } else {
      return function (self){
        var o = obj(self);
        var i = indexFn(self);
        return (o) ? o[i] : _undefined;
      };
    }
  },

  functionCall: function(fn) {
    var argsFn = [];
    if (this.peekToken().text != ')') {
      do {
        argsFn.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(')');
    return function (self){
      var args = [];
      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](self));
      }
    var fnPtr = fn(self) || noop;
    // IE stupidity!
    return fnPtr.apply ?
      fnPtr.apply(self, args) :
      fnPtr(args[0], args[1], args[2], args[3], args[4]);
    };
  },

  // This is used with json array declaration
  arrayDeclaration: function () {
    var elementFns = [];
    if (this.peekToken().text != ']') {
      do {
        elementFns.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(']');
    return function (self){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self));
      }
      return array;
    };
  },

  object: function () {
    var keyValues = [];
    if (this.peekToken().text != '}') {
      do {
        var token = this.expect(),
            key = token.string || token.text;
        this.consume(":");
        var value = this.expression();
        keyValues.push({key:key, value:value});
      } while (this.expect(','));
    }
    this.consume('}');
    return function (self){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        var value = keyValue.value(self);
        object[keyValue.key] = value;
      }
      return object;
    };
  },

  watch: function () {
    var decl = [];
    while(this.hasTokens()) {
      decl.push(this.watchDecl());
      if (!this.expect(';')) {
        this.assertAllConsumed();
      }
    }
    this.assertAllConsumed();
    return function (self){
      for ( var i = 0; i < decl.length; i++) {
        var d = decl[i](self);
        self.addListener(d.name, d.fn);
      }
    };
  },

  watchDecl: function () {
    var anchorName = this.expect().text;
    this.consume(":");
    var expression;
    if (this.peekToken().text == '{') {
      this.consume("{");
      expression = this.statements();
      this.consume("}");
    } else {
      expression = this.expression();
    }
    return function(self) {
      return {name:anchorName, fn:expression};
    };
  }
};

