'use strict';

function classDirective(name, selector) {
  name = 'ngClass' + name;
  return ngDirective(function(scope, element, attr) {
    scope.$watch(attr[name], function(newVal, oldVal) {
      if (selector === true || scope.$index % 2 === selector) {
        if (oldVal && (newVal !== oldVal)) {
           if (isObject(oldVal) && !isArray(oldVal))
             oldVal = map(oldVal, function(v, k) { if (v) return k });
           element.removeClass(isArray(oldVal) ? oldVal.join(' ') : oldVal);
         }
         if (isObject(newVal) && !isArray(newVal))
            newVal = map(newVal, function(v, k) { if (v) return k });
         if (newVal) element.addClass(isArray(newVal) ? newVal.join(' ') : newVal);      }
    }, true);
  });
}

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-class
 *
 * @description
 * The `ng-class` allows you to set CSS class on HTML element dynamically by databinding an
 * expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the classes
 * new classes are added.
 *
 * @element ANY
 * @param {expression} ng-class {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values.
 *
 * @example
   <doc:example>
     <doc:source>
      <input type="button" value="set" ng-click="myVar='ng-invalid'">
      <input type="button" value="clear" ng-click="myVar=''">
      <br>
      <span ng-class="myVar">Sample Text &nbsp;&nbsp;&nbsp;&nbsp;</span>
     </doc:source>
     <doc:scenario>
       it('should check ng-class', function() {
         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/ng-invalid/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').prop('className')).
           toMatch(/ng-invalid/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/ng-invalid/);
       });
     </doc:scenario>
   </doc:example>
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-class-odd
 *
 * @description
 * The `ng-class-odd` and `ng-class-even` works exactly as
 * {@link angular.module.ng.$compileProvider.directive.ng-class ng-class}, except it works in conjunction with `ng-repeat` and
 * takes affect only on odd (even) rows.
 *
 * This directive can be applied only within a scope of an
 * {@link angular.module.ng.$compileProvider.directive.ng-repeat ng-repeat}.
 *
 * @element ANY
 * @param {expression} ng-class-odd {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <doc:example>
     <doc:source>
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'ng-format-negative'"
                 ng-class-even="'ng-invalid'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </doc:source>
     <doc:scenario>
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/ng-format-negative/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/ng-invalid/);
       });
     </doc:scenario>
   </doc:example>
 */
var ngClassOddDirective = classDirective('Odd', 0);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-class-even
 *
 * @description
 * The `ng-class-odd` and `ng-class-even` works exactly as
 * {@link angular.module.ng.$compileProvider.directive.ng-class ng-class}, except it works in
 * conjunction with `ng-repeat` and takes affect only on odd (even) rows.
 *
 * This directive can be applied only within a scope of an
 * {@link angular.module.ng.$compileProvider.directive.ng-repeat ng-repeat}.
 *
 * @element ANY
 * @param {expression} ng-class-even {@link guide/dev_guide.expressions Expression} to eval. The
 *   result of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <doc:example>
     <doc:source>
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </doc:source>
     <doc:scenario>
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </doc:scenario>
   </doc:example>
 */
var ngClassEvenDirective = classDirective('Even', 1);
