'use strict';

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

  parsedFn.exp = originalText; // Needed to pretend to be $interpolate for tests copied from interpolateSpec.js
  parsedFn.expressions = new Array(this.expressionFns.length); // Require this to call $compile.$$addBindingInfo() which allows Protractor to find elements by binding.
  for (var i = 0; i < this.expressionFns.length; i++) {
    parsedFn.expressions[i] = this.expressionFns[i].exp;
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
