'use strict';

/* global -nullFormCtrl, -SUBMITTED_CLASS, addSetValidityMethod: true
 */
var nullFormCtrl = {
  $addControl: noop,
  $$renameControl: nullFormRenameControl,
  $removeControl: noop,
  $setValidity: noop,
  $setDirty: noop,
  $setPristine: noop,
  $setSubmitted: noop
},
SUBMITTED_CLASS = 'ng-submitted';

function nullFormRenameControl(control, name) {
  control.$name = name;
}

/**
 * @ngdoc type
 * @name form.FormController
 *
 * @property {boolean} $pristine True if user has not interacted with the form yet.
 * @property {boolean} $dirty True if user has already interacted with the form.
 * @property {boolean} $valid True if all of the containing forms and controls are valid.
 * @property {boolean} $invalid True if at least one containing control or form is invalid.
 * @property {boolean} $submitted True if user has submitted the form even if its invalid.
 *
 * @property {Object} $error Is an object hash, containing references to controls or
 *  forms with failing validators, where:
 *
 *  - keys are validation tokens (error names),
 *  - values are arrays of controls or forms that have a failing validator for given error name.
 *
 *  Built-in validation tokens:
 *
 *  - `email`
 *  - `max`
 *  - `maxlength`
 *  - `min`
 *  - `minlength`
 *  - `number`
 *  - `pattern`
 *  - `required`
 *  - `url`
 *  - `date`
 *  - `datetimelocal`
 *  - `time`
 *  - `week`
 *  - `month`
 *
 * @description
 * `FormController` keeps track of all its controls and nested forms as well as the state of them,
 * such as being valid/invalid or dirty/pristine.
 *
 * Each {@link ng.directive:form form} directive creates an instance
 * of `FormController`.
 *
 */
//asks for $scope to fool the BC controller module
FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate'];
function FormController(element, attrs, $scope, $animate, $interpolate) {
  var form = this,
      controls = [];

  var parentForm = form.$$parentForm = element.parent().controller('form') || nullFormCtrl;

  // init state
  form.$error = {};
  form.$$success = {};
  form.$pending = undefined;
  form.$name = $interpolate(attrs.name || attrs.ngForm || '')($scope);
  form.$dirty = false;
  form.$pristine = true;
  form.$valid = true;
  form.$invalid = false;
  form.$submitted = false;

  parentForm.$addControl(form);

  /**
   * @ngdoc method
   * @name form.FormController#$rollbackViewValue
   *
   * @description
   * Rollback all form controls pending updates to the `$modelValue`.
   *
   * Updates may be pending by a debounced event or because the input is waiting for a some future
   * event defined in `ng-model-options`. This method is typically needed by the reset button of
   * a form that uses `ng-model-options` to pend updates.
   */
  form.$rollbackViewValue = function() {
    forEach(controls, function(control) {
      control.$rollbackViewValue();
    });
  };

  /**
   * @ngdoc method
   * @name form.FormController#$commitViewValue
   *
   * @description
   * Commit all form controls pending updates to the `$modelValue`.
   *
   * Updates may be pending by a debounced event or because the input is waiting for a some future
   * event defined in `ng-model-options`. This method is rarely needed as `NgModelController`
   * usually handles calling this in response to input events.
   */
  form.$commitViewValue = function() {
    forEach(controls, function(control) {
      control.$commitViewValue();
    });
  };

  /**
   * @ngdoc method
   * @name form.FormController#$addControl
   *
   * @description
   * Register a control with the form.
   *
   * Input elements using ngModelController do this automatically when they are linked.
   */
  form.$addControl = function(control) {
    // Breaking change - before, inputs whose name was "hasOwnProperty" were quietly ignored
    // and not added to the scope.  Now we throw an error.
    assertNotHasOwnProperty(control.$name, 'input');
    controls.push(control);

    if (control.$name) {
      form[control.$name] = control;
    }
  };

  // Private API: rename a form control
  form.$$renameControl = function(control, newName) {
    var oldName = control.$name;

    if (form[oldName] === control) {
      delete form[oldName];
    }
    form[newName] = control;
    control.$name = newName;
  };

  /**
   * @ngdoc method
   * @name form.FormController#$removeControl
   *
   * @description
   * Deregister a control from the form.
   *
   * Input elements using ngModelController do this automatically when they are destroyed.
   */
  form.$removeControl = function(control) {
    if (control.$name && form[control.$name] === control) {
      delete form[control.$name];
    }
    forEach(form.$pending, function(value, name) {
      form.$setValidity(name, null, control);
    });
    forEach(form.$error, function(value, name) {
      form.$setValidity(name, null, control);
    });
    forEach(form.$$success, function(value, name) {
      form.$setValidity(name, null, control);
    });

    arrayRemove(controls, control);
  };


  /**
   * @ngdoc method
   * @name form.FormController#$setValidity
   *
   * @description
   * Sets the validity of a form control.
   *
   * This method will also propagate to parent forms.
   */
  addSetValidityMethod({
    ctrl: this,
    $element: element,
    set: function(object, property, controller) {
      var list = object[property];
      if (!list) {
        object[property] = [controller];
      } else {
        var index = list.indexOf(controller);
        if (index === -1) {
          list.push(controller);
        }
      }
    },
    unset: function(object, property, controller) {
      var list = object[property];
      if (!list) {
        return;
      }
      arrayRemove(list, controller);
      if (list.length === 0) {
        delete object[property];
      }
    },
    parentForm: parentForm,
    $animate: $animate
  });

  /**
   * @ngdoc method
   * @name form.FormController#$setDirty
   *
   * @description
   * Sets the form to a dirty state.
   *
   * This method can be called to add the 'ng-dirty' class and set the form to a dirty
   * state (ng-dirty class). This method will also propagate to parent forms.
   */
  form.$setDirty = function() {
    $animate.removeClass(element, PRISTINE_CLASS);
    $animate.addClass(element, DIRTY_CLASS);
    form.$dirty = true;
    form.$pristine = false;
    parentForm.$setDirty();
  };

  /**
   * @ngdoc method
   * @name form.FormController#$setPristine
   *
   * @description
   * Sets the form to its pristine state.
   *
   * This method can be called to remove the 'ng-dirty' class and set the form to its pristine
   * state (ng-pristine class). This method will also propagate to all the controls contained
   * in this form.
   *
   * Setting a form back to a pristine state is often useful when we want to 'reuse' a form after
   * saving or resetting it.
   */
  form.$setPristine = function() {
    $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
    form.$dirty = false;
    form.$pristine = true;
    form.$submitted = false;
    forEach(controls, function(control) {
      control.$setPristine();
    });
  };

  /**
   * @ngdoc method
   * @name form.FormController#$setUntouched
   *
   * @description
   * Sets the form to its untouched state.
   *
   * This method can be called to remove the 'ng-touched' class and set the form controls to their
   * untouched state (ng-untouched class).
   *
   * Setting a form controls back to their untouched state is often useful when setting the form
   * back to its pristine state.
   */
  form.$setUntouched = function() {
    forEach(controls, function(control) {
      control.$setUntouched();
    });
  };

  /**
   * @ngdoc method
   * @name form.FormController#$setSubmitted
   *
   * @description
   * Sets the form to its submitted state.
   */
  form.$setSubmitted = function() {
    $animate.addClass(element, SUBMITTED_CLASS);
    form.$submitted = true;
    parentForm.$setSubmitted();
  };
}

/**
 * @ngdoc directive
 * @name ngForm
 * @restrict EAC
 *
 * @description
 * Nestable alias of {@link ng.directive:form `form`} directive. HTML
 * does not allow nesting of form elements. It is useful to nest forms, for example if the validity of a
 * sub-group of controls needs to be determined.
 *
 * Note: the purpose of `ngForm` is to group controls,
 * but not to be a replacement for the `<form>` tag with all of its capabilities
 * (e.g. posting to the server, ...).
 *
 * @param {string=} ngForm|name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 */

 /**
 * @ngdoc directive
 * @name form
 * @restrict E
 *
 * @description
 * Directive that instantiates
 * {@link form.FormController FormController}.
 *
 * If the `name` attribute is specified, the form controller is published onto the current scope under
 * this name.
 *
 * # Alias: {@link ng.directive:ngForm `ngForm`}
 *
 * In Angular, forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However, browsers do not allow nesting of `<form>` elements, so
 * Angular provides the {@link ng.directive:ngForm `ngForm`} directive which behaves identically to
 * `<form>` but can be nested.  This allows you to have nested forms, which is very useful when
 * using Angular validation directives in forms that are dynamically generated using the
 * {@link ng.directive:ngRepeat `ngRepeat`} directive. Since you cannot dynamically generate the `name`
 * attribute of input elements using interpolation, you have to wrap each set of repeated inputs in an
 * `ngForm` directive and nest these in an outer `form` element.
 *
 *
 * # CSS classes
 *  - `ng-valid` is set if the form is valid.
 *  - `ng-invalid` is set if the form is invalid.
 *  - `ng-pristine` is set if the form is pristine.
 *  - `ng-dirty` is set if the form is dirty.
 *  - `ng-submitted` is set if the form was submitted.
 *
 * Keep in mind that ngAnimate can detect each of these classes when added and removed.
 *
 *
 * # Submitting a form and preventing the default action
 *
 * Since the role of forms in client-side Angular applications is different than in classical
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full
 * page reload that sends the data to the server. Instead some javascript logic should be triggered
 * to handle the form submission in an application-specific way.
 *
 * For this reason, Angular prevents the default action (form submission to the server) unless the
 * `<form>` element has an `action` attribute specified.
 *
 * You can use one of the following two ways to specify what javascript method should be called when
 * a form is submitted:
 *
 * - {@link ng.directive:ngSubmit ngSubmit} directive on the form element
 * - {@link ng.directive:ngClick ngClick} directive on the first
  *  button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of the {@link ng.directive:ngSubmit ngSubmit}
 * or {@link ng.directive:ngClick ngClick} directives.
 * This is because of the following form submission rules in the HTML specification:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ngSubmit`)
 * - if a form has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ngClick`) *and* a submit handler on the enclosing form (`ngSubmit`)
 *
 * Any pending `ngModelOptions` changes will take place immediately when an enclosing form is
 * submitted. Note that `ngClick` events will occur before the model is updated. Use `ngSubmit`
 * to have access to the updated model.
 *
 * ## Animation Hooks
 *
 * Animations in ngForm are triggered when any of the associated CSS classes are added and removed.
 * These classes are: `.ng-pristine`, `.ng-dirty`, `.ng-invalid` and `.ng-valid` as well as any
 * other validations that are performed within the form. Animations in ngForm are similar to how
 * they work in ngClass and animations can be hooked into using CSS transitions, keyframes as well
 * as JS animations.
 *
 * The following example shows a simple way to utilize CSS transitions to style a form element
 * that has been rendered as invalid after it has been validated:
 *
 * <pre>
 * //be sure to include ngAnimate as a module to hook into more
 * //advanced animations
 * .my-form {
 *   transition:0.5s linear all;
 *   background: white;
 * }
 * .my-form.ng-invalid {
 *   background: red;
 *   color:white;
 * }
 * </pre>
 *
 * @example
    <example deps="angular-animate.js" animations="true" fixBase="true" module="formExample">
      <file name="index.html">
       <script>
         angular.module('formExample', [])
           .controller('FormController', ['$scope', function($scope) {
             $scope.userType = 'guest';
           }]);
       </script>
       <style>
        .my-form {
          -webkit-transition:all linear 0.5s;
          transition:all linear 0.5s;
          background: transparent;
        }
        .my-form.ng-invalid {
          background: red;
        }
       </style>
       <form name="myForm" ng-controller="FormController" class="my-form">
         userType: <input name="input" ng-model="userType" required>
         <span class="error" ng-show="myForm.input.$error.required">Required!</span><br>
         <tt>userType = {{userType}}</tt><br>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
        </form>
      </file>
      <file name="protractor.js" type="protractor">
        it('should initialize to model', function() {
          var userType = element(by.binding('userType'));
          var valid = element(by.binding('myForm.input.$valid'));

          expect(userType.getText()).toContain('guest');
          expect(valid.getText()).toContain('true');
        });

        it('should be invalid if empty', function() {
          var userType = element(by.binding('userType'));
          var valid = element(by.binding('myForm.input.$valid'));
          var userInput = element(by.model('userType'));

          userInput.clear();
          userInput.sendKeys('');

          expect(userType.getText()).toEqual('userType =');
          expect(valid.getText()).toContain('false');
        });
      </file>
    </example>
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 */
var formDirectiveFactory = function(isNgForm) {
  return ['$timeout', function($timeout) {
    var formDirective = {
      name: 'form',
      restrict: isNgForm ? 'EAC' : 'E',
      controller: FormController,
      compile: function ngFormCompile(formElement, attr) {
        // Setup initial state of the control
        formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);

        var nameAttr = attr.name ? 'name' : (isNgForm && attr.ngForm ? 'ngForm' : false);

        return {
          pre: function ngFormPreLink(scope, formElement, attr, controller) {
            // if `action` attr is not present on the form, prevent the default action (submission)
            if (!('action' in attr)) {
              // we can't use jq events because if a form is destroyed during submission the default
              // action is not prevented. see #1238
              //
              // IE 9 is not affected because it doesn't fire a submit event and try to do a full
              // page reload if the form was destroyed by submission of the form via a click handler
              // on a button in the form. Looks like an IE9 specific bug.
              var handleFormSubmission = function(event) {
                scope.$apply(function() {
                  controller.$commitViewValue();
                  controller.$setSubmitted();
                });

                event.preventDefault();
              };

              addEventListenerFn(formElement[0], 'submit', handleFormSubmission);

              // unregister the preventDefault listener so that we don't not leak memory but in a
              // way that will achieve the prevention of the default action.
              formElement.on('$destroy', function() {
                $timeout(function() {
                  removeEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                }, 0, false);
              });
            }

            var parentFormCtrl = controller.$$parentForm;

            if (nameAttr) {
              setter(scope, controller.$name, controller, controller.$name);
              attr.$observe(nameAttr, function(newValue) {
                if (controller.$name === newValue) return;
                setter(scope, controller.$name, undefined, controller.$name);
                parentFormCtrl.$$renameControl(controller, newValue);
                setter(scope, controller.$name, controller, controller.$name);
              });
            }
            formElement.on('$destroy', function() {
              parentFormCtrl.$removeControl(controller);
              if (nameAttr) {
                setter(scope, attr[nameAttr], undefined, controller.$name);
              }
              extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards
            });
          }
        };
      }
    };

    return formDirective;
  }];
};

var formDirective = formDirectiveFactory();
var ngFormDirective = formDirectiveFactory(true);
