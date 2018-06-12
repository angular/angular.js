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
    forEach(options, /** @this */ function(option, key) {
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
 * @restrict A
 * @priority 10
 *
 * @description
 * This directive allows you to modify the behaviour of {@link ngModel} directives within your
 * application. You can specify an `ngModelOptions` directive on any element. All {@link ngModel}
 * directives will use the options of their nearest `ngModelOptions` ancestor.
 *
 * The `ngModelOptions` settings are found by evaluating the value of the attribute directive as
 * an AngularJS expression. This expression should evaluate to an object, whose properties contain
 * the settings. For example: `<div ng-model-options="{ debounce: 100 }"`.
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
 * ### Overriding immediate updates
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
 * ### Debouncing updates
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
 * ### Default events, extra triggers, and catch-all debounce values
 *
 * This example shows the relationship between "default" update events and
 * additional `updateOn` triggers.
 *
 * `default` events are those that are bound to the control, and when fired, update the `$viewValue`
 * via {@link ngModel.NgModelController#$setViewValue $setViewValue}. Every event that is not listed
 * in `updateOn` is considered a "default" event, since different control types have different
 * default events.
 *
 * The control in this example updates by "default", "click", and "blur", with different `debounce`
 * values. You can see that "click" doesn't have an individual `debounce` value -
 * therefore it uses the `*` debounce value.
 *
 * There is also a button that calls {@link ngModel.NgModelController#$setViewValue $setViewValue}
 * directly with a "custom" event. Since "custom" is not defined in the `updateOn` list,
 * it is considered a "default" event and will update the
 * control if "default" is defined in `updateOn`, and will receive the "default" debounce value.
 * Note that this is just to illustrate how custom controls would possibly call `$setViewValue`.
 *
 * You can change the `updateOn` and `debounce` configuration to test different scenarios. This
 * is done with {@link ngModel.NgModelController#$overrideModelOptions $overrideModelOptions}.
 *
  <example name="ngModelOptions-advanced" module="optionsExample">
    <file name="index.html">
       <model-update-demo></model-update-demo>
    </file>
    <file name="app.js">
      angular.module('optionsExample', [])
        .component('modelUpdateDemo', {
          templateUrl: 'template.html',
          controller: function() {
            this.name = 'Chinua';

            this.options = {
              updateOn: 'default blur click',
              debounce: {
                default: 2000,
                blur: 0,
                '*': 1000
              }
            };

            this.updateEvents = function() {
              var eventList = this.options.updateOn.split(' ');
              eventList.push('*');
              var events = {};

              for (var i = 0; i < eventList.length; i++) {
                events[eventList[i]] = this.options.debounce[eventList[i]];
              }

              this.events = events;
            };

            this.updateOptions = function() {
              var options = angular.extend(this.options, {
                updateOn: Object.keys(this.events).join(' ').replace('*', ''),
                debounce: this.events
              });

              this.form.input.$overrideModelOptions(options);
            };

            // Initialize the event form
            this.updateEvents();
          }
        });
    </file>
    <file name="template.html">
      <form name="$ctrl.form">
        Input: <input type="text" name="input" ng-model="$ctrl.name" ng-model-options="$ctrl.options" />
      </form>
      Model: <tt>{{$ctrl.name}}</tt>
      <hr>
      <button ng-click="$ctrl.form.input.$setViewValue('some value', 'custom')">Trigger setViewValue with 'some value' and 'custom' event</button>

      <hr>
      <form ng-submit="$ctrl.updateOptions()">
        <b>updateOn</b><br>
        <input type="text" ng-model="$ctrl.options.updateOn" ng-change="$ctrl.updateEvents()" ng-model-options="{debounce: 500}">

        <table>
          <tr>
            <th>Option</th>
            <th>Debounce value</th>
          </tr>
          <tr ng-repeat="(key, value) in $ctrl.events">
            <td>{{key}}</td>
            <td><input type="number" ng-model="$ctrl.events[key]" /></td>
          </tr>
        </table>

        <br>
        <input type="submit" value="Update options">
      </form>
    </file>
  </example>
 *
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
 * ## Programmatically changing options
 *
 * The `ngModelOptions` expression is only evaluated once when the directive is linked; it is not
 * watched for changes. However, it is possible to override the options on a single
 * {@link ngModel.NgModelController} instance with
 * {@link ngModel.NgModelController#$overrideModelOptions `NgModelController#$overrideModelOptions()`}.
 * See also the example for
 * {@link ngModelOptions#default-events-extra-triggers-and-catch-all-debounce-values
 * Default events, extra triggers, and catch-all debounce values}.
 *
 *
 * ## Specifying timezones
 *
 * You can specify the timezone that date/time input directives expect by providing its name in the
 * `timezone` property.
 *
 *
 * ## Formatting the value of `time` and `datetime-local`
 *
 * With the options `timeSecondsFormat` and `timeStripZeroSeconds` it is possible to adjust the value
 * that is displayed in the control. Note that browsers may apply their own formatting
 * in the user interface.
 *
   <example name="ngModelOptions-time-format" module="timeExample">
     <file name="index.html">
       <time-example></time-example>
     </file>
     <file name="script.js">
        angular.module('timeExample', [])
          .component('timeExample', {
            templateUrl: 'timeExample.html',
            controller: function() {
              this.time = new Date(1970, 0, 1, 14, 57, 0);

              this.options = {
                timeSecondsFormat: 'ss',
                timeStripZeroSeconds: true
              };

              this.optionChange = function() {
                this.timeForm.timeFormatted.$overrideModelOptions(this.options);
                this.time = new Date(this.time);
              };
            }
          });
     </file>
     <file name="timeExample.html">
       <form name="$ctrl.timeForm">
         <strong>Default</strong>:
         <input type="time" ng-model="$ctrl.time" step="any" /><br>
         <strong>With options</strong>:
         <input type="time" name="timeFormatted" ng-model="$ctrl.time" step="any" ng-model-options="$ctrl.options" />
         <br>

         Options:<br>
         <code>timeSecondsFormat</code>:
         <input
           type="text"
           ng-model="$ctrl.options.timeSecondsFormat"
           ng-change="$ctrl.optionChange()">
         <br>
         <code>timeStripZeroSeconds</code>:
         <input
           type="checkbox"
           ng-model="$ctrl.options.timeStripZeroSeconds"
           ng-change="$ctrl.optionChange()">
        </form>
      </file>
 *  </example>
 *
 * @param {Object} ngModelOptions options to apply to {@link ngModel} directives on this element and
 *   and its descendents.
 *
 * **General options**:
 *
 *   - `updateOn`: string specifying which event should the input be bound to. You can set several
 *     events using an space delimited list. There is a special event called `default` that
 *     matches the default events belonging to the control. These are the events that are bound to
 *     the control, and when fired, update the `$viewValue` via `$setViewValue`.
 *
 *     `ngModelOptions` considers every event that is not listed in `updateOn` a "default" event,
 *     since different control types use different default events.
 *
 *     See also the section {@link ngModelOptions#triggering-and-debouncing-model-updates
 *     Triggering and debouncing model updates}.
 *
 *   - `debounce`: integer value which contains the debounce model update value in milliseconds. A
 *     value of 0 triggers an immediate update. If an object is supplied instead, you can specify a
 *     custom value for each event. For example:
 *     ```
 *     ng-model-options="{
 *       updateOn: 'default blur',
 *       debounce: { 'default': 500, 'blur': 0 }
 *     }"
 *     ```
 *     You can use the `*` key to specify a debounce value that applies to all events that are not
 *     specifically listed. In the following example, `mouseup` would have a debounce delay of 1000:
 *     ```
 *     ng-model-options="{
 *       updateOn: 'default blur mouseup',
 *       debounce: { 'default': 500, 'blur': 0, '*': 1000 }
 *     }"
 *     ```
 *   - `allowInvalid`: boolean value which indicates that the model can be set with values that did
 *     not validate correctly instead of the default behavior of setting the model to undefined.
 *   - `getterSetter`: boolean value which determines whether or not to treat functions bound to
 *     `ngModel` as getters/setters.
 *
 *
 *  **Input-type specific options**:
 *
 *   - `timezone`: Defines the timezone to be used to read/write the `Date` instance in the model for
 *     `<input type="date" />`, `<input type="time" />`, ... . It understands UTC/GMT and the
 *     continental US time zone abbreviations, but for general use, use a time zone offset, for
 *     example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
 *     If not specified, the timezone of the browser will be used.
 *     Note that changing the timezone will have no effect on the current date, and is only applied after
 *     the next input / model change.
 *
 *   - `timeSecondsFormat`: Defines if the `time` and `datetime-local` types should show seconds and
 *     milliseconds. The option follows the format string of {@link date date filter}.
 *     By default, the options is `undefined` which is equal to `'ss.sss'` (seconds and milliseconds).
 *     The other options are `'ss'` (strips milliseconds), and `''` (empty string), which strips both
 *     seconds and milliseconds.
 *     Note that browsers that support `time` and `datetime-local` require the hour and minutes
 *     part of the time string, and may show the value differently in the user interface.
 *     {@link ngModelOptions#formatting-the-value-of-time-and-datetime-local- See the example}.
 *
 *   - `timeStripZeroSeconds`: Defines if the `time` and `datetime-local` types should strip the
 *     seconds and milliseconds from the formatted value if they are zero. This option is applied
 *     after `timeSecondsFormat`.
 *     This option can be used to make the formatting consistent over different browsers, as some
 *     browsers with support for `time` will natively hide the milliseconds and
 *     seconds if they are zero, but others won't, and browsers that don't implement these input
 *     types will always show the full string.
 *     {@link ngModelOptions#formatting-the-value-of-time-and-datetime-local- See the example}.
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
