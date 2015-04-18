'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: false */
/* global indexToLineAndColumn: false */
/* global InterpolationParts: false */
/* global PluralMessage: false */
/* global SelectMessage: false */
/* global subtractOffset: false */

// The params src and dst are exactly one of two types: NestedParserState or MessageFormatParser.
// This function is fully optimized by V8. (inspect via IRHydra or --trace-deopt.)
// The idea behind writing it this way is to avoid repeating oneself.  This is the ONE place where
// the parser state that is saved/restored when parsing nested mustaches is specified.
function copyNestedParserState(src, dst) {
  dst.expressionFn = src.expressionFn;
  dst.expressionMinusOffsetFn = src.expressionMinusOffsetFn;
  dst.pluralOffset = src.pluralOffset;
  dst.choices = src.choices;
  dst.choiceKey = src.choiceKey;
  dst.interpolationParts = src.interpolationParts;
  dst.ruleChoiceKeyword = src.ruleChoiceKeyword;
  dst.msgStartIndex = src.msgStartIndex;
  dst.expressionStartIndex = src.expressionStartIndex;
}

function NestedParserState(parser) {
  copyNestedParserState(parser, this);
}

/**
 * @constructor
 * @private
 */
function MessageFormatParser(text, startIndex, $parse, pluralCat, stringifier,
                             mustHaveExpression, trustedContext, allOrNothing) {
  this.text = text;
  this.index = startIndex || 0;
  this.$parse = $parse;
  this.pluralCat = pluralCat;
  this.stringifier = stringifier;
  this.mustHaveExpression = !!mustHaveExpression;
  this.trustedContext = trustedContext;
  this.allOrNothing = !!allOrNothing;
  this.expressionFn = null;
  this.expressionMinusOffsetFn = null;
  this.pluralOffset = null;
  this.choices = null;
  this.choiceKey = null;
  this.interpolationParts = null;
  this.msgStartIndex = null;
  this.nestedStateStack = [];
  this.parsedFn = null;
  this.rule = null;
  this.ruleStack = null;
  this.ruleChoiceKeyword = null;
  this.interpNestLevel = null;
  this.expressionStartIndex = null;
  this.stringStartIndex = null;
  this.stringQuote = null;
  this.stringInterestsRe = null;
  this.angularOperatorStack = null;
  this.textPart = null;
}

// preserve v8 optimization.
var EMPTY_STATE = new NestedParserState(new MessageFormatParser(
        /* text= */ '', /* startIndex= */ 0, /* $parse= */ null, /* pluralCat= */ null, /* stringifier= */ null,
        /* mustHaveExpression= */ false, /* trustedContext= */ null, /* allOrNothing */ false));

MessageFormatParser.prototype.pushState = function pushState() {
  this.nestedStateStack.push(new NestedParserState(this));
  copyNestedParserState(EMPTY_STATE, this);
};

MessageFormatParser.prototype.popState = function popState() {
  if (this.nestedStateStack.length === 0) {
    this.errorInParseLogic();
  }
  var previousState = this.nestedStateStack.pop();
  copyNestedParserState(previousState, this);
};

// Oh my JavaScript!  Who knew you couldn't match a regex at a specific
// location in a string but will always search forward?!
// Apparently you'll be growing this ability via the sticky flag (y) in
// ES6.  I'll just to work around you for now.
MessageFormatParser.prototype.matchRe = function matchRe(re, search) {
  re.lastIndex = this.index;
  var match = re.exec(this.text);
  if (match != null && (search === true || (match.index == this.index))) {
    this.index = re.lastIndex;
    return match;
  }
  return null;
};

MessageFormatParser.prototype.searchRe = function searchRe(re) {
  return this.matchRe(re, true);
};


MessageFormatParser.prototype.consumeRe = function consumeRe(re) {
  // Without the sticky flag, we can't use the .test() method to consume a
  // match at the current index.  Instead, we'll use the slower .exec() method
  // and verify match.index.
  return !!this.matchRe(re);
};

// Run through our grammar avoiding deeply nested function call chains.
MessageFormatParser.prototype.run = function run(initialRule) {
  this.ruleStack = [initialRule];
  do {
    this.rule = this.ruleStack.pop();
    while (this.rule) {
      this.rule();
    }
    this.assertRuleOrNull(this.rule);
  } while (this.ruleStack.length > 0);
};

MessageFormatParser.prototype.errorInParseLogic = function errorInParseLogic() {
    throw $interpolateMinErr('logicbug',
        'The messageformat parser has encountered an internal error.  Please file a github issue against the AngularJS project and provide this message text that triggers the bug.  Text: “{0}”',
        this.text);
};

MessageFormatParser.prototype.assertRuleOrNull = function assertRuleOrNull(rule) {
  if (rule === void 0) {
    this.errorInParseLogic();
  }
};

var NEXT_WORD_RE = /\s*(\w+)\s*/g;
MessageFormatParser.prototype.errorExpecting = function errorExpecting() {
  // What was wrong with the syntax? Unsupported type, missing comma, or something else?
  var match = this.matchRe(NEXT_WORD_RE), position;
  if (match == null) {
    position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('reqarg',
        'Expected one of “plural” or “select” at line {0}, column {1} of text “{2}”',
        position.line, position.column, this.text);
  }
  var word = match[1];
  if (word == "select" || word == "plural") {
    position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('reqcomma',
        'Expected a comma after the keyword “{0}” at line {1}, column {2} of text “{3}”',
        word, position.line, position.column, this.text);
  } else {
    position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('unknarg',
        'Unsupported keyword “{0}” at line {0}, column {1}. Only “plural” and “select” are currently supported.  Text: “{3}”',
        word, position.line, position.column, this.text);
  }
};

var STRING_START_RE = /['"]/g;
MessageFormatParser.prototype.ruleString = function ruleString() {
  var match = this.matchRe(STRING_START_RE);
  if (match == null) {
    var position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('wantstring',
        'Expected the beginning of a string at line {0}, column {1} in text “{2}”',
        position.line, position.column, this.text);
  }
  this.startStringAtMatch(match);
};

MessageFormatParser.prototype.startStringAtMatch = function startStringAtMatch(match) {
  this.stringStartIndex = match.index;
  this.stringQuote = match[0];
  this.stringInterestsRe = this.stringQuote == "'" ? SQUOTED_STRING_INTEREST_RE : DQUOTED_STRING_INTEREST_RE;
  this.rule = this.ruleInsideString;
};

var SQUOTED_STRING_INTEREST_RE = /\\(?:\\|'|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2}|[0-7]{3}|\r\n|\n|[\s\S])|'/g;
var DQUOTED_STRING_INTEREST_RE = /\\(?:\\|"|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2}|[0-7]{3}|\r\n|\n|[\s\S])|"/g;
MessageFormatParser.prototype.ruleInsideString = function ruleInsideString() {
  var match = this.searchRe(this.stringInterestsRe);
  if (match == null) {
    var position = indexToLineAndColumn(this.text, this.stringStartIndex);
    throw $interpolateMinErr('untermstr',
        'The string beginning at line {0}, column {1} is unterminated in text “{2}”',
        position.line, position.column, this.text);
  }
  var chars = match[0];
  if (match == this.stringQuote) {
    this.rule = null;
  }
};

var PLURAL_OR_SELECT_ARG_TYPE_RE = /\s*(plural|select)\s*,\s*/g;
MessageFormatParser.prototype.rulePluralOrSelect = function rulePluralOrSelect() {
  var match = this.searchRe(PLURAL_OR_SELECT_ARG_TYPE_RE);
  if (match == null) {
    this.errorExpecting();
  }
  var argType = match[1];
  switch (argType) {
    case "plural": this.rule = this.rulePluralStyle; break;
    case "select": this.rule = this.ruleSelectStyle; break;
    default: this.errorInParseLogic();
  }
};

MessageFormatParser.prototype.rulePluralStyle = function rulePluralStyle() {
  this.choices = Object.create(null);
  this.ruleChoiceKeyword = this.rulePluralValueOrKeyword;
  this.rule = this.rulePluralOffset;
};

MessageFormatParser.prototype.ruleSelectStyle = function ruleSelectStyle() {
  this.choices = Object.create(null);
  this.ruleChoiceKeyword = this.ruleSelectKeyword;
  this.rule = this.ruleSelectKeyword;
};

var NUMBER_RE = /[0]|(?:[1-9][0-9]*)/g;
var PLURAL_OFFSET_RE = new RegExp("\\s*offset\\s*:\\s*(" + NUMBER_RE.source + ")", "g");

MessageFormatParser.prototype.rulePluralOffset = function rulePluralOffset() {
  var match = this.matchRe(PLURAL_OFFSET_RE);
  this.pluralOffset = (match == null) ? 0 : parseInt(match[1], 10);
  this.expressionMinusOffsetFn = subtractOffset(this.expressionFn, this.pluralOffset);
  this.rule = this.rulePluralValueOrKeyword;
};

MessageFormatParser.prototype.assertChoiceKeyIsNew = function assertChoiceKeyIsNew(choiceKey, index) {
  if (this.choices[choiceKey] !== void 0) {
    var position = indexToLineAndColumn(this.text, index);
    throw $interpolateMinErr('dupvalue',
        'The choice “{0}” is specified more than once. Duplicate key is at line {1}, column {2} in text “{3}”',
        choiceKey, position.line, position.column, this.text);
  }
};

var SELECT_KEYWORD = /\s*(\w+)/g;
MessageFormatParser.prototype.ruleSelectKeyword = function ruleSelectKeyword() {
  var match = this.matchRe(SELECT_KEYWORD);
  if (match == null) {
    this.parsedFn = new SelectMessage(this.expressionFn, this.choices).parsedFn;
    this.rule = null;
    return;
  }
  this.choiceKey = match[1];
  this.assertChoiceKeyIsNew(this.choiceKey, match.index);
  this.rule = this.ruleMessageText;
};

var EXPLICIT_VALUE_OR_KEYWORD_RE = new RegExp("\\s*(?:(?:=(" + NUMBER_RE.source + "))|(\\w+))", "g");
MessageFormatParser.prototype.rulePluralValueOrKeyword = function rulePluralValueOrKeyword() {
  var match = this.matchRe(EXPLICIT_VALUE_OR_KEYWORD_RE);
  if (match == null) {
    this.parsedFn = new PluralMessage(this.expressionFn, this.choices, this.pluralOffset, this.pluralCat).parsedFn;
    this.rule = null;
    return;
  }
  if (match[1] != null) {
    this.choiceKey = parseInt(match[1], 10);
  } else {
    this.choiceKey = match[2];
  }
  this.assertChoiceKeyIsNew(this.choiceKey, match.index);
  this.rule = this.ruleMessageText;
};

var BRACE_OPEN_RE = /\s*{/g;
var BRACE_CLOSE_RE = /}/g;
MessageFormatParser.prototype.ruleMessageText = function ruleMessageText() {
  if (!this.consumeRe(BRACE_OPEN_RE)) {
    var position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('reqopenbrace',
        'The plural choice “{0}” must be followed by a message in braces at line {1}, column {2} in text “{3}”',
        this.choiceKey, position.line, position.column, this.text);
  }
  this.msgStartIndex = this.index;
  this.interpolationParts = new InterpolationParts(this.trustedContext, this.allOrNothing);
  this.rule = this.ruleInInterpolationOrMessageText;
};

// Note: Since "\" is used as an escape character, don't allow it to be part of the
// startSymbol/endSymbol when I add the feature to allow them to be redefined.
var INTERP_OR_END_MESSAGE_RE = /\\.|{{|}/g;
var INTERP_OR_PLURALVALUE_OR_END_MESSAGE_RE = /\\.|{{|#|}/g;
var ESCAPE_OR_MUSTACHE_BEGIN_RE = /\\.|{{/g;
MessageFormatParser.prototype.advanceInInterpolationOrMessageText = function advanceInInterpolationOrMessageText() {
  var currentIndex = this.index, match, re;
  if (this.ruleChoiceKeyword == null) { // interpolation
    match = this.searchRe(ESCAPE_OR_MUSTACHE_BEGIN_RE);
    if (match == null) { // End of interpolation text.  Nothing more to process.
      this.textPart = this.text.substring(currentIndex);
      this.index = this.text.length;
      return null;
    }
  } else {
    match = this.searchRe(this.ruleChoiceKeyword == this.rulePluralValueOrKeyword ?
                          INTERP_OR_PLURALVALUE_OR_END_MESSAGE_RE : INTERP_OR_END_MESSAGE_RE);
    if (match == null) {
      var position = indexToLineAndColumn(this.text, this.msgStartIndex);
      throw $interpolateMinErr('reqendbrace',
          'The plural/select choice “{0}” message starting at line {1}, column {2} does not have an ending closing brace. Text “{3}”',
          this.choiceKey, position.line, position.column, this.text);
    }
  }
  // match is non-null.
  var token = match[0];
  this.textPart = this.text.substring(currentIndex, match.index);
  return token;
};

MessageFormatParser.prototype.ruleInInterpolationOrMessageText = function ruleInInterpolationOrMessageText() {
  var currentIndex = this.index;
  var token = this.advanceInInterpolationOrMessageText();
  if (token == null) {
    // End of interpolation text.  Nothing more to process.
    this.index = this.text.length;
    this.interpolationParts.addText(this.text.substring(currentIndex));
    this.rule = null;
    return;
  }
  if (token[0] == "\\") {
    // unescape next character and continue
    this.interpolationParts.addText(this.textPart + token[1]);
    return;
  }
  this.interpolationParts.addText(this.textPart);
  if (token == "{{") {
    this.pushState();
    this.ruleStack.push(this.ruleEndMustacheInInterpolationOrMessage);
    this.rule = this.ruleEnteredMustache;
  } else if (token == "}") {
    this.choices[this.choiceKey] = this.interpolationParts.toParsedFn(/*mustHaveExpression=*/false, this.text);
    this.rule = this.ruleChoiceKeyword;
  } else if (token == "#") {
    this.interpolationParts.addExpressionFn(this.expressionMinusOffsetFn);
  } else {
    this.errorInParseLogic();
  }
};

MessageFormatParser.prototype.ruleInterpolate = function ruleInterpolate() {
  this.interpolationParts = new InterpolationParts(this.trustedContext, this.allOrNothing);
  this.rule = this.ruleInInterpolation;
};

MessageFormatParser.prototype.ruleInInterpolation = function ruleInInterpolation() {
  var currentIndex = this.index;
  var match = this.searchRe(ESCAPE_OR_MUSTACHE_BEGIN_RE);
  if (match == null) {
    // End of interpolation text.  Nothing more to process.
    this.index = this.text.length;
    this.interpolationParts.addText(this.text.substring(currentIndex));
    this.parsedFn = this.interpolationParts.toParsedFn(this.mustHaveExpression, this.text);
    this.rule = null;
    return;
  }
  var token = match[0];
  if (token[0] == "\\") {
    // unescape next character and continue
    this.interpolationParts.addText(this.text.substring(currentIndex, match.index) + token[1]);
    return;
  }
  this.interpolationParts.addText(this.text.substring(currentIndex, match.index));
  this.pushState();
  this.ruleStack.push(this.ruleInterpolationEndMustache);
  this.rule = this.ruleEnteredMustache;
};

MessageFormatParser.prototype.ruleInterpolationEndMustache = function ruleInterpolationEndMustache() {
  var expressionFn = this.parsedFn;
  this.popState();
  this.interpolationParts.addExpressionFn(expressionFn);
  this.rule = this.ruleInInterpolation;
};

MessageFormatParser.prototype.ruleEnteredMustache = function ruleEnteredMustache() {
  this.parsedFn = null;
  this.ruleStack.push(this.ruleEndMustache);
  this.rule = this.ruleAngularExpression;
};

MessageFormatParser.prototype.ruleEndMustacheInInterpolationOrMessage = function ruleEndMustacheInInterpolationOrMessage() {
  var expressionFn = this.parsedFn;
  this.popState();
  this.interpolationParts.addExpressionFn(expressionFn);
  this.rule = this.ruleInInterpolationOrMessageText;
};



var INTERP_END_RE = /\s*}}/g;
MessageFormatParser.prototype.ruleEndMustache = function ruleEndMustache() {
  var match = this.matchRe(INTERP_END_RE);
  if (match == null) {
    var position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('reqendinterp',
        'Expecting end of interpolation symbol, “{0}”, at line {1}, column {2} in text “{3}”',
        '}}', position.line, position.column, this.text);
  }
  if (this.parsedFn == null) {
    // If we parsed a MessageFormat extension, (e.g. select/plural today, maybe more some other
    // day), then the result *has* to be a string and those rules would have already set
    // this.parsedFn.  If there was no MessageFormat extension, then there is no requirement to
    // stringify the result and parsedFn isn't set.  We set it here.  While we could have set it
    // unconditionally when exiting the Angular expression, I intend for us to not just replace
    // $interpolate, but also to replace $parse in a future version (so ng-bind can work), and in
    // such a case we do not want to unnecessarily stringify something if it's not going to be used
    // in a string context.
    this.parsedFn = this.$parse(this.expressionFn, this.stringifier);
    this.parsedFn['exp'] = this.expressionFn['exp']; // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
    this.parsedFn['expressions'] = this.expressionFn['expressions']; // Require this to call $compile.$$addBindingInfo() which allows Protractor to find elements by binding.
  }
  this.rule = null;
};

MessageFormatParser.prototype.ruleAngularExpression = function ruleAngularExpression() {
  this.angularOperatorStack = [];
  this.expressionStartIndex = this.index;
  this.rule = this.ruleInAngularExpression;
};

function getEndOperator(opBegin) {
  switch (opBegin) {
    case "{": return "}";
    case "[": return "]";
    case "(": return ")";
    default: return null;
  }
}

function getBeginOperator(opEnd) {
  switch (opEnd) {
    case "}": return "{";
    case "]": return "[";
    case ")": return "(";
    default: return null;
  }
}

// TODO(chirayu): The interpolation endSymbol must also be accounted for. It
// just so happens that "}" is an operator so it's in the list below.  But we
// should support any other type of start/end interpolation symbol.
var INTERESTING_OPERATORS_RE = /[[\]{}()'",]/g;
MessageFormatParser.prototype.ruleInAngularExpression = function ruleInAngularExpression() {
  var startIndex = this.index;
  var match = this.searchRe(INTERESTING_OPERATORS_RE);
  var position;
  if (match == null) {
    if (this.angularOperatorStack.length === 0) {
      // This is the end of the Angular expression so this is actually a
      // success.  Note that when inside an interpolation, this means we even
      // consumed the closing interpolation symbols if they were curlies.  This
      // is NOT an error at this point but will become an error further up the
      // stack when the part that saw the opening curlies is unable to find the
      // closing ones.
      this.index = this.text.length;
      this.expressionFn = this.$parse(this.text.substring(this.expressionStartIndex, this.index));
      // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
      this.expressionFn['exp'] = this.text.substring(this.expressionStartIndex, this.index);
      this.expressionFn['expressions'] = this.expressionFn['expressions'];
      this.rule = null;
      return;
    }
    var innermostOperator = this.angularOperatorStack[0];
    throw $interpolateMinErr('badexpr',
        'Unexpected end of Angular expression.  Expecting operator “{0}” at the end of the text “{1}”',
        this.getEndOperator(innermostOperator), this.text);
  }
  var operator = match[0];
  if (operator == "'" || operator == '"') {
    this.ruleStack.push(this.ruleInAngularExpression);
    this.startStringAtMatch(match);
    return;
  }
  if (operator == ",") {
    if (this.trustedContext) {
      position = indexToLineAndColumn(this.text, this.index);
      throw $interpolateMinErr('unsafe',
          'Use of select/plural MessageFormat syntax is currently disallowed in a secure context ({0}).  At line {1}, column {2} of text “{3}”',
          this.trustedContext, position.line, position.column, this.text);
    }
    // only the top level comma has relevance.
    if (this.angularOperatorStack.length === 0) {
      // todo: does this need to be trimmed?
      this.expressionFn = this.$parse(this.text.substring(this.expressionStartIndex, match.index));
      // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
      this.expressionFn['exp'] = this.text.substring(this.expressionStartIndex, match.index);
      this.expressionFn['expressions'] = this.expressionFn['expressions'];
      this.rule = null;
      this.rule = this.rulePluralOrSelect;
    }
    return;
  }
  if (getEndOperator(operator) != null) {
    this.angularOperatorStack.unshift(operator);
    return;
  }
  var beginOperator = getBeginOperator(operator);
  if (beginOperator == null) {
    this.errorInParseLogic();
  }
  if (this.angularOperatorStack.length > 0) {
    if (beginOperator == this.angularOperatorStack[0]) {
      this.angularOperatorStack.shift();
      return;
    }
    position = indexToLineAndColumn(this.text, this.index);
    throw $interpolateMinErr('badexpr',
        'Unexpected operator “{0}” at line {1}, column {2} in text. Was expecting “{3}”. Text: “{4}”',
        operator, position.line, position.column, getEndOperator(this.angularOperatorStack[0]), this.text);
  }
  // We are trying to pop off the operator stack but there really isn't anything to pop off.
  this.index = match.index;
  this.expressionFn = this.$parse(this.text.substring(this.expressionStartIndex, this.index));
  // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
  this.expressionFn['exp'] = this.text.substring(this.expressionStartIndex, this.index);
  this.expressionFn['expressions'] = this.expressionFn['expressions'];
  this.rule = null;
};
