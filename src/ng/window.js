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
             $scope.doGreeting = function() {
               $window.alert($scope.greeting);
               $scope.greeting = '';
             };
           }]);
       </script>
       <div ng-controller="ExampleController">
         <input type="text" ng-model="greeting" />
         <button ng-click="doGreeting()">ALERT</button>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       beforeEach(module(function($provide) {
         // Mock $window
         $provide.decorator('$window', function($delegate) {
           // Use the original window as a prototype for the mock in end-to-end
           // tests so that the parts of Angular that interact with the browser
           // via $window won't break.
           var decoratedWindow = Object.create($delegate);
           // The browser's implementation of the alert function blocks the test
           // runner, so replace it in the mock.
           decoratedWindow.alert = this.alert = jasmine.createSpy('alert');
           return decoratedWindow;
         });
       }));
       it('should clear the input field after alert', function() {
         element(by.model('greeting')).sendKeys('Hello, E2E Tests');
         element(':button').click();
         expect(this.alert).toHaveBeenCalled();
         expect(element(by.model('greeting')).val()).toBe('');
       });
     </file>
   </example>
 */
function $WindowProvider() {
  this.$get = valueFn(window);
}
