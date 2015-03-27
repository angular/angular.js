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
        self.removeUnknownOption();
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
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of {@link ng.directive:ngOptions
 * ngOptions} to achieve a similar result. However, `ngOptions` provides some benefits such as reducing
 * memory and increasing speed by not creating a new scope for each repeated instance, as well as providing
 * more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression. `ngOptions` should be used when the `<select>` model needs to be bound
 * to a non-string value. This is because an option element can only be bound to string values at
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
 * **Note:** By default, `ngModel` compares by reference, not value. This is important when binding to an
 * array of objects. See an example [in this jsfiddle](http://jsfiddle.net/qWzTb/). When using `track by`
 * in an `ngOptions` expression, however, deep equality checks will be performed.
 * </div>
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
