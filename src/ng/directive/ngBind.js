'use strict';

/**
 * @ngdoc directive
 * @name ngBind
 * @restrict AC
 *
 * @description
 * The `ngBind` attribute tells Angular to replace the text content of the specified HTML element
 * with the value of a given expression, and to update the text content when the value of that
 * expression changes.
 *
 * Typically, you don't use `ngBind` directly, but instead you use the double curly markup like
 * `{{ expression }}` which is similar but less verbose.
 *
 * It is preferable to use `ngBind` instead of `{{ expression }}` if a template is momentarily
 * displayed by the browser in its raw state before Angular compiles it. Since `ngBind` is an
 * element attribute, it makes the bindings invisible to the user while the page is loading.
 *
 * An alternative solution to this problem would be using the
 * {@link ng.directive:ngCloak ngCloak} directive.
 *
 *
 * @element ANY
 * @param {expression} ngBind {@link guide/expression Expression} to evaluate.
 *
 * @example
 * Enter a name in the Live Preview text box; the greeting below the text box changes instantly.
   <example module="bindExample" name="ng-bind">
     <file name="index.html">
       <script>
         angular.module('bindExample', [])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.name = 'Whirled';
           }]);
       </script>
       <div ng-controller="ExampleController">
         <label>Enter name: <input type="text" ng-model="name"></label><br>
         Hello <span ng-bind="name"></span>!
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-bind', function() {
         var nameInput = element(by.model('name'));

         expect(element(by.binding('name')).getText()).toBe('Whirled');
         nameInput.clear();
         nameInput.sendKeys('world');
         expect(element(by.binding('name')).getText()).toBe('world');
       });
     </file>
   </example>
 */
var ngBindDirective = ['$compile', function($compile) {
  return {
    restrict: 'AC',
    compile: function ngBindCompile(templateElement) {
      $compile.$$addBindingClass(templateElement);
      return function ngBindLink(scope, element, attr) {
        $compile.$$addBindingInfo(element, attr.ngBind);
        element = element[0];
        scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
          element.textContent = stringify(value);
        });
      };
    }
  };
}];


/**
 * @ngdoc directive
 * @name ngBindTemplate
 *
 * @description
 * The `ngBindTemplate` directive specifies that the element
 * text content should be replaced with the interpolation of the template
 * in the `ngBindTemplate` attribute.
 * Unlike `ngBind`, the `ngBindTemplate` can contain multiple `{{` `}}`
 * expressions. This directive is needed since some HTML elements
 * (such as TITLE and OPTION) cannot contain SPAN elements.
 *
 * @element ANY
 * @param {string} ngBindTemplate template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @example
 * Try it here: enter text in text box and watch the greeting change.
   <example module="bindExample" name="ng-bind-template">
     <file name="index.html">
       <script>
         angular.module('bindExample', [])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.salutation = 'Hello';
             $scope.name = 'World';
           }]);
       </script>
       <div ng-controller="ExampleController">
        <label>Salutation: <input type="text" ng-model="salutation"></label><br>
        <label>Name: <input type="text" ng-model="name"></label><br>
        <pre ng-bind-template="{{salutation}} {{name}}!"></pre>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-bind', function() {
         var salutationElem = element(by.binding('salutation'));
         var salutationInput = element(by.model('salutation'));
         var nameInput = element(by.model('name'));

         expect(salutationElem.getText()).toBe('Hello World!');

         salutationInput.clear();
         salutationInput.sendKeys('Greetings');
         nameInput.clear();
         nameInput.sendKeys('user');

         expect(salutationElem.getText()).toBe('Greetings user!');
       });
     </file>
   </example>
 */
var ngBindTemplateDirective = ['$interpolate', '$compile', function($interpolate, $compile) {
  return {
    compile: function ngBindTemplateCompile(templateElement) {
      $compile.$$addBindingClass(templateElement);
      return function ngBindTemplateLink(scope, element, attr) {
        var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
        $compile.$$addBindingInfo(element, interpolateFn.expressions);
        element = element[0];
        attr.$observe('ngBindTemplate', function(value) {
          element.textContent = isUndefined(value) ? '' : value;
        });
      };
    }
  };
}];


/**
 * @ngdoc directive
 * @name ngBindHtml
 *
 * @description
 * Evaluates the expression and inserts the resulting HTML into the element in a secure way. By default,
 * the resulting HTML content will be sanitized using the {@link ngSanitize.$sanitize $sanitize} service.
 * To utilize this functionality, ensure that `$sanitize` is available, for example, by including {@link
 * ngSanitize} in your module's dependencies (not in core Angular). In order to use {@link ngSanitize}
 * in your module's dependencies, you need to include "angular-sanitize.js" in your application.
 *
 * You may also bypass sanitization for values you know are safe. To do so, bind to
 * an explicitly trusted value via {@link ng.$sce#trustAsHtml $sce.trustAsHtml}.  See the example
 * under {@link ng.$sce#show-me-an-example-using-sce- Strict Contextual Escaping (SCE)}.
 *
 * Note: If a `$sanitize` service is unavailable and the bound value isn't explicitly trusted, you
 * will have an exception (instead of an exploit.)
 *
 * @element ANY
 * @param {expression} ngBindHtml {@link guide/expression Expression} to evaluate.
 *
 * @example

   <example module="bindHtmlExample" deps="angular-sanitize.js" name="ng-bind-html">
     <file name="index.html">
       <div ng-controller="ExampleController">
        <p ng-bind-html="myHTML"></p>
       </div>
     </file>

     <file name="script.js">
       angular.module('bindHtmlExample', ['ngSanitize'])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.myHTML =
              'I am an <code>HTML</code>string with ' +
              '<a href="#">links!</a> and other <em>stuff</em>';
         }]);
     </file>

     <file name="protractor.js" type="protractor">
       it('should check ng-bind-html', function() {
         expect(element(by.binding('myHTML')).getText()).toBe(
             'I am an HTMLstring with links! and other stuff');
       });
     </file>
   </example>
 */
var ngBindHtmlDirective = ['$sce', '$parse', '$compile', function($sce, $parse, $compile) {
  return {
    restrict: 'A',
    compile: function ngBindHtmlCompile(tElement, tAttrs) {
      var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
      var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function sceValueOf(val) {
        // Unwrap the value to compare the actual inner safe value, not the wrapper object.
        return $sce.valueOf(val);
      });
      $compile.$$addBindingClass(tElement);

      return function ngBindHtmlLink(scope, element, attr) {
        $compile.$$addBindingInfo(element, attr.ngBindHtml);

        scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
          // The watched value is the unwrapped value. To avoid re-escaping, use the direct getter.
          var value = ngBindHtmlGetter(scope);
          element.html($sce.getTrustedHtml(value) || '');
        });
      };
    }
  };
}];
