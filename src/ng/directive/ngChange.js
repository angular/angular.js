'use strict';

/**
 * @ngdoc directive
 * @name ngChange
 *
 * @description
 * Evaluate the given expression when the user changes the input.
 * The expression is evaluated immediately, unlike the JavaScript onchange event
 * which only triggers at the end of a change (usually, when the user leaves the
 * form element or presses the return key).
 *
 * The `ngChange` expression is only evaluated when a change in the input value causes
 * a new value to be committed to the model.
 *
 * It will not be evaluated:
 * * if the value returned from the `$parsers` transformation pipeline has not changed
 * * if the input has continued to be invalid since the model will stay `null`
 * * if the model is changed programmatically and not by a change to the input value
 *
 *
 * Note, this directive requires `ngModel` to be present.
 *
 * @element input
 * @param {expression} ngChange {@link guide/expression Expression} to evaluate upon change
 * in input value.
 *
 * @example
 * <example name="ngChange-directive" module="changeExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('changeExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.counter = 0;
 *           $scope.change = function() {
 *             $scope.counter++;
 *           };
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <input type="checkbox" ng-model="confirmed" ng-change="change()" id="ng-change-example1" />
 *       <input type="checkbox" ng-model="confirmed" id="ng-change-example2" />
 *       <label for="ng-change-example2">Confirmed</label><br />
 *       <tt>debug = {{confirmed}}</tt><br/>
 *       <tt>counter = {{counter}}</tt><br/>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     var counter = element(by.binding('counter'));
 *     var debug = element(by.binding('confirmed'));
 *
 *     it('should evaluate the expression if changing from view', function() {
 *       expect(counter.getText()).toContain('0');
 *
 *       element(by.id('ng-change-example1')).click();
 *
 *       expect(counter.getText()).toContain('1');
 *       expect(debug.getText()).toContain('true');
 *     });
 *
 *     it('should not evaluate the expression if changing from model', function() {
 *       element(by.id('ng-change-example2')).click();

 *       expect(counter.getText()).toContain('0');
 *       expect(debug.getText()).toContain('true');
 *     });
 *   </file>
 * </example>
 */
var ngChangeDirective = valueFn({
  restrict: 'A',
  require: 'ngModel',
  link: function(scope, element, attr, ctrl) {
    ctrl.$viewChangeListeners.push(function() {
      scope.$eval(attr.ngChange);
    });
  }
});
