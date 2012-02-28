'use strict';


/**
 * @ngdoc object
 * @name angular.module.ng.$compileProvider.directive.form.FormController
 *
 * @property {boolean} pristine True if user has not interacted with the form yet.
 * @property {boolean} dirty True if user has already interacted with the form.
 * @property {boolean} valid True if all of the containg widgets are valid.
 * @property {boolean} invalid True if at least one containing widget is invalid.
 *
 * @property {Object} error Is an object hash, containing references to all invalid widgets, where
 *
 *  - keys are error ids (such as `REQUIRED`, `URL` or `EMAIL`),
 *  - values are arrays of widgets that are invalid with given error.
 *
 * @description
 * `FormController` keeps track of all its widgets as well as state of them form, such as being valid/invalid or dirty/pristine.
 * 
 * Each {@link angular.module.ng.$compileProvider.directive.form form} directive creates an instance
 * of `FormController`.
 *
 */
FormController.$inject = ['$scope', 'name'];
function FormController($scope, name) {
  var form = this,
      errors = form.error = {};

  // publish the form into scope
  name(this);

  $scope.$on('$destroy', function(event, widget) {
    if (!widget) return;

    if (widget.widgetId) {
      delete form[widget.widgetId];
    }
    forEach(errors, removeWidget, widget);
  });

  $scope.$on('$valid', function(event, error, widget) {
    removeWidget(errors[error], error, widget);

    if (equals(errors, {})) {
      form.valid = true;
      form.invalid = false;
    }
  });

  $scope.$on('$invalid', function(event, error, widget) {
    addWidget(error, widget);

    form.valid = false;
    form.invalid = true;
  });

  $scope.$on('$viewTouch', function() {
    form.dirty = true;
    form.pristine = false;
  });

  // init state
  form.dirty = false;
  form.pristine = true;
  form.valid = true;
  form.invalid = false;

  function removeWidget(queue, errorKey, widget) {
    if (queue) {
      widget = widget || this; // so that we can be used in forEach;
      for (var i = 0, length = queue.length; i < length; i++) {
        if (queue[i] === widget) {
          queue.splice(i, 1);
          if (!queue.length) {
            delete errors[errorKey];
          }
        }
      }
    }
  }

  function addWidget(errorKey, widget) {
    var queue = errors[errorKey];
    if (queue) {
      for (var i = 0, length = queue.length; i < length; i++) {
        if (queue[i] === widget) {
          return;
        }
      }
    } else {
      errors[errorKey] = queue = [];
    }
    queue.push(widget);
  }
}

/**
 * @ngdoc function
 * @name angular.module.ng.$compileProvider.directive.form.FormController#registerWidget
 * @methodOf angular.module.ng.$compileProvider.directive.form.FormController
 * @function
 *
 * @param {Object} widget Widget to register (controller of a widget)
 * @param {string=} alias Name alias of the widget.
 *                        (If specified, widget will be accesible as a form property)
 *
 * @description
 *
 */
FormController.prototype.registerWidget = function(widget, alias) {
  if (alias && !this.hasOwnProperty(alias)) {
    widget.widgetId = alias;
    this[alias] = widget;
  }
};


/**
 * @ngdoc widget
 * @name angular.module.ng.$compileProvider.directive.form
 *
 * @scope
 * @description
 * Directive that instantiates
 * {@link angular.module.ng.$compileProvider.directive.form.FormController FormController}.
 *
 * If `name` attribute is specified, the controller is published to the scope as well.
 *
 * # Alias: `ng:form`
 *
 * In angular forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However browsers do not allow nesting of `<form>` elements, for this
 * reason angular provides `<ng:form>` alias which behaves identical to `<form>` but allows
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
 * - ng:submit on the form element (add link to ng:submit)
 * - ng:click on the first button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of ng:submit or ng:click. This is
 * because of the following form submission rules coming from the html spec:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ng:submit`)
 * - if a form has has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ng:click`) *and* a submit handler on the enclosing form (`ng:submit`)
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.text = 'guest';
         }
       </script>
       <form name="myForm" ng:controller="Ctrl">
         text: <input type="text" name="input" ng:model="text" required>
         <span class="error" ng:show="myForm.input.error.REQUIRED">Required!</span>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.valid = {{myForm.input.valid}}</tt><br/>
         <tt>myForm.input.error = {{myForm.input.error}}</tt><br/>
         <tt>myForm.valid = {{myForm.valid}}</tt><br/>
         <tt>myForm.error.REQUIRED = {{!!myForm.error.REQUIRED}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('text')).toEqual('guest');
         expect(binding('myForm.input.valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('text').enter('');
         expect(binding('text')).toEqual('');
         expect(binding('myForm.input.valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var ngFormDirective = [function() {
  return {
    name: 'form',
    restrict: 'E',
    scope: true,
    inject: {
      name: 'accessor'
    },
    controller: FormController,
    compile: function() {
      return {
        pre: function(scope, formElement, attr, controller) {
          formElement.data('$form', controller);
          formElement.bind('submit', function(event) {
            if (!attr.action) event.preventDefault();
          });

          forEach(['valid', 'invalid', 'dirty', 'pristine'], function(name) {
            scope.$watch(function() {
              return controller[name];
            }, function(value) {
              formElement[value ? 'addClass' : 'removeClass']('ng-' + name);
            });
          });
        }
      };
    }
  };
}];
