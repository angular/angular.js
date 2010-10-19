/**
 * Setup file for the Scenario.
 * Must be first in the compilation/bootstrap list.
 */

// Public namespace
angular.scenario = {};

// Namespace for the UI
angular.scenario.ui = {};

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
angular.scenario.dsl = function(name, fn) {
  angular.scenario.dsl[name] = function() {
    function executeStatement(statement, args) {
      var result = statement.apply(this, args);
      if (angular.isFunction(result) || result instanceof angular.scenario.Future)
        return result;
      var self = this;
      var chain = angular.extend({}, result);
      angular.foreach(chain, function(value, name) {
        if (angular.isFunction(value)) {
          chain[name] = angular.bind(self, function() {
            return executeStatement.call(self, value, arguments);
          });
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
angular.scenario.matcher = function(name, fn) {
  angular.scenario.matcher[name] = function(expected) {
    var prefix = 'expect ' + this.future.name + ' ';
    if (this.inverse) {
      prefix += 'not ';
    }
    this.addFuture(prefix + name + ' ' + angular.toJson(expected),
      angular.bind(this, function(done) {
        this.actual = this.future.value;
        if ((this.inverse && fn.call(this, expected)) ||
            (!this.inverse && !fn.call(this, expected))) {
          this.error = 'expected ' + angular.toJson(expected) +
            ' but was ' + angular.toJson(this.actual);
        }
        done(this.error);
      })
    );
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
  function loop(error) {
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


function browserTrigger(element, type) {
  if (!element.nodeName) element = element[0];
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
    element.fireEvent('on' + type);
  } else {
    var evnt = document.createEvent('MouseEvents');
    evnt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
    element.dispatchEvent(evnt);
  }
}

_jQuery.fn.trigger = function(type) {
  return this.each(function(index, node) {
    browserTrigger(node, type);
  });
};


