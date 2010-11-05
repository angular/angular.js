extend(angularValidator, {
  'noop': function() { return _null; },

  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return _null;
    }
  },

  'number': function(value, min, max) {
    var num = 1 * value;
    if (num == value) {
      if (typeof min != $undefined && num < min) {
        return "Value can not be less than " + min + ".";
      }
      if (typeof min != $undefined && num > max) {
        return "Value can not be greater than " + max + ".";
      }
      return _null;
    } else {
      return "Not a number";
    }
  },

  'integer': function(value, min, max) {
    var numberError = angularValidator['number'](value, min, max);
    if (numberError) return numberError;
    if (!("" + value).match(/^\s*[\d+]*\s*$/) || value != Math.round(value)) {
      return "Not a whole number";
    }
    return _null;
  },

  'date': function(value) {
    var fields = /^(\d\d?)\/(\d\d?)\/(\d\d\d\d)$/.exec(value);
    var date = fields ? new Date(fields[3], fields[1]-1, fields[2]) : 0;
    return (date &&
            date.getFullYear() == fields[3] &&
            date.getMonth() == fields[1]-1 &&
            date.getDate() == fields[2]) ?
              _null : "Value is not a date. (Expecting format: 12/31/2009).";
  },

  'ssn': function(value) {
    if (value.match(/^\d\d\d-\d\d-\d\d\d\d$/)) {
      return _null;
    }
    return "SSN needs to be in 999-99-9999 format.";
  },

  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return _null;
    }
    return "Email needs to be in username@host.com format.";
  },

  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return _null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return _null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
  },

  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
      return _null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },

  'json': function(value) {
    try {
      fromJson(value);
      return _null;
    } catch (e) {
      return e.toString();
    }
  },

  /**
   * @ngdoc validator
   * @name angular.validator.asynchronous
   * @description
   * Use asynchronous validator if the validation can not be computed 
   * immediately, but is provided through a callback. The widget 
   * automatically shows a spinning indicator while the validity of 
   * the widget is computed. This validator caches the result.
   * 
   * @param {string} value value to validate
   * @param {function(inputToValidate,validationDone)} validate function to call to validate the state
   *         of the input.
   * @param {function(data)=} [update=noop] function to call when state of the 
   *    validator changes
   *    
   * @paramDescription
   * The `validate` function (specified by you) is called as 
   * `validate(inputToValidate, validationDone)`:
   * 
   *    * `inputToValidate`: value of the input box.
   *    * `validationDone`: `function(error, data){...}`
   *       * `error`: error text to display if validation fails
   *       * `data`: data object to pass to update function
   *       
   * The `update` function is optionally specified by you and is
   * called by <angular/> on input change. Since the 
   * asynchronous validator caches the results, the update 
   * function can be called without a call to `validate` 
   * function. The function is called as `update(data)`:
   * 
   *    * `data`: data object as passed from validate function
   * 
   * @css ng-input-indicator-wait, ng-validation-error
   * 
   * @exampleDescription
   * <pre>
   * function myValidator (inputToValidate, validationDone) {
   *  // simulate delayed response, validate on even input length
   *  setTimeout(function(){
   *    validationDone(inputToValidate.length % 2);
   *  }, 500);
   * };
   * </pre>
   * 
   * @example
   * <script>
   *   function myValidator(inputToValidate, validationDone) {
   *    setTimeout(function(){
   *      validationDone(inputToValidate.length % 2);
   *    }, 500);
   *  }
   * </script>
   *  This input is validated asynchronously:
   *  <input name="text" ng:validate="asynchronous:$window.myValidator">
   * 
   * @scenario
   * it('should change color in delayed way', function(){
   *   var textBox = element('.example :input');
   *   expect(textBox.attr('className')).not().toMatch(/ng-input-indicator-wait/);
   *   expect(textBox.attr('className')).not().toMatch(/ng-validation-error/);
   *   
   *   input('text').enter('X');
   *   expect(textBox.attr('className')).toMatch(/ng-input-indicator-wait/);
   *   
   *   pause(.6);
   *   
   *   expect(textBox.attr('className')).not().toMatch(/ng-input-indicator-wait/);
   *   expect(textBox.attr('className')).toMatch(/ng-validation-error/);
   *   
   * });
   * 
   */
  /*
   * cache is attached to the element
   * cache: {
   *   inputs : {
   *     'user input': {
   *        response: server response,
   *        error: validation error
   *     },
   *   current: 'current input'
   * }
   *
   */
  'asynchronous': function(input, asynchronousFn, updateFn) {
    if (!input) return;
    var scope = this;
    var element = scope.$element;
    var cache = element.data('$asyncValidator');
    if (!cache) {
      element.data('$asyncValidator', cache = {inputs:{}});
    }

    cache.current = input;

    var inputState = cache.inputs[input];
    if (!inputState) {
      cache.inputs[input] = inputState = { inFlight: true };
      scope.$invalidWidgets.markInvalid(scope.$element);
      element.addClass('ng-input-indicator-wait');
      asynchronousFn(input, function(error, data) {
        inputState.response = data;
        inputState.error = error;
        inputState.inFlight = false;
        if (cache.current == input) {
          element.removeClass('ng-input-indicator-wait');
          scope.$invalidWidgets.markValid(element);
        }
        element.data('$validate')();
        scope.$root.$eval();
      });
    } else if (inputState.inFlight) {
      // request in flight, mark widget invalid, but don't show it to user
      scope.$invalidWidgets.markInvalid(scope.$element);
    } else {
      (updateFn||noop)(inputState.response);
    }
    return inputState.error;
  }

});
