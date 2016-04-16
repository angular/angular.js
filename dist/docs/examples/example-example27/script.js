(function(angular) {
  'use strict';
angular.module('expressionExample', [])
  .controller('ExampleController', ['$window', '$scope', function($window, $scope) {
    $scope.name = 'World';

    $scope.greet = function() {
      $window.alert('Hello ' + $scope.name);
    };
  }]);
})(window.angular);