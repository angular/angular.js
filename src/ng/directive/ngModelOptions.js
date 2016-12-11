'use strict';

/* exported defaultModelOptions */
var defaultModelOptions;
var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;

/**
 * @ngdoc type
 * @name ModelOptions
 * @description
 * A container for the options set by the {@link ngModelOptions} directive
 */
function ModelOptions(options) {
  this.$$options = options;
}

ModelOptions.prototype = {

  /**
   * @ngdoc method
   * @name ModelOptions#getOption
   * @param {string} name the name of the option to retrieve
   * @returns {*} the value of the option
   * @description
   * Returns the value of the given option
   */
  getOption: function(name) {
    return this.$$options[name];
  },

  /**
   * @ngdoc method
   * @name ModelOptions#createChild
   * @param {Object} options a hash of options for the new child that will override the parent's options
   * @return {ModelOptions} a new `ModelOptions` object initialized with the given options.
   */
  createChild: function(options) {
    var inheritAll = false;

    // make a shallow copy
    options = extend({}, options);

    // Inherit options from the parent if specified by the value `"$inherit"`
    forEach(options, /* @this */ function(option, key) {
      if (option === '$inherit') {
        if (key === '*') {
          inheritAll = true;
        } else {
          options[key] = this.$$options[key];
          // `updateOn` is special so we must also inherit the `updateOnDefault` option
          if (key === 'updateOn') {
            options.updateOnDefault = this.$$options.updateOnDefault;
          }
        }
      } else {
        if (key === 'updateOn') {
          // If the `updateOn` property contains the `default` event then we have to remove
          // it from the event list and set the `updateOnDefault` flag.
          options.updateOnDefault = false;
          options[key] = trim(option.replace(DEFAULT_REGEXP, function() {
            options.updateOnDefault = true;
            return ' ';
          }));
        }
      }
    }, this);

    if (inheritAll) {
      // We have a property of the form: `"*": "$inherit"`
      delete options['*'];
      defaults(options, this.$$options);
    }

    // Finally add in any missing defaults
    defaults(options, defaultModelOptions.$$options);

    return new ModelOptions(options);
  }
};


defaultModelOptions = new ModelOptions({
  updateOn: '',
  updateOnDefault: true,
  debounce: 0,
  getterSetter: false,
  allowInvalid: false,
  timezone: null
});


/**
 * @ngdoc directive
 * @name ngModelOptions
 *
 * @description
 * This directive allows you to modify the behaviour of {@link ngModel} directives within your
 * application. You can specify an `ngModelOptions` directive on any element. All {@link ngModel}
 * directives will use the options of their nearest `ngModelOptions` ancestor.
 *
 * The `ngModelOptions` settings are found by evaluating the value of the attribute directive as
 * an Angular expression. This expression should evaluate to an object, whose properties contain
 * the settings. For example: `<div "ng-model-options"="{ debounce: 100 }"`.
 *
 * ## Inheriting Options
 *
 * You can specify that an `ngModelOptions` setting should be inherited from a parent `ngModelOptions`
 * directive by giving it the value of `"$inherit"`.
 * Then it will inherit that setting from the first `ngModelOptions` directive found by traversing up the
 * DOM tree. If there is no ancestor element containing an `ngModelOptions` directive then default settings
 * will be used.
 *
 * For example given the following fragment of HTML
 *
 *
 * ```html
 * <div ng-model-options="{ allowInvalid: true, debounce: 200 }">
 *   <form ng-model-options="{ updateOn: 'blur', allowInvalid: '$inherit' }">
 *     <input ng-model-options="{ updateOn: 'default', allowInvalid: '$inherit' }" />
 *   </form>
 * </div>
 * ```
 *
 * the `input` element will have the following settings
 *
 * ```js
 * { allowInvalid: true, updateOn: 'default', debounce: 0 }
 * ```
 *
 * Notice that the `debounce` setting was not inherited and used the default value instead.
 *
 * You can specify that all undefined settings are automatically inherited from an ancestor by
 * including a property with key of `"*"` and value of `"$inherit"`.
 *
 * For example given the following fragment of HTML
 *
 *
 * ```html
 * <div ng-model-options="{ allowInvalid: true, debounce: 200 }">
 *   <form ng-model-options="{ updateOn: 'blur', "*": '$inherit' }">
 *     <input ng-model-options="{ updateOn: 'default', "*": '$inherit' }" />
 *   </form>
 * </div>
 * ```
 *
 * the `input` element will have the following settings
 *
 * ```js
 * { allowInvalid: true, updateOn: 'default', debounce: 200 }
 * ```
 *
 * Notice that the `debounce` setting now inherits the value from the outer `<div>` element.
 *
 * If you are creating a reusable component then you should be careful when using `"*": "$inherit"`
 * since you may inadvertently inherit a setting in the future that changes the behavior of your component.
 *
 *
 * ## Triggering and debouncing model updates
 *
 * The `updateOn` and `debounce` properties allow you to specify a custom list of events that will
 * trigger a model update and/or a debouncing delay so that the actual update only takes place when
 * a timer expires; this timer will be reset after another change takes place.
 *
 * Given the nature of `ngModelOptions`, the value displayed inside input fields in the view might
 * be different from the value in the actual model. This means that if you update the model you
 * should also invoke {@link ngModel.NgModelController#$rollbackViewValue} on the relevant input field in
 * order to make sure it is synchronized with the model and that any debounced action is canceled.
 *
 * The easiest way to reference the control's {@link ngModel.NgModelController#$rollbackViewValue}
 * method is by making sure the input is placed inside a form that has a `name` attribute. This is
 * important because `form` controllers are published to the related scope under the name in their
 * `name` attribute.
 *
 * Any pending changes will take place immediately when an enclosing form is submitted via the
 * `submit` event. Note that `ngClick` events will occur before the model is updated. Use `ngSubmit`
 * to have access to the updated model.
 *
 * The following example shows how to override immediate updates. Changes on the inputs within the
 * form will update the model only when the control loses focus (blur event). If `escape` key is
 * pressed while the input field is focused, the value is reset to the value in the current model.
 *
 * <example name="ngModelOptions-directive-blur" module="optionsExample">
 *   <file name="index.html">
 *     <div ng-controller="ExampleController">
 *       <form name="userForm">
 *         <label>
 *           Name:
 *           <input type="text" name="userName"
 *                  ng-model="user.name"
 *                  ng-model-options="{ updateOn: 'blur' }"
 *                  ng-keyup="cancel($event)" />
 *         </label><br />
 *         <label>
 *           Other data:
 *           <input type="text" ng-model="user.data" />
 *         </label><br />
 *       </form>
 *       <pre>user.name = <span ng-bind="user.name"></span></pre>
 *     </div>
 *   </file>
 *   <file name="app.js">
 *     angular.module('optionsExample', [])
 *       .controller('ExampleController', ['$scope', function($scope) {
 *         $scope.user = { name: 'say', data: '' };
 *
 *         $scope.cancel = function(e) {
 *           if (e.keyCode === 27) {
 *             $scope.userForm.userName.$rollbackViewValue();
 *           }
 *         };
 *       }]);
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     var model = element(by.binding('user.name'));
 *     var input = element(by.model('user.name'));
 *     var other = element(by.model('user.data'));
 *
 *     it('should allow custom events', function() {
 *       input.sendKeys(' hello');
 *       input.click();
 *       expect(model.getText()).toEqual('say');
 *       other.click();
 *       expect(model.getText()).toEqual('say hello');
 *     });
 *
 *     it('should $rollbackViewValue when model changes', function() {
 *       input.sendKeys(' hello');
 *       expect(input.getAttribute('value')).toEqual('say hello');
 *       input.sendKeys(protractor.Key.ESCAPE);
 *       expect(input.getAttribute('value')).toEqual('say');
 *       other.click();
 *       expect(model.getText()).toEqual('say');
 *     });
 *   </file>
 * </example>
 *
 * The next example shows how to debounce model changes. Model will be updated only 1 sec after last change.
 * If the `Clear` button is pressed, any debounced action is canceled and the value becomes empty.
 *
 * <example name="ngModelOptions-directive-debounce" module="optionsExample">
 *   <file name="index.html">
 *     <div ng-controller="ExampleController">
 *       <form name="userForm">
 *         Name:
 *         <input type="text" name="userName"
 *                ng-model="user.name"
 *                ng-model-options="{ debounce: 1000 }" />
 *         <button ng-click="userForm.userName.$rollbackViewValue(); user.name=''">Clear</button><br />
 *       </form>
 *       <pre>user.name = <span ng-bind="user.name"></span></pre>
 *     </div>
 *   </file>
 *   <file name="app.js">
 *     angular.module('optionsExample', [])
 *       .controller('ExampleController', ['$scope', function($scope) {
 *         $scope.user = { name: 'say' };
 *       }]);
 *   </file>
 * </example>
 *
 * ## Model updates and validation
 *
 * The default behaviour in `ngModel` is that the model value is set to `undefined` when the
 * validation determines that the value is invalid. By setting the `allowInvalid` property to true,
 * the model will still be updated even if the value is invalid.
 *
 *
 * ## Connecting to the scope
 *
 * By setting the `getterSetter` property to true you are telling ngModel that the `ngModel` expression
 * on the scope refers to a "getter/setter" function rather than the value itself.
 *
 * The following example shows how to bind to getter/setters:
 *
 * <example name="ngModelOptions-directive-getter-setter" module="getterSetterExample">
 *   <file name="index.html">
 *     <div ng-controller="ExampleController">
 *       <form name="userForm">
 *         <label>
 *           Name:
 *           <input type="text" name="userName"
 *                  ng-model="user.name"
 *                  ng-model-options="{ getterSetter: true }" />
 *         </label>
 *       </form>
 *       <pre>user.name = <span ng-bind="user.name()"></span></pre>
 *     </div>
 *   </file>
 *   <file name="app.js">
 *     angular.module('getterSetterExample', [])
 *       .controller('ExampleController', ['$scope', function($scope) {
 *         var _name = 'Brian';
 *         $scope.user = {
 *           name: function(newName) {
 *             return angular.isDefined(newName) ? (_name = newName) : _name;
 *           }
 *         };
 *       }]);
 *   </file>
 * </example>
 *
 *
 * ## Specifying timezones
 *
 * You can specify the timezone that date/time input directives expect by providing its name in the
 * `timezone` property.
 *
 * @param {Object} ngModelOptions options to apply to {@link ngModel} directives on this element and
 *   and its descendents. Valid keys are:
 *   - `updateOn`: string specifying which event should the input be bound to. You can set several
 *     events using an space delimited list. There is a special event called `default` that
 *     matches the default events belonging to the control.
 *   - `debounce`: integer value which contains the debounce model update value in milliseconds. A
 *     value of 0 triggers an immediate update. If an object is supplied instead, you can specify a
 *     custom value for each event. For example:
 *     ```
 *     ng-model-options="{
 *       updateOn: 'default blur',
 *       debounce: { 'default': 500, 'blur': 0 }
 *     }"
 *     ```
 *   - `allowInvalid`: boolean value which indicates that the model can be set with values that did
 *     not validate correctly instead of the default behavior of setting the model to undefined.
 *   - `getterSetter`: boolean value which determines whether or not to treat functions bound to
 *     `ngModel` as getters/setters.
 *   - `timezone`: Defines the timezone to be used to read/write the `Date` instance in the model for
 *     `<input type="date" />`, `<input type="time" />`, ... . It understands UTC/GMT and the
 *     continental US time zone abbreviations, but for general use, use a time zone offset, for
 *     example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
 *     If not specified, the timezone of the browser will be used.
 *
 */
var ngModelOptionsDirective = function() {
  NgModelOptionsController.$inject = ['$attrs', '$scope'];
  function NgModelOptionsController($attrs, $scope) {
    this.$$attrs = $attrs;
    this.$$scope = $scope;
  }
  NgModelOptionsController.prototype = {
    $onInit: function() {
      var parentOptions = this.parentCtrl ? this.parentCtrl.$options : defaultModelOptions;
      var modelOptionsDefinition = this.$$scope.$eval(this.$$attrs.ngModelOptions);

      this.$options = parentOptions.createChild(modelOptionsDefinition);
    }
  };

  return {
    restrict: 'A',
    // ngModelOptions needs to run before ngModel and input directives
    priority: 10,
    require: {parentCtrl: '?^^ngModelOptions'},
    bindToController: true,
    controller: NgModelOptionsController
  };
};


// shallow copy over values from `src` that are not already specified on `dst`
function defaults(dst, src) {
  forEach(src, function(value, key) {
    if (!isDefined(dst[key])) {
      dst[key] = value;
    }
  });
}
