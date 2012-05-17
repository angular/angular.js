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
 * @name angular.module.ng.$compileProvider.directive.ngClass
 *
 * @description
 * The `ngClass` allows you to set CSS class on HTML element dynamically by databinding an
 * expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the classes
 * new classes are added.
 *
 * @element ANY
 * @param {expression} ngClass {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values.
 *
 * @example
   <example>
     <file name="index.html">
      <input type="button" value="set" ng-click="myVar='my-class'">
      <input type="button" value="clear" ng-click="myVar=''">
      <br>
      <span ng-class="myVar">Sample Text</span>
     </file>
     <file name="style.css">
       .my-class {
         color: red;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class', function() {
         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').prop('className')).
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);
       });
     </file>
   </example>
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ngClassOdd
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link angular.module.ng.$compileProvider.directive.ngClass ngClass}, except it works in
 * conjunction with `ngRepeat` and takes affect only on odd (even) rows.
 *
 * This directive can be applied only within a scope of an
 * {@link angular.module.ng.$compileProvider.directive.ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassOdd {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example>
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}}
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassOddDirective = classDirective('Odd', 0);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ngClassEven
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` works exactly as
 * {@link angular.module.ng.$compileProvider.directive.ngClass ngClass}, except it works in
 * conjunction with `ngRepeat` and takes affect only on odd (even) rows.
 *
 * This directive can be applied only within a scope of an
 * {@link angular.module.ng.$compileProvider.directive.ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassEven {@link guide/dev_guide.expressions Expression} to eval. The
 *   result of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example>
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassEvenDirective = classDirective('Even', 1);
