'use strict';

/* exported ngOptionsDirective */

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
 * In many cases, {@link ng.directive:ngRepeat ngRepeat} can be used on `<option>` elements instead of
 * `ngOptions` to achieve a similar result. However, `ngOptions` provides some benefits:
 * - more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression
 * - reduced memory consumption by not creating a new scope for each repeated instance
 * - increased render speed by creating the options in a documentFragment instead of individually
 *
 * When an item in the `<select>` menu is selected, the array element or object property
 * represented by the selected option will be bound to the model identified by the `ngModel`
 * directive.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * ## Complex Models (objects or collections)
 *
 * By default, `ngModel` watches the model by reference, not value. This is important to know when
 * binding the select to a model that is an object or a collection.
 *
 * One issue occurs if you want to preselect an option. For example, if you set
 * the model to an object that is equal to an object in your collection, `ngOptions` won't be able to set the selection,
 * because the objects are not identical. So by default, you should always reference the item in your collection
 * for preselections, e.g.: `$scope.selected = $scope.collection[3]`.
 *
 * Another solution is to use a `track by` clause, because then `ngOptions` will track the identity
 * of the item not by reference, but by the result of the `track by` expression. For example, if your
 * collection items have an id property, you would `track by item.id`.
 *
 * A different issue with objects or collections is that ngModel won't detect if an object property or
 * a collection item changes. For that reason, `ngOptions` additionally watches the model using
 * `$watchCollection`, when the expression contains a `track by` clause or the the select has the `multiple` attribute.
 * This allows ngOptions to trigger a re-rendering of the options even if the actual object/collection
 * has not changed identity, but only a property on the object or an item in the collection changes.
 *
 * Note that `$watchCollection` does a shallow comparison of the properties of the object (or the items in the collection
 * if the model is an array). This means that changing a property deeper than the first level inside the
 * object/collection will not trigger a re-rendering.
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
 * Be careful when using `select` **`as`** and **`track by`** in the same expression.
 * </div>
 *
 * Given this array of items on the $scope:
 *
 * ```js
 * $scope.items = [{
 *   id: 1,
 *   label: 'aLabel',
 *   subItem: { name: 'aSubItem' }
 * }, {
 *   id: 2,
 *   label: 'bLabel',
 *   subItem: { name: 'bSubItem' }
 * }];
 * ```
 *
 * This will work:
 *
 * ```html
 * <select ng-options="item as item.label for item in items track by item.id" ng-model="selected"></select>
 * ```
 * ```js
 * $scope.selected = $scope.items[0];
 * ```
 *
 * but this will not work:
 *
 * ```html
 * <select ng-options="item.subItem as item.label for item in items track by item.id" ng-model="selected"></select>
 * ```
 * ```js
 * $scope.selected = $scope.items[0].subItem;
 * ```
 *
 * In both examples, the **`track by`** expression is applied successfully to each `item` in the
 * `items` array. Because the selected option has been set programmatically in the controller, the
 * **`track by`** expression is also applied to the `ngModel` value. In the first example, the
 * `ngModel` value is `items[0]` and the **`track by`** expression evaluates to `items[0].id` with
 * no issue. In the second example, the `ngModel` value is `items[0].subItem` and the **`track by`**
 * expression evaluates to `items[0].subItem.id` (which is undefined). As a result, the model value
 * is not matched against any `<option>` and the `<select>` appears as having no selected value.
 *
 *
 * @param {string} ngModel Assignable AngularJS expression to data-bind to.
 * @param {comprehension_expression} ngOptions in one of the following forms:
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
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required The control is considered valid only if value is entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {string=} ngAttrSize sets the size of the select element dynamically. Uses the
 * {@link guide/interpolation#-ngattr-for-binding-to-arbitrary-attributes ngAttr} directive.
 *
 * @example
    <example module="selectExample" name="select">
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
              <label>Name: <input ng-model="color.name"></label>
              <label><input type="checkbox" ng-model="color.notAnOption"> Disabled?</label>
              <button ng-click="colors.splice($index, 1)" aria-label="Remove">X</button>
            </li>
            <li>
              <button ng-click="colors.push({})">add</button>
            </li>
          </ul>
          <hr/>
          <label>Color (null not allowed):
            <select ng-model="myColor" ng-options="color.name for color in colors"></select>
          </label><br/>
          <label>Color (null allowed):
          <span  class="nullable">
            <select ng-model="myColor" ng-options="color.name for color in colors">
              <option value="">-- choose color --</option>
            </select>
          </span></label><br/>

          <label>Color grouped by shade:
            <select ng-model="myColor" ng-options="color.name group by color.shade for color in colors">
            </select>
          </label><br/>

          <label>Color grouped by shade, with some disabled:
            <select ng-model="myColor"
                  ng-options="color.name group by color.shade disable when color.notAnOption for color in colors">
            </select>
          </label><br/>



          Select <button ng-click="myColor = { name:'not in list', shade: 'other' }">bogus</button>.
          <br/>
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

/* eslint-disable max-len */
//                     //00001111111111000000000002222222222000000000000000000000333333333300000000000000000000000004444444444400000000000005555555555555000000000666666666666600000007777777777777000000000000000888888888800000000000000000009999999999
var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
                        // 1: value expression (valueFn)
                        // 2: label expression (displayFn)
                        // 3: group by expression (groupByFn)
                        // 4: disable when expression (disableWhenFn)
                        // 5: array item variable name
                        // 6: object item key variable name
                        // 7: object item value variable name
                        // 8: collection expression
                        // 9: track by expression
/* eslint-enable */


var ngOptionsDirective = ['$compile', '$document', '$parse', function($compile, $document, $parse) {

  function parseOptionsExpression(optionsExp, selectElement, scope) {

    var match = optionsExp.match(NG_OPTIONS_REGEXP);
    if (!(match)) {
      throw ngOptionsMinErr('iexp',
        'Expected expression in form of ' +
        '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' +
        ' but got \'{0}\'. Element: {1}',
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
    var getTrackByValueFn = trackBy ?
                              function(value, locals) { return trackByFn(scope, locals); } :
                              function getHashOfValue(value) { return hashKey(value); };
    var getTrackByValue = function(value, key) {
      return getTrackByValueFn(value, getLocals(value, key));
    };

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

    function getOptionValuesKeys(optionValues) {
      var optionValuesKeys;

      if (!keyName && isArrayLike(optionValues)) {
        optionValuesKeys = optionValues;
      } else {
        // if object, extract keys, in enumeration order, unsorted
        optionValuesKeys = [];
        for (var itemKey in optionValues) {
          if (optionValues.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
            optionValuesKeys.push(itemKey);
          }
        }
      }
      return optionValuesKeys;
    }

    return {
      trackBy: trackBy,
      getTrackByValue: getTrackByValue,
      getWatchables: $parse(valuesFn, function(optionValues) {
        // Create a collection of things that we would like to watch (watchedArray)
        // so that they can all be watched using a single $watchCollection
        // that only runs the handler once if anything changes
        var watchedArray = [];
        optionValues = optionValues || [];

        var optionValuesKeys = getOptionValuesKeys(optionValues);
        var optionValuesLength = optionValuesKeys.length;
        for (var index = 0; index < optionValuesLength; index++) {
          var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
          var value = optionValues[key];

          var locals = getLocals(value, key);
          var selectValue = getTrackByValueFn(value, locals);
          watchedArray.push(selectValue);

          // Only need to watch the displayFn if there is a specific label expression
          if (match[2] || match[1]) {
            var label = displayFn(scope, locals);
            watchedArray.push(label);
          }

          // Only need to watch the disableWhenFn if there is a specific disable expression
          if (match[4]) {
            var disableWhen = disableWhenFn(scope, locals);
            watchedArray.push(disableWhen);
          }
        }
        return watchedArray;
      }),

      getOptions: function() {

        var optionItems = [];
        var selectValueMap = {};

        // The option values were already computed in the `getWatchables` fn,
        // which must have been called to trigger `getOptions`
        var optionValues = valuesFn(scope) || [];
        var optionValuesKeys = getOptionValuesKeys(optionValues);
        var optionValuesLength = optionValuesKeys.length;

        for (var index = 0; index < optionValuesLength; index++) {
          var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
          var value = optionValues[key];
          var locals = getLocals(value, key);
          var viewValue = viewValueFn(scope, locals);
          var selectValue = getTrackByValueFn(viewValue, locals);
          var label = displayFn(scope, locals);
          var group = groupByFn(scope, locals);
          var disabled = disableWhenFn(scope, locals);
          var optionItem = new Option(selectValue, viewValue, label, group, disabled);

          optionItems.push(optionItem);
          selectValueMap[selectValue] = optionItem;
        }

        return {
          items: optionItems,
          selectValueMap: selectValueMap,
          getOptionFromViewValue: function(value) {
            return selectValueMap[getTrackByValue(value)];
          },
          getViewValueFromOption: function(option) {
            // If the viewValue could be an object that may be mutated by the application,
            // we need to make a copy and not return the reference to the value on the option.
            return trackBy ? copy(option.viewValue) : option.viewValue;
          }
        };
      }
    };
  }


  // Support: IE 9 only
  // We can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  var optionTemplate = window.document.createElement('option'),
      optGroupTemplate = window.document.createElement('optgroup');

    function ngOptionsPostLink(scope, selectElement, attr, ctrls) {

      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      var multiple = attr.multiple;

      // The emptyOption allows the application developer to provide their own custom "empty"
      // option when the viewValue does not match any of the option values.
      for (var i = 0, children = selectElement.children(), ii = children.length; i < ii; i++) {
        if (children[i].value === '') {
          selectCtrl.hasEmptyOption = true;
          selectCtrl.emptyOption = children.eq(i);
          break;
        }
      }

      // The empty option will be compiled and rendered before we first generate the options
      selectElement.empty();

      var providedEmptyOption = !!selectCtrl.emptyOption;

      var unknownOption = jqLite(optionTemplate.cloneNode(false));
      unknownOption.val('?');

      var options;
      var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);
      // This stores the newly created options before they are appended to the select.
      // Since the contents are removed from the fragment when it is appended,
      // we only need to create it once.
      var listFragment = $document[0].createDocumentFragment();

      // Overwrite the implementation. ngOptions doesn't use hashes
      selectCtrl.generateUnknownOptionValue = function(val) {
        return '?';
      };

      // Update the controller methods for multiple selectable options
      if (!multiple) {

        selectCtrl.writeValue = function writeNgOptionsValue(value) {
          // The options might not be defined yet when ngModel tries to render
          if (!options) return;

          var selectedOption = selectElement[0].options[selectElement[0].selectedIndex];
          var option = options.getOptionFromViewValue(value);

          // Make sure to remove the selected attribute from the previously selected option
          // Otherwise, screen readers might get confused
          if (selectedOption) selectedOption.removeAttribute('selected');

          if (option) {
            // Don't update the option when it is already selected.
            // For example, the browser will select the first option by default. In that case,
            // most properties are set automatically - except the `selected` attribute, which we
            // set always

            if (selectElement[0].value !== option.selectValue) {
              selectCtrl.removeUnknownOption();

              selectElement[0].value = option.selectValue;
              option.element.selected = true;
            }

            option.element.setAttribute('selected', 'selected');
          } else {
            selectCtrl.selectUnknownOrEmptyOption(value);
          }
        };

        selectCtrl.readValue = function readNgOptionsValue() {

          var selectedOption = options.selectValueMap[selectElement.val()];

          if (selectedOption && !selectedOption.disabled) {
            selectCtrl.unselectEmptyOption();
            selectCtrl.removeUnknownOption();
            return options.getViewValueFromOption(selectedOption);
          }
          return null;
        };

        // If we are using `track by` then we must watch the tracked value on the model
        // since ngModel only watches for object identity change
        // FIXME: When a user selects an option, this watch will fire needlessly
        if (ngOptions.trackBy) {
          scope.$watch(
            function() { return ngOptions.getTrackByValue(ngModelCtrl.$viewValue); },
            function() { ngModelCtrl.$render(); }
          );
        }

      } else {

        selectCtrl.writeValue = function writeNgOptionsMultiple(values) {
          // The options might not be defined yet when ngModel tries to render
          if (!options) return;

          // Only set `<option>.selected` if necessary, in order to prevent some browsers from
          // scrolling to `<option>` elements that are outside the `<select>` element's viewport.
          var selectedOptions = values && values.map(getAndUpdateSelectedOption) || [];

          options.items.forEach(function(option) {
            if (option.element.selected && !includes(selectedOptions, option)) {
              option.element.selected = false;
            }
          });
        };


        selectCtrl.readValue = function readNgOptionsMultiple() {
          var selectedValues = selectElement.val() || [],
              selections = [];

          forEach(selectedValues, function(value) {
            var option = options.selectValueMap[value];
            if (option && !option.disabled) selections.push(options.getViewValueFromOption(option));
          });

          return selections;
        };

        // If we are using `track by` then we must watch these tracked values on the model
        // since ngModel only watches for object identity change
        if (ngOptions.trackBy) {

          scope.$watchCollection(function() {
            if (isArray(ngModelCtrl.$viewValue)) {
              return ngModelCtrl.$viewValue.map(function(value) {
                return ngOptions.getTrackByValue(value);
              });
            }
          }, function() {
            ngModelCtrl.$render();
          });

        }
      }

      if (providedEmptyOption) {

        // compile the element since there might be bindings in it
        $compile(selectCtrl.emptyOption)(scope);

        selectElement.prepend(selectCtrl.emptyOption);

        if (selectCtrl.emptyOption[0].nodeType === NODE_TYPE_COMMENT) {
          // This means the empty option has currently no actual DOM node, probably because
          // it has been modified by a transclusion directive.
          selectCtrl.hasEmptyOption = false;

          // Redefine the registerOption function, which will catch
          // options that are added by ngIf etc. (rendering of the node is async because of
          // lazy transclusion)
          selectCtrl.registerOption = function(optionScope, optionEl) {
            if (optionEl.val() === '') {
              selectCtrl.hasEmptyOption = true;
              selectCtrl.emptyOption = optionEl;
              selectCtrl.emptyOption.removeClass('ng-scope');
              // This ensures the new empty option is selected if previously no option was selected
              ngModelCtrl.$render();

              optionEl.on('$destroy', function() {
                var needsRerender = selectCtrl.$isEmptyOptionSelected();

                selectCtrl.hasEmptyOption = false;
                selectCtrl.emptyOption = undefined;

                if (needsRerender) ngModelCtrl.$render();
              });
            }
          };

        } else {
          // remove the class, which is added automatically because we recompile the element and it
          // becomes the compilation root
          selectCtrl.emptyOption.removeClass('ng-scope');
        }

      }

      // We will re-render the option elements if the option values or labels change
      scope.$watchCollection(ngOptions.getWatchables, updateOptions);

      // ------------------------------------------------------------------ //

      function addOptionElement(option, parent) {
        var optionElement = optionTemplate.cloneNode(false);
        parent.appendChild(optionElement);
        updateOptionElement(option, optionElement);
      }

      function getAndUpdateSelectedOption(viewValue) {
        var option = options.getOptionFromViewValue(viewValue);
        var element = option && option.element;

        if (element && !element.selected) element.selected = true;

        return option;
      }

      function updateOptionElement(option, element) {
        option.element = element;
        element.disabled = option.disabled;
        // Support: IE 11 only, Edge 12-13 only
        // NOTE: The label must be set before the value, otherwise IE 11 & Edge create unresponsive
        // selects in certain circumstances when multiple selects are next to each other and display
        // the option list in listbox style, i.e. the select is [multiple], or specifies a [size].
        // See https://github.com/angular/angular.js/issues/11314 for more info.
        // This is unfortunately untestable with unit / e2e tests
        if (option.label !== element.label) {
          element.label = option.label;
          element.textContent = option.label;
        }
        element.value = option.selectValue;
      }

      function updateOptions() {
        var previousValue = options && selectCtrl.readValue();

        // We must remove all current options, but cannot simply set innerHTML = null
        // since the providedEmptyOption might have an ngIf on it that inserts comments which we
        // must preserve.
        // Instead, iterate over the current option elements and remove them or their optgroup
        // parents
        if (options) {

          for (var i = options.items.length - 1; i >= 0; i--) {
            var option = options.items[i];
            if (isDefined(option.group)) {
              jqLiteRemove(option.element.parentNode);
            } else {
              jqLiteRemove(option.element);
            }
          }
        }

        options = ngOptions.getOptions();

        var groupElementMap = {};

        options.items.forEach(function addOption(option) {
          var groupElement;

          if (isDefined(option.group)) {

            // This option is to live in a group
            // See if we have already created this group
            groupElement = groupElementMap[option.group];

            if (!groupElement) {

              groupElement = optGroupTemplate.cloneNode(false);
              listFragment.appendChild(groupElement);

              // Update the label on the group element
              // "null" is special cased because of Safari
              groupElement.label = option.group === null ? 'null' : option.group;

              // Store it for use later
              groupElementMap[option.group] = groupElement;
            }

            addOptionElement(option, groupElement);

          } else {

            // This option is not in a group
            addOptionElement(option, listFragment);
          }
        });

        selectElement[0].appendChild(listFragment);

        ngModelCtrl.$render();

        // Check to see if the value has changed due to the update to the options
        if (!ngModelCtrl.$isEmpty(previousValue)) {
          var nextValue = selectCtrl.readValue();
          var isNotPrimitive = ngOptions.trackBy || multiple;
          if (isNotPrimitive ? !equals(previousValue, nextValue) : previousValue !== nextValue) {
            ngModelCtrl.$setViewValue(nextValue);
            ngModelCtrl.$render();
          }
        }
      }
  }

  return {
    restrict: 'A',
    terminal: true,
    require: ['select', 'ngModel'],
    link: {
      pre: function ngOptionsPreLink(scope, selectElement, attr, ctrls) {
        // Deactivate the SelectController.register method to prevent
        // option directives from accidentally registering themselves
        // (and unwanted $destroy handlers etc.)
        ctrls[0].registerOption = noop;
      },
      post: ngOptionsPostLink
    }
  };
}];
