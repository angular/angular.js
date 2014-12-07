'use strict';

var ngOptionsMinErr = minErr('ngOptions');
/**
 * @ngdoc directive
 * @name select
 * @restrict E
 *
 * @description
 * HTML `SELECT` element with angular data-binding.
 *
 * # `ngOptions`
 *
 * The `ngOptions` attribute can be used to dynamically generate a list of `<option>`
 * elements for the `<select>` element using the array or object obtained by evaluating the
 * `ngOptions` comprehension_expression.
 *
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of `ngOptions` to achieve a
 * similar result. However, the `ngOptions` provides some benefits such as reducing memory and
 * increasing speed by not creating a new scope for each repeated instance, as well as providing
 * more flexibility in how the `select`'s model is assigned via `select as`. `ngOptions` should be
 * used when the `select` model needs to be bound to a non-string value. This is because an option
 * element can only be bound to string values at present.
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
 * ## `select as`
 *
 * Using `select as` will bind the result of the `select as` expression to the model, but
 * the value of the `<select>` and `<option>` html elements will be either the index (for array data sources)
 * or property name (for object data sources) of the value within the collection. If a `track by` expression
 * is used, the result of that expression will be set as the value of the `option` and `select` elements.
 *
 * ### `select as` with `track by`
 *
 * Using `select as` together with `track by` is not recommended. Reasoning:
 *
 * - Example: &lt;select ng-options="item.subItem as item.label for item in values track by item.id" ng-model="selected"&gt;
 *   values: [{id: 1, label: 'aLabel', subItem: {name: 'aSubItem'}}, {id: 2, label: 'bLabel', subItem: {name: 'bSubItem'}}],
 *   $scope.selected = {name: 'aSubItem'};
 * - track by is always applied to `value`, with the purpose of preserving the selection,
 *   (to `item` in this case)
 * - to calculate whether an item is selected we do the following:
 *   1. apply `track by` to the values in the array, e.g.
 *      In the example: [1,2]
 *   2. apply `track by` to the already selected value in `ngModel`:
 *      In the example: this is not possible, as `track by` refers to `item.id`, but the selected
 *      value from `ngModel` is `{name: aSubItem}`.
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

var ngOptionsDirective = valueFn({
  restrict: 'A',
  terminal: true
});

// jshint maxlen: false
var selectDirective = ['$compile', '$parse', function($compile,   $parse) {
                         //000011111111110000000000022222222220000000000000000000003333333333000000000000004444444444444440000000005555555555555550000000666666666666666000000000000000777777777700000000000000000008888888888
  var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
      nullModelCtrl = {$setViewValue: noop};
// jshint maxlen: 100

  return {
    restrict: 'E',
    require: ['select', '?ngModel'],
    controller: ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {
      var self = this,
          optionsMap = {},
          ngModelCtrl = nullModelCtrl,
          nullOption,
          unknownOption;


      self.databound = $attrs.ngModel;


      self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
        ngModelCtrl = ngModelCtrl_;
        nullOption = nullOption_;
        unknownOption = unknownOption_;
      };


      self.addOption = function(value, element) {
        assertNotHasOwnProperty(value, '"option value"');
        optionsMap[value] = true;

        if (ngModelCtrl.$viewValue == value) {
          $element.val(value);
          if (unknownOption.parent()) unknownOption.remove();
        }
        // Workaround for https://code.google.com/p/chromium/issues/detail?id=381459
        // Adding an <option selected="selected"> element to a <select required="required"> should
        // automatically select the new element
        if (element && element[0].hasAttribute('selected')) {
          element[0].selected = true;
        }
      };


      self.removeOption = function(value) {
        if (this.hasOption(value)) {
          delete optionsMap[value];
          if (ngModelCtrl.$viewValue === value) {
            this.renderUnknownOption(value);
          }
        }
      };


      self.renderUnknownOption = function(val) {
        var unknownVal = '? ' + hashKey(val) + ' ?';
        unknownOption.val(unknownVal);
        $element.prepend(unknownOption);
        $element.val(unknownVal);
        unknownOption.prop('selected', true); // needed for IE
      };


      self.hasOption = function(value) {
        return optionsMap.hasOwnProperty(value);
      };

      $scope.$on('$destroy', function() {
        // disable unknown option so that we don't do work when the whole select is being destroyed
        self.renderUnknownOption = noop;
      });
    }],

    link: function(scope, element, attr, ctrls) {
      // if ngModel is not defined, we don't need to do anything
      if (!ctrls[1]) return;

      var selectCtrl = ctrls[0],
          ngModelCtrl = ctrls[1],
          multiple = attr.multiple,
          optionsExp = attr.ngOptions,
          nullOption = false, // if false, user will not be able to select it (used by ngOptions)
          emptyOption,
          renderScheduled = false,
          // we can't just jqLite('<option>') since jqLite is not smart enough
          // to create it in <select> and IE barfs otherwise.
          optionTemplate = jqLite(document.createElement('option')),
          optGroupTemplate =jqLite(document.createElement('optgroup')),
          unknownOption = optionTemplate.clone();

      // find "null" option
      for (var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
        if (children[i].value === '') {
          emptyOption = nullOption = children.eq(i);
          break;
        }
      }

      selectCtrl.init(ngModelCtrl, nullOption, unknownOption);

      // required validator
      if (multiple) {
        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };
      }

      if (optionsExp) setupAsOptions(scope, element, ngModelCtrl);
      else if (multiple) setupAsMultiple(scope, element, ngModelCtrl);
      else setupAsSingle(scope, element, ngModelCtrl, selectCtrl);


      ////////////////////////////



      function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
        ngModelCtrl.$render = function() {
          var viewValue = ngModelCtrl.$viewValue;

          if (selectCtrl.hasOption(viewValue)) {
            if (unknownOption.parent()) unknownOption.remove();
            selectElement.val(viewValue);
            if (viewValue === '') emptyOption.prop('selected', true); // to make IE9 happy
          } else {
            if (isUndefined(viewValue) && emptyOption) {
              selectElement.val('');
            } else {
              selectCtrl.renderUnknownOption(viewValue);
            }
          }
        };

        selectElement.on('change', function() {
          scope.$apply(function() {
            if (unknownOption.parent()) unknownOption.remove();
            ngModelCtrl.$setViewValue(selectElement.val());
          });
        });
      }

      function setupAsMultiple(scope, selectElement, ctrl) {
        var lastView;
        ctrl.$render = function() {
          var items = new HashMap(ctrl.$viewValue);
          forEach(selectElement.find('option'), function(option) {
            option.selected = isDefined(items.get(option.value));
          });
        };

        // we have to do it on each watch since ngModel watches reference, but
        // we need to work of an array, so we need to see if anything was inserted/removed
        scope.$watch(function selectMultipleWatch() {
          if (!equals(lastView, ctrl.$viewValue)) {
            lastView = shallowCopy(ctrl.$viewValue);
            ctrl.$render();
          }
        });

        selectElement.on('change', function() {
          scope.$apply(function() {
            var array = [];
            forEach(selectElement.find('option'), function(option) {
              if (option.selected) {
                array.push(option.value);
              }
            });
            ctrl.$setViewValue(array);
          });
        });
      }

      function setupAsOptions(scope, selectElement, ctrl) {
        var match;

        if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
          throw ngOptionsMinErr('iexp',
            "Expected expression in form of " +
            "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
            " but got '{0}'. Element: {1}",
            optionsExp, startingTag(selectElement));
        }

        var displayFn = $parse(match[2] || match[1]),
            valueName = match[4] || match[6],
            selectAs = / as /.test(match[0]) && match[1],
            selectAsFn = selectAs ? $parse(selectAs) : null,
            keyName = match[5],
            groupByFn = $parse(match[3] || ''),
            valueFn = $parse(match[2] ? match[1] : valueName),
            valuesFn = $parse(match[7]),
            track = match[8],
            trackFn = track ? $parse(match[8]) : null,
            trackKeysCache = {},
            // This is an array of array of existing option groups in DOM.
            // We try to reuse these if possible
            // - optionGroupsCache[0] is the options with no option group
            // - optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element
            optionGroupsCache = [[{element: selectElement, label:''}]],
            //re-usable object to represent option's locals
            locals = {};

        if (nullOption) {
          // compile the element since there might be bindings in it
          $compile(nullOption)(scope);

          // remove the class, which is added automatically because we recompile the element and it
          // becomes the compilation root
          nullOption.removeClass('ng-scope');

          // we need to remove it before calling selectElement.empty() because otherwise IE will
          // remove the label from the element. wtf?
          nullOption.remove();
        }

        // clear contents, we'll add what's needed based on the model
        selectElement.empty();

        selectElement.on('change', selectionChanged);

        ctrl.$render = render;

        scope.$watchCollection(valuesFn, scheduleRendering);
        scope.$watchCollection(getLabels, scheduleRendering);

        if (multiple) {
          scope.$watchCollection(function() { return ctrl.$modelValue; }, scheduleRendering);
        }

        // ------------------------------------------------------------------ //

        function callExpression(exprFn, key, value) {
          locals[valueName] = value;
          if (keyName) locals[keyName] = key;
          return exprFn(scope, locals);
        }

        function selectionChanged() {
          scope.$apply(function() {
            var collection = valuesFn(scope) || [];
            var viewValue;
            if (multiple) {
              viewValue = [];
              forEach(selectElement.val(), function(selectedKey) {
                  selectedKey = trackFn ? trackKeysCache[selectedKey] : selectedKey;
                viewValue.push(getViewValue(selectedKey, collection[selectedKey]));
              });
            } else {
              var selectedKey = trackFn ? trackKeysCache[selectElement.val()] : selectElement.val();
              viewValue = getViewValue(selectedKey, collection[selectedKey]);
            }
            ctrl.$setViewValue(viewValue);
            render();
          });
        }

        function getViewValue(key, value) {
          if (key === '?') {
            return undefined;
          } else if (key === '') {
            return null;
          } else {
            var viewValueFn = selectAsFn ? selectAsFn : valueFn;
            return callExpression(viewValueFn, key, value);
          }
        }

        function getLabels() {
          var values = valuesFn(scope);
          var toDisplay;
          if (values && isArray(values)) {
            toDisplay = new Array(values.length);
            for (var i = 0, ii = values.length; i < ii; i++) {
              toDisplay[i] = callExpression(displayFn, i, values[i]);
            }
            return toDisplay;
          } else if (values) {
            // TODO: Add a test for this case
            toDisplay = {};
            for (var prop in values) {
              if (values.hasOwnProperty(prop)) {
                toDisplay[prop] = callExpression(displayFn, prop, values[prop]);
              }
            }
          }
          return toDisplay;
        }

        function createIsSelectedFn(viewValue) {
          var selectedSet;
          if (multiple) {
            if (trackFn && isArray(viewValue)) {

              selectedSet = new HashMap([]);
              for (var trackIndex = 0; trackIndex < viewValue.length; trackIndex++) {
                // tracking by key
                selectedSet.put(callExpression(trackFn, null, viewValue[trackIndex]), true);
              }
            } else {
              selectedSet = new HashMap(viewValue);
            }
          } else if (trackFn) {
            viewValue = callExpression(trackFn, null, viewValue);
          }

          return function isSelected(key, value) {
            var compareValueFn;
            if (trackFn) {
              compareValueFn = trackFn;
            } else if (selectAsFn) {
              compareValueFn = selectAsFn;
            } else {
              compareValueFn = valueFn;
            }

            if (multiple) {
              return isDefined(selectedSet.remove(callExpression(compareValueFn, key, value)));
            } else {
              return viewValue === callExpression(compareValueFn, key, value);
            }
          };
        }

        function scheduleRendering() {
          if (!renderScheduled) {
            scope.$$postDigest(render);
            renderScheduled = true;
          }
        }

        /**
         * A new labelMap is created with each render.
         * This function is called for each existing option with added=false,
         * and each new option with added=true.
         * - Labels that are passed to this method twice,
         * (once with added=true and once with added=false) will end up with a value of 0, and
         * will cause no change to happen to the corresponding option.
         * - Labels that are passed to this method only once with added=false will end up with a
         * value of -1 and will eventually be passed to selectCtrl.removeOption()
         * - Labels that are passed to this method only once with added=true will end up with a
         * value of 1 and will eventually be passed to selectCtrl.addOption()
        */
        function updateLabelMap(labelMap, label, added) {
          labelMap[label] = labelMap[label] || 0;
          labelMap[label] += (added ? 1 : -1);
        }

        function render() {
          renderScheduled = false;

          // Temporary location for the option groups before we render them
          var optionGroups = {'':[]},
              optionGroupNames = [''],
              optionGroupName,
              optionGroup,
              option,
              existingParent, existingOptions, existingOption,
              viewValue = ctrl.$viewValue,
              values = valuesFn(scope) || [],
              keys = keyName ? sortedKeys(values) : values,
              key,
              value,
              groupLength, length,
              groupIndex, index,
              labelMap = {},
              selected,
              isSelected = createIsSelectedFn(viewValue),
              anySelected = false,
              lastElement,
              element,
              label,
              optionId;

          trackKeysCache = {};

          // We now build up the list of options we need (we merge later)
          for (index = 0; length = keys.length, index < length; index++) {
            key = index;
            if (keyName) {
              key = keys[index];
              if (key.charAt(0) === '$') continue;
            }
            value = values[key];

            optionGroupName = callExpression(groupByFn, key, value) || '';
            if (!(optionGroup = optionGroups[optionGroupName])) {
              optionGroup = optionGroups[optionGroupName] = [];
              optionGroupNames.push(optionGroupName);
            }

            selected = isSelected(key, value);
            anySelected = anySelected || selected;

            label = callExpression(displayFn, key, value); // what will be seen by the user

            // doing displayFn(scope, locals) || '' overwrites zero values
            label = isDefined(label) ? label : '';
            optionId = trackFn ? trackFn(scope, locals) : (keyName ? keys[index] : index);
            if (trackFn) {
              trackKeysCache[optionId] = key;
            }

            optionGroup.push({
              // either the index into array or key from object
              id: optionId,
              label: label,
              selected: selected                   // determine if we should be selected
            });
          }
          if (!multiple) {
            if (nullOption || viewValue === null) {
              // insert null option if we have a placeholder, or the model is null
              optionGroups[''].unshift({id:'', label:'', selected:!anySelected});
            } else if (!anySelected) {
              // option could not be found, we have to insert the undefined item
              optionGroups[''].unshift({id:'?', label:'', selected:true});
            }
          }

          // Now we need to update the list of DOM nodes to match the optionGroups we computed above
          for (groupIndex = 0, groupLength = optionGroupNames.length;
               groupIndex < groupLength;
               groupIndex++) {
            // current option group name or '' if no group
            optionGroupName = optionGroupNames[groupIndex];

            // list of options for that group. (first item has the parent)
            optionGroup = optionGroups[optionGroupName];

            if (optionGroupsCache.length <= groupIndex) {
              // we need to grow the optionGroups
              existingParent = {
                element: optGroupTemplate.clone().attr('label', optionGroupName),
                label: optionGroup.label
              };
              existingOptions = [existingParent];
              optionGroupsCache.push(existingOptions);
              selectElement.append(existingParent.element);
            } else {
              existingOptions = optionGroupsCache[groupIndex];
              existingParent = existingOptions[0];  // either SELECT (no group) or OPTGROUP element

              // update the OPTGROUP label if not the same.
              if (existingParent.label != optionGroupName) {
                existingParent.element.attr('label', existingParent.label = optionGroupName);
              }
            }

            lastElement = null;  // start at the beginning
            for (index = 0, length = optionGroup.length; index < length; index++) {
              option = optionGroup[index];
              if ((existingOption = existingOptions[index + 1])) {
                // reuse elements
                lastElement = existingOption.element;
                if (existingOption.label !== option.label) {
                  updateLabelMap(labelMap, existingOption.label, false);
                  updateLabelMap(labelMap, option.label, true);
                  lastElement.text(existingOption.label = option.label);
                  lastElement.prop('label', existingOption.label);
                }
                if (existingOption.id !== option.id) {
                  lastElement.val(existingOption.id = option.id);
                }
                // lastElement.prop('selected') provided by jQuery has side-effects
                if (lastElement[0].selected !== option.selected) {
                  lastElement.prop('selected', (existingOption.selected = option.selected));
                  if (msie) {
                    // See #7692
                    // The selected item wouldn't visually update on IE without this.
                    // Tested on Win7: IE9, IE10 and IE11. Future IEs should be tested as well
                    lastElement.prop('selected', existingOption.selected);
                  }
                }
              } else {
                // grow elements

                // if it's a null option
                if (option.id === '' && nullOption) {
                  // put back the pre-compiled element
                  element = nullOption;
                } else {
                  // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but
                  // in this version of jQuery on some browser the .text() returns a string
                  // rather then the element.
                  (element = optionTemplate.clone())
                      .val(option.id)
                      .prop('selected', option.selected)
                      .attr('selected', option.selected)
                      .prop('label', option.label)
                      .text(option.label);
                }

                existingOptions.push(existingOption = {
                    element: element,
                    label: option.label,
                    id: option.id,
                    selected: option.selected
                });
                updateLabelMap(labelMap, option.label, true);
                if (lastElement) {
                  lastElement.after(element);
                } else {
                  existingParent.element.append(element);
                }
                lastElement = element;
              }
            }
            // remove any excessive OPTIONs in a group
            index++; // increment since the existingOptions[0] is parent element not OPTION
            while (existingOptions.length > index) {
              option = existingOptions.pop();
              updateLabelMap(labelMap, option.label, false);
              option.element.remove();
            }
          }
          // remove any excessive OPTGROUPs from select
          while (optionGroupsCache.length > groupIndex) {
            // remove all the labels in the option group
            optionGroup = optionGroupsCache.pop();
            for (index = 1; index < optionGroup.length; ++index) {
              updateLabelMap(labelMap, optionGroup[index].label, false);
            }
            optionGroup[0].element.remove();
          }
          forEach(labelMap, function(count, label) {
            if (count > 0) {
              selectCtrl.addOption(label);
            } else if (count < 0) {
              selectCtrl.removeOption(label);
            }
          });
        }
      }
    }
  };
}];

var optionDirective = ['$interpolate', function($interpolate) {
  var nullSelectCtrl = {
    addOption: noop,
    removeOption: noop
  };

  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {
      if (isUndefined(attr.value)) {
        var interpolateFn = $interpolate(element.text(), true);
        if (!interpolateFn) {
          attr.$set('value', element.text());
        }
      }

      return function(scope, element, attr) {
        var selectCtrlName = '$selectController',
            parent = element.parent(),
            selectCtrl = parent.data(selectCtrlName) ||
              parent.parent().data(selectCtrlName); // in case we are in optgroup

        if (!selectCtrl || !selectCtrl.databound) {
          selectCtrl = nullSelectCtrl;
        }

        if (interpolateFn) {
          scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
            attr.$set('value', newVal);
            if (oldVal !== newVal) {
              selectCtrl.removeOption(oldVal);
            }
            selectCtrl.addOption(newVal, element);
          });
        } else {
          selectCtrl.addOption(attr.value, element);
        }

        element.on('$destroy', function() {
          selectCtrl.removeOption(attr.value);
        });
      };
    }
  };
}];
