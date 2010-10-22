/**
 * Setup file for the Scenario.
 * Must be first in the compilation/bootstrap list.
 */

// Public namespace
angular.scenario = angular.scenario || {};

// Namespace for the UI
angular.scenario.ui = angular.scenario.ui || {};

/**
 * Defines a new DSL statement. If your factory function returns a Future
 * it's returned, otherwise the result is assumed to be a map of functions
 * for chaining. Chained functions are subject to the same rules.
 *
 * Note: All functions on the chain are bound to the chain scope so values
 *   set on "this" in your statement function are available in the chained
 *   functions.
 *
 * @param {String} The name of the statement
 * @param {Function} Factory function(application), return a function for
 *  the statement.
 */
angular.scenario.dsl = angular.scenario.dsl || function(name, fn) {
  angular.scenario.dsl[name] = function() {
    function executeStatement(statement, args) {
      var result = statement.apply(this, args);
      if (angular.isFunction(result) || result instanceof angular.scenario.Future)
        return result;
      var self = this;
      var chain = angular.extend({}, result);
      angular.foreach(chain, function(value, name) {
        if (angular.isFunction(value)) {
          chain[name] = function() {
            return executeStatement.call(self, value, arguments);
          };
        } else {
          chain[name] = value;
        }
      });
      return chain;
    }
    var statement = fn.apply(this, arguments);
    return function() {
      return executeStatement.call(this, statement, arguments);
    };
  };
};

/**
 * Defines a new matcher for use with the expects() statement. The value
 * this.actual (like in Jasmine) is available in your matcher to compare
 * against. Your function should return a boolean. The future is automatically
 * created for you.
 *
 * @param {String} The name of the matcher
 * @param {Function} The matching function(expected).
 */
angular.scenario.matcher = angular.scenario.matcher || function(name, fn) {
  angular.scenario.matcher[name] = function(expected) {
    var prefix = 'expect ' + this.future.name + ' ';
    if (this.inverse) {
      prefix += 'not ';
    }
    var self = this;
    this.addFuture(prefix + name + ' ' + angular.toJson(expected),
      function(done) {
        var error;
        self.actual = self.future.value;
        if ((self.inverse && fn.call(self, expected)) ||
            (!self.inverse && !fn.call(self, expected))) {
          error = 'expected ' + angular.toJson(expected) +
            ' but was ' + angular.toJson(self.actual);
        }
        done(error);
    });
  };
};

/**
 * Iterates through list with iterator function that must call the
 * continueFunction to continute iterating.
 *
 * @param {Array} list to iterate over
 * @param {Function} Callback function(value, continueFunction)
 * @param {Function} Callback function(error, result) called when iteration
 *   finishes or an error occurs.
 */
function asyncForEach(list, iterator, done) {
  var i = 0;
  function loop(error, index) {
    if (index && index > i) {
      i = index;
    }
    if (error || i >= list.length) {
      done(error);
    } else {
      try {
        iterator(list[i++], loop);
      } catch (e) {
        done(e);
      }
    }
  }
  loop();
}

/**
 * Formats an exception into a string with the stack trace, but limits
 * to a specific line length.
 *
 * @param {Object} the exception to format, can be anything throwable
 * @param {Number} Optional. max lines of the stack trace to include
 *  default is 5.
 */
function formatException(error, maxStackLines) {
  maxStackLines = maxStackLines || 5;
  var message = error.toString();
  if (error.stack) {
    var stack = error.stack.split('\n');
    if (stack[0].indexOf(message) === -1) {
      maxStackLines++;
      stack.unshift(error.message);
    }
    message = stack.slice(0, maxStackLines).join('\n');
  }
  return message;
}

/**
 * Returns a function that gets the file name and line number from a
 * location in the stack if available based on the call site.
 *
 * Note: this returns another function because accessing .stack is very
 * expensive in Chrome.
 */
function callerFile(offset) {
  var error = new Error();

  return function() {
    var line = (error.stack || '').split('\n')[offset];

    // Clean up the stack trace line
    if (line) {
      if (line.indexOf('@') !== -1) {
        // Firefox
        line = line.substring(line.indexOf('@')+1);
      } else {
        // Chrome
        line = line.substring(line.indexOf('(')+1).replace(')', '');
      }
    }

    return line || '';
  };
}

/**
 * Triggers a browser event. Attempts to choose the right event if one is
 * not specified.
 *
 * @param {Object} Either a wrapped jQuery/jqLite node or a DOMElement
 * @param {String} Optional event type.
 */
function browserTrigger(element, type) {
  if (element && !element.nodeName) element = element[0];
  if (!element) return;
  if (!type) {
    type = {
        'text':            'change',
        'textarea':        'change',
        'hidden':          'change',
        'password':        'change',
        'button':          'click',
        'submit':          'click',
        'reset':           'click',
        'image':           'click',
        'checkbox':        'click',
        'radio':           'click',
        'select-one':      'change',
        'select-multiple': 'change'
    }[element.type] || 'click';
  }
  if (lowercase(nodeName(element)) == 'option') {
    element.parentNode.value = element.value;
    element = element.parentNode;
    type = 'change';
  }
  if (msie) {
    switch(element.type) {
      case 'radio':
      case 'checkbox':
        element.checked = !element.checked;
        break;
      case 'text':
      case 'textarea':
      case 'password':
        // TODO: FIX THIS HACK
        // for some reason on IE 'change' event does not fire in
        // jQuery but keyup does. So we are hacking it!
        type = 'keyup';
    }
    element.fireEvent('on' + type);
  } else {
    var evnt = document.createEvent('MouseEvents');
    evnt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
    element.dispatchEvent(evnt);
  }
}

/**
 * Don't use the jQuery trigger method since it works incorrectly.
 *
 * jQuery notifies listeners and then changes the state of a checkbox and
 * does not create a real browser event. A real click changes the state of
 * the checkbox and then notifies listeners.
 *
 * To work around this we instead use our own handler that fires a real event.
 */
(function(fn){
  var parentTrigger = fn.trigger;
  fn.trigger = function(type) {
    if (/(click|change|keyup)/.test(type)) {
      return this.each(function(index, node) {
        browserTrigger(node, type);
      });
    }
    return parentTrigger.apply(this, arguments);
  };
})(_jQuery.fn);
