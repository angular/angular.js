'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.form
 *
 * @scope
 * @description
 * Angular widget that creates a form scope using the
 * {@link angular.module.ng.$formFactory $formFactory} API. The resulting form scope instance is
 * attached to the DOM element using the jQuery `.data()` method under the `$form` key.
 * See {@link guide/dev_guide.forms forms} on detailed discussion of forms and widgets.
 *
 *
 * # Alias: `ng:form`
 *
 * In angular forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However browsers do not allow nesting of `<form>` elements, for this
 * reason angular provides `<ng:form>` alias which behaves identical to `<form>` but allows
 * element nesting.
 *
 *
 * # Submitting a form and preventing default action
 *
 * Since the role of forms in client-side Angular applications is different than in old-school
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
 * @param {string=} name Name of the form.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.text = 'guest';
         }
       </script>
       <div ng:controller="Ctrl">
         <form name="myForm">
           text: <input type="text" name="input" ng:model="text" required>
           <span class="error" ng:show="myForm.text.$error.REQUIRED">Required!</span>
         </form>
         <tt>text = {{text}}</tt><br/>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.REQUIRED = {{!!myForm.$error.REQUIRED}}</tt><br/>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('text')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('text').enter('');
         expect(binding('text')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var ngFormDirective = ['$formFactory', function($formFactory) {
  return {
    restrict: 'E',
    compile: function() {
      return {
        pre: function(scope, formElement, attr) {
          var name = attr.name,
            parentForm = $formFactory.forElement(formElement),
            form = $formFactory(parentForm);
          formElement.data('$form', form);
          formElement.bind('submit', function(event){
            if (!attr.action) event.preventDefault();
          });
          if (name) {
            scope[name] = form;
          }
          watch('valid');
          watch('invalid');
          function watch(name) {
            form.$watch('$' + name, function(value) {
              formElement[value ? 'addClass' : 'removeClass']('ng-' + name);
            });
          }
        }
      };
    }
  };
}];
