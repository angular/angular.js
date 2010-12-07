extend(angularValidator, {
  'noop': function() { return _null; },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.regexp
   * @description
   * Use regexp validator to restrict the input to any Regular Expression.
   * 
   * @param {string} value value to validate
   * @param {regexp} expression regular expression.
   * @css ng-validation-error
   * 
   * @example
   * <script> var ssn = /^\d\d\d-\d\d-\d\d\d\d$/; </script>
   * Enter valid SSN:
   * <input name="ssn" value="123-45-6789" ng:validate="regexp:$window.ssn" >
   * 
   * @scenario
   * it('should invalidate non ssn', function(){
   *   var textBox = element('.doc-example :input');
   *   expect(textBox.attr('className')).not().toMatch(/ng-validation-error/);
   *   expect(textBox.val()).toEqual('123-45-6789');
   *   
   *   input('ssn').enter('123-45-67890');
   *   expect(textBox.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return _null;
    }
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.number
   * @description
   * Use number validator to restrict the input to numbers with an 
   * optional range. (See integer for whole numbers validator).
   * 
   * @param {string} value value to validate
   * @param {int=} [min=MIN_INT] minimum value.
   * @param {int=} [max=MAX_INT] maximum value.
   * @css ng-validation-error
   * 
   * @example
   * Enter number: <input name="n1" ng:validate="number" > <br>
   * Enter number greater than 10: <input name="n2" ng:validate="number:10" > <br>
   * Enter number between 100 and 200: <input name="n3" ng:validate="number:100:200" > <br>
   * 
   * @scenario
   * it('should invalidate number', function(){
   *   var n1 = element('.doc-example :input[name=n1]');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n1').enter('1.x');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n2 = element('.doc-example :input[name=n2]');
   *   expect(n2.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n2').enter('9');
   *   expect(n2.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n3 = element('.doc-example :input[name=n3]');
   *   expect(n3.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n3').enter('201');
   *   expect(n3.attr('className')).toMatch(/ng-validation-error/);
   *   
   * });
   * 
   */
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

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.integer
   * @description
   * Use number validator to restrict the input to integers with an 
   * optional range. (See integer for whole numbers validator).
   * 
   * @param {string} value value to validate
   * @param {int=} [min=MIN_INT] minimum value.
   * @param {int=} [max=MAX_INT] maximum value.
   * @css ng-validation-error
   * 
   * @example
   * Enter integer: <input name="n1" ng:validate="integer" > <br>
   * Enter integer equal or greater than 10: <input name="n2" ng:validate="integer:10" > <br>
   * Enter integer between 100 and 200 (inclusive): <input name="n3" ng:validate="integer:100:200" > <br>
   * 
   * @scenario
   * it('should invalidate integer', function(){
   *   var n1 = element('.doc-example :input[name=n1]');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n1').enter('1.1');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n2 = element('.doc-example :input[name=n2]');
   *   expect(n2.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n2').enter('10.1');
   *   expect(n2.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n3 = element('.doc-example :input[name=n3]');
   *   expect(n3.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n3').enter('100.1');
   *   expect(n3.attr('className')).toMatch(/ng-validation-error/);
   *   
   * });
   */
  'integer': function(value, min, max) {
    var numberError = angularValidator['number'](value, min, max);
    if (numberError) return numberError;
    if (!("" + value).match(/^\s*[\d+]*\s*$/) || value != Math.round(value)) {
      return "Not a whole number";
    }
    return _null;
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.date
   * @description
   * Use date validator to restrict the user input to a valid date
   * in format in format MM/DD/YYYY.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid date:
   * <input name="text" value="1/1/2009" ng:validate="date" >
   * 
   * @scenario
   * it('should invalidate date', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('123/123/123');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'date': function(value) {
    var fields = /^(\d\d?)\/(\d\d?)\/(\d\d\d\d)$/.exec(value);
    var date = fields ? new Date(fields[3], fields[1]-1, fields[2]) : 0;
    return (date &&
            date.getFullYear() == fields[3] &&
            date.getMonth() == fields[1]-1 &&
            date.getDate() == fields[2]) ?
              _null : "Value is not a date. (Expecting format: 12/31/2009).";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.email
   * @description
   * Use email validator if you wist to restrict the user input to a valid email.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid email:
   * <input name="text" ng:validate="email" value="me@example.com">
   * 
   * @scenario
   * it('should invalidate email', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('a@b.c');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return _null;
    }
    return "Email needs to be in username@host.com format.";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.phone
   * @description
   * Use phone validator to restrict the input phone numbers.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid phone number:
   * <input name="text" value="1(234)567-8901" ng:validate="phone" >
   * 
   * @scenario
   * it('should invalidate phone', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('+12345678');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return _null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return _null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.url
   * @description
   * Use phone validator to restrict the input URLs.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid phone number:
   * <input name="text" value="http://example.com/abc.html" size="40" ng:validate="url" >
   * 
   * @scenario
   * it('should invalidate url', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('abc://server/path');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
      return _null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.json
   * @description
   * Use json validator if you wish to restrict the user input to a valid JSON.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * <textarea name="json" cols="60" rows="5" ng:validate="json">
   * {name:'abc'}
   * </textarea>
   * 
   * @scenario
   * it('should invalidate json', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('json').enter('{name}');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'json': function(value) {
    try {
      fromJson(value);
      return _null;
    } catch (e) {
      return e.toString();
    }
  },

  /**
   * @workInProgress
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
   *   var textBox = element('.doc-example :input');
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
        element.data($$validate)();
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
