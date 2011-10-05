'use strict';


var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
var INTEGER_REGEXP = /^\s*(\-|\+)?\d+\s*$/;

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.text
 *
 * @description
 * Standard HTML text input with angular data binding.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.text = 'guest';
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           Text: <input type="text" name="input" ng:model="text" required>
           <span style="color: red;" ng:show="myForm.input.$error.REQUIRED">Required!</span>
         </form>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function(){
         expect(binding('text')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('text').enter('');
         expect(binding('text')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.email
 *
 * @description
 * Validating email text input. Sets the `EMAIL` validation error if not a valid email address.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.text = 'me@example.com';
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           Email: <input type="email" name="input" ng:model="text" required>
           <span style="color: red;" ng:show="myForm.input.$error.REQUIRED">Required!</span>
           <span style="color: red;" ng:show="myForm.input.$error.EMAIL">Not valid email!</span>
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
        it('should initialize to model', function(){
         expect(binding('text')).toEqual('me@example.com');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('text').enter('');
         expect(binding('text')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if not email', function(){
         input('text').enter('xxx');
         expect(binding('text')).toEqual('xxx');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('email', function() {
  var widget = this;
  this.$on('$validate', function(event){
    var value = widget.$viewValue;
    widget.$emit(!value || value.match(EMAIL_REGEXP) ? "$valid" : "$invalid", "EMAIL");
  });
});

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.url
 *
 * @description
 * Validating url text input. Sets the `URL` validation error if not a valid URL.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.text = 'http://google.com';
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           URL: <input type="url" name="input" ng:model="text" required>
           <span style="color: red;" ng:show="myForm.input.$error.REQUIRED">Required!</span>
           <span style="color: red;" ng:show="myForm.input.$error.url">Not valid url!</span>
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
        it('should initialize to model', function(){
         expect(binding('text')).toEqual('http://google.com');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('text').enter('');
         expect(binding('text')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if not url', function(){
         input('text').enter('xxx');
         expect(binding('text')).toEqual('xxx');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('url', function() {
  var widget = this;
  this.$on('$validate', function(event){
    var value = widget.$viewValue;
    widget.$emit(!value || value.match(URL_REGEXP) ? "$valid" : "$invalid", "URL");
  });
});

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.list
 *
 * @description
 * Parsing list text input. Converts a comma separated list into an array of strings.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.names = ['igor', 'misko', 'vojta'];
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           List: <input type="list" name="input" ng:model="names" required>
           <span style="color: red;" ng:show="myForm.list.$error.REQUIRED">Required!</span>
         </form>
         <tt>names = {{names}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function(){
         expect(binding('names')).toEqual('["igor","misko","vojta"]');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('names').enter('');
         expect(binding('names')).toEqual('[]');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('list', function(){
  function _parse(viewValue) {
    var list = [];
    forEach(viewValue.split(/\s*,\s*/), function(value){
      if (value) list.push(trim(value));
    });
    return list;
  }
  this.$parseView = function(){
    isString(this.$viewValue) && (this.$modelValue = _parse(this.$viewValue));
  };
  this.$parseModel = function(){
    var modelValue = this.$modelValue;
    if (isArray(modelValue)
        && (!isString(this.$viewValue) || !equals(_parse(this.$viewValue), modelValue))) {
      this.$viewValue =  modelValue.join(', ');
    }
  };
});

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.number
 *
 * @description
 * Parsing number text input. Converts the text input into a number. Sets the `NUMBER` validation
 * error if not a valid number.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 * @param {string=} min Sets the `MIN` validation error if the value entered is less then `min`.
 * @param {string=} max Sets the `MAX` validation error if the value entered is greater then `min`.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.value = 12;
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           Number: <input type="number" name="input" ng:model="value" min="0" max="99" required>
           <span style="color: red;" ng:show="myForm.list.$error.REQUIRED">Required!</span>
           <span style="color: red;" ng:show="myForm.list.$error.NUMBER">Not valid number!</span>
         </form>
         <tt>value = {{value}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function(){
         expect(binding('value')).toEqual('12');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('value').enter('');
         expect(binding('value')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if over max', function(){
         input('value').enter('123');
         expect(binding('value')).toEqual('123');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('number', numericRegexpInputType(NUMBER_REGEXP, 'NUMBER'));

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.integer
 *
 * @description
 * Parsing integer text input. Converts the text input into a integer. Sets the `INTEGER`
 * validation error if not a valid integer.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 * @param {string=} min Sets the `MIN` validation error if the value entered is less then `min`.
 * @param {string=} max Sets the `MAX` validation error if the value entered is greater then `min`.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.value = 12;
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           Integer: <input type="integer" name="input" ng:model="value" min="0" max="99" required>
           <span style="color: red;" ng:show="myForm.list.$error.REQUIRED">Required!</span>
           <span style="color: red;" ng:show="myForm.list.$error.INTEGER">Not valid integer!</span>
         </form>
         <tt>value = {{value}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function(){
         expect(binding('value')).toEqual('12');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('value').enter('1.2');
         expect(binding('value')).toEqual('12');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });

        it('should be invalid if over max', function(){
         input('value').enter('123');
         expect(binding('value')).toEqual('123');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('integer', numericRegexpInputType(INTEGER_REGEXP, 'INTEGER'));

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.regexp
 *
 * @description
 * RegExp input. Sets the `REGEXP` validation error if not a valid RegExp.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 * @param {regexp} ng:regexp expression which evaluates to JavaScript regexp. Inline RegExps can
 *   be specified using the standard `/.../` RegExp syntax.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.value = '95042';
           this.zip = /^\d\d\d\d\d(-\d\d\d\d)?$/
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           Scope zip: <input type="regexp" name="input" ng:regexp="zip" ng:model="value" required> <br/>
           Inline zip: <input type="regexp" ng:regexp="/^\d\d\d\d\d(-\d\d\d\d)?$/" ng:model="value" required>
           <span style="color: red;" ng:show="myForm.list.$error.REQUIRED">Required!</span>
           <span style="color: red;" ng:show="myForm.list.$error.REGEXP">Not valid zip!</span>
         </form>
         <tt>value = {{value}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
         <tt>myForm.$error.REGEXP.length = {{myForm.$error.REGEXP.length}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function(){
         expect(binding('value')).toEqual('95042');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if not zip', function(){
         input('value').enter('abc');
         expect(binding('value')).toEqual('abc');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularInputType('regexp', function(element){
  var widget = this,
      scope = element.scope(),
      regexp = trim(element.attr('ng:regexp') || ''),
      match;
  if(match = regexp.match(/^\/(.*)\/$/)) {
    regexp = new RegExp(match[1]);
    match = function (value) { return regexp.test(value); };
  } else {
    match = function (value) {
      return (scope.$eval(regexp)||{test:noop}).test(value);
    };
  }

  this.$on('$validate', function(event) {
    var value = widget.$viewValue;
    widget.$emit(!value || match(value) ? "$valid" : "$invalid", "REGEXP");
  });
});

/**
 * @workInProgress
 * @ngdoc inputType
 * @name angular.inputType.checkbox
 *
 * @description
 * HTML checkbox.
 *
 * @param {string} name assignable expression to data-bind to.
 * @param {string=} true-value the value to which the expression should be set when selected.
 * @param {string=} false-value the value to which the expression should be set when not selected.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.value1 = true;
           this.value2 = 'YES'
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           Value1: <input type="checkbox" ng:model="value1"> <br/>
           Value2: <input type="checkbox" ng:model="value2" true-value="YES" false-value="NO"> <br/>
         </form>
         <tt>value1 = {{value1}}</tt><br/>
         <tt>value2 = {{value2}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should change state', function(){
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
angularInputType('checkbox', function (inputElement) {
  var widget = this,
      trueValue = inputElement.attr('true-value'),
      falseValue = inputElement.attr('false-value');

  if (!isString(trueValue)) trueValue = true;
  if (!isString(falseValue)) falseValue = false;

  inputElement.bind('click', function(){
    widget.$apply(function(){
      widget.$emit('$viewChange', inputElement[0].checked);
    });
  });

  widget.$render = function(){
    inputElement[0].checked = widget.$viewValue;
  };

  widget.$parseModel = function(){
    widget.$viewValue = this.$modelValue === trueValue;
  };

  widget.$parseView = function(){
    widget.$modelValue = widget.$viewValue ? trueValue : falseValue;
  };

});

angularInputType('radio', function(inputElement) {
  var widget = this;
  // correct the name
  var value = inputElement.attr('value');
  inputElement.attr('name', widget.$id + '@' + inputElement.attr('name'));
  inputElement.bind('click', function(){
    widget.$apply(function(){
      if (inputElement[0].checked) {
        widget.$emit('$viewChange', value);
      }
    });
  });

  widget.$render = function(){
    inputElement[0].checked = value == widget.$viewValue;
  };

  if (inputElement[0].checked) {
    widget.$viewValue = value;
  }
});

function numericRegexpInputType(regexp, error) {
  return function(inputElement) {
    var widget = this,
        min = 1 * (inputElement.attr('min') || Number.MIN_VALUE),
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
    widget.$parseView = function(){
      if (widget.$viewValue.match(regexp)) {
        widget.$modelValue = 1 * widget.$viewValue;
      } else if (widget.$viewValue == '') {
        widget.$modelValue = null;
      }
    };
    widget.$parseModel = function(){
      if (isNumber(widget.$modelValue)) {
        widget.$viewValue = '' + widget.$modelValue;
      }
    };
  };
}

var HTML5_INPUTS_TYPES =  makeMap(
    "search,tel,url,email,datetime,date,month,week,time,datetime-local,number,range,color,radio,checkbox,text,button,submit,reset");


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.input
 *
 * @description
 * HTML input element widget with angular data-binding. Input widget follows HTML5 input types as
 * and back fills the validation behavior for non-HTML5 browsers.
 *
 * The {@link angular.inputType custom angulr.inputType}s provides a short hand for declaring new
 * inputs. This is a shart hand for text-box based inputs, and there is no need to go through the
 * full {@link angular.service.$formFactory $formFactory} widget lifecycle.
 *
 *
 * @param {string} type Widget types as defined by {@link angular.inputType}. If the
 *    type is in the format of `scope:scope_type` then `scope_type` is loaded from the
 *    current scope, allowing quick definition of type.
 * @param {string} name An assignable data-binding {@link guide/dev_guide.expressions expression}.
 * @param {string=} required Sets `REQUIRED` validation error if the value is not entered.
 * @param {string=} value While HTML allows declaration of initial value for the input, it is
 *    ignored by angular. This is because allowing value, would allow the view to have side-effects
 *    on the controller, which is undesirable.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Cntl(){
           this.text = 'guest';
         }
       </script>
       <div ng:controller="Cntl">
         <form name="myForm">
           text: <input type="text" name="input" ng:model="text" required>
           <span style="color: red;" ng:show="myForm.input.$error.REQUIRED">Required!</span>
         </form>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function(){
         expect(binding('text')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function(){
         input('text').enter('');
         expect(binding('text')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
angularWidget('input', function (inputElement){
  this.directives(true);
  this.descend(true);
  var modelExp = inputElement.attr('ng:model');
  return modelExp &&
    annotate('$defer', '$formFactory', function($defer, $formFactory, inputElement){
      var form = $formFactory.forElement(inputElement),
          // We have to use .getAttribute, since jQuery tries to be smart and use the
          // type property. Trouble is some browser change unknown to text.
          type = lowercase(inputElement[0].getAttribute('type')) || 'text',
          TypeController,
          bindAttr = fromJson(inputElement.attr('ng:bind-attr') || '{}'),
          modelScope = this,
          widget, match,
          loadFromScope = type.match(/^\s*scope\:\s*(.*)/);

      TypeController = (loadFromScope
              ? (this.$eval(snakeToCamel(loadFromScope[1]))||{}).$unboundFn
              : angularInputType(type)) || noop;

      if (!HTML5_INPUTS_TYPES[type]) {
        try {
          // jquery will not let you so we have to go to bare metal
          inputElement[0].setAttribute('type', 'text');
        } catch(e){
          // also tuns out that ie8 will not allow changing of types, but since it is not
          // html5 anyway we can ignore the error.
        }
      }

      !TypeController.$inject && (TypeController.$inject = []);
      widget = form.$createWidget(modelScope, modelExp, inputElement.attr('ng:change'),
          inputElement.attr('name'), TypeController, inputElement);

      watchElementProperty(widget, 'required', inputElement);
      watchElementProperty(widget, 'readonly', inputElement);
      watchElementProperty(widget, 'disabled', inputElement);


      widget.$pristine = !(widget.$dirty = false);

      widget.$on('$validate', function(event) {
        var inValid = widget.$required && !trim(widget.$viewValue);
        if (widget.$error.REQUIRED != inValid){
          widget.$emit(inValid ? '$invalid' : '$valid', 'REQUIRED');
        }
      });

      forEach(['valid', 'invalid', 'pristine', 'dirty'], function (name) {
        widget.$watch('$' + name, function(scope, value) {
            inputElement[value ? 'addClass' : 'removeClass']('ng-' + name);
          }
        );
      });

      inputElement.bind('$destroy', function(){
        widget.$destroy();
      });

      if (type != 'checkbox' && type != 'radio') {
        // TODO (misko): checkbox / radio does not really belong here, but until we can do
        // widget registration with CSS, we are hacking it this way.
        widget.$render = function() {
          inputElement.val(widget.$viewValue || '');
        };

        inputElement.bind('keydown change', function(event){
          // TODO (misko): only fire when there is a key which changes value
          $defer(function(){
            widget.$dirty = !(widget.$pristine = false);
            var value = trim(inputElement.val());
            if (widget.$viewValue !== value ) {
              widget.$emit('$viewChange', value);
            }
          });
        });
      }
    });

});

angularWidget('textarea', angularWidget('input'));


function watchElementProperty(widget, name, element) {
  var bindAttr = fromJson(element.attr('ng:bind-attr') || '{}'),
      match = /\s*{{(.*)}}\s*/.exec(bindAttr[name]);
  widget['$' + name] =
    // some browsers return true some '' when required is set without value.
    isString(element.prop(name)) || !!element.prop(name) ||
    // this is neede for ie9, since it will treate boolean attributes as false
    !!element[0].attributes[name];
  if (bindAttr[name] && match) {
    widget.$modelScope.$watch(match[1], function(scope, value){
      widget['$' + name] = !!value;
      widget.$emit('$validate');
    });
  }
}

