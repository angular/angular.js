'use strict';


var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
var INTEGER_REGEXP = /^\s*(\-|\+)?\d+\s*$/;


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
       <div ng:controller="Ctrl">
         <form name="myForm">
           Single word: <input type="text" name="input" ng:model="text"
                               ng:pattern="word" required>
           <span class="error" ng:show="myForm.input.$error.REQUIRED">
             Required!</span>
           <span class="error" ng:show="myForm.input.$error.PATTERN">
             Single word only!</span>
         </form>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('text')).toEqual('guest');
          expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('text').enter('');
          expect(binding('text')).toEqual('');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if multi word', function() {
          input('text').enter('hello world');
          expect(binding('myForm.input.$valid')).toEqual('false');
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
       <div ng:controller="Ctrl">
         <form name="myForm">
           Email: <input type="email" name="input" ng:model="text" required>
           <span class="error" ng:show="myForm.input.$error.REQUIRED">
             Required!</span>
           <span class="error" ng:show="myForm.input.$error.EMAIL">
             Not valid email!</span>
         </form>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
         <tt>myForm.$error.EMAIL = {{!!myForm.$error.EMAIL}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('text')).toEqual('me@example.com');
          expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('text').enter('');
          expect(binding('text')).toEqual('');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if not email', function() {
          input('text').enter('xxx');
          expect(binding('text')).toEqual('xxx');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('email', function(element, widget) {
  widget.$on('$validate', function(event) {
    var value = widget.$viewValue;
    widget.$emit(!value || value.match(EMAIL_REGEXP) ? "$valid" : "$invalid", "EMAIL");
  });
});


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
       <div ng:controller="Ctrl">
         <form name="myForm">
           URL: <input type="url" name="input" ng:model="text" required>
           <span class="error" ng:show="myForm.input.$error.REQUIRED">
             Required!</span>
           <span class="error" ng:show="myForm.input.$error.url">
             Not valid url!</span>
         </form>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
         <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('text')).toEqual('http://google.com');
          expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('text').enter('');
          expect(binding('text')).toEqual('');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if not url', function() {
          input('text').enter('xxx');
          expect(binding('text')).toEqual('xxx');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('url', function(element, widget) {
  widget.$on('$validate', function(event) {
    var value = widget.$viewValue;
    widget.$emit(!value || value.match(URL_REGEXP) ? "$valid" : "$invalid", "URL");
  });
});


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
       <div ng:controller="Ctrl">
         <form name="myForm">
           List: <input type="list" name="input" ng:model="names" required>
           <span class="error" ng:show="myForm.list.$error.REQUIRED">
             Required!</span>
         </form>
         <tt>names = {{names}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('names')).toEqual('["igor","misko","vojta"]');
          expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('names').enter('');
          expect(binding('names')).toEqual('[]');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('list', function(element, widget) {
  function parse(viewValue) {
    var list = [];
    forEach(viewValue.split(/\s*,\s*/), function(value){
      if (value) list.push(trim(value));
    });
    return list;
  }
  widget.$parseView = function() {
    isString(widget.$viewValue) && (widget.$modelValue = parse(widget.$viewValue));
  };
  widget.$parseModel = function() {
    var modelValue = widget.$modelValue;
    if (isArray(modelValue)
        && (!isString(widget.$viewValue) || !equals(parse(widget.$viewValue), modelValue))) {
      widget.$viewValue =  modelValue.join(', ');
    }
  };
});


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
       <div ng:controller="Ctrl">
         <form name="myForm">
           Number: <input type="number" name="input" ng:model="value"
                          min="0" max="99" required>
           <span class="error" ng:show="myForm.list.$error.REQUIRED">
             Required!</span>
           <span class="error" ng:show="myForm.list.$error.NUMBER">
             Not valid number!</span>
         </form>
         <tt>value = {{value}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('value')).toEqual('12');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('value').enter('');
         expect(binding('value')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if over max', function() {
         input('value').enter('123');
         expect(binding('value')).toEqual('123');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('number', numericRegexpInputType(NUMBER_REGEXP, 'NUMBER'));


/**
 * @ngdoc inputType
 * @name angular.inputType.integer
 *
 * @description
 * Text input with integer validation and transformation. Sets the `INTEGER`
 * validation error key if not a valid integer.
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
       <div ng:controller="Ctrl">
         <form name="myForm">
           Integer: <input type="integer" name="input" ng:model="value"
                           min="0" max="99" required>
           <span class="error" ng:show="myForm.list.$error.REQUIRED">
             Required!</span>
           <span class="error" ng:show="myForm.list.$error.INTEGER">
             Not valid integer!</span>
         </form>
         <tt>value = {{value}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('value')).toEqual('12');
          expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
          input('value').enter('1.2');
          expect(binding('value')).toEqual('12');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if over max', function() {
          input('value').enter('123');
          expect(binding('value')).toEqual('123');
          expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('integer', numericRegexpInputType(INTEGER_REGEXP, 'INTEGER'));


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
       <div ng:controller="Ctrl">
         <form name="myForm">
           Value1: <input type="checkbox" ng:model="value1"> <br/>
           Value2: <input type="checkbox" ng:model="value2"
                          ng:true-value="YES" ng:false-value="NO"> <br/>
         </form>
         <tt>value1 = {{value1}}</tt><br/>
         <tt>value2 = {{value2}}</tt><br/>
       </div>
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
angularInputType('checkbox', function(inputElement, widget) {
  var trueValue = inputElement.attr('ng:true-value'),
      falseValue = inputElement.attr('ng:false-value');

  if (!isString(trueValue)) trueValue = true;
  if (!isString(falseValue)) falseValue = false;

  inputElement.bind('click', function() {
    widget.$apply(function() {
      widget.$emit('$viewChange', inputElement[0].checked);
    });
  });

  widget.$render = function() {
    inputElement[0].checked = widget.$viewValue;
  };

  widget.$parseModel = function() {
    widget.$viewValue = widget.$modelValue === trueValue;
  };

  widget.$parseView = function() {
    widget.$modelValue = widget.$viewValue ? trueValue : falseValue;
  };
});


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
       <div ng:controller="Ctrl">
         <form name="myForm">
           <input type="radio" ng:model="color" value="red">  Red <br/>
           <input type="radio" ng:model="color" value="green"> Green <br/>
           <input type="radio" ng:model="color" value="blue"> Blue <br/>
         </form>
         <tt>color = {{color}}</tt><br/>
       </div>
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
angularInputType('radio', function(inputElement, widget, attr) {
  //correct the name
  attr.$set('name', widget.$id + '@' + attr.name);
  inputElement.bind('click', function() {
    widget.$apply(function() {
      if (inputElement[0].checked) {
        widget.$emit('$viewChange', attr.value);
      }
    });
  });

  widget.$render = function() {
    inputElement[0].checked = isDefined(attr.value) && (attr.value == widget.$viewValue);
  };

  if (inputElement[0].checked) {
    widget.$viewValue = attr.value;
  }
});


function numericRegexpInputType(regexp, error) {
  return function(inputElement, widget) {
    var min = 1 * (inputElement.attr('min') || Number.MIN_VALUE),
        max = 1 * (inputElement.attr('max') || Number.MAX_VALUE);

    widget.$on('$validate', function(event){
      var value = widget.$viewValue,
          filled = value && trim(value) != '',
          valid = isString(value) && value.match(regexp);

      widget.$emit(!filled || valid ? "$valid" : "$invalid", error);
      filled && (value = 1 * value);
      widget.$emit(valid && value < min ? "$invalid" : "$valid", "MIN");
      widget.$emit(valid && value > max ? "$invalid" : "$valid", "MAX");
    });

    widget.$parseView = function() {
      if (widget.$viewValue.match(regexp)) {
        widget.$modelValue = 1 * widget.$viewValue;
      } else if (widget.$viewValue == '') {
        widget.$modelValue = null;
      }
    };

    widget.$parseModel = function() {
      widget.$viewValue = isNumber(widget.$modelValue)
        ? '' + widget.$modelValue
        : '';
    };
  };
}


var HTML5_INPUTS_TYPES =  makeMap(
        "search,tel,url,email,datetime,date,month,week,time,datetime-local,number,range,color," +
        "radio,checkbox,text,button,submit,reset,hidden,password");


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
           <span class="error" ng:show="myForm.userName.$error.REQUIRED">
             Required!</span><br>
           Last name: <input type="text" name="lastName" ng:model="user.last"
             ng:minlength="3" ng:maxlength="10">
           <span class="error" ng:show="myForm.lastName.$error.MINLENGTH">
             Too short!</span>
           <span class="error" ng:show="myForm.lastName.$error.MAXLENGTH">
             Too long!</span><br>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br>
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br>
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br>
         <tt>myForm.userName.$error = {{myForm.lastName.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br>
         <tt>myForm.$error.MINLENGTH = {{!!myForm.$error.MINLENGTH}}</tt><br>
         <tt>myForm.$error.MAXLENGTH = {{!!myForm.$error.MAXLENGTH}}</tt><br>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('user')).toEqual('{"last":"visitor","name":"guest"}');
          expect(binding('myForm.userName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if empty when required', function() {
          input('user.name').enter('');
          expect(binding('user')).toEqual('{"last":"visitor","name":""}');
          expect(binding('myForm.userName.$valid')).toEqual('false');
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be valid if empty when min length is set', function() {
          input('user.last').enter('');
          expect(binding('user')).toEqual('{"last":"","name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if less than required min length', function() {
          input('user.last').enter('xx');
          expect(binding('user')).toEqual('{"last":"xx","name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/MINLENGTH/);
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be valid if longer than max length', function() {
          input('user.last').enter('some ridiculously long name');
          expect(binding('user'))
            .toEqual('{"last":"some ridiculously long name","name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/MAXLENGTH/);
          expect(binding('myForm.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var inputDirective = ['$defer', '$formFactory', function($defer, $formFactory) {
  return {
    restrict: 'E',
    link: function(modelScope, inputElement, attr) {
      if (!attr.ngModel) return;

      var form = $formFactory.forElement(inputElement),
          // We have to use .getAttribute, since jQuery tries to be smart and use the
          // type property. Trouble is some browser change unknown to text.
          type = attr.type || 'text',
          TypeController,
          patternMatch, widget,
          pattern = attr.ngPattern,
          modelExp = attr.ngModel,
          minlength = parseInt(attr.ngMinlength, 10),
          maxlength = parseInt(attr.ngMaxlength, 10),
          loadFromScope = type.match(/^\s*\@\s*(.*)/);

       if (!pattern) {
         patternMatch = valueFn(true);
       } else {
         if (pattern.match(/^\/(.*)\/$/)) {
           pattern = new RegExp(pattern.substr(1, pattern.length - 2));
           patternMatch = function(value) {
             return pattern.test(value);
           };
         } else {
           patternMatch = function(value) {
             var patternObj = modelScope.$eval(pattern);
             if (!patternObj || !patternObj.test) {
               throw new Error('Expected ' + pattern + ' to be a RegExp but was ' + patternObj);
             }
             return patternObj.test(value);
           };
         }
       }

      type = lowercase(type);
      TypeController = (loadFromScope
              ? (assertArgFn(modelScope.$eval(loadFromScope[1]), loadFromScope[1])).$unboundFn
              : angularInputType(type)) || noop;

      if (!HTML5_INPUTS_TYPES[type]) {
        try {
          // jquery will not let you so we have to go to bare metal
          inputElement[0].setAttribute('type', 'text');
        } catch(e){
          // also turns out that ie8 will not allow changing of types, but since it is not
          // html5 anyway we can ignore the error.
        }
      }

      //TODO(misko): setting $inject is a hack
      !TypeController.$inject && (TypeController.$inject = ['$element', '$scope', '$attr']);
      widget = form.$createWidget({
          scope: modelScope,
          model: modelExp,
          onChange: attr.ngChange,
          alias: attr.name,
          controller: TypeController,
          controllerArgs: {$element: inputElement, $attr: attr}
      });

      widget.$pristine = !(widget.$dirty = false);

      widget.$on('$validate', function() {
        var $viewValue = trim(widget.$viewValue),
            inValid = attr.required && !$viewValue,
            tooLong = maxlength && $viewValue && $viewValue.length > maxlength,
            tooShort = minlength && $viewValue && $viewValue.length < minlength,
            missMatch = $viewValue && !patternMatch($viewValue);

        if (widget.$error.REQUIRED != inValid){
          widget.$emit(inValid ? '$invalid' : '$valid', 'REQUIRED');
        }
        if (widget.$error.PATTERN != missMatch){
          widget.$emit(missMatch ? '$invalid' : '$valid', 'PATTERN');
        }
        if (widget.$error.MINLENGTH != tooShort){
          widget.$emit(tooShort ? '$invalid' : '$valid', 'MINLENGTH');
        }
        if (widget.$error.MAXLENGTH != tooLong){
          widget.$emit(tooLong ? '$invalid' : '$valid', 'MAXLENGTH');
        }
      });

      forEach(['valid', 'invalid', 'pristine', 'dirty'], function(name) {
        widget.$watch('$' + name, function(value) {
          inputElement[value ? 'addClass' : 'removeClass']('ng-' + name);
        });
      });

      inputElement.bind('$destroy', function() {
        widget.$destroy();
      });

      if (type != 'checkbox' && type != 'radio') {
        // TODO (misko): checkbox / radio does not really belong here, but until we can do
        // widget registration with CSS, we are hacking it this way.
        widget.$render = function() {
          inputElement.val(widget.$viewValue || '');
        };

        inputElement.bind('keydown change input', function(event){
          var key = event.keyCode;
          if (/*command*/   key != 91 &&
              /*modifiers*/ !(15 < key && key < 19) &&
              /*arrow*/     !(37 < key && key < 40)) {
            $defer(function() {
              widget.$dirty = !(widget.$pristine = false);
              var value = trim(inputElement.val());
              if (widget.$viewValue !== value ) {
                widget.$emit('$viewChange', value);
              }
            });
          }
        });
      }
    }
  };
}];


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
