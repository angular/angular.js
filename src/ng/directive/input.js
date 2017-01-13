'use strict';

/* global
  VALID_CLASS: false,
  INVALID_CLASS: false,
  PRISTINE_CLASS: false,
  DIRTY_CLASS: false,
  ngModelMinErr: false
*/

// Regex code was initially obtained from SO prior to modification: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime#answer-3143231
var ISO_DATE_REGEXP = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/;
// See valid URLs in RFC3987 (http://tools.ietf.org/html/rfc3987)
// Note: We are being more lenient, because browsers are too.
//   1. Scheme
//   2. Slashes
//   3. Username
//   4. Password
//   5. Hostname
//   6. Port
//   7. Path
//   8. Query
//   9. Fragment
//                 1111111111111111 222   333333    44444        55555555555555555555555     666     77777777     8888888     999
var URL_REGEXP = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;
// eslint-disable-next-line max-len
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
var DATE_REGEXP = /^(\d{4,})-(\d{2})-(\d{2})$/;
var DATETIMELOCAL_REGEXP = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
var WEEK_REGEXP = /^(\d{4,})-W(\d\d)$/;
var MONTH_REGEXP = /^(\d{4,})-(\d\d)$/;
var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;

var PARTIAL_VALIDATION_EVENTS = 'keydown wheel mousedown';
var PARTIAL_VALIDATION_TYPES = createMap();
forEach('date,datetime-local,month,time,week'.split(','), function(type) {
  PARTIAL_VALIDATION_TYPES[type] = true;
});

var inputType = {

  /**
   * @ngdoc input
   * @name input[text]
   *
   * @description
   * Standard HTML text input with angular data binding, inherited by most of the `input` elements.
   *
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Adds `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the Angular expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trim the input.
   *    This parameter is ignored for input[type=password] controls, which will never trim the
   *    input.
   *
   * @example
      <example name="text-input-directive" module="textInputExample">
        <file name="index.html">
         <script>
           angular.module('textInputExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.example = {
                 text: 'guest',
                 word: /^\s*\w*\s*$/
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>Single word:
             <input type="text" name="input" ng-model="example.text"
                    ng-pattern="example.word" required ng-trim="false">
           </label>
           <div role="alert">
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.pattern">
               Single word only!</span>
           </div>
           <code>text = {{example.text}}</code><br/>
           <code>myForm.input.$valid = {{myForm.input.$valid}}</code><br/>
           <code>myForm.input.$error = {{myForm.input.$error}}</code><br/>
           <code>myForm.$valid = {{myForm.$valid}}</code><br/>
           <code>myForm.$error.required = {{!!myForm.$error.required}}</code><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          var text = element(by.binding('example.text'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('example.text'));

          it('should initialize to model', function() {
            expect(text.getText()).toContain('guest');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');

            expect(text.getText()).toEqual('text =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if multi word', function() {
            input.clear();
            input.sendKeys('hello world');

            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'text': textInputType,

    /**
     * @ngdoc input
     * @name input[date]
     *
     * @description
     * Input with date validation and transformation. In browsers that do not yet support
     * the HTML5 date input, a text element will be used. In that case, text must be entered in a valid ISO-8601
     * date format (yyyy-MM-dd), for example: `2009-01-06`. Since many
     * modern browsers do not yet support this input type, it is important to provide cues to users on the
     * expected input format via a placeholder or label.
     *
     * The model must always be a Date object, otherwise Angular will throw an error.
     * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
     *
     * The timezone to be used to read/write the `Date` instance in the model can be defined using
     * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
     *
     * @param {string} ngModel Assignable angular expression to data-bind to.
     * @param {string=} name Property name of the form under which the control is published.
     * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`. This must be a
     *   valid ISO date string (yyyy-MM-dd). You can also use interpolation inside this attribute
     *   (e.g. `min="{{minDate | date:'yyyy-MM-dd'}}"`). Note that `min` will also add native HTML5
     *   constraint validation.
     * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`. This must be
     *   a valid ISO date string (yyyy-MM-dd). You can also use interpolation inside this attribute
     *   (e.g. `max="{{maxDate | date:'yyyy-MM-dd'}}"`). Note that `max` will also add native HTML5
     *   constraint validation.
     * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO date string
     *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
     * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO date string
     *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
     * @param {string=} required Sets `required` validation error key if the value is not entered.
     * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
     *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
     *    `required` when you want to data-bind to the `required` attribute.
     * @param {string=} ngChange Angular expression to be executed when input changes due to user
     *    interaction with the input element.
     *
     * @example
     <example name="date-input-directive" module="dateInputExample">
     <file name="index.html">
       <script>
          angular.module('dateInputExample', [])
            .controller('DateController', ['$scope', function($scope) {
              $scope.example = {
                value: new Date(2013, 9, 22)
              };
            }]);
       </script>
       <form name="myForm" ng-controller="DateController as dateCtrl">
          <label for="exampleInput">Pick a date in 2013:</label>
          <input type="date" id="exampleInput" name="input" ng-model="example.value"
              placeholder="yyyy-MM-dd" min="2013-01-01" max="2013-12-31" required />
          <div role="alert">
            <span class="error" ng-show="myForm.input.$error.required">
                Required!</span>
            <span class="error" ng-show="myForm.input.$error.date">
                Not a valid date!</span>
           </div>
           <tt>value = {{example.value | date: "yyyy-MM-dd"}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
       </form>
     </file>
     <file name="protractor.js" type="protractor">
        var value = element(by.binding('example.value | date: "yyyy-MM-dd"'));
        var valid = element(by.binding('myForm.input.$valid'));

        // currently protractor/webdriver does not support
        // sending keys to all known HTML5 input controls
        // for various browsers (see https://github.com/angular/protractor/issues/562).
        function setInput(val) {
          // set the value of the element and force validation.
          var scr = "var ipt = document.getElementById('exampleInput'); " +
          "ipt.value = '" + val + "';" +
          "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
          browser.executeScript(scr);
        }

        it('should initialize to model', function() {
          expect(value.getText()).toContain('2013-10-22');
          expect(valid.getText()).toContain('myForm.input.$valid = true');
        });

        it('should be invalid if empty', function() {
          setInput('');
          expect(value.getText()).toEqual('value =');
          expect(valid.getText()).toContain('myForm.input.$valid = false');
        });

        it('should be invalid if over max', function() {
          setInput('2015-01-01');
          expect(value.getText()).toContain('');
          expect(valid.getText()).toContain('myForm.input.$valid = false');
        });
     </file>
     </example>
     */
  'date': createDateInputType('date', DATE_REGEXP,
         createDateParser(DATE_REGEXP, ['yyyy', 'MM', 'dd']),
         'yyyy-MM-dd'),

   /**
    * @ngdoc input
    * @name input[datetime-local]
    *
    * @description
    * Input with datetime validation and transformation. In browsers that do not yet support
    * the HTML5 date input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
    * local datetime format (yyyy-MM-ddTHH:mm:ss), for example: `2010-12-28T14:57:00`.
    *
    * The model must always be a Date object, otherwise Angular will throw an error.
    * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
    *
    * The timezone to be used to read/write the `Date` instance in the model can be defined using
    * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
    *
    * @param {string} ngModel Assignable angular expression to data-bind to.
    * @param {string=} name Property name of the form under which the control is published.
    * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
    *   This must be a valid ISO datetime format (yyyy-MM-ddTHH:mm:ss). You can also use interpolation
    *   inside this attribute (e.g. `min="{{minDatetimeLocal | date:'yyyy-MM-ddTHH:mm:ss'}}"`).
    *   Note that `min` will also add native HTML5 constraint validation.
    * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
    *   This must be a valid ISO datetime format (yyyy-MM-ddTHH:mm:ss). You can also use interpolation
    *   inside this attribute (e.g. `max="{{maxDatetimeLocal | date:'yyyy-MM-ddTHH:mm:ss'}}"`).
    *   Note that `max` will also add native HTML5 constraint validation.
    * @param {(date|string)=} ngMin Sets the `min` validation error key to the Date / ISO datetime string
    *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
    * @param {(date|string)=} ngMax Sets the `max` validation error key to the Date / ISO datetime string
    *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
    * @param {string=} required Sets `required` validation error key if the value is not entered.
    * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
    *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
    *    `required` when you want to data-bind to the `required` attribute.
    * @param {string=} ngChange Angular expression to be executed when input changes due to user
    *    interaction with the input element.
    *
    * @example
    <example name="datetimelocal-input-directive" module="dateExample">
    <file name="index.html">
      <script>
        angular.module('dateExample', [])
          .controller('DateController', ['$scope', function($scope) {
            $scope.example = {
              value: new Date(2010, 11, 28, 14, 57)
            };
          }]);
      </script>
      <form name="myForm" ng-controller="DateController as dateCtrl">
        <label for="exampleInput">Pick a date between in 2013:</label>
        <input type="datetime-local" id="exampleInput" name="input" ng-model="example.value"
            placeholder="yyyy-MM-ddTHH:mm:ss" min="2001-01-01T00:00:00" max="2013-12-31T00:00:00" required />
        <div role="alert">
          <span class="error" ng-show="myForm.input.$error.required">
              Required!</span>
          <span class="error" ng-show="myForm.input.$error.datetimelocal">
              Not a valid date!</span>
        </div>
        <tt>value = {{example.value | date: "yyyy-MM-ddTHH:mm:ss"}}</tt><br/>
        <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
        <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
        <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
        <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
      </form>
    </file>
    <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "yyyy-MM-ddTHH:mm:ss"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('2010-12-28T14:57:00');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('2015-01-01T23:59:00');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
    </file>
    </example>
    */
  'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP,
      createDateParser(DATETIMELOCAL_REGEXP, ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'sss']),
      'yyyy-MM-ddTHH:mm:ss.sss'),

  /**
   * @ngdoc input
   * @name input[time]
   *
   * @description
   * Input with time validation and transformation. In browsers that do not yet support
   * the HTML5 time input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
   * local time format (HH:mm:ss), for example: `14:57:00`. Model must be a Date object. This binding will always output a
   * Date object to the model of January 1, 1970, or local date `new Date(1970, 0, 1, HH, mm, ss)`.
   *
   * The model must always be a Date object, otherwise Angular will throw an error.
   * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
   *
   * The timezone to be used to read/write the `Date` instance in the model can be defined using
   * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   *   This must be a valid ISO time format (HH:mm:ss). You can also use interpolation inside this
   *   attribute (e.g. `min="{{minTime | date:'HH:mm:ss'}}"`). Note that `min` will also add
   *   native HTML5 constraint validation.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   *   This must be a valid ISO time format (HH:mm:ss). You can also use interpolation inside this
   *   attribute (e.g. `max="{{maxTime | date:'HH:mm:ss'}}"`). Note that `max` will also add
   *   native HTML5 constraint validation.
   * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO time string the
   *   `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
   * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO time string the
   *   `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
   <example name="time-input-directive" module="timeExample">
   <file name="index.html">
     <script>
      angular.module('timeExample', [])
        .controller('DateController', ['$scope', function($scope) {
          $scope.example = {
            value: new Date(1970, 0, 1, 14, 57, 0)
          };
        }]);
     </script>
     <form name="myForm" ng-controller="DateController as dateCtrl">
        <label for="exampleInput">Pick a time between 8am and 5pm:</label>
        <input type="time" id="exampleInput" name="input" ng-model="example.value"
            placeholder="HH:mm:ss" min="08:00:00" max="17:00:00" required />
        <div role="alert">
          <span class="error" ng-show="myForm.input.$error.required">
              Required!</span>
          <span class="error" ng-show="myForm.input.$error.time">
              Not a valid date!</span>
        </div>
        <tt>value = {{example.value | date: "HH:mm:ss"}}</tt><br/>
        <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
        <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
        <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
        <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
     </form>
   </file>
   <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "HH:mm:ss"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('14:57:00');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('23:59:00');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
   </file>
   </example>
   */
  'time': createDateInputType('time', TIME_REGEXP,
      createDateParser(TIME_REGEXP, ['HH', 'mm', 'ss', 'sss']),
     'HH:mm:ss.sss'),

   /**
    * @ngdoc input
    * @name input[week]
    *
    * @description
    * Input with week-of-the-year validation and transformation to Date. In browsers that do not yet support
    * the HTML5 week input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
    * week format (yyyy-W##), for example: `2013-W02`.
    *
    * The model must always be a Date object, otherwise Angular will throw an error.
    * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
    *
    * The timezone to be used to read/write the `Date` instance in the model can be defined using
    * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
    *
    * @param {string} ngModel Assignable angular expression to data-bind to.
    * @param {string=} name Property name of the form under which the control is published.
    * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
    *   This must be a valid ISO week format (yyyy-W##). You can also use interpolation inside this
    *   attribute (e.g. `min="{{minWeek | date:'yyyy-Www'}}"`). Note that `min` will also add
    *   native HTML5 constraint validation.
    * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
    *   This must be a valid ISO week format (yyyy-W##). You can also use interpolation inside this
    *   attribute (e.g. `max="{{maxWeek | date:'yyyy-Www'}}"`). Note that `max` will also add
    *   native HTML5 constraint validation.
    * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO week string
    *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
    * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO week string
    *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
    * @param {string=} required Sets `required` validation error key if the value is not entered.
    * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
    *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
    *    `required` when you want to data-bind to the `required` attribute.
    * @param {string=} ngChange Angular expression to be executed when input changes due to user
    *    interaction with the input element.
    *
    * @example
    <example name="week-input-directive" module="weekExample">
    <file name="index.html">
      <script>
      angular.module('weekExample', [])
        .controller('DateController', ['$scope', function($scope) {
          $scope.example = {
            value: new Date(2013, 0, 3)
          };
        }]);
      </script>
      <form name="myForm" ng-controller="DateController as dateCtrl">
        <label>Pick a date between in 2013:
          <input id="exampleInput" type="week" name="input" ng-model="example.value"
                 placeholder="YYYY-W##" min="2012-W32"
                 max="2013-W52" required />
        </label>
        <div role="alert">
          <span class="error" ng-show="myForm.input.$error.required">
              Required!</span>
          <span class="error" ng-show="myForm.input.$error.week">
              Not a valid date!</span>
        </div>
        <tt>value = {{example.value | date: "yyyy-Www"}}</tt><br/>
        <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
        <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
        <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
        <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
      </form>
    </file>
    <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "yyyy-Www"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('2013-W01');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('2015-W01');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
    </file>
    </example>
    */
  'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),

  /**
   * @ngdoc input
   * @name input[month]
   *
   * @description
   * Input with month validation and transformation. In browsers that do not yet support
   * the HTML5 month input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
   * month format (yyyy-MM), for example: `2009-01`.
   *
   * The model must always be a Date object, otherwise Angular will throw an error.
   * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
   * If the model is not set to the first of the month, the next view to model update will set it
   * to the first of the month.
   *
   * The timezone to be used to read/write the `Date` instance in the model can be defined using
   * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   *   This must be a valid ISO month format (yyyy-MM). You can also use interpolation inside this
   *   attribute (e.g. `min="{{minMonth | date:'yyyy-MM'}}"`). Note that `min` will also add
   *   native HTML5 constraint validation.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   *   This must be a valid ISO month format (yyyy-MM). You can also use interpolation inside this
   *   attribute (e.g. `max="{{maxMonth | date:'yyyy-MM'}}"`). Note that `max` will also add
   *   native HTML5 constraint validation.
   * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO week string
   *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
   * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO week string
   *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.

   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
   <example name="month-input-directive" module="monthExample">
   <file name="index.html">
     <script>
      angular.module('monthExample', [])
        .controller('DateController', ['$scope', function($scope) {
          $scope.example = {
            value: new Date(2013, 9, 1)
          };
        }]);
     </script>
     <form name="myForm" ng-controller="DateController as dateCtrl">
       <label for="exampleInput">Pick a month in 2013:</label>
       <input id="exampleInput" type="month" name="input" ng-model="example.value"
          placeholder="yyyy-MM" min="2013-01" max="2013-12" required />
       <div role="alert">
         <span class="error" ng-show="myForm.input.$error.required">
            Required!</span>
         <span class="error" ng-show="myForm.input.$error.month">
            Not a valid month!</span>
       </div>
       <tt>value = {{example.value | date: "yyyy-MM"}}</tt><br/>
       <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
       <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
       <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
       <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
     </form>
   </file>
   <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "yyyy-MM"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('2013-10');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('2015-01');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
   </file>
   </example>
   */
  'month': createDateInputType('month', MONTH_REGEXP,
     createDateParser(MONTH_REGEXP, ['yyyy', 'MM']),
     'yyyy-MM'),

  /**
   * @ngdoc input
   * @name input[number]
   *
   * @description
   * Text input with number validation and transformation. Sets the `number` validation
   * error if not a valid number.
   *
   * <div class="alert alert-warning">
   * The model must always be of type `number` otherwise Angular will throw an error.
   * Be aware that a string containing a number is not enough. See the {@link ngModel:numfmt}
   * error docs for more information and an example of how to convert your model if necessary.
   * </div>
   *
   * ## Issues with HTML5 constraint validation
   *
   * In browsers that follow the
   * [HTML5 specification](https://html.spec.whatwg.org/multipage/forms.html#number-state-%28type=number%29),
   * `input[number]` does not work as expected with {@link ngModelOptions `ngModelOptions.allowInvalid`}.
   * If a non-number is entered in the input, the browser will report the value as an empty string,
   * which means the view / model values in `ngModel` and subsequently the scope value
   * will also be an empty string.
   *
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   *    Can be interpolated.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   *    Can be interpolated.
   * @param {string=} ngMin Like `min`, sets the `min` validation error key if the value entered is less than `ngMin`,
   *    but does not trigger HTML5 native validation. Takes an expression.
   * @param {string=} ngMax Like `max`, sets the `max` validation error key if the value entered is greater than `ngMax`,
   *    but does not trigger HTML5 native validation. Takes an expression.
   * @param {string=} step Sets the `step` validation error key if the value entered does not fit the `step` constraint.
   *    Can be interpolated.
   * @param {string=} ngStep Like `step`, sets the `step` validation error key if the value entered does not fit the `ngStep` constraint,
   *    but does not trigger HTML5 native validation. Takes an expression.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the Angular expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="number-input-directive" module="numberExample">
        <file name="index.html">
         <script>
           angular.module('numberExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.example = {
                 value: 12
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>Number:
             <input type="number" name="input" ng-model="example.value"
                    min="0" max="99" required>
          </label>
           <div role="alert">
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.number">
               Not valid number!</span>
           </div>
           <tt>value = {{example.value}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          var value = element(by.binding('example.value'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('example.value'));

          it('should initialize to model', function() {
            expect(value.getText()).toContain('12');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');
            expect(value.getText()).toEqual('value =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if over max', function() {
            input.clear();
            input.sendKeys('123');
            expect(value.getText()).toEqual('value =');
            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'number': numberInputType,


  /**
   * @ngdoc input
   * @name input[url]
   *
   * @description
   * Text input with URL validation. Sets the `url` validation error key if the content is not a
   * valid URL.
   *
   * <div class="alert alert-warning">
   * **Note:** `input[url]` uses a regex to validate urls that is derived from the regex
   * used in Chromium. If you need stricter validation, you can use `ng-pattern` or modify
   * the built-in validators (see the {@link guide/forms Forms guide})
   * </div>
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the Angular expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="url-input-directive" module="urlExample">
        <file name="index.html">
         <script>
           angular.module('urlExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.url = {
                 text: 'http://google.com'
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>URL:
             <input type="url" name="input" ng-model="url.text" required>
           <label>
           <div role="alert">
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.url">
               Not valid url!</span>
           </div>
           <tt>text = {{url.text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
           <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          var text = element(by.binding('url.text'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('url.text'));

          it('should initialize to model', function() {
            expect(text.getText()).toContain('http://google.com');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');

            expect(text.getText()).toEqual('text =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if not url', function() {
            input.clear();
            input.sendKeys('box');

            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'url': urlInputType,


  /**
   * @ngdoc input
   * @name input[email]
   *
   * @description
   * Text input with email validation. Sets the `email` validation error key if not a valid email
   * address.
   *
   * <div class="alert alert-warning">
   * **Note:** `input[email]` uses a regex to validate email addresses that is derived from the regex
   * used in Chromium. If you need stricter validation (e.g. requiring a top-level domain), you can
   * use `ng-pattern` or modify the built-in validators (see the {@link guide/forms Forms guide})
   * </div>
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the Angular expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="email-input-directive" module="emailExample">
        <file name="index.html">
         <script>
           angular.module('emailExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.email = {
                 text: 'me@example.com'
               };
             }]);
         </script>
           <form name="myForm" ng-controller="ExampleController">
             <label>Email:
               <input type="email" name="input" ng-model="email.text" required>
             </label>
             <div role="alert">
               <span class="error" ng-show="myForm.input.$error.required">
                 Required!</span>
               <span class="error" ng-show="myForm.input.$error.email">
                 Not valid email!</span>
             </div>
             <tt>text = {{email.text}}</tt><br/>
             <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
             <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
             <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
             <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
             <tt>myForm.$error.email = {{!!myForm.$error.email}}</tt><br/>
           </form>
         </file>
        <file name="protractor.js" type="protractor">
          var text = element(by.binding('email.text'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('email.text'));

          it('should initialize to model', function() {
            expect(text.getText()).toContain('me@example.com');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');
            expect(text.getText()).toEqual('text =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if not email', function() {
            input.clear();
            input.sendKeys('xxx');

            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'email': emailInputType,


  /**
   * @ngdoc input
   * @name input[radio]
   *
   * @description
   * HTML radio button.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string} value The value to which the `ngModel` expression should be set when selected.
   *    Note that `value` only supports `string` values, i.e. the scope model needs to be a string,
   *    too. Use `ngValue` if you need complex models (`number`, `object`, ...).
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {string} ngValue Angular expression to which `ngModel` will be be set when the radio
   *    is selected. Should be used instead of the `value` attribute if you need
   *    a non-string `ngModel` (`boolean`, `array`, ...).
   *
   * @example
      <example name="radio-input-directive" module="radioExample">
        <file name="index.html">
         <script>
           angular.module('radioExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.color = {
                 name: 'blue'
               };
               $scope.specialValue = {
                 "id": "12345",
                 "value": "green"
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>
             <input type="radio" ng-model="color.name" value="red">
             Red
           </label><br/>
           <label>
             <input type="radio" ng-model="color.name" ng-value="specialValue">
             Green
           </label><br/>
           <label>
             <input type="radio" ng-model="color.name" value="blue">
             Blue
           </label><br/>
           <tt>color = {{color.name | json}}</tt><br/>
          </form>
          Note that `ng-value="specialValue"` sets radio item's value to be the value of `$scope.specialValue`.
        </file>
        <file name="protractor.js" type="protractor">
          it('should change state', function() {
            var inputs = element.all(by.model('color.name'));
            var color = element(by.binding('color.name'));

            expect(color.getText()).toContain('blue');

            inputs.get(0).click();
            expect(color.getText()).toContain('red');

            inputs.get(1).click();
            expect(color.getText()).toContain('green');
          });
        </file>
      </example>
   */
  'radio': radioInputType,

  /**
   * @ngdoc input
   * @name input[range]
   *
   * @description
   * Native range input with validation and transformation.
   *
   * The model for the range input must always be a `Number`.
   *
   * IE9 and other browsers that do not support the `range` type fall back
   * to a text input without any default values for `min`, `max` and `step`. Model binding,
   * validation and number parsing are nevertheless supported.
   *
   * Browsers that support range (latest Chrome, Safari, Firefox, Edge) treat `input[range]`
   * in a way that never allows the input to hold an invalid value. That means:
   * - any non-numerical value is set to `(max + min) / 2`.
   * - any numerical value that is less than the current min val, or greater than the current max val
   * is set to the min / max val respectively.
   * - additionally, the current `step` is respected, so the nearest value that satisfies a step
   * is used.
   *
   * See the [HTML Spec on input[type=range]](https://www.w3.org/TR/html5/forms.html#range-state-(type=range))
   * for more info.
   *
   * This has the following consequences for Angular:
   *
   * Since the element value should always reflect the current model value, a range input
   * will set the bound ngModel expression to the value that the browser has set for the
   * input element. For example, in the following input `<input type="range" ng-model="model.value">`,
   * if the application sets `model.value = null`, the browser will set the input to `'50'`.
   * Angular will then set the model to `50`, to prevent input and model value being out of sync.
   *
   * That means the model for range will immediately be set to `50` after `ngModel` has been
   * initialized. It also means a range input can never have the required error.
   *
   * This does not only affect changes to the model value, but also to the values of the `min`,
   * `max`, and `step` attributes. When these change in a way that will cause the browser to modify
   * the input value, Angular will also update the model value.
   *
   * Automatic value adjustment also means that a range input element can never have the `required`,
   * `min`, or `max` errors.
   *
   * However, `step` is currently only fully implemented by Firefox. Other browsers have problems
   * when the step value changes dynamically - they do not adjust the element value correctly, but
   * instead may set the `stepMismatch` error. If that's the case, the Angular will set the `step`
   * error on the input, and set the model to `undefined`.
   *
   * Note that `input[range]` is not compatible with`ngMax`, `ngMin`, and `ngStep`, because they do
   * not set the `min` and `max` attributes, which means that the browser won't automatically adjust
   * the input value based on their values, and will always assume min = 0, max = 100, and step = 1.
   *
   * @param {string}  ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation to ensure that the value entered is greater
   *                  than `min`. Can be interpolated.
   * @param {string=} max Sets the `max` validation to ensure that the value entered is less than `max`.
   *                  Can be interpolated.
   * @param {string=} step Sets the `step` validation to ensure that the value entered matches the `step`
   *                  Can be interpolated.
   * @param {string=} ngChange Angular expression to be executed when the ngModel value changes due
   *                  to user interaction with the input element.
   * @param {expression=} ngChecked If the expression is truthy, then the `checked` attribute will be set on the
   *                      element. **Note** : `ngChecked` should not be used alongside `ngModel`.
   *                      Checkout {@link ng.directive:ngChecked ngChecked} for usage.
   *
   * @example
      <example name="range-input-directive" module="rangeExample">
        <file name="index.html">
          <script>
            angular.module('rangeExample', [])
              .controller('ExampleController', ['$scope', function($scope) {
                $scope.value = 75;
                $scope.min = 10;
                $scope.max = 90;
              }]);
          </script>
          <form name="myForm" ng-controller="ExampleController">

            Model as range: <input type="range" name="range" ng-model="value" min="{{min}}"  max="{{max}}">
            <hr>
            Model as number: <input type="number" ng-model="value"><br>
            Min: <input type="number" ng-model="min"><br>
            Max: <input type="number" ng-model="max"><br>
            value = <code>{{value}}</code><br/>
            myForm.range.$valid = <code>{{myForm.range.$valid}}</code><br/>
            myForm.range.$error = <code>{{myForm.range.$error}}</code>
          </form>
        </file>
      </example>

   * ## Range Input with ngMin & ngMax attributes

   * @example
      <example name="range-input-directive-ng" module="rangeExample">
        <file name="index.html">
          <script>
            angular.module('rangeExample', [])
              .controller('ExampleController', ['$scope', function($scope) {
                $scope.value = 75;
                $scope.min = 10;
                $scope.max = 90;
              }]);
          </script>
          <form name="myForm" ng-controller="ExampleController">
            Model as range: <input type="range" name="range" ng-model="value" ng-min="min" ng-max="max">
            <hr>
            Model as number: <input type="number" ng-model="value"><br>
            Min: <input type="number" ng-model="min"><br>
            Max: <input type="number" ng-model="max"><br>
            value = <code>{{value}}</code><br/>
            myForm.range.$valid = <code>{{myForm.range.$valid}}</code><br/>
            myForm.range.$error = <code>{{myForm.range.$error}}</code>
          </form>
        </file>
      </example>

   */
  'range': rangeInputType,

  /**
   * @ngdoc input
   * @name input[checkbox]
   *
   * @description
   * HTML checkbox.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
   * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="checkbox-input-directive" module="checkboxExample">
        <file name="index.html">
         <script>
           angular.module('checkboxExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.checkboxModel = {
                value1 : true,
                value2 : 'YES'
              };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>Value1:
             <input type="checkbox" ng-model="checkboxModel.value1">
           </label><br/>
           <label>Value2:
             <input type="checkbox" ng-model="checkboxModel.value2"
                    ng-true-value="'YES'" ng-false-value="'NO'">
            </label><br/>
           <tt>value1 = {{checkboxModel.value1}}</tt><br/>
           <tt>value2 = {{checkboxModel.value2}}</tt><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          it('should change state', function() {
            var value1 = element(by.binding('checkboxModel.value1'));
            var value2 = element(by.binding('checkboxModel.value2'));

            expect(value1.getText()).toContain('true');
            expect(value2.getText()).toContain('YES');

            element(by.model('checkboxModel.value1')).click();
            element(by.model('checkboxModel.value2')).click();

            expect(value1.getText()).toContain('false');
            expect(value2.getText()).toContain('NO');
          });
        </file>
      </example>
   */
  'checkbox': checkboxInputType,

  'hidden': noop,
  'button': noop,
  'submit': noop,
  'reset': noop,
  'file': noop
};

function stringBasedInputType(ctrl) {
  ctrl.$formatters.push(function(value) {
    return ctrl.$isEmpty(value) ? value : value.toString();
  });
}

function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);
}

function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  var type = lowercase(element[0].type);

  // In composition mode, users are still inputting intermediate text buffer,
  // hold the listener until composition is done.
  // More about composition events: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
  if (!$sniffer.android) {
    var composing = false;

    element.on('compositionstart', function() {
      composing = true;
    });

    element.on('compositionend', function() {
      composing = false;
      listener();
    });
  }

  var timeout;

  var listener = function(ev) {
    if (timeout) {
      $browser.defer.cancel(timeout);
      timeout = null;
    }
    if (composing) return;
    var value = element.val(),
        event = ev && ev.type;

    // By default we will trim the value
    // If the attribute ng-trim exists we will avoid trimming
    // If input type is 'password', the value is never trimmed
    if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
      value = trim(value);
    }

    // If a control is suffering from bad input (due to native validators), browsers discard its
    // value, so it may be necessary to revalidate (by calling $setViewValue again) even if the
    // control's value is the same empty value twice in a row.
    if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
      ctrl.$setViewValue(value, event);
    }
  };

  // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
  // input event on backspace, delete or cut
  if ($sniffer.hasEvent('input')) {
    element.on('input', listener);
  } else {
    var deferListener = function(ev, input, origValue) {
      if (!timeout) {
        timeout = $browser.defer(function() {
          timeout = null;
          if (!input || input.value !== origValue) {
            listener(ev);
          }
        });
      }
    };

    element.on('keydown', /** @this */ function(event) {
      var key = event.keyCode;

      // ignore
      //    command            modifiers                   arrows
      if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

      deferListener(event, this, this.value);
    });

    // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
    if ($sniffer.hasEvent('paste')) {
      element.on('paste cut', deferListener);
    }
  }

  // if user paste into input using mouse on older browser
  // or form autocomplete on newer browser, we need "change" event to catch it
  element.on('change', listener);

  // Some native input types (date-family) have the ability to change validity without
  // firing any input/change events.
  // For these event types, when native validators are present and the browser supports the type,
  // check for validity changes on various DOM events.
  if (PARTIAL_VALIDATION_TYPES[type] && ctrl.$$hasNativeValidators && type === attr.type) {
    element.on(PARTIAL_VALIDATION_EVENTS, /** @this */ function(ev) {
      if (!timeout) {
        var validity = this[VALIDITY_STATE_PROPERTY];
        var origBadInput = validity.badInput;
        var origTypeMismatch = validity.typeMismatch;
        timeout = $browser.defer(function() {
          timeout = null;
          if (validity.badInput !== origBadInput || validity.typeMismatch !== origTypeMismatch) {
            listener(ev);
          }
        });
      }
    });
  }

  ctrl.$render = function() {
    // Workaround for Firefox validation #12102.
    var value = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
    if (element.val() !== value) {
      element.val(value);
    }
  };
}

function weekParser(isoWeek, existingDate) {
  if (isDate(isoWeek)) {
    return isoWeek;
  }

  if (isString(isoWeek)) {
    WEEK_REGEXP.lastIndex = 0;
    var parts = WEEK_REGEXP.exec(isoWeek);
    if (parts) {
      var year = +parts[1],
          week = +parts[2],
          hours = 0,
          minutes = 0,
          seconds = 0,
          milliseconds = 0,
          firstThurs = getFirstThursdayOfYear(year),
          addDays = (week - 1) * 7;

      if (existingDate) {
        hours = existingDate.getHours();
        minutes = existingDate.getMinutes();
        seconds = existingDate.getSeconds();
        milliseconds = existingDate.getMilliseconds();
      }

      return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
    }
  }

  return NaN;
}

function createDateParser(regexp, mapping) {
  return function(iso, date) {
    var parts, map;

    if (isDate(iso)) {
      return iso;
    }

    if (isString(iso)) {
      // When a date is JSON'ified to wraps itself inside of an extra
      // set of double quotes. This makes the date parsing code unable
      // to match the date string and parse it as a date.
      if (iso.charAt(0) === '"' && iso.charAt(iso.length - 1) === '"') {
        iso = iso.substring(1, iso.length - 1);
      }
      if (ISO_DATE_REGEXP.test(iso)) {
        return new Date(iso);
      }
      regexp.lastIndex = 0;
      parts = regexp.exec(iso);

      if (parts) {
        parts.shift();
        if (date) {
          map = {
            yyyy: date.getFullYear(),
            MM: date.getMonth() + 1,
            dd: date.getDate(),
            HH: date.getHours(),
            mm: date.getMinutes(),
            ss: date.getSeconds(),
            sss: date.getMilliseconds() / 1000
          };
        } else {
          map = { yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0 };
        }

        forEach(parts, function(part, index) {
          if (index < mapping.length) {
            map[mapping[index]] = +part;
          }
        });
        return new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
      }
    }

    return NaN;
  };
}

function createDateInputType(type, regexp, parseDate, format) {
  return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
    badInputChecker(scope, element, attr, ctrl);
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var timezone = ctrl && ctrl.$options.getOption('timezone');
    var previousDate;

    ctrl.$$parserName = type;
    ctrl.$parsers.push(function(value) {
      if (ctrl.$isEmpty(value)) return null;
      if (regexp.test(value)) {
        // Note: We cannot read ctrl.$modelValue, as there might be a different
        // parser/formatter in the processing chain so that the model
        // contains some different data format!
        var parsedDate = parseDate(value, previousDate);
        if (timezone) {
          parsedDate = convertTimezoneToLocal(parsedDate, timezone);
        }
        return parsedDate;
      }
      return undefined;
    });

    ctrl.$formatters.push(function(value) {
      if (value && !isDate(value)) {
        throw ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
      }
      if (isValidDate(value)) {
        previousDate = value;
        if (previousDate && timezone) {
          previousDate = convertTimezoneToLocal(previousDate, timezone, true);
        }
        return $filter('date')(value, format, timezone);
      } else {
        previousDate = null;
        return '';
      }
    });

    if (isDefined(attr.min) || attr.ngMin) {
      var minVal;
      ctrl.$validators.min = function(value) {
        return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
      };
      attr.$observe('min', function(val) {
        minVal = parseObservedDateValue(val);
        ctrl.$validate();
      });
    }

    if (isDefined(attr.max) || attr.ngMax) {
      var maxVal;
      ctrl.$validators.max = function(value) {
        return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
      };
      attr.$observe('max', function(val) {
        maxVal = parseObservedDateValue(val);
        ctrl.$validate();
      });
    }

    function isValidDate(value) {
      // Invalid Date: getTime() returns NaN
      return value && !(value.getTime && value.getTime() !== value.getTime());
    }

    function parseObservedDateValue(val) {
      return isDefined(val) && !isDate(val) ? parseDate(val) || undefined : val;
    }
  };
}

function badInputChecker(scope, element, attr, ctrl) {
  var node = element[0];
  var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
  if (nativeValidation) {
    ctrl.$parsers.push(function(value) {
      var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
      return validity.badInput || validity.typeMismatch ? undefined : value;
    });
  }
}

function numberFormatterParser(ctrl) {
  ctrl.$$parserName = 'number';
  ctrl.$parsers.push(function(value) {
    if (ctrl.$isEmpty(value))      return null;
    if (NUMBER_REGEXP.test(value)) return parseFloat(value);
    return undefined;
  });

  ctrl.$formatters.push(function(value) {
    if (!ctrl.$isEmpty(value)) {
      if (!isNumber(value)) {
        throw ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
      }
      value = value.toString();
    }
    return value;
  });
}

function parseNumberAttrVal(val) {
  if (isDefined(val) && !isNumber(val)) {
    val = parseFloat(val);
  }
  return !isNumberNaN(val) ? val : undefined;
}

function isNumberInteger(num) {
  // See http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript#14794066
  // (minus the assumption that `num` is a number)

  // eslint-disable-next-line no-bitwise
  return (num | 0) === num;
}

function countDecimals(num) {
  var numString = num.toString();
  var decimalSymbolIndex = numString.indexOf('.');

  if (decimalSymbolIndex === -1) {
    if (-1 < num && num < 1) {
      // It may be in the exponential notation format (`1e-X`)
      var match = /e-(\d+)$/.exec(numString);

      if (match) {
        return Number(match[1]);
      }
    }

    return 0;
  }

  return numString.length - decimalSymbolIndex - 1;
}

function isValidForStep(viewValue, stepBase, step) {
  // At this point `stepBase` and `step` are expected to be non-NaN values
  // and `viewValue` is expected to be a valid stringified number.
  var value = Number(viewValue);

  var isNonIntegerValue = !isNumberInteger(value);
  var isNonIntegerStepBase = !isNumberInteger(stepBase);
  var isNonIntegerStep = !isNumberInteger(step);

  // Due to limitations in Floating Point Arithmetic (e.g. `0.3 - 0.2 !== 0.1` or
  // `0.5 % 0.1 !== 0`), we need to convert all numbers to integers.
  if (isNonIntegerValue || isNonIntegerStepBase || isNonIntegerStep) {
    var valueDecimals = isNonIntegerValue ? countDecimals(value) : 0;
    var stepBaseDecimals = isNonIntegerStepBase ? countDecimals(stepBase) : 0;
    var stepDecimals = isNonIntegerStep ? countDecimals(step) : 0;

    var decimalCount = Math.max(valueDecimals, stepBaseDecimals, stepDecimals);
    var multiplier = Math.pow(10, decimalCount);

    value = value * multiplier;
    stepBase = stepBase * multiplier;
    step = step * multiplier;

    if (isNonIntegerValue) value = Math.round(value);
    if (isNonIntegerStepBase) stepBase = Math.round(stepBase);
    if (isNonIntegerStep) step = Math.round(step);
  }

  return (value - stepBase) % step === 0;
}

function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  badInputChecker(scope, element, attr, ctrl);
  numberFormatterParser(ctrl);
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var minVal;
  var maxVal;

  if (isDefined(attr.min) || attr.ngMin) {
    ctrl.$validators.min = function(value) {
      return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
    };

    attr.$observe('min', function(val) {
      minVal = parseNumberAttrVal(val);
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    });
  }

  if (isDefined(attr.max) || attr.ngMax) {
    ctrl.$validators.max = function(value) {
      return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
    };

    attr.$observe('max', function(val) {
      maxVal = parseNumberAttrVal(val);
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    });
  }

  if (isDefined(attr.step) || attr.ngStep) {
    var stepVal;
    ctrl.$validators.step = function(modelValue, viewValue) {
      return ctrl.$isEmpty(viewValue) || isUndefined(stepVal) ||
             isValidForStep(viewValue, minVal || 0, stepVal);
    };

    attr.$observe('step', function(val) {
      stepVal = parseNumberAttrVal(val);
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    });
  }
}

function rangeInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  badInputChecker(scope, element, attr, ctrl);
  numberFormatterParser(ctrl);
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var supportsRange = ctrl.$$hasNativeValidators && element[0].type === 'range',
      minVal = supportsRange ? 0 : undefined,
      maxVal = supportsRange ? 100 : undefined,
      stepVal = supportsRange ? 1 : undefined,
      validity = element[0].validity,
      hasMinAttr = isDefined(attr.min),
      hasMaxAttr = isDefined(attr.max),
      hasStepAttr = isDefined(attr.step);

  var originalRender = ctrl.$render;

  ctrl.$render = supportsRange && isDefined(validity.rangeUnderflow) && isDefined(validity.rangeOverflow) ?
    //Browsers that implement range will set these values automatically, but reading the adjusted values after
    //$render would cause the min / max validators to be applied with the wrong value
    function rangeRender() {
      originalRender();
      ctrl.$setViewValue(element.val());
    } :
    originalRender;

  if (hasMinAttr) {
    ctrl.$validators.min = supportsRange ?
      // Since all browsers set the input to a valid value, we don't need to check validity
      function noopMinValidator() { return true; } :
      // non-support browsers validate the min val
      function minValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(minVal) || viewValue >= minVal;
      };

    setInitialValueAndObserver('min', minChange);
  }

  if (hasMaxAttr) {
    ctrl.$validators.max = supportsRange ?
      // Since all browsers set the input to a valid value, we don't need to check validity
      function noopMaxValidator() { return true; } :
      // non-support browsers validate the max val
      function maxValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(maxVal) || viewValue <= maxVal;
      };

    setInitialValueAndObserver('max', maxChange);
  }

  if (hasStepAttr) {
    ctrl.$validators.step = supportsRange ?
      function nativeStepValidator() {
        // Currently, only FF implements the spec on step change correctly (i.e. adjusting the
        // input element value to a valid value). It's possible that other browsers set the stepMismatch
        // validity error instead, so we can at least report an error in that case.
        return !validity.stepMismatch;
      } :
      // ngStep doesn't set the setp attr, so the browser doesn't adjust the input value as setting step would
      function stepValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(stepVal) ||
               isValidForStep(viewValue, minVal || 0, stepVal);
      };

    setInitialValueAndObserver('step', stepChange);
  }

  function setInitialValueAndObserver(htmlAttrName, changeFn) {
    // interpolated attributes set the attribute value only after a digest, but we need the
    // attribute value when the input is first rendered, so that the browser can adjust the
    // input value based on the min/max value
    element.attr(htmlAttrName, attr[htmlAttrName]);
    attr.$observe(htmlAttrName, changeFn);
  }

  function minChange(val) {
    minVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    if (supportsRange) {
      var elVal = element.val();
      // IE11 doesn't set the el val correctly if the minVal is greater than the element value
      if (minVal > elVal) {
        elVal = minVal;
        element.val(elVal);
      }
      ctrl.$setViewValue(elVal);
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }

  function maxChange(val) {
    maxVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    if (supportsRange) {
      var elVal = element.val();
      // IE11 doesn't set the el val correctly if the maxVal is less than the element value
      if (maxVal < elVal) {
        element.val(maxVal);
        // IE11 and Chrome don't set the value to the minVal when max < min
        elVal = maxVal < minVal ? minVal : maxVal;
      }
      ctrl.$setViewValue(elVal);
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }

  function stepChange(val) {
    stepVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    // Some browsers don't adjust the input value correctly, but set the stepMismatch error
    if (supportsRange && ctrl.$viewValue !== element.val()) {
      ctrl.$setViewValue(element.val());
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }
}

function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  // Note: no badInputChecker here by purpose as `url` is only a validation
  // in browsers, i.e. we can always read out input.value even if it is not valid!
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);

  ctrl.$$parserName = 'url';
  ctrl.$validators.url = function(modelValue, viewValue) {
    var value = modelValue || viewValue;
    return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
  };
}

function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  // Note: no badInputChecker here by purpose as `url` is only a validation
  // in browsers, i.e. we can always read out input.value even if it is not valid!
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);

  ctrl.$$parserName = 'email';
  ctrl.$validators.email = function(modelValue, viewValue) {
    var value = modelValue || viewValue;
    return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
  };
}

function radioInputType(scope, element, attr, ctrl) {
  var doTrim = !attr.ngTrim || trim(attr.ngTrim) !== 'false';
  // make the name unique, if not defined
  if (isUndefined(attr.name)) {
    element.attr('name', nextUid());
  }

  var listener = function(ev) {
    var value;
    if (element[0].checked) {
      value = attr.value;
      if (doTrim) {
        value = trim(value);
      }
      ctrl.$setViewValue(value, ev && ev.type);
    }
  };

  element.on('click', listener);

  ctrl.$render = function() {
    var value = attr.value;
    if (doTrim) {
      value = trim(value);
    }
    element[0].checked = (value === ctrl.$viewValue);
  };

  attr.$observe('value', ctrl.$render);
}

function parseConstantExpr($parse, context, name, expression, fallback) {
  var parseFn;
  if (isDefined(expression)) {
    parseFn = $parse(expression);
    if (!parseFn.constant) {
      throw ngModelMinErr('constexpr', 'Expected constant expression for `{0}`, but saw ' +
                                   '`{1}`.', name, expression);
    }
    return parseFn(context);
  }
  return fallback;
}

function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
  var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
  var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);

  var listener = function(ev) {
    ctrl.$setViewValue(element[0].checked, ev && ev.type);
  };

  element.on('click', listener);

  ctrl.$render = function() {
    element[0].checked = ctrl.$viewValue;
  };

  // Override the standard `$isEmpty` because the $viewValue of an empty checkbox is always set to `false`
  // This is because of the parser below, which compares the `$modelValue` with `trueValue` to convert
  // it to a boolean.
  ctrl.$isEmpty = function(value) {
    return value === false;
  };

  ctrl.$formatters.push(function(value) {
    return equals(value, trueValue);
  });

  ctrl.$parsers.push(function(value) {
    return value ? trueValue : falseValue;
  });
}


/**
 * @ngdoc directive
 * @name textarea
 * @restrict E
 *
 * @description
 * HTML textarea element control with angular data-binding. The data-binding and validation
 * properties of this element are exactly the same as those of the
 * {@link ng.directive:input input element}.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of any
 *    length.
 * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
 *    does not match a RegExp found by evaluating the Angular expression given in the attribute value.
 *    If the expression evaluates to a RegExp object, then this is used directly.
 *    If the expression evaluates to a string, then it will be converted to a RegExp
 *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
 *    `new RegExp('^abc$')`.<br />
 *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
 *    start at the index of the last search's match, thus not taking the whole input value into
 *    account.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trim the input.
 *
 * @knownIssue
 *
 * When specifying the `placeholder` attribute of `<textarea>`, Internet Explorer will temporarily
 * insert the placeholder value as the textarea's content. If the placeholder value contains
 * interpolation (`{{ ... }}`), an error will be logged in the console when Angular tries to update
 * the value of the by-then-removed text node. This doesn't affect the functionality of the
 * textarea, but can be undesirable.
 *
 * You can work around this Internet Explorer issue by using `ng-attr-placeholder` instead of
 * `placeholder` on textareas, whenever you need interpolation in the placeholder value. You can
 * find more details on `ngAttr` in the
 * [Interpolation](guide/interpolation#-ngattr-for-binding-to-arbitrary-attributes) section of the
 * Developer Guide.
 */


/**
 * @ngdoc directive
 * @name input
 * @restrict E
 *
 * @description
 * HTML input element control. When used together with {@link ngModel `ngModel`}, it provides data-binding,
 * input state control, and validation.
 * Input control follows HTML5 input types and polyfills the HTML5 validation behavior for older browsers.
 *
 * <div class="alert alert-warning">
 * **Note:** Not every feature offered is available for all input types.
 * Specifically, data binding and event handling via `ng-model` is unsupported for `input[file]`.
 * </div>
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {boolean=} ngRequired Sets `required` attribute if set to true
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of any
 *    length.
 * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
 *    value does not match a RegExp found by evaluating the Angular expression given in the attribute value.
 *    If the expression evaluates to a RegExp object, then this is used directly.
 *    If the expression evaluates to a string, then it will be converted to a RegExp
 *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
 *    `new RegExp('^abc$')`.<br />
 *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
 *    start at the index of the last search's match, thus not taking the whole input value into
 *    account.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trim the input.
 *    This parameter is ignored for input[type=password] controls, which will never trim the
 *    input.
 *
 * @example
    <example name="input-directive" module="inputExample">
      <file name="index.html">
       <script>
          angular.module('inputExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
              $scope.user = {name: 'guest', last: 'visitor'};
            }]);
       </script>
       <div ng-controller="ExampleController">
         <form name="myForm">
           <label>
              User name:
              <input type="text" name="userName" ng-model="user.name" required>
           </label>
           <div role="alert">
             <span class="error" ng-show="myForm.userName.$error.required">
              Required!</span>
           </div>
           <label>
              Last name:
              <input type="text" name="lastName" ng-model="user.last"
              ng-minlength="3" ng-maxlength="10">
           </label>
           <div role="alert">
             <span class="error" ng-show="myForm.lastName.$error.minlength">
               Too short!</span>
             <span class="error" ng-show="myForm.lastName.$error.maxlength">
               Too long!</span>
           </div>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br/>
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br/>
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br/>
         <tt>myForm.lastName.$error = {{myForm.lastName.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
         <tt>myForm.$error.minlength = {{!!myForm.$error.minlength}}</tt><br/>
         <tt>myForm.$error.maxlength = {{!!myForm.$error.maxlength}}</tt><br/>
       </div>
      </file>
      <file name="protractor.js" type="protractor">
        var user = element(by.exactBinding('user'));
        var userNameValid = element(by.binding('myForm.userName.$valid'));
        var lastNameValid = element(by.binding('myForm.lastName.$valid'));
        var lastNameError = element(by.binding('myForm.lastName.$error'));
        var formValid = element(by.binding('myForm.$valid'));
        var userNameInput = element(by.model('user.name'));
        var userLastInput = element(by.model('user.last'));

        it('should initialize to model', function() {
          expect(user.getText()).toContain('{"name":"guest","last":"visitor"}');
          expect(userNameValid.getText()).toContain('true');
          expect(formValid.getText()).toContain('true');
        });

        it('should be invalid if empty when required', function() {
          userNameInput.clear();
          userNameInput.sendKeys('');

          expect(user.getText()).toContain('{"last":"visitor"}');
          expect(userNameValid.getText()).toContain('false');
          expect(formValid.getText()).toContain('false');
        });

        it('should be valid if empty when min length is set', function() {
          userLastInput.clear();
          userLastInput.sendKeys('');

          expect(user.getText()).toContain('{"name":"guest","last":""}');
          expect(lastNameValid.getText()).toContain('true');
          expect(formValid.getText()).toContain('true');
        });

        it('should be invalid if less than required min length', function() {
          userLastInput.clear();
          userLastInput.sendKeys('xx');

          expect(user.getText()).toContain('{"name":"guest"}');
          expect(lastNameValid.getText()).toContain('false');
          expect(lastNameError.getText()).toContain('minlength');
          expect(formValid.getText()).toContain('false');
        });

        it('should be invalid if longer than max length', function() {
          userLastInput.clear();
          userLastInput.sendKeys('some ridiculously long name');

          expect(user.getText()).toContain('{"name":"guest"}');
          expect(lastNameValid.getText()).toContain('false');
          expect(lastNameError.getText()).toContain('maxlength');
          expect(formValid.getText()).toContain('false');
        });
      </file>
    </example>
 */
var inputDirective = ['$browser', '$sniffer', '$filter', '$parse',
    function($browser, $sniffer, $filter, $parse) {
  return {
    restrict: 'E',
    require: ['?ngModel'],
    link: {
      pre: function(scope, element, attr, ctrls) {
        if (ctrls[0]) {
          (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer,
                                                              $browser, $filter, $parse);
        }
      }
    }
  };
}];



var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
/**
 * @ngdoc directive
 * @name ngValue
 *
 * @description
 * Binds the given expression to the value of the element.
 *
 * It is mainly used on {@link input[radio] `input[radio]`} and option elements,
 * so that when the element is selected, the {@link ngModel `ngModel`} of that element (or its
 * {@link select `select`} parent element) is set to the bound value. It is especially useful
 * for dynamically generated lists using {@link ngRepeat `ngRepeat`}, as shown below.
 *
 * It can also be used to achieve one-way binding of a given expression to an input element
 * such as an `input[text]` or a `textarea`, when that element does not use ngModel.
 *
 * @element input
 * @param {string=} ngValue angular expression, whose value will be bound to the `value` attribute
 * and `value` property of the element.
 *
 * @example
    <example name="ngValue-directive" module="valueExample">
      <file name="index.html">
       <script>
          angular.module('valueExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
              $scope.names = ['pizza', 'unicorns', 'robots'];
              $scope.my = { favorite: 'unicorns' };
            }]);
       </script>
        <form ng-controller="ExampleController">
          <h2>Which is your favorite?</h2>
            <label ng-repeat="name in names" for="{{name}}">
              {{name}}
              <input type="radio"
                     ng-model="my.favorite"
                     ng-value="name"
                     id="{{name}}"
                     name="favorite">
            </label>
          <div>You chose {{my.favorite}}</div>
        </form>
      </file>
      <file name="protractor.js" type="protractor">
        var favorite = element(by.binding('my.favorite'));

        it('should initialize to model', function() {
          expect(favorite.getText()).toContain('unicorns');
        });
        it('should bind the values to the inputs', function() {
          element.all(by.model('my.favorite')).get(0).click();
          expect(favorite.getText()).toContain('pizza');
        });
      </file>
    </example>
 */
var ngValueDirective = function() {
  /**
   *  inputs use the value attribute as their default value if the value property is not set.
   *  Once the value property has been set (by adding input), it will not react to changes to
   *  the value attribute anymore. Setting both attribute and property fixes this behavior, and
   *  makes it possible to use ngValue as a sort of one-way bind.
   */
  function updateElementValue(element, attr, value) {
    // Support: IE9 only
    // In IE9 values are converted to string (e.g. `input.value = null` results in `input.value === 'null'`).
    var propValue = isDefined(value) ? value : (msie === 9) ? '' : null;
    element.prop('value', propValue);
    attr.$set('value', value);
  }

  return {
    restrict: 'A',
    priority: 100,
    compile: function(tpl, tplAttr) {
      if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
        return function ngValueConstantLink(scope, elm, attr) {
          var value = scope.$eval(attr.ngValue);
          updateElementValue(elm, attr, value);
        };
      } else {
        return function ngValueLink(scope, elm, attr) {
          scope.$watch(attr.ngValue, function valueWatchAction(value) {
            updateElementValue(elm, attr, value);
          });
        };
      }
    }
  };
};
