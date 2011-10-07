'use strict';

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.form
 *
 * @description
 * Angular widget that creates a form scope using the
 * {@link angular.service.$formFactory $formFactory} API. The resulting form scope instance is
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
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl() {
           this.text = 'guest';
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
angularWidget('form', function(form){
  this.descend(true);
  this.directives(true);
  return annotate('$formFactory', function($formFactory, formElement) {
    var name = formElement.attr('name'),
        parentForm = $formFactory.forElement(formElement),
        form = $formFactory(parentForm);
    formElement.data('$form', form);
    formElement.bind('submit', function(event){
      event.preventDefault();
    });
    if (name) {
      this[name] = form;
    }
    watch('valid');
    watch('invalid');
    function watch(name) {
      form.$watch('$' + name, function(scope, value) {
        formElement[value ? 'addClass' : 'removeClass']('ng-' + name);
      });
    }
  });
});

angularWidget('ng:form', angularWidget('form'));
