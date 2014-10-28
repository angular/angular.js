'use strict';

/**
 * @ngdoc service
 * @name $window
 *
 * @description
 * A reference to the browser's `window` object. While `window`
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In angular we always refer to it through the
 * `$window` service, so it may be overridden, removed or mocked for testing.
 *
 * Expressions, like the one defined for the `ngClick` directive in the example
 * below, are evaluated with respect to the current scope.  Therefore, there is
 * no risk of inadvertently coding in a dependency on a global value in such an
 * expression.
 *
 * @example
   <example module="windowExample">
     <file name="index.html">
       <script>
         angular.module('windowExample', [])
           .controller('ExampleController', ['$scope', '$window', function($scope, $window) {
             $scope.greeting = 'Hello, World!';
             $scope.doGreeting = function(greeting) {
               $window.alert(greeting);
             };
           }]);
       </script>
       <div ng-controller="ExampleController">
         <input type="text" ng-model="greeting" />
         <button ng-click="doGreeting(greeting)">ALERT</button>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
      it('should display the greeting in the input box', function() {
       element(by.model('greeting')).sendKeys('Hello, E2E Tests');
       // If we click the button it will block the test runner
       // element(':button').click();
      });
     </file>
   </example>
 */
function $WindowProvider() {
  this.$get = valueFn(window);
}
