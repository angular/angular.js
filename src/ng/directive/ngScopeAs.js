'use strict';

/**
 * @ngdoc directive
 * @name ngScopeAs
 * @restrict A
 *
 * @description
 * The `ngScopeAs` directive allows you to store the current scope as an alias so it can be
 * referenced from children scopes.
 *
 * This is particularly useful with nested {@link ng.directive:ngRepeat `ngRepeat`}, as seen
 * in the demo below. Use this directive to "bookmark" and later access scopes instead of
 * accessing other scopes using `$parent`.
 *
 * @element ANY
 * @param {expression} ngScopeAs {@link guide/expression Expression} the alias will be assigned to.
 *
 * @example
   <example module="scopeAsExample">
     <file name="index.html">
   <script>
     angular.module('scopeAsExample', [])
       .controller('ExampleController', ['$scope', function($scope) {
         $scope.list = [['a', 'b'], ['c', 'd']];
       }]);
   </script>
   <div ng-controller="ExampleController">
     <div ng-repeat="innerList in list" ng-scope-as="outerRepeat">
       <div ng-repeat="value in innerList" ng-scope-as="innerRepeat">
          <span class="example-scope-as">
            list[ {{outerRepeat.$index}} ][ {{innerRepeat.$index}} ] = {{value}};
          </span>
       </div>
     </div>
   </div>
     </file>
     <file name="protractor.js" type="protractor">
       it('should alias index positions', function() {
         var elements = element.all(by.css('.example-scope-as'));
         expect(elements.get(0).getText()).toBe('list[ 0 ][ 0 ] = a;');
         expect(elements.get(1).getText()).toBe('list[ 0 ][ 1 ] = b;');
         expect(elements.get(2).getText()).toBe('list[ 1 ][ 0 ] = c;');
         expect(elements.get(3).getText()).toBe('list[ 1 ][ 1 ] = d;');
       });
     </file>
   </example>
 */
var ngScopeAsDirective = ['$parse', function ($parse) {
  var ngScopeAsMinErr = minErr('ngScopeAs');
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var scopeAs = $parse(attrs.ngScopeAs);
      if (scopeAs.assign) {
        scopeAs.assign(scope, scope);
      } else {
        throw ngScopeAsMinErr('nonassign',
          'Expected scope alias to be an assignable expression but got \'{0}\'.',
          attrs.ngScopeAs);
      }
    }
  };
}];
