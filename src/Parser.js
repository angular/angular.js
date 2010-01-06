nglr.Lexer = function(text, parsStrings){
  this.text = text;
  // UTC dates have 20 characters, we send them through parser
  this.dateParseLength = parsStrings ? 20 : -1;
  this.tokens = [];
  this.index = 0;
};

nglr.Lexer.OPERATORS = {
    'null':function(self){return null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    '+':function(self, a,b){return (a||0)+(b||0);},
    '-':function(self, a,b){return (a||0)-(b||0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':function(self, a,b){return self.scope.set(a, b);},
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

nglr.Lexer.prototype.peek = function() {
  if (this.index + 1 < this.text.length) {
    return this.text.charAt(this.index + 1);
  } else {
    return false;
  }
};

nglr.Lexer.prototype.parse = function() {
  var tokens = this.tokens;
  var OPERATORS = nglr.Lexer.OPERATORS;
  var canStartRegExp = true;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (ch == '"' || ch == "'") {
      this.readString(ch);
      canStartRegExp = true;
    } else if (ch == '(' || ch == '[') {
      tokens.push({index:this.index, text:ch});
      this.index++;
    } else if (ch == '{' ) {
      var peekCh = this.peek();
      if (peekCh == ':' || peekCh == '(') {
        tokens.push({index:this.index, text:ch + peekCh});
        this.index++;
      } else {
        tokens.push({index:this.index, text:ch});
      }
      this.index++;
      canStartRegExp = true;
    } else if (ch == ')' || ch == ']' || ch == '}' ) {
      tokens.push({index:this.index, text:ch});
      this.index++;
      canStartRegExp = false;
    } else if ( ch == ':' || ch == '.' || ch == ',' || ch == ';') {
      tokens.push({index:this.index, text:ch});
      this.index++;
      canStartRegExp = true;
    } else if ( canStartRegExp && ch == '/' ) {
      this.readRegexp();
      canStartRegExp = false;
    } else if ( this.isNumber(ch) ) {
      this.readNumber();
      canStartRegExp = false;
    } else if (this.isIdent(ch)) {
      this.readIdent();
      canStartRegExp = false;
    } else if (this.isWhitespace(ch)) {
      this.index++;
    } else {
      var ch2 = ch + this.peek();
      var fn = OPERATORS[ch];
      var fn2 = OPERATORS[ch2];
      if (fn2) {
        tokens.push({index:this.index, text:ch2, fn:fn2});
        this.index += 2;
      } else if (fn) {
        tokens.push({index:this.index, text:ch, fn:fn});
        this.index += 1;
      } else {
        throw "Lexer Error: Unexpected next character [" +
            this.text.substring(this.index) +
            "] in expression '" + this.text +
            "' at column '" + (this.index+1) + "'.";
      }
      canStartRegExp = true;
    }
  }
  return tokens;
};

nglr.Lexer.prototype.isNumber = function(ch) {
  return '0' <= ch && ch <= '9';
};

nglr.Lexer.prototype.isWhitespace = function(ch) {
  return ch == ' ' || ch == '\r' || ch == '\t' ||
         ch == '\n' || ch == '\v';
};

nglr.Lexer.prototype.isIdent = function(ch) {
  return 'a' <= ch && ch <= 'z' ||
         'A' <= ch && ch <= 'Z' ||
         '_' == ch || ch == '$';
};

nglr.Lexer.prototype.readNumber = function() {
  var number = "";
  var start = this.index;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (ch == '.' || this.isNumber(ch)) {
      number += ch;
    } else {
      break;
    }
    this.index++;
  }
  number = 1 * number;
  this.tokens.push({index:start, text:number,
    fn:function(){return number;}});
};

nglr.Lexer.prototype.readIdent = function() {
  var ident = "";
  var start = this.index;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (ch == '.' || this.isIdent(ch) || this.isNumber(ch)) {
      ident += ch;
    } else {
      break;
    }
    this.index++;
  }
  var fn = nglr.Lexer.OPERATORS[ident];
  if (!fn) {
    fn = function(self){
      return self.scope.get(ident);
    };
    fn.isAssignable = ident;
  }
  this.tokens.push({index:start, text:ident, fn:fn});
};
nglr.Lexer.ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};
nglr.Lexer.prototype.readString = function(quote) {
  var start = this.index;
  var dateParseLength = this.dateParseLength;
  this.index++;
  var string = "";
  var escape = false;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (escape) {
      if (ch == 'u') {
        var hex = this.text.substring(this.index + 1, this.index + 5);
        this.index += 4;
        string += String.fromCharCode(parseInt(hex, 16));
      } else {
        var rep = nglr.Lexer.ESCAPE[ch];
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
      this.index++;
      this.tokens.push({index:start, text:string,
        fn:function(){
          return (string.length == dateParseLength) ?
            angular.String.toDate(string) : string;
        }});
      return;
    } else {
      string += ch;
    }
    this.index++;
  }
  throw "Lexer Error: Unterminated quote [" +
      this.text.substring(start) + "] starting at column '" +
      (start+1) + "' in expression '" + this.text + "'.";
};

nglr.Lexer.prototype.readRegexp = function(quote) {
  var start = this.index;
  this.index++;
  var regexp = "";
  var escape = false;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (escape) {
      regexp += ch;
      escape = false;
    } else if (ch === '\\') {
      regexp += ch;
      escape = true;
    } else if (ch === '/') {
      this.index++;
      var flags = "";
      if (this.isIdent(this.text.charAt(this.index))) {
        this.readIdent();
        flags = this.tokens.pop().text;
      }
      var compiledRegexp = new RegExp(regexp, flags);
      this.tokens.push({index:start, text:regexp, flags:flags,
        fn:function(){return compiledRegexp;}});
      return;
    } else {
      regexp += ch;
    }
    this.index++;
  }
  throw "Lexer Error: Unterminated RegExp [" +
      this.text.substring(start) + "] starting at column '" +
      (start+1) + "' in expression '" + this.text + "'.";
};


nglr.Parser = function(text, parseStrings){
  this.text = text;
  this.tokens = new nglr.Lexer(text, parseStrings).parse();
  this.index = 0;
};

nglr.Parser.ZERO = function(){
  return 0;
};

nglr.Parser.prototype.error = function(msg, token) {
  throw "Token '" + token.text + 
    "' is " + msg + " at column='" + 
    (token.index + 1) + "' of expression '" + 
    this.text + "' starting at '" + this.text.substring(token.index) + "'.";
};

nglr.Parser.prototype.peekToken = function() {
  if (this.tokens.length === 0) 
    throw "Unexpected end of expression: " + this.text;
  return this.tokens[0];
};

nglr.Parser.prototype.peek = function(e1, e2, e3, e4) {
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
};

nglr.Parser.prototype.expect = function(e1, e2, e3, e4){
  var token = this.peek(e1, e2, e3, e4);
  if (token) {
    this.tokens.shift();
    this.currentToken = token;
    return token;
  }
  return false;
};

nglr.Parser.prototype.consume = function(e1){
  if (!this.expect(e1)) {
    var token = this.peek();
    throw "Expecting '" + e1 + "' at column '" +
        (token.index+1) + "' in '" +
        this.text + "' got '" +
        this.text.substring(token.index) + "'.";
  }
};

nglr.Parser.prototype._unary = function(fn, parse) {
  var right = parse.apply(this);
  return function(self) {
    return fn(self, right(self));
  };
};

nglr.Parser.prototype._binary = function(left, fn, parse) {
  var right = parse.apply(this);
  return function(self) {
    return fn(self, left(self), right(self));
  };
};

nglr.Parser.prototype.hasTokens = function () {
  return this.tokens.length > 0;
};

nglr.Parser.prototype.assertAllConsumed = function(){
  if (this.tokens.length !== 0) {
    throw "Did not understand '" + this.text.substring(this.tokens[0].index) +
        "' while evaluating '" + this.text + "'.";
  }
};

nglr.Parser.prototype.statements = function(){
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
};

nglr.Parser.prototype.filterChain = function(){
  var left = this.expression();
  var token;
  while(true) {
    if ((token = this.expect('|'))) {
      left = this._binary(left, token.fn, this.filter);
    } else {
      return left;
    }
  }
};

nglr.Parser.prototype.filter = function(){
  return this._pipeFunction(angular.filter);
};

nglr.Parser.prototype.validator = function(){
  return this._pipeFunction(angular.validator);
};

nglr.Parser.prototype._pipeFunction = function(fnScope){
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
};

nglr.Parser.prototype.expression = function(){
  return this.throwStmt();
};

nglr.Parser.prototype.throwStmt = function(){
  if (this.expect('throw')) {
    var throwExp = this.assignment();
    return function (self) {
      throw throwExp(self);
    };
  } else {
   return this.assignment();
  }
};

nglr.Parser.prototype.assignment = function(){
  var left = this.logicalOR();
  var token;
  if (token = this.expect('=')) {
    if (!left.isAssignable) {
      throw "Left hand side '" +
          this.text.substring(0, token.index) + "' of assignment '" +
          this.text.substring(token.index) + "' is not assignable.";
    }
    var ident = function(){return left.isAssignable;};
    return this._binary(ident, token.fn, this.logicalOR);
  } else {
   return left;
  }
};

nglr.Parser.prototype.logicalOR = function(){
  var left = this.logicalAND();
  var token;
  while(true) {
    if ((token = this.expect('||'))) {
      left = this._binary(left, token.fn, this.logicalAND);
    } else {
      return left;
    }
  }
};

nglr.Parser.prototype.logicalAND = function(){
  var left = this.negated();
  var token;
  while(true) {
    if ((token = this.expect('&&'))) {
      left = this._binary(left, token.fn, this.negated);
    } else {
      return left;
    }
  }
};

nglr.Parser.prototype.negated = function(){
  var token;
  if (token = this.expect('!')) {
    return this._unary(token.fn, this.equality);
  } else {
   return this.equality();
  }
};

nglr.Parser.prototype.equality = function(){
  var left = this.relational();
  var token;
  while(true) {
    if ((token = this.expect('==','!='))) {
      left = this._binary(left, token.fn, this.relational);
    } else {
      return left;
    }
  }
};

nglr.Parser.prototype.relational = function(){
  var left = this.additive();
  var token;
  while(true) {
    if ((token = this.expect('<', '>', '<=', '>='))) {
      left = this._binary(left, token.fn, this.additive);
    } else {
      return left;
    }
  }
};

nglr.Parser.prototype.additive = function(){
  var left = this.multiplicative();
  var token;
  while(token = this.expect('+','-')) {
    left = this._binary(left, token.fn, this.multiplicative);
  }
  return left;
};

nglr.Parser.prototype.multiplicative = function(){
  var left = this.unary();
  var token;
  while(token = this.expect('*','/','%')) {
      left = this._binary(left, token.fn, this.unary);
  }
  return left;
};

nglr.Parser.prototype.unary = function(){
  var token;
  if (this.expect('+')) {
    return this.primary();
  } else if (token = this.expect('-')) {
    return this._binary(nglr.Parser.ZERO, token.fn, this.multiplicative);
  } else {
   return this.primary();
  }
};

nglr.Parser.prototype.functionIdent = function(fnScope) {
  var token = this.expect();
  var element = token.text.split('.');
  var instance = fnScope;
  var key;
  for ( var i = 0; i < element.length; i++) {
    key = element[i];
    if (instance)
      instance = instance[key];
  }
  if (typeof instance != 'function') {
    throw "Function '" + token.text + "' at column '" +
    (token.index+1)  + "' in '" + this.text + "' is not defined.";
  }
  return instance;
};

nglr.Parser.prototype.primary = function() {
  var primary;
  if (this.expect('(')) {
    var expression = this.filterChain();
    this.consume(')');
    primary = expression;
  } else if (this.expect('[')) {
    primary = this.arrayDeclaration();
  } else if (this.expect('{')) {
    primary = this.object();
  } else if (this.expect('{:')) {
    primary = this.closure(false);
  } else if (this.expect('{(')) {
    primary = this.closure(true);
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
};

nglr.Parser.prototype.closure = function(hasArgs) {
  var args = [];
  if (hasArgs) {
    if (!this.expect(')')) {
      args.push(this.expect().text);
      while(this.expect(',')) {
        args.push(this.expect().text);
      }
      this.consume(')');
    }
    this.consume(":");
  }
  var statements = this.statements();
  this.consume("}");
  return function(self){
    return function($){
      var scope = new nglr.Scope(self.scope.state);
      scope.set('$', $);
      for ( var i = 0; i < args.length; i++) {
        scope.set(args[i], arguments[i]);
      }
      return statements({scope:scope});
    };
  };
};

nglr.Parser.prototype.fieldAccess = function(object) {
  var field = this.expect().text;
  var fn = function (self){
    return nglr.Scope.getter(object(self), field);
  };
  fn.isAssignable = field;
  return fn;
};

nglr.Parser.prototype.objectIndex = function(obj) {
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
      return (o) ? o[i] : undefined;
    };
  }
};

nglr.Parser.prototype.functionCall = function(fn) {
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
    var fnPtr = fn(self);
    if (typeof fnPtr === 'function') {
      return fnPtr.apply(self, args);
    } else {
      throw "Expression '" + fn.isAssignable + "' is not a function.";
    }
  };
};

// This is used with json array declaration
nglr.Parser.prototype.arrayDeclaration = function () {
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
};

nglr.Parser.prototype.object = function () {
  var keyValues = [];
  if (this.peekToken().text != '}') {
    do {
      var key = this.expect().text;
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
};

nglr.Parser.prototype.entityDeclaration = function () {
  var decl = [];
  while(this.hasTokens()) {
    decl.push(this.entityDecl());
    if (!this.expect(';')) {
      this.assertAllConsumed();
    }
  }
  return function (self){
    var code = "";
    for ( var i = 0; i < decl.length; i++) {
      code += decl[i](self);
    }
    return code;
  };
};

nglr.Parser.prototype.entityDecl = function () {
  var entity = this.expect().text;
  var instance;
  var defaults;
  if (this.expect('=')) {
    instance = entity;
    entity = this.expect().text;
  }
  if (this.expect(':')) {
    defaults = this.primary()(null);
  }
  return function(self) {
    var datastore = self.scope.get('$datastore');
    var Entity = datastore.entity(entity, defaults);
    self.scope.set(entity, Entity);
    if (instance) {
      var document = Entity();
      document.$$anchor = instance;
      self.scope.set(instance, document);
      return "$anchor." + instance + ":{" + 
          instance + "=" + entity + ".load($anchor." + instance + ");" +
          instance + ".$$anchor=" + angular.String.quote(instance) + ";" + 
        "};";
    } else {
      return "";
    }
  };
};

nglr.Parser.prototype.watch = function () {
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
};

nglr.Parser.prototype.watchDecl = function () {
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
};


