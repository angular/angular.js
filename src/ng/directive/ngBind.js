'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-bind
 *
 * @description
 * The `ng-bind` attribute tells Angular to replace the text content of the specified HTML element
 * with the value of a given expression, and to update the text content when the value of that
 * expression changes.
 *
 * Typically, you don't use `ng-bind` directly, but instead you use the double curly markup like
 * `{{ expression }}` and let the Angular compiler transform it to
 * `<span ng-bind="expression"></span>` when the template is compiled.
 *
 * @element ANY
 * @param {expression} ng-bind {@link guide/dev_guide.expressions Expression} to evaluate.
 *
 * @example
 * Enter a name in the Live Preview text box; the greeting below the text box changes instantly.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.name = 'Whirled';
         }
       </script>
       <div ng-controller="Ctrl">
         Enter name: <input type="text" ng-model="name"><br>
         Hello <span ng-bind="name"></span>!
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind', function() {
         expect(using('.doc-example-live').binding('name')).toBe('Whirled');
         using('.doc-example-live').input('name').enter('world');
         expect(using('.doc-example-live').binding('name')).toBe('world');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindDirective = ngDirective(function(scope, element, attr) {
  element.addClass('ng-binding').data('$binding', attr.ngBind);
  scope.$watch(attr.ngBind, function(value) {
    element.text(value == undefined ? '' : value);
  });
});


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-bind-html-unsafe
 *
 * @description
 * Creates a binding that will innerHTML the result of evaluating the `expression` into the current
 * element. *The innerHTML-ed content will not be sanitized!* You should use this directive only if
 * {@link angular.module.ng.$compileProvider.directive.ng-bind-html ng-bind-html} directive is too
 * restrictive and when you absolutely trust the source of the content you are binding to.
 *
 * See {@link angular.module.ng.$sanitize $sanitize} docs for examples.
 *
 * @element ANY
 * @param {expression} ng-bind-html-unsafe {@link guide/dev_guide.expressions Expression} to evaluate.
 */
var ngBindHtmlUnsafeDirective = ngDirective(function(scope, element, attr) {
  element.addClass('ng-binding').data('$binding', attr.ngBindHtmlUnsafe);
  scope.$watch(attr.ngBindHtmlUnsafe, function(value) {
    element.html(value == undefined ? '' : value);
  });
});


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-bind-html
 *
 * @description
 * Creates a binding that will sanitize the result of evaluating the `expression` with the
 * {@link angular.module.ng.$sanitize $sanitize} service and innerHTML the result into the current
 * element.
 *
 * See {@link angular.module.ng.$sanitize $sanitize} docs for examples.
 *
 * @element ANY
 * @param {expression} ng-bind-html {@link guide/dev_guide.expressions Expression} to evaluate.
 */
var ngBindHtmlDirective = ['$sanitize', function($sanitize) {
  return function(scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.ngBindHtml);
    scope.$watch(attr.ngBindHtml, function(value) {
      if (value = $sanitize(value)) {
        element.html(value);
      }
    });
  }
}];


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-bind-template
 *
 * @description
 * The `ng-bind-template` attribute specifies that the element
 * text should be replaced with the template in ng-bind-template.
 * Unlike ng-bind the ng-bind-template can contain multiple `{{` `}}`
 * expressions. (This is required since some HTML elements
 * can not have SPAN elements such as TITLE, or OPTION to name a few.)
 *
 * @element ANY
 * @param {string} ng-bind-template template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @example
 * Try it here: enter text in text box and watch the greeting change.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.salutation = 'Hello';
           $scope.name = 'World';
         }
       </script>
       <div ng-controller="Ctrl">
        Salutation: <input type="text" ng-model="salutation"><br>
        Name: <input type="text" ng-model="name"><br>
        <pre ng-bind-template="{{salutation}} {{name}}!"></pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind', function() {
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Hello');
         expect(using('.doc-example-live').binding('name')).
           toBe('World');
         using('.doc-example-live').input('salutation').enter('Greetings');
         using('.doc-example-live').input('name').enter('user');
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Greetings');
         expect(using('.doc-example-live').binding('name')).
           toBe('user');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindTemplateDirective = ['$interpolate', function($interpolate) {
  return function(scope, element, attr) {
    // TODO: move this to scenario runner
    var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
    element.addClass('ng-binding').data('$binding', interpolateFn);
    attr.$observe('ngBindTemplate', function(value) {
      element.text(value);
    });
  }
}];
