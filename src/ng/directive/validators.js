'use strict';
/**
 * @ngdoc directive
 * @name ngRequired
 * @restrict A
 *
 * @description
 *
 * ngRequired adds the required {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for {@link input `input`} and {@link select `select`} controls, but can also be
 * applied to custom controls.
 *
 * The directive sets the `required` attribute on the element if the Angular expression inside
 * `ngRequired` evaluates to true. A special directive for setting `required` is necessary because we
 * cannot use interpolation inside `required`. See the {@link guide/interpolation interpolation guide}
 * for more info.
 *
 * The validator will set the `required` error key to true if the `required` attribute is set and
 * calling {@link ngModel.NgModelController#$isEmpty `NgModelController.$isEmpty`} with the
 * {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`} returns `true`. For example, the
 * `$isEmpty()` implementation for `input[text]` checks the length of the `$viewValue`. When developing
 * custom controls, `$isEmpty()` can be overwritten to account for a $viewValue that is not string-based.
 *
 * @example
 * <example name="ngRequiredDirective" module="ngRequiredExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngRequiredExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.required = true;
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="required">Toggle required: </label>
 *         <input type="checkbox" ng-model="required" id="required" />
 *         <br>
 *         <label for="input">This input must be filled if `required` is true: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-required="required" /><br>
 *         <hr>
 *         required error set? = <code>{{form.input.$error.required}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var required = element(by.binding('form.input.$error.required'));
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should set the required error', function() {
         expect(required.getText()).toContain('true');

         input.sendKeys('123');
         expect(required.getText()).not.toContain('true');
         expect(model.getText()).toContain('123');
       });
 *   </file>
 * </example>
 */
var requiredDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      attr.required = true; // force truthy in case we are on non input element

      ctrl.$validators.required = function(modelValue, viewValue) {
        return !attr.required || !ctrl.$isEmpty(viewValue);
      };

      attr.$observe('required', function() {
        ctrl.$validate();
      });
    }
  };
};

/**
 * @ngdoc directive
 * @name ngPattern
 *
 * @description
 *
 * ngPattern adds the pattern {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for text-based {@link input `input`} controls, but can also be applied to custom text-based controls.
 *
 * The validator sets the `pattern` error key if the {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`}
 * does not match a RegExp which is obtained by evaluating the Angular expression given in the
 * `ngPattern` attribute value:
 * * If the expression evaluates to a RegExp object, then this is used directly.
 * * If the expression evaluates to a string, then it will be converted to a RegExp after wrapping it
 * in `^` and `$` characters. For instance, `"abc"` will be converted to `new RegExp('^abc$')`.
 *
 * <div class="alert alert-info">
 * **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
 * start at the index of the last search's match, thus not taking the whole input value into
 * account.
 * </div>
 *
 * <div class="alert alert-info">
 * **Note:** This directive is also added when the plain `pattern` attribute is used, with two
 * differences:
 * <ol>
 *   <li>
 *     `ngPattern` does not set the `pattern` attribute and therefore HTML5 constraint validation is
 *     not available.
 *   </li>
 *   <li>
 *     The `ngPattern` attribute must be an expression, while the `pattern` value must be
 *     interpolated.
 *   </li>
 * </ol>
 * </div>
 *
 * @example
 * <example name="ngPatternDirective" module="ngPatternExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngPatternExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.regex = '\\d+';
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="regex">Set a pattern (regex string): </label>
 *         <input type="text" ng-model="regex" id="regex" />
 *         <br>
 *         <label for="input">This input is restricted by the current pattern: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-pattern="regex" /><br>
 *         <hr>
 *         input valid? = <code>{{form.input.$valid}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should validate the input with the default pattern', function() {
         input.sendKeys('aaa');
         expect(model.getText()).not.toContain('aaa');

         input.clear().then(function() {
           input.sendKeys('123');
           expect(model.getText()).toContain('123');
         });
       });
 *   </file>
 * </example>
 */
var patternDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var regexp, patternExp = attr.ngPattern || attr.pattern;
      attr.$observe('pattern', function(regex) {
        if (isString(regex) && regex.length > 0) {
          regex = new RegExp('^' + regex + '$');
        }

        if (regex && !regex.test) {
          throw minErr('ngPattern')('noregexp',
            'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp,
            regex, startingTag(elm));
        }

        regexp = regex || undefined;
        ctrl.$validate();
      });

      ctrl.$validators.pattern = function(modelValue, viewValue) {
        // HTML5 pattern constraint validates the input value, so we validate the viewValue
        return ctrl.$isEmpty(viewValue) || isUndefined(regexp) || regexp.test(viewValue);
      };
    }
  };
};

/**
 * @ngdoc directive
 * @name ngMaxlength
 *
 * @description
 *
 * ngMaxlength adds the maxlength {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for text-based {@link input `input`} controls, but can also be applied to custom text-based controls.
 *
 * The validator sets the `maxlength` error key if the {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`}
 * is longer than the integer obtained by evaluating the Angular expression given in the
 * `ngMaxlength` attribute value.
 *
 * <div class="alert alert-info">
 * **Note:** This directive is also added when the plain `maxlength` attribute is used, with two
 * differences:
 * <ol>
 *   <li>
 *     `ngMaxlength` does not set the `maxlength` attribute and therefore HTML5 constraint
 *     validation is not available.
 *   </li>
 *   <li>
 *     The `ngMaxlength` attribute must be an expression, while the `maxlength` value must be
 *     interpolated.
 *   </li>
 * </ol>
 * </div>
 *
 * @example
 * <example name="ngMaxlengthDirective" module="ngMaxlengthExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngMaxlengthExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.maxlength = 5;
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="maxlength">Set a maxlength: </label>
 *         <input type="number" ng-model="maxlength" id="maxlength" />
 *         <br>
 *         <label for="input">This input is restricted by the current maxlength: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-maxlength="maxlength" /><br>
 *         <hr>
 *         input valid? = <code>{{form.input.$valid}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should validate the input with the default maxlength', function() {
         input.sendKeys('abcdef');
         expect(model.getText()).not.toContain('abcdef');

         input.clear().then(function() {
           input.sendKeys('abcde');
           expect(model.getText()).toContain('abcde');
         });
       });
 *   </file>
 * </example>
 */
var maxlengthDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var maxlength = -1;
      attr.$observe('maxlength', function(value) {
        var intVal = toInt(value);
        maxlength = isNumberNaN(intVal) ? -1 : intVal;
        ctrl.$validate();
      });
      ctrl.$validators.maxlength = function(modelValue, viewValue) {
        return (maxlength < 0) || ctrl.$isEmpty(viewValue) || (viewValue.length <= maxlength);
      };
    }
  };
};

/**
 * @ngdoc directive
 * @name ngMinlength
 *
 * @description
 *
 * ngMinlength adds the minlength {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for text-based {@link input `input`} controls, but can also be applied to custom text-based controls.
 *
 * The validator sets the `minlength` error key if the {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`}
 * is shorter than the integer obtained by evaluating the Angular expression given in the
 * `ngMinlength` attribute value.
 *
 * <div class="alert alert-info">
 * **Note:** This directive is also added when the plain `minlength` attribute is used, with two
 * differences:
 * <ol>
 *   <li>
 *     `ngMinlength` does not set the `minlength` attribute and therefore HTML5 constraint
 *     validation is not available.
 *   </li>
 *   <li>
 *     The `ngMinlength` value must be an expression, while the `minlength` value must be
 *     interpolated.
 *   </li>
 * </ol>
 * </div>
 *
 * @example
 * <example name="ngMinlengthDirective" module="ngMinlengthExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngMinlengthExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.minlength = 3;
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="minlength">Set a minlength: </label>
 *         <input type="number" ng-model="minlength" id="minlength" />
 *         <br>
 *         <label for="input">This input is restricted by the current minlength: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-minlength="minlength" /><br>
 *         <hr>
 *         input valid? = <code>{{form.input.$valid}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should validate the input with the default minlength', function() {
         input.sendKeys('ab');
         expect(model.getText()).not.toContain('ab');

         input.sendKeys('abc');
         expect(model.getText()).toContain('abc');
       });
 *   </file>
 * </example>
 */
var minlengthDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var minlength = 0;
      attr.$observe('minlength', function(value) {
        minlength = toInt(value) || 0;
        ctrl.$validate();
      });
      ctrl.$validators.minlength = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
      };
    }
  };
};
