'use strict';

var noopNgModelController = { $setViewValue: noop, $render: noop };

/**
 * @ngdoc type
 * @name  select.SelectController
 * @description
 * The controller for the `<select>` directive. This provides support for reading
 * and writing the selected value(s) of the control and also coordinates dynamically
 * added `<option>` elements, perhaps by an `ngRepeat` directive.
 */
var SelectController =
        ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {

  var self = this,
      optionsMap = new HashMap();

  // If the ngModel doesn't get provided then provide a dummy noop version to prevent errors
  self.ngModelCtrl = noopNgModelController;

  // The "unknown" option is one that is prepended to the list if the viewValue
  // does not match any of the options. When it is rendered the value of the unknown
  // option is '? XXX ?' where XXX is the hashKey of the value that is not known.
  //
  // We can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  self.unknownOption = jqLite(document.createElement('option'));
  self.renderUnknownOption = function(val) {
    var unknownVal = '? ' + hashKey(val) + ' ?';
    self.unknownOption.val(unknownVal);
    $element.prepend(self.unknownOption);
    $element.val(unknownVal);
  };

  $scope.$on('$destroy', function() {
    // disable unknown option so that we don't do work when the whole select is being destroyed
    self.renderUnknownOption = noop;
  });

  self.removeUnknownOption = function() {
    if (self.unknownOption.parent()) self.unknownOption.remove();
  };


  // Read the value of the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.readValue = function readSingleValue() {
    self.removeUnknownOption();
    return $element.val();
  };


  // Write the value to the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.writeValue = function writeSingleValue(value) {
    if (self.hasOption(value)) {
      self.removeUnknownOption();
      $element.val(value);
      if (value === '') self.emptyOption.prop('selected', true); // to make IE9 happy
    } else {
      if (value == null && self.emptyOption) {
        self.removeUnknownOption();
        $element.val('');
      } else {
        self.renderUnknownOption(value);
      }
    }
  };


  // Tell the select control that an option, with the given value, has been added
  self.addOption = function(value, element) {
    assertNotHasOwnProperty(value, '"option value"');
    if (value === '') {
      self.emptyOption = element;
    }
    var count = optionsMap.get(value) || 0;
    optionsMap.put(value, count + 1);
  };

  // Tell the select control that an option, with the given value, has been removed
  self.removeOption = function(value) {
    var count = optionsMap.get(value);
    if (count) {
      if (count === 1) {
        optionsMap.remove(value);
        if (value === '') {
          self.emptyOption = undefined;
        }
      } else {
        optionsMap.put(value, count - 1);
      }
    }
  };

  // Check whether the select control has an option matching the given value
  self.hasOption = function(value) {
    return !!optionsMap.get(value);
  };
}];

/**
 * @ngdoc directive
 * @name select
 * @restrict E
 *
 * @description
 * HTML `SELECT` element with angular data-binding.
 *
 * The `select` directive is used together with {@link ngModel `ngModel`} to provide data-binding
 * between the scope and the `<select>` control (including setting default values).
 * Ìt also handles dynamic `<option>` elements, which can be added using the {@link ngRepeat `ngRepeat}` or
 * {@link ngOptions `ngOptions`} directives.
 *
 * When an item in the `<select>` menu is selected, the value of the selected option will be bound
 * to the model identified by the `ngModel` directive. With static or repeated options, this is
 * the content of the `value` attribute or the textContent of the `<option>`, if the value attribute is missing.
 * If you want dynamic value attributes, you can use interpolation inside the value attribute.
 *
 * <div class="alert alert-warning">
 * Note that the value of a `select` directive used without `ngOptions` is always a string.
 * When the model needs to be bound to a non-string value, you must either explictly convert it
 * using a directive (see example below) or use `ngOptions` to specify the set of options.
 * This is because an option element can only be bound to string values at present.
 * </div>
 *
 * If the viewValue of `ngModel` does not match any of the options, then the control
 * will automatically add an "unknown" option, which it then removes when the mismatch is resolved.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * <div class="alert alert-info">
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of {@link ng.directive:ngOptions
 * ngOptions} to achieve a similar result. However, `ngOptions` provides some benefits, such as
 * more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression, and additionally in reducing memory and increasing speed by not creating
 * a new scope for each repeated instance.
 * </div>
 *
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {string=} ngRequired Adds required attribute and required validation constraint to
 * the element when the ngRequired expression evaluates to true. Use ngRequired instead of required
 * when you want to data-bind to the required attribute.
 * @param {string=} ngChange Angular expression to be executed when selected option(s) changes due to user
 *    interaction with the select element.
 * @param {string=} ngOptions sets the options that the select is populated with and defines what is
 * set on the model on selection. See {@link ngOptions `ngOptions`}.
 *
 * @example
 * ### Simple `select` elements with static options
 *
 * <example name="static-select" module="staticSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="singleSelect"> Single select: </label><br>
 *     <select name="singleSelect" ng-model="data.singleSelect">
 *       <option value="option-1">Option 1</option>
 *       <option value="option-2">Option 2</option>
 *     </select><br>
 *
 *     <label for="singleSelect"> Single select with "not selected" option and dynamic option values: </label><br>
 *     <select name="singleSelect" id="singleSelect" ng-model="data.singleSelect">
 *       <option value="">---Please select---</option> <!-- not selected / blank option -->
 *       <option value="{{data.option1}}">Option 1</option> <!-- interpolation -->
 *       <option value="option-2">Option 2</option>
 *     </select><br>
 *     <button ng-click="forceUnknownOption()">Force unknown option</button><br>
 *     <tt>singleSelect = {{data.singleSelect}}</tt>
 *
 *     <hr>
 *     <label for="multipleSelect"> Multiple select: </label><br>
 *     <select name="multipleSelect" id="multipleSelect" ng-model="data.multipleSelect" multiple>
 *       <option value="option-1">Option 1</option>
 *       <option value="option-2">Option 2</option>
 *       <option value="option-3">Option 3</option>
 *     </select><br>
 *     <tt>multipleSelect = {{data.multipleSelect}}</tt><br/>
 *   </form>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('staticSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       singleSelect: null,
 *       multipleSelect: [],
 *       option1: 'option-1',
 *      };
 *
 *      $scope.forceUnknownOption = function() {
 *        $scope.data.singleSelect = 'nonsense';
 *      };
 *   }]);
 * </file>
 *</example>
 *
 * ### Using `ngRepeat` to generate `select` options
 * <example name="ngrepeat-select" module="ngrepeatSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="repeatSelect"> Repeat select: </label>
 *     <select name="repeatSelect" id="repeatSelect" ng-model="data.repeatSelect">
 *       <option ng-repeat="option in data.availableOptions" value="{{option.id}}">{{option.name}}</option>
 *     </select>
 *   </form>
 *   <hr>
 *   <tt>repeatSelect = {{data.repeatSelect}}</tt><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('ngrepeatSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       repeatSelect: null,
 *       availableOptions: [
 *         {id: '1', name: 'Option A'},
 *         {id: '2', name: 'Option B'},
 *         {id: '3', name: 'Option C'}
 *       ],
 *      };
 *   }]);
 * </file>
 *</example>
 *
 *
 * ### Using `select` with `ngOptions` and setting a default value
 * See the {@link ngOptions ngOptions documentation} for more `ngOptions` usage examples.
 *
 * <example name="select-with-default-values" module="defaultValueSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="mySelect">Make a choice:</label>
 *     <select name="mySelect" id="mySelect"
 *       ng-options="option.name for option in data.availableOptions track by option.id"
 *       ng-model="data.selectedOption"></select>
 *   </form>
 *   <hr>
 *   <tt>option = {{data.selectedOption}}</tt><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('defaultValueSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       availableOptions: [
 *         {id: '1', name: 'Option A'},
 *         {id: '2', name: 'Option B'},
 *         {id: '3', name: 'Option C'}
 *       ],
 *       selectedOption: {id: '3', name: 'Option C'} //This sets the default value of the select in the ui
 *       };
 *   }]);
 * </file>
 *</example>
 *
 *
 * ### Binding `select` to a non-string value via `ngModel` parsing / formatting
 *
 * <example name="select-with-non-string-options" module="nonStringSelect">
 *   <file name="index.html">
 *     <select ng-model="model.id" convert-to-number>
 *       <option value="0">Zero</option>
 *       <option value="1">One</option>
 *       <option value="2">Two</option>
 *     </select>
 *     {{ model }}
 *   </file>
 *   <file name="app.js">
 *     angular.module('nonStringSelect', [])
 *       .run(function($rootScope) {
 *         $rootScope.model = { id: 2 };
 *       })
 *       .directive('convertToNumber', function() {
 *         return {
 *           require: 'ngModel',
 *           link: function(scope, element, attrs, ngModel) {
 *             ngModel.$parsers.push(function(val) {
 *               return parseInt(val, 10);
 *             });
 *             ngModel.$formatters.push(function(val) {
 *               return '' + val;
 *             });
 *           }
 *         };
 *       });
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     it('should initialize to model', function() {
 *       var select = element(by.css('select'));
 *       expect(element(by.model('model.id')).$('option:checked').getText()).toEqual('Two');
 *     });
 *   </file>
 * </example>
 *
 */
var selectDirective = function() {

  return {
    restrict: 'E',
    require: ['select', '?ngModel'],
    controller: SelectController,
    link: function(scope, element, attr, ctrls) {

      // if ngModel is not defined, we don't need to do anything
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl) return;

      var selectCtrl = ctrls[0];

      selectCtrl.ngModelCtrl = ngModelCtrl;

      // We delegate rendering to the `writeValue` method, which can be changed
      // if the select can have multiple selected values or if the options are being
      // generated by `ngOptions`
      ngModelCtrl.$render = function() {
        selectCtrl.writeValue(ngModelCtrl.$viewValue);
      };

      // When the selected item(s) changes we delegate getting the value of the select control
      // to the `readValue` method, which can be changed if the select can have multiple
      // selected values or if the options are being generated by `ngOptions`
      element.on('change', function() {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(selectCtrl.readValue());
        });
      });

      // If the select allows multiple values then we need to modify how we read and write
      // values from and to the control; also what it means for the value to be empty and
      // we have to add an extra watch since ngModel doesn't work well with arrays - it
      // doesn't trigger rendering if only an item in the array changes.
      if (attr.multiple) {

        // Read value now needs to check each option to see if it is selected
        selectCtrl.readValue = function readMultipleValue() {
          var array = [];
          forEach(element.find('option'), function(option) {
            if (option.selected) {
              array.push(option.value);
            }
          });
          return array;
        };

        // Write value now needs to set the selected property of each matching option
        selectCtrl.writeValue = function writeMultipleValue(value) {
          var items = new HashMap(value);
          forEach(element.find('option'), function(option) {
            option.selected = isDefined(items.get(option.value));
          });
        };

        // we have to do it on each watch since ngModel watches reference, but
        // we need to work of an array, so we need to see if anything was inserted/removed
        var lastView, lastViewRef = NaN;
        scope.$watch(function selectMultipleWatch() {
          if (lastViewRef === ngModelCtrl.$viewValue && !equals(lastView, ngModelCtrl.$viewValue)) {
            lastView = shallowCopy(ngModelCtrl.$viewValue);
            ngModelCtrl.$render();
          }
          lastViewRef = ngModelCtrl.$viewValue;
        });

        // If we are a multiple select then value is now a collection
        // so the meaning of $isEmpty changes
        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };

      }
    }
  };
};


// The option directive is purely designed to communicate the existence (or lack of)
// of dynamically created (and destroyed) option elements to their containing select
// directive via its controller.
var optionDirective = ['$interpolate', function($interpolate) {

  function chromeHack(optionElement) {
    // Workaround for https://code.google.com/p/chromium/issues/detail?id=381459
    // Adding an <option selected="selected"> element to a <select required="required"> should
    // automatically select the new element
    if (optionElement[0].hasAttribute('selected')) {
      optionElement[0].selected = true;
    }
  }

  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {

      if (isDefined(attr.value)) {
        // If the value attribute is defined, check if it contains an interpolation
        var valueInterpolated = $interpolate(attr.value, true);
      } else {
        // If the value attribute is not defined then we fall back to the
        // text content of the option element, which may be interpolated
        var interpolateFn = $interpolate(element.text(), true);
        if (!interpolateFn) {
          attr.$set('value', element.text());
        }
      }

      return function(scope, element, attr) {

        // This is an optimization over using ^^ since we don't want to have to search
        // all the way to the root of the DOM for every single option element
        var selectCtrlName = '$selectController',
            parent = element.parent(),
            selectCtrl = parent.data(selectCtrlName) ||
              parent.parent().data(selectCtrlName); // in case we are in optgroup

        function addOption(optionValue) {
          selectCtrl.addOption(optionValue, element);
          selectCtrl.ngModelCtrl.$render();
          chromeHack(element);
        }

        // Only update trigger option updates if this is an option within a `select`
        // that also has `ngModel` attached
        if (selectCtrl && selectCtrl.ngModelCtrl) {

          if (valueInterpolated) {
            // The value attribute is interpolated
            var oldVal;
            attr.$observe('value', function valueAttributeObserveAction(newVal) {
              if (isDefined(oldVal)) {
                selectCtrl.removeOption(oldVal);
              }
              oldVal = newVal;
              addOption(newVal);
            });
          } else if (interpolateFn) {
            // The text content is interpolated
            scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
              attr.$set('value', newVal);
              if (oldVal !== newVal) {
                selectCtrl.removeOption(oldVal);
              }
              addOption(newVal);
            });
          } else {
            // The value attribute is static
            addOption(attr.value);
          }

          element.on('$destroy', function() {
            selectCtrl.removeOption(attr.value);
            selectCtrl.ngModelCtrl.$render();
          });
        }
      };
    }
  };
}];
