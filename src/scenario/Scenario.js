
/**
 * Setup file for the Scenario.
 * Must be first in the compilation/bootstrap list.
 */

// Public namespace
angular.scenario = angular.scenario || {};

/**
 * Defines a new output format.
 *
 * @param {string} name the name of the new output format
 * @param {Function} fn function(context, runner) that generates the output
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
 * @param {Function} fn Factory function(), return a function for
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
 * @param {Function} fn The matching function(expected).
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
 * Initialization function for the scenario runner.
 *
 * @param {angular.scenario.Runner} $scenario The runner to setup
 * @param {Object} config Config options
 */
function angularScenarioInit($scenario, config) {
  var href = window.location.href;
  var body = _jQuery(document.body);
  var output = [];

  if (config.scenario_output) {
    output = config.scenario_output.split(',');
  }

  angular.forEach(angular.scenario.output, function(fn, name) {
    if (!output.length || indexOf(output,name) != -1) {
      var context = body.append('<div></div>').find('div:last');
      context.attr('id', name);
      fn.call({}, context, $scenario);
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

  $scenario.on('RunnerEnd', function() {
    appFrame.css('display', 'none');
    appFrame.find('iframe').attr('src', 'about:blank');
  });

  $scenario.on('RunnerError', function(error) {
    if (window.console) {
      console.log(formatException(error));
    } else {
      // Do something for IE
      alert(error);
    }
  });

  $scenario.run(application);
}

/**
 * Iterates through list with iterator function that must call the
 * continueFunction to continute iterating.
 *
 * @param {Array} list list to iterate over
 * @param {Function} iterator Callback function(value, continueFunction)
 * @param {Function} done Callback function(error, result) called when
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
 * @param {Number} maxStackLines Optional. max lines of the stack trace to include
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
 * @param {string} Optional event type.
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
  if (lowercase(nodeName_(element)) == 'option') {
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
    }
    // WTF!!! Error: Unspecified error.
    // Don't know why, but some elements when detached seem to be in inconsistent state and
    // calling .fireEvent() on them will result in very unhelpful error (Error: Unspecified error)
    // forcing the browser to compute the element position (by reading its CSS)
    // puts the element in consistent state.
    element.style.posLeft;
    element.fireEvent('on' + type);
    if (lowercase(element.type) == 'submit') {
      while(element) {
        if (lowercase(element.nodeName) == 'form') {
          element.fireEvent('onsubmit');
          break;
        }
        element = element.parentNode;
      }
    }
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
    if (/(click|change|keydown)/.test(type)) {
      return this.each(function(index, node) {
        browserTrigger(node, type);
      });
    }
    return parentTrigger.apply(this, arguments);
  };
})(_jQuery.fn);

/**
 * Finds all bindings with the substring match of name and returns an
 * array of their values.
 *
 * @param {string} name The name to match
 * @return {Array.<string>} String of binding values
 */
_jQuery.fn.bindings = function(name) {
  function contains(text, value) {
    return value instanceof RegExp
      ? value.test(text)
      : text && text.indexOf(value) >= 0;
  }
  var result = [];
  this.find('.ng-binding:visible').each(function() {
    var element = new _jQuery(this);
    if (!angular.isDefined(name) ||
      contains(element.attr('ng:bind'), name) ||
      contains(element.attr('ng:bind-template'), name)) {
      if (element.is('input, textarea')) {
        result.push(element.val());
      } else {
        result.push(element.html());
      }
    }
  });
  return result;
};
