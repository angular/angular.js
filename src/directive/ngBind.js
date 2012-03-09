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
         Enter name: <input type="text" ng-model="name"> <br/>
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
        Salutation: <input type="text" ng-model="salutation"><br/>
        Name: <input type="text" ng-model="name"><br/>
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


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-bind-attr
 *
 * @description
 * The `ng-bind-attr` attribute specifies that a
 * {@link guide/dev_guide.templates.databinding databinding}  should be created between a particular
 * element attribute and a given expression. Unlike `ng-bind`, the `ng-bind-attr` contains one or
 * more JSON key value pairs; each pair specifies an attribute and the
 * {@link guide/dev_guide.expressions expression} to which it will be mapped.
 *
 * Instead of writing `ng-bind-attr` statements in your HTML, you can use double-curly markup to
 * specify an <tt ng-non-bindable>{{expression}}</tt> for the value of an attribute.
 * At compile time, the attribute is translated into an
 * `<span ng-bind-attr="{attr:expression}"></span>`.
 *
 * The following HTML snippet shows how to specify `ng-bind-attr`:
 * <pre>
 *   <a ng-bind-attr='{"href":"http://www.google.com/search?q={{query}}"}'>Google</a>
 * </pre>
 *
 * This is cumbersome, so as we mentioned using double-curly markup is a prefered way of creating
 * this binding:
 * <pre>
 *   <a href="http://www.google.com/search?q={{query}}">Google</a>
 * </pre>
 *
 * During compilation, the template with attribute markup gets translated to the ng-bind-attr form
 * mentioned above.
 *
 * _Note_: You might want to consider using {@link angular.module.ng.$compileProvider.directive.ng-href ng-href} instead of
 * `href` if the binding is present in the main application template (`index.html`) and you want to
 * make sure that a user is not capable of clicking on raw/uncompiled link.
 *
 *
 * @element ANY
 * @param {string} ng-bind-attr one or more JSON key-value pairs representing
 *    the attributes to replace with expressions. Each key matches an attribute
 *    which needs to be replaced. Each value is a text template of
 *    the attribute with the embedded
 *    <tt ng-non-bindable>{{expression}}</tt>s. Any number of
 *    key-value pairs can be specified.
 *
 * @example
 * Enter a search string in the Live Preview text box and then click "Google". The search executes instantly.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.query = 'AngularJS';
         }
       </script>
       <div ng-controller="Ctrl">
        Google for:
        <input type="text" ng-model="query"/>
        <a ng-bind-attr='{"href":"http://www.google.com/search?q={{query}}"}'>
          Google
        </a> (ng-bind-attr) |
        <a href="http://www.google.com/search?q={{query}}">Google</a>
        (curly binding in attribute val)
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind-attr', function() {
         expect(using('.doc-example-live').element('a').attr('href')).
           toBe('http://www.google.com/search?q=AngularJS');
         using('.doc-example-live').input('query').enter('google');
         expect(using('.doc-example-live').element('a').attr('href')).
           toBe('http://www.google.com/search?q=google');
       });
     </doc:scenario>
   </doc:example>
 */

var ngBindAttrDirective = ['$interpolate', function($interpolate) {
  return function(scope, element, attr) {
    var lastValue = {};
    var interpolateFns = {};
    scope.$watch(function() {
      var values = scope.$eval(attr.ngBindAttr);
      for(var key in values) {
        var exp = values[key],
            fn = (interpolateFns[exp] ||
              (interpolateFns[values[key]] = $interpolate(exp))),
            value = fn(scope);
        if (lastValue[key] !== value) {
          attr.$set(key, lastValue[key] = value);
        }
      }
    });
  }
}];
