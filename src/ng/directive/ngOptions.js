'use strict';

/* global jqLiteRemove */

var ngOptionsMinErr = minErr('ngOptions');

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
 * **Note:** By default, `ngModel` compares by reference, not value. This is important when binding to an
 * array of objects. See an example [in this jsfiddle](http://jsfiddle.net/qWzTb/). When using `track by`
 * in an `ngOptions` expression, however, deep equality checks will be performed.
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
 *     * `label` **`disable when`** `disable` **`for`** `value` **`in`** `array`
 *     * `label` **`group by`** `group` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *     * `label` **`disable when`** `disable` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *     * `label` **`for`** `value` **`in`** `array` | orderBy:`orderexpr` **`track by`** `trackexpr`
 *        (for including a filter with `track by`)
 *   * for object data sources:
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `label` **`disable when`** `disable` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`group by`** `group`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`disable when`** `disable`
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
 *   * `disable`: The result of this expression will be used to disable the rendered `<option>`
 *      element. Return `true` to disable.
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
              {name:'white', shade:'light', notAnOption: true},
              {name:'red', shade:'dark'},
              {name:'blue', shade:'dark', notAnOption: true},
              {name:'yellow', shade:'light', notAnOption: false}
            ];
            $scope.myColor = $scope.colors[2]; // red
          }]);
        </script>
        <div ng-controller="ExampleController">
          <ul>
            <li ng-repeat="color in colors">
              Name: <input ng-model="color.name">
              <input type="checkbox" ng-model="color.notAnOption"> Disabled?
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

          Color grouped by shade, with some disabled:
          <select ng-model="myColor"
                  ng-options="color.name group by color.shade disable when color.notAnOption for color in colors">
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
//                     //00001111111111000000000002222222222000000000000000000000333333333300000000000000000000000004444444444400000000000005555555555555550000000006666666666666660000000777777777777777000000000000000888888888800000000000000000009999999999
var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
                        // 1: value expression (valueFn)
                        // 2: label expression (displayFn)
                        // 3: group by expression (groupByFn)
                        // 4: disable when expression (disableWhenFn)
                        // 5: array item variable name
                        // 6: object item key variable name
                        // 7: object item value variable name
                        // 8: collection expression
                        // 9: track by expression
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
    var valueName = match[5] || match[7];
    // The variable name for the key of the item in the collection
    var keyName = match[6];

    // An expression that generates the viewValue for an option if there is a label expression
    var selectAs = / as /.test(match[0]) && match[1];
    // An expression that is used to track the id of each object in the options collection
    var trackBy = match[9];
    // An expression that generates the viewValue for an option if there is no label expression
    var valueFn = $parse(match[2] ? match[1] : valueName);
    var selectAsFn = selectAs && $parse(selectAs);
    var viewValueFn = selectAsFn || valueFn;
    var trackByFn = trackBy && $parse(trackBy);

    // Get the value by which we are going to track the option
    // if we have a trackFn then use that (passing scope and locals)
    // otherwise just hash the given viewValue
    var getTrackByValue = trackBy ?
                              function(viewValue, locals) { return trackByFn(scope, locals); } :
                              function getHashOfValue(viewValue) { return hashKey(viewValue); };
    var displayFn = $parse(match[2] || match[1]);
    var groupByFn = $parse(match[3] || '');
    var disableWhenFn = $parse(match[4] || '');
    var valuesFn = $parse(match[8]);

    var locals = {};
    var getLocals = keyName ? function(value, key) {
      locals[keyName] = key;
      locals[valueName] = value;
      return locals;
    } : function(value) {
      locals[valueName] = value;
      return locals;
    };


    function Option(selectValue, viewValue, label, group, disabled) {
      this.selectValue = selectValue;
      this.viewValue = viewValue;
      this.label = label;
      this.group = group;
      this.disabled = disabled;
    }

    return {
      trackBy: trackBy,
      getWatchables: $parse(valuesFn, function(values) {
        // Create a collection of things that we would like to watch (watchedArray)
        // so that they can all be watched using a single $watchCollection
        // that only runs the handler once if anything changes
        var watchedArray = [];
        values = values || [];

        Object.keys(values).forEach(function getWatchable(key) {
          var locals = getLocals(values[key], key);
          var selectValue = getTrackByValue(values[key], locals);
          watchedArray.push(selectValue);

          // Only need to watch the displayFn if there is a specific label expression
          if (match[2]) {
            var label = displayFn(scope, locals);
            watchedArray.push(label);
          }

          // Only need to watch the disableWhenFn if there is a specific disable expression
          if (match[4]) {
            var disableWhen = disableWhenFn(scope, locals);
            watchedArray.push(disableWhen);
          }
        });
        return watchedArray;
      }),

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
          var selectValue = getTrackByValue(viewValue, locals);
          var label = displayFn(scope, locals);
          var group = groupByFn(scope, locals);
          var disabled = disableWhenFn(scope, locals);
          var optionItem = new Option(selectValue, viewValue, label, group, disabled);

          optionItems.push(optionItem);
          selectValueMap[selectValue] = optionItem;
        });

        return {
          items: optionItems,
          selectValueMap: selectValueMap,
          getOptionFromViewValue: function(value) {
            return selectValueMap[getTrackByValue(value, getLocals(value))];
          },
          getViewValueFromOption: function(option) {
            // If the viewValue could be an object that may be mutated by the application,
            // we need to make a copy and not return the reference to the value on the option.
            return trackBy ? angular.copy(option.viewValue) : option.viewValue;
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
        var option = options.getOptionFromViewValue(value);

        if (option && !option.disabled) {
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
      };

      selectCtrl.readValue = function readNgOptionsValue() {

        var selectedOption = options.selectValueMap[selectElement.val()];

        if (selectedOption && !selectedOption.disabled) {
          removeEmptyOption();
          removeUnknownOption();
          return options.getViewValueFromOption(selectedOption);
        }
        return null;
      };


      // Update the controller methods for multiple selectable options
      if (multiple) {

        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };


        selectCtrl.writeValue = function writeNgOptionsMultiple(value) {
          options.items.forEach(function(option) {
            option.element.selected = false;
          });

          if (value) {
            value.forEach(function(item) {
              var option = options.getOptionFromViewValue(item);
              if (option && !option.disabled) option.element.selected = true;
            });
          }
        };


        selectCtrl.readValue = function readNgOptionsMultiple() {
          var selectedValues = selectElement.val() || [],
              selections = [];

          forEach(selectedValues, function(value) {
            var option = options.selectValueMap[value];
            if (!option.disabled) selections.push(options.getViewValueFromOption(option));
          });

          return selections;
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

      // We also need to watch to see if the internals of the model changes, since
      // ngModel only watches for object identity change
      if (ngOptions.trackBy) {
        scope.$watch(attr.ngModel, function() { ngModelCtrl.$render(); }, true);
      }
      // ------------------------------------------------------------------ //


      function updateOptionElement(option, element) {
        option.element = element;
        element.disabled = option.disabled;
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

        var previousValue = options && selectCtrl.readValue();

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

        // Check to see if the value has changed due to the update to the options
        if (!ngModelCtrl.$isEmpty(previousValue)) {
          var nextValue = selectCtrl.readValue();
          if (ngOptions.trackBy && !equals(previousValue, nextValue) ||
                previousValue !== nextValue) {
            ngModelCtrl.$setViewValue(nextValue);
            ngModelCtrl.$render();
          }
        }

      }

    }
  };
}];
