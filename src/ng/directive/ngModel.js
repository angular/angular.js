'use strict';

/* global VALID_CLASS: true,
  INVALID_CLASS: true,
  PRISTINE_CLASS: true,
  DIRTY_CLASS: true,
  UNTOUCHED_CLASS: true,
  TOUCHED_CLASS: true,
*/

var VALID_CLASS = 'ng-valid',
    INVALID_CLASS = 'ng-invalid',
    PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty',
    UNTOUCHED_CLASS = 'ng-untouched',
    TOUCHED_CLASS = 'ng-touched',
    PENDING_CLASS = 'ng-pending';


var $ngModelMinErr = new minErr('ngModel');

/**
 * @ngdoc type
 * @name ngModel.NgModelController
 *
 * @property {string} $viewValue Actual string value in the view.
 * @property {*} $modelValue The value in the model that the control is bound to.
 * @property {Array.<Function>} $parsers Array of functions to execute, as a pipeline, whenever
       the control reads value from the DOM. The functions are called in array order, each passing
       its return value through to the next. The last return value is forwarded to the
       {@link ngModel.NgModelController#$validators `$validators`} collection.

Parsers are used to sanitize / convert the {@link ngModel.NgModelController#$viewValue
`$viewValue`}.

Returning `undefined` from a parser means a parse error occurred. In that case,
no {@link ngModel.NgModelController#$validators `$validators`} will run and the `ngModel`
will be set to `undefined` unless {@link ngModelOptions `ngModelOptions.allowInvalid`}
is set to `true`. The parse error is stored in `ngModel.$error.parse`.

 *
 * @property {Array.<Function>} $formatters Array of functions to execute, as a pipeline, whenever
       the model value changes. The functions are called in reverse array order, each passing the value through to the
       next. The last return value is used as the actual DOM value.
       Used to format / convert values for display in the control.
 * ```js
 * function formatter(value) {
 *   if (value) {
 *     return value.toUpperCase();
 *   }
 * }
 * ngModel.$formatters.push(formatter);
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
 * Angular provides this DOM logic for most {@link input `input`} elements.
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
                if ( attrs.stripBr && html == '<br>' ) {
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
       <textarea ng-model="userContent"></textarea>
      </form>
    </file>
    <file name="protractor.js" type="protractor">
    it('should data-bind and become invalid', function() {
      if (browser.params.browser == 'safari' || browser.params.browser == 'firefox') {
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
var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate', '$timeout', '$rootScope', '$q', '$interpolate',
    function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
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


  var parsedNgModel = $parse($attr.ngModel),
      parsedNgModelAssign = parsedNgModel.assign,
      ngModelGet = parsedNgModel,
      ngModelSet = parsedNgModelAssign,
      pendingDebounce = null,
      parserValid,
      ctrl = this;

  this.$$setOptions = function(options) {
    ctrl.$options = options;
    if (options && options.getterSetter) {
      var invokeModelGetter = $parse($attr.ngModel + '()'),
          invokeModelSetter = $parse($attr.ngModel + '($$$p)');

      ngModelGet = function($scope) {
        var modelValue = parsedNgModel($scope);
        if (isFunction(modelValue)) {
          modelValue = invokeModelGetter($scope);
        }
        return modelValue;
      };
      ngModelSet = function($scope, newValue) {
        if (isFunction(parsedNgModel($scope))) {
          invokeModelSetter($scope, {$$$p: ctrl.$modelValue});
        } else {
          parsedNgModelAssign($scope, ctrl.$modelValue);
        }
      };
    } else if (!parsedNgModel.assign) {
      throw $ngModelMinErr('nonassign', "Expression '{0}' is non-assignable. Element: {1}",
          $attr.ngModel, startingTag($element));
    }
  };

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
   * `$modelValue` and `$viewValue` are actually different from their previous value. If `$modelValue`
   * or `$viewValue` are objects (rather than a string or number) then `$render()` will not be
   * invoked if you only change a property on the objects.
   */
  this.$render = noop;

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
  this.$isEmpty = function(value) {
    return isUndefined(value) || value === '' || value === null || value !== value;
  };

  var parentForm = $element.inheritedData('$formController') || nullFormCtrl,
      currentValidationRunId = 0;

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
   *        class and can be bound to as  `{{someForm.someControl.$error.myError}}` .
   * @param {boolean} isValid Whether the current state is valid (true), invalid (false), pending (undefined),
   *                          or skipped (null). Pending is used for unfulfilled `$asyncValidators`.
   *                          Skipped is used by Angular when validators do not run because of parse errors and
   *                          when `$asyncValidators` do not run because any of the `$validators` failed.
   */
  addSetValidityMethod({
    ctrl: this,
    $element: $element,
    set: function(object, property) {
      object[property] = true;
    },
    unset: function(object, property) {
      delete object[property];
    },
    parentForm: parentForm,
    $animate: $animate
  });

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
  this.$setPristine = function() {
    ctrl.$dirty = false;
    ctrl.$pristine = true;
    $animate.removeClass($element, DIRTY_CLASS);
    $animate.addClass($element, PRISTINE_CLASS);
  };

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
  this.$setDirty = function() {
    ctrl.$dirty = true;
    ctrl.$pristine = false;
    $animate.removeClass($element, PRISTINE_CLASS);
    $animate.addClass($element, DIRTY_CLASS);
    parentForm.$setDirty();
  };

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
  this.$setUntouched = function() {
    ctrl.$touched = false;
    ctrl.$untouched = true;
    $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS);
  };

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
  this.$setTouched = function() {
    ctrl.$touched = true;
    ctrl.$untouched = false;
    $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS);
  };

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$rollbackViewValue
   *
   * @description
   * Cancel an update and reset the input element's value to prevent an update to the `$modelValue`,
   * which may be caused by a pending debounced event or because the input is waiting for a some
   * future event.
   *
   * If you have an input that uses `ng-model-options` to set up debounced events or events such
   * as blur you can have a situation where there is a period when the `$viewValue`
   * is out of synch with the ngModel's `$modelValue`.
   *
   * In this case, you can run into difficulties if you try to update the ngModel's `$modelValue`
   * programmatically before these debounced/future events have resolved/occurred, because Angular's
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
   *       $scope.resetWithCancel = function(e) {
   *         if (e.keyCode == 27) {
   *           $scope.myForm.myInput1.$rollbackViewValue();
   *           $scope.myValue = '';
   *         }
   *       };
   *       $scope.resetWithoutCancel = function(e) {
   *         if (e.keyCode == 27) {
   *           $scope.myValue = '';
   *         }
   *       };
   *     }]);
   *   </file>
   *   <file name="index.html">
   *     <div ng-controller="CancelUpdateController">
   *       <p>Try typing something in each input.  See that the model only updates when you
   *          blur off the input.
   *        </p>
   *        <p>Now see what happens if you start typing then press the Escape key</p>
   *
   *       <form name="myForm" ng-model-options="{ updateOn: 'blur' }">
   *         <p>With $rollbackViewValue()</p>
   *         <input name="myInput1" ng-model="myValue" ng-keydown="resetWithCancel($event)"><br/>
   *         myValue: "{{ myValue }}"
   *
   *         <p>Without $rollbackViewValue()</p>
   *         <input name="myInput2" ng-model="myValue" ng-keydown="resetWithoutCancel($event)"><br/>
   *         myValue: "{{ myValue }}"
   *       </form>
   *     </div>
   *   </file>
   * </example>
   */
  this.$rollbackViewValue = function() {
    $timeout.cancel(pendingDebounce);
    ctrl.$viewValue = ctrl.$$lastCommittedViewValue;
    ctrl.$render();
  };

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
   * modelValue, i.e. either the last parsed value or the last value set from the scope.
   */
  this.$validate = function() {
    // ignore $validate before model is initialized
    if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
      return;
    }

    var viewValue = ctrl.$$lastCommittedViewValue;
    // Note: we use the $$rawModelValue as $modelValue might have been
    // set to undefined during a view -> model update that found validation
    // errors. We can't parse the view here, since that could change
    // the model although neither viewValue nor the model on the scope changed
    var modelValue = ctrl.$$rawModelValue;

    var prevValid = ctrl.$valid;
    var prevModelValue = ctrl.$modelValue;

    var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;

    ctrl.$$runValidators(modelValue, viewValue, function(allValid) {
      // If there was no change in validity, don't update the model
      // This prevents changing an invalid modelValue to undefined
      if (!allowInvalid && prevValid !== allValid) {
        // Note: Don't check ctrl.$valid here, as we could have
        // external validators (e.g. calculated on the server),
        // that just call $setValidity and need the model value
        // to calculate their validity.
        ctrl.$modelValue = allValid ? modelValue : undefined;

        if (ctrl.$modelValue !== prevModelValue) {
          ctrl.$$writeModelToScope();
        }
      }
    });

  };

  this.$$runValidators = function(modelValue, viewValue, doneCallback) {
    currentValidationRunId++;
    var localValidationRunId = currentValidationRunId;

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
      var errorKey = ctrl.$$parserName || 'parse';
      if (parserValid === undefined) {
        setValidity(errorKey, null);
      } else {
        if (!parserValid) {
          forEach(ctrl.$validators, function(v, name) {
            setValidity(name, null);
          });
          forEach(ctrl.$asyncValidators, function(v, name) {
            setValidity(name, null);
          });
        }
        // Set the parse error last, to prevent unsetting it, should a $validators key == parserName
        setValidity(errorKey, parserValid);
        return parserValid;
      }
      return true;
    }

    function processSyncValidators() {
      var syncValidatorsValid = true;
      forEach(ctrl.$validators, function(validator, name) {
        var result = validator(modelValue, viewValue);
        syncValidatorsValid = syncValidatorsValid && result;
        setValidity(name, result);
      });
      if (!syncValidatorsValid) {
        forEach(ctrl.$asyncValidators, function(v, name) {
          setValidity(name, null);
        });
        return false;
      }
      return true;
    }

    function processAsyncValidators() {
      var validatorPromises = [];
      var allValid = true;
      forEach(ctrl.$asyncValidators, function(validator, name) {
        var promise = validator(modelValue, viewValue);
        if (!isPromiseLike(promise)) {
          throw $ngModelMinErr("$asyncValidators",
            "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
        }
        setValidity(name, undefined);
        validatorPromises.push(promise.then(function() {
          setValidity(name, true);
        }, function(error) {
          allValid = false;
          setValidity(name, false);
        }));
      });
      if (!validatorPromises.length) {
        validationDone(true);
      } else {
        $q.all(validatorPromises).then(function() {
          validationDone(allValid);
        }, noop);
      }
    }

    function setValidity(name, isValid) {
      if (localValidationRunId === currentValidationRunId) {
        ctrl.$setValidity(name, isValid);
      }
    }

    function validationDone(allValid) {
      if (localValidationRunId === currentValidationRunId) {

        doneCallback(allValid);
      }
    }
  };

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
  this.$commitViewValue = function() {
    var viewValue = ctrl.$viewValue;

    $timeout.cancel(pendingDebounce);

    // If the view value has not changed then we should just exit, except in the case where there is
    // a native validator on the element. In this case the validation state may have changed even though
    // the viewValue has stayed empty.
    if (ctrl.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !ctrl.$$hasNativeValidators)) {
      return;
    }
    ctrl.$$lastCommittedViewValue = viewValue;

    // change to dirty
    if (ctrl.$pristine) {
      this.$setDirty();
    }
    this.$$parseAndValidate();
  };

  this.$$parseAndValidate = function() {
    var viewValue = ctrl.$$lastCommittedViewValue;
    var modelValue = viewValue;
    parserValid = isUndefined(modelValue) ? undefined : true;

    if (parserValid) {
      for (var i = 0; i < ctrl.$parsers.length; i++) {
        modelValue = ctrl.$parsers[i](modelValue);
        if (isUndefined(modelValue)) {
          parserValid = false;
          break;
        }
      }
    }
    if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
      // ctrl.$modelValue has not been touched yet...
      ctrl.$modelValue = ngModelGet($scope);
    }
    var prevModelValue = ctrl.$modelValue;
    var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
    ctrl.$$rawModelValue = modelValue;

    if (allowInvalid) {
      ctrl.$modelValue = modelValue;
      writeToModelIfNeeded();
    }

    // Pass the $$lastCommittedViewValue here, because the cached viewValue might be out of date.
    // This can happen if e.g. $setViewValue is called from inside a parser
    ctrl.$$runValidators(modelValue, ctrl.$$lastCommittedViewValue, function(allValid) {
      if (!allowInvalid) {
        // Note: Don't check ctrl.$valid here, as we could have
        // external validators (e.g. calculated on the server),
        // that just call $setValidity and need the model value
        // to calculate their validity.
        ctrl.$modelValue = allValid ? modelValue : undefined;
        writeToModelIfNeeded();
      }
    });

    function writeToModelIfNeeded() {
      if (ctrl.$modelValue !== prevModelValue) {
        ctrl.$$writeModelToScope();
      }
    }
  };

  this.$$writeModelToScope = function() {
    ngModelSet($scope, ctrl.$modelValue);
    forEach(ctrl.$viewChangeListeners, function(listener) {
      try {
        listener();
      } catch (e) {
        $exceptionHandler(e);
      }
    });
  };

  /**
   * @ngdoc method
   * @name ngModel.NgModelController#$setViewValue
   *
   * @description
   * Update the view value.
   *
   * This method should be called when an input directive want to change the view value; typically,
   * this is done from within a DOM event handler.
   *
   * For example {@link ng.directive:input input} calls it when the value of the input changes and
   * {@link ng.directive:select select} calls it when an option is selected.
   *
   * If the new `value` is an object (rather than a string or a number), we should make a copy of the
   * object before passing it to `$setViewValue`.  This is because `ngModel` does not perform a deep
   * watch of objects, it only looks for a change of identity. If you only change the property of
   * the object then ngModel will not realise that the object has changed and will not invoke the
   * `$parsers` and `$validators` pipelines.
   *
   * For this reason, you should not change properties of the copy once it has been passed to
   * `$setViewValue`. Otherwise you may cause the model value on the scope to change incorrectly.
   *
   * When this method is called, the new `value` will be staged for committing through the `$parsers`
   * and `$validators` pipelines. If there are no special {@link ngModelOptions} specified then the staged
   * value sent directly for processing, finally to be applied to `$modelValue` and then the
   * **expression** specified in the `ng-model` attribute.
   *
   * Lastly, all the registered change listeners, in the `$viewChangeListeners` list, are called.
   *
   * In case the {@link ng.directive:ngModelOptions ngModelOptions} directive is used with `updateOn`
   * and the `default` trigger is not listed, all those actions will remain pending until one of the
   * `updateOn` events is triggered on the DOM element.
   * All these actions will be debounced if the {@link ng.directive:ngModelOptions ngModelOptions}
   * directive is used with a custom debounce for this particular event.
   *
   * Note that calling this function does not trigger a `$digest`.
   *
   * @param {string} value Value from the view.
   * @param {string} trigger Event that triggered the update.
   */
  this.$setViewValue = function(value, trigger) {
    ctrl.$viewValue = value;
    if (!ctrl.$options || ctrl.$options.updateOnDefault) {
      ctrl.$$debounceViewValueCommit(trigger);
    }
  };

  this.$$debounceViewValueCommit = function(trigger) {
    var debounceDelay = 0,
        options = ctrl.$options,
        debounce;

    if (options && isDefined(options.debounce)) {
      debounce = options.debounce;
      if (isNumber(debounce)) {
        debounceDelay = debounce;
      } else if (isNumber(debounce[trigger])) {
        debounceDelay = debounce[trigger];
      } else if (isNumber(debounce['default'])) {
        debounceDelay = debounce['default'];
      }
    }

    $timeout.cancel(pendingDebounce);
    if (debounceDelay) {
      pendingDebounce = $timeout(function() {
        ctrl.$commitViewValue();
      }, debounceDelay);
    } else if ($rootScope.$$phase) {
      ctrl.$commitViewValue();
    } else {
      $scope.$apply(function() {
        ctrl.$commitViewValue();
      });
    }
  };

  // model -> value
  // Note: we cannot use a normal scope.$watch as we want to detect the following:
  // 1. scope value is 'a'
  // 2. user enters 'b'
  // 3. ng-change kicks in and reverts scope value to 'a'
  //    -> scope value did not change since the last digest as
  //       ng-change executes in apply phase
  // 4. view should be changed back to 'a'
  $scope.$watch(function ngModelWatch() {
    var modelValue = ngModelGet($scope);

    // if scope model value and ngModel value are out of sync
    // TODO(perf): why not move this to the action fn?
    if (modelValue !== ctrl.$modelValue &&
       // checks for NaN is needed to allow setting the model to NaN when there's an asyncValidator
       (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)
    ) {
      ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
      parserValid = undefined;

      var formatters = ctrl.$formatters,
          idx = formatters.length;

      var viewValue = modelValue;
      while (idx--) {
        viewValue = formatters[idx](viewValue);
      }
      if (ctrl.$viewValue !== viewValue) {
        ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
        ctrl.$render();

        ctrl.$$runValidators(modelValue, viewValue, noop);
      }
    }

    return modelValue;
  });
}];


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
 * - Setting related css classes on the element (`ng-valid`, `ng-invalid`, `ng-dirty`, `ng-pristine`, `ng-touched`, `ng-untouched`) including animations.
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
 *
 * Keep in mind that ngAnimate can detect each of these classes when added and removed.
 *
 * ## Animation Hooks
 *
 * Animations within models are triggered when any of the associated CSS classes are added and removed
 * on the input element which is attached to the model. These classes are: `.ng-pristine`, `.ng-dirty`,
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
 * <example deps="angular-animate.js" animations="true" fixBase="true" module="inputExample">
     <file name="index.html">
       <script>
        angular.module('inputExample', [])
          .controller('ExampleController', ['$scope', function($scope) {
            $scope.val = '1';
          }]);
       </script>
       <style>
         .my-input {
           -webkit-transition:all linear 0.5s;
           transition:all linear 0.5s;
           background: transparent;
         }
         .my-input.ng-invalid {
           color:white;
           background: red;
         }
       </style>
       Update input to see transitions when valid/invalid.
       Integer is a valid value.
       <form name="testForm" ng-controller="ExampleController">
         <input ng-model="val" ng-pattern="/^\d+$/" name="anim" class="my-input" />
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
 * **Best Practice:** It's best to keep getters fast because Angular is likely to call them more
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
           Name:
           <input type="text" name="userName"
                  ng-model="user.name"
                  ng-model-options="{ getterSetter: true }" />
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
               if (angular.isDefined(newName)) {
                 _name = newName;
               }
               return _name;
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
              formCtrl = ctrls[1] || nullFormCtrl;

          modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);

          // notify others, especially parent forms
          formCtrl.$addControl(modelCtrl);

          attr.$observe('name', function(newValue) {
            if (modelCtrl.$name !== newValue) {
              formCtrl.$$renameControl(modelCtrl, newValue);
            }
          });

          scope.$on('$destroy', function() {
            formCtrl.$removeControl(modelCtrl);
          });
        },
        post: function ngModelPostLink(scope, element, attr, ctrls) {
          var modelCtrl = ctrls[0];
          if (modelCtrl.$options && modelCtrl.$options.updateOn) {
            element.on(modelCtrl.$options.updateOn, function(ev) {
              modelCtrl.$$debounceViewValueCommit(ev && ev.type);
            });
          }

          element.on('blur', function(ev) {
            if (modelCtrl.$touched) return;

            if ($rootScope.$$phase) {
              scope.$evalAsync(modelCtrl.$setTouched);
            } else {
              scope.$apply(modelCtrl.$setTouched);
            }
          });
        }
      };
    }
  };
}];



'use strict';

var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;

/**
 * @ngdoc directive
 * @name ngModelOptions
 *
 * @description
 * Allows tuning how model updates are done. Using `ngModelOptions` you can specify a custom list of
 * events that will trigger a model update and/or a debouncing delay so that the actual update only
 * takes place when a timer expires; this timer will be reset after another change takes place.
 *
 * Given the nature of `ngModelOptions`, the value displayed inside input fields in the view might
 * be different from the value in the actual model. This means that if you update the model you
 * should also invoke {@link ngModel.NgModelController `$rollbackViewValue`} on the relevant input field in
 * order to make sure it is synchronized with the model and that any debounced action is canceled.
 *
 * The easiest way to reference the control's {@link ngModel.NgModelController `$rollbackViewValue`}
 * method is by making sure the input is placed inside a form that has a `name` attribute. This is
 * important because `form` controllers are published to the related scope under the name in their
 * `name` attribute.
 *
 * Any pending changes will take place immediately when an enclosing form is submitted via the
 * `submit` event. Note that `ngClick` events will occur before the model is updated. Use `ngSubmit`
 * to have access to the updated model.
 *
 * `ngModelOptions` has an effect on the element it's declared on and its descendants.
 *
 * @param {Object} ngModelOptions options to apply to the current model. Valid keys are:
 *   - `updateOn`: string specifying which event should the input be bound to. You can set several
 *     events using an space delimited list. There is a special event called `default` that
 *     matches the default events belonging of the control.
 *   - `debounce`: integer value which contains the debounce model update value in milliseconds. A
 *     value of 0 triggers an immediate update. If an object is supplied instead, you can specify a
 *     custom value for each event. For example:
 *     `ng-model-options="{ updateOn: 'default blur', debounce: {'default': 500, 'blur': 0} }"`
 *   - `allowInvalid`: boolean value which indicates that the model can be set with values that did
 *     not validate correctly instead of the default behavior of setting the model to undefined.
 *   - `getterSetter`: boolean value which determines whether or not to treat functions bound to
       `ngModel` as getters/setters.
 *   - `timezone`: Defines the timezone to be used to read/write the `Date` instance in the model for
 *     `<input type="date">`, `<input type="time">`, ... . It understands UTC/GMT and the
 *     continental US time zone abbreviations, but for general use, use a time zone offset, for
 *     example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
 *     If not specified, the timezone of the browser will be used.
 *
 * @example

  The following example shows how to override immediate updates. Changes on the inputs within the
  form will update the model only when the control loses focus (blur event). If `escape` key is
  pressed while the input field is focused, the value is reset to the value in the current model.

  <example name="ngModelOptions-directive-blur" module="optionsExample">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <form name="userForm">
          Name:
          <input type="text" name="userName"
                 ng-model="user.name"
                 ng-model-options="{ updateOn: 'blur' }"
                 ng-keyup="cancel($event)" /><br />

          Other data:
          <input type="text" ng-model="user.data" /><br />
        </form>
        <pre>user.name = <span ng-bind="user.name"></span></pre>
      </div>
    </file>
    <file name="app.js">
      angular.module('optionsExample', [])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.user = { name: 'say', data: '' };

          $scope.cancel = function(e) {
            if (e.keyCode == 27) {
              $scope.userForm.userName.$rollbackViewValue();
            }
          };
        }]);
    </file>
    <file name="protractor.js" type="protractor">
      var model = element(by.binding('user.name'));
      var input = element(by.model('user.name'));
      var other = element(by.model('user.data'));

      it('should allow custom events', function() {
        input.sendKeys(' hello');
        input.click();
        expect(model.getText()).toEqual('say');
        other.click();
        expect(model.getText()).toEqual('say hello');
      });

      it('should $rollbackViewValue when model changes', function() {
        input.sendKeys(' hello');
        expect(input.getAttribute('value')).toEqual('say hello');
        input.sendKeys(protractor.Key.ESCAPE);
        expect(input.getAttribute('value')).toEqual('say');
        other.click();
        expect(model.getText()).toEqual('say');
      });
    </file>
  </example>

  This one shows how to debounce model changes. Model will be updated only 1 sec after last change.
  If the `Clear` button is pressed, any debounced action is canceled and the value becomes empty.

  <example name="ngModelOptions-directive-debounce" module="optionsExample">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <form name="userForm">
          Name:
          <input type="text" name="userName"
                 ng-model="user.name"
                 ng-model-options="{ debounce: 1000 }" />
          <button ng-click="userForm.userName.$rollbackViewValue(); user.name=''">Clear</button><br />
        </form>
        <pre>user.name = <span ng-bind="user.name"></span></pre>
      </div>
    </file>
    <file name="app.js">
      angular.module('optionsExample', [])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.user = { name: 'say' };
        }]);
    </file>
  </example>

  This one shows how to bind to getter/setters:

  <example name="ngModelOptions-directive-getter-setter" module="getterSetterExample">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <form name="userForm">
          Name:
          <input type="text" name="userName"
                 ng-model="user.name"
                 ng-model-options="{ getterSetter: true }" />
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
              return angular.isDefined(newName) ? (_name = newName) : _name;
            }
          };
        }]);
    </file>
  </example>
 */
var ngModelOptionsDirective = function() {
  return {
    restrict: 'A',
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      var that = this;
      this.$options = copy($scope.$eval($attrs.ngModelOptions));
      // Allow adding/overriding bound events
      if (this.$options.updateOn !== undefined) {
        this.$options.updateOnDefault = false;
        // extract "default" pseudo-event from list of events that can trigger a model update
        this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function() {
          that.$options.updateOnDefault = true;
          return ' ';
        }));
      } else {
        this.$options.updateOnDefault = true;
      }
    }]
  };
};



// helper methods
function addSetValidityMethod(context) {
  var ctrl = context.ctrl,
      $element = context.$element,
      classCache = {},
      set = context.set,
      unset = context.unset,
      parentForm = context.parentForm,
      $animate = context.$animate;

  classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS));

  ctrl.$setValidity = setValidity;

  function setValidity(validationErrorKey, state, controller) {
    if (state === undefined) {
      createAndSet('$pending', validationErrorKey, controller);
    } else {
      unsetAndCleanup('$pending', validationErrorKey, controller);
    }
    if (!isBoolean(state)) {
      unset(ctrl.$error, validationErrorKey, controller);
      unset(ctrl.$$success, validationErrorKey, controller);
    } else {
      if (state) {
        unset(ctrl.$error, validationErrorKey, controller);
        set(ctrl.$$success, validationErrorKey, controller);
      } else {
        set(ctrl.$error, validationErrorKey, controller);
        unset(ctrl.$$success, validationErrorKey, controller);
      }
    }
    if (ctrl.$pending) {
      cachedToggleClass(PENDING_CLASS, true);
      ctrl.$valid = ctrl.$invalid = undefined;
      toggleValidationCss('', null);
    } else {
      cachedToggleClass(PENDING_CLASS, false);
      ctrl.$valid = isObjectEmpty(ctrl.$error);
      ctrl.$invalid = !ctrl.$valid;
      toggleValidationCss('', ctrl.$valid);
    }

    // re-read the state as the set/unset methods could have
    // combined state in ctrl.$error[validationError] (used for forms),
    // where setting/unsetting only increments/decrements the value,
    // and does not replace it.
    var combinedState;
    if (ctrl.$pending && ctrl.$pending[validationErrorKey]) {
      combinedState = undefined;
    } else if (ctrl.$error[validationErrorKey]) {
      combinedState = false;
    } else if (ctrl.$$success[validationErrorKey]) {
      combinedState = true;
    } else {
      combinedState = null;
    }

    toggleValidationCss(validationErrorKey, combinedState);
    parentForm.$setValidity(validationErrorKey, combinedState, ctrl);
  }

  function createAndSet(name, value, controller) {
    if (!ctrl[name]) {
      ctrl[name] = {};
    }
    set(ctrl[name], value, controller);
  }

  function unsetAndCleanup(name, value, controller) {
    if (ctrl[name]) {
      unset(ctrl[name], value, controller);
    }
    if (isObjectEmpty(ctrl[name])) {
      ctrl[name] = undefined;
    }
  }

  function cachedToggleClass(className, switchValue) {
    if (switchValue && !classCache[className]) {
      $animate.addClass($element, className);
      classCache[className] = true;
    } else if (!switchValue && classCache[className]) {
      $animate.removeClass($element, className);
      classCache[className] = false;
    }
  }

  function toggleValidationCss(validationErrorKey, isValid) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';

    cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === true);
    cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === false);
  }
}

function isObjectEmpty(obj) {
  if (obj) {
    for (var prop in obj) {
      return false;
    }
  }
  return true;
}
