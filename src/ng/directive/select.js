'use strict';

/* global jqLiteRemove */

var ngOptionsMinErr = minErr('ngOptions');


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

  // Here we find the option that represents the "empty" value, i.e. the option with a value
  // of `""`.  This option needs to be accessed (to select it directly) when setting the value
  // of the select to `""` because IE9 will not automatically select the option.
  //
  // Additionally, the `ngOptions` directive uses this option to allow the application developer
  // to provide their own custom "empty" option when the viewValue does not match any of the
  // option values.
  for (var i = 0, children = $element.children(), ii = children.length; i < ii; i++) {
    if (children[i].value === '') {
      self.emptyOption = children.eq(i);
      break;
    }
  }

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
      if (isUndefined(value) && self.emptyOption) {
        $element.val('');
      } else {
        self.renderUnknownOption(value);
      }
    }
  };


  // Tell the select control that an option, with the given value, has been added
  self.addOption = function(value) {
    assertNotHasOwnProperty(value, '"option value"');
    var count = optionsMap.get(value) || 0;
    optionsMap.put(value, count + 1);
  };

  // Tell the select control that an option, with the given value, has been removed
  self.removeOption = function(value) {
    var count = optionsMap.get(value);
    if (count) {
      if (count === 1) {
        optionsMap.remove(value);
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
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of `ngOptions` to achieve a
 * similar result. However, `ngOptions` provides some benefits such as reducing memory and
 * increasing speed by not creating a new scope for each repeated instance, as well as providing
 * more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression. `ngOptions` should be used when the `<select>` model needs to be bound
 *  to a non-string value. This is because an option element can only be bound to string values at
 * present.
 *
 * When an item in the `<select>` menu is selected, the array element or object property
 * represented by the selected option will be bound to the model identified by the `ngModel`
 * directive.
 *
 * If the viewValue contains a value that doesn't match any of the options then the control
 * will automatically add an "unknown" option, which it then removes when this is resolved.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * <div class="alert alert-warning">
 * **Note:** `ngModel` compares by reference, not value. This is important when binding to an
 * array of objects. See an example [in this jsfiddle](http://jsfiddle.net/qWzTb/).
 * </div>
 *
 */
var selectDirective = function() {
  var lastView;

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
        scope.$watch(function selectMultipleWatch() {
          if (!equals(lastView, ngModelCtrl.$viewValue)) {
            lastView = shallowCopy(ngModelCtrl.$viewValue);
            ngModelCtrl.$render();
          }
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

      // If the value attribute is not defined then we fall back to the
      // text content of the option element, which may be interpolated
      if (isUndefined(attr.value)) {
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

        // Only update trigger option updates if this is an option within a `select`
        // that also has `ngModel` attached
        if (selectCtrl && selectCtrl.ngModelCtrl) {

          if (interpolateFn) {
            scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
              attr.$set('value', newVal);
              if (oldVal !== newVal) {
                selectCtrl.removeOption(oldVal);
              }
              selectCtrl.addOption(newVal, element);
              selectCtrl.ngModelCtrl.$render();
              chromeHack(element);
            });
          } else {
            selectCtrl.addOption(attr.value, element);
            selectCtrl.ngModelCtrl.$render();
            chromeHack(element);
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


/**
 * @ngdoc directive
 * @name ngOptions
 * @restrict A
 *
 * @description
 *
 * The `ngOptions` attribute can be used to dynamically generate a list of `<option>`
 * elements for the `<select>` element using the array or object obtained by evaluating the
 * `ngOptions` comprehension expression.
 *
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of `ngOptions` to achieve a
 * similar result. However, `ngOptions` provides some benefits such as reducing memory and
 * increasing speed by not creating a new scope for each repeated instance, as well as providing
 * more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression. `ngOptions` should be used when the `<select>` model needs to be bound
 *  to a non-string value. This is because an option element can only be bound to string values at
 * present.
 *
 * When an item in the `<select>` menu is selected, the array element or object property
 * represented by the selected option will be bound to the model identified by the `ngModel`
 * directive.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * <div class="alert alert-warning">
 * **Note:** `ngModel` compares by reference, not value. This is important when binding to an
 * array of objects. See an example [in this jsfiddle](http://jsfiddle.net/qWzTb/).
 * </div>
 *
 * ## `select` **`as`**
 *
 * Using `select` **`as`** will bind the result of the `select` expression to the model, but
 * the value of the `<select>` and `<option>` html elements will be either the index (for array data sources)
 * or property name (for object data sources) of the value within the collection. If a **`track by`** expression
 * is used, the result of that expression will be set as the value of the `option` and `select` elements.
 *
 *
 * ### `select` **`as`** and **`track by`**
 *
 * <div class="alert alert-warning">
 * Do not use `select` **`as`** and **`track by`** in the same expression. They are not designed to work together.
 * </div>
 *
 * Consider the following example:
 *
 * ```html
 * <select ng-options="item.subItem as item.label for item in values track by item.id" ng-model="selected">
 * ```
 *
 * ```js
 * $scope.values = [{
 *   id: 1,
 *   label: 'aLabel',
 *   subItem: { name: 'aSubItem' }
 * }, {
 *   id: 2,
 *   label: 'bLabel',
 *   subItem: { name: 'bSubItem' }
 * }];
 *
 * $scope.selected = { name: 'aSubItem' };
 * ```
 *
 * With the purpose of preserving the selection, the **`track by`** expression is always applied to the element
 * of the data source (to `item` in this example). To calculate whether an element is selected, we do the
 * following:
 *
 * 1. Apply **`track by`** to the elements in the array. In the example: `[1, 2]`
 * 2. Apply **`track by`** to the already selected value in `ngModel`.
 *    In the example: this is not possible as **`track by`** refers to `item.id`, but the selected
 *    value from `ngModel` is `{name: 'aSubItem'}`, so the **`track by`** expression is applied to
 *    a wrong object, the selected element can't be found, `<select>` is always reset to the "not
 *    selected" option.
 *
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required The control is considered valid only if value is entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {comprehension_expression=} ngOptions in one of the following forms:
 *
 *   * for array data sources:
 *     * `label` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`for`** `value` **`in`** `array`
 *     * `label` **`group by`** `group` **`for`** `value` **`in`** `array`
 *     * `label` **`group by`** `group` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *     * `label` **`for`** `value` **`in`** `array` | orderBy:`orderexpr` **`track by`** `trackexpr`
 *        (for including a filter with `track by`)
 *   * for object data sources:
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`group by`** `group`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *
 * Where:
 *
 *   * `array` / `object`: an expression which evaluates to an array / object to iterate over.
 *   * `value`: local variable which will refer to each item in the `array` or each property value
 *      of `object` during iteration.
 *   * `key`: local variable which will refer to a property name in `object` during iteration.
 *   * `label`: The result of this expression will be the label for `<option>` element. The
 *     `expression` will most likely refer to the `value` variable (e.g. `value.propertyName`).
 *   * `select`: The result of this expression will be bound to the model of the parent `<select>`
 *      element. If not specified, `select` expression will default to `value`.
 *   * `group`: The result of this expression will be used to group options using the `<optgroup>`
 *      DOM element.
 *   * `trackexpr`: Used when working with an array of objects. The result of this expression will be
 *      used to identify the objects in the array. The `trackexpr` will most likely refer to the
 *     `value` variable (e.g. `value.propertyName`). With this the selection is preserved
 *      even when the options are recreated (e.g. reloaded from the server).
 *
 * @example
    <example module="selectExample">
      <file name="index.html">
        <script>
        angular.module('selectExample', [])
          .controller('ExampleController', ['$scope', function($scope) {
            $scope.colors = [
              {name:'black', shade:'dark'},
              {name:'white', shade:'light'},
              {name:'red', shade:'dark'},
              {name:'blue', shade:'dark'},
              {name:'yellow', shade:'light'}
            ];
            $scope.myColor = $scope.colors[2]; // red
          }]);
        </script>
        <div ng-controller="ExampleController">
          <ul>
            <li ng-repeat="color in colors">
              Name: <input ng-model="color.name">
              [<a href ng-click="colors.splice($index, 1)">X</a>]
            </li>
            <li>
              [<a href ng-click="colors.push({})">add</a>]
            </li>
          </ul>
          <hr/>
          Color (null not allowed):
          <select ng-model="myColor" ng-options="color.name for color in colors"></select><br>

          Color (null allowed):
          <span  class="nullable">
            <select ng-model="myColor" ng-options="color.name for color in colors">
              <option value="">-- choose color --</option>
            </select>
          </span><br/>

          Color grouped by shade:
          <select ng-model="myColor" ng-options="color.name group by color.shade for color in colors">
          </select><br/>


          Select <a href ng-click="myColor = { name:'not in list', shade: 'other' }">bogus</a>.<br>
          <hr/>
          Currently selected: {{ {selected_color:myColor} }}
          <div style="border:solid 1px black; height:20px"
               ng-style="{'background-color':myColor.name}">
          </div>
        </div>
      </file>
      <file name="protractor.js" type="protractor">
         it('should check ng-options', function() {
           expect(element(by.binding('{selected_color:myColor}')).getText()).toMatch('red');
           element.all(by.model('myColor')).first().click();
           element.all(by.css('select[ng-model="myColor"] option')).first().click();
           expect(element(by.binding('{selected_color:myColor}')).getText()).toMatch('black');
           element(by.css('.nullable select[ng-model="myColor"]')).click();
           element.all(by.css('.nullable select[ng-model="myColor"] option')).first().click();
           expect(element(by.binding('{selected_color:myColor}')).getText()).toMatch('null');
         });
      </file>
    </example>
 */

// jshint maxlen: false
                         //000011111111110000000000022222222220000000000000000000003333333333000000000000004444444444444440000000005555555555555550000000666666666666666000000000000000777777777700000000000000000008888888888
var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
                        // 1: value expression (valueFn)
                        // 2: label expression (displayFn)
                        // 3: group by expression (groupByFn)
                        // 4: array item variable name
                        // 5: object item key variable name
                        // 6: object item value variable name
                        // 7: collection expression
                        // 8: track by expression
// jshint maxlen: 100


var ngOptionsDirective = ['$compile', '$parse', function($compile, $parse) {

  function parseOptionsExpression(optionsExp, selectElement, scope) {

    var match = optionsExp.match(NG_OPTIONS_REGEXP);
    if (!(match)) {
      throw ngOptionsMinErr('iexp',
        "Expected expression in form of " +
        "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
        " but got '{0}'. Element: {1}",
        optionsExp, startingTag(selectElement));
    }

    // Extract the parts from the ngOptions expression

    // The variable name for the value of the item in the collection
    var valueName = match[4] || match[6];
    // The variable name for the key of the item in the collection
    var keyName = match[5];

    // An expression that generates the viewValue for an option if there is a label expression
    var selectAs = / as /.test(match[0]) && match[1];
    // An expression that is used to track the id of each object in the options collection
    var trackBy = match[8];
    // An expression that generates the viewValue for an option if there is no label expression
    var valueFn = $parse(match[2] ? match[1] : valueName);
    var selectAsFn = selectAs && $parse(selectAs);
    var viewValueFn = selectAsFn || valueFn;
    var trackByFn = trackBy ? $parse(trackBy) :
                              function getHashOfValue(value) { return hashKey(value); };
    var displayFn = $parse(match[2] || match[1]);
    var groupByFn = $parse(match[3] || '');
    var valuesFn = $parse(match[7]);

    var locals = {};
    var getLocals = keyName ? function(value, key) {
      locals[keyName] = key;
      locals[valueName] = value;
      return locals;
    } : function(value) {
      locals[valueName] = value;
      return locals;
    };


    function Option(selectValue, viewValue, label, group) {
      this.selectValue = selectValue;
      this.viewValue = viewValue;
      this.label = label;
      this.group = group;
    }

    return {
      getWatchables: function() {
        // Create a collection of things that we would like to watch (watchedArray)
        // so that they can all be watched using a single $watchCollection
        // that only runs the handler once if anything changes
        var watchedArray = [];

        var values = valuesFn(scope) || [];

        Object.keys(values).forEach(function getWatchable(key) {
          var locals = getLocals(values[key], key);
          var label = displayFn(scope, locals);
          var selectValue = viewValueFn(scope, locals);
          watchedArray.push(selectValue);
          watchedArray.push(label);
        });
        return watchedArray;
      },

      getOptions: function() {

        var optionItems = [];
        var selectValueMap = {};

        // The option values were already computed in the `getWatchables` fn,
        // which must have been called to trigger `getOptions`
        var optionValues = valuesFn(scope) || [];

        var keys = Object.keys(optionValues);
        keys.forEach(function getOption(key) {

          // Ignore "angular" properties that start with $ or $$
          if (key.charAt(0) === '$') return;

          var value = optionValues[key];
          var locals = getLocals(value, key);
          var viewValue = viewValueFn(scope, locals);
          var selectValue = trackByFn(viewValue, locals);
          var label = displayFn(scope, locals);
          var group = groupByFn(scope, locals);
          var optionItem = new Option(selectValue, viewValue, label, group);

          optionItems.push(optionItem);
          selectValueMap[selectValue] = optionItem;
        });

        return {
          items: optionItems,
          selectValueMap: selectValueMap,
          getOptionFromViewValue: function(value) {
            return selectValueMap[trackByFn(value, getLocals(value))];
          }
        };
      }
    };
  }


  // we can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  var optionTemplate = document.createElement('option'),
      optGroupTemplate = document.createElement('optgroup');

  return {
    restrict: 'A',
    terminal: true,
    require: ['select', '?ngModel'],
    link: function(scope, selectElement, attr, ctrls) {

      // if ngModel is not defined, we don't need to do anything
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl) return;

      var selectCtrl = ctrls[0];
      var multiple = attr.multiple;

      var emptyOption = selectCtrl.emptyOption;
      var providedEmptyOption = !!emptyOption;

      var unknownOption = jqLite(optionTemplate.cloneNode(false));
      unknownOption.val('?');

      var options;
      var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);


      var renderEmptyOption = function() {
        if (!providedEmptyOption) {
          selectElement.prepend(emptyOption);
        }
        selectElement.val('');
        emptyOption.prop('selected', true); // needed for IE
        emptyOption.attr('selected', true);
      };

      var removeEmptyOption = function() {
        if (!providedEmptyOption) {
          emptyOption.remove();
        }
      };


      var renderUnknownOption = function() {
        selectElement.prepend(unknownOption);
        selectElement.val('?');
        unknownOption.prop('selected', true); // needed for IE
        unknownOption.attr('selected', true);
      };

      var removeUnknownOption = function() {
        unknownOption.remove();
      };


      selectCtrl.writeValue = function writeNgOptionsValue(value) {
        if (multiple) {

          options.items.forEach(function(option) {
            option.element.selected = false;
          });

          if (value) {
            value.forEach(function(item) {
              var option = options.getOptionFromViewValue(item);
              if (option) option.element.selected = true;
            });
          }

        } else {
          var option = options.getOptionFromViewValue(value);

          if (option) {
            if (selectElement[0].value !== option.selectValue) {
              removeUnknownOption();
              removeEmptyOption();

              selectElement[0].value = option.selectValue;
              option.element.selected = true;
              option.element.setAttribute('selected', 'selected');
            }
          } else {
            if (value === null || providedEmptyOption) {
              removeUnknownOption();
              renderEmptyOption();
            } else {
              removeEmptyOption();
              renderUnknownOption();
            }
          }
        }
      };


      selectCtrl.readValue = function readNgOptionsValue() {

        if (multiple) {

          return selectElement.val().map(function(selectedKey) {
            var option = options.selectValueMap[selectedKey];
            return option.viewValue;
          });

        } else {

          var option = options.selectValueMap[selectElement.val()];
          removeEmptyOption();
          removeUnknownOption();
          return option ? option.viewValue : null;
        }
      };


      if (multiple) {
        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };
      }


      if (providedEmptyOption) {

        // we need to remove it before calling selectElement.empty() because otherwise IE will
        // remove the label from the element. wtf?
        emptyOption.remove();

        // compile the element since there might be bindings in it
        $compile(emptyOption)(scope);

        // remove the class, which is added automatically because we recompile the element and it
        // becomes the compilation root
        emptyOption.removeClass('ng-scope');
      } else {
        emptyOption = jqLite(optionTemplate.cloneNode(false));
      }

      // We need to do this here to ensure that the options object is defined
      // when we first hit it in writeNgOptionsValue
      updateOptions();

      // We will re-render the option elements if the option values or labels change
      scope.$watchCollection(ngOptions.getWatchables, updateOptions);

      // ------------------------------------------------------------------ //


      function updateOptionElement(option, element) {
        option.element = element;
        if (option.value !== element.value) element.value = option.selectValue;
        if (option.label !== element.label) {
          element.label = option.label;
          element.textContent = option.label;
        }
      }

      function addOrReuseElement(parent, current, type, templateElement) {
        var element;
        // Check whether we can reuse the next element
        if (current && lowercase(current.nodeName) === type) {
          // The next element is the right type so reuse it
          element = current;
        } else {
          // The next element is not the right type so create a new one
          element = templateElement.cloneNode(false);
          if (!current) {
            // There are no more elements so just append it to the select
            parent.appendChild(element);
          } else {
            // The next element is not a group so insert the new one
            parent.insertBefore(element, current);
          }
        }
        return element;
      }


      function removeExcessElements(current) {
        var next;
        while (current) {
          next = current.nextSibling;
          jqLiteRemove(current);
          current = next;
        }
      }


      function skipEmptyAndUnknownOptions(current) {
        var emptyOption_ = emptyOption && emptyOption[0];
        var unknownOption_ = unknownOption && unknownOption[0];

        if (emptyOption_ || unknownOption_) {
          while (current &&
                (current === emptyOption_ ||
                current === unknownOption_)) {
            current = current.nextSibling;
          }
        }
        return current;
      }


      function updateOptions() {

        options = ngOptions.getOptions();
        var groupMap = {};
        var currentElement = selectElement[0].firstChild;

        // Ensure that the empty option is always there if it was explicitly provided
        if (providedEmptyOption) {
          selectElement.prepend(emptyOption);
        }

        currentElement = skipEmptyAndUnknownOptions(currentElement);

        options.items.forEach(function updateOption(option) {
          var group;
          var groupElement;
          var optionElement;

          if (option.group) {

            // This option is to live in a group
            // See if we have already created this group
            group = groupMap[option.group];

            if (!group) {

              // We have not already created this group
              groupElement = addOrReuseElement(selectElement[0],
                                               currentElement,
                                               'optgroup',
                                               optGroupTemplate);
              // Move to the next element
              currentElement = groupElement.nextSibling;

              // Update the label on the group element
              groupElement.label = option.group;

              // Store it for use later
              group = groupMap[option.group] = {
                groupElement: groupElement,
                currentOptionElement: groupElement.firstChild
              };

            }

            // So now we have a group for this option we add the option to the group
            optionElement = addOrReuseElement(group.groupElement,
                                              group.currentOptionElement,
                                              'option',
                                              optionTemplate);
            updateOptionElement(option, optionElement);
            // Move to the next element
            group.currentOptionElement = optionElement.nextSibling;

          } else {

            // This option is not in a group
            optionElement = addOrReuseElement(selectElement[0],
                                              currentElement,
                                              'option',
                                              optionTemplate);
            updateOptionElement(option, optionElement);
            // Move to the next element
            currentElement = optionElement.nextSibling;
          }
        });


        // Now remove all excess options and group
        Object.keys(groupMap).forEach(function(key) {
          removeExcessElements(groupMap[key].currentOptionElement);
        });
        removeExcessElements(currentElement);

        ngModelCtrl.$render();
      }

    }
  };
}];
