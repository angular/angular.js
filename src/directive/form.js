'use strict';


var nullFormCtrl = {
  $addControl: noop,
  $removeControl: noop,
  $setValidity: noop
}

/**
 * @ngdoc object
 * @name angular.module.ng.$compileProvider.directive.form.FormController
 *
 * @property {boolean} $pristine True if user has not interacted with the form yet.
 * @property {boolean} $dirty True if user has already interacted with the form.
 * @property {boolean} $valid True if all of the containg forms and controls are valid.
 * @property {boolean} $invalid True if at least one containing control or form is invalid.
 *
 * @property {Object} $error Is an object hash, containing references to all invalid controls or
 *  forms, where:
 *
 *  - keys are validation tokens (error names) — such as `REQUIRED`, `URL` or `EMAIL`),
 *  - values are arrays of controls or forms that are invalid with given error.
 *
 * @description
 * `FormController` keeps track of all its controls and nested forms as well as state of them,
 * such as being valid/invalid or dirty/pristine.
 *
 * Each {@link angular.module.ng.$compileProvider.directive.form form} directive creates an instance
 * of `FormController`.
 *
 */
FormController.$inject = ['name', '$element', '$attrs'];
function FormController(name, element, attrs) {
  var form = this,
      parentForm = element.parent().inheritedData('$formController') || nullFormCtrl,
      errors = form.$error = {};

  // init state
  form.$name = attrs.name;
  form.$dirty = false;
  form.$pristine = true;
  form.$valid = true;
  form.$invalid = false;

  // publish the form into scope
  name(this);

  parentForm.$addControl(form);

  form.$addControl = function(control) {
    if (control.$name && !form.hasOwnProperty(control.$name)) {
      form[control.$name] = control;
    }
  }

  form.$removeControl = function(control) {
    if (control.$name && form[control.$name] === control) {
      delete form[control.$name];
    }
    forEach(errors, cleanupControlErrors, control);
  };

  form.$setValidity = function(validationToken, isValid, control) {
    if (isValid) {
      cleanupControlErrors(errors[validationToken], validationToken, control);

      if (equals(errors, {})) {
        form.$valid = true;
        form.$invalid = false;
      }
    } else {
      addControlError(validationToken, control);

      form.$valid = false;
      form.$invalid = true;
    }
  };

  form.$setDirty = function() {
    form.$dirty = true;
    form.$pristine = false;
  }

  function cleanupControlErrors(queue, validationToken, control) {
    if (queue) {
      control = control || this; // so that we can be used in forEach;
      arrayRemove(queue, control);
      if (!queue.length) {
        delete errors[validationToken];
        parentForm.$setValidity(validationToken, true, form);
      }
    }
  }

  function addControlError(validationToken, control) {
    var queue = errors[validationToken];
    if (queue) {
      if (includes(queue, control)) return;
    } else {
      errors[validationToken] = queue = [];
      parentForm.$setValidity(validationToken, false, form);
    }
    queue.push(control);
  }
}


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.form
 * @restrict EA
 *
 * @description
 * Directive that instantiates
 * {@link angular.module.ng.$compileProvider.directive.form.FormController FormController}.
 *
 * If `name` attribute is specified, the form controller is published onto the current scope under
 * this name.
 *
 * # Alias: `ng-form`
 *
 * In angular forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However browsers do not allow nesting of `<form>` elements, for this
 * reason angular provides `<ng-form>` alias which behaves identical to `<form>` but allows
 * element nesting.
 *
 *
 * # CSS classes
 *  - `ng-valid` Is set if the form is valid.
 *  - `ng-invalid` Is set if the form is invalid.
 *  - `ng-pristine` Is set if the form is pristine.
 *  - `ng-dirty` Is set if the form is dirty.
 *
 *
 * # Submitting a form and preventing default action
 *
 * Since the role of forms in client-side Angular applications is different than in classical
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full
 * page reload that sends the data to the server. Instead some javascript logic should be triggered
 * to handle the form submission in application specific way.
 *
 * For this reason, Angular prevents the default action (form submission to the server) unless the
 * `<form>` element has an `action` attribute specified.
 *
 * You can use one of the following two ways to specify what javascript method should be called when
 * a form is submitted:
 *
 * - ng-submit on the form element (add link to ng-submit)
 * - ng-click on the first button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of ng-submit or ng-click. This is
 * because of the following form submission rules coming from the html spec:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ng-submit`)
 * - if a form has has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ng-click`) *and* a submit handler on the enclosing form (`ng-submit`)
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.userType = 'guest';
         }
       </script>
       <form name="myForm" ng-controller="Ctrl">
         userType: <input name="input" ng-model="userType" required>
         <span class="error" ng-show="myForm.input.$error.REQUIRED">Required!</span><br>
         <tt>userType = {{userType}}</tt><br>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('userType')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('userType').enter('');
         expect(binding('userType')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var formDirective = [function() {
  return {
    name: 'form',
    restrict: 'E',
    inject: {
      name: 'accessor'
    },
    controller: FormController,
    compile: function() {
      return {
        pre: function(scope, formElement, attr, controller) {
          formElement.bind('submit', function(event) {
            if (!attr.action) event.preventDefault();
          });

          forEach(['valid', 'invalid', 'dirty', 'pristine'], function(name) {
            scope.$watch(function() {
              return controller['$' + name];
            }, function(value) {
              formElement[value ? 'addClass' : 'removeClass']('ng-' + name);
            });
          });

          var parentFormCtrl = formElement.parent().inheritedData('$formController');
          if (parentFormCtrl) {
            formElement.bind('$destroy', function() {
              parentFormCtrl.$removeControl(controller);
              if (attr.name) delete scope[attr.name];
              extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards
            });
          }
        }
      };
    }
  };
}];
