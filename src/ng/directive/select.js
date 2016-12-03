'use strict';

/* exported selectDirective, optionDirective */

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
        ['$element', '$scope', /** @this */ function($element, $scope) {

  var self = this,
      optionsMap = new HashMap();

  self.selectValueMap = {}; // Keys are the hashed values, values the original values

  // If the ngModel doesn't get provided then provide a dummy noop version to prevent errors
  self.ngModelCtrl = noopNgModelController;
  self.multiple = false;

  // The "unknown" option is one that is prepended to the list if the viewValue
  // does not match any of the options. When it is rendered the value of the unknown
  // option is '? XXX ?' where XXX is the hashKey of the value that is not known.
  //
  // We can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  self.unknownOption = jqLite(window.document.createElement('option'));

  // The empty option is an option with the value '' that te application developer can
  // provide inside the select. When the model changes to a value that doesn't match an option,
  // it is selected - so if an empty option is provided, no unknown option is generated.
  // However, the empty option is not removed when the model matches an option. It is always selectable
  // and indicates that a "null" selection has been made.
  self.hasEmptyOption = false;
  self.emptyOption = undefined;

  self.renderUnknownOption = function(val) {
    var unknownVal = self.generateUnknownOptionValue(val);
    self.unknownOption.val(unknownVal);
    $element.prepend(self.unknownOption);
    setOptionAsSelected(self.unknownOption);
    $element.val(unknownVal);
  };

  self.updateUnknownOption = function(val) {
    var unknownVal = self.generateUnknownOptionValue(val);
    self.unknownOption.val(unknownVal);
    setOptionAsSelected(self.unknownOption);
    $element.val(unknownVal);
  };

  self.generateUnknownOptionValue = function(val) {
    return '? ' + hashKey(val) + ' ?';
  };

  self.removeUnknownOption = function() {
    if (self.unknownOption.parent()) self.unknownOption.remove();
  };

  self.selectEmptyOption = function() {
    if (self.emptyOption) {
      $element.val('');
      setOptionAsSelected(self.emptyOption);
    }
  };

  self.unselectEmptyOption = function() {
    if (self.hasEmptyOption) {
      self.emptyOption.removeAttr('selected');
    }
  };

  $scope.$on('$destroy', function() {
    // disable unknown option so that we don't do work when the whole select is being destroyed
    self.renderUnknownOption = noop;
  });

  // Read the value of the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.readValue = function readSingleValue() {
    var val = $element.val();
    // ngValue added option values are stored in the selectValueMap, normal interpolations are not
    var realVal = val in self.selectValueMap ? self.selectValueMap[val] : val;

    if (self.hasOption(realVal)) {
      return realVal;
    }

    return null;
  };


  // Write the value to the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.writeValue = function writeSingleValue(value) {
    // Make sure to remove the selected attribute from the previously selected option
    // Otherwise, screen readers might get confused
    var currentlySelectedOption = $element[0].options[$element[0].selectedIndex];
    if (currentlySelectedOption) currentlySelectedOption.removeAttribute('selected');

    if (self.hasOption(value)) {
      self.removeUnknownOption();

      var hashedVal = hashKey(value);
      $element.val(hashedVal in self.selectValueMap ? hashedVal : value);

      // Set selected attribute and property on selected option for screen readers
      var selectedOption = $element[0].options[$element[0].selectedIndex];
      setOptionAsSelected(jqLite(selectedOption));
    } else {
      if (value == null && self.emptyOption) {
        self.removeUnknownOption();
        self.selectEmptyOption();
      } else if (self.unknownOption.parent().length) {
        self.updateUnknownOption(value);
      } else {
        self.renderUnknownOption(value);
      }
    }
  };


  // Tell the select control that an option, with the given value, has been added
  self.addOption = function(value, element) {
    // Skip comment nodes, as they only pollute the `optionsMap`
    if (element[0].nodeType === NODE_TYPE_COMMENT) return;

    assertNotHasOwnProperty(value, '"option value"');
    if (value === '') {
      self.hasEmptyOption = true;
      self.emptyOption = element;
    }
    var count = optionsMap.get(value) || 0;
    optionsMap.put(value, count + 1);
    // Only render at the end of a digest. This improves render performance when many options
    // are added during a digest and ensures all relevant options are correctly marked as selected
    scheduleRender();
  };

  // Tell the select control that an option, with the given value, has been removed
  self.removeOption = function(value) {
    var count = optionsMap.get(value);
    if (count) {
      if (count === 1) {
        optionsMap.remove(value);
        if (value === '') {
          self.hasEmptyOption = false;
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


  var renderScheduled = false;
  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    $scope.$$postDigest(function() {
      renderScheduled = false;
      self.ngModelCtrl.$render();
    });
  }

  var updateScheduled = false;
  function scheduleViewValueUpdate(renderAfter) {
    if (updateScheduled) return;

    updateScheduled = true;

    $scope.$$postDigest(function() {
      if ($scope.$$destroyed) return;

      updateScheduled = false;
      self.ngModelCtrl.$setViewValue(self.readValue());
      if (renderAfter) self.ngModelCtrl.$render();
    });
  }


  self.registerOption = function(optionScope, optionElement, optionAttrs, interpolateValueFn, interpolateTextFn) {

    if (optionAttrs.$attr.ngValue) {
      // The value attribute is set by ngValue
      var oldVal, hashedVal = NaN;
      optionAttrs.$observe('value', function valueAttributeObserveAction(newVal) {

        var removal;
        var previouslySelected = optionElement.prop('selected');

        if (isDefined(hashedVal)) {
          self.removeOption(oldVal);
          delete self.selectValueMap[hashedVal];
          removal = true;
        }

        hashedVal = hashKey(newVal);
        oldVal = newVal;
        self.selectValueMap[hashedVal] = newVal;
        self.addOption(newVal, optionElement);
        // Set the attribute directly instead of using optionAttrs.$set - this stops the observer
        // from firing a second time. Other $observers on value will also get the result of the
        // ngValue expression, not the hashed value
        optionElement.attr('value', hashedVal);

        if (removal && previouslySelected) {
          scheduleViewValueUpdate();
        }

      });
    } else if (interpolateValueFn) {
      // The value attribute is interpolated
      optionAttrs.$observe('value', function valueAttributeObserveAction(newVal) {
        // This method is overwritten in ngOptions and has side-effects!
        self.readValue();

        var removal;
        var previouslySelected = optionElement.prop('selected');

        if (isDefined(oldVal)) {
          self.removeOption(oldVal);
          removal = true;
        }
        oldVal = newVal;
        self.addOption(newVal, optionElement);

        if (removal && previouslySelected) {
          scheduleViewValueUpdate();
        }
      });
    } else if (interpolateTextFn) {
      // The text content is interpolated
      optionScope.$watch(interpolateTextFn, function interpolateWatchAction(newVal, oldVal) {
        optionAttrs.$set('value', newVal);
        var previouslySelected = optionElement.prop('selected');
        if (oldVal !== newVal) {
          self.removeOption(oldVal);
        }
        self.addOption(newVal, optionElement);

        if (oldVal && previouslySelected) {
          scheduleViewValueUpdate();
        }
      });
    } else {
      // The value attribute is static
      self.addOption(optionAttrs.value, optionElement);
    }


    optionAttrs.$observe('disabled', function(newVal) {

      // Since model updates will also select disabled options (like ngOptions),
      // we only have to handle options becoming disabled, not enabled

      if (newVal === 'true' || newVal && optionElement.prop('selected')) {
        if (self.multiple) {
          scheduleViewValueUpdate(true);
        } else {
          self.ngModelCtrl.$setViewValue(null);
          self.ngModelCtrl.$render();
        }
      }
    });

    optionElement.on('$destroy', function() {
      var currentValue = self.readValue();
      var removeValue = optionAttrs.value;

      self.removeOption(removeValue);
      self.ngModelCtrl.$render();

      if (self.multiple && currentValue && currentValue.indexOf(removeValue) !== -1 ||
          currentValue === removeValue
      ) {
        // When multiple (selected) options are destroyed at the same time, we don't want
        // to run a model update for each of them. Instead, run a single update in the $$postDigest
        scheduleViewValueUpdate(true);
      }
    });
  };

  function setOptionAsSelected(optionEl) {
    optionEl.prop('selected', true); // needed for IE
    optionEl.attr('selected', true);
  }
}];

/**
 * @ngdoc directive
 * @name select
 * @restrict E
 *
 * @description
 * HTML `select` element with angular data-binding.
 *
 * The `select` directive is used together with {@link ngModel `ngModel`} to provide data-binding
 * between the scope and the `<select>` control (including setting default values).
 * It also handles dynamic `<option>` elements, which can be added using the {@link ngRepeat `ngRepeat}` or
 * {@link ngOptions `ngOptions`} directives.
 *
 * When an item in the `<select>` menu is selected, the value of the selected option will be bound
 * to the model identified by the `ngModel` directive. With static or repeated options, this is
 * the content of the `value` attribute or the textContent of the `<option>`, if the value attribute is missing.
 * Value and textContent can be interpolated.
 *
 * ## Matching model and option values
 *
 * In general, the match between the model and an option is evaluated by strictly comparing the model
 * value against the value of the available options.
 *
 * If you are setting the option value with the option's `value` attribute, or textContent, the
 * value will always be a `string` which means that the model value must also be a string.
 * Otherwise the `select` directive cannot match them correctly.
 *
 * To bind the model to a non-string value, you can use one of the following strategies:
 * - the {@link ng.ngOptions `ngOptions`} directive
 *   ({@link ng.select#using-select-with-ngoptions-and-setting-a-default-value})
 * - the {@link ng.ngValue `ngValue`} directive, which allows arbitrary expressions to be
 *   option values ({@link ng.select#using-ngvalue-to-bind-the-model-to-an-array-of-objects Example})
 * - model $parsers / $formatters to convert the string value
 *   ({@link ng.select#binding-select-to-a-non-string-value-via-ngmodel-parsing-formatting Example})
 *
 * If the viewValue of `ngModel` does not match any of the options, then the control
 * will automatically add an "unknown" option, which it then removes when the mismatch is resolved.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * ## Choosing between `ngRepeat` and `ngOptions`
 *
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of {@link ng.directive:ngOptions
 * ngOptions} to achieve a similar result. However, `ngOptions` provides some benefits:
 * - more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression
 * - reduced memory consumption by not creating a new scope for each repeated instance
 * - increased render speed by creating the options in a documentFragment instead of individually
 *
 * Specifically, select with repeated options slows down significantly starting at 2000 options in
 * Chrome and Internet Explorer / Edge.
 *
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} multiple Allows multiple options to be selected. The selected values will be
 *     bound to the model as an array.
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
 *       option1: 'option-1'
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
 * <example name="select-ngrepeat" module="ngrepeatSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="repeatSelect"> Repeat select: </label>
 *     <select name="repeatSelect" id="repeatSelect" ng-model="data.model">
 *       <option ng-repeat="option in data.availableOptions" value="{{option.id}}">{{option.name}}</option>
 *     </select>
 *   </form>
 *   <hr>
 *   <tt>model = {{data.model}}</tt><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('ngrepeatSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       model: null,
 *       availableOptions: [
 *         {id: '1', name: 'Option A'},
 *         {id: '2', name: 'Option B'},
 *         {id: '3', name: 'Option C'}
 *       ]
 *      };
 *   }]);
 * </file>
 *</example>
 *
 * ### Using `ngValue` to bind the model to an array of objects
 * <example name="select-ngvalue" module="ngvalueSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="ngvalueselect"> ngvalue select: </label>
 *     <select size="6" name="ngvalueselect" ng-model="data.model" multiple>
 *       <option ng-repeat="option in data.availableOptions" ng-value="option.value">{{option.name}}</option>
 *     </select>
 *   </form>
 *   <hr>
 *   <pre>model = {{data.model | json}}</pre><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('ngvalueSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       model: null,
 *       availableOptions: [
           {value: 'myString', name: 'string'},
           {value: 1, name: 'integer'},
           {value: true, name: 'boolean'},
           {value: null, name: 'null'},
           {value: {prop: 'value'}, name: 'object'},
           {value: ['a'], name: 'array'}
 *       ]
 *      };
 *   }]);
 * </file>
 *</example>
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
    priority: 1,
    link: {
      pre: selectPreLink,
      post: selectPostLink
    }
  };

  function selectPreLink(scope, element, attr, ctrls) {

      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      // if ngModel is not defined, we don't need to do anything but set the registerOption
      // function to noop, so options don't get added internally
      if (!ngModelCtrl) {
        selectCtrl.registerOption = noop;
        return;
      }


      selectCtrl.ngModelCtrl = ngModelCtrl;

      // When the selected item(s) changes we delegate getting the value of the select control
      // to the `readValue` method, which can be changed if the select can have multiple
      // selected values or if the options are being generated by `ngOptions`
      element.on('change', function() {
        selectCtrl.removeUnknownOption();
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(selectCtrl.readValue());
        });
      });

      // If the select allows multiple values then we need to modify how we read and write
      // values from and to the control; also what it means for the value to be empty and
      // we have to add an extra watch since ngModel doesn't work well with arrays - it
      // doesn't trigger rendering if only an item in the array changes.
      if (attr.multiple) {
        selectCtrl.multiple = true;

        // Read value now needs to check each option to see if it is selected
        selectCtrl.readValue = function readMultipleValue() {
          var array = [];
          forEach(element.find('option'), function(option) {
            if (option.selected && !option.disabled) {
              var val = option.value;
              array.push(val in selectCtrl.selectValueMap ? selectCtrl.selectValueMap[val] : val);
            }
          });
          return array;
        };

        // Write value now needs to set the selected property of each matching option
        selectCtrl.writeValue = function writeMultipleValue(value) {
          var items = new HashMap(value);
          forEach(element.find('option'), function(option) {
            option.selected = isDefined(items.get(option.value)) || isDefined(items.get(selectCtrl.selectValueMap[option.value]));
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

    function selectPostLink(scope, element, attrs, ctrls) {
      // if ngModel is not defined, we don't need to do anything
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl) return;

      var selectCtrl = ctrls[0];

      // We delegate rendering to the `writeValue` method, which can be changed
      // if the select can have multiple selected values or if the options are being
      // generated by `ngOptions`.
      // This must be done in the postLink fn to prevent $render to be called before
      // all nodes have been linked correctly.
      ngModelCtrl.$render = function() {
        selectCtrl.writeValue(ngModelCtrl.$viewValue);
      };
    }
};


// The option directive is purely designed to communicate the existence (or lack of)
// of dynamically created (and destroyed) option elements to their containing select
// directive via its controller.
var optionDirective = ['$interpolate', function($interpolate) {
  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {
      var interpolateValueFn, interpolateTextFn;

      if (isDefined(attr.ngValue)) {
        // Will be handled by registerOption
      } else if (isDefined(attr.value)) {
        // If the value attribute is defined, check if it contains an interpolation
        interpolateValueFn = $interpolate(attr.value, true);
      } else {
        // If the value attribute is not defined then we fall back to the
        // text content of the option element, which may be interpolated
        interpolateTextFn = $interpolate(element.text(), true);
        if (!interpolateTextFn) {
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

        if (selectCtrl) {
          selectCtrl.registerOption(scope, element, attr, interpolateValueFn, interpolateTextFn);
        }
      };
    }
  };
}];
