'use strict';

/**
 * @ngdoc directive
 * @name ngInit
 * @restrict AC
 *
 * @description
 * The `ngInit` directive allows you to evaluate an expression in the
 * current scope.
 *
 * <div class="alert alert-danger">
 * This directive can be abused to add unnecessary amounts of logic into your templates.
 * There are only a few appropriate uses of `ngInit`, such as for aliasing special properties of
 * {@link ng.directive:ngRepeat `ngRepeat`}, as seen in the demo below; and for injecting data via
 * server side scripting. Besides these few cases, you should use {@link guide/controller controllers}
 * rather than `ngInit` to initialize values on a scope.
 * </div>
 *
 * <div class="alert alert-warning">
 * **Note**: If you have assignment in `ngInit` along with a {@link ng.$filter `filter`}, make
 * sure you have parentheses to ensure correct operator precedence:
 * <pre class="prettyprint">
 * `<div ng-init="test1 = ($index | toString)"></div>`
 * </pre>
 * </div>
 *
 * @priority 450
 *
 * @element ANY
 * @param {expression} ngInit {@link guide/expression Expression} to eval.
 *
 * @example
   <example module="initExample" name="ng-init">
     <file name="index.html">
   <script>
     angular.module('initExample', [])
       .controller('ExampleController', ['$scope', function($scope) {
         $scope.list = [['a', 'b'], ['c', 'd']];
       }]);
   </script>
   <div ng-controller="ExampleController">
     <div ng-repeat="innerList in list" ng-init="outerIndex = $index">
       <div ng-repeat="value in innerList" ng-init="innerIndex = $index">
          <span class="example-init">list[ {{outerIndex}} ][ {{innerIndex}} ] = {{value}};</span>
       </div>
     </div>
   </div>
     </file>
     <file name="protractor.js" type="protractor">
       it('should alias index positions', function() {
         var elements = element.all(by.css('.example-init'));
         expect(elements.get(0).getText()).toBe('list[ 0 ][ 0 ] = a;');
         expect(elements.get(1).getText()).toBe('list[ 0 ][ 1 ] = b;');
         expect(elements.get(2).getText()).toBe('list[ 1 ][ 0 ] = c;');
         expect(elements.get(3).getText()).toBe('list[ 1 ][ 1 ] = d;');
       });
     </file>
   </example>
 */
var ngInitDirective = ngDirective({
  priority: 450,
  compile: function() {
    return {
      pre: function(scope, element, attrs) {
        scope.$eval(attrs.ngInit);
      }
    };
  }
});
