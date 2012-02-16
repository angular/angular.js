'use strict';


var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;


/**
 * @ngdoc inputType
 * @name angular.inputType.text
 *
 * @description
 * Standard HTML text input with angular data binding.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {number=} ng:minlength Sets `MINLENGTH` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ng:maxlength Sets `MAXLENGTH` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.text = 'guest';
           $scope.word = /^\w*$/;
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         Single word: <input type="text" name="input" ng:model="text"
                             ng:pattern="word" required>
         <span class="error" ng:show="myForm.input.error.REQUIRED">
           Required!</span>
         <span class="error" ng:show="myForm.input.error.PATTERN">
           Single word only!</span>

         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.valid = {{myForm.input.valid}}</tt><br/>
         <tt>myForm.input.error = {{myForm.input.error}}</tt><br/>
         <tt>myForm.valid = {{myForm.valid}}</tt><br/>
         <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('text')).toEqual('guest');
          expect(binding('myForm.input.valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('text').enter('');
          expect(binding('text')).toEqual('');
          expect(binding('myForm.input.valid')).toEqual('false');
        });

        it('should be invalid if multi word', function() {
          input('text').enter('hello world');
          expect(binding('myForm.input.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc inputType
 * @name angular.inputType.email
 *
 * @description
 * Text input with email validation. Sets the `EMAIL` validation error key if not a valid email
 * address.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {number=} ng:minlength Sets `MINLENGTH` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ng:maxlength Sets `MAXLENGTH` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.text = 'me@example.com';
         }
       </script>
         <form name="myForm" ng:controller="Ctrl">
           Email: <input type="email" name="input" ng:model="text" required>
           <span class="error" ng:show="myForm.input.error.REQUIRED">
             Required!</span>
           <span class="error" ng:show="myForm.input.error.EMAIL">
             Not valid email!</span>
           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.valid = {{myForm.input.valid}}</tt><br/>
           <tt>myForm.input.error = {{myForm.input.error}}</tt><br/>
           <tt>myForm.valid = {{myForm.valid}}</tt><br/>
           <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br/>
           <tt>myForm.error.EMAIL = {{!!myForm.error.EMAIL}}</tt><br/>
         </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('text')).toEqual('me@example.com');
          expect(binding('myForm.input.valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('text').enter('');
          expect(binding('text')).toEqual('');
          expect(binding('myForm.input.valid')).toEqual('false');
        });

        it('should be invalid if not email', function() {
          input('text').enter('xxx');
          expect(binding('myForm.input.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc inputType
 * @name angular.inputType.url
 *
 * @description
 * Text input with URL validation. Sets the `URL` validation error key if the content is not a
 * valid URL.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {number=} ng:minlength Sets `MINLENGTH` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ng:maxlength Sets `MAXLENGTH` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.text = 'http://google.com';
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         URL: <input type="url" name="input" ng:model="text" required>
         <span class="error" ng:show="myForm.input.error.REQUIRED">
           Required!</span>
         <span class="error" ng:show="myForm.input.error.url">
           Not valid url!</span>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.valid = {{myForm.input.valid}}</tt><br/>
         <tt>myForm.input.error = {{myForm.input.error}}</tt><br/>
         <tt>myForm.valid = {{myForm.valid}}</tt><br/>
         <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br/>
         <tt>myForm.error.url = {{!!myForm.error.url}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('text')).toEqual('http://google.com');
          expect(binding('myForm.input.valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('text').enter('');
          expect(binding('text')).toEqual('');
          expect(binding('myForm.input.valid')).toEqual('false');
        });

        it('should be invalid if not url', function() {
          input('text').enter('xxx');
          expect(binding('myForm.input.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc inputType
 * @name angular.inputType.list
 *
 * @description
 * Text input that converts between comma-seperated string into an array of strings.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.names = ['igor', 'misko', 'vojta'];
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         List: <input type="list" name="input" ng:model="names" required>
         <span class="error" ng:show="myForm.list.error.REQUIRED">
           Required!</span>
         <tt>names = {{names}}</tt><br/>
         <tt>myForm.input.valid = {{myForm.input.valid}}</tt><br/>
         <tt>myForm.input.error = {{myForm.input.error}}</tt><br/>
         <tt>myForm.valid = {{myForm.valid}}</tt><br/>
         <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('names')).toEqual('["igor","misko","vojta"]');
          expect(binding('myForm.input.valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('names').enter('');
          expect(binding('names')).toEqual('');
          expect(binding('myForm.input.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var ngListDirective = function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      var parse = function(viewValue) {
        var list = [];

        if (viewValue) {
          forEach(viewValue.split(/\s*,\s*/), function(value) {
            if (value) list.push(value);
          });
        }

        return list;
      };

      ctrl.parsers.push(parse);
      ctrl.formatters.push(function(value) {
        if (isArray(value) && !equals(parse(ctrl.viewValue), value)) {
          return value.join(', ');
        }

        return undefined;
      });
    }
  };
};

/**
 * @ngdoc inputType
 * @name angular.inputType.number
 *
 * @description
 * Text input with number validation and transformation. Sets the `NUMBER` validation
 * error if not a valid number.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} min Sets the `MIN` validation error key if the value entered is less then `min`.
 * @param {string=} max Sets the `MAX` validation error key if the value entered is greater then `min`.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {number=} ng:minlength Sets `MINLENGTH` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ng:maxlength Sets `MAXLENGTH` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.value = 12;
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         Number: <input type="number" name="input" ng:model="value"
                        min="0" max="99" required>
         <span class="error" ng:show="myForm.list.error.REQUIRED">
           Required!</span>
         <span class="error" ng:show="myForm.list.error.NUMBER">
           Not valid number!</span>
         <tt>value = {{value}}</tt><br/>
         <tt>myForm.input.valid = {{myForm.input.valid}}</tt><br/>
         <tt>myForm.input.error = {{myForm.input.error}}</tt><br/>
         <tt>myForm.valid = {{myForm.valid}}</tt><br/>
         <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('value')).toEqual('12');
         expect(binding('myForm.input.valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('value').enter('');
         expect(binding('value')).toEqual('');
         expect(binding('myForm.input.valid')).toEqual('false');
        });

        it('should be invalid if over max', function() {
         input('value').enter('123');
         expect(binding('value')).toEqual('12');
         expect(binding('myForm.input.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc inputType
 * @name angular.inputType.checkbox
 *
 * @description
 * HTML checkbox.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} ng:true-value The value to which the expression should be set when selected.
 * @param {string=} ng:false-value The value to which the expression should be set when not selected.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.value1 = true;
           $scope.value2 = 'YES'
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         Value1: <input type="checkbox" ng:model="value1"> <br/>
         Value2: <input type="checkbox" ng:model="value2"
                        ng:true-value="YES" ng:false-value="NO"> <br/>
         <tt>value1 = {{value1}}</tt><br/>
         <tt>value2 = {{value2}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should change state', function() {
          expect(binding('value1')).toEqual('true');
          expect(binding('value2')).toEqual('YES');

          input('value1').check();
          input('value2').check();
          expect(binding('value1')).toEqual('false');
          expect(binding('value2')).toEqual('NO');
        });
      </doc:scenario>
    </doc:example>
 */



/**
 * @ngdoc inputType
 * @name angular.inputType.radio
 *
 * @description
 * HTML radio button.
 *
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string} value The value to which the expression should be set when selected.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.color = 'blue';
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         <input type="radio" ng:model="color" value="red">  Red <br/>
         <input type="radio" ng:model="color" value="green"> Green <br/>
         <input type="radio" ng:model="color" value="blue"> Blue <br/>
         <tt>color = {{color}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should change state', function() {
          expect(binding('color')).toEqual('blue');

          input('color').select('red');
          expect(binding('color')).toEqual('red');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc widget
 * @name angular.module.ng.$compileProvider.directive.input
 *
 * @description
 * HTML input element widget with angular data-binding. Input widget follows HTML5 input types
 * and polyfills the HTML5 validation behavior for older browsers.
 *
 * The {@link angular.inputType custom angular.inputType}s provide a shorthand for declaring new
 * inputs. This is a sharthand for text-box based inputs, and there is no need to go through the
 * full {@link angular.module.ng.$formFactory $formFactory} widget lifecycle.
 *
 *
 * @param {string} type Widget types as defined by {@link angular.inputType}. If the
 *    type is in the format of `@ScopeType` then `ScopeType` is loaded from the
 *    current scope, allowing quick definition of type.
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {number=} ng:minlength Sets `MINLENGTH` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ng:maxlength Sets `MAXLENGTH` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.user = {name: 'guest', last: 'visitor'};
         }
       </script>
       <div ng:controller="Ctrl">
         <form name="myForm">
           User name: <input type="text" name="userName" ng:model="user.name" required>
           <span class="error" ng:show="myForm.userName.error.REQUIRED">
             Required!</span><br>
           Last name: <input type="text" name="lastName" ng:model="user.last"
             ng:minlength="3" ng:maxlength="10">
           <span class="error" ng:show="myForm.lastName.error.MINLENGTH">
             Too short!</span>
           <span class="error" ng:show="myForm.lastName.error.MAXLENGTH">
             Too long!</span><br>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.valid = {{myForm.userName.valid}}</tt><br>
         <tt>myForm.userName.error = {{myForm.userName.error}}</tt><br>
         <tt>myForm.lastName.valid = {{myForm.lastName.valid}}</tt><br>
         <tt>myForm.userName.error = {{myForm.lastName.error}}</tt><br>
         <tt>myForm.valid = {{myForm.valid}}</tt><br>
         <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br>
         <tt>myForm.error.MINLENGTH = {{!!myForm.error.MINLENGTH}}</tt><br>
         <tt>myForm.error.MAXLENGTH = {{!!myForm.error.MAXLENGTH}}</tt><br>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('user')).toEqual('{"last":"visitor","name":"guest"}');
          expect(binding('myForm.userName.valid')).toEqual('true');
          expect(binding('myForm.valid')).toEqual('true');
        });

        it('should be invalid if empty when required', function() {
          input('user.name').enter('');
          expect(binding('user')).toEqual('{"last":"visitor","name":null}');
          expect(binding('myForm.userName.valid')).toEqual('false');
          expect(binding('myForm.valid')).toEqual('false');
        });

        it('should be valid if empty when min length is set', function() {
          input('user.last').enter('');
          expect(binding('user')).toEqual('{"last":"","name":"guest"}');
          expect(binding('myForm.lastName.valid')).toEqual('true');
          expect(binding('myForm.valid')).toEqual('true');
        });

        it('should be invalid if less than required min length', function() {
          input('user.last').enter('xx');
          expect(binding('user')).toEqual('{"last":"visitor","name":"guest"}');
          expect(binding('myForm.lastName.valid')).toEqual('false');
          expect(binding('myForm.lastName.error')).toMatch(/MINLENGTH/);
          expect(binding('myForm.valid')).toEqual('false');
        });

        it('should be valid if longer than max length', function() {
          input('user.last').enter('some ridiculously long name');
          expect(binding('user'))
            .toEqual('{"last":"visitor","name":"guest"}');
          expect(binding('myForm.lastName.valid')).toEqual('false');
          expect(binding('myForm.lastName.error')).toMatch(/MAXLENGTH/);
          expect(binding('myForm.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc widget
 * @name angular.module.ng.$compileProvider.directive.textarea
 *
 * @description
 * HTML textarea element widget with angular data-binding. The data-binding and validation
 * properties of this element are exactly the same as those of the
 * {@link angular.module.ng.$compileProvider.directive.input input element}.
 *
 * @param {string} type Widget types as defined by {@link angular.inputType}. If the
 *    type is in the format of `@ScopeType` then `ScopeType` is loaded from the
 *    current scope, allowing quick definition of type.
 * @param {string} ng:model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the widgets is published.
 * @param {string=} required Sets `REQUIRED` validation error key if the value is not entered.
 * @param {number=} ng:minlength Sets `MINLENGTH` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ng:maxlength Sets `MAXLENGTH` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ng:pattern Sets `PATTERN` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ng:change Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 */
var inputType = {
  'text': textInputType,
  'number': numberInputType,
  'url': urlInputType,
  'email': emailInputType,

  'radio': radioInputType,
  'checkbox': checkboxInputType,

  'hidden': noop,
  'button': noop,
  'submit': noop,
  'reset': noop
};


function isEmpty(value) {
  return isUndefined(value) || value === '' || value === null || value !== value;
}


function textInputType(scope, element, attr, ctrl) {
  element.bind('blur', function() {
    var touched = ctrl.touch(),
        value = trim(element.val());

    if (ctrl.viewValue !== value) {
      scope.$apply(function() {
        ctrl.read(value);
      });
    } else if (touched) {
      scope.$apply();
    }
  });

  ctrl.render = function() {
    element.val(ctrl.viewValue || '');
  };

  // pattern validator
  var pattern = attr.ngPattern,
      patternValidator;

  var emit = function(regexp, value) {
    if (isEmpty(value) || regexp.test(value)) {
      ctrl.emitValidity('PATTERN', true);
      return value;
    } else {
      ctrl.emitValidity('PATTERN', false);
      return undefined;
    }
  };

  if (pattern) {
    if (pattern.match(/^\/(.*)\/$/)) {
      pattern = new RegExp(pattern.substr(1, pattern.length - 2));
      patternValidator = function(value) {
        return emit(pattern, value)
      };
    } else {
      patternValidator = function(value) {
        var patternObj = scope.$eval(pattern);

        if (!patternObj || !patternObj.test) {
          throw new Error('Expected ' + pattern + ' to be a RegExp but was ' + patternObj);
        }
        return emit(patternObj, value);
      };
    }

    ctrl.formatters.push(patternValidator);
    ctrl.parsers.push(patternValidator);
  }

  // min length validator
  if (attr.ngMinlength) {
    var minlength = parseInt(attr.ngMinlength, 10);
    var minLengthValidator = function(value) {
      if (!isEmpty(value) && value.length < minlength) {
        ctrl.emitValidity('MINLENGTH', false);
        return undefined;
      } else {
        ctrl.emitValidity('MINLENGTH', true);
        return value;
      }
    };

    ctrl.parsers.push(minLengthValidator);
    ctrl.formatters.push(minLengthValidator);
  }

  // max length validator
  if (attr.ngMaxlength) {
    var maxlength = parseInt(attr.ngMaxlength, 10);
    var maxLengthValidator = function(value) {
      if (!isEmpty(value) && value.length > maxlength) {
        ctrl.emitValidity('MAXLENGTH', false);
        return undefined;
      } else {
        ctrl.emitValidity('MAXLENGTH', true);
        return value;
      }
    };

    ctrl.parsers.push(maxLengthValidator);
    ctrl.formatters.push(maxLengthValidator);
  }
};

function numberInputType(scope, element, attr, ctrl) {
  textInputType(scope, element, attr, ctrl);

  ctrl.parsers.push(function(value) {
    var empty = isEmpty(value);
    if (empty || NUMBER_REGEXP.test(value)) {
      ctrl.emitValidity('NUMBER', true);
      return value === '' ? null : (empty ? value : parseFloat(value));
    } else {
      ctrl.emitValidity('NUMBER', false);
      return undefined;
    }
  });

  ctrl.formatters.push(function(value) {
    return isEmpty(value) ? '' : '' + value;
  });

  if (attr.min) {
    var min = parseFloat(attr.min);
    var minValidator = function(value) {
      if (!isEmpty(value) && value < min) {
        ctrl.emitValidity('MIN', false);
        return undefined;
      } else {
        ctrl.emitValidity('MIN', true);
        return value;
      }
    };

    ctrl.parsers.push(minValidator);
    ctrl.formatters.push(minValidator);
  }

  if (attr.max) {
    var max = parseFloat(attr.max);
    var maxValidator = function(value) {
      if (!isEmpty(value) && value > max) {
        ctrl.emitValidity('MAX', false);
        return undefined;
      } else {
        ctrl.emitValidity('MAX', true);
        return value;
      }
    };

    ctrl.parsers.push(maxValidator);
    ctrl.formatters.push(maxValidator);
  }

  ctrl.formatters.push(function(value) {

    if (isEmpty(value) || isNumber(value)) {
      ctrl.emitValidity('NUMBER', true);
      return value;
    } else {
      ctrl.emitValidity('NUMBER', false);
      return undefined;
    }
  });
}

function urlInputType(scope, element, attr, ctrl) {
  textInputType(scope, element, attr, ctrl);

  var urlValidator = function(value) {
    if (isEmpty(value) || URL_REGEXP.test(value)) {
      ctrl.emitValidity('URL', true);
      return value;
    } else {
      ctrl.emitValidity('URL', false);
      return undefined;
    }
  };

  ctrl.formatters.push(urlValidator);
  ctrl.parsers.push(urlValidator);
}

function emailInputType(scope, element, attr, ctrl) {
  textInputType(scope, element, attr, ctrl);

  var emailValidator = function(value) {
    if (isEmpty(value) || EMAIL_REGEXP.test(value)) {
      ctrl.emitValidity('EMAIL', true);
      return value;
    } else {
      ctrl.emitValidity('EMAIL', false);
      return undefined;
    }
  };

  ctrl.formatters.push(emailValidator);
  ctrl.parsers.push(emailValidator);
}

function radioInputType(scope, element, attr, ctrl) {
  // correct the name
  element.attr('name', attr.id + '@' + attr.name);

  element.bind('click', function() {
    if (element[0].checked) {
      scope.$apply(function() {
        ctrl.touch();
        ctrl.read(attr.value);
      });
    };
  });

  ctrl.render = function() {
    var value = attr.value;
    element[0].checked = isDefined(value) && (value == ctrl.viewValue);
  };
}

function checkboxInputType(scope, element, attr, ctrl) {
  var trueValue = attr.ngTrueValue,
      falseValue = attr.ngFalseValue;

  if (!isString(trueValue)) trueValue = true;
  if (!isString(falseValue)) falseValue = false;

  element.bind('click', function() {
    scope.$apply(function() {
      ctrl.touch();
      ctrl.read(element[0].checked);
    });
  });

  ctrl.render = function() {
    element[0].checked = ctrl.viewValue;
  };

  ctrl.formatters.push(function(value) {
    return value === trueValue;
  });

  ctrl.parsers.push(function(value) {
    return value ? trueValue : falseValue;
  });
}


var inputDirective = [function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, element, attr, ctrl) {
      if (ctrl) {
        (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl);
      }
    }
  };
}];


var NgModelController = ['$scope', '$exceptionHandler', 'ngModel',
    function($scope, $exceptionHandler, ngModel) {
  this.viewValue = Number.NaN;
  this.modelValue = Number.NaN;
  this.parsers = [];
  this.formatters = [];
  this.error = {};
  this.pristine = true;
  this.dirty = false;
  this.valid = true;
  this.invalid = false;
  this.render = noop;

  this.touch = function() {
    if (this.dirty) return false;

    this.dirty = true;
    this.pristine = false;
    try {
      $scope.$emit('$viewTouch');
    } catch (e) {
      $exceptionHandler(e);
    }
    return true;
  };

  // don't $emit valid if already valid, the same for $invalid
  // not sure about this method name, should the argument be reversed ? emitError ?
  this.emitValidity = function(name, isValid) {

    if (!isValid && this.error[name]) return;
    if (isValid && !this.error[name]) return;

    if (!isValid) {
      this.error[name] = true;
      this.invalid = true;
      this.valid = false;
    }

    if (isValid) {
      delete this.error[name];
      if (equals(this.error, {})) {
        this.valid = true;
        this.invalid = false;
      }
    }

    return $scope.$emit(isValid ? '$valid' : '$invalid', name, this);
  };

  // view -> model
  this.read = function(value) {
    this.viewValue = value;

    forEach(this.parsers, function(fn) {
      value = fn(value);
    });

    if (isDefined(value) && this.model !== value) {
      this.modelValue = value;
      ngModel(value);
      $scope.$emit('$viewChange', value, this);
    }
  };

  // model -> value
  var ctrl = this;
  $scope.$watch(function() {
    return ngModel();
  }, function(value) {

    // ignore change from view
    if (ctrl.modelValue === value) return;

    var formatters = ctrl.formatters,
        idx = formatters.length;

    ctrl.modelValue = value;
    while(idx--) {
      value = formatters[idx](value);
    }

    if (isDefined(value) && ctrl.viewValue !== value) {
      ctrl.viewValue = value;
      ctrl.render();
    }
  });
}];


var ngModelDirective = [function() {
  return {
    inject: {
      ngModel: 'accessor'
    },
    require: ['ngModel', '^?form'],
    controller: NgModelController,
    link: function(scope, element, attr, controllers) {
      var modelController = controllers[0],
          formController = controllers[1];

      if (formController) {
        formController.registerWidget(modelController, attr.name);
      }

      forEach(['valid', 'invalid', 'pristine', 'dirty'], function(name) {
        scope.$watch(function() {
          return modelController[name];
        }, function(value) {
          element[value ? 'addClass' : 'removeClass']('ng-' + name);
        });
      });

      element.bind('$destroy', function() {
        scope.$emit('$destroy', modelController);
      });
    }
  };
}];


var ngChangeDirective = valueFn({
  require: 'ngModel',
  link: function(scope, element, attr, ctrl) {
    scope.$on('$viewChange', function(event, value, widget) {
      if (ctrl === widget) scope.$eval(attr.ngChange);
    });
  }
});


var ngBindImmediateDirective = ['$browser', function($browser) {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      element.bind('keydown change input', function(event) {
        var key = event.keyCode;

        //    command            modifiers                   arrows
        if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

        $browser.defer(function() {
          var touched = ctrl.touch(),
              value = trim(element.val());

          if (ctrl.viewValue !== value) {
            scope.$apply(function() {
              ctrl.read(value);
            });
          } else if (touched) {
            scope.$apply();
          }
        });
      });
    }
  };
}];


var requiredDirective = [function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var validator = function(value) {
        if (attr.required && isEmpty(value)) {
          ctrl.emitValidity('REQUIRED', false);
          return null;
        } else {
          ctrl.emitValidity('REQUIRED', true);
          return value;
        }
      };

      ctrl.formatters.push(validator);
      ctrl.parsers.unshift(validator);

      attr.$observe('required', function() {
        validator(ctrl.viewValue);
      });
    }
  };
}];
