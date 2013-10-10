beforeEach(function() {

  function cssMatcher(presentClasses, absentClasses) {
    return function() {
      var element = angular.element(this.actual);
      var present = true;
      var absent = false;

      angular.forEach(presentClasses.split(' '), function(className){
        present = present && element.hasClass(className);
      });

      angular.forEach(absentClasses.split(' '), function(className){
        absent = absent || element.hasClass(className);
      });

      this.message = function() {
        return "Expected to have " + presentClasses +
          (absentClasses ? (" and not have " + absentClasses + "" ) : "") +
          " but had " + element[0].className + ".";
      };
      return present && !absent;
    };
  }

  function indexOf(array, obj) {
    for ( var i = 0; i < array.length; i++) {
      if (obj === array[i]) return i;
    }
    return -1;
  }

  function isNgElementHidden(element) {
    // we need to check element.getAttribute for SVG nodes
    var hidden = true;
    forEach(angular.element(element), function (element) {
      if ((' ' +(element.getAttribute('class') || '') + ' ').indexOf(' ng-hide ') === -1) {
        hidden = false;
      }
    });
    return hidden;
  };

  this.addMatchers({
    toBeInvalid: cssMatcher('ng-invalid', 'ng-valid'),
    toBeValid: cssMatcher('ng-valid', 'ng-invalid'),
    toBeDirty: cssMatcher('ng-dirty', 'ng-pristine'),
    toBePristine: cssMatcher('ng-pristine', 'ng-dirty'),
    toBeShown: function() {
      this.message = valueFn(
          "Expected element " + (this.isNot ? "": "not ") + "to have 'ng-hide' class");
      return !isNgElementHidden(this.actual);
    },
    toBeHidden: function() {
      this.message = valueFn(
          "Expected element " + (this.isNot ? "not ": "") + "to have 'ng-hide' class");
      return isNgElementHidden(this.actual);
    },

    toEqual: function(expected) {
      if (this.actual && this.actual.$$log) {
        this.actual = (typeof expected === 'string')
            ? this.actual.toString()
            : this.actual.toArray();
      }
      return jasmine.Matchers.prototype.toEqual.call(this, expected);
    },

    toEqualData: function(expected) {
      return angular.equals(this.actual, expected);
    },

    toEqualError: function(message) {
      this.message = function() {
        var expected;
        if (this.actual.message && this.actual.name == 'Error') {
          expected = angular.toJson(this.actual.message);
        } else {
          expected = angular.toJson(this.actual);
        }
        return "Expected " + expected + " to be an Error with message " + angular.toJson(message);
      };
      return this.actual.name == 'Error' && this.actual.message == message;
    },

    toMatchError: function(messageRegexp) {
      this.message = function() {
        var expected;
        if (this.actual.message && this.actual.name == 'Error') {
          expected = angular.toJson(this.actual.message);
        } else {
          expected = angular.toJson(this.actual);
        }
        return "Expected " + expected + " to match an Error with message " + angular.toJson(messageRegexp);
      };
      return this.actual.name == 'Error' && messageRegexp.test(this.actual.message);
    },

    toHaveBeenCalledOnce: function() {
      if (arguments.length > 0) {
        throw new Error('toHaveBeenCalledOnce does not take arguments, use toHaveBeenCalledWith');
      }

      if (!jasmine.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
      }

      this.message = function() {
        var msg = 'Expected spy ' + this.actual.identity + ' to have been called once, but was ',
            count = this.actual.callCount;
        return [
          count === 0 ? msg + 'never called.' :
                        msg + 'called ' + count + ' times.',
          msg.replace('to have', 'not to have') + 'called once.'
        ];
      };

      return this.actual.callCount == 1;
    },


    toHaveBeenCalledOnceWith: function() {
      var expectedArgs = jasmine.util.argsToArray(arguments);

      if (!jasmine.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
      }

      this.message = function() {
        if (this.actual.callCount != 1) {
          if (this.actual.callCount == 0) {
            return [
              'Expected spy ' + this.actual.identity + ' to have been called once with ' +
                jasmine.pp(expectedArgs) + ' but it was never called.',
              'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                jasmine.pp(expectedArgs) + ' but it was.'
            ];
          }

          return [
            'Expected spy ' + this.actual.identity + ' to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but it was called ' + this.actual.callCount + ' times.',
            'Expected spy ' + this.actual.identity + ' not to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but it was.'
          ];
        } else {
          return [
            'Expected spy ' + this.actual.identity + ' to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall),
            'Expected spy ' + this.actual.identity + ' not to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall)
          ];
        }
      };

      return this.actual.callCount === 1 && this.env.contains_(this.actual.argsForCall, expectedArgs);
    },


    toBeOneOf: function() {
      return indexOf(arguments, this.actual) !== -1;
    },

    toHaveClass: function(clazz) {
      this.message = function() {
        return "Expected '" + angular.mock.dump(this.actual) + "' to have class '" + clazz + "'.";
      };
      return this.actual.hasClass ?
              this.actual.hasClass(clazz) :
              angular.element(this.actual).hasClass(clazz);
    },

    toThrowMatching: function(expected) {
      return jasmine.Matchers.prototype.toThrow.call(this, expected);
    },

    toThrowMinErr: function(namespace, code, content) {
      var result,
        exception,
        exceptionMessage = '',
        escapeRegexp = function (str) {
          // This function escapes all special regex characters.
          // We use it to create matching regex from arbitrary strings.
          // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        codeRegex = new RegExp('^\\[' + escapeRegexp(namespace) + ':' + escapeRegexp(code) + '\\]'),
        not = this.isNot ? "not " : "",
        regex = jasmine.isA_("RegExp", content) ? content :
                  angular.isDefined(content) ? new RegExp(escapeRegexp(content)) : undefined;

      if(!angular.isFunction(this.actual)) {
        throw new Error('Actual is not a function');
      }

      try {
        this.actual();
      } catch (e) {
        exception = e;
      }

      if (exception) {
        exceptionMessage = exception.message || exception;
      }

      this.message = function () {
        return "Expected function " + not + "to throw " +
          namespace + "MinErr('" + code + "')" +
          (regex ? " matching " + regex.toString() : "") +
          (exception ? ", but it threw " + exceptionMessage : ".");
      };

      result = codeRegex.test(exceptionMessage);
      if (!result) {
        return result;
      }

      if (angular.isDefined(regex)) {
        return regex.test(exceptionMessage);
      }
      return result;
    }
  });
});


// TODO(vojta): remove this once Jasmine in Karma gets updated
// https://github.com/pivotal/jasmine/blob/c40b64a24c607596fa7488f2a0ddb98d063c872a/src/core/Matchers.js#L217-L246
// This toThrow supports RegExps.
jasmine.Matchers.prototype.toThrow = function(expected) {
  var result = false;
  var exception, exceptionMessage;
  if (typeof this.actual != 'function') {
    throw new Error('Actual is not a function');
  }
  try {
    this.actual();
  } catch (e) {
    exception = e;
  }

  if (exception) {
    exceptionMessage = exception.message || exception;
    result = (isUndefined(expected) || this.env.equals_(exceptionMessage, expected.message || expected) || (jasmine.isA_("RegExp", expected) && expected.test(exceptionMessage)));
  }

  var not = this.isNot ? "not " : "";
  var regexMatch = jasmine.isA_("RegExp", expected) ? " an exception matching" : "";

  this.message = function() {
    if (exception) {
      return ["Expected function " + not + "to throw" + regexMatch, expected ? expected.message || expected : "an exception", ", but it threw", exceptionMessage].join(' ');
    } else {
      return "Expected function to throw an exception.";
    }
  };

  return result;
};


/**
 * Create jasmine.Spy on given method, but ignore calls without arguments
 * This is helpful when need to spy only setter methods and ignore getters
 */
function spyOnlyCallsWithArgs(obj, method) {
  var spy = spyOn(obj, method);
  obj[method] = function() {
    if (arguments.length) return spy.apply(this, arguments);
    return spy.originalValue.apply(this);
  };
  return spy;
}
