'use strict';

/* global VALID_CLASS: true,
  INVALID_CLASS: true,
  PRISTINE_CLASS: true,
  DIRTY_CLASS: true,
  UNTOUCHED_CLASS: true,
  TOUCHED_CLASS: true,
  PENDING_CLASS: true,
  addSetValidityMethod: true,
  setupValidity: true,
  defaultModelOptions: false
*/


var VALID_CLASS = 'ng-valid',
    INVALID_CLASS = 'ng-invalid',
    PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty',
    UNTOUCHED_CLASS = 'ng-untouched',
    TOUCHED_CLASS = 'ng-touched',
    EMPTY_CLASS = 'ng-empty',
    NOT_EMPTY_CLASS = 'ng-not-empty';

var ngModelMinErr = minErr('ngModel');

/**
 * @ngdoc type
 * @name ngModel.NgModelController
 *
 * @property {*} $viewValue The actual value from the control's view. For `input` elements, this is a
 * String. See {@link ngModel.NgModelController#$setViewValue} for information about when the $viewValue
 * is set.
 *
 * @property {*} $modelValue The value in the model that the control is bound to.
 *
 * @property {Array.<Function>} $parsers Array of functions to execute, as a pipeline, whenever
 *  the control updates the ngModelController with a new {@link ngModel.NgModelController#$viewValue
    `$viewValue`} from the DOM, usually via user input.
    See {@link ngModel.NgModelController#$setViewValue `$setViewValue()`} for a detailed lifecycle explanation.
    Note that the `$parsers` are not called when the bound ngModel expression changes programmatically.

  The functions are called in array order, each passing
    its return value through to the next. The last return value is forwarded to the
    {@link ngModel.NgModelController#$validators `$validators`} collection.

  Parsers are used to sanitize / convert the {@link ngModel.NgModelController#$viewValue
    `$viewValue`}.

  Returning `undefined` from a parser means a parse error occurred. In that case,
    no {@link ngModel.NgModelController#$validators `$validators`} will run and the `ngModel`
    will be set to `undefined` unless {@link ngModelOptions `ngModelOptions.allowInvalid`}
    is set to `true`. The parse error is stored in `ngModel.$error.parse`.

  This simple example shows a parser that would convert text input value to lowercase:
 * ```js
 * function parse(value) {
 *   if (value) {
 *     return value.toLowerCase();
 *   }
 * }
 * ngModelController.$parsers.push(parse);
 * ```

 *
 * @property {Array.<Function>} $formatters Array of functions to execute, as a pipeline, whenever
    the bound ngModel expression changes programmatically. The `$formatters` are not called when the
    value of the control is changed by user interaction.

  Formatters are used to format / convert the {@link ngModel.NgModelController#$modelValue
    `$modelValue`} for display in the control.

  The functions are called in reverse array order, each passing the value through to the
    next. The last return value is used as the actual DOM value.

  This simple example shows a formatter that would convert the model value to uppercase:

 * ```js
 * function format(value) {
 *   if (value) {
 *     return value.toUpperCase();
 *   }
 * }
 * ngModel.$formatters.push(format);
 * ```
 *
 * @property {Object.<string, function>} $validators A collection of validators that are applied
 *      whenever the model value changes. The key value within the object refers to the name of the
 *      validator while the function refers to the validation operation. The validation operation is
 *      provided with the model value as an argument and must return a true or false value depending
 *      on the response of that validation.
 *
 * ```js
 * ngModel.$validators.validCharacters = function(modelValue, viewValue) {
 *   var value = modelValue || viewValue;
 *   return /[0-9]+/.test(value) &&
 *          /[a-z]+/.test(value) &&
 *          /[A-Z]+/.test(value) &&
 *          /\W+/.test(value);
 * };
 * ```
 *
 * @property {Object.<string, function>} $asyncValidators A collection of validations that are expected to
 *      perform an asynchronous validation (e.g. a HTTP request). The validation function that is provided
 *      is expected to return a promise when it is run during the model validation process. Once the promise
 *      is delivered then the validation status will be set to true when fulfilled and false when rejected.
 *      When the asynchronous validators are triggered, each of the validators will run in parallel and the model
 *      value will only be updated once all validators have been fulfilled. As long as an asynchronous validator
 *      is unfulfilled, its key will be added to the controllers `$pending` property. Also, all asynchronous validators
 *      will only run once all synchronous validators have passed.
 *
 * Please note that if $http is used then it is important that the server returns a success HTTP response code
 * in order to fulfill the validation and a status level of `4xx` in order to reject the validation.
 *
 * ```js
 * ngModel.$asyncValidators.uniqueUsername = function(modelValue, viewValue) {
 *   var value = modelValue || viewValue;
 *
 *   // Lookup user by username
 *   return $http.get('/api/users/' + value).
 *      then(function resolved() {
 *        //username exists, this means validation fails
 *        return $q.reject('exists');
 *      }, function rejected() {
 *        //username does not exist, therefore this validation passes
 *        return true;
 *      });
 * };
 * ```
 *
 * @property {Array.<Function>} $viewChangeListeners Array of functions to execute whenever the
 *     view value has changed. It is called with no arguments, and its return value is ignored.
 *     This can be used in place of additional $watches against the model value.
 *
 * @property {Object} $error An object hash with all failing validator ids as keys.
 * @property {Object} $pending An object hash with all pending validator ids as keys.
 *
 * @property {boolean} $untouched True if control has not lost focus yet.
 * @property {boolean} $touched True if control has lost focus.
 * @property {boolean} $pristine True if user has not interacted with the control yet.
 * @property {boolean} $dirty True if user has already interacted with the control.
 * @property {boolean} $valid True if there is no error.
 * @property {boolean} $invalid True if at least one error on the control.
 * @property {string} $name The name attribute of the control.
 *
 * @description
 *
 * `NgModelController` provides API for the {@link ngModel `ngModel`} directive.
 * The controller contains services for data-binding, validation, CSS updates, and value formatting
 * and parsing. It purposefully does not contain any logic which deals with DOM rendering or
 * listening to DOM events.
 * Such DOM related logic should be provided by other directives which make use of
 * `NgModelController` for data-binding to control elements.
 * AngularJS provides this DOM logic for most {@link input `input`} elements.
 * At the end of this page you can find a {@link ngModel.NgModelController#custom-control-example
 * custom control example} that uses `ngModelController` to bind to `contenteditable` elements.
 *
 * @example
 * ### Custom Control Example
 * This example shows how to use `NgModelController` with a custom control to achieve
 * data-binding. Notice how different directives (`contenteditable`, `ng-model`, and `required`)
 * collaborate together to achieve the desired result.
 *
 * `contenteditable` is an HTML5 attribute, which tells the browser to let the element
 * contents be edited in place by the user.
 *
 * We are using the {@link ng.service:$sce $sce} service here and include the {@link ngSanitize $sanitize}
 * module to automatically remove "bad" content like inline event listener (e.g. `<span onclick="...">`).
 * However, as we are using `$sce` the model can still decide to provide unsafe content if it marks
 * that content using the `$sce` service.
 *
 * <example name="NgModelController" module="customControl" deps="angular-sanitize.js">
    <file name="style.css">
      [contenteditable] {
        border: 1px solid black;
        background-color: white;
        min-height: 20px;
      }

      .ng-invalid {
        border: 1px solid red;
      }

    </file>
    <file name="script.js">
      angular.module('customControl', ['ngSanitize']).
        directive('contenteditable', ['$sce', function($sce) {
          return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
              if (!ngModel) return; // do nothing if no ng-model

              // Specify how UI should be updated
              ngModel.$render = function() {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
              };

              // Listen for change events to enable binding
              element.on('blur keyup change', function() {
                scope.$evalAsync(read);
              });
              read(); // initialize

              // Write data to the model
              function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                  html = '';
                }
                ngModel.$setViewValue(html);
              }
            }
          };
        }]);
    </file>
    <file name="index.html">
      <form name="myForm">
       <div contenteditable
            name="myWidget" ng-model="userContent"
            strip-br="true"
            required>Change me!</div>
        <span ng-show="myForm.myWidget.$error.required">Required!</span>
       <hr>
       <textarea ng-model="userContent" aria-label="Dynamic textarea"></textarea>
      </form>
    </file>
    <file name="protractor.js" type="protractor">
    it('should data-bind and become invalid', function() {
      if (browser.params.browser === 'safari' || browser.params.browser === 'firefox') {
        // SafariDriver can't handle contenteditable
        // and Firefox driver can't clear contenteditables very well
        return;
      }
      var contentEditable = element(by.css('[contenteditable]'));
      var content = 'Change me!';

      expect(contentEditable.getText()).toEqual(content);

      contentEditable.clear();
      contentEditable.sendKeys(protractor.Key.BACK_SPACE);
      expect(contentEditable.getText()).toEqual('');
      expect(contentEditable.getAttribute('class')).toMatch(/ng-invalid-required/);
    });
    </file>
 * </example>
 *
 *
 */
NgModelController.$inject = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate', '$timeout', '$q', '$interpolate'];
function NgModelController($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $q, $interpolate) {
  this.$viewValue = Number.NaN;
  this.$modelValue = Number.NaN;
  this.$$rawModelValue = undefined; // stores the parsed modelValue / model set from scope regardless of validity.
  this.$validators = {};
  this.$asyncValidators = {};
  this.$parsers = [];
  this.$formatters = [];
  this.$viewChangeListeners = [];
  this.$untouched = true;
  this.$touched = false;
  this.$pristine = true;
  this.$dirty = false;
  this.$valid = true;
  this.$invalid = false;
  this.$error = {}; // keep invalid keys here
  this.$$success = {}; // keep valid keys here
  this.$pending = undefined; // keep pending keys here
  this.$name = $interpolate($attr.name || '', false)($scope);
  this.$$parentForm = nullFormCtrl;
  this.$options = defaultModelOptions;

  this.$$parsedNgModel = $parse($attr.ngModel);
  this.$$parsedNgModelAssign = this.$$parsedNgModel.assign;
  this.$$ngModelGet = this.$$parsedNgModel;
  this.$$ngModelSet = this.$$parsedNgModelAssign;
  this.$$pendingDebounce = null;
  this.$$parserValid = undefined;

  this.$$currentValidationRunId = 0;

  this.$$scope = $scope;
  this.$$attr = $attr;
  this.$$element = $element;
  this.$$animate = $animate;
  this.$$timeout = $timeout;
  this.$$parse = $parse;
  this.$$q = $q;
  this.$$exceptionHandler = $exceptionHandler;

  setupValidity(this);
  setupModelWatcher(this);
}

NgModelController.prototype = {
  $$initGetterSetters: function() {
    if (this.$options.getOption('getterSetter')) {
      var invokeModelGetter = this.$$parse(this.$$attr.ngModel + '()'),
          invokeModelSetter = this.$$parse(this.$$attr.ngModel + '($$$p)');

      this.$$ngModelGet = function($scope) {
        var modelValue = this.$$parsedNgModel($scope);
        if (isFunction(modelValue)) {
          modelValue = invokeModelGetter($scope);
        }
        return modelValue;
      };
      this.$$ngModelSet = function($scope, newValue) {
        if (isFunction(this.$$parsedNgModel($scope))) {
          invokeModelSetter($scope, {$$$p: newValue});
        } else {
          this.$$parsedNgModelAssign($scope, newValue);
        }
      };
    } else if (!this.$$parsedNgModel.assign) {
      throw ngModelMinErr('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}',
          this.$$attr.ngModel, startingTag(this.$$element));
    }
  },


  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$render
   *
   * @description
   * Called when the view needs to be updated. It is expected that the user of the ng-model
   * directive will implement this method.
   *
   * The `$render()` method is invoked in the following situations:
   *
   * * `$rollbackViewValue()` is called.  If we are rolling back the view value to the last
   *   committed value then `$render()` is called to update the input control.
   * * The value referenced by `ng-model` is changed programmatically and both the `$modelValue` and
   *   the `$viewValue` are different from last time.
   *
   * Since `ng-model` does not do a deep watch, `$render()` is only invoked if the values of
   * `$modelValue` and `$viewValue` are actually different from their previous values. If `$modelValue`
   * or `$viewValue` are objects (rather than a string or number) then `$render()` will not be
   * invoked if you only change a property on the objects.
   */
  $render: noop,

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$isEmpty
   *
   * @description
   * This is called when we need to determine if the value of an input is empty.
   *
   * For instance, the required directive does this to work out if the input has data or not.
   *
   * The default `$isEmpty` function checks whether the value is `undefined`, `''`, `null` or `NaN`.
   *
   * You can override this for input directives whose concept of being empty is different from the
   * default. The `checkboxInputType` directive does this because in its case a value of `false`
   * implies empty.
   *
   * @param {*} value The value of the input to check for emptiness.
   * @returns {boolean} True if `value` is "empty".
   */
  $isEmpty: function(value) {
    // eslint-disable-next-line no-self-compare
    return isUndefined(value) || value === '' || value === null || value !== value;
  },

  $$updateEmptyClasses: function(value) {
    if (this.$isEmpty(value)) {
      this.$$animate.removeClass(this.$$element, NOT_EMPTY_CLASS);
      this.$$animate.addClass(this.$$element, EMPTY_CLASS);
    } else {
      this.$$animate.removeClass(this.$$element, EMPTY_CLASS);
      this.$$animate.addClass(this.$$element, NOT_EMPTY_CLASS);
    }
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$setPristine
   *
   * @description
   * Sets the control to its pristine state.
   *
   * This method can be called to remove the `ng-dirty` class and set the control to its pristine
   * state (`ng-pristine` class). A model is considered to be pristine when the control
   * has not been changed from when first compiled.
   */
  $setPristine: function() {
    this.$dirty = false;
    this.$pristine = true;
    this.$$animate.removeClass(this.$$element, DIRTY_CLASS);
    this.$$animate.addClass(this.$$element, PRISTINE_CLASS);
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$setDirty
   *
   * @description
   * Sets the control to its dirty state.
   *
   * This method can be called to remove the `ng-pristine` class and set the control to its dirty
   * state (`ng-dirty` class). A model is considered to be dirty when the control has been changed
   * from when first compiled.
   */
  $setDirty: function() {
    this.$dirty = true;
    this.$pristine = false;
    this.$$animate.removeClass(this.$$element, PRISTINE_CLASS);
    this.$$animate.addClass(this.$$element, DIRTY_CLASS);
    this.$$parentForm.$setDirty();
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$setUntouched
   *
   * @description
   * Sets the control to its untouched state.
   *
   * This method can be called to remove the `ng-touched` class and set the control to its
   * untouched state (`ng-untouched` class). Upon compilation, a model is set as untouched
   * by default, however this function can be used to restore that state if the model has
   * already been touched by the user.
   */
  $setUntouched: function() {
    this.$touched = false;
    this.$untouched = true;
    this.$$animate.setClass(this.$$element, UNTOUCHED_CLASS, TOUCHED_CLASS);
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$setTouched
   *
   * @description
   * Sets the control to its touched state.
   *
   * This method can be called to remove the `ng-untouched` class and set the control to its
   * touched state (`ng-touched` class). A model is considered to be touched when the user has
   * first focused the control element and then shifted focus away from the control (blur event).
   */
  $setTouched: function() {
    this.$touched = true;
    this.$untouched = false;
    this.$$animate.setClass(this.$$element, TOUCHED_CLASS, UNTOUCHED_CLASS);
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$rollbackViewValue
   *
   * @description
   * Cancel an update and reset the input element's value to prevent an update to the `$modelValue`,
   * which may be caused by a pending debounced event or because the input is waiting for some
   * future event.
   *
   * If you have an input that uses `ng-model-options` to set up debounced updates or updates that
   * depend on special events such as `blur`, there can be a period when the `$viewValue` is out of
   * sync with the ngModel's `$modelValue`.
   *
   * In this case, you can use `$rollbackViewValue()` to manually cancel the debounced / future update
   * and reset the input to the last committed view value.
   *
   * It is also possible that you run into difficulties if you try to update the ngModel's `$modelValue`
   * programmatically before these debounced/future events have resolved/occurred, because AngularJS's
   * dirty checking mechanism is not able to tell whether the model has actually changed or not.
   *
   * The `$rollbackViewValue()` method should be called before programmatically changing the model of an
   * input which may have such events pending. This is important in order to make sure that the
   * input field will be updated with the new model value and any pending operations are cancelled.
   *
   * <example name="ng-model-cancel-update" module="cancel-update-example">
   *   <file name="app.js">
   *     angular.module('cancel-update-example', [])
   *
   *     .controller('CancelUpdateController', ['$scope', function($scope) {
   *       $scope.model = {value1: '', value2: ''};
   *
   *       $scope.setEmpty = function(e, value, rollback) {
   *         if (e.keyCode === 27) {
   *           e.preventDefault();
   *           if (rollback) {
   *             $scope.myForm[value].$rollbackViewValue();
   *           }
   *           $scope.model[value] = '';
   *         }
   *       };
   *     }]);
   *   </file>
   *   <file name="index.html">
   *     <div ng-controller="CancelUpdateController">
   *       <p>Both of these inputs are only updated if they are blurred. Hitting escape should
   *       empty them. Follow these steps and observe the difference:</p>
   *       <ol>
   *         <li>Type something in the input. You will see that the model is not yet updated</li>
   *         <li>Press the Escape key.
   *           <ol>
   *             <li> In the first example, nothing happens, because the model is already '', and no
   *             update is detected. If you blur the input, the model will be set to the current view.
   *             </li>
   *             <li> In the second example, the pending update is cancelled, and the input is set back
   *             to the last committed view value (''). Blurring the input does nothing.
   *             </li>
   *           </ol>
   *         </li>
   *       </ol>
   *
   *       <form name="myForm" ng-model-options="{ updateOn: 'blur' }">
   *         <div>
   *           <p id="inputDescription1">Without $rollbackViewValue():</p>
   *           <input name="value1" aria-describedby="inputDescription1" ng-model="model.value1"
   *                  ng-keydown="setEmpty($event, 'value1')">
   *           value1: "{{ model.value1 }}"
   *         </div>
   *
   *         <div>
   *           <p id="inputDescription2">With $rollbackViewValue():</p>
   *           <input name="value2" aria-describedby="inputDescription2" ng-model="model.value2"
   *                  ng-keydown="setEmpty($event, 'value2', true)">
   *           value2: "{{ model.value2 }}"
   *         </div>
   *       </form>
   *     </div>
   *   </file>
       <file name="style.css">
          div {
            display: table-cell;
          }
          div:nth-child(1) {
            padding-right: 30px;
          }

        </file>
   * </example>
   */
  $rollbackViewValue: function() {
    this.$$timeout.cancel(this.$$pendingDebounce);
    this.$viewValue = this.$$lastCommittedViewValue;
    this.$render();
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$validate
   *
   * @description
   * Runs each of the registered validators (first synchronous validators and then
   * asynchronous validators).
   * If the validity changes to invalid, the model will be set to `undefined`,
   * unless {@link ngModelOptions `ngModelOptions.allowInvalid`} is `true`.
   * If the validity changes to valid, it will set the model to the last available valid
   * `$modelValue`, i.e. either the last parsed value or the last value set from the scope.
   */
  $validate: function() {
    // ignore $validate before model is initialized
    if (isNumberNaN(this.$modelValue)) {
      return;
    }

    var viewValue = this.$$lastCommittedViewValue;
    // Note: we use the $$rawModelValue as $modelValue might have been
    // set to undefined during a view -> model update that found validation
    // errors. We can't parse the view here, since that could change
    // the model although neither viewValue nor the model on the scope changed
    var modelValue = this.$$rawModelValue;

    var prevValid = this.$valid;
    var prevModelValue = this.$modelValue;

    var allowInvalid = this.$options.getOption('allowInvalid');

    var that = this;
    this.$$runValidators(modelValue, viewValue, function(allValid) {
      // If there was no change in validity, don't update the model
      // This prevents changing an invalid modelValue to undefined
      if (!allowInvalid && prevValid !== allValid) {
        // Note: Don't check this.$valid here, as we could have
        // external validators (e.g. calculated on the server),
        // that just call $setValidity and need the model value
        // to calculate their validity.
        that.$modelValue = allValid ? modelValue : undefined;

        if (that.$modelValue !== prevModelValue) {
          that.$$writeModelToScope();
        }
      }
    });
  },

  $$runValidators: function(modelValue, viewValue, doneCallback) {
    this.$$currentValidationRunId++;
    var localValidationRunId = this.$$currentValidationRunId;
    var that = this;

    // check parser error
    if (!processParseErrors()) {
      validationDone(false);
      return;
    }
    if (!processSyncValidators()) {
      validationDone(false);
      return;
    }
    processAsyncValidators();

    function processParseErrors() {
      var errorKey = that.$$parserName || 'parse';
      if (isUndefined(that.$$parserValid)) {
        setValidity(errorKey, null);
      } else {
        if (!that.$$parserValid) {
          forEach(that.$validators, function(v, name) {
            setValidity(name, null);
          });
          forEach(that.$asyncValidators, function(v, name) {
            setValidity(name, null);
          });
        }
        // Set the parse error last, to prevent unsetting it, should a $validators key == parserName
        setValidity(errorKey, that.$$parserValid);
        return that.$$parserValid;
      }
      return true;
    }

    function processSyncValidators() {
      var syncValidatorsValid = true;
      forEach(that.$validators, function(validator, name) {
        var result = Boolean(validator(modelValue, viewValue));
        syncValidatorsValid = syncValidatorsValid && result;
        setValidity(name, result);
      });
      if (!syncValidatorsValid) {
        forEach(that.$asyncValidators, function(v, name) {
          setValidity(name, null);
        });
        return false;
      }
      return true;
    }

    function processAsyncValidators() {
      var validatorPromises = [];
      var allValid = true;
      forEach(that.$asyncValidators, function(validator, name) {
        var promise = validator(modelValue, viewValue);
        if (!isPromiseLike(promise)) {
          throw ngModelMinErr('nopromise',
            'Expected asynchronous validator to return a promise but got \'{0}\' instead.', promise);
        }
        setValidity(name, undefined);
        validatorPromises.push(promise.then(function() {
          setValidity(name, true);
        }, function() {
          allValid = false;
          setValidity(name, false);
        }));
      });
      if (!validatorPromises.length) {
        validationDone(true);
      } else {
        that.$$q.all(validatorPromises).then(function() {
          validationDone(allValid);
        }, noop);
      }
    }

    function setValidity(name, isValid) {
      if (localValidationRunId === that.$$currentValidationRunId) {
        that.$setValidity(name, isValid);
      }
    }

    function validationDone(allValid) {
      if (localValidationRunId === that.$$currentValidationRunId) {

        doneCallback(allValid);
      }
    }
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$commitViewValue
   *
   * @description
   * Commit a pending update to the `$modelValue`.
   *
   * Updates may be pending by a debounced event or because the input is waiting for a some future
   * event defined in `ng-model-options`. this method is rarely needed as `NgModelController`
   * usually handles calling this in response to input events.
   */
  $commitViewValue: function() {
    var viewValue = this.$viewValue;

    this.$$timeout.cancel(this.$$pendingDebounce);

    // If the view value has not changed then we should just exit, except in the case where there is
    // a native validator on the element. In this case the validation state may have changed even though
    // the viewValue has stayed empty.
    if (this.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !this.$$hasNativeValidators)) {
      return;
    }
    this.$$updateEmptyClasses(viewValue);
    this.$$lastCommittedViewValue = viewValue;

    // change to dirty
    if (this.$pristine) {
      this.$setDirty();
    }
    this.$$parseAndValidate();
  },

  $$parseAndValidate: function() {
    var viewValue = this.$$lastCommittedViewValue;
    var modelValue = viewValue;
    var that = this;

    this.$$parserValid = isUndefined(modelValue) ? undefined : true;

    if (this.$$parserValid) {
      for (var i = 0; i < this.$parsers.length; i++) {
        modelValue = this.$parsers[i](modelValue);
        if (isUndefined(modelValue)) {
          this.$$parserValid = false;
          break;
        }
      }
    }
    if (isNumberNaN(this.$modelValue)) {
      // this.$modelValue has not been touched yet...
      this.$modelValue = this.$$ngModelGet(this.$$scope);
    }
    var prevModelValue = this.$modelValue;
    var allowInvalid = this.$options.getOption('allowInvalid');
    this.$$rawModelValue = modelValue;

    if (allowInvalid) {
      this.$modelValue = modelValue;
      writeToModelIfNeeded();
    }

    // Pass the $$lastCommittedViewValue here, because the cached viewValue might be out of date.
    // This can happen if e.g. $setViewValue is called from inside a parser
    this.$$runValidators(modelValue, this.$$lastCommittedViewValue, function(allValid) {
      if (!allowInvalid) {
        // Note: Don't check this.$valid here, as we could have
        // external validators (e.g. calculated on the server),
        // that just call $setValidity and need the model value
        // to calculate their validity.
        that.$modelValue = allValid ? modelValue : undefined;
        writeToModelIfNeeded();
      }
    });

    function writeToModelIfNeeded() {
      if (that.$modelValue !== prevModelValue) {
        that.$$writeModelToScope();
      }
    }
  },

  $$writeModelToScope: function() {
    this.$$ngModelSet(this.$$scope, this.$modelValue);
    forEach(this.$viewChangeListeners, function(listener) {
      try {
        listener();
      } catch (e) {
        // eslint-disable-next-line no-invalid-this
        this.$$exceptionHandler(e);
      }
    }, this);
  },

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$setViewValue
   *
   * @description
   * Update the view value.
   *
   * This method should be called when a control wants to change the view value; typically,
   * this is done from within a DOM event handler. For example, the {@link ng.directive:input input}
   * directive calls it when the value of the input changes and {@link ng.directive:select select}
   * calls it when an option is selected.
   *
   * When `$setViewValue` is called, the new `value` will be staged for committing through the `$parsers`
   * and `$validators` pipelines. If there are no special {@link ngModelOptions} specified then the staged
   * value is sent directly for processing through the `$parsers` pipeline. After this, the `$validators` and
   * `$asyncValidators` are called and the value is applied to `$modelValue`.
   * Finally, the value is set to the **expression** specified in the `ng-model` attribute and
   * all the registered change listeners, in the `$viewChangeListeners` list are called.
   *
   * In case the {@link ng.directive:ngModelOptions ngModelOptions} directive is used with `updateOn`
   * and the `default` trigger is not listed, all those actions will remain pending until one of the
   * `updateOn` events is triggered on the DOM element.
   * All these actions will be debounced if the {@link ng.directive:ngModelOptions ngModelOptions}
   * directive is used with a custom debounce for this particular event.
   * Note that a `$digest` is only triggered once the `updateOn` events are fired, or if `debounce`
   * is specified, once the timer runs out.
   *
   * When used with standard inputs, the view value will always be a string (which is in some cases
   * parsed into another type, such as a `Date` object for `input[date]`.)
   * However, custom controls might also pass objects to this method. In this case, we should make
   * a copy of the object before passing it to `$setViewValue`. This is because `ngModel` does not
   * perform a deep watch of objects, it only looks for a change of identity. If you only change
   * the property of the object then ngModel will not realize that the object has changed and
   * will not invoke the `$parsers` and `$validators` pipelines. For this reason, you should
   * not change properties of the copy once it has been passed to `$setViewValue`.
   * Otherwise you may cause the model value on the scope to change incorrectly.
   *
   * <div class="alert alert-info">
   * In any case, the value passed to the method should always reflect the current value
   * of the control. For example, if you are calling `$setViewValue` for an input element,
   * you should pass the input DOM value. Otherwise, the control and the scope model become
   * out of sync. It's also important to note that `$setViewValue` does not call `$render` or change
   * the control's DOM value in any way. If we want to change the control's DOM value
   * programmatically, we should update the `ngModel` scope expression. Its new value will be
   * picked up by the model controller, which will run it through the `$formatters`, `$render` it
   * to update the DOM, and finally call `$validate` on it.
   * </div>
   *
   * @param {*} value value from the view.
   * @param {string} trigger Event that triggered the update.
   */
  $setViewValue: function(value, trigger) {
    this.$viewValue = value;
    if (this.$options.getOption('updateOnDefault')) {
      this.$$debounceViewValueCommit(trigger);
    }
  },

  $$debounceViewValueCommit: function(trigger) {
    var debounceDelay = this.$options.getOption('debounce');

    if (isNumber(debounceDelay[trigger])) {
      debounceDelay = debounceDelay[trigger];
    } else if (isNumber(debounceDelay['default'])) {
      debounceDelay = debounceDelay['default'];
    }

    this.$$timeout.cancel(this.$$pendingDebounce);
    var that = this;
    if (debounceDelay > 0) { // this fails if debounceDelay is an object
      this.$$pendingDebounce = this.$$timeout(function() {
        that.$commitViewValue();
      }, debounceDelay);
    } else if (this.$$scope.$root.$$phase) {
      this.$commitViewValue();
    } else {
      this.$$scope.$apply(function() {
        that.$commitViewValue();
      });
    }
  },

  /**
   * @ngdoc method
   *
   * @name ngModel.NgModelController#$overrideModelOptions
   *
   * @description
   *
   * Override the current model options settings programmatically.
   *
   * The previous `ModelOptions` value will not be modified. Instead, a
   * new `ModelOptions` object will inherit from the previous one overriding
   * or inheriting settings that are defined in the given parameter.
   *
   * See {@link ngModelOptions} for information about what options can be specified
   * and how model option inheritance works.
   *
   * @param {Object} options a hash of settings to override the previous options
   *
   */
  $overrideModelOptions: function(options) {
    this.$options = this.$options.createChild(options);
  }
};

function setupModelWatcher(ctrl) {
  // model -> value
  // Note: we cannot use a normal scope.$watch as we want to detect the following:
  // 1. scope value is 'a'
  // 2. user enters 'b'
  // 3. ng-change kicks in and reverts scope value to 'a'
  //    -> scope value did not change since the last digest as
  //       ng-change executes in apply phase
  // 4. view should be changed back to 'a'
  ctrl.$$scope.$watch(function ngModelWatch(scope) {
    var modelValue = ctrl.$$ngModelGet(scope);

    // if scope model value and ngModel value are out of sync
    // TODO(perf): why not move this to the action fn?
    if (modelValue !== ctrl.$modelValue &&
       // checks for NaN is needed to allow setting the model to NaN when there's an asyncValidator
        // eslint-disable-next-line no-self-compare
       (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)
    ) {
      ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
      ctrl.$$parserValid = undefined;

      var formatters = ctrl.$formatters,
          idx = formatters.length;

      var viewValue = modelValue;
      while (idx--) {
        viewValue = formatters[idx](viewValue);
      }
      if (ctrl.$viewValue !== viewValue) {
        ctrl.$$updateEmptyClasses(viewValue);
        ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
        ctrl.$render();

        // It is possible that model and view value have been updated during render
        ctrl.$$runValidators(ctrl.$modelValue, ctrl.$viewValue, noop);
      }
    }

    return modelValue;
  });
}

/**
 * @ngdoc method
 * @name ngModel.NgModelController#$setValidity
 *
 * @description
 * Change the validity state, and notify the form.
 *
 * This method can be called within $parsers/$formatters or a custom validation implementation.
 * However, in most cases it should be sufficient to use the `ngModel.$validators` and
 * `ngModel.$asyncValidators` collections which will call `$setValidity` automatically.
 *
 * @param {string} validationErrorKey Name of the validator. The `validationErrorKey` will be assigned
 *        to either `$error[validationErrorKey]` or `$pending[validationErrorKey]`
 *        (for unfulfilled `$asyncValidators`), so that it is available for data-binding.
 *        The `validationErrorKey` should be in camelCase and will get converted into dash-case
 *        for class name. Example: `myError` will result in `ng-valid-my-error` and `ng-invalid-my-error`
 *        classes and can be bound to as `{{ someForm.someControl.$error.myError }}`.
 * @param {boolean} isValid Whether the current state is valid (true), invalid (false), pending (undefined),
 *                          or skipped (null). Pending is used for unfulfilled `$asyncValidators`.
 *                          Skipped is used by AngularJS when validators do not run because of parse errors and
 *                          when `$asyncValidators` do not run because any of the `$validators` failed.
 */
addSetValidityMethod({
  clazz: NgModelController,
  set: function(object, property) {
    object[property] = true;
  },
  unset: function(object, property) {
    delete object[property];
  }
});


/**
 * @ngdoc directive
 * @name ngModel
 *
 * @element input
 * @priority 1
 *
 * @description
 * The `ngModel` directive binds an `input`,`select`, `textarea` (or custom form control) to a
 * property on the scope using {@link ngModel.NgModelController NgModelController},
 * which is created and exposed by this directive.
 *
 * `ngModel` is responsible for:
 *
 * - Binding the view into the model, which other directives such as `input`, `textarea` or `select`
 *   require.
 * - Providing validation behavior (i.e. required, number, email, url).
 * - Keeping the state of the control (valid/invalid, dirty/pristine, touched/untouched, validation errors).
 * - Setting related css classes on the element (`ng-valid`, `ng-invalid`, `ng-dirty`, `ng-pristine`, `ng-touched`,
 *   `ng-untouched`, `ng-empty`, `ng-not-empty`) including animations.
 * - Registering the control with its parent {@link ng.directive:form form}.
 *
 * Note: `ngModel` will try to bind to the property given by evaluating the expression on the
 * current scope. If the property doesn't already exist on this scope, it will be created
 * implicitly and added to the scope.
 *
 * For best practices on using `ngModel`, see:
 *
 *  - [Understanding Scopes](https://github.com/angular/angular.js/wiki/Understanding-Scopes)
 *
 * For basic examples, how to use `ngModel`, see:
 *
 *  - {@link ng.directive:input input}
 *    - {@link input[text] text}
 *    - {@link input[checkbox] checkbox}
 *    - {@link input[radio] radio}
 *    - {@link input[number] number}
 *    - {@link input[email] email}
 *    - {@link input[url] url}
 *    - {@link input[date] date}
 *    - {@link input[datetime-local] datetime-local}
 *    - {@link input[time] time}
 *    - {@link input[month] month}
 *    - {@link input[week] week}
 *  - {@link ng.directive:select select}
 *  - {@link ng.directive:textarea textarea}
 *
 * # Complex Models (objects or collections)
 *
 * By default, `ngModel` watches the model by reference, not value. This is important to know when
 * binding inputs to models that are objects (e.g. `Date`) or collections (e.g. arrays). If only properties of the
 * object or collection change, `ngModel` will not be notified and so the input will not be  re-rendered.
 *
 * The model must be assigned an entirely new object or collection before a re-rendering will occur.
 *
 * Some directives have options that will cause them to use a custom `$watchCollection` on the model expression
 * - for example, `ngOptions` will do so when a `track by` clause is included in the comprehension expression or
 * if the select is given the `multiple` attribute.
 *
 * The `$watchCollection()` method only does a shallow comparison, meaning that changing properties deeper than the
 * first level of the object (or only changing the properties of an item in the collection if it's an array) will still
 * not trigger a re-rendering of the model.
 *
 * # CSS classes
 * The following CSS classes are added and removed on the associated input/select/textarea element
 * depending on the validity of the model.
 *
 *  - `ng-valid`: the model is valid
 *  - `ng-invalid`: the model is invalid
 *  - `ng-valid-[key]`: for each valid key added by `$setValidity`
 *  - `ng-invalid-[key]`: for each invalid key added by `$setValidity`
 *  - `ng-pristine`: the control hasn't been interacted with yet
 *  - `ng-dirty`: the control has been interacted with
 *  - `ng-touched`: the control has been blurred
 *  - `ng-untouched`: the control hasn't been blurred
 *  - `ng-pending`: any `$asyncValidators` are unfulfilled
 *  - `ng-empty`: the view does not contain a value or the value is deemed "empty", as defined
 *     by the {@link ngModel.NgModelController#$isEmpty} method
 *  - `ng-not-empty`: the view contains a non-empty value
 *
 * Keep in mind that ngAnimate can detect each of these classes when added and removed.
 *
 * ## Animation Hooks
 *
 * Animations within models are triggered when any of the associated CSS classes are added and removed
 * on the input element which is attached to the model. These classes include: `.ng-pristine`, `.ng-dirty`,
 * `.ng-invalid` and `.ng-valid` as well as any other validations that are performed on the model itself.
 * The animations that are triggered within ngModel are similar to how they work in ngClass and
 * animations can be hooked into using CSS transitions, keyframes as well as JS animations.
 *
 * The following example shows a simple way to utilize CSS transitions to style an input element
 * that has been rendered as invalid after it has been validated:
 *
 * <pre>
 * //be sure to include ngAnimate as a module to hook into more
 * //advanced animations
 * .my-input {
 *   transition:0.5s linear all;
 *   background: white;
 * }
 * .my-input.ng-invalid {
 *   background: red;
 *   color:white;
 * }
 * </pre>
 *
 * @example
 * <example deps="angular-animate.js" animations="true" fixBase="true" module="inputExample" name="ng-model">
     <file name="index.html">
       <script>
        angular.module('inputExample', [])
          .controller('ExampleController', ['$scope', function($scope) {
            $scope.val = '1';
          }]);
       </script>
       <style>
         .my-input {
           transition:all linear 0.5s;
           background: transparent;
         }
         .my-input.ng-invalid {
           color:white;
           background: red;
         }
       </style>
       <p id="inputDescription">
        Update input to see transitions when valid/invalid.
        Integer is a valid value.
       </p>
       <form name="testForm" ng-controller="ExampleController">
         <input ng-model="val" ng-pattern="/^\d+$/" name="anim" class="my-input"
                aria-describedby="inputDescription" />
       </form>
     </file>
 * </example>
 *
 * ## Binding to a getter/setter
 *
 * Sometimes it's helpful to bind `ngModel` to a getter/setter function.  A getter/setter is a
 * function that returns a representation of the model when called with zero arguments, and sets
 * the internal state of a model when called with an argument. It's sometimes useful to use this
 * for models that have an internal representation that's different from what the model exposes
 * to the view.
 *
 * <div class="alert alert-success">
 * **Best Practice:** It's best to keep getters fast because AngularJS is likely to call them more
 * frequently than other parts of your code.
 * </div>
 *
 * You use this behavior by adding `ng-model-options="{ getterSetter: true }"` to an element that
 * has `ng-model` attached to it. You can also add `ng-model-options="{ getterSetter: true }"` to
 * a `<form>`, which will enable this behavior for all `<input>`s within it. See
 * {@link ng.directive:ngModelOptions `ngModelOptions`} for more.
 *
 * The following example shows how to use `ngModel` with a getter/setter:
 *
 * @example
 * <example name="ngModel-getter-setter" module="getterSetterExample">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <form name="userForm">
           <label>Name:
             <input type="text" name="userName"
                    ng-model="user.name"
                    ng-model-options="{ getterSetter: true }" />
           </label>
         </form>
         <pre>user.name = <span ng-bind="user.name()"></span></pre>
       </div>
     </file>
     <file name="app.js">
       angular.module('getterSetterExample', [])
         .controller('ExampleController', ['$scope', function($scope) {
           var _name = 'Brian';
           $scope.user = {
             name: function(newName) {
              // Note that newName can be undefined for two reasons:
              // 1. Because it is called as a getter and thus called with no arguments
              // 2. Because the property should actually be set to undefined. This happens e.g. if the
              //    input is invalid
              return arguments.length ? (_name = newName) : _name;
             }
           };
         }]);
     </file>
 * </example>
 */
var ngModelDirective = ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    require: ['ngModel', '^?form', '^?ngModelOptions'],
    controller: NgModelController,
    // Prelink needs to run before any input directive
    // so that we can set the NgModelOptions in NgModelController
    // before anyone else uses it.
    priority: 1,
    compile: function ngModelCompile(element) {
      // Setup initial state of the control
      element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);

      return {
        pre: function ngModelPreLink(scope, element, attr, ctrls) {
          var modelCtrl = ctrls[0],
              formCtrl = ctrls[1] || modelCtrl.$$parentForm,
              optionsCtrl = ctrls[2];

          if (optionsCtrl) {
            modelCtrl.$options = optionsCtrl.$options;
          }

          modelCtrl.$$initGetterSetters();

          // notify others, especially parent forms
          formCtrl.$addControl(modelCtrl);

          attr.$observe('name', function(newValue) {
            if (modelCtrl.$name !== newValue) {
              modelCtrl.$$parentForm.$$renameControl(modelCtrl, newValue);
            }
          });

          scope.$on('$destroy', function() {
            modelCtrl.$$parentForm.$removeControl(modelCtrl);
          });
        },
        post: function ngModelPostLink(scope, element, attr, ctrls) {
          var modelCtrl = ctrls[0];
          if (modelCtrl.$options.getOption('updateOn')) {
            element.on(modelCtrl.$options.getOption('updateOn'), function(ev) {
              modelCtrl.$$debounceViewValueCommit(ev && ev.type);
            });
          }

          function setTouched() {
            modelCtrl.$setTouched();
          }

          element.on('blur', function() {
            if (modelCtrl.$touched) return;

            if ($rootScope.$$phase) {
              scope.$evalAsync(setTouched);
            } else {
              scope.$apply(setTouched);
            }
          });
        }
      };
    }
  };
}];
