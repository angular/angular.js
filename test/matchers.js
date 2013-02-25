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

  this.addMatchers({
    toBeInvalid: cssMatcher('ng-invalid', 'ng-valid'),
    toBeValid: cssMatcher('ng-valid', 'ng-invalid'),
    toBeDirty: cssMatcher('ng-dirty', 'ng-pristine'),
    toBePristine: cssMatcher('ng-pristine', 'ng-dirty'),

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
          expected = toJson(this.actual.message);
        } else {
          expected = toJson(this.actual);
        }
        return "Expected " + expected + " to be an Error with message " + toJson(message);
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
    }

  });
});
