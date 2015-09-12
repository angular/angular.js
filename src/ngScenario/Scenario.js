'use strict';


/**
 * Setup file for the Scenario.
 * Must be first in the compilation/bootstrap list.
 */

// Public namespace
angular.scenario = angular.scenario || {};

/**
 * Expose jQuery (e.g. for custom dsl extensions).
 */
angular.scenario.jQuery = _jQuery;

/**
 * Defines a new output format.
 *
 * @param {string} name the name of the new output format
 * @param {function()} fn function(context, runner) that generates the output
 */
angular.scenario.output = angular.scenario.output || function(name, fn) {
  angular.scenario.output[name] = fn;
};

/**
 * Defines a new DSL statement. If your factory function returns a Future
 * it's returned, otherwise the result is assumed to be a map of functions
 * for chaining. Chained functions are subject to the same rules.
 *
 * Note: All functions on the chain are bound to the chain scope so values
 *   set on "this" in your statement function are available in the chained
 *   functions.
 *
 * @param {string} name The name of the statement
 * @param {function()} fn Factory function(), return a function for
 *  the statement.
 */
angular.scenario.dsl = angular.scenario.dsl || function(name, fn) {
  angular.scenario.dsl[name] = function() {
    /* jshint -W040 *//* The dsl binds `this` for us when calling chained functions */
    function executeStatement(statement, args) {
      var result = statement.apply(this, args);
      if (angular.isFunction(result) || result instanceof angular.scenario.Future) {
        return result;
      }
      var self = this;
      var chain = angular.extend({}, result);
      angular.forEach(chain, function(value, name) {
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
 * @param {string} name The name of the matcher
 * @param {function()} fn The matching function(expected).
 */
angular.scenario.matcher = angular.scenario.matcher || function(name, fn) {
  angular.scenario.matcher[name] = function(expected) {
    var description = this.future.name +
                      (this.inverse ? ' not ' : ' ') + name +
                      ' ' + angular.toJson(expected);
    var self = this;
    this.addFuture('expect ' + description,
      function(done) {
        var error;
        self.actual = self.future.value;
        if ((self.inverse && fn.call(self, expected)) ||
            (!self.inverse && !fn.call(self, expected))) {
          error = 'expected ' + description +
            ' but was ' + angular.toJson(self.actual);
        }
        done(error);
    });
  };
};

/**
 * Initialize the scenario runner and run !
 *
 * Access global window and document object
 * Access $runner through closure
 *
 * @param {Object=} config Config options
 */
angular.scenario.setUpAndRun = function(config) {
  var href = window.location.href;
  var body = _jQuery(document.body);
  var output = [];
  var objModel = new angular.scenario.ObjectModel($runner);

  if (config && config.scenario_output) {
    output = config.scenario_output.split(',');
  }

  angular.forEach(angular.scenario.output, function(fn, name) {
    if (!output.length || output.indexOf(name) != -1) {
      var context = body.append('<div></div>').find('div:last');
      context.attr('id', name);
      fn.call({}, context, $runner, objModel);
    }
  });

  if (!/^http/.test(href) && !/^https/.test(href)) {
    body.append('<p id="system-error"></p>');
    body.find('#system-error').text(
      'Scenario runner must be run using http or https. The protocol ' +
      href.split(':')[0] + ':// is not supported.'
    );
    return;
  }

  var appFrame = body.append('<div id="application"></div>').find('#application');
  var application = new angular.scenario.Application(appFrame);

  $runner.on('RunnerEnd', function() {
    appFrame.css('display', 'none');
    appFrame.find('iframe').attr('src', 'about:blank');
  });

  $runner.on('RunnerError', function(error) {
    if (window.console) {
      console.log(formatException(error));
    } else {
      // Do something for IE
      alert(error);
    }
  });

  $runner.run(application);
};

/**
 * Iterates through list with iterator function that must call the
 * continueFunction to continue iterating.
 *
 * @param {Array} list list to iterate over
 * @param {function()} iterator Callback function(value, continueFunction)
 * @param {function()} done Callback function(error, result) called when
 *   iteration finishes or an error occurs.
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
 * @param {Object} error The exception to format, can be anything throwable
 * @param {Number=} [maxStackLines=5] max lines of the stack trace to include
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
 *
 * @param {Number} offset Number of stack lines to skip
 */
function callerFile(offset) {
  var error = new Error();

  return function() {
    var line = (error.stack || '').split('\n')[offset];

    // Clean up the stack trace line
    if (line) {
      if (line.indexOf('@') !== -1) {
        // Firefox
        line = line.substring(line.indexOf('@') + 1);
      } else {
        // Chrome
        line = line.substring(line.indexOf('(') + 1).replace(')', '');
      }
    }

    return line || '';
  };
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
(function(fn) {
  // We need a handle to the original trigger function for input tests.
  var parentTrigger = fn._originalTrigger = fn.trigger;
  fn.trigger = function(type) {
    if (/(click|change|keydown|blur|input|mousedown|mouseup)/.test(type)) {
      var processDefaults = [];
      this.each(function(index, node) {
        processDefaults.push(browserTrigger(node, type));
      });

      // this is not compatible with jQuery - we return an array of returned values,
      // so that scenario runner know whether JS code has preventDefault() of the event or not...
      return processDefaults;
    }
    return parentTrigger.apply(this, arguments);
  };
})(_jQuery.fn);

/**
 * Finds all bindings with the substring match of name and returns an
 * array of their values.
 *
 * @param {string} bindExp The name to match
 * @return {Array.<string>} String of binding values
 */
_jQuery.fn.bindings = function(windowJquery, bindExp) {
  var result = [], match,
      bindSelector = '.ng-binding:visible';
  if (angular.isString(bindExp)) {
    bindExp = bindExp.replace(/\s/g, '');
    match = function(actualExp) {
      if (actualExp) {
        actualExp = actualExp.replace(/\s/g, '');
        if (actualExp == bindExp) return true;
        if (actualExp.indexOf(bindExp) === 0) {
          return actualExp.charAt(bindExp.length) == '|';
        }
      }
    };
  } else if (bindExp) {
    match = function(actualExp) {
      return actualExp && bindExp.exec(actualExp);
    };
  } else {
    match = function(actualExp) {
      return !!actualExp;
    };
  }
  var selection = this.find(bindSelector);
  if (this.is(bindSelector)) {
    selection = selection.add(this);
  }

  function push(value) {
    if (angular.isUndefined(value)) {
      value = '';
    } else if (typeof value !== 'string') {
      value = angular.toJson(value);
    }
    result.push('' + value);
  }

  selection.each(function() {
    var element = windowJquery(this),
        bindings;
    if (bindings = element.data('$binding')) {
      for (var expressions = [], binding, j=0, jj=bindings.length; j < jj; j++) {
        binding = bindings[j];

        if (binding.expressions) {
          expressions = binding.expressions;
        } else {
          expressions = [binding];
        }
        for (var scope, expression, i = 0, ii = expressions.length; i < ii; i++) {
          expression = expressions[i];
          if (match(expression)) {
            scope = scope || element.scope();
            push(scope.$eval(expression));
          }
        }
      }
    }
  });
  return result;
};
