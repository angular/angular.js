/**
 * @license AngularJS v1.5.5-local+sha.05b6547
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

var $interpolateMinErr = window['angular']['$interpolateMinErr'];

var noop = window['angular']['noop'],
    isFunction = window['angular']['isFunction'],
    toJson = window['angular']['toJson'];

function stringify(value) {
  if (value == null /* null/undefined */) { return ''; }
  switch (typeof value) {
    case 'string':     return value;
    case 'number':     return '' + value;
    default:           return toJson(value);
  }
}

// Convert an index into the string into line/column for use in error messages
// As such, this doesn't have to be efficient.
function indexToLineAndColumn(text, index) {
  var lines = text.split(/\n/g);
  for (var i=0; i < lines.length; i++) {
    var line=lines[i];
    if (index >= line.length) {
      index -= line.length;
    } else {
      return { line: i + 1, column: index + 1 };
    }
  }
}
var PARSE_CACHE_FOR_TEXT_LITERALS = Object.create(null);

function parseTextLiteral(text) {
  var cachedFn = PARSE_CACHE_FOR_TEXT_LITERALS[text];
  if (cachedFn != null) {
    return cachedFn;
  }
  function parsedFn(context) { return text; }
  parsedFn['$$watchDelegate'] = function watchDelegate(scope, listener, objectEquality) {
    var unwatch = scope['$watch'](noop,
        function textLiteralWatcher() {
          if (isFunction(listener)) { listener.call(null, text, text, scope); }
          unwatch();
        },
        objectEquality);
    return unwatch;
  };
  PARSE_CACHE_FOR_TEXT_LITERALS[text] = parsedFn;
  parsedFn['exp'] = text; // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
  parsedFn['expressions'] = []; // Require this to call $compile.$$addBindingInfo() which allows Protractor to find elements by binding.
  return parsedFn;
}

function subtractOffset(expressionFn, offset) {
  if (offset === 0) {
    return expressionFn;
  }
  function minusOffset(value) {
    return (value == void 0) ? value : value - offset;
  }
  function parsedFn(context) { return minusOffset(expressionFn(context)); }
  var unwatch;
  parsedFn['$$watchDelegate'] = function watchDelegate(scope, listener, objectEquality) {
    unwatch = scope['$watch'](expressionFn,
        function pluralExpressionWatchListener(newValue, oldValue) {
          if (isFunction(listener)) { listener.call(null, minusOffset(newValue), minusOffset(oldValue), scope); }
        },
        objectEquality);
    return unwatch;
  };
  return parsedFn;
}

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: false */
/* global isFunction: false */
/* global noop: false */

/**
 * @constructor
 * @private
 */
function MessageSelectorBase(expressionFn, choices) {
  var self = this;
  this.expressionFn = expressionFn;
  this.choices = choices;
  if (choices["other"] === void 0) {
    throw $interpolateMinErr('reqother', '“other” is a required option.');
  }
  this.parsedFn = function(context) { return self.getResult(context); };
  this.parsedFn['$$watchDelegate'] = function $$watchDelegate(scope, listener, objectEquality) {
    return self.watchDelegate(scope, listener, objectEquality);
  };
  this.parsedFn['exp'] = expressionFn['exp'];
  this.parsedFn['expressions'] = expressionFn['expressions'];
}

MessageSelectorBase.prototype.getMessageFn = function getMessageFn(value) {
  return this.choices[this.categorizeValue(value)];
};

MessageSelectorBase.prototype.getResult = function getResult(context) {
  return this.getMessageFn(this.expressionFn(context))(context);
};

MessageSelectorBase.prototype.watchDelegate = function watchDelegate(scope, listener, objectEquality) {
  var watchers = new MessageSelectorWatchers(this, scope, listener, objectEquality);
  return function() { watchers.cancelWatch(); };
};

/**
 * @constructor
 * @private
 */
function MessageSelectorWatchers(msgSelector, scope, listener, objectEquality) {
  var self = this;
  this.scope = scope;
  this.msgSelector = msgSelector;
  this.listener = listener;
  this.objectEquality = objectEquality;
  this.lastMessage = void 0;
  this.messageFnWatcher = noop;
  var expressionFnListener = function(newValue, oldValue) { return self.expressionFnListener(newValue, oldValue); };
  this.expressionFnWatcher = scope['$watch'](msgSelector.expressionFn, expressionFnListener, objectEquality);
}

MessageSelectorWatchers.prototype.expressionFnListener = function expressionFnListener(newValue, oldValue) {
  var self = this;
  this.messageFnWatcher();
  var messageFnListener = function(newMessage, oldMessage) { return self.messageFnListener(newMessage, oldMessage); };
  var messageFn = this.msgSelector.getMessageFn(newValue);
  this.messageFnWatcher = this.scope['$watch'](messageFn, messageFnListener, this.objectEquality);
};

MessageSelectorWatchers.prototype.messageFnListener = function messageFnListener(newMessage, oldMessage) {
  if (isFunction(this.listener)) {
    this.listener.call(null, newMessage, newMessage === oldMessage ? newMessage : this.lastMessage, this.scope);
  }
  this.lastMessage = newMessage;
};

MessageSelectorWatchers.prototype.cancelWatch = function cancelWatch() {
  this.expressionFnWatcher();
  this.messageFnWatcher();
};

/**
 * @constructor
 * @extends MessageSelectorBase
 * @private
 */
function SelectMessage(expressionFn, choices) {
  MessageSelectorBase.call(this, expressionFn, choices);
}

function SelectMessageProto() {}
SelectMessageProto.prototype = MessageSelectorBase.prototype;

SelectMessage.prototype = new SelectMessageProto();
SelectMessage.prototype.categorizeValue = function categorizeSelectValue(value) {
  return (this.choices[value] !== void 0) ? value : "other";
};

/**
 * @constructor
 * @extends MessageSelectorBase
 * @private
 */
function PluralMessage(expressionFn, choices, offset, pluralCat) {
  MessageSelectorBase.call(this, expressionFn, choices);
  this.offset = offset;
  this.pluralCat = pluralCat;
}

function PluralMessageProto() {}
PluralMessageProto.prototype = MessageSelectorBase.prototype;

PluralMessage.prototype = new PluralMessageProto();
PluralMessage.prototype.categorizeValue = function categorizePluralValue(value) {
  if (isNaN(value)) {
    return "other";
  } else if (this.choices[value] !== void 0) {
    return value;
  } else {
    var category = this.pluralCat(value - this.offset);
    return (this.choices[category] !== void 0) ? category : "other";
  }
};

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: false */
/* global isFunction: false */
/* global parseTextLiteral: false */

/**
 * @constructor
 * @private
 */
function InterpolationParts(trustedContext, allOrNothing) {
  this.trustedContext = trustedContext;
  this.allOrNothing = allOrNothing;
  this.textParts = [];
  this.expressionFns = [];
  this.expressionIndices = [];
  this.partialText = '';
  this.concatParts = null;
}

InterpolationParts.prototype.flushPartialText = function flushPartialText() {
  if (this.partialText) {
    if (this.concatParts == null) {
      this.textParts.push(this.partialText);
    } else {
      this.textParts.push(this.concatParts.join(''));
      this.concatParts = null;
    }
    this.partialText = '';
  }
};

InterpolationParts.prototype.addText = function addText(text) {
  if (text.length) {
    if (!this.partialText) {
      this.partialText = text;
    } else if (this.concatParts) {
      this.concatParts.push(text);
    } else {
      this.concatParts = [this.partialText, text];
    }
  }
};

InterpolationParts.prototype.addExpressionFn = function addExpressionFn(expressionFn) {
  this.flushPartialText();
  this.expressionIndices.push(this.textParts.length);
  this.expressionFns.push(expressionFn);
  this.textParts.push('');
};

InterpolationParts.prototype.getExpressionValues = function getExpressionValues(context) {
  var expressionValues = new Array(this.expressionFns.length);
  for (var i = 0; i < this.expressionFns.length; i++) {
    expressionValues[i] = this.expressionFns[i](context);
  }
  return expressionValues;
};

InterpolationParts.prototype.getResult = function getResult(expressionValues) {
  for (var i = 0; i < this.expressionIndices.length; i++) {
    var expressionValue = expressionValues[i];
    if (this.allOrNothing && expressionValue === void 0) return;
    this.textParts[this.expressionIndices[i]] = expressionValue;
  }
  return this.textParts.join('');
};


InterpolationParts.prototype.toParsedFn = function toParsedFn(mustHaveExpression, originalText) {
  var self = this;
  this.flushPartialText();
  if (mustHaveExpression && this.expressionFns.length === 0) {
    return void 0;
  }
  if (this.textParts.length === 0) {
    return parseTextLiteral('');
  }
  if (this.trustedContext && this.textParts.length > 1) {
    $interpolateMinErr['throwNoconcat'](originalText);
  }
  if (this.expressionFns.length === 0) {
    if (this.textParts.length != 1) { this.errorInParseLogic(); }
    return parseTextLiteral(this.textParts[0]);
  }
  var parsedFn = function(context) {
    return self.getResult(self.getExpressionValues(context));
  };
  parsedFn['$$watchDelegate'] = function $$watchDelegate(scope, listener, objectEquality) {
    return self.watchDelegate(scope, listener, objectEquality);
  };

  parsedFn['exp'] = originalText; // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
  parsedFn['expressions'] = new Array(this.expressionFns.length); // Require this to call $compile.$$addBindingInfo() which allows Protractor to find elements by binding.
  for (var i = 0; i < this.expressionFns.length; i++) {
    parsedFn['expressions'][i] = this.expressionFns[i]['exp'];
  }

  return parsedFn;
};

InterpolationParts.prototype.watchDelegate = function watchDelegate(scope, listener, objectEquality) {
  var watcher = new InterpolationPartsWatcher(this, scope, listener, objectEquality);
  return function() { watcher.cancelWatch(); };
};

function InterpolationPartsWatcher(interpolationParts, scope, listener, objectEquality) {
  this.interpolationParts = interpolationParts;
  this.scope = scope;
  this.previousResult = (void 0);
  this.listener = listener;
  var self = this;
  this.expressionFnsWatcher = scope['$watchGroup'](interpolationParts.expressionFns, function(newExpressionValues, oldExpressionValues) {
    self.watchListener(newExpressionValues, oldExpressionValues);
  });
}

InterpolationPartsWatcher.prototype.watchListener = function watchListener(newExpressionValues, oldExpressionValues) {
  var result = this.interpolationParts.getResult(newExpressionValues);
  if (isFunction(this.listener)) {
    this.listener.call(null, result, newExpressionValues === oldExpressionValues ? result : this.previousResult, this.scope);
  }
  this.previousResult = result;
};

InterpolationPartsWatcher.prototype.cancelWatch = function cancelWatch() {
  this.expressionFnsWatcher();
};

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

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: false */
/* global MessageFormatParser: false */
/* global stringify: false */

/**
 * @ngdoc service
 * @name $$messageFormat
 *
 * @description
 * Angular internal service to recognize MessageFormat extensions in interpolation expressions.
 * For more information, see:
 * https://docs.google.com/a/google.com/document/d/1pbtW2yvtmFBikfRrJd8VAsabiFkKezmYZ_PbgdjQOVU/edit
 *
 * ## Example
 *
 * <example name="ngMessageFormat-example" module="msgFmtExample" deps="angular-message-format.min.js">
 * <file name="index.html">
 *   <div ng-controller="AppController">
 *     <button ng-click="decreaseRecipients()" id="decreaseRecipients">decreaseRecipients</button><br>
 *     <span>{{recipients.length, plural, offset:1
 *             =0    {{{sender.name}} gave no gifts (\#=#)}
 *             =1    {{{sender.name}} gave one gift to {{recipients[0].name}} (\#=#)}
 *             one   {{{sender.name}} gave {{recipients[0].name}} and one other person a gift (\#=#)}
 *             other {{{sender.name}} gave {{recipients[0].name}} and # other people a gift (\#=#)}
 *           }}</span>
 *   </div>
 * </file>
 *
 * <file name="script.js">
 *   function Person(name, gender) {
 *     this.name = name;
 *     this.gender = gender;
 *   }
 *
 *   var alice   = new Person("Alice", "female"),
 *       bob     = new Person("Bob", "male"),
 *       charlie = new Person("Charlie", "male"),
 *       harry   = new Person("Harry Potter", "male");
 *
 *   angular.module('msgFmtExample', ['ngMessageFormat'])
 *     .controller('AppController', ['$scope', function($scope) {
 *         $scope.recipients = [alice, bob, charlie];
 *         $scope.sender = harry;
 *         $scope.decreaseRecipients = function() {
 *           --$scope.recipients.length;
 *         };
 *       }]);
 * </file>
 *
 * <file name="protractor.js" type="protractor">
 *   describe('MessageFormat plural', function() {
 *     it('should pluralize initial values', function() {
 *       var messageElem = element(by.binding('recipients.length')), decreaseRecipientsBtn = element(by.id('decreaseRecipients'));
 *       expect(messageElem.getText()).toEqual('Harry Potter gave Alice and 2 other people a gift (#=2)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave Alice and one other person a gift (#=1)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave one gift to Alice (#=0)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave no gifts (#=-1)');
 *     });
 *   });
 * </file>
 * </example>
 */
var $$MessageFormatFactory = ['$parse', '$locale', '$sce', '$exceptionHandler', function $$messageFormat(
                   $parse,   $locale,   $sce,   $exceptionHandler) {

  function getStringifier(trustedContext, allOrNothing, text) {
    return function stringifier(value) {
      try {
        value = trustedContext ? $sce['getTrusted'](trustedContext, value) : $sce['valueOf'](value);
        return allOrNothing && (value === void 0) ? value : stringify(value);
      } catch (err) {
        $exceptionHandler($interpolateMinErr['interr'](text, err));
      }
    };
  }

  function interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
    var stringifier = getStringifier(trustedContext, allOrNothing, text);
    var parser = new MessageFormatParser(text, 0, $parse, $locale['pluralCat'], stringifier,
                                         mustHaveExpression, trustedContext, allOrNothing);
    parser.run(parser.ruleInterpolate);
    return parser.parsedFn;
  }

  return {
    'interpolate': interpolate
  };
}];

var $$interpolateDecorator = ['$$messageFormat', '$delegate', function $$interpolateDecorator($$messageFormat, $interpolate) {
  if ($interpolate['startSymbol']() != "{{" || $interpolate['endSymbol']() != "}}") {
    throw $interpolateMinErr('nochgmustache', 'angular-message-format.js currently does not allow you to use custom start and end symbols for interpolation.');
  }
  var interpolate = $$messageFormat['interpolate'];
  interpolate['startSymbol'] = $interpolate['startSymbol'];
  interpolate['endSymbol'] = $interpolate['endSymbol'];
  return interpolate;
}];


/**
 * @ngdoc module
 * @name ngMessageFormat
 * @packageName angular-message-format
 * @description
 */
var module = window['angular']['module']('ngMessageFormat', ['ng']);
module['factory']('$$messageFormat', $$MessageFormatFactory);
module['config'](['$provide', function($provide) {
  $provide['decorator']('$interpolate', $$interpolateDecorator);
}]);


})(window, window.angular);
